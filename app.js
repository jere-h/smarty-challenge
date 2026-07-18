// app.js — Entry ES module and screen state machine (Seed -> Quiz -> Results).
//
// Owns the in-memory Session, loads the bundled question bank, wires DOM
// events, and orchestrates validation -> sampler -> marker -> render -> share.
// Also drives the "Ready for offline" indicator from service-worker readiness
// AND live navigator.onLine transitions, and autosaves/resumes the in-progress
// paper (and the most recently completed one) via storage.js — the only
// module besides storage.js that ever names localStorage indirectly (through
// storage.js's exports; app.js never calls localStorage itself).

import { parseSeed } from './validation.js';
import { generatePaper } from './sampler.js';
import { mark } from './marker.js';
import { renderSeedScreen, renderQuiz, renderResults } from './render.js';
import { buildSummary, shareWhatsApp, shareTelegram, copyToClipboard } from './share.js';
import { loadState, saveState, clearSession } from './storage.js';

// ---------------------------------------------------------------------------
// In-memory state (Session). The paper itself lives only here — it is never
// persisted (storage.js keeps just the seed + answers; the paper is
// regenerated deterministically from the seed on restore).
// ---------------------------------------------------------------------------

/** @type {{schemaVersion:number, bankVersion?:number, subject:string, questions:Array}|null} */
let bank = null;

/**
 * Session { seed, paper, answers, startedAt, submittedAt }
 * @type {{seed:number, paper:Array, answers:Record<string,string|number|null>, startedAt:number|null, submittedAt?:number}|null}
 */
let session = null;

/** Last computed Result, kept so the share buttons can rebuild the summary. */
let lastResult = null;

/** Guards against double-marking (submit button + form submit both firing). */
let resultsShown = false;

/**
 * B2 — submit state machine's UI-facing half: `idle` (form as usual) or
 * `confirming` (the inline "N unanswered" guard is showing). The terminal
 * "marked" state is `resultsShown` above — there is no separate flag for it,
 * so there is exactly one place that latches "already marked".
 * @type {'idle'|'confirming'}
 */
let submitState = 'idle';

/**
 * B1 — ONE module-level interval handle for the quiz timer. Always
 * `clearInterval`d before any `setInterval` (never two live timers).
 * @type {number|null}
 */
let timerHandle = null;

/** The persisted State (Section 1 contract) — the in-memory mirror of localStorage. */
let persisted = loadState();

/** Debounce handle for autosave writes (<=1 write/500ms, Invariant per A2). */
let saveTimer = null;
const SAVE_DEBOUNCE_MS = 500;

/** Service-worker readiness, combined with navigator.onLine to drive the A1 4-state indicator. */
let swReady = false;

const PAPER_SIZE = 20;
const RESTORE_WINDOW_MS = 30 * 60 * 1000; // 30 minutes (A2 results-restore window)

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

// A6 — the bank's own version, displayed wherever the seed is displayed so a
// cached device holding a stale bank can be spotted before phones compare.
function getBankVersion() {
  return bank && bank.bankVersion != null ? bank.bankVersion : 1;
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

// Build the SAME paper a fresh Start would (reused by handleStart, session
// resume, and results-restore) — no duplicated sampling logic (A2).
function buildPaperForSeed(seedNum) {
  if (!bank) throw new Error('Question bank not loaded.');
  const buckets = buildTopicBuckets(bank, PAPER_SIZE);
  return generatePaper(seedNum, bank, buckets);
}

// ---------------------------------------------------------------------------
// Persistence helpers (app.js is the only module that calls storage.js)
// ---------------------------------------------------------------------------

function persistNow() {
  saveState(persisted);
}

function scheduleAutosave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    saveTimer = null;
    persistNow();
  }, SAVE_DEBOUNCE_MS);
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

function hideResumeNotice() {
  const el = document.getElementById('resume-notice');
  if (el) el.hidden = true;
}

function showResumeNotice() {
  const el = document.getElementById('resume-notice');
  if (!el) return;
  el.hidden = false;
}

