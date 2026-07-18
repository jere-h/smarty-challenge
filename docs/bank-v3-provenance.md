# Bank v3 provenance

Every shipped question maps to a named archetype in bank-v3-archetypes.md; each archetype
was distilled from >=2 sourced examples in bank-v3-research.md. No shipped prompt copies
any sourced text — all questions are original permutations (fresh numbers, contexts,
phrasing) verified by two independent blind solvers.

## Verification summary

- Candidates generated: 78 (13 per topic x 6 topics)
- Blind verification: every candidate was independently solved by two separate agents
  (different models) given only the prompt/options, never the claimed answer.
- All 78 candidates passed with both solvers agreeing with the author; no arbiter
  adjudications were needed and zero questions were patched.
- Difficulty audit: several candidates were relabelled to honest difficulty values;
  none were dropped for being one-step.
- 18 verified candidates were culled only to fit the 10-per-topic quota (best
  difficulty/type spread kept). They are listed at the bottom.

## Question provenance and worked solutions

### pm-frac-01 — Fractions, difficulty 3, short-numeric

- **Archetype:** A01-remainder-fraction (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples ; https://geniebook.com/tuition/primary-6/maths/fractions-remainder ; https://tlstutorials.com/common-psle-math-questions-a-comprehensive-guide-to-problem-sums/
- **Worked solution:** After giving 3/8 away, the fraction remaining is 5/8. Of that remainder she keeps 3/5 (she gives away 2/5). Fraction of the original still remaining = 5/8 x 3/5 = 3/8. This equals 90, so 1/8 = 30 and the whole box = 8 x 30 = 240. Final answer: 240.

### pm-frac-02 — Fractions, difficulty 4, mcq

- **Archetype:** A01-remainder-fraction (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples ; https://geniebook.com/tuition/primary-6/maths/fractions-remainder ; https://tlstutorials.com/common-psle-math-questions-a-comprehensive-guide-to-problem-sums/
- **Worked solution:** Selling 2/5 leaves 3/5 of the crate as the remainder. The 33 left-over oranges are the 1/4 of the remainder that was not packed, so the remainder = 33 x 4 = 132. Packed = 3/4 x 132 = 99. (Check: whole = 132 / (3/5) = 220; sold 88; remainder 132; packed 99; left 33.) Final answer: 99.
- **Distractor design:** 220 = the whole crate (student found the original total but forgot the question asks for the packed amount). 165 = 3/4 x 220, applying the packing fraction to the ORIGINAL whole instead of the remainder. 132 = the remainder after the cafe sale, stopping at the intermediate value. Correct 99: after selling 2/5 the remainder is 3/5 of the crate; the 33 left over are 1/4 of that remainder, so the remainder = 33 x 4 = 132, and packed = 3/4 x 132 = 99.

### pm-frac-03 — Fractions, difficulty 4, short-numeric

- **Archetype:** A02-remainder-adjusted (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://geniebook.com/tuition/primary-6/maths/fractions-remainder ; https://jimmymaths.com/hardest-psle-math-questions/
- **Worked solution:** Work backwards. Before the $4 drink she had 30 + 4 = 34, which is the half left after lunch, so before lunch she had 34 x 2 = 68. That 68 is what remained after the pen, so before the $4 pen she had 68 + 4 = 72, which is the 3/4 left after buying the book. Original = 72 / (3/4) = 96. (Check: 96 - 24 - 4 = 68; 68 - 34 - 4 = 30.) Final answer: 96.

### pm-frac-04 — Fractions, difficulty 5, short-numeric

- **Archetype:** A02-remainder-adjusted (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://geniebook.com/tuition/primary-6/maths/fractions-remainder ; https://jimmymaths.com/hardest-psle-math-questions/
- **Worked solution:** Reverse the timeline stage by stage. Evening: 15 - 5 = 10 is the half left after the evening use, so before the evening the tank held 10 x 2 = 20. Afternoon: add back the 6 drained -> 26, which is the 2/3 left after the afternoon use, so before the afternoon = 26 / (2/3) = 39. Morning: subtract the 15 added -> 24, which is the 3/4 left after the morning use, so the original = 24 / (3/4) = 32. (Check forward: 32 -> use 8 -> 24 -> +15 -> 39 -> use 13 -> 26 -> -6 -> 20 -> use 10 -> 10 -> +5 -> 15.) Final answer: 32.

### pm-frac-05 — Fractions, difficulty 4, short-numeric

- **Archetype:** A09-both-changed-units (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples ; https://jimmymaths.com/4-must-know-concepts-psle-ratio-math-problems/ ; https://tlstutorials.com/common-psle-math-questions-a-comprehensive-guide-to-problem-sums/ ; https://geniebook.com/tuition/primary-6/maths/fractions-remainder
- **Worked solution:** Both quantities change, so no invariant exists; carry the yellow count symbolically. Let yellow = y, green = 3/4 y. After the changes: 3/4 y + 5 = 5/6 (y - 4). Multiply through by 12: 9y + 60 = 10(y - 4) = 10y - 40, giving y = 100. Green at first = 3/4 x 100 = 75. (Check: 75 + 5 = 80, 100 - 4 = 96, and 80 = 5/6 x 96.) Final answer: 75.

### pm-frac-06 — Fractions, difficulty 4, mcq

- **Archetype:** A09-both-changed-units (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples ; https://jimmymaths.com/4-must-know-concepts-psle-ratio-math-problems/ ; https://tlstutorials.com/common-psle-math-questions-a-comprehensive-guide-to-problem-sums/ ; https://geniebook.com/tuition/primary-6/maths/fractions-remainder
- **Worked solution:** Ryan keeps 2/3 of his money and Suri keeps 3/5 of hers, and the leftovers are equal. Let Suri = s, Ryan = s - 40. Then 2/3(s - 40) = 3/5 s. Multiply by 15: 10(s - 40) = 9s, so 10s - 400 = 9s and s = 400. (Check: Ryan 360 spends 1/3 -> 240; Suri 400 spends 2/5 -> 240.) Final answer: 400.
- **Distractor design:** 360 = Ryan's original amount (answered the wrong person). 240 = the equal amount each was left with after spending (answered the after-world instead of the before-world). 760 = the total the two had at first (misread which quantity is asked). Correct 400: Ryan keeps 2/3 and Suri keeps 3/5, and these are equal; with Suri = s and Ryan = s - 40, 2/3(s - 40) = 3/5 s gives s = 400.

### pm-frac-07 — Fractions, difficulty 3, short-numeric

- **Archetype:** A15-volume-conservation (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples ; https://homecampus.ai/blog/psle-volume-cube-cuboid-guide
- **Worked solution:** Water height in the tank = 4/5 x 50 = 40 cm. Volume of water = 40 x 30 x 40 = 48000 cm^3 (this is conserved). Base area of the container = 40 x 20 = 800 cm^2. New depth = 48000 / 800 = 60 cm, which is below the container's 70 cm height, so it does not overflow. Final answer: 60.

### pm-frac-08 — Fractions, difficulty 3, mcq

- **Archetype:** A15-volume-conservation (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples ; https://homecampus.ai/blog/psle-volume-cube-cuboid-guide
- **Worked solution:** Oil height in the drum = 3/4 x 40 = 30 cm. Volume = 40 x 30 x 30 = 36000 cm^3. Tray base area = 40 x 20 = 800 cm^2. Depth in the tray = 36000 / 800 = 45 cm (below the 55 cm height). Final answer: 45.
- **Distractor design:** 60 = used the drum's FULL capacity (48000/800), ignoring the 3/4 fill. 30 = reported the oil depth inside the drum (3/4 x 40), stopping at the source. 15 = used the empty 1/4 of the drum instead of the filled 3/4 (12000/800). Correct 45: oil volume = 40 x 30 x (3/4 x 40) = 36000 cm^3, divided by the tray base 800 cm^2.

### pm-frac-09 — Fractions, difficulty 4, mcq

- **Archetype:** A04-unchanged-quantity-rebase (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.essentialeducation.com.sg/psle-subjects-tips/p5-math-problem-sum-percentage-of-quantity-that-changed-before-after ; https://jimmymaths.com/wp-content/uploads/2019/08/5-Challenging-PSLE-Math-Questions-on-Percentage.pdf ; https://www.essentialeducation.com.sg/psle-subjects-tips/p5-math-problem-sum-ratio-changed-before-after
- **Worked solution:** The adults do not change. Adults = 3/5 T at first, and after 60 children leave, adults = 3/4 of the new total (T - 60). So 3/5 T = 3/4(T - 60). Multiply by 20: 12T = 15(T - 60) = 15T - 900, so 3T = 900 and T = 300. (Check: adults 180, children 120; after 60 leave, 240 remain and 180 = 3/4 x 240.) Final answer: 300.
- **Distractor design:** 400 = treated the total as unchanged and set the drop 60 = (2/5 - 1/4) of the original = 3/20 of T. 240 = the number of visitors remaining after the children left (an intermediate). 180 = the number of adults. Correct 300: the adults are the unchanged group, so 3/5 T = 3/4(T - 60), giving T = 300.

### pm-frac-10 — Fractions, difficulty 3, mcq

- **Archetype:** A03-percent-chain-reverse (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.agrader.sg/post/psle-maths-2025-walkthrough-of-8-tricky-questions-with-full-solutions ; https://jimmymaths.com/wp-content/uploads/2019/08/5-Challenging-PSLE-Math-Questions-on-Percentage.pdf ; https://geniebook.com/us/exam-preparation/psle/article/psle-maths-percentage-discount-gst-problems ; https://blog.thinkacademy.sg/2024/11/solving-2024-psle-math/
- **Worked solution:** After the first reduction the price is 3/4 of the original. The second reduction applies to that reduced price, leaving 2/3 of it, so the final price = 2/3 x 3/4 = 1/2 of the original. Then 1/2 of the original = 60, so the original = 120. Final answer: 120.
- **Distractor design:** 144 = subtracted both fractions from the original base (1 - 1/4 - 1/3 = 5/12 left, so 60 / (5/12)), applying the second cut to the wrong base. 90 = reversed only the second cut (60 / (2/3)), forgetting the first. 80 = reversed only the first cut (60 / (3/4)), forgetting the second. Correct 120: the two cuts on the changing base compose to 2/3 x 3/4 = 1/2 of the original, so original = 60 x 2 = 120.

### pm-perc-01 — Percentage, difficulty 3, mcq

- **Archetype:** A03-percent-chain-reverse (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.agrader.sg/post/psle-maths-2025-walkthrough-of-8-tricky-questions-with-full-solutions ; https://jimmymaths.com/wp-content/uploads/2019/08/5-Challenging-PSLE-Math-Questions-on-Percentage.pdf ; https://geniebook.com/us/exam-preparation/psle/article/psle-maths-percentage-discount-gst-problems ; https://blog.thinkacademy.sg/2024/11/solving-2024-psle-math/
- **Worked solution:** Step 1 (discount): 20% off $250 leaves 80%, so discounted price = 0.8 x 250 = $200. Step 2 (service charge on the NEW base): 5% is added to $200, so final = 200 x 1.05 = $210. Final answer: 210.
- **Distractor design:** 212.50 = wrong base: computes the 5% service charge on the original $250 (12.50) and adds it to $200, equivalently netting the two percentages as -15% (250 x 0.85). 200 = stops at the discounted price and forgets the service charge. 190 = sign error: subtracts 5% (200 x 0.95) instead of adding the service charge.

### pm-perc-02 — Percentage, difficulty 3, short-numeric

- **Archetype:** A01-remainder-fraction (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples ; https://geniebook.com/tuition/primary-6/maths/fractions-remainder ; https://tlstutorials.com/common-psle-math-questions-a-comprehensive-guide-to-problem-sums/
- **Worked solution:** Step 1: after the bag, 100% - 40% = 60% of the money remains. Step 2: spending 25% of that remainder leaves 75% of it, so the leftover = 0.75 x 0.60 = 0.45 of the original. Step 3: 0.45 of the original = $90, so original = 90 / 0.45 = $200. Check: 200 -> bag 80 leaves 120 -> shoes 25% of 120 = 30 leaves 90. Final answer: 200.

### pm-perc-03 — Percentage, difficulty 4, mcq

- **Archetype:** A08-constant-difference (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples ; https://www.bluetreeeducation.com/ratio-and-percentage-questions/ ; https://jimmymaths.com/4-must-know-concepts-psle-ratio-math-problems/
- **Worked solution:** 25% more means cars : motorcycles = 5 : 4 at first. Adding 18 to each keeps the difference (1 unit) fixed. After the change cars : motorcycles = 6 : 5 (20% more). Adding 18 to each side turns 5:4 into 6:5 exactly when 1 unit = 18. So motorcycles at first = 4 units = 4 x 18 = 72. Check: cars 90, motorcycles 72 (90 is 25% more); after +18 each: cars 108, motorcycles 90, and 108 is 20% more than 90. Final answer: 72.
- **Distractor design:** 90 = solves for the wrong party, giving the number of cars at first. 18 = reports the unit value instead of scaling to 4 units. 108 = gives the number of cars after the change (6 units).

### pm-perc-04 — Percentage, difficulty 3, short-numeric

- **Archetype:** A03-percent-chain-reverse (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.agrader.sg/post/psle-maths-2025-walkthrough-of-8-tricky-questions-with-full-solutions ; https://jimmymaths.com/wp-content/uploads/2019/08/5-Challenging-PSLE-Math-Questions-on-Percentage.pdf ; https://geniebook.com/us/exam-preparation/psle/article/psle-maths-percentage-discount-gst-problems ; https://blog.thinkacademy.sg/2024/11/solving-2024-psle-math/
- **Worked solution:** Step 1 (collapse the chain): raising by 25% multiplies by 1.25, then a 10% discount multiplies by 0.9, so the final price = original x 1.25 x 0.9 = original x 1.125. Step 2 (reverse): original = 270 / 1.125 = 240. Check: 240 x 1.25 = 300, then 300 x 0.9 = 270. Final answer: 240.

### pm-perc-05 — Percentage, difficulty 3, mcq

- **Archetype:** A01-remainder-fraction (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples ; https://geniebook.com/tuition/primary-6/maths/fractions-remainder ; https://tlstutorials.com/common-psle-math-questions-a-comprehensive-guide-to-problem-sums/
- **Worked solution:** Step 1: after the hospital, 70% of the money remains. Step 2: giving 20% of that remainder leaves 80% of it, so the kept amount = 0.8 x 0.7 = 0.56 of the total. Step 3: 0.56 of the total = $2800, so total = 2800 / 0.56 = $5000. Check: 5000 -> hospital 1500 leaves 3500 -> school 20% of 3500 = 700 leaves 2800. Final answer: 5000.
- **Distractor design:** 5600 = wrong base: treats the kept portion as (100% - 30% - 20%) = 50% of the total, so 2800 / 0.5. 4000 = forgets the school step and treats $2800 as 70% of the total (2800 / 0.7). 3500 = forgets the hospital step and treats $2800 as 80% of the total (2800 / 0.8), which is actually the intermediate remainder.

### pm-perc-06 — Percentage, difficulty 4, short-numeric

- **Archetype:** A04-unchanged-quantity-rebase (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.essentialeducation.com.sg/psle-subjects-tips/p5-math-problem-sum-percentage-of-quantity-that-changed-before-after ; https://jimmymaths.com/wp-content/uploads/2019/08/5-Challenging-PSLE-Math-Questions-on-Percentage.pdf ; https://www.essentialeducation.com.sg/psle-subjects-tips/p5-math-problem-sum-ratio-changed-before-after
- **Worked solution:** The adults never change, so use them as the bridge. Let the starting total be T. Adults = 60% of T = 0.6T. After 50 children leave, the adults form 100% - 25% = 75% of the remaining visitors (total T - 50). So 0.6T = 0.75(T - 50). Expand: 0.6T = 0.75T - 37.5, giving 0.15T = 37.5, so T = 250. Check: children 100, adults 150; after 50 children leave, total 200 with children 50 (25%) and adults 150 (75%). Final answer: 250.

### pm-perc-07 — Percentage, difficulty 4, mcq

- **Archetype:** A05-linked-percent-changes (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://jimmymaths.com/wp-content/uploads/2019/08/5-Challenging-PSLE-Math-Questions-on-Percentage.pdf
- **Worked solution:** Let Bala start with B; then Aisha starts with B + 30. Aisha keeps 80%, Bala keeps 90%, and these are equal: 0.8(B + 30) = 0.9B. Expand: 0.8B + 24 = 0.9B, so 0.1B = 24, giving B = 240 and Aisha = 240 + 30 = 270. Check: Aisha 270 keeps 216; Bala 240 keeps 216 - equal. Final answer: 270.
- **Distractor design:** 240 = solves for Bala (the wrong person). 330 = drops the +30 offset when multiplying (0.8B + 30 = 0.9B gives B = 300, Aisha = 330). 216 = the number each had left after giving away, not the starting amount.

### pm-perc-08 — Percentage, difficulty 4, short-numeric

- **Archetype:** A02-remainder-adjusted (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://geniebook.com/tuition/primary-6/maths/fractions-remainder ; https://jimmymaths.com/hardest-psle-math-questions/
- **Worked solution:** Work backwards. The $120 is 75% of the money she had before buying the toy, so before the toy she had 120 / 0.75 = $160. Add back the $50 food: before food she had 160 + 50 = $210. This $210 is what remained after spending 40% on clothes, i.e. 60% of the original, so original = 210 / 0.6 = $350. Check: 350 -> clothes 140 leaves 210 -> food 50 leaves 160 -> toy 25% of 160 = 40 leaves 120. Final answer: 350.

### pm-perc-09 — Percentage, difficulty 4, mcq

- **Archetype:** A10-repeated-identity (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://geniebook.com/tuition/primary-5/maths/ratio-strategy-repeated-identity ; https://www.bluetreeeducation.com/ratio-and-percentage-questions/
- **Worked solution:** Let boys = 4 units and girls = 3 units. Boys with glasses = 25% of 4 units = 1 unit. Girls with glasses = 40% of 3 units = 1.2 units. Total with glasses = 1 + 1.2 = 2.2 units = 66, so 1 unit = 30. Total members = 4 + 3 = 7 units = 7 x 30 = 210. Check: boys 120, girls 90; glasses 30 + 36 = 66. Final answer: 210.
- **Distractor design:** 30 = stops at the unit value (66 / 2.2) without scaling to 7 units. 120 = reports the number of boys (one part) rather than the whole club. 300 = place-value slip, reading 2.2 units as '22%' and computing 66 / 0.22.

### pm-perc-10 — Percentage, difficulty 5, short-numeric

- **Archetype:** A04-unchanged-quantity-rebase (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.essentialeducation.com.sg/psle-subjects-tips/p5-math-problem-sum-percentage-of-quantity-that-changed-before-after ; https://jimmymaths.com/wp-content/uploads/2019/08/5-Challenging-PSLE-Math-Questions-on-Percentage.pdf ; https://www.essentialeducation.com.sg/psle-subjects-tips/p5-math-problem-sum-ratio-changed-before-after
- **Worked solution:** The adults are unchanged, so use the after-picture to pin them down. Of the 320 people remaining, 75% were adults: 0.75 x 320 = 240 adults. The other 320 - 240 = 80 remaining people are the children who borrowed a book. Since the borrowers were exactly half of all the children, the total number of children = 2 x 80 = 160 (so 80 non-borrowers left). At first there were 240 adults + 160 children = 400 people. Check: 160 children, 80 leave, 240 adults + 80 borrowers = 320 remaining, adults 240/320 = 75%. Final answer: 400.

### pm-ratio-01 — Ratio, difficulty 3, mcq

- **Archetype:** A06-constant-part-ratio (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples ; https://jimmymaths.com/4-must-know-concepts-psle-ratio-math-problems/
- **Worked solution:** Non-fiction is unchanged, so align its units. Its terms are 2 and 6; LCM = 6. Scale the first ratio by 3: fiction:non-fiction = 3:6. Second ratio = 5:6, so non-fiction = 6 units in both. Fiction rose from 3 units to 5 units, a gain of 2 units. 2 units = 20 books, so 1 unit = 10 books. Fiction at first = 3 units = 30. Answer: 30.
- **Distractor design:** 5 = no-rescale error: uses raw 1:2 and 5:6, treats fiction rise as 5-1=4 units = 20 so 1 unit = 5, then first fiction = 1 unit = 5. 60 = the unchanged non-fiction total (6 units) reported instead of fiction. 50 = fiction AFTER adding (5 units) instead of at first.

### pm-ratio-02 — Ratio, difficulty 3, short-numeric

- **Archetype:** A06-constant-part-ratio (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples ; https://jimmymaths.com/4-must-know-concepts-psle-ratio-math-problems/
- **Worked solution:** Aisha is unchanged, so align her units. Her terms are 5 and 10; LCM = 10. Scale the first ratio by 2: Ben:Aisha = 4:10. Second ratio = 7:10, so Aisha = 10 units in both. Ben rose from 4 units to 7 units, a gain of 3 units. 3 units = $27, so 1 unit = $9. Ben now = 7 units = $63. Answer: 63.

### pm-ratio-03 — Ratio, difficulty 3, mcq

- **Archetype:** A07-constant-total-transfer (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples ; https://homecampus.ai/blog/psle-math-question-types-appear-every-year-singapore-exam ; https://jimmymaths.com/4-must-know-concepts-psle-ratio-math-problems/
- **Worked solution:** The total is unchanged, so put both ratios over a common total. Sums are 6 and 2; LCM = 6. Scale the second ratio by 3: after = 3:3 (total 6). Jar A dropped from 5 units to 3 units, a loss of 2 units, which is the amount moved. 2 units = 16 marbles, so 1 unit = 8. Jar A at first = 5 units = 40. Answer: 40.
- **Distractor design:** 20 = no-rescale error: treats 1:1 on its raw sum, so drop = 5-1 = 4 units = 16, giving 1 unit = 4 and A = 5x4 = 20. 48 = the total number of marbles (6 units) reported instead of Jar A. 8 = Jar B at first (1 unit).

### pm-ratio-04 — Ratio, difficulty 3, short-numeric

- **Archetype:** A07-constant-total-transfer (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples ; https://homecampus.ai/blog/psle-math-question-types-appear-every-year-singapore-exam ; https://jimmymaths.com/4-must-know-concepts-psle-ratio-math-problems/
- **Worked solution:** Pouring keeps the total volume unchanged, so put both ratios over a common total. Sums are 9 and 3; LCM = 9. Scale the second ratio by 3: after = 3:6 (total 9). Container X dropped from 5 units to 3 units, a loss of 2 units, which is the amount poured. 2 units = 10 litres, so 1 unit = 5 litres. Final volume in Container Y = 6 units = 30. Answer: 30.

### pm-ratio-05 — Ratio, difficulty 3, mcq

- **Archetype:** A08-constant-difference (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples ; https://www.bluetreeeducation.com/ratio-and-percentage-questions/ ; https://jimmymaths.com/4-must-know-concepts-psle-ratio-math-problems/
- **Worked solution:** The age difference is invariant. Now: 5 units - 2 units = 3 units = 18 years, so 1 unit = 6; Rita is now 2 units = 12. In future: 7 units - 4 units = 3 units = 18 years, so 1 future-unit = 6; Rita will be 4 units = 24. Years that pass = 24 - 12 = 12. Answer: 12.
- **Distractor design:** 24 = Rita's future age reported instead of the elapsed time. 18 = the given constant age difference mistaken for the number of years. 6 = one unit value (the age gap divided by the difference in ratio parts) taken as the answer.

### pm-ratio-06 — Ratio, difficulty 4, short-numeric

- **Archetype:** A08-constant-difference (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples ; https://www.bluetreeeducation.com/ratio-and-percentage-questions/ ; https://jimmymaths.com/4-must-know-concepts-psle-ratio-math-problems/
- **Worked solution:** Let the boxes start with 9k and 5k screws (the difference 4k is unchanged when equal amounts are removed). After removing 12 from each: (9k - 12) : (5k - 12) = 3 : 1, so 9k - 12 = 3(5k - 12) = 15k - 36. This gives 24 = 6k, so k = 4. Box P started with 9k = 36 screws and 36 - 12 = 24 are left. Fraction left = 24/36 = 2/3. Answer: 2/3.

### pm-ratio-07 — Ratio, difficulty 4, short-numeric

- **Archetype:** A10-repeated-identity (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://geniebook.com/tuition/primary-5/maths/ratio-strategy-repeated-identity ; https://www.bluetreeeducation.com/ratio-and-percentage-questions/
- **Worked solution:** Altos are the common term (3 in the first ratio, 2 in the second); LCM = 6. Scale sopranos:altos by 2 to 10:6, and altos:tenors by 3 to 6:15. Merge: sopranos:altos:tenors = 10:6:15, a total of 31 units, all whole for whole units. Fewer than 100 members means 31u < 100, so u can be at most 3 (31 x 3 = 93). Largest tenors = 15 x 3 = 45. Answer: 45.

### pm-ratio-08 — Ratio, difficulty 4, mcq

- **Archetype:** A04-unchanged-quantity-rebase (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.essentialeducation.com.sg/psle-subjects-tips/p5-math-problem-sum-percentage-of-quantity-that-changed-before-after ; https://jimmymaths.com/wp-content/uploads/2019/08/5-Challenging-PSLE-Math-Questions-on-Percentage.pdf ; https://www.essentialeducation.com.sg/psle-subjects-tips/p5-math-problem-sum-ratio-changed-before-after
- **Worked solution:** At first, let children = 2 units and total = 5 units, so adults = 3 units (unchanged). After 60 children leave, children = 2 units - 60 and total = 5 units - 60, with children : total = 1 : 4, so total = 4 x children: 5u - 60 = 4(2u - 60) = 8u - 240. This gives 3u = 180, so u = 60. Total at first = 5 units = 300. Check: children 120 -> 60, total 300 -> 240, and 60:240 = 1:4. Answer: 300.
- **Distractor design:** 400 = compares the two ratios as fractions of one fixed total (2/5 = 40%, 1/4 = 25%), treating the 60 children as 15% of the original total: 60 / 0.15 = 400. 240 = the total number of visitors AFTER the children left, not at first. 180 = the number of adults (the unchanged group) reported instead of the total.

### pm-ratio-09 — Ratio, difficulty 5, short-numeric

- **Archetype:** A04-unchanged-quantity-rebase (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.essentialeducation.com.sg/psle-subjects-tips/p5-math-problem-sum-percentage-of-quantity-that-changed-before-after ; https://jimmymaths.com/wp-content/uploads/2019/08/5-Challenging-PSLE-Math-Questions-on-Percentage.pdf ; https://www.essentialeducation.com.sg/psle-subjects-tips/p5-math-problem-sum-ratio-changed-before-after
- **Worked solution:** Let the total be T. Home supporters = 3/5 T, so the remaining 2/5 T splits 3:2 into visiting = 3/5 x 2/5 T = 6/25 T and neutrals = 2/5 x 2/5 T = 4/25 T. Home and visiting supporters (non-neutrals) do not change: they are 21/25 T. After 110 neutrals leave, the new total is T - 110 and non-neutrals are 8/9 of it. So 21/25 T = 8/9 (T - 110). Multiply both sides by 225: 189T = 200(T - 110) = 200T - 22000, giving 11T = 22000, so T = 2000. Visiting supporters = 6/25 x 2000 = 480. Answer: 480.

### pm-ratio-10 — Ratio, difficulty 4, mcq

- **Archetype:** A09-both-changed-units (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples ; https://jimmymaths.com/4-must-know-concepts-psle-ratio-math-problems/ ; https://tlstutorials.com/common-psle-math-questions-a-comprehensive-guide-to-problem-sums/ ; https://geniebook.com/tuition/primary-6/maths/fractions-remainder
- **Worked solution:** Both amounts change by different sums, so carry units through and cross-multiply. Let Meena = 4u and Nadia = 7u. After the changes: (4u + 30) : (7u - 10) = 2 : 3, so 3(4u + 30) = 2(7u - 10). This gives 12u + 90 = 14u - 20, so 2u = 110 and u = 55. Nadia at first = 7u = 385. Check: Meena 220 + 30 = 250, Nadia 385 - 10 = 375, and 250 : 375 = 2 : 3. Answer: 385.
- **Distractor design:** 245 = sign slip treating Nadia's give-away as +10: 3(4u + 30) = 2(7u + 10) gives u = 35 and Nadia = 245. 220 = Meena's starting amount (4u, wrong person). 375 = Nadia's amount NOW (7u - 10 = 375), the after-world value instead of at first.

### pm-speed-01 — Speed & Rate, difficulty 3, short-numeric

- **Archetype:** A11-staggered-meeting (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples ; https://www.edufirst.com.sg/blog/speed-distance-time-top-20-psle-questions-explained-with-step-by-step-solutions/ ; https://www.agrader.sg/post/conquering-challenging-psle-speed-questions-in-maths-4-tips-and-tricks-to-score-full-marks
- **Worked solution:** Between 09 00 and 10 00 the passenger train travels alone: 60 km/h x 1 h = 60 km. Remaining gap when the freight train starts = 510 - 60 = 450 km. After 10 00 both move toward each other, closing at 60 + 90 = 150 km/h. Time to meet = 450 / 150 = 3 h. Distance covered by the freight train from Station N = 90 km/h x 3 h = 270 km. (Check: passenger covers 60 + 60 x 3 = 240 km; 240 + 270 = 510.) Answer: 270.

### pm-speed-02 — Speed & Rate, difficulty 5, short-numeric

- **Archetype:** A11-staggered-meeting (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples ; https://www.edufirst.com.sg/blog/speed-distance-time-top-20-psle-questions-explained-with-step-by-step-solutions/ ; https://www.agrader.sg/post/conquering-challenging-psle-speed-questions-in-maths-4-tips-and-tricks-to-score-full-marks
- **Worked solution:** They move toward each other and together close 100 m for each face-to-face pass. First pass: combined distance 100 m at 20 + 30 = 50 m/min gives time 100/50 = 2 min (Boat A at 40 m). For the second face-to-face pass the boats together must have covered 3 x 100 = 300 m, at time 300/50 = 6 min. Track Boat A: 20 x 6 = 120 m travelled. It reaches Pier Y (100 m) at 5 min, turns, and in the last 1 min goes 20 m back, landing at 100 - 20 = 80 m from Pier X. (Check Boat B: 30 x 6 = 180 m; reaches Pier X at 100 m, turns, goes 80 m back to 80 m from Pier X. Between the passes Boat B never overtakes Boat A, so this is genuinely the second face-to-face pass.) Answer: 80.

### pm-speed-03 — Speed & Rate, difficulty 3, short-numeric

- **Archetype:** A12-gap-difference-rates (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://geniebook.com/exam-preparation/psle/article/solving-challenging-2023-psle-maths-questions-faizal-and-elise-jogging-question ; https://www.agrader.sg/post/conquering-challenging-psle-speed-questions-in-maths-4-tips-and-tricks-to-score-full-marks ; https://www.kiasuparents.com/kiasu/article/psle-math-tips-on-speed-questions ; https://www.kiasuparents.com/kiasu/article/identifying-psle-math-rate-problems
- **Worked solution:** In the 24 minutes (24/60 = 0.4 h) before the van appears, the lorry gains a head start of 50 km/h x 0.4 h = 20 km. Travelling the same way, the van closes this gap at the difference of speeds, 70 - 50 = 20 km/h. Catch-up time = 20 km / 20 km/h = 1 h. Distance the van has travelled from the gantry = 70 km/h x 1 h = 70 km. (Check: lorry is at 20 + 50 x 1 = 70 km too.) Answer: 70.

### pm-speed-04 — Speed & Rate, difficulty 4, mcq

- **Archetype:** A12-gap-difference-rates (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://geniebook.com/exam-preparation/psle/article/solving-challenging-2023-psle-maths-questions-faizal-and-elise-jogging-question ; https://www.agrader.sg/post/conquering-challenging-psle-speed-questions-in-maths-4-tips-and-tricks-to-score-full-marks ; https://www.kiasuparents.com/kiasu/article/psle-math-tips-on-speed-questions ; https://www.kiasuparents.com/kiasu/article/identifying-psle-math-rate-problems
- **Worked solution:** By 08 30 Car P has a head start of 50 km/h x 0.5 h = 25 km. From 08 30, let t hours pass. Q gains on P at 80 - 50 = 30 km/h. For Q to be 15 km ahead, Q must erase the 25 km gap and then get 15 km further: 30t = 25 + 15 = 40, so t = 40/30 = 1 h 20 min. Time = 08 30 + 1 h 20 min = 09 50. Answer: 09 50.
- **Distractor design:** idx0 09 00: ignores P's 25 km head start, taking 15/30 = 0.5 h after 08 30. idx1 09 20: finds only the moment Q draws level (closes the 25 km: 25/30 h) and forgets the extra 15 km. idx2 08 50: solves for when P is still 15 km ahead of Q (25 - 30t = 15). idx3 correct.

### pm-speed-05 — Speed & Rate, difficulty 4, mcq

- **Archetype:** A13-combined-work-rate (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples ; http://road-to-psle.blogspot.com/2007/12/ai-tong-school-ca1-2007-math-question.html ; https://www.kiasuparents.com/kiasu/article/identifying-psle-math-rate-problems
- **Worked solution:** Rates: Pipe A = 1/30, Pipe B = 1/45 of the pool per minute. Together = 1/30 + 1/45 = 3/90 + 2/90 = 5/90 = 1/18 per minute. In the first 6 minutes they fill 6 x 1/18 = 1/3, leaving 2/3. Pipe A alone then fills 2/3 at 1/30 per minute: time = (2/3) / (1/30) = (2/3) x 30 = 20 minutes. Total time = 6 + 20 = 26 minutes. Answer: 26.
- **Distractor design:** idx0 correct. idx1 18: assumes both pipes stay open the whole time (ignores that B is turned off), 1/(1/18). idx2 36: after 6 minutes uses Pipe B's rate for the remaining 2/3 instead of Pipe A's (6 + (2/3)/(1/45) = 36). idx3 20: reports only the second-phase duration (A alone fills 2/3 in 20 min) and forgets to add the first 6 minutes.

### pm-speed-06 — Speed & Rate, difficulty 4, mcq

- **Archetype:** A13-combined-work-rate (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples ; http://road-to-psle.blogspot.com/2007/12/ai-tong-school-ca1-2007-math-question.html ; https://www.kiasuparents.com/kiasu/article/identifying-psle-math-rate-problems
- **Worked solution:** Rates: A = 1/6, B = 1/12 of the fence per day. Suppose A worked a days and B worked (9 - a) days; the whole fence is done: a/6 + (9 - a)/12 = 1. Multiply by 12: 2a + (9 - a) = 12, so a + 9 = 12 and a = 3. (Check: 3/6 + 6/12 = 1/2 + 1/2 = 1.) Painter A painted on 3 days. Answer: 3.
- **Distractor design:** idx0 4: uses the both-working-together time, 1/(1/6 + 1/12) = 4 days. idx1 6: finds how many days Painter B worked (9 - 3) and reports that instead. idx2 4.5: splits the 9 days equally between the two painters (9 / 2). idx3 correct.

### pm-speed-07 — Speed & Rate, difficulty 3, short-numeric

- **Archetype:** A14-average-speed-journey (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.edufirst.com.sg/blog/speed-distance-time-top-20-psle-questions-explained-with-step-by-step-solutions/ ; https://www.agrader.sg/post/conquering-challenging-psle-speed-questions-in-maths-4-tips-and-tricks-to-score-full-marks
- **Worked solution:** Average speed is total distance divided by total time, not the average of the two speeds. Take a convenient one-way distance of 120 km (a common multiple of 40 and 60). Going: 120 / 40 = 3 h. Returning: 120 / 60 = 2 h. Total distance = 240 km, total time = 3 + 2 = 5 h. Average speed = 240 / 5 = 48 km/h. Answer: 48.

### pm-speed-08 — Speed & Rate, difficulty 3, short-numeric

- **Archetype:** A14-average-speed-journey (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.edufirst.com.sg/blog/speed-distance-time-top-20-psle-questions-explained-with-step-by-step-solutions/ ; https://www.agrader.sg/post/conquering-challenging-psle-speed-questions-in-maths-4-tips-and-tricks-to-score-full-marks
- **Worked solution:** Convert the time: 20 minutes = 20/60 h = 1/3 h. Distance covered = 54 km/h x 1/3 h = 18 km. This 18 km is 1/4 of the whole route, so the whole route = 18 x 4 = 72 km. Answer: 72.

### pm-speed-09 — Speed & Rate, difficulty 4, mcq

- **Archetype:** A16-flow-rate-height (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://geniebook.com/exam-preparation/psle/article/psle-math-volume-rate-of-flow-problems ; https://homecampus.ai/blog/psle-volume-cube-cuboid-guide
- **Worked solution:** Base area = 30 x 40 = 1200 cm^2. Water must rise from 10 cm to 50 cm, a height of 40 cm, so the volume still needed = 1200 x 40 = 48000 cm^3 = 48 L. Net inflow = 10 - 2 = 8 L/min. Time = 48 / 8 = 6 minutes. Answer: 6.
- **Distractor design:** idx0 7.5: uses the full capacity (60 L) instead of only the space still to be filled (48 L). idx1 4.8: ignores the leak, using net rate 10 L/min. idx2 4: adds the leak to the tap instead of subtracting (net 12 L/min). idx3 correct.

### pm-speed-10 — Speed & Rate, difficulty 4, mcq

- **Archetype:** A16-flow-rate-height (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://geniebook.com/exam-preparation/psle/article/psle-math-volume-rate-of-flow-problems ; https://homecampus.ai/blog/psle-volume-cube-cuboid-guide
- **Worked solution:** Base area = 60 x 25 = 1500 cm^2. Phase 1 (first 4 minutes, tap only): 9 x 4 = 36 L. Phase 2 (next 6 minutes, tap minus drain = 9 - 3 = 6 L/min): 6 x 6 = 36 L. Total water = 36 + 36 = 72 L = 72000 cm^3. Depth = 72000 / 1500 = 48 cm. Answer: 48.
- **Distractor design:** idx0 correct. idx1 60: ignores the drain entirely (9 L/min for all 10 min = 90 L). idx2 40: applies the drain for the full 10 minutes (net 6 L/min x 10 = 60 L). idx3 52: swaps the two phase lengths (9 L/min for 6 min plus net 6 L/min for 4 min = 78 L).

### pm-area-01 — Area & Volume, difficulty 3, short-numeric

- **Archetype:** A15-volume-conservation (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples ; https://homecampus.ai/blog/psle-volume-cube-cuboid-guide
- **Worked solution:** Water depth in the aquarium = 2/3 x 18 = 12 cm. Volume of water = 50 x 20 x 12 = 12000 cm^3. This volume is conserved when poured. Base area of the receiving tank = 40 x 30 = 1200 cm^2. New depth = volume / receiving base area = 12000 / 1200 = 10. Answer: 10.

### pm-area-02 — Area & Volume, difficulty 3, mcq

- **Archetype:** A15-volume-conservation (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples ; https://homecampus.ai/blog/psle-volume-cube-cuboid-guide
- **Worked solution:** Juice depth in the jug = 3/4 x 24 = 18 cm. Volume = 20 x 10 x 18 = 3600 cm^3. Receiving base area = 30 x 16 = 480 cm^2. New depth = 3600 / 480 = 7.5. Answer: 7.5.
- **Distractor design:** 18 = divides the conserved volume by the SOURCE base area (20x10=200), which just returns the jug's own water depth 3600/200. 10 = forgets the 3/4 fill and pours the FULL capacity (20x10x24=4800) into the receiver, 4800/480. 24 = uses full capacity AND divides by the source base, 4800/200, landing on the source height. 7.5 is correct.

### pm-area-03 — Area & Volume, difficulty 4, mcq

- **Archetype:** A15-volume-conservation (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples ; https://homecampus.ai/blog/psle-volume-cube-cuboid-guide
- **Worked solution:** Volume from Tank A = 40 x 25 x 12 = 12000 cm^3. Volume already in Tank B = 30 x 20 x 15 = 9000 cm^3. Total volume in B = 12000 + 9000 = 21000 cm^3. Base area of B = 30 x 20 = 600 cm^2. Final depth = 21000 / 600 = 35. Answer: 35.
- **Distractor design:** 20 = ignores the water already in Tank B and divides only Tank A's volume by B's base (12000/600). 27 = adds the two depths directly (12+15) as if the base areas were the same. 15 = keeps only Tank B's original depth, forgetting the added water. 35 is correct.

### pm-area-04 — Area & Volume, difficulty 3, short-numeric

- **Archetype:** A16-flow-rate-height (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://geniebook.com/exam-preparation/psle/article/psle-math-volume-rate-of-flow-problems ; https://homecampus.ai/blog/psle-volume-cube-cuboid-guide
- **Worked solution:** Flow rate = 6 litres/min = 6000 cm^3/min. Base area = 40 x 50 = 2000 cm^2. Rise in level each minute = 6000 / 2000 = 3 cm/min. Depth after 8 minutes = 3 x 8 = 24. Answer: 24.

### pm-area-05 — Area & Volume, difficulty 4, mcq

- **Archetype:** A16-flow-rate-height (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://geniebook.com/exam-preparation/psle/article/psle-math-volume-rate-of-flow-problems ; https://homecampus.ai/blog/psle-volume-cube-cuboid-guide
- **Worked solution:** Capacity = 60 x 30 x 50 = 90000 cm^3 = 90 litres. Water already in = 1/3 x 90 = 30 litres, so remaining space = 90 - 30 = 60 litres. Net fill rate = inflow - leak = 4 - 1 = 3 litres/min. Time = 60 / 3 = 20. Answer: 20.
- **Distractor design:** 30 = uses the FULL capacity (90 L) instead of the remaining 60 L, 90/3. 15 = ignores the leak and uses only the 4 L/min inflow on the remainder, 60/4. 12 = ADDS the leak to the inflow (rate 5 L/min) instead of subtracting, 60/5. 20 is correct.

### pm-area-06 — Area & Volume, difficulty 3, short-numeric

- **Archetype:** A16-flow-rate-height (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://geniebook.com/exam-preparation/psle/article/psle-math-volume-rate-of-flow-problems ; https://homecampus.ai/blog/psle-volume-cube-cuboid-guide
- **Worked solution:** Combined flow = 4 + 6 = 10 litres/min = 10000 cm^3/min. Base area = 50 x 40 = 2000 cm^2. Level rise each minute = 10000 / 2000 = 5 cm/min. Time to reach 30 cm = 30 / 5 = 6. Answer: 6.

### pm-area-07 — Area & Volume, difficulty 5, mcq

- **Archetype:** A16-flow-rate-height (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://geniebook.com/exam-preparation/psle/article/psle-math-volume-rate-of-flow-problems ; https://homecampus.ai/blog/psle-volume-cube-cuboid-guide
- **Worked solution:** Phase 1 (first 5 minutes, tap only): 5 x 8 = 40 litres added. Remaining space = 120 - 40 = 80 litres. Phase 2 net rate = 8 - 3 = 5 litres/min. Phase 2 time = 80 / 5 = 16 minutes. Total time from the start = 5 + 16 = 21. Answer: 21.
- **Distractor design:** 15 = ignores the drain entirely, 120/8. 16 = finds the second-phase time correctly but forgets to add the first 5 minutes, (120-40)/5. 24 = treats the drain as open the whole time (net 5 L/min from the start), 120/5. 21 is correct.

### pm-area-08 — Area & Volume, difficulty 4, mcq

- **Archetype:** A17-figure-length-accounting (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://blog.thinkacademy.sg/2024/11/solving-2024-psle-math/ ; https://geniebook.com/exam-preparation/psle/article/2019-semicircle-question-how-calculate-diameter-circle
- **Worked solution:** Both fillings cover the same shelf, so 4 thick + 2 thin = 2 thick + 6 thin. Cancel 2 thick and 2 thin from both sides: 2 thick = 4 thin, so 1 thick = 2 thin. A thick book is 3 cm wider than a thin: thick - thin = 3, so 2 thin - thin = 3, giving thin = 3 cm and thick = 6 cm. Shelf length = 4 x 6 + 2 x 3 = 24 + 6 = 30 (check: 2 x 6 + 6 x 3 = 12 + 18 = 30). Answer: 30.
- **Distractor design:** 24 = solves correctly but swaps thick and thin when totalling (4x3 + 2x6). 18 = treats every book as a thin book, ignoring that thick books are wider (6 books x 3 cm). 6 = reports the thick-book width, an intermediate value, instead of the shelf length. 30 is correct.

### pm-area-09 — Area & Volume, difficulty 5, short-numeric

- **Archetype:** A17-figure-length-accounting (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://blog.thinkacademy.sg/2024/11/solving-2024-psle-math/ ; https://geniebook.com/exam-preparation/psle/article/2019-semicircle-question-how-calculate-diameter-circle
- **Worked solution:** Top row: 2 cards with their long (18 cm) edges horizontal, so tray width = 2 x 18 = 36 cm. Bottom row: 3 cards standing with long edges vertical, so their short edges lie along the width: 3 x (short edge) = 36, giving short edge = 12 cm. Top row height = a card's short edge = 12 cm; bottom row height = a card's long edge = 18 cm. Tray height = 12 + 18 = 30 cm. Tray area = 36 x 30 = 1080 (check: 5 cards x (18 x 12) = 5 x 216 = 1080). Answer: 1080.

### pm-area-10 — Area & Volume, difficulty 4, short-numeric

- **Archetype:** A15-volume-conservation (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples ; https://homecampus.ai/blog/psle-volume-cube-cuboid-guide
- **Worked solution:** Volume of water = 25 x 16 x 20 = 8000 cm^3, and this is conserved. In container B, base area = volume / depth = 8000 / 16 = 500 cm^2. The base is 20 cm wide, so length = 500 / 20 = 25. Answer: 25.

### pm-whole-01 — Whole Numbers, difficulty 3, short-numeric

- **Archetype:** A18-assumption-method (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
- **Worked solution:** Step 1 (suppose all are motorcycles): 30 x 2 = 60 wheels. Step 2 (discrepancy): actual wheels are 96, so 96 - 60 = 36 extra wheels. Step 3 (per-swap change): swapping a motorcycle for a car adds 4 - 2 = 2 wheels, so number of cars = 36 / 2 = 18. Check: 18 cars x 4 = 72 wheels, 12 motorcycles x 2 = 24 wheels, 72 + 24 = 96. Final answer: 18 cars.

### pm-whole-02 — Whole Numbers, difficulty 4, short-numeric

- **Archetype:** A18-assumption-method (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples
- **Worked solution:** Step 1 (suppose all 20 are correct): 20 x 4 = 80 points. Step 2 (discrepancy): he actually scored 45, so 80 - 45 = 35 points were lost. Step 3 (per-swap change): changing a correct answer to a wrong one removes the 4 he would have gained AND deducts 1 more, a swing of 4 + 1 = 5 points. So number of wrong answers = 35 / 5 = 7. Step 4: correct answers = 20 - 7 = 13. Check: 13 x 4 - 7 x 1 = 52 - 7 = 45. Final answer: 13 correct answers.

### pm-whole-03 — Whole Numbers, difficulty 3, mcq

- **Archetype:** A19-excess-shortage (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples ; https://mastermaths.com.sg/2-simple-approaches-to-excess-shortage-word-problems/
- **Worked solution:** The bag of pencils is fixed and the number of pupils is fixed. Step 1 (total swing): going from 5-each (8 left over) to 7-each (6 short), the demand rises by the surplus plus the shortfall: 8 + 6 = 14 pencils. Step 2 (per-pupil rate difference): each pupil now takes 7 - 5 = 2 more pencils. Step 3: number of pupils = 14 / 2 = 7. Check: 5 x 7 + 8 = 43 pencils; 7 x 7 = 49, and 49 - 43 = 6 short. Final answer: 7 pupils.
- **Distractor design:** Index0 (1): subtracts shortage from excess instead of adding, (8 - 6) / 2 = 1. Index1 (7): correct. Index2 (2): divides the total swing by the larger per-pupil rate instead of the rate difference, 14 / 7 = 2. Index3 (43): reports the stock of pencils (5 x 7 + 8) instead of the number of pupils asked for.

### pm-whole-04 — Whole Numbers, difficulty 4, mcq

- **Archetype:** A19-excess-shortage (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.ottodot.com/post/psle-math-question-types-a-complete-guide-with-worked-examples ; https://mastermaths.com.sg/2-simple-approaches-to-excess-shortage-word-problems/
- **Worked solution:** Step 1 (total swing): from 12-per-bag (10 left over) to 15-per-bag (8 short), demand rises by 10 + 8 = 18 sweets. Step 2 (rate difference): each bag takes 15 - 12 = 3 more sweets, so number of bags = 18 / 3 = 6. Step 3 (reconstruct the stock): using the first scenario, sweets = 12 x 6 + 10 = 82. Check with the second: 15 x 6 = 90, and 90 - 82 = 8 short. Final answer: 82 sweets.
- **Distractor design:** Index0 (72): computes 12 x 6 but forgets to add the 10 left-over sweets. Index1 (6): reports the number of bags instead of the number of sweets asked for. Index2 (82): correct. Index3 (98): reconstructs from the second scenario but adds the shortage instead of subtracting it, 15 x 6 + 8 = 98.

### pm-whole-05 — Whole Numbers, difficulty 4, short-numeric

- **Archetype:** A20-systematic-enumeration (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.agrader.sg/post/psle-maths-2025-walkthrough-of-8-tricky-questions-with-full-solutions ; https://blog.thinkacademy.sg/2024/11/solving-2024-psle-math/ ; https://mastermaths.com.sg/2-simple-approaches-to-excess-shortage-word-problems/
- **Worked solution:** Step 1 (list multiples of 7 between 100 and 150): 105, 112, 119, 126, 133, 140, 147. Step 2 (keep those leaving remainder 2 when divided by 5): 112 (= 110 + 2) and 147 (= 145 + 2). Step 3 (keep those leaving remainder 3 when divided by 4): 112 gives remainder 0, while 147 = 144 + 3 gives remainder 3. So 147 is the only survivor. Check: 147 / 7 = 21, 147 / 5 = 29 r2, 147 / 4 = 36 r3. Final answer: 147.

### pm-whole-06 — Whole Numbers, difficulty 5, mcq

- **Archetype:** A20-systematic-enumeration (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.agrader.sg/post/psle-maths-2025-walkthrough-of-8-tricky-questions-with-full-solutions ; https://blog.thinkacademy.sg/2024/11/solving-2024-psle-math/ ; https://mastermaths.com.sg/2-simple-approaches-to-excess-shortage-word-problems/
- **Worked solution:** Compare the value of each option: the pack of 5 costs $4, i.e. $0.80 per box; the pack of 8 costs $7, i.e. $0.875 per box; singles cost $1 each. The pack of 5 is the best value. Since 15 = 5 + 5 + 5 exactly, buy three packs of 5: 3 x $4 = $12, giving exactly 15 boxes with nothing wasted. Any use of the 8-pack forces leftover singles and costs more (e.g. one 8-pack + one 5-pack + 2 singles = $7 + $4 + $2 = $13). Final answer: 12.
- **Distractor design:** Index0 (13): greedy choice, takes the largest pack first (8 for $7) then a 5-pack ($4) then 2 singles ($2) = $13. Index1 (14): one 8-pack ($7) plus 7 singles ($7) = $14. Index2 (15): buys all 15 boxes singly at $1 each. Index3 (12): correct, three packs of 5.

### pm-whole-07 — Whole Numbers, difficulty 3, mcq

- **Archetype:** A03-percent-chain-reverse (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.agrader.sg/post/psle-maths-2025-walkthrough-of-8-tricky-questions-with-full-solutions ; https://jimmymaths.com/wp-content/uploads/2019/08/5-Challenging-PSLE-Math-Questions-on-Percentage.pdf ; https://geniebook.com/us/exam-preparation/psle/article/psle-maths-percentage-discount-gst-problems ; https://blog.thinkacademy.sg/2024/11/solving-2024-psle-math/
- **Worked solution:** Step 1 (February, on the January base): 15% of 400 = 60, so February output = 400 + 60 = 460 toy cars. Step 2 (March, on the February base): 20% of 460 = 92, so March output = 460 - 92 = 368. The key is that the 20% fall is measured against February (460), not January. Final answer: 368.
- **Distractor design:** Index0 (460): stops at the February figure and forgets the March decrease. Index1 (368): correct. Index2 (380): applies the 20% fall to the original January base (20% of 400 = 80) instead of February, giving 460 - 80 = 380. Index3 (320): ignores the February rise and only applies the fall to 400, 400 x 0.8 = 320.

### pm-whole-08 — Whole Numbers, difficulty 4, short-numeric

- **Archetype:** A03-percent-chain-reverse (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://www.agrader.sg/post/psle-maths-2025-walkthrough-of-8-tricky-questions-with-full-solutions ; https://jimmymaths.com/wp-content/uploads/2019/08/5-Challenging-PSLE-Math-Questions-on-Percentage.pdf ; https://geniebook.com/us/exam-preparation/psle/article/psle-maths-percentage-discount-gst-problems ; https://blog.thinkacademy.sg/2024/11/solving-2024-psle-math/
- **Worked solution:** Step 1 (collapse the chain): a 20% rise multiplies by 1.2, then a 10% fall multiplies by 0.9. These do NOT cancel to '+10%': the combined multiplier is 1.2 x 0.9 = 1.08. Step 2 (work backwards): starting number x 1.08 = 648, so starting number = 648 / 1.08 = 600. Step 3 (difference): summer minus start = 648 - 600 = 48. Check: 600 x 1.2 = 720, 720 x 0.9 = 648. Final answer: 48.

### pm-whole-09 — Whole Numbers, difficulty 3, short-numeric

- **Archetype:** A10-repeated-identity (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://geniebook.com/tuition/primary-5/maths/ratio-strategy-repeated-identity ; https://www.bluetreeeducation.com/ratio-and-percentage-questions/
- **Worked solution:** The common quantity is 'blue', which appears as 4 in the first ratio and 8 in the second. Step 1 (rescale to make blue match, LCM of 4 and 8 = 8): multiply the first ratio by 2 to get red : blue = 6 : 8. Now merge: red : blue : green = 6 : 8 : 1. Step 2 (find one unit): blue = 8 units = 24 marbles, so 1 unit = 3 marbles. Step 3: red = 6 x 3 = 18, green = 1 x 3 = 3, blue = 24. Total = 18 + 24 + 3 = 45. Check: 18 : 24 = 3 : 4 and 24 : 3 = 8 : 1. Final answer: 45.

### pm-whole-10 — Whole Numbers, difficulty 5, mcq

- **Archetype:** A10-repeated-identity (see bank-v3-archetypes.md)
- **Sourced inspiration:** https://geniebook.com/tuition/primary-5/maths/ratio-strategy-repeated-identity ; https://www.bluetreeeducation.com/ratio-and-percentage-questions/
- **Worked solution:** Step 1 (merge on the common 'altos', which is 4 in the first ratio and 2 in the second; LCM = 4): multiply the second ratio by 2 to get altos : basses = 4 : 2. Merge: sopranos : altos : basses = 3 : 4 : 2, a total of 9 units. Step 2 (whole-number condition): sopranos = 3 units, and 25% of them = 0.75 x (number of units), which is a whole number only when the number of units is a multiple of 4. Step 3 (size limit): total = 9 units < 100 means the number of units is at most 11. Step 4 (largest admissible): the largest multiple of 4 that is at most 11 is 8, so units = 8 and total = 9 x 8 = 72. Check: sopranos = 24, 25% = 6 (whole); altos = 32; basses = 16; total = 72 < 100. Final answer: 72.
- **Distractor design:** Index0 (99): ignores the 25%-whole-number condition and just takes the largest units with 9 x units < 100, i.e. 11 units (25% of 33 sopranos = 8.25 is not whole). Index1 (96): merges without rescaling the common 'altos' term, using 3 : 4 : 1 (8 units); largest multiple-of-4 units under 100 is 12, giving 96. Index2 (72): correct. Index3 (36): finds the multiple-of-4 condition but takes the smallest admissible units (4) instead of the largest, giving 36.

## Culled candidates (verified but not shipped)

- frac-c10 (Fractions, A08-constant-difference): culled at selection: topic already had 10 verified questions with better difficulty/type spread
- frac-c11 (Fractions, A14-average-speed-journey): culled at selection: topic already had 10 verified questions with better difficulty/type spread
- frac-c13 (Fractions, A04-unchanged-quantity-rebase): culled at selection: topic already had 10 verified questions with better difficulty/type spread
- perc-c10 (Percentage, A08-constant-difference): culled at selection: topic already had 10 verified questions with better difficulty/type spread
- perc-c11 (Percentage, A05-linked-percent-changes): culled at selection: topic already had 10 verified questions with better difficulty/type spread
- perc-c13 (Percentage, A02-remainder-adjusted): culled at selection: topic already had 10 verified questions with better difficulty/type spread
- ratio-c07 (Ratio, A08-constant-difference): culled at selection: topic already had 10 verified questions with better difficulty/type spread
- ratio-c09 (Ratio, A10-repeated-identity): culled at selection: topic already had 10 verified questions with better difficulty/type spread
- ratio-c12 (Ratio, A09-both-changed-units): culled at selection: topic already had 10 verified questions with better difficulty/type spread
- speed-c02 (Speed & Rate, A11-staggered-meeting): culled at selection: topic already had 10 verified questions with better difficulty/type spread
- speed-c06 (Speed & Rate, A12-gap-difference-rates): culled at selection: topic already had 10 verified questions with better difficulty/type spread
- speed-c07 (Speed & Rate, A13-combined-work-rate): culled at selection: topic already had 10 verified questions with better difficulty/type spread
- area-c07 (Area & Volume, A16-flow-rate-height): culled at selection: topic already had 10 verified questions with better difficulty/type spread
- area-c09 (Area & Volume, A17-figure-length-accounting): culled at selection: topic already had 10 verified questions with better difficulty/type spread
- area-c11 (Area & Volume, A17-figure-length-accounting): culled at selection: topic already had 10 verified questions with better difficulty/type spread
- whole-c02 (Whole Numbers, A18-assumption-method): culled at selection: topic already had 10 verified questions with better difficulty/type spread
- whole-c06 (Whole Numbers, A19-excess-shortage): culled at selection: topic already had 10 verified questions with better difficulty/type spread
- whole-c07 (Whole Numbers, A20-systematic-enumeration): culled at selection: topic already had 10 verified questions with better difficulty/type spread
