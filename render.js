// render.js — screen painters for the Smarty Challenge.
//
// Exports (per shared contract):
//   renderSeedScreen()                          -> void
//   renderQuiz(paper, seed, bankVersion)        -> void  (MCQ + short-numeric inputs)
//   renderResults(result, seed, extras)         -> void  (score card, per-topic,
//                                                          emoji grid, answer review)
//     extras = { paper, answers, bankVersion, partyPlayerName, partyPass } —
//     OPTIONAL. When absent, no answer-review section is rendered at all.
//     When present, `answers` MAY itself be null to render the review with a
//     correct-answer column only (Batch D leaderboard use — a per-player
//     answer sheet is out of scope there even though the data exists).
//     `partyPlayerName` (Batch D) — that player's name, shown as a banner on
//     the score card so a passed-around phone always shows whose card it is.
//     `partyPass` (Batch D) — `{ nextName }` swaps in a single "Pass to
//     <nextName>" action appended to `#results` in place of the static
//     rematch/same-seed row (app.js hides that row itself); omit/null for
//     the normal solo/end-of-party result screen.
//   renderInterstitial(name, meta)              -> void  (Batch D "hand the
//                                                          phone to <name>")
//   renderLeaderboard(players, results, extras) -> void  (Batch D ranked
//                                                          leaderboard + C2
//                                                          answer review)
//   addPartyRosterRow(index)                    -> HTMLInputElement | null
//                                                  (Batch D — appends one more
//                                                  roster name input, up to 8;
//                                                  the first two ship static in
//                                                  index.html)
//
// This module only paints DOM. It never reads the network, never touches
// storage, and never imports siblings — app.js owns the Session and wires the
// events (Start / Submit / Share / Reveal answers / Rematch). Answers are
// captured in the live #quiz-form under name="q-<questionId>" controls, which
// app.js reads at submit time via FormData; render.js additionally reflects
// the selection into the visible .option--selected state for feedback.
//
// All icons are self-contained inline SVG drawn in currentColor — no external
// assets, so the whole loop works offline after one cached load.

/* ------------------------------------------------------------------ *
 * Small DOM helpers
 * ------------------------------------------------------------------ */

function el(tag, opts) {
  const node = document.createElement(tag);
  if (!opts) return node;
  if (opts.class) node.className = opts.class;
  if (opts.text != null) node.textContent = String(opts.text);
  if (opts.html != null) node.innerHTML = opts.html; // ONLY for trusted inline SVG strings
  if (opts.attrs) {
    for (const [k, v] of Object.entries(opts.attrs)) {
      if (v != null) node.setAttribute(k, String(v));
    }
  }
  if (opts.children) {
    for (const child of opts.children) {
      if (child) node.appendChild(child);
    }
  }
  return node;
}

function svg(inner, opts) {
  const size = (opts && opts.size) || 20;
  const wrap = el('span', { class: (opts && opts.class) || '', attrs: { 'aria-hidden': 'true' } });
  wrap.innerHTML =
    '<svg viewBox="0 0 24 24" width="' + size + '" height="' + size +
    '" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
  return wrap;
}

/* ------------------------------------------------------------------ *
 * Iconography — inline SVG, currentColor, no external assets
 * ------------------------------------------------------------------ */

function iconCheck(size) {
  return svg('<path d="M5 13l4 4L19 7"/>', { size: size || 18 });
}

function iconCross(size) {
  return svg('<path d="M6 6l12 12M18 6L6 18"/>', { size: size || 18 });
}

function iconClock(size) {
  return svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', { size: size || 18 });
}

function iconOffline(size) {
  return svg(
    '<path d="M3 12a9 9 0 0 1 18 0"/><circle cx="12" cy="17" r="1.4"/>' +
      '<path d="M7 13a7 7 0 0 1 10 0"/>',
    { size: size || 18 }
  );
}

