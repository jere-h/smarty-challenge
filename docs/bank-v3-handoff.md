# Handoff: Question Bank v3 — researched, principle-derived, verified

You are working in `jere-h/smarty-challenge` — a static, offline-first,
seeded quiz web app (plain ES modules, no build step) deployed to GitHub
Pages at `https://jere-h.github.io/smarty-challenge/`. Your mission is to
**replace the current question bank** (`questions.json`, 66 mostly one-step
items) with **60 reliable, verified, multi-step questions of medium-to-hard
difficulty**, grounded in real PSLE-style mathematics, and ship them live.

Work autonomously end to end. Use a workflow (multi-agent orchestration via
the Workflow tool) for the fan-out phases — research, generation, and blind
verification are embarrassingly parallel and benefit from independent agents.

---

## Mission summary

1. **Research** real PSLE-level math questions (Singapore Primary 6 leaving
   exam) to identify what genuinely non-trivial questions look like.
2. **Extract the core principles** (archetypes) those questions test.
3. **Generate original questions** by permuting those archetypes — new
   numbers, new contexts, never copied text.
4. **Verify every question** through independent blind re-solving.
5. **Integrate** into the app, run its checks, push to `main`, confirm the
   Pages deploy is green and the live site serves the new bank.

## Hard constraints (violating any of these is a failure)

- **Legal/branding:** The string "PSLE" must NEVER appear in any shipped,
  user-visible content (question text, UI strings, share text, manifest,
  README). It was deliberately removed from this app for trademark-liability
  reasons. It may appear in `docs/` research notes only. Same for "SEAB" or
  any school/exam-board name inside question prompts.
- **Copyright:** Never republish a sourced question verbatim or
  near-verbatim. Sourced questions are inputs for *analysis only* — extract
  the tested principle, then write an original question with different
  numbers, context, and phrasing. Do not scrape paywalled or login-gated
  content; prefer syllabus outlines, publicly posted sample/specimen
  questions, teacher-blog worked examples, and published question-type
  taxonomies.
- **Difficulty floor:** No one-step questions. Every question must require
  ≥2 reasoning steps (a computation chained through an intermediate result,
  a model/bar-method setup, a before-after comparison, working backwards,
  etc.). Use only difficulty values 3, 4, 5 (the app's ramp handles a
  missing warm-up band): 3 = solid two-step, 4 = three-step or
  model-method, 5 = multi-concept or insight-required. Aim for roughly
  40% / 40% / 20% across 3/4/5.
- **Determinism & app contracts:** Do not touch `prng.js` or `sampler.js`.
  Papers are 20 questions drawn topic-proportionally from the bank
  (`app.js:buildTopicBuckets`), so keep **6 topics × 10 questions each**.
  Topic names are free BUT pick names whose lowercase matches the glyph
  regexes in `render.js:topicGlyph` (`frac|dec|perc|ratio|area|perim|geom|
  volume|measure|angle|whole|number|rate|speed|time|money|dollar`) so each
  topic keeps an icon — e.g. "Fractions", "Percentage", "Ratio",
  "Speed & Rate", "Area & Volume", "Whole Numbers".

## The question schema (unchanged — see `questions.json`)

```json
{
  "id": "pm-<topic-slug>-NN",        // unique across the bank
  "topic": "Ratio",
  "difficulty": 4,                    // 3 | 4 | 5 only for this bank
  "type": "mcq" | "short-numeric",
  "prompt": "…",                      // self-contained; units stated in the
                                      // prompt ("…, in cm²"), NEVER in the answer
  "options": ["…","…","…","…"],       // mcq only: exactly 4, one correct
  "answer": 2,                        // mcq: correct option INDEX
                                      // short-numeric: canonical string, e.g. "7/8" or "42.5"
  "check": { "rule": "exact" | "tolerance" | "fraction-equivalent",
             "tolerance": 0.01,       // tolerance rule only
             "accepted": ["…"] }      // every reasonable equivalent form
}
```

Top-level: keep `schemaVersion: 1`, set `"bankVersion": 3`. Short-numeric
answers must parse via `checkRules.js:parseNumeric` (plain decimals,
fractions `n/d`, mixed numbers — no units, no ranges, no "or" answers; if a
question's answer can't be expressed that way, make it MCQ instead).
`tests/bank-validate.mjs` enforces schema/consistency mechanically — it must
exit 0. Mix roughly half MCQ / half short-numeric per topic. MCQ distractors
must be *derived from real error modes* of the archetype (e.g. forgetting
the "before" quantity changed, ratio applied to the wrong whole), not random
numbers.

## Phase plan

### Phase 1 — Research & sourcing (parallel web-research agents)

Fan out researchers by angle, e.g.: the official Primary 6 math syllabus
topic list; published specimen/sample questions; teacher/tutor sites
explaining "challenging problem types" (model method, before-after,
remainder concept, repeated identity, units-and-parts, gap-and-difference,
working backwards, rate/combined work, overlap/exclusion, pattern
generalization); and worked-solution walkthroughs of hard past questions.
Each researcher records, per sourced example: source URL, topic, a
*paraphrase* of the problem, the solution path, why it's non-trivial, and
the named principle it tests. Target ≥40 sourced examples across all six
topics before moving on. Write the corpus to `docs/bank-v3-research.md`.

