// logic.js — the Logic category's game: a timed fruit-order swap puzzle.
//
// Three stages (hidden orders of 3, 4, then 5 fruits) share ONE 45-second
// countdown. Each stage hides a seeded random arrangement of strawberry /
// banana / kiwi that always contains at least one of each fruit and never
// more than two of any (so it is always buildable from the player's hand of
// 2 + 2 + 2). The player arranges fruits left-to-right to match; the ONLY
// feedback is the "Hands up!" button, which flashes "N in the right spot"
// briefly and then disappears — memorizing that count IS the puzzle.
//
// Determinism: the hidden orders come from prng.js's MT19937 keyed on the
// game number, so the same spoken number builds the same three orders on
// every device (same rule the math/riddle papers follow). Faster total time
// is the better score.
//
// This module owns everything inside #screen-logic: painting, the countdown
// interval, and its own delegated click listener. app.js only calls
// startLogicGame({ seed, onExit }) and receives control back through onExit
// (action: 'rematch' | 'same-seed' | 'back'). No persistence — a 45-second
// game is shorter than any reasonable resume window, so nothing is stored.

import { makeMT19937 } from './prng.js';

const FRUITS = [
  { key: 'strawberry', emoji: '🍓', name: 'Strawberry' },
  { key: 'banana', emoji: '🍌', name: 'Banana' },
  { key: 'kiwi', emoji: '🥝', name: 'Kiwi' },
];

const STAGE_SIZES = [3, 4, 5];
const COPIES_PER_FRUIT = 2;
const TOTAL_TIME_MS = 45 * 1000;
const FEEDBACK_MS = 1800; // how long a "Hands up!" count stays on screen
const TICK_MS = 100; // countdown repaint cadence (tenths of a second)
const LOW_TIME_MS = 10 * 1000;

function fruitByKey(key) {
  for (const f of FRUITS) if (f.key === key) return f;
  return FRUITS[0];
}

/* ------------------------------------------------------------------ *
 * Module state — one game at a time, mirroring app.js's session style.
 * ------------------------------------------------------------------ */

/**
 * @type {{
 *   seed:number, orders:string[][], stage:number,
 *   slots:Array<string|null>,
 *   selected:null|{type:'hand',fruit:string}|{type:'slot',index:number},
 *   attempts:number, started:boolean, deadline:number, finished:boolean,
 *   onExit:(action:string, seed:number)=>void,
 * }|null}
 */
let game = null;
let countdownHandle = null;
let feedbackHandle = null;
let eventsWired = false;

/* ------------------------------------------------------------------ *
 * Small DOM helpers (same idiom as render.js — this module never
 * imports render.js, only paints its own screen).
 * ------------------------------------------------------------------ */

function el(tag, opts) {
  const node = document.createElement(tag);
  if (!opts) return node;
  if (opts.class) node.className = opts.class;
  if (opts.text != null) node.textContent = String(opts.text);
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

function showScreen(id) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(function (s) {
    const active = s.id === id;
    s.classList.toggle('screen--active', active);
    s.classList.toggle('screen--hidden', !active);
  });
  try { window.scrollTo(0, 0); } catch (_err) { /* non-DOM env */ }
}

/* ------------------------------------------------------------------ *
 * Seeded hidden orders — same number, same three arrangements.
 * ------------------------------------------------------------------ */

function shuffleInPlace(arr, rng) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = rng.nextInt(i + 1);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
}

function hasAllFruits(order) {
  return FRUITS.every((f) => order.indexOf(f.key) !== -1);
}

function buildStageOrders(seedNum) {
  const rng = makeMT19937(seedNum >>> 0);
  return STAGE_SIZES.map(function (size) {
    // Draw from the same 2+2+2 pool the player holds, so an order can never
    // demand three of one fruit; redraw until every fruit appears at least
    // once. Rejection sampling with integer draws only, so every device
    // rejects and redraws at exactly the same points (cross-device identical).
    const pool = [];
    for (const f of FRUITS) {
      for (let c = 0; c < COPIES_PER_FRUIT; c++) pool.push(f.key);
    }
    let order;
    do {
      shuffleInPlace(pool, rng);
      order = pool.slice(0, size);
    } while (!hasAllFruits(order));
    return order;
  });
}

