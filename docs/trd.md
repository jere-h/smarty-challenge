# Smarty Challenge — Technical Requirements Document (TRD)

Implements `docs/improvement-plan.md`. Audience: coding agents working in
batches; each batch section is self-contained and ends with acceptance
criteria a reviewer can check mechanically.

---

## 0. Invariants (apply to every batch — violating any is a review blocker)

1. **Static, no build step.** Plain ES modules served as-is. No bundler, no
   npm dependencies, no TypeScript. New files must use relative imports
   (`./x.js`) and relative asset paths — the site serves from a project
   subpath (`/smarty-challenge/`).
2. **Module boundaries stay as-is.**
   - `render.js` only paints DOM. It never fetches, never touches storage,
     never imports siblings other than nothing (it currently imports nothing —
     keep it that way). Data in via arguments only.
   - `app.js` owns Session state and event wiring (delegated listeners on
     `document`), and is the only module that calls storage.
   - `checkRules.js`, `marker.js`, `sampler.js`, `prng.js`, `validation.js`
     stay pure (no DOM, no I/O). **Do not touch `prng.js` or `sampler.js`'s
     draw order at all** — determinism across devices is the product.
   - New module `storage.js` (Batch A) is the only place `localStorage` is
     named.
3. **Offline-first.** Every new same-origin file the page loads at runtime
   MUST be added to `PRECACHE_URLS` in `sw.js` in the same batch. `docs/` and
   `tests/` are never precached. Any batch that changes the question bank or
   precache list must keep the "atomic install, delete stale caches on
   activate" behavior intact.
4. **No spoilers in shared or visible text.** The share summary never contains
   prompts, options, or answers (existing rule). New rule: input hints must be
   generic strings — never derived from a question's `answer`/`accepted`
   values.
5. **Determinism.** Same seed ⇒ identical paper on every device. Nothing in
   the quiz/paper path may consume `Math.random()`. (`Math.random()` IS
   allowed for the seed *suggestion* button — choosing a seed is outside the
   deterministic boundary.)
6. **Graceful degradation.** All storage calls wrapped so private mode /
   quota errors degrade to the current no-persistence behavior without a
   thrown error reaching the console. Zero console errors on the happy path
   is an acceptance criterion of every batch.
7. **Accessibility floor.** Interactive elements are `<button>`/`<input>`/
   `<label>`; live status text uses `role="status"` + `aria-live="polite"`;
   focus-visible styles preserved; touch targets ≥ 44px tall; color is never
   the only signal (pair icons/text).
8. **Style system.** Reuse the existing tokens/classes in `styles.css`
   (`.eyebrow`, `.btn`, `.screen`, spacing custom properties). New components
   get BEM-ish class names consistent with the file. Both light and dark
   schemes must be handled (the file already has `prefers-color-scheme`
   blocks — extend them for new components).

---

## 1. Data & storage

New module **`storage.js`** exporting exactly:

```js
export function loadState()            // -> State (see below), never throws
export function saveState(state)       // -> boolean success, never throws
export function clearSession()         // remove state.session only
```

One localStorage key: **`smarty.state.v1`**, JSON of:

```js
State {
  schemaVersion: 1,
  session: null | {            // in-progress paper (autosave)
    seed: number,
    startedAt: number,         // epoch ms — elapsed survives reload
    answers: Record<string,string>, // qid -> raw input value ('' omitted)
    party: null | Party,       // Batch D
  },
  history: Array<{             // completed papers, newest first, cap 50
    seed: number,
    total: number, maxTotal: number,
    elapsedMs: number,
    finishedAt: number,        // epoch ms
    player: string | null,     // Batch D; null = solo
  }>,
}
Party {
  players: string[],           // 2..8 trimmed non-empty unique names
  current: number,             // index of the player now playing
  results: Array<null | { total:number, maxTotal:number, elapsedMs:number }>,
}
```

Rules: `loadState()` returns a valid default `{schemaVersion:1, session:null,
history:[]}` on missing/corrupt/oversized data (`JSON.parse` wrapped). The
paper itself is NOT stored — it is regenerated from the seed on resume (same
seed ⇒ same paper), so a bank version change simply invalidates resume: if
regeneration or answer-key matching fails, drop the session silently.

---

## 2. Batch A — Trust & resilience

### A1. Offline-readiness indicator (fix H1/S3)

- In `app.js` `markOfflineReady()`: target `.offline-indicator__text` (the
  class that exists in `index.html`). Keep setting `data-ready` and the
  `--ready` class.
- Three states, one visible pill (`#offline-indicator`):
  1. default: "Getting ready for offline…"
  2. ready (SW active): "Ready for offline — flight mode is fine."
  3. ready + currently offline (`navigator.onLine === false`): "Offline and
     ready to play."
  Listen to `window` `online`/`offline` events to move between 2 and 3.