// Deterministic per-topic glyph so each topic reads consistently everywhere.
// Falls back to a neutral book glyph for any topic name not matched.
function topicGlyph(topic, size) {
  const key = String(topic || '').toLowerCase();
  let inner;
  if (/frac/.test(key)) {
    inner = '<path d="M7 17L17 7"/><circle cx="8" cy="8" r="2"/><circle cx="16" cy="16" r="2"/>';
  } else if (/dec/.test(key)) {
    inner = '<path d="M5 6v9a3 3 0 0 0 3 3h11"/><circle cx="16" cy="15" r="1.2"/>';
  } else if (/perc|%/.test(key)) {
    inner = '<path d="M6 18L18 6"/><circle cx="8" cy="8" r="2.2"/><circle cx="16" cy="16" r="2.2"/>';
  } else if (/ratio|propor/.test(key)) {
    inner = '<path d="M4 20L20 4"/><path d="M8 6h.01M6 8h.01M18 16h.01M16 18h.01"/>';
  } else if (/area|perim|shape|geom|volume|measure/.test(key)) {
    inner = '<rect x="4" y="6" width="16" height="12" rx="1"/><path d="M4 12h16"/>';
  } else if (/angle/.test(key)) {
    inner = '<path d="M5 19h14"/><path d="M5 19L18 8"/><path d="M5 19a8 8 0 0 0 6-4"/>';
  } else if (/whole|number|place|value|integ/.test(key)) {
    inner = '<path d="M8 6v12M6 9h4M15 6l-2 2v10M13 18h4"/>';
  } else if (/rate|speed|time/.test(key)) {
    inner = '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>';
  } else if (/money|dollar/.test(key)) {
    inner = '<path d="M12 4v16M9 8a3 3 0 0 1 6 0c0 2-6 2-6 4a3 3 0 0 0 6 0"/>';
  } else {
    inner = '<path d="M5 5h11a2 2 0 0 1 2 2v12H7a2 2 0 0 0-2 2z"/><path d="M9 5v14"/>';
  }
  return svg(inner, { size: size || 18, class: 'topic-glyph' });
}

/* ------------------------------------------------------------------ *
 * Screen visibility — this module guarantees its screen is visible.
 * Never depends on a sibling file to un-hide content.
 * ------------------------------------------------------------------ */

function showScreen(id) {
  const screens = document.querySelectorAll('.screen');
  if (!screens.length) return;
  screens.forEach(function (s) {
    const active = s.id === id;
    s.classList.toggle('screen--active', active);
    s.classList.toggle('screen--hidden', !active);
  });
}

/* ------------------------------------------------------------------ *
 * Entrance reveal — self-contained, gated on prefers-reduced-motion.
 * Base state is always visible; motion only decorates when allowed and
 * degrades to instantly-visible if IntersectionObserver is missing.
 * ------------------------------------------------------------------ */

function motionAllowed() {
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches
  );
}

function revealOnScroll(nodes) {
  const list = Array.prototype.slice.call(nodes || []);
  if (!list.length) return;

  if (!motionAllowed() || typeof IntersectionObserver === 'undefined') {
    return; // elements are already visible at rest — nothing to do
  }

  list.forEach(function (node, i) {
    node.style.opacity = '0';
    node.style.transform = 'translateY(12px)';
    node.style.transition =
      'opacity 420ms cubic-bezier(.32,.72,0,1), transform 420ms cubic-bezier(.32,.72,0,1)';
    node.style.transitionDelay = Math.min(i * 45, 320) + 'ms';
  });

  const io = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const n = entry.target;
          n.style.opacity = '1';
          n.style.transform = 'translateY(0)';
          obs.unobserve(n);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -8% 0px' }
  );

  list.forEach(function (node) {
    io.observe(node);
  });
}

/* ================================================================== *
 * renderSeedScreen()
 * ================================================================== */

export function renderSeedScreen() {
  const screen = document.getElementById('screen-seed');
  showScreen('screen-seed');
  if (!screen) return;

  // Default the spoken seed so first paint is a ready-to-start state.
  const input = document.getElementById('seed-input');
  if (input && !input.value) {
    input.value = '1234';
  }

  // Clear any stale validation message.
  const err = document.getElementById('seed-error');
  if (err) err.textContent = '';

  // Ensure the offline-readiness pill exists and has a sensible default label.
  // app.js flips it to .offline-indicator--ready on the 'sw:ready' signal.
  let pill = document.getElementById('offline-indicator');
  if (!pill && screen) {
    const form = screen.querySelector('.seed-form') || screen;
    pill = el('p', {
      class: 'offline-indicator',
      attrs: { id: 'offline-indicator', role: 'status', 'aria-live': 'polite' }
    });
    form.appendChild(pill);
  }
  if (pill && !pill.querySelector('.offline-indicator__dot')) {
    pill.textContent = '';
    pill.appendChild(el('span', { class: 'offline-indicator__dot', attrs: { 'aria-hidden': 'true' } }));
    pill.appendChild(iconOffline(16));
    // State-1 copy ("not ready yet, online") — app.js drives the real state from
    // here on via #offline-indicator's .offline-indicator__text (see A1); this is
    // only ever seen if #offline-indicator was missing from the static shell.
    pill.appendChild(
      el('span', { class: 'offline-indicator__text', text: 'Getting ready for offline…' })
    );
  }
}

/* ------------------------------------------------------------------ *
 * A3 — per-question input mode: a question whose accepted forms include a
 * fraction needs a text keyboard (iOS's decimal keypad has no '/' key).
 * ------------------------------------------------------------------ */