/* ------------------------------------------------------------------ *
 * Derived state
 * ------------------------------------------------------------------ */

function currentOrder() {
  return game.orders[game.stage];
}

function placedCount(fruitKey) {
  let n = 0;
  for (const s of game.slots) if (s === fruitKey) n += 1;
  return n;
}

function remainingInHand(fruitKey) {
  return COPIES_PER_FRUIT - placedCount(fruitKey);
}

function slotsFull() {
  return game.slots.every((s) => s != null);
}

/* ------------------------------------------------------------------ *
 * Painting
 * ------------------------------------------------------------------ */

function bodyRoot() {
  return document.getElementById('logic-body');
}

function paintSeed(seed) {
  const seedEl = document.getElementById('logic-seed');
  if (seedEl) seedEl.textContent = String(seed);
}

function formatCountdown(ms) {
  return (Math.max(0, ms) / 1000).toFixed(1) + 's';
}

// Pre-game intro card — the rules live HERE, not on the game board, so the
// board stays uncluttered. The 45-second clock only starts when the player
// taps Start from this card, so reading time is never play time.
function paintIntro() {
  const root = bodyRoot();
  if (!root) return;
  root.textContent = '';

  const intro = el('div', { class: 'logic-intro' });
  intro.appendChild(el('p', { class: 'logic-intro__emoji', attrs: { 'aria-hidden': 'true' }, text: '🍓🍌🥝' }));
  intro.appendChild(el('p', { class: 'logic-intro__title', text: 'How to play' }));

  const steps = el('ul', { class: 'logic-intro__steps' });
  [
    'A hidden fruit order is waiting — arrange your fruits to match it.',
    'Tap a fruit, then a box. Tap two boxes to swap them.',
    'Press 🙌 Hands up! to check — the count of right spots flashes once, so memorize it.',
    'Clear all 3 stages before the 45 seconds run out. Faster is better!',
  ].forEach(function (text) {
    steps.appendChild(el('li', { text }));
  });
  intro.appendChild(steps);

  const actions = el('div', { class: 'logic-intro__actions' });
  actions.appendChild(el('button', {
    class: 'btn btn--primary',
    attrs: { id: 'logic-intro-start-btn', type: 'button' },
    text: "I'm ready — start the clock",
  }));
  actions.appendChild(el('button', {
    class: 'btn btn--ghost',
    attrs: { id: 'logic-intro-back-btn', type: 'button' },
    text: 'Back',
  }));
  intro.appendChild(actions);

  root.appendChild(intro);
}

// Full stage paint: status bar, slots, hand, actions. Called on game start
// and on every stage advance; per-tap updates go through paintBoard() so the
// feedback/status nodes are never rebuilt mid-flash.
function paintStage() {
  const root = bodyRoot();
  if (!root) return;
  root.textContent = '';

  const size = currentOrder().length;

  const status = el('div', { class: 'logic-status', attrs: { id: 'logic-status' } });
  status.appendChild(el('span', {
    class: 'logic-status__stage',
    attrs: { id: 'logic-stage' },
    text: 'Stage ' + (game.stage + 1) + ' of ' + STAGE_SIZES.length + ' · ' + size + ' fruits',
  }));
  status.appendChild(el('span', {
    class: 'logic-status__timer mono',
    attrs: { id: 'logic-timer', 'aria-live': 'off' },
    text: formatCountdown(game.deadline - Date.now()),
  }));
  status.appendChild(el('button', {
    class: 'btn btn--ghost logic-status__quit',
    attrs: { id: 'logic-quit-btn', type: 'button' },
    text: 'Give up',
  }));
  root.appendChild(status);

  const board = el('div', { class: 'logic-board' });

  board.appendChild(el('p', { class: 'eyebrow', text: 'Guess the order' }));
  board.appendChild(el('div', {
    class: 'logic-slots',
    attrs: { id: 'logic-slots', role: 'group', 'aria-label': 'Your guess, left to right' },
  }));

  board.appendChild(el('p', { class: 'eyebrow logic-hand-label', text: 'Your hand' }));
  board.appendChild(el('div', {
    class: 'logic-hand',
    attrs: { id: 'logic-hand', role: 'group', 'aria-label': 'Fruits in your hand' },
  }));

  root.appendChild(board);

  const actions = el('div', { class: 'logic-actions' });
  actions.appendChild(el('button', {
    class: 'btn btn--primary logic-handsup',
    attrs: { id: 'handsup-btn', type: 'button' },
    text: '🙌 Hands up!',
  }));
  actions.appendChild(el('p', {
    class: 'logic-feedback',
    attrs: { id: 'logic-feedback', role: 'status', 'aria-live': 'polite' },
  }));
  root.appendChild(actions);

  paintBoard();
}

