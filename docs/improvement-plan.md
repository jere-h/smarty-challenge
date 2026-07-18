# Smarty Challenge — critical-path experience review & improvement plan

**Persona for this review:** a casual user (not a student grinding revision) who
wants to challenge friends to a math paper **during a flight, with no internet**.
Phones are in flight mode; friends can talk across seats; nobody can download
anything mid-air.

The review walks the critical path top-down: the high-level experience first,
then screen-by-screen UI detail. Each finding is tagged **[additive]** (add
something) or **[subtractive]** (remove/demote something), plus **[bug]** where
current behavior is broken.

---

## 1. High-level experience findings

### H1. The offline promise is invisible — and its indicator is broken [bug]

The whole product hinges on "cache once on wifi, play in the air", yet the only
signal is a small pill that **never updates**: `app.js` writes the ready label
into `.offline-indicator__label`, but `index.html` names the element
`.offline-indicator__text`, so every user stares at "Loading questions…"
forever. A casual user pre-flight cannot tell whether the app is safe to rely
on; mid-flight they conclude it is broken. This is the single most damaging
defect for the flight scenario.

**Fix:** repair the selector mismatch; make readiness a first-class state
("Ready for offline ✓ / Not cached yet — open on wifi first"), driven by both
service-worker readiness and `navigator.onLine`.

### H2. Only one phone in the group may have the app cached [additive — biggest gap]

Mid-flight there is no way for friend #2 to install the app. Today that kills
the entire premise: the challenge silently degrades to "watch me play". The
app should embrace its worst case with a **pass-the-phone mode**: players add
their names, each plays the *same seed* in turn on one device, and a
leaderboard ranks score-then-time at the end. This turns the degraded case into
the party case, and costs no new screens beyond a roster + leaderboard.

### H3. The compare moment is designed for the internet the users don't have [subtractive + additive]

The results screen leads with WhatsApp/Telegram buttons — both dead links in
flight mode (`wa.me`/`t.me` require network). Meanwhile the actual mid-air
comparison mechanism — *showing your screen across the aisle* — gets no design
support: the score is mid-sized, surrounded by prose.

**Fix:** demote/disable the messenger buttons when offline (keep them for
post-flight bragging), and make the score panel a **glanceable score card**:
huge seed + score + time readable at arm's length.

### H4. A dropped session loses the whole paper [additive]

Locking the phone, an accidental refresh, or the browser evicting the tab
throws away all 20 answers and the running clock — mid-flight, with no way to
"just reload". The session (seed, answers, start time) should autosave to
`localStorage` and offer a **resume** on next load. Completed results should
persist too, so the results screen survives a refresh and past scores feed the
leaderboard.

### H5. Time is the tie-breaker but is hidden until the end [additive]

The rules say "on a tied score, the shorter time wins" — but the player only
learns this *after* submitting, and can't see the clock while playing. Show a
running timer during the quiz and state the rule up front ("Score wins; ties go
to the faster time").

### H6. Replay value is capped by a 36-question bank [additive]

A 20-question paper drawn from 36 questions means any two seeds share most of
their questions; the second game already feels familiar — a real problem on a
long flight. Expand the bank (same 6 topics, same schema) to at least 60
questions, with every new item's answer and accepted forms independently
verified. Bump `QUESTION_BANK_VERSION` so cached devices refresh.

---

## 2. Screen-level findings (in critical-path order)

### Seed screen

- **S1 [additive] Random seed.** Everyone leaves the prefilled `1234`, so every
  group plays the same paper every time. Add a "Spin a seed" button that
  generates a short random number, displayed big enough to read aloud.
- **S2 [subtractive] Copy diet.** Three paragraphs (lead, hint, offline note)
  before the button. Tighten to one lead line + one hint; move the wifi note
  into the offline-readiness pill states (H1) instead of standing prose.
- **S3 [bug] Fallback pill copy.** `render.js`'s fallback pill text ("before
  the dead-time window") is internal jargon; it must never reach users.

### Quiz screen

- **Q1 [additive] Progress + unanswered guard.** No count of answered
  questions and no warning on submit; blanks silently score 0. Add a sticky
  "answered 13/20" progress line and an "N unanswered — submit anyway?"
  confirm step.
- **Q2 [additive] Running timer.** Per H5, show elapsed time in the sticky
  header.
- **Q3 [bug] Wrong keyboard for fraction answers.** Short-numeric inputs are
  `inputmode="decimal"`, but several questions ask for the answer *as a
  fraction* — the iOS decimal keyboard has no `/` key. Choose the input mode
  per question (text keyboard when any accepted form contains `/`), and hint
  "fractions or decimals both fine" where the check rule accepts both.
- **Q4 [subtractive] Redundant selection wiring.** MCQ selection styling is
  applied twice (a delegated listener in `app.js` and a per-group listener in
  `render.js`). Keep one.

### Results screen

- **R1 [additive] Show-your-screen score card** (H3): seed, huge score, time,
  one glance.
- **R2 [subtractive] De-jargonize.** "Comparison field" / "shared summary
  comparison field" is spec language. Fold time into the score card labelled
  "Tie-breaker: fastest time wins", and delete the separate explainer block.
- **R3 [additive] Answer review.** A math app that won't show you what the
  right answer was wastes its teaching moment and the post-game conversation.
  Add a collapsed "Review answers" section (question, your answer, correct
  answer, per question) behind a spoiler warning so a friend mid-paper isn't
  spoiled by a glance.
- **R4 [additive] Rematch loop.** "New paper" dumps you back at the seed
  screen with the same stale seed. Add "Rematch: new seed" that spins a fresh
  seed (S1) to read aloud, keeping the group loop going.
- **R5 [subtractive/additive] Offline-aware share row** (H3): hide or disable
  WhatsApp/Telegram when `navigator.onLine` is false; "Copy summary" stays.

---

## 3. Consolidated improvement plan

Ordered so each batch is independently shippable and reviewable; earlier
batches carry the highest experience-per-line-of-code.

**Batch A — Trust & resilience (bugs first).**
Fix the offline-readiness indicator (H1, S3); explicit offline/cached states;
session autosave + resume + persisted results (H4); per-question input mode
(Q3); remove duplicate MCQ wiring (Q4).

**Batch B — Playing experience.**
Sticky quiz header with progress + running timer (Q1, Q2); unanswered-submit
guard (Q1); random-seed generation on the seed screen + copy diet (S1, S2);
up-front tie-breaker wording (H5).

**Batch C — The compare moment.**
Glanceable score card with time-as-tie-breaker (R1, R2); spoiler-gated answer
review (R3); rematch-with-new-seed loop (R4); offline-aware share row (R5).

**Batch D — Pass-the-phone party mode (H2).**
Optional player roster before start; per-player turns on the same seed;
score-then-time leaderboard; persisted per-device history feeding it.

**Batch E — Question bank expansion (H6).**
36 → 60+ questions across the existing 6 topics and schema; every new
question's answer and accepted equivalents independently re-derived and
verified; `QUESTION_BANK_VERSION` bump to 2.

Non-goals for this round: accounts, servers, cross-device sync, question
authoring UI, non-math subjects, i18n.
