# Smarty Challenge — Technical Requirements Document (TRD)

Implements `docs/improvement-plan.md`. Audience: coding agents working in
batches; each batch section is self-contained and ends with acceptance
criteria a reviewer can check mechanically. Revision 2 — incorporates the
independent TRD review (cache versioning, persisted results, submit state
machine, party timing, DOM id contract, and a11y pins).

---

## 0. Invariants (apply to every batch — violating any is a review blocker)

1. **Static, no build step.** Plain ES modules served as-is. No bundler, no
   npm dependencies, no TypeScript. New files must use relative imports
   (`./x.js`) and relative asset paths — the site serves from a project
   subpath (`/smarty-challenge/`).
2. **Module boundaries stay as-is.**
   - `render.js` only paints DOM. It never fetches, never touches storage,
     never imports siblings. Data in via arguments only.
   - `app.js` owns Session state and event wiring (delegated listeners on
     `document`), and is the only module that calls storage.
   - `checkRules.js`, `marker.js`, `sampler.js`, `prng.js`, `validation.js`
     stay pure (no DOM, no I/O). **Do not touch `prng.js` or `sampler.js`'s
     draw order at all** — determinism across devices is the product.
   - New module `storage.js` (Batch A) is the only place `localStorage` is
     named.
3. **Offline-first + cache versioning.** Every new same-origin file the page
   loads at runtime MUST be added to `PRECACHE_URLS` in `sw.js` in the same
   batch. `docs/` and `tests/` are never precached. The cache is cache-first,
   so **any batch that changes ANY precached file must bump `CACHE_VERSION`
   in `sw.js`** (Batch A restructures this — see A0). Never mutate the live
   cache name in place: a version bump mints a fresh cache atomically on
   install and `activate` deletes stale ones (existing behavior, keep it).
4. **No spoilers in shared or visible text.** The share summary never
   contains prompts, options, or answers (existing rule). New rule: input
   hints must be generic strings — never derived from a question's
   `answer`/`accepted` values.
5. **Determinism.** Same seed + same bank ⇒ identical paper on every device.
   Nothing in the quiz/paper path may consume `Math.random()`.
   (`Math.random()` IS allowed for the seed *suggestion* button — choosing a
   seed is outside the deterministic boundary.) Because a cached device may
   hold an older bank, the bank version is *displayed* wherever the seed is
   displayed (see A6) so mismatched phones can notice before comparing.
6. **Graceful degradation.** All storage calls wrapped so private mode /
   quota errors degrade to the current no-persistence behavior without a
   thrown error reaching the console. Zero console errors on the happy path
   is an acceptance criterion of every batch.
7. **Accessibility floor.** Interactive elements are `<button>`/`<input>`/
   `<label>`; live status text uses `role="status"` + `aria-live="polite"`;
   injected interactive prompts (e.g. the B2 confirm) use `role="alert"` or
   move focus to their first button; focus-visible styles preserved; touch
   targets ≥ 44px tall; color is never the only signal.
8. **Style system.** Reuse the existing tokens/classes in `styles.css`
   (`.eyebrow`, `.btn`, `.screen`, spacing custom properties). New components
   get BEM-ish class names consistent with the file, with light AND dark
   `prefers-color-scheme` treatments.

### 0.9 DOM id contract (single source of truth — all batches)

New interactive elements use exactly these ids. `app.js` wires them via its
existing delegated listeners; `render.js`/`index.html` must emit them.

| id | element | batch |
|---|---|---|
| `#quiz-status` | sticky quiz header wrapper | B |
| `#quiz-progress` | "answered N/20" span inside it | B |
| `#quiz-timer` | "MM:SS" span inside it | B |
| `#submit-anyway-btn` / `#keep-going-btn` | unanswered-guard buttons | B |
| `#spin-seed-btn` | seed screen "Spin a seed" | B |
| `#resume-notice` | dismissible resumed-paper notice (`role="status"`) | A |
| `#reveal-answers-btn` | results answer-review toggle | C |
| `#answer-review` | the review list container | C |
| `#rematch-btn` / `#same-seed-btn` | results actions (these REPLACE the static `#restart-btn`, which is removed from `index.html`) | C |
| `#party-toggle` | "Pass-the-phone with friends" toggle | D |
| `#party-roster` / `#add-player-btn` | roster container / add-name button | D |
| `#screen-interstitial` | new static `<section class="screen screen--hidden">` in `index.html`, painted by `render.js` | D |
| `#interstitial-start-btn` | "I'm <name> — start" | D |
| `#screen-leaderboard` | new static `<section class="screen screen--hidden">` in `index.html` | D |
| `#leaderboard-rematch-btn` / `#leaderboard-done-btn` | leaderboard actions | D |

