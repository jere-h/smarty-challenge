// storage.js — the ONLY module allowed to name `localStorage` (Invariant 2).
//
// Persists a single JSON blob under one key so a dropped session (accidental
// refresh, locked phone, evicted tab) can autosave-resume, and a completed
// paper survives a reload long enough to show results again. Every export is
// wrapped so private-mode / quota errors degrade to "no persistence" without
// ever throwing to the caller (Invariant 6) — app.js is the only caller.
//
// Contract:
//   loadState()        -> State, never throws (invalid/missing data -> default)
//   saveState(state)    -> boolean success, never throws
//   clearSession()      -> boolean success, nulls out state.session only
//
// State shape (see docs/trd.md Section 1):
//   State {
//     schemaVersion: 1,
//     session: null | { seed, startedAt, answers, party },
//     lastGame: null | { finishedAt, seed, solo, party },
//     history: Array<{ seed, total, maxTotal, elapsedMs, finishedAt, player }>,
//   }
//
// The paper itself is never stored — it is regenerated from the seed
// (same seed + same bank => same paper, per the determinism invariant).

const STORAGE_KEY = 'smarty.state.v1';
const SCHEMA_VERSION = 1;
const HISTORY_CAP = 50;

function defaultState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    session: null,
    lastGame: null,
    history: [],
  };
}

// Coerce whatever JSON.parse gave us into a well-shaped State, tolerating any
// missing/extra/malformed field rather than throwing.
function normalizeState(raw) {
  if (!raw || typeof raw !== 'object') return defaultState();

  const session =
    raw.session && typeof raw.session === 'object' ? raw.session : null;
  const lastGame =
    raw.lastGame && typeof raw.lastGame === 'object' ? raw.lastGame : null;
  const history = Array.isArray(raw.history) ? raw.history.slice(0, HISTORY_CAP) : [];

  return {
    schemaVersion: SCHEMA_VERSION,
    session,
    lastGame,
    history,
  };
}

/**
 * loadState() -> State
 * Never throws. Missing key or corrupt JSON resolves to the default state.
 */
export function loadState() {
  try {
    if (typeof localStorage === 'undefined') return defaultState();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return normalizeState(parsed);
  } catch (_err) {
    return defaultState();
  }
}

/**
 * saveState(state) -> boolean
 * Never throws (private mode / quota errors resolve to `false`).
 */
export function saveState(state) {
  try {
    if (typeof localStorage === 'undefined') return false;
    const toSave = normalizeState(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    return true;
  } catch (_err) {
    return false;
  }
}

/**
 * clearSession() -> boolean
 * Nulls out state.session ONLY — lastGame and history are left untouched.
 * Never throws.
 */
export function clearSession() {
  try {
    const state = loadState();
    state.session = null;
    return saveState(state);
  } catch (_err) {
    return false;
  }
}