function isFractionCapable(q) {
  const check = q && q.check;
  if (!check) return false;
  if (check.rule === 'fraction-equivalent') return true;
  if (Array.isArray(check.accepted)) {
    return check.accepted.some((v) => typeof v === 'string' && v.indexOf('/') !== -1);
  }
  return false;
}

/* ================================================================== *
 * renderQuiz(paper, seed, bankVersion)
 * ================================================================== */

export function renderQuiz(paper, seed, bankVersion) {
  const screen = document.getElementById('screen-quiz');
  showScreen('screen-quiz');

  // A6 — the seed AND the bank version travel together wherever the seed is
  // displayed, so a cached device with a stale bank can be spotted before two
  // phones compare scores.
  const seedEl = document.getElementById('quiz-seed');
  if (seedEl && seed != null) seedEl.textContent = String(seed);
  const bankEl = document.getElementById('quiz-bank-version');
  if (bankEl && bankVersion != null) bankEl.textContent = String(bankVersion);

  const questions = Array.isArray(paper) ? paper : [];

  // B1 — sticky quiz header: live "answered N/20" + "MM:SS" timer, painted
  // here (once) and kept up to date afterward by app.js (progress from its
  // delegated input/change autosave hook, the timer from its 1s interval).
  // The timer itself opts OUT of the wrapper's aria-live so a screen reader
  // is not asked to announce a changing time every second; the progress
  // count (which only changes on an actual answer) stays live.
  let statusBar = document.getElementById('quiz-status');
  if (!statusBar) {
    statusBar = el('div', {
      class: 'quiz-status',
      attrs: { id: 'quiz-status', role: 'status', 'aria-live': 'polite' }
    });
    statusBar.appendChild(
      el('span', {
        class: 'quiz-status__progress',
        attrs: { id: 'quiz-progress' },
        text: 'answered 0/' + questions.length
      })
    );
    statusBar.appendChild(
      el('span', {
        class: 'quiz-status__timer mono',
        attrs: { id: 'quiz-timer', 'aria-live': 'off' },
        text: '00:00'
      })
    );
    // Pause lives in the sticky bar so it is reachable mid-scroll; app.js
    // owns its behavior (stop the clock, cover the questions).
    statusBar.appendChild(
      el('button', {
        class: 'btn btn--ghost quiz-status__pause',
        attrs: { id: 'pause-btn', type: 'button', 'aria-label': 'Pause and hide the questions' },
        text: '⏸️ Pause'
      })
    );
    const head = screen && screen.querySelector('.screen__head');
    if (head && head.parentNode) {
      head.parentNode.insertBefore(statusBar, head.nextSibling);
    } else if (screen) {
      screen.insertBefore(statusBar, screen.firstChild);
    }
  } else {
    // Re-render of an already-mounted quiz screen (e.g. a fresh Start after a
    // rematch): reset the progress text; app.js drives the live value from
    // here on. The timer's own text is entirely owned by app.js's interval.
    const progressEl = document.getElementById('quiz-progress');
    if (progressEl) progressEl.textContent = 'answered 0/' + questions.length;
  }

  // Find or create the quiz form.
  let form = document.getElementById('quiz-form');
  if (!form) {
    form = el('form', { attrs: { id: 'quiz-form', novalidate: 'novalidate' } });
    (screen || document.body).appendChild(form);
  }
  form.textContent = '';

  // Section eyebrow header.
  form.appendChild(
    el('p', { class: 'eyebrow', text: 'Same seed - same paper - 20 questions' })
  );

  const blocks = [];

  questions.forEach(function (q, index) {
    const isMcq = q && q.type === 'mcq' && Array.isArray(q.options);
    const qid = q && q.id != null ? String(q.id) : 'q' + index;
    const fieldName = 'q-' + qid;

    const block = el('fieldset', {
      class: 'question ' + (isMcq ? 'question--mcq' : 'question--numeric'),
      attrs: { 'data-question-id': qid }
    });

    // Eyebrow: topic glyph + topic + question number.
    const eyebrow = el('legend', { class: 'question__eyebrow eyebrow' });
    eyebrow.appendChild(topicGlyph(q && q.topic, 16));
    eyebrow.appendChild(
      el('span', { text: (q && q.topic ? String(q.topic) : 'Question') + ' - Q' + (index + 1) })
    );
    block.appendChild(eyebrow);

    // Prompt (textContent — never trust prompt strings as HTML).
    block.appendChild(
      el('p', { class: 'question__prompt', text: q && q.prompt != null ? q.prompt : '' })
    );

    if (isMcq) {
      const options = el('div', {
        class: 'question__options',
        attrs: { role: 'radiogroup', 'aria-label': 'Answer options for question ' + (index + 1) }
      });

      q.options.forEach(function (optText, optIndex) {
        const inputId = fieldName + '-' + optIndex;
        const label = el('label', { class: 'option', attrs: { for: inputId } });

        const radio = el('input', {
          class: 'option__input',
          attrs: {
            type: 'radio',
            id: inputId,
            name: fieldName,
            value: String(optIndex)
          }
        });

        const text = el('span', { class: 'option__label', text: optText });

        label.appendChild(radio);
        label.appendChild(text);
        options.appendChild(label);
      });

      // Selection styling (.option--selected) is reflected by app.js's single
      // delegated `change` listener (A4) — no per-group listener here, so
      // there is exactly one code path applying the class.
      block.appendChild(options);
    } else {
      const wrap = el('div', { class: 'question__field' });
      const inputId = fieldName + '-input';
      const fractionCapable = isFractionCapable(q);
      const numInput = el('input', {
        class: 'question__input',
        attrs: {
          type: 'text',
          id: inputId,
          name: fieldName,
          inputmode: fractionCapable ? 'text' : 'decimal',
          autocomplete: 'off',
          autocapitalize: 'off',
          autocorrect: 'off',
          spellcheck: 'false',
          'aria-label': 'Answer for question ' + (index + 1),
          placeholder: 'Type your answer'
        }
      });
      wrap.appendChild(numInput);
      if (fractionCapable) {
        // Generic hint string only (Invariant 4) — never derived from the
        // question's own answer/accepted values.
        wrap.appendChild(
          el('p', {
            class: 'question__hint',
            text: 'Fraction (like 3/4) or decimal — both fine.'
          })
        );
      }
      block.appendChild(wrap);
    }

    form.appendChild(block);
    blocks.push(block);
  });

  // Submit control — create only if index.html did not already ship it.
  // type="submit" + form="quiz-form" (rather than a bare type="button")
  // makes this the form's default button, which is what lets Enter in any
  // quiz field trigger the same B2 guard as a click (see app.js's shared
  // requestSubmit() funnel).
  if (!document.getElementById('submit-btn')) {
    const submit = el('button', {
      class: 'btn btn--primary',
      text: 'Submit and mark',
      attrs: { id: 'submit-btn', type: 'submit', form: 'quiz-form' }
    });
    form.appendChild(submit);
  }

  // Bring the quiz to the top for a clean start.
  if (typeof window.scrollTo === 'function') {
    window.scrollTo(0, 0);
  }

  revealOnScroll(blocks);
}