### Phase 2 — Archetype catalog (single synthesis agent)

Distill the corpus into 12–20 named archetypes, each with: the core
principle, the reasoning steps required, its topic(s), a difficulty rating
rationale, the canonical solution strategy, and 2–3 common student errors
(these become MCQ distractors). Every archetype must map to ≥2 sourced
examples. Write to `docs/bank-v3-archetypes.md`. This catalog — not the
sourced questions — is the generator's only input, which is what keeps the
output original.

### Phase 3 — Generation (parallel per-topic agents)

Per topic, generate ~12 candidate questions (over-generate; verification
will cull to 10) by permuting archetypes: fresh numbers chosen so
intermediate values stay clean (kid-computable without a calculator), fresh
real-world contexts, varied surface forms so two questions from one
archetype don't look like siblings. Each candidate ships with a full worked
solution (kept in `docs/`, never in `questions.json`) and its archetype id.
Numbers must be re-derived, not templated blindly — the generator must solve
its own question as it writes it.

### Phase 4 — Verification (the reliability gate; parallel blind solvers)

For EVERY candidate:
1. **Two independent blind solvers** (separate agents, higher reasoning
   effort) receive ONLY the prompt (and options for MCQ) — never the claimed
   answer — and must produce a worked answer.
2. **Consensus rule:** both solvers agree with the author's answer → pass.
   Any disagreement → one arbiter agent adjudicates with full visibility;
   unless the arbiter finds a *certain* fix (e.g. a typo'd option), the
   question is DROPPED, never patched blind. MCQ additionally fails if any
   solver finds a second defensible option.
3. **Mechanical gate:** `node tests/bank-validate.mjs` green; also verify
   every `accepted` list is complete (decimal + fraction forms where both
   are natural) and mutually equivalent.
4. **Difficulty audit:** a reviewer confirms every survivor needs ≥2 steps
   and difficulty labels are honest; one-step survivors are dropped.
Cull to exactly 10 per topic (keep the best difficulty spread). If a topic
falls short, loop Phase 3 for that topic only. Record per-question
provenance (question id → archetype → sourced-inspiration URLs) in
`docs/bank-v3-provenance.md`.

### Phase 5 — Integration & ship

1. Replace `questions.json` (60 questions, `bankVersion: 3`). Keep ids
   fresh (`pm-…`), don't reuse old ids with new content.
2. Bump `CACHE_VERSION` in `sw.js` (cache-first devices only refresh on a
   bump — this is mandatory, see `docs/trd.md` Invariant 3).
3. Checks: `node tests/bank-validate.mjs`; `node --check` on any touched JS;
   then a headless-Chromium smoke on a local server (Playwright is global at
   `/opt/node22/lib/node_modules`, CommonJS default import; Chromium
   preinstalled — do NOT `playwright install`): seed 1234 → 20 questions
   render → answer → submit → results, with console/pageerror/requestfailed
   all 0. Verify the drawn paper contains no difficulty <3 and quiz meta
   shows "bank v3".
4. Commit (git identity: `Claude` / `noreply@anthropic.com`) and push to
   `main`. Watch the `deploy-pages.yml` run via the GitHub MCP Actions tools
   until green (no `gh` CLI here). Hash-compare the live
   `questions.json` against the local file (the session proxy allows curl to
   `github.io`; headless Chromium may be blocked — verify locally in that
   case, per `docs/trd.md` §7).

## Definition of done

- [ ] `questions.json`: exactly 60 questions, 6 topics × 10, `bankVersion: 3`,
      difficulties ∈ {3,4,5} only, ~half MCQ / half short-numeric.
- [ ] Every question passed two blind solvers + arbiter; zero patched-blind
      questions; drops are logged with reasons in provenance.
- [ ] `docs/bank-v3-research.md`, `docs/bank-v3-archetypes.md`,
      `docs/bank-v3-provenance.md` committed.
- [ ] No "PSLE" (or exam-board names) in any shipped user-visible string;
      no verbatim sourced text in any prompt.
- [ ] `bank-validate.mjs` green; E2E smoke green with zero console errors.
- [ ] `CACHE_VERSION` bumped; pushed to `main`; Pages deploy green; live
      `questions.json` hash matches local.

## Working agreements

- Sequential phases, parallel inside a phase; don't start generation until
  the archetype catalog exists — it is the originality firewall.
- When a verifier and author disagree, the default is drop, not debate.
- Keep per-phase outputs in `docs/` as you go so the run is resumable.
- Don't modify app behavior (JS/CSS/HTML) beyond `sw.js`'s version bump —
  this handoff is content-only. If you find an app bug, note it in your
  final report instead of fixing it.
- Final report: what was sourced, how many candidates were generated vs
  dropped and why, the final difficulty/type distribution, and the live URL.