// Repaints just the slots + hand + Hands-up disabled state from game state.
function paintBoard() {
  const slotsEl = document.getElementById('logic-slots');
  const handEl = document.getElementById('logic-hand');
  if (!slotsEl || !handEl || !game) return;

  const sel = game.selected;

  slotsEl.textContent = '';
  game.slots.forEach(function (fruitKey, i) {
    const filled = fruitKey != null;
    const fruit = filled ? fruitByKey(fruitKey) : null;
    const selected = sel && sel.type === 'slot' && sel.index === i;
    const btn = el('button', {
      class: 'logic-slot'
        + (filled ? ' logic-slot--filled' : '')
        + (selected ? ' logic-slot--selected' : ''),
      attrs: {
        type: 'button',
        'data-slot-index': i,
        'aria-pressed': selected ? 'true' : 'false',
        'aria-label': 'Box ' + (i + 1) + ' of ' + game.slots.length + ': '
          + (fruit ? fruit.name : 'empty'),
      },
      text: fruit ? fruit.emoji : '',
    });
    slotsEl.appendChild(btn);
  });

  // Placed fruits leave the hand entirely — only the copies still in hand
  // are rendered (the row keeps its height via CSS so nothing jumps).
  handEl.textContent = '';
  FRUITS.forEach(function (fruit) {
    const remaining = remainingInHand(fruit.key);
    for (let copy = 0; copy < remaining; copy++) {
      const selected = copy === 0
        && sel && sel.type === 'hand' && sel.fruit === fruit.key;
      const btn = el('button', {
        class: 'logic-token' + (selected ? ' logic-token--selected' : ''),
        attrs: {
          type: 'button',
          'data-fruit': fruit.key,
          'aria-pressed': selected ? 'true' : 'false',
          'aria-label': fruit.name,
        },
        text: fruit.emoji,
      });
      handEl.appendChild(btn);
    }
  });

  const handsUp = document.getElementById('handsup-btn');
  if (handsUp) handsUp.disabled = !slotsFull();
}

/* ------------------------------------------------------------------ *
 * The one feedback channel — shows, then goes away (the memory mechanic).
 * ------------------------------------------------------------------ */

function clearFeedbackTimer() {
  if (feedbackHandle != null) {
    clearTimeout(feedbackHandle);
    feedbackHandle = null;
  }
}

function flashFeedback(text) {
  const fb = document.getElementById('logic-feedback');
  if (!fb) return;
  clearFeedbackTimer();
  fb.textContent = text;
  fb.classList.add('logic-feedback--show');
  feedbackHandle = window.setTimeout(function () {
    feedbackHandle = null;
    fb.classList.remove('logic-feedback--show');
    // Empty the live region only after the fade so screen readers get the
    // full announcement, and sighted players get the fade-out.
    window.setTimeout(function () { fb.textContent = ''; }, 300);
  }, FEEDBACK_MS);
}

/* ------------------------------------------------------------------ *
 * Countdown — ONE shared 45s clock across all three stages.
 * ------------------------------------------------------------------ */

function stopCountdown() {
  if (countdownHandle != null) {
    clearInterval(countdownHandle);
    countdownHandle = null;
  }
}

function tickCountdown() {
  if (!game || game.finished) return;
  const remaining = game.deadline - Date.now();
  const timerEl = document.getElementById('logic-timer');
  if (timerEl) {
    timerEl.textContent = formatCountdown(remaining);
    timerEl.classList.toggle('logic-status__timer--low', remaining <= LOW_TIME_MS);
  }
  if (remaining <= 0) finishGame(false);
}

function startCountdown() {
  stopCountdown();
  countdownHandle = window.setInterval(tickCountdown, TICK_MS);
}