/* ================================================================== *
 * renderResults(result, seed, extras)
 * ================================================================== */

function formatElapsed(ms) {
  const totalSeconds = Math.max(0, Math.round((Number(ms) || 0) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return mm + ':' + ss;
}

// C2 — spoiler-gated answer review display rules.
// Player's MCQ answer: question.options[Number(value)] (out-of-range/absent
// => "blank"). Short-numeric: the raw string, or "blank".
function formatPlayerAnswer(question, rawValue) {
  const isMcq = question && question.type === 'mcq' && Array.isArray(question.options);
  if (rawValue === undefined || rawValue === null || rawValue === '') return 'blank';
  if (isMcq) {
    const idx = Number(rawValue);
    if (!Number.isInteger(idx) || idx < 0 || idx >= question.options.length) return 'blank';
    return String(question.options[idx]);
  }
  return String(rawValue);
}

// Correct answer: MCQ => question.options[question.answer]; short-numeric =>
// String(question.answer).
function formatCorrectAnswer(question) {
  if (!question) return '';
  const isMcq = question.type === 'mcq' && Array.isArray(question.options);
  if (isMcq) {
    const opt = question.options[question.answer];
    return opt != null ? String(opt) : '';
  }
  return String(question.answer);
}

// Builds the collapsed-by-default #reveal-answers-btn + #answer-review pair.
// `answers` is the raw answers map (qid -> string) for the player being shown,
// or null to render the correct-answer column only (Batch D leaderboard use —
// see contract note at the top of the file). Returns null if there is no
// paper to review (extras absent or malformed), so callers can skip mounting
// it entirely.
function buildAnswerReview(paper, answers) {
  if (!Array.isArray(paper) || paper.length === 0) return null;

  const wrap = el('div', { class: 'answer-review-panel' });

  const toggle = el('button', {
    class: 'btn btn--ghost answer-review-panel__toggle',
    text: 'Reveal answers',
    attrs: {
      id: 'reveal-answers-btn',
      type: 'button',
      'aria-expanded': 'false',
      'aria-controls': 'answer-review',
    },
  });
  wrap.appendChild(toggle);

  wrap.appendChild(
    el('p', {
      class: 'answer-review-panel__hint',
      text: 'Spoilers for anyone still playing.',
    })
  );

  // Collapsed by default on every render — the `hidden` attribute, not just a
  // visual class, so assistive tech and simple `[hidden]` selectors agree.
  const review = el('div', {
    class: 'answer-review',
    attrs: { id: 'answer-review', hidden: 'hidden' },
  });

  const hasAnswers = answers && typeof answers === 'object';

  paper.forEach(function (q, i) {
    const item = el('div', { class: 'answer-review__item' });

    item.appendChild(
      el('p', { class: 'answer-review__eyebrow eyebrow', text: 'Q' + (i + 1) })
    );
    item.appendChild(
      el('p', { class: 'answer-review__prompt', text: q && q.prompt != null ? q.prompt : '' })
    );

    if (hasAnswers) {
      const qid = q && q.id != null ? String(q.id) : null;
      const raw = qid ? answers[qid] : undefined;
      const yourP = el('p', { class: 'answer-review__row answer-review__row--yours' });
      yourP.appendChild(el('span', { class: 'answer-review__row-label', text: 'Your answer: ' }));
      yourP.appendChild(el('span', { class: 'answer-review__row-value', text: formatPlayerAnswer(q, raw) }));
      item.appendChild(yourP);
    }

    const correctP = el('p', { class: 'answer-review__row answer-review__row--correct' });
    correctP.appendChild(el('span', { class: 'answer-review__row-label', text: 'Correct answer: ' }));
    correctP.appendChild(el('span', { class: 'answer-review__row-value', text: formatCorrectAnswer(q) }));
    item.appendChild(correctP);

    review.appendChild(item);
  });

  wrap.appendChild(review);
  return wrap;
}

export function renderResults(result, seed, extras) {
  const screen = document.getElementById('screen-results');
  showScreen('screen-results');

  // Batch D — #reveal-answers-btn/#answer-review are reused by the
  // leaderboard (D3); only one live copy of each id may exist in the DOM at
  // once (plain id uniqueness, and #reveal-answers-btn's aria-controls needs
  // an unambiguous target), so strip any copy left behind in the OTHER
  // screen before this one paints its own.
  clearForeignAnswerReview('screen-results');

  let root = document.getElementById('results');
  if (!root) {
    root = el('div', { attrs: { id: 'results' } });
    (screen || document.body).appendChild(root);
  }
  root.textContent = '';

  const res = result || {};
  const total = Number(res.total) || 0;
  const maxTotal = Number(res.maxTotal) || 20;
  const perTopic = res.perTopic || {};
  const perQuestion = Array.isArray(res.perQuestion) ? res.perQuestion : [];
  const elapsedMs = Number(res.elapsedMs) || 0;

  const hasExtras = extras && typeof extras === 'object';
  const reviewPaper = hasExtras && Array.isArray(extras.paper) ? extras.paper : null;
  const reviewAnswers = hasExtras ? extras.answers : undefined; // may be null (D) or absent (no extras)
  const bankVersion = hasExtras && extras.bankVersion != null ? extras.bankVersion : null;
  // Batch D — mid-party interim card: whose card this is, and the single
  // "Pass to <nextName>" action that replaces the static rematch/same-seed
  // row (app.js hides that row itself for this render).
  const partyPlayerName = hasExtras && extras.partyPlayerName != null ? String(extras.partyPlayerName) : null;
  const partyPass = hasExtras && extras.partyPass && extras.partyPass.nextName != null ? extras.partyPass : null;

  const revealNodes = [];

  /* ---- C1 — glanceable score card (leads the screen) + per-topic breakdown ---- */

  const layout = el('div', { class: 'results-layout' });

  // Score card: seed + bank version (mono), the score itself as the dominant
  // element, and the elapsed time beneath labelled as the tie-breaker. This
  // replaces the old separate "Comparison field" jargon block entirely.
  const scorePanel = el('div', { class: 'results-layout__score' });
  const scoreCard = el('div', { class: 'score-card' });

  // Batch D — a passed-around phone always shows whose card is on screen.
  if (partyPlayerName) {
    scoreCard.appendChild(
      el('p', { class: 'score-card__player eyebrow', text: partyPlayerName })
    );
  }

  const meta = el('p', { class: 'score-card__meta mono' });
  meta.appendChild(
    el('span', {
      text: 'Seed ' + String(seed) + (bankVersion != null ? ' · bank v' + bankVersion : ''),
    })
  );
  scoreCard.appendChild(meta);

  scoreCard.appendChild(el('p', { class: 'eyebrow', text: 'Total correct' }));
  const scoreLine = el('p', { class: 'score-card__line' });
  scoreLine.appendChild(el('span', { class: 'score-card__value', text: String(total) }));
  scoreLine.appendChild(el('span', { class: 'score-card__max', text: '/ ' + String(maxTotal) }));
  scoreCard.appendChild(scoreLine);

  const timeLine = el('p', { class: 'score-card__time mono' });
  timeLine.appendChild(iconClock(16));
  timeLine.appendChild(el('span', { text: formatElapsed(elapsedMs) }));
  scoreCard.appendChild(timeLine);
  scoreCard.appendChild(
    el('p', { class: 'score-card__tiebreak', text: 'Tie-breaker: fastest time wins.' })
  );
  scoreCard.appendChild(
    el('p', {
      class: 'score-card__note',
      text: 'Marked on-device. Nothing about your paper leaves this phone.',
    })
  );

  scorePanel.appendChild(scoreCard);
  layout.appendChild(scorePanel);

  // Breakdown panel.
  const breakdownPanel = el('div', { class: 'results-layout__breakdown' });
  breakdownPanel.appendChild(el('p', { class: 'eyebrow', text: 'By topic' }));

  const topicKeys = Object.keys(perTopic);
  if (topicKeys.length === 0) {
    breakdownPanel.appendChild(
      el('p', { class: 'topic-row__name', text: 'No topic data' })
    );
  } else {
    topicKeys.forEach(function (topic) {
      const entry = perTopic[topic] || {};
      const correct = Number(entry.correct) || 0;
      const outOf = Number(entry.total) || 0;

      const row = el('div', { class: 'topic-row' });

      const name = el('span', { class: 'topic-row__name' });
      name.appendChild(topicGlyph(topic, 16));
      name.appendChild(el('span', { text: topic }));
      row.appendChild(name);

      row.appendChild(
        el('span', { class: 'topic-row__count', text: correct + ' / ' + outOf })
      );
      breakdownPanel.appendChild(row);
    });
  }
  layout.appendChild(breakdownPanel);

  root.appendChild(layout);
  revealNodes.push(layout);

  /* ---- Per-question correct / incorrect grid ---- */

  const gridWrap = el('div', { class: 'results-grid' });
  gridWrap.appendChild(el('p', { class: 'eyebrow', text: 'Question by question' }));

  const grid = el('div', {
    class: 'grid',
    attrs: { role: 'list', 'aria-label': 'Per-question results' }
  });

  perQuestion.forEach(function (correct, i) {
    const isCorrect = correct === true;
    const cell = el('span', {
      class: 'grid__cell ' + (isCorrect ? 'grid__cell--correct' : 'grid__cell--incorrect'),
      attrs: {
        role: 'listitem',
        title: 'Q' + (i + 1) + ' - ' + (isCorrect ? 'correct' : 'incorrect'),
        'aria-label': 'Question ' + (i + 1) + ' ' + (isCorrect ? 'correct' : 'incorrect')
      }
    });
    cell.appendChild(isCorrect ? iconCheck(18) : iconCross(18));
    grid.appendChild(cell);
  });

  gridWrap.appendChild(grid);
  root.appendChild(gridWrap);
  revealNodes.push(gridWrap);

  /* ---- C2 — spoiler-gated answer review (collapsed by default) ---- */

  const reviewSection = buildAnswerReview(reviewPaper, reviewAnswers);
  if (reviewSection) {
    root.appendChild(reviewSection);
    revealNodes.push(reviewSection);
  }

  /* ---- Share controls (app.js wires their clicks) ---- */

  const share = el('div', { class: 'share' });
  share.appendChild(el('p', { class: 'eyebrow', text: 'Share your grid - no answers revealed' }));

  const buttons = el('div', { class: 'share__row' });

  // C4 — WhatsApp/Telegram start enabled here; app.js immediately reconciles
  // their disabled state + note visibility against navigator.onLine right
  // after this render call (and again on every online/offline transition), so
  // render.js never itself reads navigator.onLine (Invariant 2: data in via
  // arguments only).
  const waWrap = el('div', { class: 'share__btn-wrap' });
  waWrap.appendChild(
    el('button', {
      class: 'btn btn--primary share__btn share__btn--whatsapp',
      text: 'WhatsApp',
      attrs: { id: 'share-whatsapp', type: 'button' }
    })
  );
  waWrap.appendChild(
    el('p', {
      class: 'share__btn-note',
      text: 'Needs internet',
      attrs: { id: 'share-whatsapp-note', hidden: 'hidden' }
    })
  );
  buttons.appendChild(waWrap);

  const tgWrap = el('div', { class: 'share__btn-wrap' });
  tgWrap.appendChild(
    el('button', {
      class: 'btn btn--ghost share__btn share__btn--telegram',
      text: 'Telegram',
      attrs: { id: 'share-telegram', type: 'button' }
    })
  );
  tgWrap.appendChild(
    el('p', {
      class: 'share__btn-note',
      text: 'Needs internet',
      attrs: { id: 'share-telegram-note', hidden: 'hidden' }
    })
  );
  buttons.appendChild(tgWrap);

  buttons.appendChild(
    el('button', {
      class: 'btn btn--ghost share__btn share__btn--copy',
      text: 'Copy summary',
      attrs: { id: 'copy-summary', type: 'button' }
    })
  );

  share.appendChild(buttons);
  root.appendChild(share);
  revealNodes.push(share);

  /* ---- D2 — mid-party "Pass to <next name>" action (in place of the static
     rematch/same-seed row, which app.js hides for this render) ---- */
  if (partyPass) {
    const passWrap = el('div', { class: 'results-actions party-pass-actions' });
    passWrap.appendChild(
      el('button', {
        class: 'btn btn--primary',
        text: 'Pass to ' + String(partyPass.nextName),
        attrs: { id: 'pass-to-next-btn', type: 'button' },
      })
    );
    root.appendChild(passWrap);
    revealNodes.push(passWrap);
  }

  if (typeof window.scrollTo === 'function') {
    window.scrollTo(0, 0);
  }

  revealOnScroll(revealNodes);
}

/* ------------------------------------------------------------------ *
 * Batch D — cross-screen id de-duplication for the reused C2 answer-review
 * pair. Only #screen-results (renderResults) and #screen-leaderboard
 * (renderLeaderboard) ever mount #reveal-answers-btn/#answer-review; a
 * screen switch never removes the OTHER screen's DOM (only toggles
 * .screen--active/.screen--hidden), so without this a completed multi-player
 * party would leave duplicate ids sitting in the document at once.
 * ------------------------------------------------------------------ */
function clearForeignAnswerReview(ownerScreenId) {
  ['reveal-answers-btn', 'answer-review'].forEach(function (id) {
    document.querySelectorAll('#' + id).forEach(function (node) {
      const owner = node.closest ? node.closest('.screen') : null;
      if (!owner || owner.id !== ownerScreenId) {
        node.remove();
      }
    });
  });
}

/* ================================================================== *
 * Batch D — pass-the-phone party mode
 * ================================================================== */

/* ------------------------------------------------------------------ *
 * addPartyRosterRow(index) — appends one more roster name input (index is
 * 0-based; the first two rows ship static in index.html). Returns the new
 * <input> (so app.js can focus it) or null if the roster list is missing.
 * ------------------------------------------------------------------ */
export function addPartyRosterRow(index) {
  const list = document.getElementById('party-roster-list');
  if (!list) return null;

  const inputId = 'party-player-' + index;
  const row = el('div', { class: 'party-roster__row' });
  const label = el('label', {
    class: 'party-roster__label',
    text: 'Player ' + (index + 1),
    attrs: { for: inputId },
  });
  const input = el('input', {
    class: 'party-roster__input',
    attrs: {
      type: 'text',
      id: inputId,
      name: inputId,
      autocomplete: 'off',
      spellcheck: 'false',
      placeholder: 'Name',
    },
  });

  row.appendChild(label);
  row.appendChild(input);
  list.appendChild(row);
  return input;
}

/* ================================================================== *
 * renderInterstitial(name, meta) — D2's "Hand the phone to <name>" screen.
 * meta = { index, total } is OPTIONAL and purely informational ("Player 2 of
 * 3"); the caller (app.js) never needs to read it back.
 * ================================================================== */
export function renderInterstitial(name, meta) {
  const screen = document.getElementById('screen-interstitial');
  showScreen('screen-interstitial');
  if (!screen) return;

  const safeName = name != null ? String(name) : 'the next player';

  const titleEl = document.getElementById('screen-interstitial-title');
  if (titleEl) titleEl.textContent = 'Hand the phone to ' + safeName;

  const leadEl = document.getElementById('interstitial-lead');
  if (leadEl) {
    leadEl.textContent = 'Everyone else look away — no peeking at ' + safeName + '’s screen.';
  }

  const head = screen.querySelector('.screen__head');
  let metaEl = document.getElementById('interstitial-meta');
  if (meta && Number.isInteger(meta.index) && Number.isInteger(meta.total)) {
    if (!metaEl && head) {
      metaEl = el('p', { class: 'interstitial-meta mono', attrs: { id: 'interstitial-meta' } });
      head.appendChild(metaEl);
    }
    if (metaEl) metaEl.textContent = 'Player ' + (meta.index + 1) + ' of ' + meta.total;
  } else if (metaEl && metaEl.parentNode) {
    metaEl.parentNode.removeChild(metaEl);
  }

  const actions = document.getElementById('interstitial-actions');
  if (actions) {
    actions.textContent = '';
    actions.appendChild(
      el('button', {
        class: 'btn btn--primary interstitial-actions__start',
        text: "I'm " + safeName + ' — start',
        attrs: { id: 'interstitial-start-btn', type: 'button' },
      })
    );
  }

  if (typeof window.scrollTo === 'function') {
    window.scrollTo(0, 0);
  }
}

/* ================================================================== *
 * renderLeaderboard(players, results, extras) — D3's ranked leaderboard,
 * sorted score desc, then elapsed asc, then roster order (stable tie-break),
 * winner row visually promoted. Reuses C2's answer-review builder with
 * `answers = null` (correct-answer column only — per-player answer sheets
 * are out of scope for the leaderboard view, per D3).
 * extras = { paper, bankVersion } — both optional; without `paper` no answer
 * review section is mounted.
 * ================================================================== */
function rankPartyRows(players, results) {
  const list = Array.isArray(players) ? players : [];
  const res = Array.isArray(results) ? results : [];
  const rows = list.map(function (name, i) {
    const r = res[i] && typeof res[i] === 'object' ? res[i] : null;
    return {
      index: i,
      name: name != null ? String(name) : 'Player ' + (i + 1),
      total: r && Number.isFinite(Number(r.total)) ? Number(r.total) : 0,
      maxTotal: r && Number.isFinite(Number(r.maxTotal)) ? Number(r.maxTotal) : 20,
      elapsedMs: r && Number.isFinite(Number(r.elapsedMs)) ? Number(r.elapsedMs) : 0,
    };
  });
  rows.sort(function (a, b) {
    if (b.total !== a.total) return b.total - a.total;
    if (a.elapsedMs !== b.elapsedMs) return a.elapsedMs - b.elapsedMs;
    return a.index - b.index; // stable roster-order tie-break
  });
  return rows;
}

export function renderLeaderboard(players, results, extras) {
  const screen = document.getElementById('screen-leaderboard');
  showScreen('screen-leaderboard');
  if (!screen) return;

  // See the note above clearForeignAnswerReview's definition — strip any
  // #reveal-answers-btn/#answer-review left over in #screen-results before
  // this screen mounts its own.
  clearForeignAnswerReview('screen-leaderboard');

  let body = document.getElementById('leaderboard-body');
  if (!body) {
    body = el('div', { attrs: { id: 'leaderboard-body' } });
    screen.appendChild(body);
  }
  body.textContent = '';

  const rows = rankPartyRows(players, results);

  const list = el('div', {
    class: 'leaderboard',
    attrs: { role: 'list', 'aria-label': 'Leaderboard, ranked by score then time' },
  });

  rows.forEach(function (row, rank) {
    const isWinner = rank === 0;
    const item = el('div', {
      class: 'leaderboard__row' + (isWinner ? ' leaderboard__row--winner' : ''),
      attrs: { role: 'listitem' },
    });

    item.appendChild(el('span', { class: 'leaderboard__rank mono', text: '#' + (rank + 1) }));

    const nameWrap = el('span', { class: 'leaderboard__name' });
    nameWrap.appendChild(el('span', { class: 'leaderboard__name-text', text: row.name }));
    if (isWinner) {
      nameWrap.appendChild(el('span', { class: 'leaderboard__crown', text: 'Winner' }));
    }
    item.appendChild(nameWrap);

    item.appendChild(
      el('span', { class: 'leaderboard__score mono', text: row.total + ' / ' + row.maxTotal })
    );
    item.appendChild(
      el('span', { class: 'leaderboard__time mono', text: formatElapsed(row.elapsedMs) })
    );

    list.appendChild(item);
  });

  body.appendChild(list);

  const hasExtras = extras && typeof extras === 'object';
  const reviewPaper = hasExtras && Array.isArray(extras.paper) ? extras.paper : null;
  const reviewSection = buildAnswerReview(reviewPaper, null);
  if (reviewSection) body.appendChild(reviewSection);

  const actions = el('div', { class: 'results-actions leaderboard-actions' });
  actions.appendChild(
    el('button', {
      class: 'btn btn--primary',
      text: 'Rematch: new seed',
      attrs: { id: 'leaderboard-rematch-btn', type: 'button' },
    })
  );
  actions.appendChild(
    el('button', {
      class: 'btn btn--ghost',
      text: 'Done',
      attrs: { id: 'leaderboard-done-btn', type: 'button' },
    })
  );
  body.appendChild(actions);

  if (typeof window.scrollTo === 'function') {
    window.scrollTo(0, 0);
  }
}
