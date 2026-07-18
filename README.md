# Smarty Challenge

Built by the Idea-Engine incubate pipeline as a static, GitHub Pages-ready web app.

## What done means

- Entering the same seed number (e.g. 1234) twice, or on two separate loads, generates a paper whose question IDs and order are identical — verifiable by rendering the question IDs and comparing.
- Tapping Submit after answering shows a results screen displaying a numeric total score, a per-topic breakdown, and elapsed time.
- A correct short-numeric answer entered in an accepted equivalent form (e.g. an equivalent fraction or a value within the stated tolerance) is marked correct, and a wrong value is marked incorrect, per the question's check rule.
- Submitting with a blank or non-numeric seed produces a visible inline validation message and does NOT start a paper (no console error, no blank screen).
- Leaving one or more answers blank and submitting marks those questions as incorrect (0 for that item) rather than crashing, and they are reflected in the total and per-topic counts.
- After first load, reloading the page with the network disabled still lets the user enter a seed, generate the paper, answer, and see auto-marked results (service worker serves the app shell and question bank offline).
- The results screen displays the elapsed completion time prominently and labels it as the tie-breaker for equal scores (shorter time wins).
- The results screen has a Share control that produces a spoiler-free summary text (seed, score, time, and a per-question correct/incorrect emoji grid — no question content or answers) and offers WhatsApp and Telegram share links plus a copy-to-clipboard fallback; copying puts that summary on the clipboard without error.

## Hosting

Serve this directory as static files (GitHub Pages or any static host). No build step required.