---

## 1. Data & storage

New module **`storage.js`** exporting exactly:

```js
export function loadState()            // -> State (see below), never throws
export function saveState(state)       // -> boolean success, never throws
export function clearSession()         // null out state.session only
```

One localStorage key: **`smarty.state.v1`**, JSON of:

```js
State {
  schemaVersion: 1,
  session: null | {            // in-progress paper (autosave)
    seed: number,
    startedAt: number | null,  // CURRENT player's clock, epoch ms; see D2.
                               // Solo: set at start. Never reset on resume.
    answers: Record<string,string>, // qid -> raw input value ('' omitted)
    party: null | Party,       // Batch D
  },
  lastGame: null | {           // most recently completed game (results restore)
    finishedAt: number,        // epoch ms
    seed: number,
    solo: null | { answers: Record<string,string>, elapsedMs: number },
    party: null | Party,       // completed party incl. per-player results
  },
  history: Array<{             // completed papers, newest first, cap 50
    seed: number,
    total: number, maxTotal: number,
    elapsedMs: number,
    finishedAt: number,
    player: string | null,     // null = solo
  }>,
}
Party {
  players: string[],           // 2..8 trimmed non-empty unique names
  current: number,             // index of the player now playing (or done)
  results: Array<null | {
    total: number, maxTotal: number, elapsedMs: number,
    answers: Record<string,string>,   // that player's raw answers (for review)
  }>,
}
```

Rules:
- `loadState()` returns a valid default `{schemaVersion:1, session:null,
  lastGame:null, history:[]}` on missing/corrupt data (`JSON.parse` wrapped).
- The paper itself is NOT stored — it is regenerated from the seed on
  restore (same seed + same bank ⇒ same paper). Marking is deterministic, so
  results screens are rebuilt by re-running `mark()` over stored answers.
- **Restore-failure rule:** a *bank load* failure (fetch error) preserves
  stored state untouched. Only a *loaded-bank* mismatch (regeneration throws,
  or a stored answer key matches no question id in the regenerated paper)
  drops the affected `session`/`lastGame` silently.

---

## 2. Batch A — Trust & resilience

### A0. Cache versioning restructure (Invariant 3)

In `sw.js`: replace the `QUESTION_BANK_VERSION`-derived name with
```js
const CACHE_VERSION = 2;              // bump in EVERY batch that changes a precached file
const CACHE_NAME = 'smarty-v' + CACHE_VERSION;
```
`activate` keeps deleting every `smarty-v*` ≠ current plus legacy `psle-v*`.
(Batch A ships `CACHE_VERSION = 2`; B → 3, C → 4, D → 5, E → 6.)

### A1. Offline-readiness indicator (fix H1/S3)

- In `app.js` `markOfflineReady()`: target `.offline-indicator__text` (the
  class that exists in `index.html`). Keep setting `data-ready` and the
  `--ready` class.
- Four states, one visible pill (`#offline-indicator`), transitions driven by
  SW readiness plus BOTH `window` `online` and `offline` events:
  1. not ready + online: "Getting ready for offline…"
  2. not ready + offline: "Not cached yet — open this app on wifi first."
  3. ready + online: "Ready for offline — flight mode is fine."
  4. ready + offline: "Offline and ready to play."
