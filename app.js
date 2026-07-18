// app.js — Entry ES module and screen state machine (Seed -> Quiz -> Results).
//
// Owns the in-memory Session, loads the bundled question bank, wires DOM
// events, and orchestrates validation -> sampler -> marker -> render -> share.
// Also drives the "Ready for offline" indicator from the service worker's
// readiness message. No persistence beyond the service-worker asset cache.

import { parseSeed } from './validation.js';
import { generatePaper } from './sampler.js';
import { mark } from './marker.js';
import { renderSeedScreen, renderQuiz, renderResults } from './render.js';
import { buildSummary, shareWhatsApp, shareTelegram, copyToClipboard } from './share.js';

// ---------------------------------------------------------------------------
// In-memory state (Session). Held only here; nothing is persisted by app.js.
// ---------------------------------------------------------------------------

/** @type {{schemaVersion:number, subject:string, questions:Array}|null} */
let bank = null;

/**
 * Session { seed, paper, answers, startedAt, submittedAt }
 * @type {{seed:number, paper:Array, answers:Record<string,string|number|null>, startedAt:number, submittedAt?:number}|null}
 */
let session = null;

/** Last computed Result, kept so the share buttons can rebuild the summary. */
let lastResult = null;

/** Guards against double-marking (submit button + form submit both firing). */
let resultsShown = false;

const PAPER_SIZE = 20;

// ---------------------------------------------------------------------------
// Screen state machine
// ---------------------------------------------------------------------------

function showScreen(id) {
  const screens = document.querySelectorAll('.screen');
  for (const el of screens) {
    const active = el.id === id;
    el.classList.toggle('screen--active', active);
    el.classList.toggle('screen--hidden', !active);
  }
  // Return the player to the top when moving between screens.
  try { window.scrollTo(0, 0); } catch (_) { /* non-DOM env */ }
}

// ---------------------------------------------------------------------------
// Question bank loading
// ---------------------------------------------------------------------------

async function loadBank() {
  const url = new URL('./questions.json', import.meta.url);
  const res = await fetch(url);
  if (!res.ok) throw new Error('Could not load the question bank (' + res.status + ').');
  return res.json();
}

/**
 * Derive an exam-proportional topic -> count map that sums to exactly
 * PAPER_SIZE, with every count <= that topic's pool. Deterministic (depends
 * only on the bank, never on the seed) so every device builds the same buckets
 * and therefore keys the sampler identically.
 */
function buildTopicBuckets(theBank, target) {
  const topics = [];
  const pool = Object.create(null);
  for (const q of theBank.questions) {
    if (!(q.topic in pool)) { pool[q.topic] = 0; topics.push(q.topic); }
    pool[q.topic] += 1;
  }

  const totalPool = topics.reduce((s, t) => s + pool[t], 0);
  const want = Math.min(target, totalPool);

  // Proportional floor (largest-remainder) allocation, capped at each pool.
  const rem = Object.create(null);
  const count = Object.create(null);
  let assigned = 0;
  for (const t of topics) {
    const exact = (want * pool[t]) / totalPool;
    const floor = Math.min(pool[t], Math.floor(exact));
    count[t] = floor;
    rem[t] = exact - floor;
    assigned += floor;
  }

  // Distribute the remainder to the largest fractional parts, stable by the
  // topic's first-appearance order, never exceeding a topic's pool.
  const order = topics.slice().sort((a, b) =>
    (rem[b] - rem[a]) || (topics.indexOf(a) - topics.indexOf(b)));
  let left = want - assigned;
  while (left > 0) {
    let progressed = false;
    for (const t of order) {
      if (left === 0) break;
      if (count[t] < pool[t]) { count[t] += 1; left -= 1; progressed = true; }
    }
    if (!progressed) break;
  }

  return count;
}

// ---------------------------------------------------------------------------
// Flow: Seed -> Quiz
// ---------------------------------------------------------------------------

function readSeedInput() {
  const input = document.getElementById('seed-input');
  return input ? input.value : '';
}

function setSeedError(msg) {
  const el = document.getElementById('seed-error');
  if (el) el.textContent = msg || '';
}

function handleStart() {
  if (!bank) {
    setSeedError('The question bank is still loading. Try again in a moment.');
    return;
  }

  const parsed = parseSeed(readSeedInput());
  if ('error' in parsed) {
    setSeedError(parsed.error);
    return;
  }
  setSeedError('');

  let paper;
  try {
    const buckets = buildTopicBuckets(bank, PAPER_SIZE);
    paper = generatePaper(parsed.seed, bank, buckets);
  } catch (err) {
    setSeedError('Could not build a paper from this bank: ' + (err && err.message ? err.message : String(err)));
    return;
  }

  session = {
    seed: parsed.seed,
    paper,
    answers: Object.create(null),
    startedAt: Date.now(),
  };
  lastResult = null;
  resultsShown = false;

  renderQuiz(paper);
  showScreen('screen-quiz');
}

// ---------------------------------------------------------------------------
// Flow: Quiz -> Results
// ---------------------------------------------------------------------------

