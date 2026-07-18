// render.js — screen painters for the Smarty Challenge.
//
// Exports (per shared contract):
//   renderSeedScreen()                          -> void
//   renderQuiz(paper, seed, bankVersion)        -> void  (MCQ + short-numeric inputs)
//   renderResults(result, seed)                 -> void  (total, per-topic, emoji grid, elapsed)
//
// This module only paints DOM. It never reads the network, never touches
// storage, and never imports siblings — app.js owns the Session and wires the
// events (Start / Submit / Share). Answers are captured in the live #quiz-form
// under name="q-<questionId>" controls, which app.js reads at submit time via
// FormData; render.js additionally reflects the selection into the visible
// .option--selected state for feedback.
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
  if (!document.getElementById('submit-btn')) {
    const submit = el('button', {
      class: 'btn btn--primary',
      text: 'Submit and mark',
      attrs: { id: 'submit-btn', type: 'button' }
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
 * renderResults(result, seed)
 * ================================================================== */

function formatElapsed(ms) {
  const totalSeconds = Math.max(0, Math.round((Number(ms) || 0) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  return mm + ':' + ss;
}

export function renderResults(result, seed) {
  const screen = document.getElementById('screen-results');
  showScreen('screen-results');

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

  const revealNodes = [];

  // Eyebrow header naming the seed.
  const header = el('div', { class: 'results-head' });
  header.appendChild(
    el('p', { class: 'eyebrow', text: 'Seed ' + String(seed) + ' - your paper' })
  );
  header.appendChild(el('h2', { text: 'Marked' }));
  root.appendChild(header);
  revealNodes.push(header);

  /* ---- Score + per-topic breakdown (portrait: stacked; wide: side-by-side) ---- */

  const layout = el('div', { class: 'results-layout' });

  // Score panel.
  const scorePanel = el('div', { class: 'results-layout__score' });
  const score = el('div', { class: 'score' });
  score.appendChild(el('p', { class: 'eyebrow', text: 'Total correct' }));
  const scoreLine = el('p', { class: 'score__line' });
  scoreLine.appendChild(el('span', { class: 'score__value', text: String(total) }));
  scoreLine.appendChild(el('span', { class: 'score__max', text: '/ ' + String(maxTotal) }));
  score.appendChild(scoreLine);
  score.appendChild(
    el('p', {
      class: 'score__label',
      text: 'Marked on-device. Nothing about your paper leaves this phone.'
    })
  );
  scorePanel.appendChild(score);
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

  /* ---- Elapsed time — the COMPARISON / tie-break field ---- */

  const elapsed = el('div', { class: 'elapsed' });
  const elapsedHead = el('p', { class: 'eyebrow' });
  elapsedHead.appendChild(iconClock(16));
  elapsedHead.appendChild(el('span', { text: 'Comparison field' }));
  elapsed.appendChild(elapsedHead);

  elapsed.appendChild(el('p', { class: 'elapsed__value', text: formatElapsed(elapsedMs) }));
  elapsed.appendChild(
    el('p', {
      class: 'elapsed__label',
      text:
        'Time is the shared summary comparison field. On a tied score, the shorter time wins. ' +
        'This app does not declare a cross-device winner - agree on the result together.'
    })
  );
  root.appendChild(elapsed);
  revealNodes.push(elapsed);

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

  /* ---- Share controls (app.js wires their clicks) ---- */

  const share = el('div', { class: 'share' });
  share.appendChild(el('p', { class: 'eyebrow', text: 'Share your grid - no answers revealed' }));

  const buttons = el('div', { class: 'share__row' });

  buttons.appendChild(
    el('button', {
      class: 'btn btn--primary share__btn share__btn--whatsapp',
      text: 'WhatsApp',
      attrs: { id: 'share-whatsapp', type: 'button' }
    })
  );
  buttons.appendChild(
    el('button', {
      class: 'btn btn--ghost share__btn share__btn--telegram',
      text: 'Telegram',
      attrs: { id: 'share-telegram', type: 'button' }
    })
  );
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

  if (typeof window.scrollTo === 'function') {
    window.scrollTo(0, 0);
  }

  revealOnScroll(revealNodes);
}
