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
import {
  renderSeedScreen, renderQuiz, renderResults,
  renderInterstitial, renderLeaderboard, addPartyRosterRow,
} from './render.js';
import { buildSummary, shareWhatsApp, shareTelegram, copyToClipboard } from './share.js';
import { loadState, saveState, clearSession } from './storage.js';

// ---------------------------------------------------------------------------
// In-memory state (Session). The paper itself lives only here — it is never
// persisted (storage.js keeps just the seed + answers; the paper is
// regenerated deterministically from the seed on restore).
// ---------------------------------------------------------------------------

/** @type {{schemaVersion:number, bankVersion?:number, subject:string, questions:Array}|null} */
let bank = null;

/** Fun-mode bank (riddles.json). Loaded at boot beside the math bank; a load
 * failure only hides the riddle toggle, never blocks the math experience. */
let riddleBank = null;

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

/**
 * Pause state: wall-clock ms when the player paused, or null while running.
 * Not persisted — a reload while paused simply resumes the clock (same as the
 * pre-pause behavior on any reload). On resume, session.startedAt is shifted
 * forward by the paused duration, so elapsed-time math everywhere else
 * (timer display, submit, tie-breaks) needs no changes.
 */
let pausedAt = null;

/**
 * Scroll position at the moment of pausing. Hiding the questions collapses
 * the page height (scroll snaps to top), so resume restores the reader to
 * the exact question they stopped at.
 */
let pauseScrollY = 0;

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

async function loadBank(file) {
  const url = new URL(file || './questions.json', import.meta.url);
  const res = await fetch(url);
  if (!res.ok) throw new Error('Could not load the question bank (' + res.status + ').');
  return res.json();
}

// The current session's mode: 'math' (default) or 'riddles' (fun mode).
function sessionMode() {
  return session && session.mode === 'riddles' ? 'riddles' : 'math';
}

function bankForMode(mode) {
  return mode === 'riddles' ? riddleBank : bank;
}

