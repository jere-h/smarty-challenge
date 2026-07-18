# Bank v3 research corpus

Sourced examples of challenging Singapore Primary 6 mathematics problems, gathered by
parallel research agents (2026-07-18). Every entry is a PARAPHRASE — no verbatim text
from any source is reproduced here or anywhere in the shipped bank. These examples are
inputs for archetype analysis only (see bank-v3-archetypes.md); shipped questions are
original permutations, never copies.

Total examples: 72

## Researcher notes (syllabus coverage)

- [syllabus] OFFICIAL SYLLABUS & ASSESSMENT (verified from SEAB PSLE Mathematics 0008 syllabus for examination from 2026, PDF text extracted from seab.gov.sg via isomer-user-content.by.gov.sg/334/fe51f29b-.../0008_y26_sy.pdf; format page: seab.gov.sg/psle/psle-formats-examined-in-2026/). Assessment objectives: AO1 recall facts/concepts/rules/formulae and perform straightforward computations and algebraic procedures; AO2 interpret information, understand and apply concepts/skills in a variety of contexts; AO3 reason mathematically, analyse information, make inferences, select appropriate strategies to solve problems. Exam format (from 2026): two papers, three booklets, 100 marks, 2 h 30 min total. Paper 1 (no calculator, 1 h 10 min, 50 marks): Booklet A = 10 MCQ x 1 mark + 8 MCQ/short items x 2 marks; Booklet B = 12 short-answer x 2 marks. Paper 2 (calculator allowed, 1 h 20 min, 50 marks): 5 short-answer x 2 marks + 10 structured/long-answer x 3-5 marks. Structured questions require working shown; 1 method mark available on 2-mark single-part items. The multi-step AO3 problems concentrate in Paper 2's 3-5 mark questions. MOE 2021 Primary Mathematics syllabus (moe.gov.sg PDF blocked to fetch directly; content corroborated via practicle.sg/primary-6-math and MOE-aligned school handbook) — PSLE tests P5+P6 content across nine strands: whole numbers, fractions, decimals, percentage, ratio, speed, measurement, geometry, data analysis. P6-relevant coverage per requested areas: FRACTIONS - all four operations including dividing proper fraction by whole number, whole number by fraction, fraction by fraction; fraction-of-remainder and multi-stage word problems. PERCENTAGE - finding the whole from a percentage part (reverse percentage), percentage increase/decrease, discount/GST/interest contexts. RATIO - P6 topic: equivalent ratios, ratio-fraction conversion, changing ratios (constant part / constant total / constant difference / all-change types). SPEED - distance-time-speed relations, unit conversions, meeting/overtaking and staggered-start problems; average speed. AREA/VOLUME/GEOMETRY - circles (circumference and area of circle, semicircle, quarter circle, composite figures), area/perimeter of composite figures, volume of cube/cuboid including finding unknown edge/height/base area from volume, solids and nets, unknown angles in composite figures involving squares/rectangles/triangles/parallelogram/rhombus/trapezium. WHOLE NUMBERS - order of operations, factors/multiples (HCF/LCM applications), number patterns, and non-routine heuristics. Also examinable at P6: algebra (linear expressions in one variable, evaluation, simple equations), average, pie charts. Widely taught heuristic taxonomy (Ottodot guide, matching MOE's problem-solving heuristics): model drawing, guess-and-check, working backwards, systematic listing, pattern spotting, assumption (supposition) method, before-after table, simplify the problem; plus problem archetypes: remainder concept, equal fractions, units-and-parts, constant part / constant total / constant difference, excess-and-shortage, gap-and-difference, combined work rate, overlap/exclusion. Sourcing caveats: jimmymaths.com (403-blocked) and the MOE syllabus PDF could not be fetched; SEAB legacy PDF URLs 404 (site migrated to Isomer — use the isomer-user-content link above). One source-side arithmetic slip corrected during verification: the Agrader jacket item (b) is $64.60 -> 5% (not $64.80 -> 6%); all recorded solution paths were independently re-verified. A 2023 PSLE rectangle-triangle area-ratio problem (geniebook.com) was examined but excluded because the solution could not be verified without the figure.

- [heuristics] Corpus of 13 multi-step PSLE-level examples mapped to named Singapore-math heuristics: remainder concept, before-after with constant quantity (percentage base change), constant total (internal transfer), constant difference (ages), constant part, repeated identity, units-and-parts (both sides changed), assumption/supposition, excess-and-shortage, gap-and-difference, combined closing speed, combined work rate, and volume conservation. All paraphrased, never verbatim; all arithmetic independently re-verified (script check of fractions/rates). One source correction: the Ace Scorers gap-and-difference page's own displayed answer ($4.80/dozen) contains an arithmetic slip at the back-substitution step; the recorded solutionPath gives the corrected answer $3.60, verified against both original price conditions. Sources skipped: seashell.sg (503), tutify.com.sg (403), jimmymaths.com article pages (returned empty content); EduFirst's "8 models" page Model 4 (constant difference marbles) was internally inconsistent and excluded. Ottodot's taxonomy page was the richest single source (15 named types with checkable solutions).

- [fractions] All 11 solution paths were re-derived and arithmetic-verified independently of the source pages. Two source caveats: (1) tlstutorials.com's card-transfer problem prints "gave away 1/5" but its own answer (300) only holds if the second boy KEPT 1/5; the recorded version is the corrected, self-consistent one. (2) Geniebook's apple-harvest solution was shown only in abbreviated form on the page; the full backward-working derivation recorded here reproduces its stated answer (13,780) exactly. jimmymaths.com/hardest-psle-math-questions and jimmymaths.com/10-common-psle-math-problem-sums blocked direct fetches (JS-rendered); the John-money problem from the former was captured with full working via search snippets and verified. Coverage of the requested angle: fraction-of-remainder (5 items, including two with absolute +/- adjustments and one mixing decimals), transfers between people (2), before-after with changing/unchanged totals (3), fraction-of-set with hidden whole (1). Difficulty estimates are on a 1-5 scale (5 = hardest PSLE Paper 2 level).