/**
 * Read the current answer for every question straight from the quiz form.
 * MCQ options share name="q-<id>" (value = option index); short-numeric inputs
 * use the same name with a single field. form.elements['q-<id>'].value returns
 * the checked radio's value or the single input's value, or '' when blank.
 */
function collectAnswers(paper) {
  const form = document.getElementById('quiz-form');
  const answers = Object.create(null);
  for (const q of paper) {
    let value = null;
    if (form && form.elements) {
      const field = form.elements['q-' + q.id];
      if (field != null && field.value != null && field.value !== '') {
        value = field.value;
      }
    }
    answers[q.id] = value;
  }
  return answers;
}

function handleSubmit() {
  if (!session || resultsShown) return;
  resultsShown = true;

  const answers = collectAnswers(session.paper);
  session.answers = answers;
  session.submittedAt = Date.now();
  const elapsedMs = Math.max(0, session.submittedAt - session.startedAt);

  lastResult = mark(session.paper, answers, elapsedMs);

  renderResults(lastResult, session.seed);
  showScreen('screen-results');
}

// ---------------------------------------------------------------------------
// Flow: Share
// ---------------------------------------------------------------------------

function flashButton(btn, msg) {
  if (!btn) return;
  const original = btn.dataset.label != null ? btn.dataset.label : btn.textContent;
  btn.dataset.label = original;
  btn.textContent = msg;
  window.setTimeout(() => {
    if (btn.dataset.label != null) btn.textContent = btn.dataset.label;
  }, 1600);
}

function handleShareClick(btn) {
  if (!session || !lastResult) return;
  const text = buildSummary(session.seed, lastResult);

  if (btn.id === 'share-whatsapp') {
    shareWhatsApp(text);
  } else if (btn.id === 'share-telegram') {
    shareTelegram(text);
  } else if (btn.id === 'copy-summary') {
    copyToClipboard(text).then((ok) => {
      flashButton(btn, ok ? 'Copied' : 'Copy failed');
    }).catch(() => {
      flashButton(btn, 'Copy failed');
    });
  }
}

// ---------------------------------------------------------------------------
// "Ready for offline" indicator, driven by service-worker readiness.
// ---------------------------------------------------------------------------

function markOfflineReady() {
  const el = document.getElementById('offline-indicator');
  if (!el) return;
  el.classList.add('offline-indicator--ready');
  el.setAttribute('data-ready', 'true');
  const label = el.querySelector('.offline-indicator__label');
  if (label) {
    label.textContent = 'Ready for offline. You can go without wifi now.';
  }
}

function wireServiceWorker() {
  // A CustomEvent path (some SWs dispatch on the window via a client script).
  window.addEventListener('sw:ready', markOfflineReady);

  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SW_READY') markOfflineReady();
  });

  navigator.serviceWorker.register('sw.js').then((reg) => {
    // If a worker is already controlling this page, the shell is cached.
    if (navigator.serviceWorker.controller) markOfflineReady();
    // Otherwise wait for the registration to become active.
    navigator.serviceWorker.ready.then(() => markOfflineReady()).catch(() => {});
    void reg;
  }).catch(() => {
    // Registration failing (e.g. file:// or private mode) leaves the indicator
    // in its default "not yet ready" state; the app still works online.
  });
}

// ---------------------------------------------------------------------------
// Event wiring (delegated so it works whether controls are static in the shell
// or rendered dynamically by render.js).
// ---------------------------------------------------------------------------

function wireEvents() {
  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!target || !target.closest) return;

    if (target.closest('#start-btn')) {
      event.preventDefault();
      handleStart();
      return;
    }
    if (target.closest('#submit-btn')) {
      event.preventDefault();
      handleSubmit();
      return;
    }
    const shareBtn = target.closest('#share-whatsapp, #share-telegram, #copy-summary');
    if (shareBtn) {
      event.preventDefault();
      handleShareClick(shareBtn);
    }
  });

  // Guard against a full-page reload if #submit-btn is a form submit button.
  document.addEventListener('submit', (event) => {
    if (event.target && event.target.id === 'quiz-form') {
      event.preventDefault();
      handleSubmit();
    }
  });

  // Reflect MCQ selection onto its .option wrapper for styling; harmless if
  // render.js already toggles it (idempotent, keyed off the checked state).
  document.addEventListener('change', (event) => {
    const el = event.target;
    if (el && el.classList && el.classList.contains('option__input') && el.name) {
      const group = document.querySelectorAll(
        '.option__input[name="' + (window.CSS && CSS.escape ? CSS.escape(el.name) : el.name) + '"]');
      group.forEach((inp) => {
        const wrap = inp.closest ? inp.closest('.option') : null;
        if (wrap) wrap.classList.toggle('option--selected', inp.checked);
      });
    }
  });
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

async function boot() {
  renderSeedScreen();
  wireEvents();
  wireServiceWorker();
  showScreen('screen-seed');

  try {
    bank = await loadBank();
  } catch (err) {
    setSeedError(err && err.message ? err.message : 'Could not load the question bank.');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
