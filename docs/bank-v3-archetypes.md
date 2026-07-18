# Bank v3 archetype catalog

This catalog distills the 72-example research corpus (`bank-v3-research.md`) into 20
named problem archetypes for challenging Primary 6 mathematics. It is the ONLY input
given to question generators (originality firewall): everything a generator needs —
structure, solution skeleton, difficulty calibration, distractor design, and number
constraints — is self-contained here. No paraphrase text from the corpus is reproduced;
archetypes describe abstract structure only. Difficulty uses the app scale:
**3** = solid two-step, **4** = three-step or model-method, **5** = multi-concept or
insight-required.

Topic set (fixed): Fractions, Percentage, Ratio, Speed & Rate, Area & Volume, Whole Numbers.

## Summary table

| ID | Name | Topics | Difficulty band |
|----|------|--------|-----------------|
| A01-remainder-fraction | Fraction-of-remainder chain, work backwards | Fractions | 3 |
| A02-remainder-adjusted | Remainder chain with absolute adjustments or end-state ratio | Fractions | 4–5 |
| A03-percent-chain-reverse | Percentage chain on a changing base, run forwards or backwards | Percentage, Whole Numbers | 3–4 |
| A04-unchanged-quantity-rebase | Invariant group re-expressed against a new total | Percentage, Ratio | 4 |
| A05-linked-percent-changes | Different percentage changes on linked unknowns | Percentage | 4–5 |
| A06-constant-part-ratio | Changing ratio with one party unchanged | Ratio | 3 |
| A07-constant-total-transfer | Internal transfer with unchanged total | Ratio | 3 |
| A08-constant-difference | Changing ratio with invariant difference | Ratio, Percentage | 3–4 |
| A09-both-changed-units | Everything-changed before-after; units equation | Ratio, Fractions | 4–5 |
| A10-repeated-identity | Common term across two ratios; merge with integer constraints | Ratio, Whole Numbers | 3–4 |
| A11-staggered-meeting | Two travellers toward each other, head start or gap twist | Speed & Rate | 3–4 |
| A12-gap-difference-rates | Gap closed or opened at the difference of rates | Speed & Rate | 3–5 |
| A13-combined-work-rate | Work/fill rates added, net rates, phase changes | Speed & Rate | 3–4 |
| A14-average-speed-journey | Average speed and fraction-of-journey recovery | Speed & Rate | 3 |
| A15-volume-conservation | Water poured between containers; volume invariant | Area & Volume | 3 |
| A16-flow-rate-height | Volume flow rate converted to level change or fill time | Area & Volume, Speed & Rate | 3 |
| A17-figure-length-accounting | Same length or perimeter expressed two ways from a figure | Area & Volume | 4–5 |
| A18-assumption-method | Two-constraint mix solved by supposition | Whole Numbers | 3 |
| A19-excess-shortage | Two distribution scenarios; gap = excess + shortage | Whole Numbers | 3 |
| A20-systematic-enumeration | Constraint lists, remainder intersection, exact-cover optimisation | Whole Numbers | 3–4 |

---

## A01-remainder-fraction — Fraction-of-remainder chain, work backwards

1. **Core principle.** Successive fractions act on successively smaller bases (the
   remainder after each step, not the original whole). The final leftover, given as a
   value, must be traced back to the whole via composed fractions and the unitary method.
2. **Reasoning steps required.**
   1. Convert the first "gave/spent a fraction" into a fraction remaining of the whole.
   2. Apply the second fraction to that remainder (keep-fraction × remainder-fraction),
      composing into a single fraction of the original whole.
   3. Equate the composed fraction with the given leftover value; find one unit.
   4. Scale up to the whole (or, in the "hidden whole" variant, first recover the whole
      from a part-value pair, then apply a fraction to the remainder going forward).
3. **Topics.** Fractions.
4. **Difficulty.** 3 — solidly two-to-three steps but a single strategy; becomes low-4
   only if a third spending stage or a forward "price of the last item" twist is added.
5. **Canonical strategy.** Branch bar model (whole → remainder → remainder), or fraction
   composition + unitary method; working backwards from the leftover.
6. **Common student errors.**
   - Applies the second fraction to the original whole instead of the remainder —
     distractor: whole computed from (1 − f1 − f2) of the original.
   - Uses the given-away fraction of the remainder instead of the kept fraction —
     distractor: answer built from f2 × remainder rather than (1 − f2) × remainder.
   - Stops at the unit value or at an intermediate remainder instead of scaling to the
     asked quantity — distractor: the one-unit value or the first-stage remainder.