- `render.js`'s fallback pill must build its label span WITH
  `class="offline-indicator__text"` and state-1 copy (drop the "dead-time
  window" phrasing).

### A2. Autosave + resume + results restore (H4)

- `app.js`: on start, write `state.session`. Add a delegated `input`
  listener and extend the existing delegated `change` listener (currently
  MCQ-only, app.js:302) so BOTH radios and text fields autosave (text fields
  fire `change` only on blur — `input` is what saves keystrokes). Debounced,
  ≤1 write per 500ms. On submit: fill `lastGame`, append to `history` (cap
  50), clear `session`.
- **Boot order:** `renderSeedScreen` + wiring first (unchanged), then `await
  loadBank()`; only AFTER a successful bank load, attempt restore:
  1. `session` present → regenerate paper from seed, restore answer values
     into the form, re-apply `.option--selected` for restored radios (re-run
     the reflection logic or dispatch `change`), show the quiz directly with
     `#resume-notice` ("Resumed your paper — clock kept running.",
     `role="status"`, dismissible). Reuse `handleStart`'s
     bucket-derivation/generation path — no duplicated sampling logic. Keep
     the stored `startedAt` (clock keeps running).
     If `session.party != null`, restore to the interstitial instead — D4.
  2. else `lastGame` present AND `finishedAt` within 30 minutes → re-mark
     stored answers and show the results screen (solo) or leaderboard
     (party). Older `lastGame` stays stored (history) but boots to seed.
- "New paper" / rematch actions call `clearSession()` (and leave `lastGame`).

### A3. Per-question input mode (Q3)

- In `render.js`, short-numeric inputs choose the keyboard by inspecting the
  question: if `check.rule === 'fraction-equivalent'` or any string in
  `check.accepted` contains `/`, use `inputmode="text"`; else keep
  `inputmode="decimal"`.
- Under fraction-capable inputs add a static hint (class
  `question__hint`): "Fraction (like 3/4) or decimal — both fine." Generic
  string only (Invariant 4).

### A4. Single MCQ selection wiring (Q4)

- Delete the per-group `change` listener inside `renderQuiz`; keep the
  delegated one in `app.js` (idempotent, covers re-renders and restores).

### A5. Precache

- Add `./storage.js` to `PRECACHE_URLS`.

### A6. Bank version surfacing (Invariant 5)

- Add `"bankVersion": 1` to `questions.json` (Batch E bumps to 2). Display
  it wherever the seed is displayed: quiz meta ("Seed 1234 · bank v1"),
  results score card (Batch C inherits this), and appended to the share
  summary's seed line ("Seed 1234 · bank v1").

**Acceptance (A):** indicator text visibly changes to ready-state on
localhost and to state 4 with DevTools offline; killing and reloading the
page mid-paper restores answers (radios visually selected) + clock; reload
right after submit restores the results screen; fraction questions get
`inputmode="text"`; exactly one `.option--selected` handler path remains;
`CACHE_VERSION` present and = 2; quiz meta shows "bank v1"; no console
errors.

---

## 3. Batch B — Playing experience

### B1. Sticky quiz header (Q1, Q2)

- `#quiz-status` inside `#screen-quiz`, painted by `render.js`, containing
  `#quiz-progress` ("answered N/20") and `#quiz-timer` ("MM:SS");
  `position:sticky; top:0`, small text on the panel background, both color
  schemes.
- Timer: ONE module-level interval handle in `app.js` (1s tick); always
  `clearInterval` the handle before any `setInterval`; started when the quiz
  screen shows, cleared on submit, restart, interstitial entry, and
  leaderboard entry. Tick updates `#quiz-timer` textContent only — no
  re-render. Elapsed derives from `session.startedAt`.
- Answered-count updates from the A2 delegated `input`/`change` listeners.

### B2. Unanswered-submit guard (Q1) — explicit submit state machine

- One submit funnel: both the `#submit-btn` click and the `quiz-form`
  `submit` event (Enter key) call the same `requestSubmit()`.
- States: `idle → confirming → marked`. In `idle` with ≥1 blank:
  render the inline confirm in `.quiz-actions` — text "N unanswered — blanks
  score 0." with `#submit-anyway-btn` ("Submit anyway") and
  `#keep-going-btn` ("Keep going") — move focus to `#submit-anyway-btn`
  (Invariant 7), set `confirming`, and do NOT latch `resultsShown`.
  `#submit-anyway-btn` → mark exactly once (latch `resultsShown` there).
  `#keep-going-btn` or any answer change → back to `idle`, remove the
  confirm. Zero blanks in `idle` ⇒ mark directly (latch as today).

### B3. Seed screen: spin + copy diet (S1, S2, H5)

- `#spin-seed-btn`, ghost button next to the field: sets the input to a
  random integer 100–99999 (`Math.random` allowed here) and focuses the
  input so the new value is announced.
- Trim copy to: one lead sentence ("Say a number out loud — everyone who
  types it gets the same 20-question paper."), the input hint, and a single
  tie-breaker line: "Score wins; ties go to the faster time." Remove the
  standalone offline-note paragraph (the A1 pill carries that message now).

- Bump `CACHE_VERSION` to 3.

**Acceptance (B):** header shows live count/timer while scrolling and while
typing (not just on blur); Enter in a numeric field triggers the same guard
as the button; with blanks, first activation never marks and "Submit anyway"
marks exactly once; "Keep going" returns to the form; "Spin a seed" writes a
valid seed; seed screen has ≤2 paragraphs of prose besides the form;
`CACHE_VERSION` = 3; no console errors.

---

## 4. Batch C — The compare moment

### C1. Score card (R1, R2)

- Results screen leads with one glanceable card: seed + bank version (mono),
  score as the dominant element (clamp ~4–5rem), time beneath labelled
  "Tie-breaker: fastest time wins." Delete the separate "Comparison field"
  block and its jargon copy. Keep per-topic breakdown and the grid below.

### C2. Spoiler-gated answer review (R3)

- Below the grid: `#reveal-answers-btn` ("Reveal answers", microcopy
  "spoilers for anyone still playing") expanding `#answer-review` — per
  question: the prompt, the player's answer, and the correct answer.
  Collapsed by default on every render.
- Display rules: player's MCQ answer renders as
  `question.options[Number(value)]` (out-of-range/absent ⇒ "blank");
  short-numeric renders the raw string or "blank". Correct answer: MCQ ⇒
  `question.options[question.answer]`; short-numeric ⇒
  `String(question.answer)`.
- Contract change: `renderResults(result, seed, extras)` with
  `extras = { paper, answers, bankVersion }`. `answers` MAY be null →
  render the review with the correct-answer column only (leaderboard use).
  `render.js` tolerates `extras` absent entirely (no review section).

### C3. Rematch loop (R4)

- Results actions become `#rematch-btn` ("Rematch: new seed", primary —
  spins a fresh seed, prefills it, returns to the seed screen with the new
  seed focused to read aloud) and `#same-seed-btn` ("Same seed again",
  ghost — seed screen, played seed kept). The static `#restart-btn` is
  removed from `index.html`.

### C4. Offline-aware share row (R5)

- WhatsApp/Telegram buttons render `disabled` with visible "needs internet"
  text when `navigator.onLine` is false, toggled by BOTH `online` and
  `offline` events (mirror A1). "Copy summary" always enabled. Share summary
  text unchanged except the seed line now carries the bank version (A6).

- Bump `CACHE_VERSION` to 4.

**Acceptance (C):** score readable at arm's length (screenshot check);
review absent until tapped, then shows all 20 with correct answers and
proper MCQ option text (never a bare index); rematch prefills a fresh seed
and `#restart-btn` no longer exists; toggling DevTools offline live-disables
messenger buttons and back; `CACHE_VERSION` = 4; no console errors.

---

## 5. Batch D — Pass-the-phone party mode (H2)

### D1. Roster

- Seed screen, under the form: `#party-toggle` ("Pass-the-phone with
  friends"). Expanded: `#party-roster` name inputs (start with 2,
  `#add-player-btn` up to 8, trims blanks, rejects duplicates inline), then
  the same Start button. No roster ⇒ existing solo flow, behavior unchanged.

### D2. Turn loop & per-player clock

- With a roster: Start builds ONE paper from the seed (once).
  `session.startedAt` is defined as the CURRENT player's clock:
  - It is set (epoch now) the first time that player enters the quiz via
    `#interstitial-start-btn` — NOT at party creation, NOT on the
    interstitial.
  - It is nulled when advancing to the next player.
  - On resume it is reused as-is if non-null (reload ≠ free pause; the
    interstitial-after-reload does not reset a running clock).
- Flow per player: `#screen-interstitial` ("Hand the phone to <name>",
  single `#interstitial-start-btn`) → quiz renders FRESH (blank controls)
  for that player → on submit store `{total,maxTotal,elapsedMs,answers}` in
  `party.results[current]`, append to `history` with the player name, show
  their personal result card WITHOUT the answer-review section (spoilers),
  with a "Pass to <next name>" action → next interstitial. After the last
  player: leaderboard.

### D3. Leaderboard

- `#screen-leaderboard` painted by `render.js`: ranked rows — rank, name,
  score `x/20`, time — sorted score desc, then elapsed asc, then roster
  order; winner row visually promoted. Actions: `#leaderboard-rematch-btn`
  ("Rematch: new seed" — same roster, fresh seed, back to interstitial flow)
  and `#leaderboard-done-btn` ("Done" — clears party + session, seed
  screen).
- Answer review from the leaderboard uses C2 with `extras.answers = null`
  (correct answers only — per-player answer sheets are out of scope for the
  leaderboard view even though `party.results[i].answers` is stored).

### D4. Persistence

- `party` lives inside `state.session` (Section 1). Resume with
  `session.party != null` ALWAYS lands on the current player's interstitial
  (never directly in the quiz); tapping `#interstitial-start-btn` then
  restores that player's autosaved answers and their non-null `startedAt`.
  A finished party moves to `lastGame.party` and restores to the
  leaderboard (A2 boot rule 2).

- Bump `CACHE_VERSION` to 5.

**Acceptance (D):** solo flow byte-identical when the toggle is untouched;
a 3-player run yields a leaderboard correctly ordered incl. a time-broken
tie; reload mid-party lands on the correct interstitial and the returning
player's clock did NOT reset; player 2 cannot see player 1's filled quiz;
personal result cards hide answer review until the party ends;
`CACHE_VERSION` = 5; no console errors.

---

## 6. Batch E — Question bank expansion (H6)

- Extend `questions.json` to ≥60 questions: same 6 topics (Fractions,
  Decimals, Percentage, Ratio, Area & Perimeter, Average), ≥10 each; keep the
  schema (`id` pattern `pm-<slug>-NN`, unique; `type` mcq | short-numeric
  roughly balanced; `difficulty` 1–5 with a spread per topic; `check.rule` ∈
  exact | tolerance | fraction-equivalent as appropriate). Set
  `"bankVersion": 2`.
- Every new question independently verifiable: prompts self-contained,
  numeric answers exact (no ambiguous rounding unless `tolerance` states
  it), MCQ has exactly one correct option and 3 plausible distractors,
  `accepted` lists every reasonable equivalent form consistent with each
  other.
- **New `tests/bank-validate.mjs`** (node, imports the real
  `checkRules.js`): asserts unique ids, valid enum fields, options length 4
  with in-range `answer` index for MCQ, every `accepted` string parses via
  `parseNumeric`, all `accepted` entries of a fraction-equivalent question
  mutually equivalent, and every short-numeric canonical `answer` passes its
  own check rule. Exits non-zero on any failure. Not precached.
- Bump `CACHE_VERSION` to 6.

**Acceptance (E):** `node tests/bank-validate.mjs` passes; an independent
verification pass re-derives every new answer from its prompt and finds no
errors (failing questions are DROPPED, not patched blind); bank ≥60 with
`bankVersion: 2`; `CACHE_VERSION` = 6; no console errors.

---

## 7. Verification plan (after all batches)

1. `node tests/bank-validate.mjs` green.
2. Headless-Chromium end-to-end on a local server: solo happy path (seed →
   20 questions → submit with 1 blank → guard → results → reveal answers),
   resume path (reload mid-quiz), results-restore path (reload after
   submit), 2-player party path incl. mid-party reload, all with
   `console`/`pageerror`/`requestfailed` = 0; full-page screenshots.
3. `grep`-level checks: all precache entries exist on disk; no absolute
   (`/x`) asset paths; final `CACHE_VERSION` = 6; no user-visible `PSLE`.
4. Push to `main`, Pages deploy green, live-file hash spot-check.

## 8. Risks & mitigations

- **LLM-authored math errors (Batch E)** — validator script + independent
  verification agent re-deriving every answer; failures are dropped.
- **State-machine regressions (Batches B/D)** — submit funnel and clock
  semantics are pinned above; solo flow must stay on the `party === null`
  path untouched; dedicated review stage per batch.
- **Cache staleness** — per-batch `CACHE_VERSION` bumps (A0) guarantee
  cache-first devices pick up every shipped batch on next SW update.