/* ------------------------------------------------------------------ *
 * Interactions
 * ------------------------------------------------------------------ */

function handleTokenTap(fruitKey) {
  if (!game || game.finished) return;
  if (remainingInHand(fruitKey) <= 0) return;
  const sel = game.selected;
  game.selected = sel && sel.type === 'hand' && sel.fruit === fruitKey
    ? null // tapping the selected fruit again puts it down
    : { type: 'hand', fruit: fruitKey };
  paintBoard();
}

function handleSlotTap(index) {
  if (!game || game.finished) return;
  const sel = game.selected;

  if (sel && sel.type === 'hand') {
    // Place the selected hand fruit; any occupant simply returns to the hand
    // (hand counts derive from the slots, so no bookkeeping needed).
    game.slots[index] = sel.fruit;
    game.selected = null;
  } else if (sel && sel.type === 'slot') {
    if (sel.index === index) {
      // Second tap on the same picked-up slot sends the fruit back to hand.
      game.slots[index] = null;
      game.selected = null;
    } else {
      // The swap: exchange the two slots' contents (either may be empty).
      const tmp = game.slots[sel.index];
      game.slots[sel.index] = game.slots[index];
      game.slots[index] = tmp;
      game.selected = null;
    }
  } else if (game.slots[index] != null) {
    game.selected = { type: 'slot', index };
  }
  paintBoard();
}

function handleHandsUp() {
  if (!game || game.finished || !slotsFull()) return;

  game.attempts += 1;
  const order = currentOrder();
  let correct = 0;
  for (let i = 0; i < order.length; i++) {
    if (game.slots[i] === order[i]) correct += 1;
  }

  if (correct === order.length) {
    if (game.stage >= STAGE_SIZES.length - 1) {
      finishGame(true);
      return;
    }
    game.stage += 1;
    setupStageState();
    paintStage();
    flashFeedback('✅ Stage ' + game.stage + ' cleared! Now ' + currentOrder().length + ' fruits.');
    return;
  }

  flashFeedback('🙌 ' + correct + ' of ' + order.length + ' in the right spot.');
}

// Intro dismissed — NOW the shared 45-second clock starts.
function handleIntroStart() {
  if (!game || game.started) return;
  game.started = true;
  game.deadline = Date.now() + TOTAL_TIME_MS;
  paintStage();
  startCountdown();
}

function handleIntroBack() {
  if (!game) return;
  const seed = game.seed;
  const onExit = game.onExit;
  stopLogicGame();
  if (typeof onExit === 'function') onExit('back', seed);
}

function handleGiveUp() {
  if (!game) return;
  const ok = window.confirm('Give up this puzzle and go back?');
  if (!ok) return;
  const seed = game.seed;
  const onExit = game.onExit;
  stopLogicGame();
  if (typeof onExit === 'function') onExit('back', seed);
}

// ONE delegated listener on the document (added once), scoped to controls
// inside #screen-logic — same pattern app.js uses for its own screens.
function wireEvents() {
  if (eventsWired) return;
  eventsWired = true;
  document.addEventListener('click', function (event) {
    const target = event.target;
    if (!target || !target.closest) return;
    if (!target.closest('#screen-logic')) return;

    const token = target.closest('.logic-token');
    if (token && token.dataset.fruit) {
      event.preventDefault();
      handleTokenTap(token.dataset.fruit);
      return;
    }
    const slot = target.closest('.logic-slot');
    if (slot && slot.dataset.slotIndex != null) {
      event.preventDefault();
      handleSlotTap(Number(slot.dataset.slotIndex));
      return;
    }
    if (target.closest('#handsup-btn')) {
      event.preventDefault();
      handleHandsUp();
      return;
    }
    if (target.closest('#logic-intro-start-btn')) {
      event.preventDefault();
      handleIntroStart();
      return;
    }
    if (target.closest('#logic-intro-back-btn')) {
      event.preventDefault();
      handleIntroBack();
      return;
    }
    if (target.closest('#logic-quit-btn')) {
      event.preventDefault();
      handleGiveUp();
      return;
    }
    const rematch = target.closest('#logic-rematch-btn');
    const sameSeed = target.closest('#logic-same-seed-btn');
    if (rematch || sameSeed) {
      event.preventDefault();
      if (!game) return;
      const seed = game.seed;
      const onExit = game.onExit;
      stopLogicGame();
      if (typeof onExit === 'function') onExit(rematch ? 'rematch' : 'same-seed', seed);
    }
  });
}