7. **Sourced examples.**
   - Fractions #1 — https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
   - Fractions #4 — https://geniebook.com/tuition/primary-6/maths/fractions-remainder
   - Fractions #9 — https://tlstutorials.com/common-psle-math-questions-a-comprehensive-guide-to-problem-sums/
   - Fractions #12 — https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
   - (Same structure also at Fractions #3, #8 — same Ottodot source.)
8. **Number-design guidance.** Choose the two fractions so denominators multiply to ≤ 40
   and the composed kept-fraction has a small denominator (e.g. keep-fractions like 5/8
   and 3/5 composing to 3/8). Pick the leftover as a multiple of the composed numerator
   so the whole is a whole number ≤ 1000. Ensure the wrong-base distractor also lands on
   a "clean-looking" number so it is tempting.

## A02-remainder-adjusted — Remainder chain with absolute adjustments or end-state ratio

1. **Core principle.** Each stage removes a fraction of the current amount PLUS or MINUS
   a fixed adjustment (or the chain ends with a top-up and a ratio linking end state to
   start state), so simple fraction composition fails; the timeline must be reversed
   stage by stage, undoing both fraction and adjustment at each step.
2. **Reasoning steps required.**
   1. Name the amount entering the final stage; express the final leftover as
      (fraction of it) ± adjustment and solve backwards for that amount.
   2. Repeat for the previous stage, again reversing fraction then adjustment in the
      correct order.
   3. In the ratio-ending variant: compose the fraction chain into a single fraction of
      the start, add the external top-up symbolically, and set the end:start ratio as a
      cross-multiplied equation in one unit.
   4. Solve for the unit and answer the asked quantity; verify forwards.
3. **Topics.** Fractions.
4. **Difficulty.** 4–5 — three or more chained stages (4); insight-level (5) when
   adjustments point in different directions, a decimal fraction is mixed in, or the
   unit value is deliberately non-integer.
5. **Canonical strategy.** Working backwards through a branch model, one stage at a time;
   or units-and-parts with a single symbolic unit when an end:start ratio is given.
6. **Common student errors.**
   - Reverses the adjustment in the wrong order relative to the fraction (adds the
     adjustment before un-doing the fraction) — distractor: value from
     (leftover ± adjustment) ÷ fraction applied at the wrong stage.
   - Composes the fractions as if there were no adjustments — distractor: whole from
     leftover ÷ (composed fraction).
   - In the ratio variant, applies the ratio to the pre-top-up amount — distractor:
     start value from ignoring the top-up.
7. **Sourced examples.**
   - Fractions #5 — https://geniebook.com/tuition/primary-6/maths/fractions-remainder
   - Fractions #6 — https://geniebook.com/tuition/primary-6/maths/fractions-remainder
   - Fractions #11 — https://jimmymaths.com/hardest-psle-math-questions/
8. **Number-design guidance.** Work forwards from a chosen answer so every intermediate
   amount is a whole number (or a clean .50 money value). Keep fractions to quarters,
   fifths, and eighths; keep adjustments as 2-or-3-digit round-ish numbers. If mixing a
   decimal, use one that converts to twentieths (0.15, 0.35). Cap the whole at 5 digits.

## A03-percent-chain-reverse — Percentage chain on a changing base, forwards or backwards

1. **Core principle.** Two percentage operations apply in sequence, each to the result of
   the previous one (not to the original), so the chain must be collapsed into a single
   rate; run forwards it gives a final price, run backwards it recovers an unknown 100%
   base from a post-change value or from the absolute size of the change.
2. **Reasoning steps required.**
   1. Identify the base of each percentage (original, discounted price, changed subtotal).
   2. Collapse the chain: either compute stage by stage forwards, or express the final
      value / the change as a single percentage of the unknown base.
   3. For reverse problems: divide the known value by that single rate to recover the
      base, then move forwards again to the asked figure.
   4. Optional twist: an absolute change is given and must be read as a percentage of an
      unknown base; or a "difference could go either way" case split yields two answers.
3. **Topics.** Percentage; Whole Numbers (working-backwards count problems where one
   category grows by a percentage of an unknown base).
4. **Difficulty.** 3–4 — forward two-stage chains are 3; reverse-percentage with a
   collapse step, a case split, or a timeline to unwind are 4.
5. **Canonical strategy.** Percentage-of-percentage collapse; unitary method on the
   unknown 100%; working backwards along the event timeline.
6. **Common student errors.**
   - Applies the second percentage to the original base — distractor: tax/second-change
     computed on the pre-discount price, or net "add the percentages" value.
   - Reverses by taking the percentage OF the final value instead of dividing by the
     rate — distractor: base = final × (1 − rate) style answers.
   - Takes a given absolute change as a percentage of the wrong quantity, or misses the
     second case in a difference split — distractor: only one of the two valid answers,
     or percent-of-the-difference values.
7. **Sourced examples.**
   - Percentage #1 — https://www.agrader.sg/post/psle-maths-2025-walkthrough-of-8-tricky-questions-with-full-solutions
   - Percentage #4 — https://jimmymaths.com/wp-content/uploads/2019/08/5-Challenging-PSLE-Math-Questions-on-Percentage.pdf
   - Percentage #7 — https://geniebook.com/us/exam-preparation/psle/article/psle-maths-percentage-discount-gst-problems
   - Whole Numbers #8 — https://blog.thinkacademy.sg/2024/11/solving-2024-psle-math/
8. **Number-design guidance.** Pick rates whose product or complement is a clean
   percentage (e.g. 30% of a 10% rise = 3%; a 15% discount leaves 85%). Choose the base
   so all intermediate values are exact to the cent. For reverse items, make the known
   value divisible by the collapsed rate (value ÷ rate a whole number). Percent values
   from {5, 10, 15, 20, 25, 30, 40, 50}; avoid rates needing long division.

## A04-unchanged-quantity-rebase — Invariant group re-expressed against a new total

1. **Core principle.** When part of a population leaves (or arrives), percentages and
   ratios are measured against a NEW total, so before/after figures cannot be compared
   directly; the group that did not change is the bridge — equalise its units, or
   re-express it as its new percentage of the shrunken total.
2. **Reasoning steps required.**
   1. Convert each snapshot (percentages or ratio) into part:part units.
   2. Identify which group is unchanged across the event.
   3. Rescale one snapshot so the unchanged group has equal units in both.
   4. Read the changed group's unit difference against the given head-count change to
      find the unit value; scale to the asked total or count.
   5. Multi-phase variant: first pin down the population with a percentage-of-remainder
      partition, then treat the unchanged subgroup as (100% − new share) of a new total.
3. **Topics.** Percentage, Ratio.
4. **Difficulty.** 4 — the invariant-spotting plus rescaling is model-method work; a
   second phase (partition first, rebase second) pushes to 5.
5. **Canonical strategy.** Before-after table with constant part; equalise the invariant's
   units; unchanged-group ÷ its new percentage to get the new total.
6. **Common student errors.**
   - Compares percentages across the two snapshots directly as if the total were fixed —
     distractor: change computed as (before% − after%) of the original total.
   - Equalises units of the wrong (changed) group — distractor: unit value from dividing
     the head-count change by the wrong unit difference.
   - In the rebase step, applies the new percentage to the OLD total — distractor: new
     total from old total × new share.
7. **Sourced examples.**
   - Percentage #2 — https://www.essentialeducation.com.sg/psle-subjects-tips/p5-math-problem-sum-percentage-of-quantity-that-changed-before-after
   - Percentage #5 — https://jimmymaths.com/wp-content/uploads/2019/08/5-Challenging-PSLE-Math-Questions-on-Percentage.pdf
   - Ratio #10 — https://www.essentialeducation.com.sg/psle-subjects-tips/p5-math-problem-sum-ratio-changed-before-after
8. **Number-design guidance.** Choose before/after shares that convert to small-integer
   ratios (60:40 → 3:2; 90:10 → 9:1) and make the invariant's units align with an LCM
   ≤ 20. The head-count change should be a multiple of the unit difference so units are
   whole. Keep totals ≤ 500 people/objects. In rebase variants make the unchanged group
   divisible by its new percentage (e.g. group ÷ 0.8 whole).

## A05-linked-percent-changes — Different percentage changes on linked unknowns

1. **Core principle.** Two unknown quantities are linked by a before-relation (a fixed
   difference, a share of a remainder, or a stated equality under two descriptions); each
   then changes by a DIFFERENT percentage, and a single after-fact (a total, or the same
   quantity described two ways) yields one equation that unlocks the before-world.
2. **Reasoning steps required.**
   1. Set one before-quantity as the unit; express the other via the given link.
   2. Apply each percentage change to its own quantity, keeping expressions in units.
   3. Form the equation from the after-fact (sum of after-quantities equals a total, or
      two descriptions of one amount set equal).
   4. Solve for the unit; reconstruct the before-quantities.
   5. Answer the actual question, which usually needs a further computation (money total,
      equalising transfer, remaining count).
3. **Topics.** Percentage.
4. **Difficulty.** 4–5 — always at least four dependent steps; 5 when the equation
   equates two descriptions of the same quantity or a final transfer step is appended.
5. **Canonical strategy.** Units-and-parts with percentage multipliers; equation from the
   after-world; back-substitution into the before-world.
6. **Common student errors.**
   - Applies a percentage change to the wrong member of the pair (or to the combined
     total) — distractor: unit from (total ÷ sum of raw units) ignoring the multipliers.
   - Answers with the after-quantities when the question asks about the before-world (or
     vice versa) — distractor: the after-total or after-counts.
   - Drops the fixed offset when multiplying through by a percentage (e.g. 90% of
     (u − k) becoming 0.9u − k) — distractor: solution of the mis-expanded equation.
7. **Sourced examples.**
   - Percentage #3 — https://jimmymaths.com/wp-content/uploads/2019/08/5-Challenging-PSLE-Math-Questions-on-Percentage.pdf
   - Percentage #6 — https://jimmymaths.com/wp-content/uploads/2019/08/5-Challenging-PSLE-Math-Questions-on-Percentage.pdf
8. **Number-design guidance.** Choose percentage multipliers giving one-decimal
   coefficients (90% → 0.9, 130% → 1.3) and pick the after-total so the unit solves as a
   whole number (coefficient sum × unit = total exactly). Fixed offsets should be
   multiples of 10. Verify the final money computation uses 2-digit × 3-digit at worst.

## A06-constant-part-ratio — Changing ratio with one party unchanged

1. **Core principle.** When only one of two quantities changes, the unchanged party is
   the bridge between the before and after ratios: rescale both ratios so its units
   match, and the changed party's unit shift converts the given change into a unit value.
2. **Reasoning steps required.**
   1. Identify which party is unchanged.
   2. Rescale before and after ratios (LCM of the unchanged party's terms) so the
      unchanged party has the same units in both.
   3. Read the changed party's unit difference; divide the given absolute change by it
      to get one unit.
   4. Scale to the asked amount (a starting value, a final value, or the total).
3. **Topics.** Ratio.
4. **Difficulty.** 3 — the canonical two-to-three-step model-method item; drops to easy
   only if the ratios already align, so always force a genuine LCM rescale.
5. **Canonical strategy.** Constant-part before-after model; equalise the invariant's
   units via LCM.
6. **Common student errors.**
   - Equates raw units across the two ratios without rescaling — distractor: unit value
     from dividing the change by the raw term difference.
   - Rescales around the changed party instead of the unchanged one — distractor: answer
     from the wrong bridging.
   - Reports the unchanged party's amount or the unit value instead of the asked
     quantity — distractor: those intermediate numbers.
7. **Sourced examples.**
   - Ratio #1 — https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
   - Ratio #13 — https://jimmymaths.com/4-must-know-concepts-psle-ratio-math-problems/
   - (Same structure also at Ratio #6 — Ottodot; Ratio #10 — Essential Education.)
8. **Number-design guidance.** Pick the unchanged party's two ratio terms with LCM ≤ 30
   so the rescale multipliers are ≤ 5. The absolute change must be a multiple of the
   resulting unit difference. Keep final amounts ≤ $500 or ≤ 200 objects. Check the
   after-ratio is in lowest terms as presented (otherwise students shortcut).

## A07-constant-total-transfer — Internal transfer with unchanged total

1. **Core principle.** A transfer between two parties (or equal pouring between
   containers) leaves the combined total invariant, so before and after ratios can be
   rescaled to a common total; the giver's unit drop equals the transferred amount.
2. **Reasoning steps required.**
   1. Recognise the event is internal, so the total is constant.
   2. Rescale both ratios to the same total number of units (LCM of the ratio sums).
   3. Read the giver's (or receiver's) unit change; equate it to the transferred amount
      to find one unit.
   4. Scale to the asked quantity (a starting holding, a final holding, or the total).
3. **Topics.** Ratio.
4. **Difficulty.** 3 — two-to-three steps once the invariant is spotted; use ratio sums
   that differ (e.g. 9 and 2) to force the LCM step and hold the difficulty.
5. **Canonical strategy.** Constant-total before-after model; rescale to a common total.
6. **Common student errors.**
   - Compares units across ratios with different sums without rescaling — distractor:
     unit from dividing the transfer by a raw term difference.
   - Assigns the transfer to the receiver's unit GAIN measured in the wrong scale —
     distractor: half or double the correct unit value.
   - When the after-state is "equal shares", forgets to rewrite 1:1 on the common total —
     distractor: total from treating 1:1 as 1 unit each.
7. **Sourced examples.**
   - Ratio #3 — https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
   - Ratio #9 — https://homecampus.ai/blog/psle-math-question-types-appear-every-year-singapore-exam
   - Ratio #14 — https://jimmymaths.com/4-must-know-concepts-psle-ratio-math-problems/
   - (Same structure also at Ratio #4 — Ottodot.)
8. **Number-design guidance.** Choose ratio pairs whose sums have LCM ≤ 24 (e.g. sums 8
   and 8, 9 and 2, 10 and 2). The transferred amount must be a multiple of the giver's
   unit drop after rescaling. Symmetric flips (5:3 → 3:5) are elegant but make the
   equal-sums shortcut available — vary between flip and non-flip forms.

## A08-constant-difference — Changing ratio with invariant difference

1. **Core principle.** When both quantities change by the SAME amount (both age equally,
   or equal amounts are removed from each), their difference is invariant; anchoring both
   ratios to that fixed difference makes their units comparable.
2. **Reasoning steps required.**
   1. Recognise the equal-change event preserves the difference.
   2. Compute the unit-difference in each ratio; rescale one (or both) so the differences
      match (LCM of differences), or anchor each separately to the known gap.
   3. Convert units to real values via the known gap or the known equal change.
   4. Answer the asked quantity — elapsed time, an age, an amount removed, or the
      remaining quantity as a fraction/percentage of the original.
3. **Topics.** Ratio; Percentage (variants that end by expressing the remainder as a
   percentage of the original).
4. **Difficulty.** 3–4 — 3 for the standard age item; 4 when the answer must be converted
   to a percentage of the original or the consistency of the equal removal must be used.
5. **Canonical strategy.** Constant-difference model; LCM-of-differences rescale; unit
   value from the invariant gap.
6. **Common student errors.**
   - Scales one ratio directly into the other (treats growth as multiplicative) —
     distractor: answers from proportionally scaling ages/amounts.
   - Anchors to the total instead of the difference — distractor: unit from gap ÷ (sum
     of terms).
   - In percentage-ending variants, expresses the remainder over the NEW total instead
     of the original — distractor: remaining-share percentage on the wrong base.
7. **Sourced examples.**
   - Ratio #2 — https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
   - Ratio #11 — https://www.bluetreeeducation.com/ratio-and-percentage-questions/
   - Ratio #15 — https://jimmymaths.com/4-must-know-concepts-psle-ratio-math-problems/
   - (Same structure also at Ratio #5 — Ottodot.)
8. **Number-design guidance.** Pick before/after ratios whose differences have LCM ≤ 12.
   The real gap must be a multiple of the common difference-units. For age items keep
   current ages ≤ 60 and elapsed years a whole number. For percentage endings, make
   remaining units over original units simplify to a denominator dividing 100.

## A09-both-changed-units — Everything-changed before-after; units equation

1. **Core principle.** When both quantities change by different amounts (or two parties
   shed different fractions of amounts linked by a fixed gap), no invariant survives —
   the solver must carry symbolic units through the change and extract an equation by
   cross-multiplying against the after-ratio or equating the after-difference.
2. **Reasoning steps required.**
   1. Assign units to the before-state from the given ratio, gap, or fraction link.
   2. Express each after-quantity symbolically: units ± absolute change, or
      fraction-kept × units.
   3. Form one equation: cross-multiply against the after-ratio, set the after-gap equal
      to its given value, or equate two money amounts standing in a known multiple
      (e.g. spends related through a fraction-of-remainder structure).
   4. Solve the linear equation for the unit; scale to the asked quantity.
3. **Topics.** Ratio, Fractions.
4. **Difficulty.** 4–5 — proto-algebraic manipulation is inherently model-method-plus;
   5 when the equation mixes proportional parts with an absolute price offset or the
   fraction structure must first be converted into a money multiple.
5. **Canonical strategy.** Units-and-parts with cross-multiplication; before-after table
   confirming no constant part/total/difference exists.
6. **Common student errors.**
   - Hunts for an invariant that does not exist and equalises units illegitimately —
     distractor: answers from a constant-total or constant-difference treatment.
   - Cross-multiplies the before-ratio against the after-ratio directly — distractor:
     unit from the ratio-of-ratios computation.
   - Sign/expansion slips on the (units ± change) terms — distractor: solution of the
     equation with one sign flipped.
7. **Sourced examples.**
   - Ratio #8 — https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
   - Ratio #16 — https://jimmymaths.com/4-must-know-concepts-psle-ratio-math-problems/
   - Fractions #10 — https://tlstutorials.com/common-psle-math-questions-a-comprehensive-guide-to-problem-sums/
   - Fractions #7 — https://geniebook.com/tuition/primary-6/maths/fractions-remainder
8. **Number-design guidance.** Build the item backwards from integer before-values so the
   unit solves as a whole number (or a clean $0.50 in price-offset variants). Keep the
   linear equation's coefficients single-digit after simplification. Absolute changes
   from {2, 4, 6, 12, 15, 20, 60, 150}-style small round numbers; the check (plug the
   solution into the after-condition) must work in the generator before shipping.

## A10-repeated-identity — Common term across two ratios; merge with integer constraints

1. **Core principle.** One quantity appears in two separate ratios with different unit
   scales; the ratios can only be merged after rescaling so the shared quantity has equal
   units (LCM). Extended form: percentages of the merged parts must be whole numbers,
   turning the finish into a divisibility/maximisation argument.
2. **Reasoning steps required.**
   1. Spot the quantity common to both given ratios.
   2. Rescale each ratio by the factor that brings the common term to the LCM value.
   3. Merge into a single three-term ratio (or compute derived groups as percentages of
      the parts, choosing a unit scale that keeps all values integer).
   4. Extended: impose the whole-number/bound condition on a part, list the admissible
      unit values, and pick the extreme one to answer a largest/smallest question.
3. **Topics.** Ratio; Whole Numbers (the divisibility-constraint finish).
4. **Difficulty.** 3–4 — the plain three-way merge is 3 (borderline 2 if terms already
   match, so avoid that); adding percentage-of-part groups and an integer-bound
   maximisation makes a solid 4.
5. **Canonical strategy.** LCM rescale of the repeated identity; deliberate unit scaling
   (e.g. ×10) to keep percentage parts integral; systematic listing of admissible
   multiples for the bound.
6. **Common student errors.**
   - Merges the ratios without rescaling the common term — distractor: three-term ratio
     with the raw numbers juxtaposed.
   - Rescales only one of the two ratios — distractor: merged ratio with one side wrong
     by the missing factor.
   - In the bounded variant, takes the bound itself (or the smallest admissible value)
     instead of the largest admissible multiple — distractor: totals computed from the
     boundary value or from u = 1.
7. **Sourced examples.**
   - Ratio #7 — https://geniebook.com/tuition/primary-5/maths/ratio-strategy-repeated-identity
   - Ratio #12 — https://www.bluetreeeducation.com/ratio-and-percentage-questions/
8. **Number-design guidance.** Choose the common term's two values with LCM ≤ 12 and all
   merged terms ≤ 20 units. For percentage-part variants pick percentages from
   {10, 20, 25, 30, 40, 50, 60} and a base scaling (×10) making every part integral.
   Set the bound so exactly 3–5 admissible multiples exist, keeping the listing short.

## A11-staggered-meeting — Two travellers toward each other, head start or gap twist

1. **Core principle.** Two movers approach from opposite ends, closing the gap at the sum
   of their speeds — but the plain template is disturbed by a twist: one starts earlier
   (shrink the gap first), the pair have NOT yet met (add the residual gap), or a second
   phase is timed by the other traveller's clock.
2. **Reasoning steps required.**
   1. Handle the stagger: compute the head-start distance and reduce the separation
      before both move (or note both start together).
   2. Combine speeds into a closing speed; divide the effective gap by it for the
      meeting time — or multiply elapsed time by each speed when the meeting has not
      happened and add the leftover separation to get the full distance.
   3. Convert fractional hours to minutes and to a clock time where asked.
   4. Multi-leg variant: use the meeting point to split the route, then measure the
      second leg's duration by one traveller's return and apply it to the other.
3. **Topics.** Speed & Rate.
4. **Difficulty.** 3–4 — 3 with a single twist, 4 when a stagger AND a conversion or a
   second leg are chained.
5. **Canonical strategy.** Distance-line diagram; closing speed = sum of speeds; timeline
   bookkeeping per traveller.
6. **Common student errors.**
   - Ignores the head start and divides the full separation by the combined speed —
     distractor: meeting time from raw distance ÷ speed-sum.
   - In the not-yet-met variant, reports combined-speed × time as the total distance,
     forgetting the residual gap — distractor: the covered distance alone.
   - Converts 0.x hours as 0.x × 100 minutes or misplaces the clock time — distractor:
     times like x h 40 min for 0.4 h treated as 40 min correct/incorrect pairings.
7. **Sourced examples.**
   - Speed & Rate #1 — https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
   - Speed & Rate #3 — https://www.edufirst.com.sg/blog/speed-distance-time-top-20-psle-questions-explained-with-step-by-step-solutions/
   - Speed & Rate #7 — https://www.agrader.sg/post/conquering-challenging-psle-speed-questions-in-maths-4-tips-and-tricks-to-score-full-marks
8. **Number-design guidance.** Pick speeds whose sum divides the effective gap to give a
   time in whole hours or clean tenths (0.2, 0.4, 0.5) that convert to whole minutes.
   Head-start durations of 1–3 whole hours. Distances ≤ 600 km. Any fractional-hour
   elapsed time (e.g. 3¼ h) must multiply both speeds to exact values.

## A12-gap-difference-rates — Gap closed or opened at the difference of rates

1. **Core principle.** Two movers (or two draining tanks) travel in the same direction or
   drain simultaneously; the DISTANCE OR VOLUME GAP between them changes at the
   difference of their rates. Catch-up divides the head-start gap by that difference; a
   slower chaser OPENS the gap; equal-time turnaround problems read the built-up gap as
   (rate difference × time) to extract the time.
2. **Reasoning steps required.**
   1. Compute the initial gap (head-start rate × stagger time, or difference of initial
      volumes/positions).
   2. Decide whether the gap is closing or opening; take the rate difference accordingly.
   3. Divide the required gap change by the rate difference to get the time (or, in the
      equal-time variant, divide the observed distance gap by the known rate difference).
   4. Back-substitute: convert to a clock time, compute a speed from distance ÷ time, or
      find the remaining quantity in each tank. Alternative same-direction insight: at
      the instant of catching up, both have covered EQUAL total distances.
3. **Topics.** Speed & Rate.
4. **Difficulty.** 3–5 — plain catch-up is 3; opening-gap and dual-tank items are 3–4;
   the turnaround/equal-time form (gap hidden by out-and-back geometry) is a genuine 5.
5. **Canonical strategy.** Gap-and-difference heuristic: model the gap as a single
   quantity moving at the rate difference; equal-distance-at-catch-up shortcut.
6. **Common student errors.**
   - Uses the sum of speeds instead of the difference for same-direction motion —
     distractor: time from gap ÷ speed-sum.
   - In opening-gap items, applies the catch-up template and subtracts wrongly —
     distractor: time from (target gap + head start) ÷ difference.
   - In turnaround geometry, counts the out-and-back extra distance once instead of
     twice — distractor: speed derived from half the true gap.
7. **Sourced examples.**
   - Speed & Rate #5 — https://geniebook.com/exam-preparation/psle/article/solving-challenging-2023-psle-maths-questions-faizal-and-elise-jogging-question
   - Speed & Rate #6 — https://www.agrader.sg/post/conquering-challenging-psle-speed-questions-in-maths-4-tips-and-tricks-to-score-full-marks
   - Speed & Rate #9 — https://www.kiasuparents.com/kiasu/article/psle-math-tips-on-speed-questions
   - Speed & Rate #10 — https://www.kiasuparents.com/kiasu/article/psle-math-tips-on-speed-questions
   - Speed & Rate #14 — https://www.kiasuparents.com/kiasu/article/identifying-psle-math-rate-problems
8. **Number-design guidance.** Make the gap an exact multiple of the rate difference so
   the time is whole (minutes or hours). Rate differences from small values (6, 25, 27,
   30, 82.5-style at most one decimal). For tank variants keep volumes ≤ 6000 L and the
   division a 3-to-4-digit ÷ 2-digit with no remainder. Clock answers on whole minutes.

## A13-combined-work-rate — Work/fill rates added, net rates, phase changes

1. **Core principle.** "Time to do the whole job" figures cannot be added or averaged —
   they must be inverted into per-unit-time fractional rates, which DO add (inflows
   positive, drains negative); the job or tank is the unit whole. Harder forms change the
   active rate set partway (phase change) or give only the total duration of a
   sequential handover (supposition).
2. **Reasoning steps required.**
   1. Invert each solo time into a rate (fraction of the job per unit time).
   2. Sum the active rates with common denominators, subtracting any drain/outflow.
   3. Multiply rate × elapsed time for the work done in a phase; track the remaining
      fraction.
   4. Divide the remaining fraction by the (new) net rate for the remaining time; convert
      fractional time units. Phase-change variant: recompute the net rate when the tap
      set changes (it may go negative). Sequential variant: suppose one worker did every
      day, then trade days at the per-day rate difference to meet the total-work
      constraint.
3. **Topics.** Speed & Rate.
4. **Difficulty.** 3–4 — single-phase combined rates are 3; two-phase regimes, negative
   net rates, or the supposition-over-rates form are 4.
5. **Canonical strategy.** Unit-whole rates; net rate = sum of signed rates; supposition
   (assume one agent throughout, adjust by the rate difference).
6. **Common student errors.**
   - Adds or averages the times instead of the rates — distractor: answers near the mean
     of the solo times.
   - Forgets to subtract the drain (or subtracts an inactive tap) — distractor: fill
     time from the wrong tap set.
   - Divides the remaining fraction by the combined rate when only one agent remains —
     distractor: remaining time using the phase-1 rate.
7. **Sourced examples.**
   - Speed & Rate #2 — https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
   - Speed & Rate #4 — https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
   - Speed & Rate #12 — http://road-to-psle.blogspot.com/2007/12/ai-tong-school-ca1-2007-math-question.html
   - Speed & Rate #13 — https://www.kiasuparents.com/kiasu/article/identifying-psle-math-rate-problems
   - Speed & Rate #15 — https://www.kiasuparents.com/kiasu/article/identifying-psle-math-rate-problems
8. **Number-design guidance.** Choose solo times whose reciprocals share an LCM
   denominator ≤ 63 (pairs like 3&4, 4&6, 5&10, 9&21). The net rate should be a unit
   fraction or simple fraction so the final division is clean; if the answer is a mixed
   time, make it convert to whole minutes (e.g. thirds or fifths of an hour). For
   supposition items ensure the shortfall divides exactly by the per-day rate difference.

## A14-average-speed-journey — Average speed and fraction-of-journey recovery

1. **Core principle.** Average speed is total distance over total time — never the mean
   of the leg speeds; and a distance computed from speed × time may be only a FRACTION of
   the journey, requiring a units-and-parts scale-up to the whole.
2. **Reasoning steps required.**
   1. For round trips: assume a convenient one-way distance (an LCM of the two speeds).
   2. Compute each leg's time; total them.
   3. Divide total distance by total time for the average speed.
   4. For fraction-of-journey items: convert minutes to hours, compute the covered
      distance, equate it to the stated fraction of the whole, and scale up to the full
      journey.
3. **Topics.** Speed & Rate.
4. **Difficulty.** 3 — two-to-three steps hinging on one misconception; keep it at 3 by
   requiring an assumed distance or a time-unit conversion rather than plug-in numbers.
5. **Canonical strategy.** Assumed convenient distance (LCM method); total-over-total;
   unitary method on the journey fraction.
6. **Common student errors.**
   - Averages the two speeds — distractor: (v1 + v2) ÷ 2.
   - Uses one leg's time for both legs — distractor: average from equal-time weighting.
   - Treats the computed distance as the whole journey without scaling by the fraction —
     distractor: the part-distance presented as the answer.
7. **Sourced examples.**
   - Speed & Rate #11 — https://www.edufirst.com.sg/blog/speed-distance-time-top-20-psle-questions-explained-with-step-by-step-solutions/
   - Speed & Rate #8 — https://www.agrader.sg/post/conquering-challenging-psle-speed-questions-in-maths-4-tips-and-tricks-to-score-full-marks
8. **Number-design guidance.** Pick leg speeds with LCM ≤ 240 so the assumed distance
   gives whole-hour legs; the correct average must differ from the naive mean by an
   amount visible in the options (≥ 2 km/h). For fraction items use fractions with
   denominator 3, 4 or 6 and minutes from {10, 12, 15, 20, 30} so the hour conversion is
   exact and the whole journey is a whole number of km.

## A15-volume-conservation — Water poured between containers; volume invariant

1. **Core principle.** When water is poured from one container to another, its volume is
   conserved while its shape changes; V = base area × height used forwards (compute the
   volume) then in reverse (new height = volume ÷ receiving base area).
2. **Reasoning steps required.**
   1. Compute the source container's capacity (l × b × h) or the water volume directly
      via the fractional fill (fraction applies to the height or the capacity).
   2. Take the stated fraction of capacity if the container is partly full.
   3. Identify the RECEIVING container's base area.
   4. Divide the conserved volume by that base area for the new depth; sanity-check
      against the receiving container's height (no overflow).
3. **Topics.** Area & Volume.
4. **Difficulty.** 3 — a three-step chain (capacity, fraction, reverse formula); keep the
   fractional fill and the differently-shaped receiver to stay above routine plug-in.
5. **Canonical strategy.** Conservation of volume across a transfer; V = base area ×
   height applied in reverse.
6. **Common student errors.**
   - Divides by the SOURCE container's base area (or reports the source's water depth) —
     distractor: fraction × source height, or volume ÷ source base area.
   - Applies the fill fraction to a base dimension instead of height/capacity —
     distractor: volume from fraction × base area × full height misapplied.
   - Unit slip between cm³ and litres when the problem states one of each — distractor:
     answers off by ×10 or ×1000.
7. **Sourced examples.**
   - Area & Volume #1 — https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
   - Area & Volume #6 — https://homecampus.ai/blog/psle-volume-cube-cuboid-guide
   - Area & Volume #8 — https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
8. **Number-design guidance.** Choose dimensions as multiples of 5 or 10 with capacity
   ≤ 100,000 cm³. The fill fraction's denominator must divide the source height (so the
   water depth is whole), and the volume must divide exactly by the receiving base area.
   Make the resulting depth LESS than the receiver's height unless overflow is the
   intended twist — and never make it equal to the source's own height (ambiguity trap).

## A16-flow-rate-height — Volume flow rate converted to level change or fill time

1. **Core principle.** A volume flow rate (litres per minute) becomes a water-LEVEL rate
   by dividing by the base area, after converting litres to cm³; net rate = inflow −
   outflow. The complement form asks how long a partly full tank takes to finish filling
   — the rate applies to the UNFILLED remainder, not the capacity.
2. **Reasoning steps required.**
   1. Convert all rates and volumes to consistent units (1 L = 1000 cm³).
   2. Combine simultaneous flows into a net rate (inflow minus drain).
   3. Either divide the net volume rate by the base area for the level-rise rate, or
      compute capacity, take the filled fraction, subtract to get the remaining volume,
      and divide by the fill rate for the time.
3. **Topics.** Area & Volume, Speed & Rate.
4. **Difficulty.** 3 — three distinct conversions/ideas chained, but each is short; adding
   a delayed second tap or a two-part question holds it at solid 3 rather than 2.
5. **Canonical strategy.** Net-rate combination; V = base area × height applied to rates;
   complement (remainder) before applying the rate.
6. **Common student errors.**
   - Skips the litre-to-cm³ conversion — distractor: level rate off by ×1000 (or
     presented as a plausible small decimal).
   - Times the FULL capacity instead of the unfilled remainder — distractor: capacity ÷
     rate.
   - Adds the drain instead of subtracting (or ignores it) — distractor: rate from
     inflow + outflow, or inflow alone.
7. **Sourced examples.**
   - Area & Volume #5 — https://geniebook.com/exam-preparation/psle/article/psle-math-volume-rate-of-flow-problems
   - Area & Volume #7 — https://homecampus.ai/blog/psle-volume-cube-cuboid-guide
   - Speed & Rate #16 — https://geniebook.com/exam-preparation/psle/article/psle-math-volume-rate-of-flow-problems
8. **Number-design guidance.** Pick base areas dividing the net cm³/min rate to a clean
   level rate (whole number or .5). Capacities that convert to whole litres (dimensions
   multiplying to multiples of 1000). Fill fractions with denominators dividing the
   litre capacity; remaining volume divisible by the fill rate for a whole-minute answer.

## A17-figure-length-accounting — Same length or perimeter expressed two ways from a figure

1. **Core principle.** A figure's total span or two related perimeters can be expressed
   in two different ways; setting the expressions equal makes shared segments cancel,
   leaving a one-unknown equation in the repeated length or unit — no area/circle formula
   does the work, the accounting argument does. Often finishes with area-by-subtraction.
2. **Reasoning steps required.**
   1. Assign a symbol (or unit) to the repeated unknown length; express other marked
      segments in terms of it using given ratios.
   2. Write the same total span (or each of two compared perimeters) as a sum of
      segments along two different paths/rows of the figure.
   3. Equate (or subtract) the two expressions; note that identical shared segments
      cancel, leaving units = a known difference.
   4. Solve for the unit; recover the needed dimensions.
   5. Where asked, compute the target area as a full simple shape minus cut-off pieces.
3. **Topics.** Area & Volume.
4. **Difficulty.** 4–5 — inventing the double-counting equation is insight-level; a plain
   two-row span equation is 4, a fold-plus-perimeter-comparison ending in
   area-by-subtraction is 5.
5. **Canonical strategy.** Constant-total length accounting (measure one thing two ways);
   units-and-parts on segment ratios; area by subtraction.
6. **Common student errors.**
   - Reaches for circumference/area formulas because circles or folds appear —
     distractor: values involving π or a formulaic area of one component.
   - Counts a shared segment on one side of the equation but not the other — distractor:
     unknown from an equation missing one gap/offset term.
   - After finding the unit, answers with the unit or a side length instead of the asked
     area — distractor: the segment length or the un-subtracted full-rectangle area.
7. **Sourced examples.**
   - Area & Volume #3 — https://blog.thinkacademy.sg/2024/11/solving-2024-psle-math/
   - Area & Volume #4 — https://geniebook.com/exam-preparation/psle/article/2019-semicircle-question-how-calculate-diameter-circle
8. **Number-design guidance.** Design so the equation reduces to (small integer) × unit =
   (2-digit number), giving a whole unit ≤ 60 cm. Gaps/offsets as 2-digit numbers; final
   areas ≤ 5000 cm² computed from at most one subtraction. The figure must be describable
   unambiguously in words (state which segments are equal and the ratio points) since the
   generated question may need a matching described or drawn figure.

## A18-assumption-method — Two-constraint mix solved by supposition

1. **Core principle.** A mix of two kinds of objects satisfies two totals (count and an
   attribute sum such as legs, wheels, or money value); assuming ALL objects are one kind
   creates a measurable discrepancy, and each swap to the other kind changes the
   attribute total by a fixed amount — the discrepancy ÷ per-swap change counts the
   other kind.
2. **Reasoning steps required.**
   1. Suppose every object is the kind with the smaller attribute value; compute the
      attribute total under this supposition.
   2. Find the discrepancy between the supposed total and the actual total.
   3. Compute the per-swap change (difference between the two kinds' attribute values).
   4. Divide discrepancy by per-swap change to count the other kind; subtract from the
      total count for the first kind; verify both constraints.
3. **Topics.** Whole Numbers.
4. **Difficulty.** 3 — a canonical no-algebra two-constraint item; keep at 3 by asking
   for the assumed kind (forcing the final subtraction) or using money values.
5. **Canonical strategy.** Assumption/supposition method (assume an extreme, adjust by
   swaps); guess-and-check as fallback.
6. **Common student errors.**
   - Divides the attribute total by the count or by one attribute value — distractor:
     total ÷ per-object value answers.
   - Divides the discrepancy by an attribute value instead of the DIFFERENCE —
     distractor: discrepancy ÷ larger attribute.
   - Reports the adjusted kind when the question asks for the assumed kind — distractor:
     the complementary count.
7. **Sourced examples.**
   - Whole Numbers #3 — https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
   - Whole Numbers #4 — https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
8. **Number-design guidance.** Attribute values differing by 2–5; totals ≤ 60 objects.
   Choose numbers so the discrepancy divides exactly by the difference AND both final
   counts are positive. Ensure the naive divisions (total ÷ value) give non-matching
   plausible integers for distractors. Money variants: values in whole dollars or 50¢.

## A19-excess-shortage — Two distribution scenarios; gap = excess + shortage

1. **Core principle.** The same fixed stock is shared under two different per-group
   rates, one leaving a surplus and the other a shortfall; the total swing between the
   scenarios equals excess PLUS shortage, and dividing by the per-group rate difference
   recovers the hidden group count, then the stock.
2. **Reasoning steps required.**
   1. Recognise both scenarios describe the same stock and the same number of groups.
   2. Combine the leftover and the shortfall additively into the total gap (signs: a
      shortage counts positively toward the gap).
   3. Divide the gap by the difference in per-group rates for the group count.
   4. Reconstruct the stock from either scenario; verify with the other.
3. **Topics.** Whole Numbers.
4. **Difficulty.** 3 — two-to-three steps with one counterintuitive move (adding the
   excess and shortage); both-surplus or both-shortage variants (subtract instead) can
   stretch to low 4.
5. **Canonical strategy.** Excess-and-shortage / gap-and-difference heuristic; equating
   the two scenario expressions for the same stock.
6. **Common student errors.**
   - Subtracts the shortage from the excess instead of adding — distractor: group count
     from (excess − shortage) ÷ rate difference.
   - Divides the gap by a per-group rate rather than the rate difference — distractor:
     gap ÷ larger rate.
   - Answers the group count when the stock is asked (or forgets to add back the
     leftover) — distractor: rate × groups without the surplus adjustment.
7. **Sourced examples.**
   - Whole Numbers #5 — https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
   - Whole Numbers #12 — https://mastermaths.com.sg/2-simple-approaches-to-excess-shortage-word-problems/
8. **Number-design guidance.** Per-group rates differing by 2 or 3; excess and shortage
   each ≤ 40 with their sum an exact multiple of the rate difference. Group counts of
   5–15 and stock totals ≤ 150 keep the verification mental. Make the subtract-instead
   distractor land on a whole number too, so it stays tempting.

## A20-systematic-enumeration — Constraint lists, remainder intersection, exact-cover optimisation

1. **Core principle.** No direct equation exists: the answer is found by generating short
   candidate lists from divisibility, remainder, factor-count, or pattern constraints and
   intersecting or exhausting them — including re-reading "k short of a full group of n"
   as remainder (n − k), finding co-occurring terms of two arithmetic patterns via the
   LCM of their steps, and comparing all exact bundle covers for a minimum cost.
2. **Reasoning steps required.**
   1. Translate each condition into list form: value = base + multiple of step, remainder
      r on division by n (converting shortage phrasing), a factor-count property, or an
      exact required combination of bundle contents.
   2. Generate each list systematically under the stated range cap.
   3. Intersect the lists (or step by the LCM of the two step sizes to jump between
      common terms; or enumerate the exact covers of the requirement).
   4. Apply the final selector — smallest/largest in range, sum of next common terms, or
      minimum total cost — then finish any residual arithmetic (e.g. spend ÷ unit price).
3. **Topics.** Whole Numbers.
4. **Difficulty.** 3–4 — a single remainder-list intersection is 3; double-property
   pruning (divisibility + factor counts), LCM-of-steps pattern jumps, or optimisation
   against a greedy trap are 4.
5. **Canonical strategy.** Systematic listing under a range cap; remainder/common-multiple
   reasoning; exhaustive comparison of exact covers (resisting greedy choices).
6. **Common student errors.**
   - Reads "k short of a full group of n" as remainder k — distractor: intersection of
     the wrong residue lists.
   - Steps common terms by one sequence's difference instead of the LCM of both —
     distractor: next shared value from adding the smaller step.
   - Greedy bundle choice (maximise the biggest per-bundle saving) instead of comparing
     exact covers — distractor: the greedy total, a near-miss above the true minimum.
7. **Sourced examples.**
   - Whole Numbers #1 — https://www.agrader.sg/post/psle-maths-2025-walkthrough-of-8-tricky-questions-with-full-solutions
   - Whole Numbers #2 — https://www.agrader.sg/post/psle-maths-2025-walkthrough-of-8-tricky-questions-with-full-solutions
   - Whole Numbers #9 — https://blog.thinkacademy.sg/2024/11/solving-2024-psle-math/
   - Whole Numbers #10 — https://blog.thinkacademy.sg/2024/11/solving-2024-psle-math/
   - Whole Numbers #13 — https://mastermaths.com.sg/2-simple-approaches-to-excess-shortage-word-problems/
8. **Number-design guidance.** Keep every list ≤ 8 candidates: range caps ≤ 60 for
   remainder items, divisors from {5, 6, 8}, sequence steps with LCM ≤ 24. Ensure the
   intersection is UNIQUE (or the selector unambiguous). For optimisation items use ≤ 4
   purchase options and requirements coverable in ≤ 4 distinct combinations, with the
   greedy answer strictly worse than the optimum by a small visible margin.

---

## Topic coverage check

| Topic | Archetypes fitting it | Count |
|-------|----------------------|-------|
| Fractions | A01, A02, A09 | 3 |
| Percentage | A03, A04, A05, A08 | 4 |
| Ratio | A04, A06, A07, A08, A09, A10 | 6 |
| Speed & Rate | A11, A12, A13, A14, A16 | 5 |
| Area & Volume | A15, A16, A17 | 3 |
| Whole Numbers | A03, A10, A18, A19, A20 | 5 |

Every topic has at least 2 archetypes; every archetype cites at least 2 corpus examples
with section headings and source URLs.