// B3 — "Spin a seed": Math.random() is explicitly allowed here (Invariant 5
// only forbids it inside the deterministic quiz/paper path); picks a random
// integer in [100, 99999] and focuses+selects the field so the new value is
// announced to assistive tech and visibly obvious to sighted players reading
// the number aloud.
function handleSpinSeed() {
  const input = document.getElementById('seed-input');
  if (!input) return;
  const MIN_SEED = 100;
  const MAX_SEED = 99999;
  const spun = MIN_SEED + Math.floor(Math.random() * (MAX_SEED - MIN_SEED + 1));
  input.value = String(spun);
  setSeedError('');
  input.focus();
  try { input.select(); } catch (_err) { /* selection unsupported — focus alone still helps */ }
}

// ---------------------------------------------------------------------------
// B1 — sticky quiz header: live "answered N/20" + "MM:SS" timer.
// ---------------------------------------------------------------------------

function formatElapsedShort(ms) {
  const totalSeconds = Math.max(0, Math.round((Number(ms) || 0) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
}

// Answered-count updates from the A2 delegated input/change listeners
// (via autosaveTick) — never a re-render, just this one element's text.
function updateProgressDisplay() {
  const el = document.getElementById('quiz-progress');
  if (!el || !session) return;
  const total = session.paper.length;
  let answered = 0;
  for (const q of session.paper) {
    const v = session.answers[q.id];
    if (v !== null && v !== undefined && v !== '') answered += 1;
  }
  el.textContent = 'answered ' + answered + '/' + total;
}

function updateTimerDisplay() {
  const el = document.getElementById('quiz-timer');
  if (!el || !session || session.startedAt == null) return;
  el.textContent = formatElapsedShort(Date.now() - session.startedAt);
}

// Always clearInterval before any setInterval (Invariant per B1) — called on
// every quiz entry AND every quiz exit, so there is never more than one live
// handle no matter how screens are re-entered.
function stopQuizTimer() {
  if (timerHandle != null) {
    clearInterval(timerHandle);
    timerHandle = null;
  }
}

function startQuizTimer() {
  stopQuizTimer();
  updateTimerDisplay();
  timerHandle = window.setInterval(updateTimerDisplay, 1000);
}

// ---------------------------------------------------------------------------
// B2 — unanswered-submit guard (idle -> confirming -> marked state machine).
// ---------------------------------------------------------------------------

function countBlankAnswers(paper, answers) {
  let blanks = 0;
  for (const q of paper) {
    const v = answers[q.id];
    if (v === null || v === undefined || v === '') blanks += 1;
  }
  return blanks;
}

function showSubmitGuard(blankCount) {
  submitState = 'confirming';
  const guard = document.getElementById('submit-guard');
  const text = document.getElementById('submit-guard-text');
  const submitBtn = document.getElementById('submit-btn');
  if (text) text.textContent = blankCount + ' unanswered — blanks score 0.';
  if (guard) guard.hidden = false;
  if (submitBtn) submitBtn.hidden = true; // one actionable submit affordance at a time
  const anywayBtn = document.getElementById('submit-anyway-btn');
  if (anywayBtn) anywayBtn.focus(); // Invariant 7 — move focus into the injected alert
}

// Back to `idle`: used by "Keep going" AND by any answer change while
// confirming (the guard's premise — the blank count — may no longer hold).
function hideSubmitGuard() {
  submitState = 'idle';
  const guard = document.getElementById('submit-guard');
  const submitBtn = document.getElementById('submit-btn');
  if (guard) guard.hidden = true;
  if (submitBtn) submitBtn.hidden = false;
}

// Reset the guard to a clean `idle` state for a brand-new quiz (fresh start,
// resume, or restart) — the guard's DOM nodes are static/reused across
// papers, so nothing here is implicit.
function resetSubmitGuard() {
  hideSubmitGuard();
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
    paper = buildPaperForSeed(parsed.seed);
  } catch (err) {
    setSeedError('Could not build a paper from this bank: ' + (err && err.message ? err.message : String(err)));
    return;
  }

  const startedAt = Date.now();
  session = {
    seed: parsed.seed,
    paper,
    answers: Object.create(null),
    startedAt,
  };
  lastResult = null;
  resultsShown = false;

  // A2 — write the fresh in-progress paper to the autosave slot immediately
  // (not debounced: this is a state transition, not a keystroke).
  persisted.session = { seed: parsed.seed, startedAt, answers: {}, party: null };
  persistNow();

  hideResumeNotice();
  resetSubmitGuard();
  renderQuiz(paper, session.seed, getBankVersion());
  showScreen('screen-quiz');
  updateProgressDisplay();
  startQuizTimer(); // B1 — started when the quiz screen shows
}

// C3 — shared teardown for both results actions: clears the autosaved
// session only (lastGame/history stay, same rule A2 gave "New paper") and
// returns to the seed screen. Callers apply their own seed-field treatment
// afterward (spin a fresh one, or keep the one just played).
function goToSeedScreenFromResults() {
  stopQuizTimer(); // B1 — defensive; should already be stopped by finalizeSubmit
  resetSubmitGuard();
  clearSession();
  persisted.session = null;
  session = null;
  lastResult = null;
  resultsShown = false;
  hideResumeNotice();
  renderSeedScreen();
  showScreen('screen-seed');
}

// #rematch-btn — "Rematch: new seed": spins a fresh seed (reusing B3's
// spin logic so there is exactly one place that generates one), prefills it,
// and focuses it to read aloud.
function handleRematch() {
  goToSeedScreenFromResults();
  handleSpinSeed();
}

// #same-seed-btn — "Same seed again": returns to the seed screen with the
// just-played seed kept (not spun), focused so it can be read aloud again.
function handleSameSeed() {
  const playedSeed = session ? session.seed : null;
  goToSeedScreenFromResults();
  const input = document.getElementById('seed-input');
  if (input && playedSeed != null) {
    input.value = String(playedSeed);
    setSeedError('');
    input.focus();
    try { input.select(); } catch (_err) { /* selection unsupported — focus alone still helps */ }
  }
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

// A2 — autosave: mirror the live form into both the in-memory session and the
// persisted session, debounced to <=1 write/500ms. Called from delegated
// `input` (keystrokes) and `change` (radios, and text-field blur) listeners.
// Also drives B1's live answered-count and B2's "any answer change ->
// idle" guard-collapse rule.
function autosaveTick() {
  if (!session) return;
  session.answers = collectAnswers(session.paper);
  if (persisted.session) {
    const out = {};
    for (const k of Object.keys(session.answers)) {
      const v = session.answers[k];
      if (v !== null && v !== undefined && v !== '') out[k] = v;
    }
    persisted.session.answers = out;
  }
  scheduleAutosave();
  updateProgressDisplay();
  if (submitState === 'confirming') hideSubmitGuard();
}

// B2 — the ONE submit funnel: both #submit-btn's click and quiz-form's
// native `submit` event (Enter key, via the default-button mechanism) call
// this. `idle` + >=1 blank renders the inline confirm and stops here WITHOUT
// marking or latching `resultsShown`; `idle` + zero blanks marks directly,
// same as before B2 existed.
function requestSubmit() {
  if (!session || resultsShown) return;
  if (submitState === 'confirming') return; // guard already showing — ignore repeats

  const answers = collectAnswers(session.paper);
  session.answers = answers;
  const blanks = countBlankAnswers(session.paper, answers);
  if (blanks > 0) {
    showSubmitGuard(blanks);
    return;
  }
  finalizeSubmit(answers);
}

// #submit-anyway-btn — the ONLY path out of `confirming` that marks, and it
// marks exactly once (guarded by the same `resultsShown` latch as always).
function handleSubmitAnyway() {
  if (submitState !== 'confirming' || resultsShown) return;
  hideSubmitGuard();
  finalizeSubmit(collectAnswers(session.paper));
}

// #keep-going-btn — back to `idle`, remove the confirm, no marking.
function handleKeepGoing() {
  hideSubmitGuard();
}

function finalizeSubmit(answers) {
  if (!session || resultsShown) return;
  resultsShown = true;
  stopQuizTimer(); // B1 — cleared on submit

  session.answers = answers;
  session.submittedAt = Date.now();
  const elapsedMs = Math.max(0, session.submittedAt - (session.startedAt || session.submittedAt));

  lastResult = mark(session.paper, answers, elapsedMs);

  // A2 — fill lastGame, append to history (cap 50), clear the in-progress session.
  const cleanAnswers = {};
  for (const k of Object.keys(answers)) {
    const v = answers[k];
    if (v !== null && v !== undefined && v !== '') cleanAnswers[k] = v;
  }
  persisted.lastGame = {
    finishedAt: session.submittedAt,
    seed: session.seed,
    solo: { answers: cleanAnswers, elapsedMs },
    party: null,
  };
  persisted.history = Array.isArray(persisted.history) ? persisted.history : [];
  persisted.history.unshift({
    seed: session.seed,
    total: lastResult.total,
    maxTotal: lastResult.maxTotal,
    elapsedMs,
    finishedAt: session.submittedAt,
    player: null,
  });
  if (persisted.history.length > 50) persisted.history.length = 50;
  persisted.session = null;
  if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
  persistNow();

  hideResumeNotice();
  resetSubmitGuard();
  renderResults(lastResult, session.seed, {
    paper: session.paper,
    answers: session.answers,
    bankVersion: getBankVersion(),
  });
  showScreen('screen-results');
  updateShareOnlineState(); // C4 — reconcile messenger buttons against current connectivity
}

// ---------------------------------------------------------------------------
// Flow: Resume + results-restore (A2)
// ---------------------------------------------------------------------------

function paperQuestionIds(paper) {
  const ids = new Set();
  for (const q of paper) if (q && q.id != null) ids.add(String(q.id));
  return ids;
}

// Every stored answer key must resolve to a question in the regenerated
// paper — otherwise the stored data belongs to a bank the device no longer
// has (Restore-failure rule).
function answersMatchPaper(answers, paper) {
  if (!answers || typeof answers !== 'object') return true;
  const ids = paperQuestionIds(paper);
  for (const key of Object.keys(answers)) {
    if (!ids.has(key)) return false;
  }
  return true;
}

function cssEscapeName(name) {
  return window.CSS && CSS.escape ? CSS.escape(name) : name;
}

// Re-apply stored answer values into the live quiz form: radios get checked
// (and a real `change` event dispatched so the single delegated listener
// re-applies .option--selected), text fields get their value set directly.
function restoreAnswersIntoForm(paper, answers) {
  const form = document.getElementById('quiz-form');
  if (!form || !answers) return;
  paper.forEach((q) => {
    const qid = q && q.id != null ? String(q.id) : null;
    if (!qid) return;
    const raw = answers[qid];
    if (raw === undefined || raw === null || raw === '') return;
    const fieldName = 'q-' + qid;

    if (q.type === 'mcq') {
      const radios = form.querySelectorAll(
        '.option__input[name="' + cssEscapeName(fieldName) + '"]');
      radios.forEach((radio) => {
        if (radio.value === String(raw)) {
          radio.checked = true;
          try {
            radio.dispatchEvent(new Event('change', { bubbles: true }));
          } catch (_err) {
            // Older engines without a working Event constructor — the radio
            // is still checked, just without the visual reflection.
          }
        }
      });
    } else {
      const field = form.elements[fieldName];
      if (field) field.value = String(raw);
    }
  });
}

// Attempt to resume an in-progress paper. Returns true on success (screen
// already shown), false if there was nothing valid to resume.
function tryRestoreSession(sessionData) {
  if (!sessionData || typeof sessionData !== 'object') return false;

  // Batch D extends this branch to restore to the current player's
  // interstitial instead; Batch A never writes a non-null party, so this is
  // effectively unreachable today, but guarded defensively.
  if (sessionData.party) return false;

  let paper;
  try {
    paper = buildPaperForSeed(sessionData.seed);
  } catch (_err) {
    return false; // regeneration failure -> drop (Restore-failure rule)
  }

  const answers = sessionData.answers && typeof sessionData.answers === 'object'
    ? sessionData.answers
    : {};
  if (!answersMatchPaper(answers, paper)) return false; // stale-bank mismatch -> drop

  session = {
    seed: sessionData.seed,
    paper,
    answers: { ...answers },
    startedAt: typeof sessionData.startedAt === 'number' ? sessionData.startedAt : Date.now(),
  };
  lastResult = null;
  resultsShown = false;
  resetSubmitGuard();

  renderQuiz(paper, session.seed, getBankVersion());
  restoreAnswersIntoForm(paper, answers);
  showScreen('screen-quiz');
  showResumeNotice();
  updateProgressDisplay();
  startQuizTimer(); // B1 — keeps the stored startedAt's clock running
  return true;
}

// Attempt to restore the most recently completed paper's results screen.
// Returns true on success.
function tryRestoreLastGame(lastGame) {
  if (!lastGame || typeof lastGame !== 'object') return false;
  if (!lastGame.solo) return false; // party lastGame is Batch D scope

  let paper;
  try {
    paper = buildPaperForSeed(lastGame.seed);
  } catch (_err) {
    return false;
  }

  const answers = lastGame.solo.answers && typeof lastGame.solo.answers === 'object'
    ? lastGame.solo.answers
    : {};
  if (!answersMatchPaper(answers, paper)) return false;

  const elapsedMs = Number(lastGame.solo.elapsedMs) || 0;
  const result = mark(paper, answers, elapsedMs);

  session = {
    seed: lastGame.seed,
    paper,
    answers: { ...answers },
    startedAt: null,
    submittedAt: lastGame.finishedAt,
  };
  lastResult = result;
  resultsShown = true;
  stopQuizTimer(); // B1 — defensive; no timer should be running at boot
  resetSubmitGuard();

  renderResults(result, lastGame.seed, {
    paper,
    answers,
    bankVersion: getBankVersion(),
  });
  showScreen('screen-results');
  updateShareOnlineState(); // C4 — reconcile messenger buttons against current connectivity
  return true;
}

// Boot-time restore, run only after a successful bank load (a bank LOAD
// failure must leave stored state completely untouched).
function attemptRestore() {
  if (persisted.session) {
    const restored = tryRestoreSession(persisted.session);
    if (restored) return;
    // Regeneration/mismatch failure: drop the unusable session silently.
    persisted.session = null;
    persistNow();
  }

  if (persisted.lastGame) {
    const withinWindow = Date.now() - Number(persisted.lastGame.finishedAt) <= RESTORE_WINDOW_MS;
    if (withinWindow) {
      const restored = tryRestoreLastGame(persisted.lastGame);
      if (restored) return;
      // Only a bank mismatch drops it; simply being outside the window (or a
      // party lastGame in this batch) leaves it stored and boots to seed.
      if (persisted.lastGame.solo) {
        persisted.lastGame = null;
        persistNow();
      }
    }
  }
}

// ---------------------------------------------------------------------------
// C2 — spoiler-gated answer review toggle.
// ---------------------------------------------------------------------------

// #reveal-answers-btn: expands/collapses #answer-review in place. render.js
// always mounts it collapsed (a fresh renderResults() call rebuilds both
// nodes from scratch, so there is nothing to reset here on a new game).
function handleToggleAnswerReview(btn) {
  const review = document.getElementById('answer-review');
  if (!review || !btn) return;
  const nowHidden = !review.hidden;
  review.hidden = nowHidden;
  btn.setAttribute('aria-expanded', String(!nowHidden));
  btn.textContent = nowHidden ? 'Reveal answers' : 'Hide answers';
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
  const text = buildSummary(session.seed, lastResult, getBankVersion());

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
// A1 — "Ready for offline" 4-state indicator: SW readiness x navigator.onLine.
// ---------------------------------------------------------------------------

const OFFLINE_COPY = {
  notReadyOnline: 'Getting ready for offline…',
  notReadyOffline: 'Not cached yet — open this app on wifi first.',
  readyOnline: 'Ready for offline — flight mode is fine.',
  readyOffline: 'Offline and ready to play.',
};

function isOnline() {
  return typeof navigator === 'undefined' || navigator.onLine !== false;
}

function currentOfflineCopy() {
  const online = isOnline();
  if (swReady) return online ? OFFLINE_COPY.readyOnline : OFFLINE_COPY.readyOffline;
  return online ? OFFLINE_COPY.notReadyOnline : OFFLINE_COPY.notReadyOffline;
}

function updateOfflineIndicator() {
  const el = document.getElementById('offline-indicator');
  if (!el) return;
  el.classList.toggle('offline-indicator--ready', swReady);
  el.setAttribute('data-ready', swReady ? 'true' : 'false');
  // Target .offline-indicator__text — the class index.html actually ships
  // (the previous code looked for .offline-indicator__label, which never
  // matched anything, so the pill was stuck on its loading copy forever).
  const label = el.querySelector('.offline-indicator__text');
  if (label) {
    label.textContent = currentOfflineCopy();
  }
}

function markOfflineReady() {
  swReady = true;
  updateOfflineIndicator();
}

// ---------------------------------------------------------------------------
// C4 — offline-aware share row: WhatsApp/Telegram are dead links without a
// network (wa.me / t.me), so they render `disabled` with a visible "needs
// internet" note whenever navigator.onLine is false, mirroring A1's
// SW-readiness x online/offline wiring. "Copy summary" is never touched here
// — it stays enabled regardless of connectivity.
// ---------------------------------------------------------------------------

function setShareButtonOnlineState(btnId, noteId, online) {
  const btn = document.getElementById(btnId);
  if (btn) {
    btn.disabled = !online;
    btn.setAttribute('aria-disabled', String(!online));
  }
  const note = document.getElementById(noteId);
  if (note) note.hidden = online;
}

function updateShareOnlineState() {
  const online = isOnline();
  setShareButtonOnlineState('share-whatsapp', 'share-whatsapp-note', online);
  setShareButtonOnlineState('share-telegram', 'share-telegram-note', online);
}

function wireOnlineOffline() {
  window.addEventListener('online', () => {
    updateOfflineIndicator();
    updateShareOnlineState();
  });
  window.addEventListener('offline', () => {
    updateOfflineIndicator();
    updateShareOnlineState();
  });
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
      requestSubmit();
      return;
    }
    if (target.closest('#submit-anyway-btn')) {
      event.preventDefault();
      handleSubmitAnyway();
      return;
    }
    if (target.closest('#keep-going-btn')) {
      event.preventDefault();
      handleKeepGoing();
      return;
    }
    if (target.closest('#spin-seed-btn')) {
      event.preventDefault();
      handleSpinSeed();
      return;
    }
    if (target.closest('#rematch-btn')) {
      event.preventDefault();
      handleRematch();
      return;
    }
    if (target.closest('#same-seed-btn')) {
      event.preventDefault();
      handleSameSeed();
      return;
    }
    if (target.closest('#reveal-answers-btn')) {
      event.preventDefault();
      handleToggleAnswerReview(target.closest('#reveal-answers-btn'));
      return;
    }
    if (target.closest('.resume-notice__dismiss')) {
      event.preventDefault();
      hideResumeNotice();
      return;
    }
    const shareBtn = target.closest('#share-whatsapp, #share-telegram, #copy-summary');
    if (shareBtn) {
      event.preventDefault();
      handleShareClick(shareBtn);
    }
  });

  // B2 — the same submit funnel as #submit-btn's click: #submit-btn is the
  // quiz form's default button (type="submit" + form="quiz-form"), so Enter
  // in any quiz field fires this via the browser's implicit-submission
  // mechanism. preventDefault() here also guards against a full-page reload.
  document.addEventListener('submit', (event) => {
    if (event.target && event.target.id === 'quiz-form') {
      event.preventDefault();
      requestSubmit();
    }
  });

  // A4 — the ONLY listener that reflects MCQ selection onto its .option
  // wrapper (render.js's former per-group listener was removed, so this is
  // now the single code path). Also drives A2 autosave for radios (and any
  // change on a text field, which fires on blur).
  document.addEventListener('change', (event) => {
    const el = event.target;
    if (!el || !el.name || el.name.indexOf('q-') !== 0) return;

    if (el.classList && el.classList.contains('option__input')) {
      const group = document.querySelectorAll(
        '.option__input[name="' + cssEscapeName(el.name) + '"]');
      group.forEach((inp) => {
        const wrap = inp.closest ? inp.closest('.option') : null;
        if (wrap) wrap.classList.toggle('option--selected', inp.checked);
      });
    }

    autosaveTick();
  });

  // A2 — text fields fire `change` only on blur; `input` is what captures
  // keystrokes so a dropped session never loses more than ~500ms of typing.
  document.addEventListener('input', (event) => {
    const el = event.target;
    if (!el || !el.name || el.name.indexOf('q-') !== 0) return;
    autosaveTick();
  });
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

async function boot() {
  renderSeedScreen();
  wireEvents();
  wireServiceWorker();
  wireOnlineOffline();
  updateOfflineIndicator();
  showScreen('screen-seed');

  try {
    bank = await loadBank();
  } catch (err) {
    setSeedError(err && err.message ? err.message : 'Could not load the question bank.');
    // A bank LOAD failure preserves stored state untouched — no restore attempt.
    return;
  }

  attemptRestore();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