- `render.js` fallback pill copy becomes state 1's text (drop "dead-time
  window" phrasing).

### A2. Autosave + resume (H4)

- `app.js`: on start, write `state.session`; debounce-save answers on the
  delegated `change`/`input` listeners (≤1 write per 500ms is fine); on
  submit, move the outcome into `history` (cap 50, newest first) and clear
  `session`.
- On boot, if `loadState().session` exists: regenerate the paper from the
  stored seed, restore answer values into the form, and show the quiz screen
  directly with a dismissible one-line notice "Resumed your paper — clock
  kept running." Restore MUST reuse `handleStart`'s paper-generation path
  (same bucket derivation) — no duplicated sampling logic.
- Elapsed time keeps using `startedAt` epoch so a reload doesn't reset the
  clock. A "New paper" / restart action calls `clearSession()`.

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
  delegated one in `app.js` (it is idempotent and covers re-renders).

### A5. Precache

- Add `./storage.js` to `PRECACHE_URLS`.

**Acceptance (A):** indicator text visibly changes to ready-state on
localhost; killing and reloading the page mid-paper restores answers + clock;
fraction questions get a text keyboard (`inputmode` attribute assertable);
exactly one `.option--selected` handler path remains; no console errors.

---

## 3. Batch B — Playing experience

### B1. Sticky quiz header (Q1, Q2)

- New element inside `#screen-quiz`, painted by `render.js`, updated by
  `app.js`: `answered N/20 · MM:SS`, sticky at viewport top
  (`position:sticky`), unobtrusive (small text on the panel background,
  respecting both color schemes).
- Timer: one `setInterval` (1s) owned by `app.js`, started on quiz show,
  stopped on submit/restart; renders via a tiny DOM update, not a re-render.
  Answered-count updates from the existing delegated `change`/`input`
  listeners.

### B2. Unanswered-submit guard (Q1)

- On submit with ≥1 blank: do NOT mark. Render an inline confirm in
  `.quiz-actions`: "3 unanswered — blanks score 0." with buttons
  **"Submit anyway"** and **"Keep going"**. No `window.confirm`. Second
  submit via "Submit anyway" proceeds. Zero blanks ⇒ direct submit.

### B3. Seed screen: spin + copy diet (S1, S2, H5)

- Add a ghost button **"Spin a seed"** next to the field: sets the input to a
  random integer 100–99999 (`Math.random` allowed here), focuses/announces it.