// A6 — the bank's own version, displayed wherever the seed is displayed so a
// cached device holding a stale bank can be spotted before phones compare.
// Riddle papers show as "R<version>" so a math v3 and a riddle v3 can never
// be mistaken for the same paper.
function getBankVersion() {
  const mode = sessionMode();
  const b = bankForMode(mode);
  const v = b && b.bankVersion != null ? b.bankVersion : 1;
  return mode === 'riddles' ? 'R' + v : v;
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
const VALID_PAPER_SIZES = [5, 10, 20];

function buildPaperForSeed(seedNum, size, mode) {
  const b = bankForMode(mode === 'riddles' ? 'riddles' : 'math');
  if (!b) throw new Error('Question bank not loaded.');
  const target = VALID_PAPER_SIZES.includes(size) ? size : PAPER_SIZE;
  const buckets = buildTopicBuckets(b, target);
  return generatePaper(seedNum, b, buckets);
}

// The landing screen's Math/Riddles mode pills. Riddles is only honored when
// the riddle bank actually loaded.
function readMode() {
  const checked = document.querySelector('input[name="game-mode"]:checked');
  return checked && checked.value === 'riddles' && riddleBank ? 'riddles' : 'math';
}

// The seed screen's 5/10/20 exam-length picker. Falls back to the classic 20
// if the control is missing or holds an unexpected value.
function readPaperLength() {
  const checked = document.querySelector('input[name="paper-length"]:checked');
  const v = checked ? Number(checked.value) : PAPER_SIZE;
  return VALID_PAPER_SIZES.includes(v) ? v : PAPER_SIZE;
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
  const MIN_SEED = 1000;
  const MAX_SEED = 9999;
  const spun = MIN_SEED + Math.floor(Math.random() * (MAX_SEED - MIN_SEED + 1));
  input.value = String(spun);
  setSeedError('');
  input.focus();
  try { input.select(); } catch (_err) { /* selection unsupported — focus alone still helps */ }
}

// ---------------------------------------------------------------------------
// D1 — party roster (seed screen). No roster (toggle left unchecked) means
// handleStart's existing solo branch runs completely untouched (Section 5
// acceptance: "solo flow must stay byte-identical when the toggle is
// untouched").
// ---------------------------------------------------------------------------

const PARTY_MIN_PLAYERS = 2;
const PARTY_MAX_PLAYERS = 8;

function isPartyToggleOn() {
  const toggle = document.getElementById('party-toggle');
  return !!(toggle && toggle.checked);
}

function getRosterInputs() {
  const list = document.getElementById('party-roster-list');
  if (!list) return [];
  return Array.prototype.slice.call(list.querySelectorAll('.party-roster__input'));
}

function setRosterError(msg) {
  const el = document.getElementById('party-roster-error');
  if (el) el.textContent = msg || '';
}

// Toggling #party-toggle shows/hides #party-roster; unchecking clears any
// stale validation message left over from a previous attempt.
function updatePartyRosterVisibility() {
  const roster = document.getElementById('party-roster');
  const on = isPartyToggleOn();
  if (roster) roster.hidden = !on;
  setRosterError('');
}

// Live "rejects duplicates inline" feedback while typing — authoritative
// validation (blank trimming, the 2..8 count, and the same duplicate check)
// happens again in collectRosterNames() when Start is actually pressed.
function checkRosterLiveDuplicates() {
  const inputs = getRosterInputs();
  const seenLower = new Set();
  let dupe = null;
  for (const input of inputs) {
    const raw = (input.value || '').trim();
    if (raw === '') continue;
    const lower = raw.toLowerCase();
    if (seenLower.has(lower)) { dupe = raw; break; }
    seenLower.add(lower);
  }
  setRosterError(dupe ? 'Duplicate name: "' + dupe + '" — names must be unique.' : '');
}

// #add-player-btn — appends one more roster name input, up to 8 total (D1).
function handleAddPlayer() {
  const count = getRosterInputs().length;
  if (count >= PARTY_MAX_PLAYERS) {
    setRosterError('Up to ' + PARTY_MAX_PLAYERS + ' players.');
    return;
  }
  const input = addPartyRosterRow(count);
  setRosterError('');
  if (input) input.focus();
}

// Trims blanks, rejects duplicate names (case-insensitive), and requires
// 2..8 valid names before a party can start (D1). Returns { names } or
// { error }.
function collectRosterNames() {
  const inputs = getRosterInputs();
  const names = [];
  const seenLower = new Set();
  for (const input of inputs) {
    const raw = (input.value || '').trim();
    if (raw === '') continue; // trims blanks
    const lower = raw.toLowerCase();
    if (seenLower.has(lower)) {
      return { error: 'Duplicate name: "' + raw + '" — names must be unique.' };
    }
    seenLower.add(lower);
    names.push(raw);
  }
  if (names.length < PARTY_MIN_PLAYERS) {
    return { error: 'Add at least ' + PARTY_MIN_PLAYERS + ' player names to start a party.' };
  }
  if (names.length > PARTY_MAX_PLAYERS) {
    return { error: 'Up to ' + PARTY_MAX_PLAYERS + ' players.' };
  }
  return { names };
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
  // Every quiz entry (fresh start, party turn, restore, resume-from-pause)
  // funnels through here, so this is the ONE place pause UI/state is reset.
  resetPauseState();
  stopQuizTimer();
  updateTimerDisplay();
  timerHandle = window.setInterval(updateTimerDisplay, 1000);
}

// ---------------------------------------------------------------------------
// Pause — covers the questions and stops the clock for a short break.
// ---------------------------------------------------------------------------

function setPauseUI(paused) {
  const screen = document.getElementById('screen-quiz');
  const overlay = document.getElementById('pause-overlay');
  const pauseBtn = document.getElementById('pause-btn');
  if (screen) screen.classList.toggle('screen--paused', paused);
  if (overlay) overlay.hidden = !paused;
  if (pauseBtn) pauseBtn.hidden = paused;
}

function resetPauseState() {
  pausedAt = null;
  setPauseUI(false);
}

function handlePauseQuiz() {
  if (!session || pausedAt != null) return;
  pausedAt = Date.now();
  pauseScrollY = window.scrollY || 0;
  stopQuizTimer(); // freeze the display; the real accounting happens on resume
  setPauseUI(true);
  window.scrollTo(0, 0); // the overlay is at the top of the (now short) page
  const resumeBtn = document.getElementById('resume-btn');
  if (resumeBtn) resumeBtn.focus();
}

function handleResumeQuiz() {
  if (!session || pausedAt == null) return;
  const pausedMs = Math.max(0, Date.now() - pausedAt);
  pausedAt = null;
  if (session.startedAt != null) {
    session.startedAt += pausedMs;
    if (persisted.session) {
      persisted.session.startedAt = session.startedAt;
      persistNow(); // state transition, not a keystroke — not debounced
    }
  }
  startQuizTimer(); // also clears the pause UI via resetPauseState()
  window.scrollTo(0, pauseScrollY); // back to the question they stopped at
  pauseScrollY = 0;
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

  // D1 — party toggle branch. Toggle left unchecked (the default) falls
  // straight through to the existing solo path below, completely unchanged.
  if (isPartyToggleOn()) {
    const rosterResult = collectRosterNames();
    if ('error' in rosterResult) {
      setRosterError(rosterResult.error);
      return;
    }
    setRosterError('');
    startParty(parsed.seed, rosterResult.names, readPaperLength(), readMode());
    return;
  }

  const mode = readMode();
  let paper;
  try {
    paper = buildPaperForSeed(parsed.seed, readPaperLength(), mode);
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
    mode,
  };
  lastResult = null;
  resultsShown = false;

  // A2 — write the fresh in-progress paper to the autosave slot immediately
  // (not debounced: this is a state transition, not a keystroke).
  persisted.session = { seed: parsed.seed, startedAt, answers: {}, party: null, paperLen: paper.length, mode };
  persistNow();

  hideResumeNotice();
  resetSubmitGuard();
  renderQuiz(paper, session.seed, getBankVersion());
  showScreen('screen-quiz');
  updateProgressDisplay();
  startQuizTimer(); // B1 — started when the quiz screen shows
}

// ---------------------------------------------------------------------------
// D2/D4 — party mode: ONE paper built once from the seed, then each player
// takes a turn (interstitial -> fresh quiz -> personal result -> next
// interstitial), ending in the D3 leaderboard.
// ---------------------------------------------------------------------------

// Builds a fresh party (used by both the seed-screen Start button and the
// leaderboard's "Rematch: new seed") — one paper, roster order preserved,
// every result slot starts null, `startedAt` null (D2: it is set only the
// first time a player actually enters the quiz via #interstitial-start-btn).
function startParty(seedNum, players, paperLen, mode) {
  let paper;
  try {
    paper = buildPaperForSeed(seedNum, paperLen, mode);
  } catch (err) {
    setSeedError('Could not build a paper from this bank: ' + (err && err.message ? err.message : String(err)));
    return;
  }

  session = {
    seed: seedNum,
    paper,
    answers: Object.create(null),
    startedAt: null,
    mode: mode === 'riddles' ? 'riddles' : 'math',
    party: {
      players: players.slice(),
      current: 0,
      results: players.map(() => null),
    },
  };
  lastResult = null;
  resultsShown = false;

  persisted.session = {
    seed: seedNum,
    startedAt: null,
    answers: {},
    paperLen: paper.length,
    mode: mode === 'riddles' ? 'riddles' : 'math',
    party: {
      players: players.slice(),
      current: 0,
      results: players.map(() => null),
    },
  };
  persistNow();

  hideResumeNotice();
  resetSubmitGuard();
  showPlayerInterstitial();
}

// Paints the CURRENT player's "Hand the phone to <name>" screen. B1 — the
// quiz timer is cleared on interstitial entry, same as submit/restart.
function showPlayerInterstitial() {
  if (!session || !session.party) return;
  stopQuizTimer();
  const idx = session.party.current;
  const name = session.party.players[idx];
  renderInterstitial(name, { index: idx, total: session.party.players.length });
  showScreen('screen-interstitial');
}

// #interstitial-start-btn — begins (or resumes) the current player's turn.
//   - Fresh turn (session.startedAt is null: first entry after party
//     creation, or after advancing past a previous player): starts that
//     player's clock now and renders a blank quiz (D2 — "renders FRESH").
//   - Resumed turn (session.startedAt already set: a reload happened while
//     this same player was mid-quiz): the clock is reused as-is and their
//     autosaved answers are restored into the form (D4).
function handleInterstitialStart() {
  if (!session || !session.party) return;

  const isFreshTurn = session.startedAt == null;

  if (isFreshTurn) {
    session.answers = Object.create(null);
    session.startedAt = Date.now();
    if (persisted.session) {
      persisted.session.startedAt = session.startedAt;
      persisted.session.answers = {};
    }
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
    persistNow(); // state transition, not a keystroke — not debounced
  }

  lastResult = null;
  resultsShown = false;
  resetSubmitGuard();
  hideResumeNotice();

  renderQuiz(session.paper, session.seed, getBankVersion());
  if (!isFreshTurn) {
    restoreAnswersIntoForm(session.paper, session.answers);
  }
  showScreen('screen-quiz');
  updateProgressDisplay();
  startQuizTimer(); // B1 — keeps a resumed player's clock running, or starts a fresh one
}

// #pass-to-next-btn — leaves the just-finished player's personal result card
// for the next player's interstitial. party.current was already advanced in
// finalizePartyTurn(), so this just repaints whichever player is now current.
function handlePassToNext() {
  if (!session || !session.party) return;
  showPlayerInterstitial();
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

// #cancel-attempt-btn — abandons the paper mid-quiz (typical case: a
// mistyped seed) after an explicit confirm. Reuses the results-screen reset
// helper, then prefills the just-abandoned seed selected for a quick fix.
function handleCancelAttempt() {
  if (!session) return;
  const ok = window.confirm(
    'Cancel this attempt and go back? Your answers here will be lost.'
  );
  if (!ok) return;
  const abandonedSeed = session.seed;
  resetPauseState();
  goToSeedScreenFromResults();
  const input = document.getElementById('seed-input');
  if (input && abandonedSeed != null) {
    input.value = String(abandonedSeed);
    setSeedError('');
    input.focus();
    try { input.select(); } catch (_err) { /* selection unsupported — focus alone still helps */ }
  }
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
  if (pausedAt != null) return; // paused: questions are covered, no submitting
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

  // D2 — a party in progress takes a completely separate path (per-player
  // result storage, turn advance/leaderboard); the solo path below this is
  // untouched so `session.party === null` behaves exactly as before Batch D.
  if (session.party) {
    finalizePartyTurn(elapsedMs);
    return;
  }

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
    paperLen: session.paper.length,
    mode: sessionMode(),
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
  setResultsActionsVisible(true); // D — solo results always show rematch/same-seed
  showScreen('screen-results');
  updateShareOnlineState(); // C4 — reconcile messenger buttons against current connectivity
}

// ---------------------------------------------------------------------------
// D2/D3/D4 — party turn completion, personal result card, and leaderboard.
// ---------------------------------------------------------------------------

// Shows/hides the static rematch/same-seed row (#results-actions) — visible
// for the normal solo results screen, hidden for a mid-party personal result
// card (which instead gets render.js's own "Pass to <next>" action).
function setResultsActionsVisible(visible) {
  const el = document.getElementById('results-actions');
  if (el) el.hidden = !visible;
}

// Called from finalizeSubmit() once a party's current player has submitted.
// Stores that player's result, appends the shared history (named this time),
// and either advances to the next player's personal-result-with-pass-button
// card, or — on the LAST player — finalizes the whole party straight to the
// D3 leaderboard.
function finalizePartyTurn(elapsedMs) {
  const party = session.party;
  const idx = party.current;
  const name = party.players[idx];

  const cleanAnswers = {};
  for (const k of Object.keys(session.answers)) {
    const v = session.answers[k];
    if (v !== null && v !== undefined && v !== '') cleanAnswers[k] = v;
  }

  party.results[idx] = {
    total: lastResult.total,
    maxTotal: lastResult.maxTotal,
    elapsedMs,
    answers: cleanAnswers,
  };

  persisted.history = Array.isArray(persisted.history) ? persisted.history : [];
  persisted.history.unshift({
    seed: session.seed,
    total: lastResult.total,
    maxTotal: lastResult.maxTotal,
    elapsedMs,
    finishedAt: session.submittedAt,
    player: name,
  });
  if (persisted.history.length > 50) persisted.history.length = 50;

  if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }

  const isLastPlayer = idx >= party.players.length - 1;

  if (isLastPlayer) {
    // D4 — a finished party moves to lastGame.party (session cleared), and
    // restores straight to the leaderboard on a future reload.
    persisted.lastGame = {
      finishedAt: session.submittedAt,
      seed: session.seed,
      solo: null,
      party: {
        players: party.players.slice(),
        current: party.players.length,
        results: party.results.slice(),
      },
      paperLen: session.paper.length,
      mode: sessionMode(),
    };
    persisted.session = null;
    persistNow();

    hideResumeNotice();
    resetSubmitGuard();
    showLeaderboard(party.players, party.results, session.paper);
    return;
  }

  // D2 — advance to the next player: the clock is nulled (only set again
  // when that player actually taps #interstitial-start-btn), and their
  // answers slate starts blank.
  party.current = idx + 1;
  session.startedAt = null;
  session.answers = Object.create(null);

  if (persisted.session) {
    persisted.session.party = {
      players: party.players.slice(),
      current: party.current,
      results: party.results.slice(),
    };
    persisted.session.startedAt = null;
    persisted.session.answers = {};
  }
  persistNow();

  hideResumeNotice();
  resetSubmitGuard();
  showPartyPersonalResult(name, lastResult, party.players[party.current]);
}

// The just-finished player's personal result card: same renderResults()
// C1 score card, but WITHOUT the C2 answer-review section (spoilers — D2)
// and with a single "Pass to <next name>" action in place of rematch/same-seed.
function showPartyPersonalResult(name, result, nextName) {
  renderResults(result, session.seed, {
    bankVersion: getBankVersion(),
    partyPlayerName: name,
    partyPass: { nextName },
  });
  setResultsActionsVisible(false);
  showScreen('screen-results');
  updateShareOnlineState(); // C4 — reconcile messenger buttons against current connectivity
}

// D3 — the ranked leaderboard, once every player has played. B1 — the quiz
// timer is cleared on leaderboard entry, same as submit/interstitial.
function showLeaderboard(players, results, paper) {
  stopQuizTimer();
  resetSubmitGuard();
  renderLeaderboard(players, results, { paper, bankVersion: getBankVersion() });
  showScreen('screen-leaderboard');
}

// #leaderboard-rematch-btn — same roster, a freshly spun seed, back to the
// interstitial flow (D3).
function handleLeaderboardRematch() {
  if (!session || !session.party || !Array.isArray(session.party.players)) return;
  const players = session.party.players.slice();
  const MIN_SEED = 1000;
  const MAX_SEED = 9999;
  const newSeed = MIN_SEED + Math.floor(Math.random() * (MAX_SEED - MIN_SEED + 1));
  startParty(newSeed, players);
}

// #leaderboard-done-btn — "clears party + session, seed screen" (D3): the
// same teardown C3 already gives the solo results actions.
function handleLeaderboardDone() {
  goToSeedScreenFromResults();
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

  // D4 — a party session ALWAYS restores to the current player's
  // interstitial, never directly into the quiz.
  if (sessionData.party) return tryRestorePartySession(sessionData);

  let paper;
  try {
    paper = buildPaperForSeed(sessionData.seed, Number(sessionData.paperLen) || undefined, sessionData.mode);
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
    mode: sessionData.mode === 'riddles' ? 'riddles' : 'math',
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

// D4 — a party session ALWAYS lands on the current player's interstitial
// (never directly in the quiz); tapping #interstitial-start-btn afterward is
// what actually restores that player's autosaved answers and non-null
// startedAt (handleInterstitialStart's "resumed turn" branch).
function tryRestorePartySession(sessionData) {
  const party = sessionData.party;
  if (!party || !Array.isArray(party.players) || party.players.length < PARTY_MIN_PLAYERS) return false;

  const idx = Number(party.current);
  if (!Number.isInteger(idx) || idx < 0 || idx >= party.players.length) return false;

  let paper;
  try {
    paper = buildPaperForSeed(sessionData.seed, Number(sessionData.paperLen) || undefined, sessionData.mode);
  } catch (_err) {
    return false; // regeneration failure -> drop (Restore-failure rule)
  }

  const answers = sessionData.answers && typeof sessionData.answers === 'object'
    ? sessionData.answers
    : {};
  if (!answersMatchPaper(answers, paper)) return false; // stale-bank mismatch -> drop

  const results = Array.isArray(party.results) ? party.results.slice(0, party.players.length) : [];
  while (results.length < party.players.length) results.push(null);

  session = {
    seed: sessionData.seed,
    paper,
    answers: { ...answers },
    startedAt: typeof sessionData.startedAt === 'number' ? sessionData.startedAt : null,
    party: {
      players: party.players.slice(),
      current: idx,
      results,
    },
  };
  lastResult = null;
  resultsShown = false;
  resetSubmitGuard();
  hideResumeNotice();

  showPlayerInterstitial();
  return true;
}

// Attempt to restore the most recently completed paper's results screen.
// Returns true on success.
function tryRestoreLastGame(lastGame) {
  if (!lastGame || typeof lastGame !== 'object') return false;

  // D4 — a finished party restores straight to the leaderboard.
  if (lastGame.party) return tryRestorePartyLastGame(lastGame);

  if (!lastGame.solo) return false;

  let paper;
  try {
    paper = buildPaperForSeed(lastGame.seed, Number(lastGame.paperLen) || undefined, lastGame.mode);
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
    mode: lastGame.mode === 'riddles' ? 'riddles' : 'math',
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
  setResultsActionsVisible(true); // D — solo results always show rematch/same-seed
  showScreen('screen-results');
  updateShareOnlineState(); // C4 — reconcile messenger buttons against current connectivity
  return true;
}

// D4 — a finished party's lastGame restores straight to the leaderboard
// (never the quiz/interstitial — the party is already over).
function tryRestorePartyLastGame(lastGame) {
  const party = lastGame.party;
  if (!party || !Array.isArray(party.players) || !Array.isArray(party.results)) return false;
  if (party.players.length < PARTY_MIN_PLAYERS) return false;

  let paper;
  try {
    paper = buildPaperForSeed(lastGame.seed, Number(lastGame.paperLen) || undefined, lastGame.mode);
  } catch (_err) {
    return false;
  }

  // Same Restore-failure rule as the solo path: every stored result's
  // answers must resolve against the regenerated paper.
  for (const r of party.results) {
    if (r && r.answers && !answersMatchPaper(r.answers, paper)) return false;
  }

  session = {
    seed: lastGame.seed,
    paper,
    answers: {},
    startedAt: null,
    submittedAt: lastGame.finishedAt,
    party: {
      players: party.players.slice(),
      current: party.players.length,
      results: party.results.slice(),
    },
  };
  lastResult = null;
  resultsShown = true;
  stopQuizTimer(); // B1 — defensive; no timer should be running at boot
  resetSubmitGuard();
  hideResumeNotice();

  showLeaderboard(party.players, party.results, paper);
  return true;
}

// Boot-time restore, run only after a successful bank load (a bank LOAD
// failure must leave stored state completely untouched).
// ?game=NNNN&len=5|10|20 — a friend's shared challenge link. The game number
// (and length) are pre-filled on the seed screen; nothing auto-starts.
function readUrlChallenge() {
  try {
    const params = new URLSearchParams(window.location.search);
    const game = params.get('game');
    const len = Number(params.get('len'));
    return {
      game: game && /^\d{4}$/.test(game) ? game : null,
      len: VALID_PAPER_SIZES.includes(len) ? len : null,
      mode: params.get('mode') === 'riddles' ? 'riddles' : null,
    };
  } catch (_err) {
    return { game: null, len: null, mode: null };
  }
}

function applyUrlChallenge(challenge) {
  if (challenge.game) {
    const input = document.getElementById('seed-input');
    if (input) input.value = challenge.game;
    setSeedError('');
  }
  if (challenge.len) {
    const radio = document.querySelector('.length-pill input[value="' + challenge.len + '"]');
    if (radio) radio.checked = true;
  }
  if (challenge.mode === 'riddles') {
    const radio = document.querySelector('input[name="game-mode"][value="riddles"]');
    if (radio) radio.checked = true;
  }
}

function attemptRestore() {
  // A challenge link expresses clear intent to play THAT paper: it outranks
  // the finished-game (results) restore, but never discards an in-progress
  // session — unfinished work still wins.
  const challenge = readUrlChallenge();

  if (persisted.session) {
    const restored = tryRestoreSession(persisted.session);
    if (restored) return;
    // Regeneration/mismatch failure: drop the unusable session silently.
    persisted.session = null;
    persistNow();
  }

  if (!challenge.game && persisted.lastGame) {
    const withinWindow = Date.now() - Number(persisted.lastGame.finishedAt) <= RESTORE_WINDOW_MS;
    if (withinWindow) {
      const restored = tryRestoreLastGame(persisted.lastGame);
      if (restored) return;
      // Only a bank mismatch drops it (Restore-failure rule, applied
      // uniformly to solo and D4 party payloads); simply being outside the
      // window leaves it stored and boots to seed.
      persisted.lastGame = null;
      persistNow();
    }
  }

  // Landed on the seed screen: honor a shared challenge link's prefill.
  applyUrlChallenge(challenge);
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

// A link that opens this app with the current game number and paper length
// pre-filled (see readUrlChallenge) so a friend starts the identical paper.
function buildChallengeUrl() {
  if (!session) return null;
  try {
    const u = new URL(window.location.href);
    u.search = '';
    u.hash = '';
    u.searchParams.set('game', String(session.seed));
    u.searchParams.set('len', String(session.paper.length));
    if (sessionMode() === 'riddles') u.searchParams.set('mode', 'riddles');
    return u.toString();
  } catch (_err) {
    return null;
  }
}

function handleShareClick(btn) {
  if (!session || !lastResult) return;
  const link = buildChallengeUrl();
  const text = buildSummary(session.seed, lastResult, getBankVersion(), link);

  if (btn.id === 'share-whatsapp') {
    shareWhatsApp(text);
  } else if (btn.id === 'share-telegram') {
    // Telegram carries the link in its url param, so the text goes WITHOUT
    // the trailing link line — otherwise the message shows it twice.
    shareTelegram(buildSummary(session.seed, lastResult, getBankVersion()), link);
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
    if (target.closest('#pause-btn')) {
      event.preventDefault();
      handlePauseQuiz();
      return;
    }
    if (target.closest('#resume-btn')) {
      event.preventDefault();
      handleResumeQuiz();
      return;
    }
    if (target.closest('#cancel-attempt-btn')) {
      event.preventDefault();
      handleCancelAttempt();
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
    if (target.closest('#add-player-btn')) {
      event.preventDefault();
      handleAddPlayer();
      return;
    }
    if (target.closest('#interstitial-start-btn')) {
      event.preventDefault();
      handleInterstitialStart();
      return;
    }
    if (target.closest('#pass-to-next-btn')) {
      event.preventDefault();
      handlePassToNext();
      return;
    }
    if (target.closest('#leaderboard-rematch-btn')) {
      event.preventDefault();
      handleLeaderboardRematch();
      return;
    }
    if (target.closest('#leaderboard-done-btn')) {
      event.preventDefault();
      handleLeaderboardDone();
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

    // D1 — #party-toggle shows/hides #party-roster.
    if (el && el.id === 'party-toggle') {
      updatePartyRosterVisibility();
      return;
    }

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

    // D1 — live "rejects duplicates inline" feedback while typing a roster name.
    if (el && el.classList && el.classList.contains('party-roster__input')) {
      checkRosterLiveDuplicates();
      return;
    }

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
    bank = await loadBank('./questions.json');
  } catch (err) {
    setSeedError(err && err.message ? err.message : 'Could not load the question bank.');
    // A bank LOAD failure preserves stored state untouched — no restore attempt.
    return;
  }

  // Fun mode: the riddle bank rides along; a failure only hides the toggle.
  try {
    riddleBank = await loadBank('./riddles.json');
  } catch (_err) {
    riddleBank = null;
    const riddlePill = document.querySelector('.mode-pill--riddles');
    if (riddlePill) riddlePill.hidden = true;
  }

  attemptRestore();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