- [ratio-percent] All 12 examples are paraphrased from publicly accessible teacher/tutor resources (no paywalled content): Essential Education blog (before-after ratio algorithm), BlueTree Education's walkthrough of actual PSLE 2021 ratio/percentage questions, Jimmy Maths' '4 Must Know Concepts of Ratio' blog post (constant part / constant total / constant difference / everything changed, each with a worked example), Jimmy Maths' free PDF '5 Challenging PSLE Math Questions on Percentage' (questions + answer key; I derived full solution paths and verified each against the printed key: $12,540; $770; 30 lorries; $36), and Geniebook's discount+GST article. Arithmetic in every solutionPath was independently re-checked. Coverage: changing ratios with constant part, constant total (internal transfer), constant difference (equal removal and age), everything-changed cross-multiplication, percentage change chains (discount then GST), percentage applied to two linked quantities, reverse percentage, and percentage-of-remainder with a second before-after phase. One requested sub-type — explicit overlap/exclusion (e.g. members in both clubs) — did not surface with a full public worked solution in the sources fetched; the closest structural relative captured is the Group P/Q partition question (BlueTree P2 Q11). One PDF question (Joe's shoes: $2160 total, 60% at $40, rest at 25% discount, answer 24 pairs) was omitted to stay within the 12-example cap but is available at the same PDF URL if needed.

- [speed] All 12 examples are Speed & Rate (travel speed or work/flow rate) as requested by the angle. Every solutionPath was re-derived and arithmetic-checked independently of the source summaries; one candidate (an EduFirst catch-up item whose page summary gave an internally inconsistent answer) was discarded rather than repaired. difficultyEstimate uses a 1-5 scale (5 = hardest PSLE-level). Sources are public teacher/tutor blog walkthroughs (Geniebook, AGrader, KiasuParents, EduFirst, Road-to-PSLE blogspot); jimmymaths.com pages were unreachable through the fetch proxy (returned empty), so its examples were not used. The PSLE 2023 Faizal/Elise jogging item is corroborated by two independent sources (Geniebook and bamboopath.sg, which solves it via the distance-ratio 13:10 method yielding the same 100 m/min).

- [geometry-whole] All 12 examples arithmetic-verified independently (perimeter-difference units, semicircle span equation, net flow rates, volume conservation, working-backwards chain, factor counts, sum-and-difference pair, excess-shortage gaps, remainder lists). Paraphrases are rewritten, not verbatim; numbers preserved so solutions are checkable. Six examples per requested topic (Area & Volume, Whole Numbers). The 2024 folded-paper item depends on a figure; its paraphrase describes the configuration as reported by the source (AB = 50 cm given in the figure). Jimmy Maths and Genius Plus Academy pages were blocked/empty on fetch, so their candidate problems were excluded rather than recorded unverified. Difficulty estimates are on a 1-5 scale (5 = hardest PSLE-level).

## Fractions (12 examples)

### Fractions #1 — remainder concept (fraction of a remainder, branch/unitary method)

- **Source:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
- **Difficulty estimate:** 3
- **Angle:** syllabus

**Paraphrase:** A girl starts with a pile of stickers. She hands 3/8 of them to her sister, then gives away 2/5 of what remains to a friend. She is left with 36 stickers. Find her starting number.

**Solution path:** Step 1: After giving 3/8 away, the remainder is 5/8 of the original. Step 2: Giving 2/5 of the remainder means she keeps 3/5 of it: (3/5) x (5/8) = 3/8 of the original. Step 3: So 3/8 of the original = 36, hence 1/8 = 12 and the original = 8 x 12 = 96 stickers. Check: 96 - 36 (to sister) = 60; 2/5 of 60 = 24 given away; 60 - 24 = 36. Answer: 96.

**Why non-trivial:** Requires re-expressing a fraction of a remainder as a fraction of the original whole before the unitary step can be applied — two chained fraction-of operations plus working backwards from the leftover.

### Fractions #2 — changing the base/whole (fraction of a set, then fraction division)

- **Source:** https://www.agrader.sg/post/psle-maths-2025-walkthrough-of-8-tricky-questions-with-full-solutions
- **Difficulty estimate:** 4
- **Angle:** syllabus

**Paraphrase:** A hall has three rows with the same number of seats. Pupils fill 5/8 of all the seats. Then 1/5 of the pupils go away, and everyone still present squeezes into just the first two rows. What fraction of the seats in those two rows is now taken?

**Solution path:** Step 1: Pupils remaining = 5/8 x 4/5 = 1/2 of all seats' worth of pupils. Step 2: The first two rows contain 2/3 of all seats. Step 3: Fraction of those seats occupied = (1/2) / (2/3) = 3/4. Check with numbers: 24 seats total, 15 pupils, 3 leave leaving 12; first two rows have 16 seats; 12/16 = 3/4. Answer: 3/4.

**Why non-trivial:** Chains a fraction-of-a-fraction reduction with a change of reference whole (from all seats to two rows of seats) and ends with fraction division — students who keep the wrong base get 1/2 or 5/8.

### Fractions #3 — remainder concept (branching fractions of a remainder)

- **Source:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
- **Difficulty estimate:** 3
- **Angle:** heuristics

**Paraphrase:** A girl starts with a collection of stickers. First she hands 3/8 of them to her sister; next she passes 2/5 of what is still left to a friend. In the end 36 stickers remain with her. Find the size of her original collection.

**Solution path:** Step 1: After giving 3/8 to the sister, the remainder is 5/8 of the original. Step 2: She gives away 2/5 of that remainder, so she keeps 3/5 of it; 3/5 x 5/8 = 3/8 of the original. Step 3: That kept portion equals 36 stickers, so 3/8 of original = 36, hence 1/8 = 12 and the original = 8 x 12 = 96 stickers. Check: 96 - 36 (sister) = 60 remainder; 2/5 of 60 = 24 to friend; 60 - 24 = 36 left. Answer: 96 stickers.

**Why non-trivial:** The second fraction acts on the remainder, not the original total — the classic trap is computing 2/5 of the whole. Requires chaining two fraction-of-remainder steps before a unitary step back to the whole.

### Fractions #4 — remainder concept (fraction of a remainder, sequential branching)

- **Source:** https://geniebook.com/tuition/primary-6/maths/fractions-remainder
- **Difficulty estimate:** 3
- **Angle:** fractions

**Paraphrase:** A shopper brings $560 to the mall. Shoes take up 3/7 of her money, and a watch takes 1/8 of what is left after the shoes. She then buys one more item (a dress) and finds she has $164 remaining. What was the price of the dress?

**Solution path:** Step 1: After shoes, money left = (1 - 3/7) x 560 = 4/7 x 560 = $320. Step 2: The watch uses 1/8 of this remainder, so money left = 7/8 x 320 = $280. Step 3: Dress cost = 280 - 164 = $116. Final answer: $116.

**Why non-trivial:** Two successive fractions act on different bases (the original sum, then the remainder), and the final step is a subtraction from the second remainder rather than a direct fraction computation - students who apply 1/8 to $560 get it wrong.

### Fractions #5 — remainder concept combined with working backwards (decimal-fraction conversion)

- **Source:** https://geniebook.com/tuition/primary-6/maths/fractions-remainder
- **Difficulty estimate:** 4
- **Angle:** fractions

**Paraphrase:** A man worked 20 days in a month at a fixed daily wage. From his month's pay he handed 0.15 of it to his mother, then spent 4/5 of what remained, ending with savings of $340. Find his pay per day.

**Solution path:** Step 1: Convert 0.15 to 3/20; after giving his mother her share, 17/20 of the salary remains. Step 2: He keeps 1/5 of that remainder, so savings = 1/5 x 17/20 = 17/100 of the whole salary. Step 3: 17/100 of salary = $340, so salary = 340 x 100/17 = $2000. Step 4: Daily wage = 2000 / 20 = $100. Final answer: $100 per day.

**Why non-trivial:** Mixes a decimal fraction with a common fraction of a remainder, requires composing two fractional operations into a single fraction of the whole, then working backwards from the savings and dividing by days worked - four chained steps.

### Fractions #6 — remainder concept with branching model + working backwards

- **Source:** https://geniebook.com/tuition/primary-6/maths/fractions-remainder
- **Difficulty estimate:** 5
- **Angle:** fractions

**Paraphrase:** A farmer picked a crop of apples. To his first buyer he sold 3/4 of the crop and 105 apples more. To a second buyer he sold 55 fewer than 3/4 of what was then left. In the end 890 apples remained. How many apples were picked?

**Solution path:** Step 1: Let R be the amount left after the first sale. Second sale = 3/4 R - 55, so what remains = 1/4 R + 55 = 890, giving 1/4 R = 835 and R = 3340. Step 2: First sale left R = 1/4 of total - 105, so 1/4 of total = 3340 + 105 = 3445. Step 3: Total = 4 x 3445 = 13780. Final answer: 13,780 apples.

**Why non-trivial:** Each sale is a fraction of a changing base PLUS/MINUS an absolute adjustment ("and 105 more", "55 fewer than"), so the student must work backwards through two branch stages, carefully reversing both the fraction and the adjustment at each stage.

### Fractions #7 — units and parts (fraction-of-remainder linking two expenditures)

- **Source:** https://geniebook.com/tuition/primary-6/maths/fractions-remainder
- **Difficulty estimate:** 5
- **Angle:** fractions

**Paraphrase:** A boy used 3/7 of his money to buy 6 toys and 6 erasers, then used 1/4 of the remaining money to buy 10 cards. One eraser costs 1/7 as much as one toy, and one card costs $0.30 more than one eraser. What does one toy cost?

**Solution path:** Step 1: Money left after toys/erasers = 4/7; cards cost 1/4 x 4/7 = 1/7 of the money. So the toys-and-erasers bill (3/7) is exactly 3 times the cards bill (1/7). Step 2: Let 1 part = price of an eraser; a toy = 7 parts. Bill for 6 toys + 6 erasers = 6x7 + 6 = 48 parts. Step 3: Each card = 1 part + $0.30, so 10 cards = 10 parts + $3. Then 48 parts = 3 x (10 parts + 3) = 30 parts + $9, so 18 parts = $9 and 1 part = $0.50. Step 4: Toy = 7 x 0.50 = $3.50. Final answer: $3.50.

**Why non-trivial:** Requires noticing that the two purchases stand in a 3:1 money ratio via the fraction-of-remainder structure, then setting up a parts equation that mixes proportional prices with an absolute $0.30 offset - three distinct concepts chained together.

### Fractions #8 — remainder concept + working backwards

- **Source:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
- **Difficulty estimate:** 3
- **Angle:** fractions

**Paraphrase:** A girl gave her sister 3/8 of her sticker collection, then gave a friend 2/5 of the stickers still in her hands, leaving her with 36 stickers. How large was the collection to begin with?

**Solution path:** Step 1: After the sister's share, 5/8 of the collection remains. Step 2: She keeps 3/5 of that remainder, so what is left = 3/5 x 5/8 = 3/8 of the original. Step 3: 3/8 of original = 36, so 1/8 = 12 and the original = 96 stickers. Check: 3/8 of 96 = 36 given away, 60 left, 2/5 of 60 = 24 given, 36 remain. Final answer: 96 stickers.

**Why non-trivial:** The common error is applying 2/5 to the original total instead of to the 5/8 remainder; solving requires multiplying fractions across stages and then working backwards from the final count.

### Fractions #9 — remainder concept + working backwards

- **Source:** https://tlstutorials.com/common-psle-math-questions-a-comprehensive-guide-to-problem-sums/
- **Difficulty estimate:** 2
- **Angle:** fractions

**Paraphrase:** A boy spent 3/4 of his pocket money on a console, then 2/3 of what was left on a present, and finished with $10. How much pocket money did he start with? (Note: the blog's twin example with the same structure uses 1/4 then 2/3 with $90 left.)

**Solution path:** Step 1: After the console, 1/4 of the money remains. Step 2: After the present he keeps 1/3 of that remainder, i.e. 1/3 x 1/4 = 1/12 of the original. Step 3: 1/12 of original = $10, so original = 10 x 12 = $120. Final answer: $120.

**Why non-trivial:** A two-fraction chain on shifting bases solved by composing fractions and reversing from the final amount - the canonical entry-level 'fraction of remainder, work backwards' item that many students still get wrong by applying 2/3 to the whole.

### Fractions #10 — before-after comparison with units (gap and difference)

- **Source:** https://tlstutorials.com/common-psle-math-questions-a-comprehensive-guide-to-problem-sums/
- **Difficulty estimate:** 4
- **Angle:** fractions

**Paraphrase:** Two boys collect cards; the first has 100 cards more than the second. The first then gives away half of his cards while the second gives away 4/5 of his (keeping 1/5). Now the first has 140 cards more than the second. How many cards did the second boy start with? (The blog's printed statement says the second boy gave away 1/5, but that is inconsistent with its own answer of 300; the consistent reading, verified here, is that he kept 1/5.)

**Solution path:** Step 1: Let the second boy start with u cards; the first starts with u + 100. Step 2: After giving, first has (u + 100)/2 and second has u/5. Step 3: (u + 100)/2 - u/5 = 140. Multiply by 10: 5u + 500 - 2u = 1400, so 3u = 900 and u = 300. Check: first 400 -> 200, second 300 -> 60, difference 140. Final answer: 300 cards.

**Why non-trivial:** Two people each shed a different fraction of different starting amounts related by a fixed gap, and the comparison is between the two after-states - requires an algebraic/unit setup rather than direct bar slicing, plus fraction-of-own-amount bookkeeping. Also a reminder that published solutions need verification: the source's own statement contains a fraction typo.

### Fractions #11 — remainder concept + units and parts with end-to-start ratio

- **Source:** https://jimmymaths.com/hardest-psle-math-questions/
- **Difficulty estimate:** 5
- **Angle:** fractions

**Paraphrase:** A student started with some money, used 1/4 of it for a T-shirt and then 2/5 of the remainder for shoes. His parents then topped him up with $120, and the money he ended with compared to what he started with was in the ratio 5 : 4. Find his starting amount.

**Solution path:** Step 1: After the T-shirt, 3/4 remains; after shoes he keeps 3/5 x 3/4 = 9/20 of the start. Step 2: Let the start be 20u; money before the top-up is 9u, and after it is 9u + 120. Step 3: (9u + 120) : 20u = 5 : 4 gives 4(9u + 120) = 100u, so 36u + 480 = 100u, 64u = 480, u = 7.5. Step 4: Start = 20u = $150. Check: 150 -> spend 37.50 -> 112.50 -> spend 45 -> 67.50 -> +120 = 187.50; 187.50 : 150 = 5 : 4. Final answer: $150.

**Why non-trivial:** Combines a fraction-of-remainder chain with an external addition and a final ratio linking the end state to the start state; the unit value comes out non-integer (u = 7.5), which unnerves students and punishes premature rounding.

### Fractions #12 — fraction-of-a-set with units (unitary method, then remainder)

- **Source:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
- **Difficulty estimate:** 2
- **Angle:** fractions

**Paraphrase:** A boy paid $36 for books, which used up 4/9 of his savings. Afterwards he spent 1/3 of the savings he still had on a game. What did the game cost?

**Solution path:** Step 1: 4/9 of savings = $36, so 1/9 = $9 and total savings = $81. Step 2: Left after books = 81 - 36 = $45. Step 3: Game = 1/3 x 45 = $15. Final answer: $15.

**Why non-trivial:** Requires the unitary method to recover the hidden whole from a part before the second fraction can be applied to the correct base (the remainder, not the original savings) - two different bases in one problem.

## Percentage (7 examples)

### Percentage #1 — reverse percentage (find the whole from a part) plus case splitting

- **Source:** https://www.agrader.sg/post/psle-maths-2025-walkthrough-of-8-tricky-questions-with-full-solutions
- **Difficulty estimate:** 4
- **Angle:** syllabus

**Paraphrase:** A jacket cost Zach $57.80 after a 15% discount. (a) What was the price before discount? (b) His friend bought the identical jacket at a different discount and their payments differed by $6.80. Give the two possible discount percentages the friend received.

**Solution path:** (a) $57.80 represents 85% of the original, so original = 57.80 / 0.85 = $68. (b) Friend paid either 57.80 + 6.80 = $64.60 (discount = 68 - 64.60 = $3.40, i.e. 3.40/68 = 5%) or 57.80 - 6.80 = $51.00 (discount = $17, i.e. 17/68 = 25%). Answers: (a) $68; (b) 5% or 25%.

**Why non-trivial:** Part (a) needs reverse percentage (recover 100% from 85%), and part (b) forces case analysis — the 'difference' can go either way — with each case needing its own percentage-of-original computation.

### Percentage #2 — before-after with constant (unchanged) quantity — percentages on a changing base

- **Source:** https://www.essentialeducation.com.sg/psle-subjects-tips/p5-math-problem-sum-percentage-of-quantity-that-changed-before-after
- **Difficulty estimate:** 4
- **Angle:** heuristics

**Paraphrase:** Girls make up 60% of a class and boys the other 40%. Once 15 boys have left, boys account for only 10% of those remaining. How many pupils did the class hold before anyone left?

**Solution path:** Step 1: Convert both snapshots to ratios: before, girls:boys = 60:40 = 3:2; after, girls:boys = 90:10 = 9:1. Step 2: The number of girls never changes, so rescale the 'before' ratio so girls match: 3:2 = 9:6. Step 3: Boys fell from 6 units to 1 unit, a drop of 5 units, which equals the 15 boys who left, so 1 unit = 3 pupils. Step 4: Original class = 9 + 6 = 15 units = 45 pupils. Check: 27 girls, 18 boys; after 15 boys leave, 3 boys out of 30 pupils = 10%. Answer: 45 pupils.

**Why non-trivial:** The percentage base changes between the two snapshots (the class shrinks), so percentages cannot be compared directly; the solver must spot the invariant quantity (girls) and equalise units around it.

### Percentage #3 — percentage change on parts with before-after comparison (units and parts)

- **Source:** https://jimmymaths.com/wp-content/uploads/2019/08/5-Challenging-PSLE-Math-Questions-on-Percentage.pdf
- **Difficulty estimate:** 5
- **Angle:** ratio-percent

**Paraphrase:** Carnival admission is $25 per adult and $12 per child. On Saturday, adult tickets sold numbered 120 fewer than child tickets. On Sunday, adult sales dipped 10% while child sales rose 30%, and Sunday's combined sales came to 816 tickets. What takings did the carnival collect on Saturday?

**Solution path:** Step 1: Let Saturday child tickets = 1 unit, so Saturday adult tickets = 1 unit - 120. Step 2: Sunday adults = 90% of (1u - 120) = 0.9u - 108; Sunday children = 130% of 1u = 1.3u. Step 3: Sum: 0.9u - 108 + 1.3u = 816, so 2.2u = 924, giving u = 420 child tickets on Saturday, and adults = 420 - 120 = 300. Step 4: Saturday takings = 300 x $25 + 420 x $12 = $7500 + $5040 = $12,540. (Matches the sheet's answer key: $12,540.) Answer: $12,540.

**Why non-trivial:** Applies two different percentage changes to two linked unknowns, forces an equation from a total that lives in the 'after' world while the question asks about the 'before' world, and finishes with a two-part money computation — at least four dependent steps.

### Percentage #4 — reverse percentage / percentage-of-a-percentage-change (working backwards)

- **Source:** https://jimmymaths.com/wp-content/uploads/2019/08/5-Challenging-PSLE-Math-Questions-on-Percentage.pdf
- **Difficulty estimate:** 4
- **Angle:** ratio-percent

**Paraphrase:** Mrs Bala's habit is to bank 30% of whatever she earns. Her June pay was 10% higher than usual, which made her savings grow by $21. How large was the June pay?

**Solution path:** Step 1: The extra saving comes only from the extra pay: she saves 30% of the 10% raise, i.e. 0.30 x 0.10 = 3% of the usual salary. Step 2: 3% of usual salary = $21, so usual salary = 21 / 0.03 = $700. Step 3: June salary = 110% of $700 = $770. (Matches answer key: $770.) Check: usual saving 30% of 700 = $210; June saving 30% of 770 = $231; difference $21. Answer: $770.

**Why non-trivial:** A chained percentage (30% of a 10% increase) must be collapsed into a single 3% rate, then run backwards from the $21 difference to the unknown base, then forward again to June's figure — a reverse-percentage problem where naive students compute 30% or 10% of $21.

### Percentage #5 — remainder concept + before-after with unchanged part

- **Source:** https://jimmymaths.com/wp-content/uploads/2019/08/5-Challenging-PSLE-Math-Questions-on-Percentage.pdf
- **Difficulty estimate:** 5
- **Angle:** ratio-percent

**Paraphrase:** In a carpark for heavy vehicles, lorries make up 40% of all vehicles, vans account for 90% of the rest, and the remaining vehicles are buses. Vans outnumber lorries by 28. Later a number of lorries drive off, leaving lorries as 20% of the vehicles still parked. How many lorries stay behind?

**Solution path:** Step 1: Lorries = 40% of total; remainder = 60%; vans = 90% of 60% = 54%; buses = 6%. Step 2: Vans minus lorries = 54% - 40% = 14% of total = 28 vehicles, so 1% = 2 and the total = 200 (lorries 80, vans 108, buses 12). Step 3: After lorries leave, vans + buses = 108 + 12 = 120 is unchanged and now forms 100% - 20% = 80% of the new total, so new total = 120 / 0.8 = 150. Step 4: Lorries remaining = 20% of 150 = 30. (Matches answer key: 30.) Answer: 30 lorries.

**Why non-trivial:** Chains percentage-of-remainder to pin down the population, then flips to a second phase where the unchanged group (vans + buses) must be re-expressed as 80% of a new, smaller total — a remainder-concept and unchanged-quantity double play across four steps.

### Percentage #6 — percentage of remainder with working backwards (branching / repeated identity)

- **Source:** https://jimmymaths.com/wp-content/uploads/2019/08/5-Challenging-PSLE-Math-Questions-on-Percentage.pdf
- **Difficulty estimate:** 5
- **Angle:** ratio-percent

**Paraphrase:** Lynette set aside a pot of money for a 3-day trip. Day 1 got $78, Day 2 got 25% of what remained after Day 1, and the leftover went to Day 3 — an amount equal to 36% of the whole pot. She then moved some money from the Day 1 budget into Day 2 so Days 2 and 3 would match. How much moved?

**Solution path:** Step 1: Let the pot = T. After Day 1's $78, remainder = T - 78. Day 2 = 0.25(T - 78); Day 3 = 0.75(T - 78). Step 2: Day 3 also equals 36% of T: 0.75(T - 78) = 0.36T, so 0.75T - 58.5 = 0.36T, 0.39T = 58.5, T = $150. Step 3: Day 3 = 0.36 x 150 = $54; Day 2 = 0.25 x 72 = $18; Day 1 = $78 (sum checks: 78 + 18 + 54 = 150). Step 4: Transfer x so Day 2 matches Day 3: 18 + x = 54, x = $36. (Matches answer key: $36.) Answer: $36.

**Why non-trivial:** Requires setting the same quantity (Day 3) equal under two different descriptions — 75% of a remainder and 36% of the whole — solving for the total, reconstructing each day's budget, and only then answering the transfer question; a remainder/branching problem plus working backwards plus an equalising transfer.

### Percentage #7 — successive percentage change (discount then GST, changing base)

- **Source:** https://geniebook.com/us/exam-preparation/psle/article/psle-maths-percentage-discount-gst-problems
- **Difficulty estimate:** 2
- **Angle:** ratio-percent

**Paraphrase:** An article priced at $120 is marked down by 20%, and 9% GST is then charged on the reduced price. What does the buyer pay in the end?

**Solution path:** Step 1: Discount = 20% of $120 = $24, so the discounted price = $120 - $24 = $96. Step 2: GST = 9% of $96 = $8.64. Step 3: Final payment = $96 + $8.64 = $104.64. Answer: $104.64.

**Why non-trivial:** A two-stage percentage chain where the second percentage must be applied to the intermediate (discounted) price, not the original — the standard trap is computing 9% of $120 or netting the percentages as -20% + 9% = -11%; order and base of each percentage matter.

## Ratio (16 examples)

### Ratio #1 — before-after with unchanged quantity (constant part, equalise units)

- **Source:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
- **Difficulty estimate:** 3
- **Angle:** syllabus

**Paraphrase:** The savings of boy A and boy B are in the ratio 3 : 5. After A adds another $24 to his savings while B's stays the same, the ratio becomes 9 : 10. How much did A have at the start?

**Solution path:** Step 1: B is unchanged, so make B's units equal across both ratios: 3:5 = 6:10, and after is 9:10. Step 2: A rose from 6 units to 9 units, so 3 units = $24, 1 unit = $8. Step 3: A initially had 6 x $8 = $48. Check: B = $40? No — B = 10 x $8 = $80; A after = $48+$24 = $72; 72:80 = 9:10 correct. Answer: $48.

**Why non-trivial:** The ratios cannot be compared until they are rescaled to a common value for the unchanged party; spotting which quantity is constant and equalising its units is the key insight.

### Ratio #2 — constant difference (age problems)

- **Source:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
- **Difficulty estimate:** 3
- **Angle:** syllabus

**Paraphrase:** A boy's age and his father's age are in the ratio 1 : 4, and the father is 30 years older. In how many years will their ages be in the ratio 2 : 5?

**Solution path:** Step 1: Difference = 4 - 1 = 3 parts = 30 years, so 1 part = 10: boy is 10, father is 40. Step 2: The age gap never changes, so later the gap of 30 = 5 - 2 = 3 new parts, giving 1 new part = 10; ages then are 20 and 50. Step 3: Years elapsed = 20 - 10 = 10 years. Check: (10+10):(40+10) = 20:50 = 2:5. Answer: in 10 years.

**Why non-trivial:** Both quantities change over time but their difference is invariant; the solver must anchor the two different unit systems to the fixed 30-year gap rather than equate units directly.

### Ratio #3 — before-after with unchanged total (internal transfer)

- **Source:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
- **Difficulty estimate:** 3
- **Angle:** syllabus

**Paraphrase:** Two tins of cookies, A and B, hold amounts in the ratio 5 : 3. When 16 cookies are moved from A to B, the ratio flips to 3 : 5. How many cookies did A hold at first?

**Solution path:** Step 1: An internal transfer keeps the total fixed; both ratios already sum to 8 parts, so the part value is the same before and after. Step 2: A drops from 5 parts to 3 parts, i.e. 2 parts = 16 cookies, so 1 part = 8. Step 3: A started with 5 x 8 = 40 cookies. Check: B starts 24; after transfer A = 24, B = 40, ratio 24:40 = 3:5. Answer: 40.

**Why non-trivial:** Requires recognising the transfer preserves the total and exploiting that both ratio sums are equal so parts are directly comparable — a classic trap for students who set up algebra unnecessarily.

### Ratio #4 — before-after with unchanged total (constant total / internal transfer)

- **Source:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
- **Difficulty estimate:** 3
- **Angle:** heuristics

**Paraphrase:** Two children, M and J, share 120 stickers in the ratio 7:3. M then passes some stickers to J, after which their holdings stand in the ratio 3:2. How many stickers changed hands?

**Solution path:** Step 1: The transfer is internal, so the total (120) is constant. Before: 7 + 3 = 10 parts, so 1 part = 12; M has 84, J has 36. Step 2: Rewrite the after-ratio 3:2 with the same total of 10 parts: 6:4, so M has 72 and J has 48. Step 3: M dropped from 84 to 72, i.e. 7 units to 6 units = 1 unit = 12 stickers transferred. Check: 72:48 = 3:2. Answer: 12 stickers.

**Why non-trivial:** Needs the insight that an internal transfer preserves the total, then rescaling two ratios to a common total (10 parts) before the difference can be read off — three linked steps, no direct formula.

### Ratio #5 — constant difference (age gap invariant under equal addition)

- **Source:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
- **Difficulty estimate:** 3
- **Angle:** heuristics

**Paraphrase:** A boy's age and his father's age are currently in the ratio 1:4, and the father is 30 years older. After how many years will their ages sit in the ratio 2:5?

**Solution path:** Step 1: Now, the ratio difference is 4 - 1 = 3 parts = 30 years, so 1 part = 10: the boy is 10 and the father 40. Step 2: The age gap of 30 years never changes. In the target ratio 2:5 the difference is 5 - 2 = 3 units, so 3 units = 30 and 1 unit = 10: ages will be 20 and 50. Step 3: Years elapsed = 20 - 10 = 10. Check: 50 - 20 = 30 gap preserved; 20:50 = 2:5. Answer: in 10 years.

**Why non-trivial:** Two different ratio systems must each be anchored to the same invariant (the 30-year gap); students who try to scale one ratio into the other directly fail because both ages grow by the same amount, not the same factor.

### Ratio #6 — constant part / constant quantity (one side unchanged, equalise its units)

- **Source:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
- **Difficulty estimate:** 3
- **Angle:** heuristics

**Paraphrase:** Savings of two friends A and B stand in the ratio 3:5. A adds $24 to his savings while B's amount stays put, and the ratio becomes 9:10. How much did A have originally?

**Solution path:** Step 1: B is unchanged, so make B's units equal across both ratios: 3:5 = 6:10 (multiply by 2), against the after-ratio 9:10. Step 2: A rose from 6 units to 9 units, so 3 units = $24 and 1 unit = $8. Step 3: A's original savings = 6 units = $48. Check: B = 10 units = $80; after, A = 48 + 24 = 72 = 9 units of $8; 72:80 = 9:10. Answer: $48.

**Why non-trivial:** The unchanged party is B, so the ratios must be rescaled to equalise B's units before the change in A can be converted to dollars — a two-stage unit manipulation rather than direct proportion.

### Ratio #7 — repeated identity (common quantity across two ratios, equalise via LCM)

- **Source:** https://geniebook.com/tuition/primary-5/maths/ratio-strategy-repeated-identity
- **Difficulty estimate:** 2
- **Angle:** heuristics

**Paraphrase:** In one box, red pens compare to blue pens as 3:4, while the same red pens compare to black pens as 2:3. Express red : blue : black as a single ratio.

**Solution path:** Step 1: Red appears in both ratios (the repeated identity), so equalise its units via LCM(3, 2) = 6. Step 2: Scale red:blue = 3:4 by 2 to get 6:8; scale red:black = 2:3 by 3 to get 6:9. Step 3: With red equal to 6 units in both, merge: red : blue : black = 6 : 8 : 9. Answer: 6 : 8 : 9.

**Why non-trivial:** The same physical quantity carries different unit values in the two given ratios; a naive merge (3:4:3 or similar) is wrong. The solver must recognise the common identity and rescale both ratios to a shared unit before combining.

### Ratio #8 — units and parts (both quantities changed; algebraic units replace guess-and-check)

- **Source:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
- **Difficulty estimate:** 4
- **Angle:** heuristics

**Paraphrase:** A club's boys and girls are in the ratio 3:4. When 6 more boys sign up and 2 girls quit, the ratio flips to 3:2. How many boys were in the club originally?

**Solution path:** Step 1: Neither side is constant, so set units: boys = 3u, girls = 4u. Step 2: After the change, (3u + 6) : (4u - 2) = 3 : 2, so cross-multiply: 2(3u + 6) = 3(4u - 2). Step 3: 6u + 12 = 12u - 6, so 6u = 18 and u = 3. Step 4: Original boys = 3u = 9. Check: after, boys = 15 and girls = 10; 15:10 = 3:2. Answer: 9 boys.

**Why non-trivial:** Both quantities change by different amounts, so no invariant (total, difference, or part) survives — the constant-X shortcuts all fail and the solver must fall back on algebraic units and cross-multiplication.

### Ratio #9 — internal transfer with constant total (before-after with unchanged total)

- **Source:** https://homecampus.ai/blog/psle-math-question-types-appear-every-year-singapore-exam
- **Difficulty estimate:** 3
- **Angle:** fractions

**Paraphrase:** Two children hold marbles in the ratio 5 : 3. When the first passes 12 marbles to the second, their holdings become equal. What is their combined number of marbles?

**Solution path:** Step 1: The transfer is internal, so the total is unchanged: before = 5 + 3 = 8 units, after = 1 : 1 rewritten on the same total as 4 : 4. Step 2: The giver drops from 5 units to 4 units, so 1 unit = 12 marbles. Step 3: Total = 8 x 12 = 96. Check: 60 and 36; after the transfer 48 and 48. Final answer: 96 marbles.

**Why non-trivial:** Solvable only by equalising the before and after ratios on a common (unchanged) total before comparing units - students who compare 5:3 with 1:1 directly, without rescaling to 4:4, cannot locate what the 12 marbles represent.

### Ratio #10 — before-after with unchanged part (constant part)

- **Source:** https://www.essentialeducation.com.sg/psle-subjects-tips/p5-math-problem-sum-ratio-changed-before-after
- **Difficulty estimate:** 3
- **Angle:** ratio-percent

**Paraphrase:** A class has girls and boys in the ratio 3 : 2. Once 15 of the boys have gone out of the class, the girls-to-boys ratio changes to 9 : 1. Find how many pupils the class held before anyone left.

**Solution path:** Step 1: The number of girls never changes, so equalise the 'girls' term in both ratios. Before: G:B = 3:2 = 9:6 (multiply by 3). After: G:B = 9:1. Step 2: Boys drop from 6 units to 1 unit, a fall of 5 units, which corresponds to the 15 boys who left, so 5 units = 15, giving 1 unit = 3 pupils. Step 3: Original total = 9 + 6 = 15 units = 15 x 3 = 45 pupils. Check: 27 girls, 18 boys; 18 - 15 = 3; 27:3 = 9:1. Answer: 45 students.

**Why non-trivial:** Requires recognising which quantity is invariant, rescaling one ratio so the invariant part matches, then converting a unit difference into a real count before recovering the original total — three chained inferences, not a single proportion.

### Ratio #11 — constant difference (equal change to both parts)

- **Source:** https://www.bluetreeeducation.com/ratio-and-percentage-questions/
- **Difficulty estimate:** 4
- **Angle:** ratio-percent

**Paraphrase:** (PSLE 2021 Paper 1 Q29) A girl owns blue and red beads in the ratio 7 : 13. She takes away the same number of beads of each colour, leaving the blue-to-red ratio at 1 : 3. What percentage of her original beads is still with her?

**Solution path:** Step 1: Removing equal amounts keeps the red-blue difference constant. Before, the difference is 13 - 7 = 6 units. Step 2: The after ratio 1:3 has difference 2, so multiply it by 3 to get 3:9, whose difference is also 6 — now units are comparable. Step 3: Blue goes 7u to 3u and red 13u to 9u, i.e. 4u removed from each colour (consistent, as required). Step 4: Beads left = (3u + 9u) / (7u + 13u) = 12u/20u = 60%. Answer: 60% of the beads remain.

**Why non-trivial:** The solver must spot that equal removal preserves the difference (not the total or either part), rescale the after-ratio to match that difference, verify consistency, and finally convert a unit fraction into a percentage — a ratio-to-percentage hybrid typical of top-band Paper 1 items.

### Ratio #12 — units and parts with integer (divisibility) constraint

- **Source:** https://www.bluetreeeducation.com/ratio-and-percentage-questions/
- **Difficulty estimate:** 4
- **Angle:** ratio-percent

**Paraphrase:** (PSLE 2021 Paper 2 Q11) A cohort's boys and girls are in the ratio 7 : 4. Group P is formed from 30% of the boys together with 60% of the girls; everyone else forms Group Q. (a) Express the size of Group P to Group Q as a ratio. (b) Given the count of boys in Group P is below 70, what is the largest possible cohort size?

**Solution path:** Step 1: To avoid fractions, let boys = 70 units and girls = 40 units (ratio 7:4 scaled by 10). Step 2: Group P = 30% of 70u + 60% of 40u = 21u + 24u = 45u. Step 3: Whole cohort = 110u, so Group Q = 110u - 45u = 65u. Ratio P:Q = 45:65 = 9:13. Step 4 (b): Boys in P = 21u must be a whole number under 70; possible values 21, 42, 63 (u = 1, 2, 3). Largest is 63, so u = 3 and the cohort = 110u = 330. Answers: (a) 9 : 13, (b) 330 pupils.

**Why non-trivial:** Combines percentage-of-a-ratio-part with a deliberate unit choice (scaling 7:4 to 70:40 to keep integers), a complement step for Group Q, and an integer-constraint maximisation in part (b) — students must reason about which multiples are admissible, not just compute.

### Ratio #13 — before-after with unchanged part (constant part)

- **Source:** https://jimmymaths.com/4-must-know-concepts-psle-ratio-math-problems/
- **Difficulty estimate:** 2
- **Angle:** ratio-percent

**Paraphrase:** Two boys, Ali and Billy, hold money in the ratio 5 : 6. Billy then uses up $16, and the ratio turns into 3 : 2. What sum does Billy end up with?

**Solution path:** Step 1: Ali's money is untouched, so equalise Ali's share: before 5:6 = 15:18, after 3:2 = 15:10. Step 2: Billy falls from 18 units to 10 units, so 8 units = $16, giving 1 unit = $2. Step 3: Billy's final amount = 10 units = $20. Check: Ali $30, Billy $36; $36 - $16 = $20; 30:20 = 3:2. Answer: $20.

**Why non-trivial:** Needs the insight that the unchanged party's share is the bridge between the two ratios, an LCM rescaling of both ratios (x3 and x5), and a unit-value deduction — three steps that defeat direct proportion attempts.

### Ratio #14 — before-after with unchanged total (internal transfer / constant total)

- **Source:** https://jimmymaths.com/4-must-know-concepts-psle-ratio-math-problems/
- **Difficulty estimate:** 3
- **Angle:** ratio-percent

**Paraphrase:** Ali's and Billy's cash amounts stand in the ratio 5 : 4. Ali passes $20 over to Billy, after which both hold identical amounts. How much does Billy finish with?

**Solution path:** Step 1: An internal transfer keeps the combined total fixed. Before: A:B:Total = 5:4:9; after: 1:1:2. Step 2: Equalise totals with LCM 18: before becomes 10:8:18, after becomes 9:9:18. Step 3: Ali drops from 10 units to 9 units, so the $20 transferred equals 1 unit. Step 4: Billy's final amount = 9 units = $180. Check: Ali $200, Billy $160; after transfer both $180. Answer: $180.

**Why non-trivial:** The solver must recognise the invariant is the total (not a part), rescale two ratios to a common total via LCM, and read the transfer off as a one-unit shift — a classic internal-transfer structure that punishes anyone who equates raw ratio units across the two states.

### Ratio #15 — constant difference (age gap invariance)

- **Source:** https://jimmymaths.com/4-must-know-concepts-psle-ratio-math-problems/
- **Difficulty estimate:** 3
- **Angle:** ratio-percent

**Paraphrase:** Right now the ages of Ali and Billy compare as 4 : 7. Three years from now the comparison will be 3 : 5. Determine Billy's current age.

**Solution path:** Step 1: An age gap never changes over time. Current ratio 4:7 has difference 3; future ratio 3:5 has difference 2. Step 2: Equalise differences with LCM 6: now 8:14 (diff 6), later 9:15 (diff 6). Step 3: Each person gains 1 unit (8 to 9, 14 to 15) over the 3 years, so 1 unit = 3 years. Step 4: Billy now = 14 units = 42 years old. Check: Ali 24, Billy 42, gap 18; in 3 years 27:45 = 3:5. Answer: 42 years old.

**Why non-trivial:** Two different-looking ratios must be reconciled through the invariant gap, requiring an LCM-of-differences rescale and the subtle reading that the one-unit growth per person encodes the 3-year lapse — a multi-step invariant argument, not arithmetic on either ratio alone.

### Ratio #16 — everything-changed before-after (units and parts with cross-multiplication)

- **Source:** https://jimmymaths.com/4-must-know-concepts-psle-ratio-math-problems/
- **Difficulty estimate:** 4
- **Angle:** ratio-percent

**Paraphrase:** Ali's money compared with Billy's was in the ratio 2 : 1. Ali then added $60 to his amount while Billy used up $150 of his, and the new comparison became 4 : 1. What was Ali's starting amount?

**Solution path:** Step 1: Nothing is invariant (both parts, total and difference all change), so express the after-state in before-units: Ali = 2u + 60, Billy = 1u - 150. Step 2: Set these against the final ratio 4:1 by cross-multiplying: 1 x (2u + 60) = 4 x (1u - 150). Step 3: 2u + 60 = 4u - 600, so 2u = 660, i.e. Ali's starting amount (2 units) = $660. Check: Ali $660, Billy $330; after changes $720 and $180; 720:180 = 4:1. Answer: $660.

**Why non-trivial:** With no unchanged quantity, the standard equalising tricks fail; the solver must carry symbolic unit expressions through the change and cross-multiply against the final ratio — effectively a proto-algebraic 'everything changed' setup reserved for the hardest 5-mark slots.

## Speed & Rate (16 examples)

### Speed & Rate #1 — closing speed with staggered start (distance-speed-time chaining)

- **Source:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
- **Difficulty estimate:** 4
- **Angle:** syllabus

**Paraphrase:** Two towns are 270 km apart. A car sets off from one town at 8 a.m. travelling at 60 km/h. At 9 a.m. a second car leaves the other town heading toward the first at 90 km/h. At what clock time do they meet?

**Solution path:** Step 1: In the hour before the second car starts, the first covers 60 km, shrinking the gap to 270 - 60 = 210 km. Step 2: Closing speed once both move = 60 + 90 = 150 km/h. Step 3: Time to close 210 km = 210/150 = 1.4 h = 1 h 24 min after 9 a.m., so they meet at 10:24 a.m. Check: car 1 travels 2.4 h x 60 = 144 km; car 2 travels 1.4 h x 90 = 126 km; 144 + 126 = 270. Answer: 10:24 a.m.

**Why non-trivial:** The staggered start means the solver must first adjust the distance for the head-start hour, then switch to a combined-speed model, then convert a decimal hour into clock time — three distinct reasoning stages.

### Speed & Rate #2 — rate of combined work (work as unit whole, partial completion)

- **Source:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
- **Difficulty estimate:** 3
- **Angle:** syllabus

**Paraphrase:** Worker A alone finishes a job in 5 days; worker B alone takes 10 days. They work together for 2 days, after which A leaves. How many more days must B work alone to complete the job?

**Solution path:** Step 1: Combined daily rate = 1/5 + 1/10 = 3/10 of the job per day. Step 2: In 2 days they complete 2 x 3/10 = 3/5, leaving 2/5 of the job. Step 3: B's rate is 1/10 per day, so B needs (2/5) / (1/10) = 4 more days. Check: 2 days together (6/10) + 4 days of B (4/10) = 1 whole job. Answer: 4 days.

**Why non-trivial:** Requires modelling work as a unit whole, adding unlike fraction rates, tracking the remaining fraction after a partial phase, and dividing by a single rate — a full rate-of-work chain rather than one formula application.

### Speed & Rate #3 — combined (closing) speed for meeting, then time-linked distance comparison

- **Source:** https://www.edufirst.com.sg/blog/speed-distance-time-top-20-psle-questions-explained-with-step-by-step-solutions/
- **Difficulty estimate:** 4
- **Angle:** heuristics

**Paraphrase:** Two walkers set off simultaneously toward each other from the two ends of a 24 km path, one at 4 km/h and the other at 5 km/h. On meeting, each turns round and retraces the route to their own start. By the moment the slower walker regains his starting end, what total distance has the faster walker covered?

**Solution path:** Step 1: Closing speed = 4 + 5 = 9 km/h, so they meet after 24 / 9 = 8/3 hours. Step 2: At the meeting point the slower walker has covered 4 x 8/3 = 32/3 km and the faster one 5 x 8/3 = 40/3 km. Step 3: The slower walker's return leg is the same 32/3 km at 4 km/h, taking another 8/3 hours. Step 4: In those 8/3 hours the faster walker covers a further 5 x 8/3 = 40/3 km (exactly her own return distance, so she arrives at the same instant). Total for the faster walker = 40/3 + 40/3 = 80/3 km = 26 2/3 km. Answer: 26 2/3 km.

**Why non-trivial:** Combines a closing-speed meeting computation with a second phase measured by the other person's clock: the faster walker's distance in phase 2 depends on the slower walker's return time, requiring the solver to track two travellers across two legs.

### Speed & Rate #4 — rate of combined work (add rates, not times)

- **Source:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
- **Difficulty estimate:** 3
- **Angle:** heuristics

**Paraphrase:** One inlet pipe can fill a tank alone in 6 hours; a second manages it alone in 4 hours. Running both together, how long does filling the tank take?

**Solution path:** Step 1: Express each pipe as a rate: pipe 1 fills 1/6 of the tank per hour, pipe 2 fills 1/4 per hour. Step 2: Combined rate = 1/6 + 1/4 = 2/12 + 3/12 = 5/12 tank per hour. Step 3: Time = 1 / (5/12) = 12/5 hours = 2.4 hours = 2 hours 24 minutes. Check: in 12/5 h, pipe 1 fills (12/5)(1/6) = 2/5 and pipe 2 fills (12/5)(1/4) = 3/5; total 1 tank. Answer: 2 hours 24 minutes.

**Why non-trivial:** Times cannot be averaged or added — the solver must invert to rates, add fractions with unlike denominators, invert back, and convert the fractional hour to minutes; each step is a known trap.

### Speed & Rate #5 — gap and difference (equal-time distance gap = speed difference x time), U-turn double-counting

- **Source:** https://geniebook.com/exam-preparation/psle/article/solving-challenging-2023-psle-maths-questions-faizal-and-elise-jogging-question
- **Difficulty estimate:** 5
- **Angle:** speed

**Paraphrase:** Two runners set off together from the start line of a straight track, each keeping a steady pace. The quicker runner (Faizal) is 30 m/min faster than the slower one (Elise). Faizal runs to the far end of the track, immediately doubles back, and the two pass each other at the 4000-m point of the track; the far end lies 600 m beyond that point (i.e. the track is 4600 m long). Find Elise's speed. (PSLE 2023)

**Solution path:** Step 1: When they pass each other, Elise has covered 4000 m. Faizal has covered the full 4600 m plus 600 m back, i.e. 4600 + 600 = 5200 m. Step 2: They ran for the same amount of time, so the distance gap of 5200 - 4000 = 1200 m was built up entirely by Faizal's 30 m/min speed advantage. Step 3: Time elapsed = 1200 / 30 = 40 min. Step 4: Elise's speed = 4000 m / 40 min = 100 m/min. Answer: 100 m/min. (Check: Faizal at 130 m/min covers 130 x 40 = 5200 m.)

**Why non-trivial:** The turnaround geometry hides the key quantity: pupils must realise the extra distance is 600 m out PLUS 600 m back (1200 m, not 600 m), then connect equal elapsed time with the speed difference to extract time, and only then compute the speed. Three chained inferences with no formula that applies directly.

### Speed & Rate #6 — gap and difference (catch-up: head start / speed difference)

- **Source:** https://www.agrader.sg/post/conquering-challenging-psle-speed-questions-in-maths-4-tips-and-tricks-to-score-full-marks
- **Difficulty estimate:** 3
- **Angle:** speed

**Paraphrase:** A van sets out from Town A towards Town B at 10:00, cruising at 55 km/h. Three hours later, at 13:00, a car leaves Town A along the same road at 137.5 km/h. How long does the car take to draw level with the van?

**Solution path:** Step 1: Head start built by the van in 3 h = 55 x 3 = 165 km. Step 2: Closing speed = 137.5 - 55 = 82.5 km/h. Step 3: Time to close the gap = 165 / 82.5 = 2 h. Answer: 2 hours (the car catches the van at 15:00). (Check: van has driven 5 h x 55 = 275 km; car 2 h x 137.5 = 275 km — equal.)

**Why non-trivial:** Requires modelling a moving gap: first convert the staggered start into a head-start distance, then reason about relative (difference of) speeds rather than either actual speed, then divide. A decimal speed (137.5) also punishes sloppy arithmetic.

### Speed & Rate #7 — part-whole distance model with combined closing speed (pre-meeting gap)

- **Source:** https://www.agrader.sg/post/conquering-challenging-psle-speed-questions-in-maths-4-tips-and-tricks-to-score-full-marks
- **Difficulty estimate:** 4
- **Angle:** speed

**Paraphrase:** At 11:00 a.m. a cyclist leaves Park A heading for Park B at 28 km/h, while at the same instant a motorcyclist leaves Park B heading for Park A at 75 km/h. By 2:15 p.m. they still have not crossed paths and are 24.25 km from each other. What is the distance between the two parks?

**Solution path:** Step 1: Elapsed time = 11:00 a.m. to 2:15 p.m. = 3 h 15 min = 3.25 h. Step 2: Cyclist's distance = 28 x 3.25 = 91 km. Step 3: Motorcyclist's distance = 75 x 3.25 = 243.75 km. Step 4: Since they have not yet met, park-to-park distance = 91 + 243.75 + 24.25 = 359 km. Answer: 359 km. (Alternative check: combined speed 103 km/h x 3.25 h = 334.75 km covered; 334.75 + 24.25 = 359 km.)

**Why non-trivial:** A twist on the standard meeting problem: the pair have NOT met, so the remaining gap must be ADDED to the two travelled distances — students who apply the memorised 'total = combined speed x time' template get 334.75 and stop. Also needs a fractional-hour time conversion.

### Speed & Rate #8 — units and parts (fraction of whole) combined with distance = speed x time

- **Source:** https://www.agrader.sg/post/conquering-challenging-psle-speed-questions-in-maths-4-tips-and-tricks-to-score-full-marks
- **Difficulty estimate:** 2
- **Angle:** speed

**Paraphrase:** Driving at a steady 84 km/h, Mrs Jothi covers two-thirds of her trip in 10 minutes. How long is the entire trip?

**Solution path:** Step 1: Convert time: 10 min = 10/60 = 1/6 h. Step 2: Distance covered = 84 x 1/6 = 14 km, and this equals 2/3 of the journey. Step 3: 1/3 of the journey = 14 / 2 = 7 km, so the whole journey = 7 x 3 = 21 km. Answer: 21 km.

**Why non-trivial:** Chains a minutes-to-hours conversion with a fraction-of-whole (units and parts) recovery step: the computed distance is not the answer but a fractional part that must be scaled back up to the whole.

### Speed & Rate #9 — equal-distance-at-catch-up (same direction, staggered start)

- **Source:** https://www.kiasuparents.com/kiasu/article/psle-math-tips-on-speed-questions
- **Difficulty estimate:** 3
- **Angle:** speed

**Paraphrase:** A cyclist rides off from a starting point at 10:30 a.m. at 30 km/h. At 2:30 p.m. a motorist leaves the same point along the same route and overtakes... reaches the cyclist exactly 4 hours after setting off. What was the motorist's speed?

**Solution path:** Step 1: When caught, the cyclist has been riding from 10:30 a.m. to 6:30 p.m. = 8 h. Step 2: Distance to the catch-up point = 30 x 8 = 240 km. Step 3: The motorist covered that same 240 km in 4 h, so speed = 240 / 4 = 60 km/h. Answer: 60 km/h.

**Why non-trivial:** Hinges on the insight that at the moment of catching up both have travelled EQUAL distances, and on correctly totalling the cyclist's time (4-hour late start + 4-hour chase = 8 h). Two different elapsed times must be tracked simultaneously.

### Speed & Rate #10 — gap and difference (opening gap at constant rate)

- **Source:** https://www.kiasuparents.com/kiasu/article/psle-math-tips-on-speed-questions
- **Difficulty estimate:** 3
- **Angle:** speed

**Paraphrase:** Jon pedals away from Point A at 7 a.m. going 12 km/h. David leaves the same point 3 hours later in the same direction, but only manages 6 km/h. At what clock time will the two of them be 48 km apart?

**Solution path:** Step 1: By David's 10 a.m. start, Jon is already 12 x 3 = 36 km ahead. Step 2: Because Jon is faster, the gap keeps GROWING at 12 - 6 = 6 km/h. Step 3: Extra gap needed = 48 - 36 = 12 km, requiring 12 / 6 = 2 h after 10 a.m. Answer: 12 noon. (Check: at noon Jon has 5 h x 12 = 60 km, David 2 h x 6 = 12 km, 60 - 12 = 48 km.)

**Why non-trivial:** An opening-gap variant that defeats the reflex 'catch-up' template: the second traveller is SLOWER, so the head-start gap must be subtracted from the target separation and the speed difference used as a widening rate. Also asks for a clock time, adding a final conversion step.

### Speed & Rate #11 — average speed = total distance / total time (assumed convenient distance / LCM method)

- **Source:** https://www.edufirst.com.sg/blog/speed-distance-time-top-20-psle-questions-explained-with-step-by-step-solutions/
- **Difficulty estimate:** 3
- **Angle:** speed

**Paraphrase:** Daniel drives from Town A to Town B averaging 60 km/h, then makes the return trip along the same road averaging only 40 km/h. What is his average speed for the whole round trip?

**Solution path:** Step 1: Pick a convenient one-way distance, e.g. 120 km. Step 2: Outward time = 120/60 = 2 h; return time = 120/40 = 3 h. Step 3: Average speed = total distance / total time = 240 km / 5 h = 48 km/h. Answer: 48 km/h (independent of the distance chosen; note it is NOT (60+40)/2 = 50).

**Why non-trivial:** Tests the classic misconception that average speed is the mean of the two speeds; the pupil must introduce an auxiliary assumed distance (or common multiple of 60 and 40), compute two leg times, and form total-distance-over-total-time.

### Speed & Rate #12 — rate of combined work (additive rates with a negative/outflow rate)

- **Source:** http://road-to-psle.blogspot.com/2007/12/ai-tong-school-ca1-2007-math-question.html
- **Difficulty estimate:** 3
- **Angle:** speed

**Paraphrase:** One tap can fill a tank on its own in 3 minutes; a second tap fills the same tank in 4 minutes; and with the bottom plug removed, a full tank drains away in 12 minutes. If both taps run and the plug is out from the start, how long will it take the empty tank to fill completely?

**Solution path:** Step 1: Per-minute rates — Tap A fills 1/3 of the tank, Tap B fills 1/4, the plug drains 1/12. Step 2: Net fill per minute = 1/3 + 1/4 - 1/12 = 4/12 + 3/12 - 1/12 = 6/12 = 1/2 tank. Step 3: Time to fill 1 whole tank = 1 / (1/2) = 2 min. Answer: 2 minutes.

**Why non-trivial:** Requires converting three 'time to do the whole job' figures into per-minute fractional rates, combining positive and negative rates with a common denominator, and then inverting back from rate to time — the two direction-of-thinking flips (time->rate->time) trip up pupils who try to add or average the times directly.

### Speed & Rate #13 — rate of combined work with phase change (before-after rate regimes, negative rate)

- **Source:** https://www.kiasuparents.com/kiasu/article/identifying-psle-math-rate-problems
- **Difficulty estimate:** 4
- **Angle:** speed

**Paraphrase:** At 9 a.m. two taps start filling an empty tank together: alone, the first would take 4 hours and the second 3 hours to fill it. After exactly one hour the second tap breaks down, and at the same moment a drainage tap (which can empty a full tank in 2 hours) is accidentally opened. How long after the breakdown is the tank completely empty?

**Solution path:** Step 1: In the first hour the tank gains 1/4 + 1/3 = 7/12 of its capacity. Step 2: After the breakdown the inflow is only 1/4 per hour while the drain removes 1/2 per hour, so the net change is 1/4 - 1/2 = -1/4 tank per hour. Step 3: Time to empty the 7/12 already inside = (7/12) / (1/4) = 7/3 h = 2 h 20 min. Answer: 2 hours 20 minutes after the breakdown (i.e. at 12:20 p.m.).

**Why non-trivial:** A two-phase rates problem: the pupil must first accumulate a partial volume under one rate regime, then switch to a NEW net (negative) rate, and divide a fraction by a fraction to get an awkward mixed-number time. Misreading which taps are active in phase 2 is the standard error.

### Speed & Rate #14 — gap and difference (closing a difference at the difference of rates)

- **Source:** https://www.kiasuparents.com/kiasu/article/identifying-psle-math-rate-problems
- **Difficulty estimate:** 4
- **Angle:** speed

**Paraphrase:** Starting at 8:00 a.m., Tank X holding 5184 litres is drained at 34 litres per minute while Tank Y holding 1755 litres is drained at 7 litres per minute. Both drains shut off automatically the instant the two tanks hold equal amounts. (a) At what clock time does that happen? (b) How much water is then in each tank?

**Solution path:** Step 1: Initial difference between the tanks = 5184 - 1755 = 3429 litres. Step 2: X loses water 34 - 7 = 27 litres/min faster than Y, so the difference shrinks at 27 litres/min. Step 3: Time for the difference to vanish = 3429 / 27 = 127 min = 2 h 7 min, so the taps shut at 10:07 a.m. Step 4: Water left in Y (hence in each) = 1755 - 7 x 127 = 1755 - 889 = 866 litres. (Check with X: 5184 - 34 x 127 = 5184 - 4318 = 866.) Answers: (a) 10:07 a.m.; (b) 866 litres each.

**Why non-trivial:** The direct approach (tracking each tank minute by minute) is hopeless; the intended route is to reason about the DIFFERENCE between the tanks and the rate at which that difference closes — the constant-difference/gap heuristic transplanted from speed problems into a rates context, followed by a clock-time conversion and a back-substitution.

### Speed & Rate #15 — supposition (assumption method) applied to work rates

- **Source:** https://www.kiasuparents.com/kiasu/article/identifying-psle-math-rate-problems
- **Difficulty estimate:** 4
- **Angle:** speed

**Paraphrase:** Philip needs 21 days to renovate a kitchen alone; Desmond needs only 9 days for the same kitchen. Philip begins the renovation by himself, then hands over partway, and Desmond finishes the remainder alone. Altogether the job takes 13 days. For how many of those days did Desmond work?

**Solution path:** Step 1 (supposition): Pretend Philip worked all 13 days — he would complete 13/21 = 39/63 of the kitchen, leaving a shortfall of 1 - 39/63 = 24/63. Step 2: Each day reassigned from Philip to Desmond adds 1/9 - 1/21 = 7/63 - 3/63 = 4/63 of the job. Step 3: Days Desmond worked = (24/63) / (4/63) = 6. Answer: Desmond worked 6 days. (Check: Philip 7 days -> 7/21 = 1/3; Desmond 6 days -> 6/9 = 2/3; 1/3 + 2/3 = 1 whole job, and 7 + 6 = 13 days.)

**Why non-trivial:** Sequential (not simultaneous) work with only the TOTAL duration given: the pupil must run a supposition/assumed-scenario argument (or guess-and-check on the split) over fractional daily rates, then verify both the work total and the day total. Two constraints must be satisfied at once.

### Speed & Rate #16 — net rate (inflow minus outflow) converted to height rate via volume = base area x height

- **Source:** https://geniebook.com/exam-preparation/psle/article/psle-math-volume-rate-of-flow-problems
- **Difficulty estimate:** 3
- **Angle:** speed

**Paraphrase:** A tap pours water into a rectangular tank at 8 litres per minute. Five minutes after it is turned on, a second tap starts draining the tank at 3 litres per minute. The tank's base has an area of 400 cm^2. At what rate does the water level rise once the drain is running?

**Solution path:** Step 1: Convert to consistent units: inflow 8 L/min = 8000 cm^3/min, outflow 3 L/min = 3000 cm^3/min. Step 2: Net inflow after the drain opens = 8000 - 3000 = 5000 cm^3/min. Step 3: Rate of rise of the level = net volume rate / base area = 5000 / 400 = 12.5 cm/min. Answer: 12.5 cm per minute.

**Why non-trivial:** Links three ideas: litres-to-cubic-centimetre conversion, combining an inflow with an outflow into a net rate, and translating a volume rate into a height rate via the base area — the last step (dividing by base area) is a genuine conceptual leap beyond formula recall.

## Area & Volume (8 examples)

### Area & Volume #1 — conservation of volume across containers (V = base area x height, used in reverse)

- **Source:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
- **Difficulty estimate:** 2
- **Angle:** syllabus

**Paraphrase:** A rectangular tank measuring 30 cm by 20 cm by 25 cm is filled to 3/5 of its capacity. All of the water is then emptied into a second container whose base area is 200 cm². Find the depth of water in the second container.

**Solution path:** Step 1: Tank capacity = 30 x 20 x 25 = 15,000 cm³. Step 2: Water volume = 3/5 x 15,000 = 9,000 cm³. Step 3: Depth in new container = volume / base area = 9,000 / 200 = 45 cm. Answer: 45 cm.

**Why non-trivial:** Chains capacity computation, a fraction-of-volume step, and the inverse use of V = base area x height in a different vessel; students must realise volume is conserved across the pour while the shape changes.

### Area & Volume #2 — conservation of volume across containers (volume = base area x height, before-after transfer)

- **Source:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
- **Difficulty estimate:** 3
- **Angle:** heuristics

**Paraphrase:** A rectangular tank measuring 30 cm by 20 cm by 25 cm stands 3/5 full of water. All of this water is emptied into a second container whose base area is 200 cm^2. How high does the water rise in the second container?

**Solution path:** Step 1: Tank capacity = 30 x 20 x 25 = 15 000 cm^3. Step 2: Water volume = 3/5 x 15 000 = 9 000 cm^3. Step 3: Volume is conserved when poured, so height in the new container = 9 000 / 200 = 45 cm. Answer: 45 cm.

**Why non-trivial:** Chains a fraction-of-capacity computation with the conservation-of-volume idea and a division by base area; students must realise the shape changes but the volume does not, and not confuse the tank's own height (25 cm) with the answer.

### Area & Volume #3 — constant (unchanged) sides in perimeter comparison + units and parts + area by subtraction

- **Source:** https://blog.thinkacademy.sg/2024/11/solving-2024-psle-math/
- **Difficulty estimate:** 5
- **Angle:** geometry-whole

**Paraphrase:** A rectangular sheet of paper (long side AB = 50 cm) has its two bottom corners folded up along slanted creases, producing an inner shape X; the unfolded strip form is shape Y. Point C lies on edge BD such that BC : BD = 1 : 4, and the perimeter of shape X exceeds the perimeter of shape Y by 60 cm. Find the area of shape X. (2024 PSLE Paper 2 Q17, figure-based.)

**Solution path:** Step 1: Let BC = 1 unit; since BC:BD = 1:4, CD = 3 units. Step 2: Express both perimeters in terms of the shared side AB: perimeter of Y = 2(AB) + 2 units, perimeter of X = 2(AB) + 8 units. Step 3: Subtract — the 2(AB) parts cancel, so 8u − 2u = 6u = 60 cm, giving 1 unit = 10 cm. Step 4: The width of the rectangle AE = 4 units = 40 cm. Step 5: Area of X = area of full rectangle − the two folded triangular flaps = (50 × 40) − 500 = 2000 − 500 = 1500 cm². Final answer: 1500 cm².

**Why non-trivial:** Nothing is measured directly: the student must translate a fold into a perimeter comparison, notice that the common sides cancel so only the unit-lengths drive the 60 cm difference, convert units to cm, and then switch strategies to area-by-subtraction. Widely reported as the hardest question on the 2024 paper.

### Area & Volume #4 — overlap/exclusion via equal total lengths measured two ways (constant total)

- **Source:** https://geniebook.com/exam-preparation/psle/article/2019-semicircle-question-how-calculate-diameter-circle
- **Difficulty estimate:** 5
- **Angle:** geometry-whole

**Paraphrase:** Five identical semicircles are arranged along a horizontal line, three opening one way and two nested between them opening the other way. Along the line, the gaps between consecutive lower semicircle diameters are each 12 cm, while the two end offsets are 22 cm each and the middle gap on the other side is 16 cm. Find the diameter of one semicircle. (2019 PSLE Paper 2 semicircle question.)

**Solution path:** Step 1: Let the diameter be x. All five semicircles are identical, so every diameter is x. Step 2: Measure the total horizontal span of the figure two ways. Along one row: x + 12 + x + 12 + x = 3x + 24. Along the other row: 22 + x + 16 + x + 22 = 2x + 60. Step 3: The two expressions describe the same total length, so 3x + 24 = 2x + 60. Step 4: Solve: x = 60 − 24 = 36. Final answer: the diameter is 36 cm.

**Why non-trivial:** There is no circle formula involved at all — the trap. The student must invent a length-accounting argument (same span expressed via two different rows of the figure) and set up a one-unknown equation from a picture, a step most P6 students have never rehearsed. This question famously left 2019 candidates in tears.

### Area & Volume #5 — rate of combined work (net inflow) + volume–height relation

- **Source:** https://geniebook.com/exam-preparation/psle/article/psle-math-volume-rate-of-flow-problems
- **Difficulty estimate:** 3
- **Angle:** geometry-whole

**Paraphrase:** An empty rectangular tank with base area 400 cm² is filled by Tap A at 8 litres per minute. Five minutes after Tap A is turned on, a drain Tap B is opened and lets water out at 3 litres per minute. At what rate, in cm per minute, does the water level rise once both taps are running?

**Solution path:** Step 1: Convert litres to cm³: inflow 8 L/min = 8000 cm³/min, outflow 3 L/min = 3000 cm³/min. Step 2: After the 5-minute mark both taps run, so net inflow = 8000 − 3000 = 5000 cm³/min. Step 3: Rate of height increase = net volume rate ÷ base area = 5000 ÷ 400 = 12.5. Final answer: the level rises at 12.5 cm per minute.

**Why non-trivial:** Chains three ideas: litre-to-cm³ conversion, combining an inflow and outflow into a single net rate, and the volume-to-height relation V = base area × height applied to a rate. Students who treat 8 and 3 as heights, or forget the unit conversion, get order-of-magnitude errors.

### Area & Volume #6 — conservation of volume under transfer (before-after with unchanged total)

- **Source:** https://homecampus.ai/blog/psle-volume-cube-cuboid-guide
- **Difficulty estimate:** 3
- **Angle:** geometry-whole

**Paraphrase:** Tank P, measuring 50 cm by 40 cm by 36 cm, is completely full of water. All of its water is poured into an empty Tank Q measuring 60 cm by 48 cm by 30 cm. Find the depth of water in Tank Q afterwards.

**Solution path:** Step 1: Volume of water = volume of Tank P = 50 × 40 × 36 = 72,000 cm³. Step 2: Base area of Tank Q = 60 × 48 = 2880 cm². Step 3: New depth = volume ÷ base area = 72,000 ÷ 2880 = 25 cm (which is below Q's 30 cm height, so no overflow). Final answer: 25 cm.

**Why non-trivial:** Requires recognising that volume is conserved across the transfer while the height is not, choosing the correct base area (the receiving tank's), and sanity-checking against overflow — a three-step chain rather than a single formula plug-in.

### Area & Volume #7 — fraction of a quantity + remainder concept + rate (volume per unit time)

- **Source:** https://homecampus.ai/blog/psle-volume-cube-cuboid-guide
- **Difficulty estimate:** 3
- **Angle:** geometry-whole

**Paraphrase:** A rectangular tank measures 75 cm by 48 cm by 40 cm and is 5/8 full of water. (a) How many litres of water are in the tank? (b) A tap fills the tank at 6 litres per minute; how long will it take to fill the tank completely?

**Solution path:** Step 1: Capacity of tank = 75 × 48 × 40 = 144,000 cm³ = 144 litres. Step 2 (a): Water present = 5/8 × 144 = 90 litres. Step 3 (b): Water still needed = 144 − 90 = 54 litres. Step 4: Time = 54 ÷ 6 = 9 minutes. Final answers: (a) 90 litres; (b) 9 minutes.

**Why non-trivial:** Chains four operations across two parts: computing capacity, converting cm³ to litres, taking a fraction of capacity, then reasoning about the COMPLEMENT (the unfilled 3/8) before applying the fill rate. The common error is timing the full 144 litres instead of the remaining 54.

### Area & Volume #8 — fraction of a quantity + conservation of volume under transfer

- **Source:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
- **Difficulty estimate:** 3
- **Angle:** geometry-whole

**Paraphrase:** A tank measuring 30 cm by 20 cm by 25 cm is 3/5 full of water. All the water is then poured into an empty container whose base area is 200 cm². Find the height of the water in the container.

**Solution path:** Step 1: Depth of water in the tank = 3/5 × 25 = 15 cm. Step 2: Volume of water = 30 × 20 × 15 = 9000 cm³. Step 3: Height in new container = 9000 ÷ 200 = 45 cm. Final answer: 45 cm.

**Why non-trivial:** Combines a fractional fill (fraction applies to the height, not the base), a volume computation, and conservation of volume into a differently-shaped container — three chained steps where taking 3/5 of the wrong dimension or of the base area derails the answer.

## Whole Numbers (13 examples)

### Whole Numbers #1 — looking for patterns / LCM of common differences

- **Source:** https://www.agrader.sg/post/psle-maths-2025-walkthrough-of-8-tricky-questions-with-full-solutions
- **Difficulty estimate:** 4
- **Angle:** syllabus

**Paraphrase:** Sequence P runs 3, 7, 11, 15, ... (adding 4 each time) and sequence Q runs 7, 12, 17, 22, ... (adding 5 each time). The number 7 is the first value appearing in both. Find the sum of the next two shared values.

**Solution path:** Step 1: A number in both sequences must sit 7 plus a multiple of both gaps; LCM(4, 5) = 20, so shared values occur every 20. Step 2: Next shared terms are 7 + 20 = 27 and 27 + 20 = 47 (check: 27 = 3+6x4 and 27 = 7+4x5; 47 = 3+11x4 and 47 = 7+8x5). Step 3: Sum = 27 + 47 = 74. Answer: 74.

**Why non-trivial:** Turns a pattern question into a common-multiple problem: the solver must abstract each list into 'first term + multiple of difference' and see that co-occurrence advances by the LCM of the two differences.

### Whole Numbers #2 — systematic listing / common remainder intersection

- **Source:** https://www.agrader.sg/post/psle-maths-2025-walkthrough-of-8-tricky-questions-with-full-solutions
- **Difficulty estimate:** 4
- **Angle:** syllabus

**Paraphrase:** Ava and Sam each carry the same sum of money, less than $40. Ava spends all but $3 buying pillows at $8 apiece; Sam spends all but $7 buying towels at $5 apiece. How many towels does Sam buy?

**Solution path:** Step 1: Ava's possible sums are $8k + 3 under $40: 11, 19, 27, 35. Step 2: Sam's possible sums are $5m + 7 under $40: 12, 17, 22, 27, 32, 37. Step 3: The only common value is $27, so each had $27. Step 4: Sam spends 27 - 7 = $20 on towels, buying 20/5 = 4 towels. Answer: 4.

**Why non-trivial:** No direct equation is given; the solver must generate two residue lists systematically, intersect them under the $40 cap, and only then do the final division — systematic listing plus a divisibility/remainder argument.

### Whole Numbers #3 — assumption/supposition method (guess-all-of-one-kind and adjust)

- **Source:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
- **Difficulty estimate:** 3
- **Angle:** syllabus

**Paraphrase:** A farm keeps chickens and cows, 30 animals in total, with 96 legs altogether. How many chickens are there?

**Solution path:** Step 1: Suppose all 30 animals were chickens: 30 x 2 = 60 legs. Step 2: Shortfall from reality = 96 - 60 = 36 legs; each chicken-to-cow swap adds 2 legs. Step 3: Cows = 36 / 2 = 18, so chickens = 30 - 18 = 12. Check: 12x2 + 18x4 = 24 + 72 = 96. Answer: 12 chickens.

**Why non-trivial:** A two-constraint system solved without algebra: the supposition step, the interpretation of the leg surplus, and the per-swap adjustment must all be reasoned through — the canonical PSLE 'assumption method' item.

### Whole Numbers #4 — assumption / supposition method (guess-and-check replaced by structured assumption)

- **Source:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
- **Difficulty estimate:** 3
- **Angle:** heuristics

**Paraphrase:** A farm holds 30 animals — chickens and cows — with 96 legs among them altogether. Work out the number of chickens.

**Solution path:** Step 1: Suppose all 30 animals were chickens: 30 x 2 = 60 legs. Step 2: Shortfall from reality = 96 - 60 = 36 legs. Step 3: Swapping a chicken for a cow adds 4 - 2 = 2 legs, so cows = 36 / 2 = 18. Step 4: Chickens = 30 - 18 = 12. Check: 12 x 2 + 18 x 4 = 24 + 72 = 96 legs. Answer: 12 chickens.

**Why non-trivial:** There is no direct division that yields the answer; the solver must reason counterfactually from an assumed extreme case and interpret the leg discrepancy as a count of swaps — the standard replacement for simultaneous equations at P6.

### Whole Numbers #5 — excess and shortage (two-scenario distribution, gap = excess + shortage)

- **Source:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
- **Difficulty estimate:** 3
- **Angle:** heuristics

**Paraphrase:** A batch of pencils is packed into boxes. Packing 6 to a box leaves 4 pencils over; packing 8 to a box leaves the last box 6 pencils short. How many pencils are in the batch?

**Solution path:** Step 1: Let b = number of boxes; both packings describe the same pencil count, so 6b + 4 = 8b - 6. Step 2: Solve: 2b = 10, so b = 5 boxes. Step 3: Pencils = 6 x 5 + 4 = 34. Check: 8 x 5 - 6 = 34 as well. (Heuristic shortcut: total gap = excess + shortage = 4 + 6 = 10; per-box difference = 8 - 6 = 2; boxes = 10 / 2 = 5.) Answer: 34 pencils.

**Why non-trivial:** Two distribution scenarios must be equated through a hidden shared unknown (the box count); the excess and the shortage have to be combined additively, which is counterintuitive, before dividing by the per-box difference.

### Whole Numbers #6 — gap and difference (equalise one quantity across scenarios, read the residual gap)

- **Source:** https://acescorers.com.sg/psle-math/2024/04/05/psle-math-problem-sums-method-gap-and-difference/
- **Difficulty estimate:** 4
- **Angle:** heuristics

**Paraphrase:** Buying 5 apples together with 3 oranges costs $2.70, while 2 apples with 4 oranges cost $2.20. What would a dozen apples cost?

**Solution path:** Step 1: Equalise the apple counts: multiply the first purchase by 2 (10 apples + 6 oranges = $5.40) and the second by 5 (10 apples + 20 oranges = $11.00). Step 2: Subtract: the $11.00 - $5.40 = $5.60 gap corresponds to 20 - 6 = 14 oranges, so 1 orange = $0.40. Step 3: From the second purchase, 4 oranges = $1.60, so 2 apples = $2.20 - $1.60 = $0.60 and 1 apple = $0.30. Step 4: A dozen apples = 12 x $0.30 = $3.60. Check: 5(0.30) + 3(0.40) = 1.50 + 1.20 = $2.70; 2(0.30) + 4(0.40) = 0.60 + 1.60 = $2.20. Answer: $3.60. (Note: the source page's own working slips at Step 3, giving $0.80 for 2 apples and hence $4.80; the corrected arithmetic above satisfies both original conditions.)

**Why non-trivial:** A two-unknown system solved without algebraic notation: the solver must scale both scenarios to close the gap on one item, interpret the cost difference as a count of the other item, then back-substitute — four chained steps.

### Whole Numbers #7 — repeated identity / before-after comparison

- **Source:** https://danielsmathtuition.com/solving-the-5-hardest-psle-math-questions/
- **Difficulty estimate:** 3
- **Angle:** fractions

**Paraphrase:** Three identical tins are completely full of paint. From each tin 760 ml is poured out, and the paint still left across all three tins then equals exactly one full tin's original content. What did each tin hold at first?

**Solution path:** Step 1: Total poured out = 3 x 760 = 2280 ml. Step 2: Let one full tin = T. Paint left = 3T - 2280, and this equals T, so 3T - 2280 = T. Step 3: 2T = 2280, so T = 1140 ml. Check: 3 x 1140 = 3420; pour out 2280; left 1140 = one tin. Final answer: 1,140 ml.

**Why non-trivial:** A before-after part-whole relation where the 'after' quantity is defined in terms of the unknown 'before' quantity itself (repeated identity), so it cannot be solved by direct arithmetic - the student must see that the amount removed equals two tins' worth.

### Whole Numbers #8 — working backwards + percentage change on an unknown base

- **Source:** https://blog.thinkacademy.sg/2024/11/solving-2024-psle-math/
- **Difficulty estimate:** 4
- **Angle:** geometry-whole

**Paraphrase:** Tina had 97 magnets in total, some small and some large. She gave away 4 small magnets, then bought more large magnets so that her number of large magnets grew by 50%. She ended with 114 magnets altogether. How many more small magnets than large magnets did she have at the start? (2024 PSLE working-backwards question.)

**Solution path:** Step 1: After giving away 4 small magnets she had 97 − 4 = 93 magnets. Step 2: Her total then rose to 114, an increase of 114 − 93 = 21 magnets, all of them newly bought large ones. Step 3: These 21 magnets represent the 50% increase, so the original number of large magnets = 21 ÷ 50% = 42. Step 4: Original small magnets = 97 − 42 = 55. Step 5: Difference = 55 − 42 = 13. Final answer: 13 more small magnets than large.

**Why non-trivial:** The student must run the timeline backwards, isolate which type of magnet each change affects, and interpret an absolute increase (21) as a percentage (50%) of an unknown base — mixing working-backwards with percentage-of-unknown reasoning inside one whole-number problem.

### Whole Numbers #9 — systematic listing / optimisation by exhaustive combination

- **Source:** https://blog.thinkacademy.sg/2024/11/solving-2024-psle-math/
- **Difficulty estimate:** 4
- **Angle:** geometry-whole

**Paraphrase:** A ticket booth sells: 1 adult ticket for $24, 1 child ticket for $18, a bundle of 1 adult + 1 child for $36, and a bundle of 2 adults + 1 child for $56. A group needs exactly 4 adult and 3 child tickets. What is the least amount they must pay? (2024 PSLE optimisation question.)

**Solution path:** Step 1: Compare bundle savings — the 1A+1C bundle saves $6 versus singles ($42 → $36); the 2A+1C bundle saves $10 ($66 → $56). Step 2: Systematically cover 4A+3C with combinations: (i) two 1A+1C bundles + one 2A+1C bundle = $36×2 + $56 = $128 (exactly 4A, 3C); (ii) two 2A+1C bundles + one child single = $112 + $18 = $130; (iii) three 1A+1C bundles + one adult single = $108 + $24 = $132; (iv) all singles = $96 + $54 = $150. Step 3: The minimum among the exact covers is $128. Final answer: $128.

**Why non-trivial:** There is no formula — the student must enumerate bundle combinations that exactly cover the required ticket counts and compare costs, resisting the greedy trap of maximising the biggest-saving bundle (which yields $130, not the optimum).

### Whole Numbers #10 — factors and multiples reasoning with systematic elimination

- **Source:** https://blog.thinkacademy.sg/2024/11/solving-2024-psle-math/
- **Difficulty estimate:** 4
- **Angle:** geometry-whole

**Paraphrase:** Two whole numbers are each less than 40 and add up to 60. Their common factors are exactly 1, 2 and 4, and each number has exactly 6 factors. What are the two numbers? (2024 PSLE factors question.)

**Solution path:** Step 1: Since 4 is a common factor, both numbers are multiples of 4. Step 2: List pairs of multiples of 4 that sum to 60 with both under 40: (24,36), (28,32). Step 3: Check the 6-factor condition — 24 has 8 factors (1,2,3,4,6,8,12,24) and 36 has 9, so (24,36) fails; 28 has exactly 6 factors (1,2,4,7,14,28) and 32 has exactly 6 (1,2,4,8,16,32). Step 4: Check common factors of 28 and 32: gcd = 4, whose factors are exactly 1, 2, 4 — condition met. Final answer: 28 and 32.

**Why non-trivial:** Requires stacking three number-theory constraints (divisibility by 4, a fixed factor count, a restricted common-factor set) and pruning a candidate list against each — pure structured reasoning about factors rather than computation.

### Whole Numbers #11 — pattern generalisation (square numbers) + gap and difference (sum-and-difference pair)

- **Source:** https://geniebook.com/exam-preparation/psle/article/hardest-psle-maths-questions-and-how-solve-them
- **Difficulty estimate:** 5
- **Angle:** geometry-whole

**Paraphrase:** A sequence of figures is built from small triangles: each new figure adds one more row containing 2 more triangles than the previous row, and the rows alternate colour (white row, then grey row, and so on). Figure 1 has 1 white triangle; Figure 2 has 1 white and 3 grey; Figure 3 has 6 white and 3 grey; Figure 4 has 6 white and 10 grey. (a) Complete the counts for Figure 5. (b) For Figure 250, find the total number of triangles and the percentage that are grey. (Famous 2019 PSLE pattern question.)

**Solution path:** Step 1 (a): Figure 4's last row is grey with 7 triangles, so Figure 5 adds a white row of 9: white = 6 + 9 = 15, grey stays 10, total = 25. Step 2: Spot the generalisation — total triangles in Figure n = n², confirmed by 1, 4, 9, 16, 25. Step 3 (b): Total for Figure 250 = 250 × 250 = 62,500. Step 4: The colour gap grows by 1 per figure (1, 2, 3, 4, ...), so in Figure 250 grey exceeds white by 250 (even figures end on a grey row). Step 5: Sum-and-difference: white = (62,500 − 250) ÷ 2 = 31,125; grey = (62,500 + 250) ÷ 2 = 31,375. Step 6: Percentage grey = 31,375 ÷ 62,500 × 100% = 50.2%. Final answers: Figure 5 = 15 white, 10 grey, 25 total; Figure 250 has 62,500 triangles, 50.2% grey.

**Why non-trivial:** The student cannot draw Figure 250 — they must extract TWO simultaneous generalisations (total = n², colour gap = n), then solve a sum-and-difference pair and convert to a percentage. Merges pattern generalisation with the gap-and-difference heuristic; a notoriously tear-inducing PSLE item.

### Whole Numbers #12 — gap and difference (excess-and-shortage)

- **Source:** https://mastermaths.com.sg/2-simple-approaches-to-excess-shortage-word-problems/
- **Difficulty estimate:** 3
- **Angle:** geometry-whole

**Paraphrase:** Jack wants to share sweets equally among his friends. Giving 8 sweets to each friend would leave him 32 sweets short, but giving 5 sweets to each friend would leave him with 7 sweets over. How many sweets does Jack actually have?

**Solution path:** Step 1: Compare the two distribution plans — the swing from 7 extra to 32 short is a total gap of 7 + 32 = 39 sweets. Step 2: Each friend accounts for 8 − 5 = 3 sweets of that gap, so the number of friends = 39 ÷ 3 = 13. Step 3: Sweets = 5 × 13 + 7 = 72 (check: 8 × 13 = 104 = 72 + 32 shortfall, consistent). Final answer: 72 sweets.

**Why non-trivial:** The excess and the shortage must be ADDED (not subtracted) to get the total gap, then divided by the per-person difference — a two-layer comparison that defeats direct equation-free intuition; the classic excess-shortage structure PSLE recycles yearly.

### Whole Numbers #13 — remainder concept + common multiples with systematic listing

- **Source:** https://mastermaths.com.sg/2-simple-approaches-to-excess-shortage-word-problems/
- **Difficulty estimate:** 3
- **Angle:** geometry-whole

**Paraphrase:** Amanda owns between 20 and 60 marbles. Packing them into bags of 6 leaves 5 marbles over; packing them into bags of 8 leaves her 3 marbles short of filling the last bag. What is the smallest possible number of marbles she could have?

**Solution path:** Step 1: Translate to remainders — the count is 5 more than a multiple of 6 (23, 29, 35, 41, 47, 53, 59 within range) and 3 less than a multiple of 8, i.e. remainder 5 when divided by 8 (21, 29, 37, 45, 53 within range). Step 2: Intersect the two lists: common values are 29 and 53. Step 3: Take the smallest in the allowed range 20–60. Final answer: 29 marbles.

**Why non-trivial:** Being '3 short of a full bag of 8' must be re-read as 'remainder 5 when divided by 8' — a translation step — before running a two-list common-value search under a range constraint; three distinct reasoning moves with no arithmetic shortcut.