- Trim copy to: one lead sentence ("Say a number out loud — everyone who
  types it gets the same 20-question paper."), the input hint, and a single
  tie-breaker line: "Score wins; ties go to the faster time." Remove the
  standalone offline-note paragraph (the pill from A1 now carries that
  message).

**Acceptance (B):** header shows live count/timer while scrolling; submitting
with blanks requires the explicit second tap; "Spin a seed" changes the input
to a valid seed; seed screen has ≤2 paragraphs of prose besides the form; no
console errors.

---

## 4. Batch C — The compare moment

### C1. Score card (R1, R2)

- Results screen leads with one glanceable card: seed (mono), score as the
  dominant element (clamp ~4–5rem), time beneath labelled
  "Tie-breaker: fastest time wins." Delete the separate "Comparison field"
  block and its jargon copy. Keep per-topic breakdown and the emoji-style
  grid below the card.

### C2. Spoiler-gated answer review (R3)

- Below the grid: a **"Reveal answers"** button (with "spoilers for anyone
  still playing" microcopy) that expands a list — per question: the prompt,
  the player's answer (or "blank"), and the correct answer (MCQ: correct
  option text; short-numeric: `String(question.answer)`). Collapsed by
  default on every render.
- Requires paper+answers at render time: change the render contract to
  `renderResults(result, seed, extras)` where
  `extras = { paper, answers }`; `app.js` passes them from the session it
  already holds. `render.js` must tolerate `extras` being absent (renders
  without the review section).

### C3. Rematch loop (R4)

- Results actions become: **"Rematch: new seed"** (primary — spins a fresh
  seed, prefills it, returns to seed screen with the new seed highlighted to
  read aloud) and "Same seed again" (ghost — back to seed screen with the
  played seed kept).

### C4. Offline-aware share row (R5)

- When `navigator.onLine` is false: WhatsApp/Telegram buttons render
  `disabled` with visible text "needs internet"; they re-enable on the
  `online` event. "Copy summary" always enabled. The share summary text
  itself is unchanged except the already-renamed title.

**Acceptance (C):** score readable at arm's length (manual screenshot check);
review section absent until tapped, then shows all 20 with correct answers;
rematch prefills a fresh seed; with DevTools offline, messenger buttons are
disabled and copy still works; no console errors.

---

## 5. Batch D — Pass-the-phone party mode (H2)

### D1. Roster

- Seed screen, under the form: toggle **"Pass-the-phone with friends"**.
  Expanded: name inputs (start with 2, "Add player" up to 8, trims blanks,
  rejects duplicates inline), then the same Start button. No roster ⇒
  existing solo flow, byte-for-byte unchanged behavior.

### D2. Turn loop

- With a roster: Start builds ONE paper from the seed (once). For each player
  in order: an interstitial screen "Hand the phone to <name>" with a single
  **"I'm <name> — start"** button (prevents seeing the previous player's
  filled form); then the quiz renders **fresh** (blank controls) for that
  player; timer runs per player (their own `startedAt`).
- On each submit: store that player's `{total,maxTotal,elapsedMs}` in
  `party.results`, append to `history` with `player` name, show their
  personal result card briefly with **"Pass to <next name>"** — skipping the
  answer-review section until the party is done (spoilers, Invariant 4).
- After the last player: leaderboard.

### D3. Leaderboard

- New section `#screen-leaderboard` (in `index.html`, painted by
  `render.js`): ranked rows — rank, name, score `x/20`, time — sorted score
  desc then elapsed asc then roster order. Winner row visually promoted.
  Actions: "Rematch: new seed" (same roster, new seed → back to interstitial
  flow) and "Done" (clears party, seed screen).
- Answer review (C2) is available from the leaderboard once all players
  finished.

### D4. Persistence

- `party` lives inside `state.session` (Section 1) so a mid-party reload
  resumes at the correct player's interstitial (never mid-quiz with another
  player's answers). Current player's in-progress answers autosave as in A2.

**Acceptance (D):** solo flow unchanged when toggle untouched; 3-player run
produces a correctly ordered leaderboard incl. tie broken by time; reload
mid-party resumes at the right interstitial; player 2 can never see player
1's filled quiz; no console errors.

---

## 6. Batch E — Question bank expansion (H6)

- Extend `questions.json` to ≥60 questions: same 6 topics (Fractions,
  Decimals, Percentage, Ratio, Area & Perimeter, Average), ≥10 each; keep the
  schema (`id` pattern `pm-<slug>-NN`, unique; `type` mcq | short-numeric
  roughly balanced; `difficulty` 1–5 with a spread per topic; `check.rule` ∈
  exact | tolerance | fraction-equivalent as appropriate).
- Every new question must be independently verifiable: prompts self-contained,
  numeric answers exact (no ambiguous rounding unless `tolerance` states it),
  MCQ has exactly one correct option and 3 plausible distractors, `accepted`
  lists every reasonable equivalent form (fraction, decimal) consistent with
  each other.
- **New `tests/bank-validate.mjs`** (node, imports the real `checkRules.js`):
  asserts unique ids, valid enum fields, options length 4 with in-range
  `answer` index for MCQ, every `accepted` string parses via `parseNumeric`,
  all `accepted` entries of a fraction-equivalent question are mutually
  equivalent, and every short-numeric canonical `answer` passes its own
  check rule. Exits non-zero on any failure. Not precached.
- Bump `QUESTION_BANK_VERSION` to 2 in `sw.js` (mints `smarty-v2`, deletes
  `smarty-v1` and legacy `psle-v*` on activate).

**Acceptance (E):** `node tests/bank-validate.mjs` passes; a human-style
review of a sample of new questions confirms mathematical correctness; bank
≥60; version bumped; no console errors.

---

## 7. Verification plan (after all batches)

1. `node tests/bank-validate.mjs` green.
2. Headless-Chromium end-to-end on a local server of the built files: solo
   happy path (seed → 20 questions → submit with 1 blank → guard → results →
   reveal answers), resume path (reload mid-quiz), 2-player party path, all
   with `console`/`pageerror`/`requestfailed` = 0; full-page screenshots.
3. `grep`-level checks: all precache entries exist on disk; no absolute
   (`/x`) asset paths; no `PSLE` string anywhere user-visible.
4. Push to `main`, Pages deploy green, live-file hash spot-check.

## 8. Risks & mitigations

- **LLM-authored math errors (Batch E)** — mitigated by the validator script
  plus an independent verification agent re-deriving every answer; any
  question failing either is dropped, not patched blind.
- **State-machine regressions from party mode (Batch D)** — mitigated by
  keeping solo flow on the `party === null` path untouched and a dedicated
  review stage on the diff.
- **Cache staleness** — SW byte-change triggers reinstall; final deploy bumps
  the cache version anyway (Batch E).