/* ------------------------------------------------------------------ *
 * Results — reuses the score-card look so Logic results read like the
 * math/riddle results screen.
 * ------------------------------------------------------------------ */

function formatSolveTime(ms) {
  return (Math.max(0, ms) / 1000).toFixed(1);
}

function finishGame(solvedAll) {
  if (!game || game.finished) return;
  game.finished = true;
  const usedMs = solvedAll
    ? Math.min(TOTAL_TIME_MS, Math.max(0, TOTAL_TIME_MS - (game.deadline - Date.now())))
    : TOTAL_TIME_MS;
  stopCountdown();
  clearFeedbackTimer();

  const stagesCleared = solvedAll ? STAGE_SIZES.length : game.stage;
  const root = bodyRoot();
  if (!root) return;
  root.textContent = '';

  const card = el('div', { class: 'score-card logic-result-card' });
  card.appendChild(el('p', {
    class: 'score-card__meta mono',
    text: 'Game number ' + game.seed + ' · Logic',
  }));
  card.appendChild(el('p', {
    class: 'eyebrow',
    text: solvedAll ? 'All 3 stages solved in' : "Time's up — stages cleared",
  }));

  const line = el('p', { class: 'score-card__line' });
  if (solvedAll) {
    line.appendChild(el('span', { class: 'score-card__value', text: formatSolveTime(usedMs) }));
    line.appendChild(el('span', { class: 'score-card__max', text: 'seconds' }));
  } else {
    line.appendChild(el('span', { class: 'score-card__value', text: String(stagesCleared) }));
    line.appendChild(el('span', { class: 'score-card__max', text: '/ ' + STAGE_SIZES.length + ' stages' }));
  }
  card.appendChild(line);

  card.appendChild(el('p', {
    class: 'score-card__time',
    text: '🙌 ' + game.attempts + ' hands up',
  }));
  card.appendChild(el('p', {
    class: 'score-card__tiebreak',
    text: solvedAll
      ? 'Faster time is the better score. Same number, same hidden orders — challenge a friend.'
      : 'The 45 seconds ran out. Same number, same hidden orders — try it again.',
  }));
  root.appendChild(card);

  const actions = el('div', { class: 'results-actions' });
  actions.appendChild(el('button', {
    class: 'btn btn--primary',
    attrs: { id: 'logic-rematch-btn', type: 'button' },
    text: 'Rematch: new number',
  }));
  actions.appendChild(el('button', {
    class: 'btn btn--ghost',
    attrs: { id: 'logic-same-seed-btn', type: 'button' },
    text: 'Same number again',
  }));
  root.appendChild(actions);

  try { window.scrollTo(0, 0); } catch (_err) { /* non-DOM env */ }
}

/* ------------------------------------------------------------------ *
 * Lifecycle
 * ------------------------------------------------------------------ */

function setupStageState() {
  game.slots = currentOrder().map(function () { return null; });
  game.selected = null;
}

/**
 * Start a Logic game for `seed` and show #screen-logic.
 * `onExit(action, seed)` hands control back to app.js:
 *   'rematch' | 'same-seed' (from the result card) | 'back' (gave up).
 */
export function startLogicGame(opts) {
  const seed = Number(opts && opts.seed) || 0;
  stopLogicGame(); // never two live games/timers

  game = {
    seed,
    orders: buildStageOrders(seed),
    stage: 0,
    slots: [],
    selected: null,
    attempts: 0,
    started: false,
    deadline: 0, // set when the intro is dismissed (handleIntroStart)
    finished: false,
    onExit: opts && typeof opts.onExit === 'function' ? opts.onExit : null,
  };
  setupStageState();

  wireEvents();
  paintSeed(seed);
  paintIntro(); // the clock starts from the intro's Start button, not here
  showScreen('screen-logic');
}

/** Stop the current game (if any) and clear every timer. Safe to call twice. */
export function stopLogicGame() {
  stopCountdown();
  clearFeedbackTimer();
  game = null;
}
