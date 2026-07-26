// logic.js — the Logic category's game: a timed fruit-order swap puzzle.
//
// Three stages (hidden orders of 3, 4, then 5 fruits) share ONE 45-second
// countdown. Each stage hides a seeded random arrangement of strawberry /
// banana / kiwi dealt from the same 2+2+2 pool the player holds — so an
// order never needs three of one fruit (the hand couldn't build it), but is
// otherwise unconstrained: it may double up fruits or miss one entirely.
// The player arranges fruits left-to-right to match; the ONLY feedback is
// the "Hands up!" button, which flashes "N in the right spot" briefly and
// then disappears — memorizing that count IS the puzzle.
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

function buildStageOrders(seedNum) {
  const rng = makeMT19937(seedNum >>> 0);
  return STAGE_SIZES.map(function (size) {
    // Draw from the same 2+2+2 pool the player holds — the one physical
    // constraint (an order can never demand three of one fruit, or the hand
    // couldn't build it). Beyond that the composition is unconstrained: a
    // stage may double up fruits or miss a fruit entirely (e.g. 🥝🥝🍌).
    // Integer draws only, so every device deals identically from the seed.
    const pool = [];
    for (const f of FRUITS) {
      for (let c = 0; c < COPIES_PER_FRUIT; c++) pool.push(f.key);
    }
    shuffleInPlace(pool, rng);
    return pool.slice(0, size);
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
    'Drag fruits into the boxes. Drop one box on another to swap them, or drag a fruit back to your hand.',
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
// Slots and tokens are drag handles only (plain divs, not buttons) — every
// fruit movement goes through the pointer drag below; there is no tap-to-place.
function paintBoard() {
  const slotsEl = document.getElementById('logic-slots');
  const handEl = document.getElementById('logic-hand');
  if (!slotsEl || !handEl || !game) return;

  slotsEl.textContent = '';
  game.slots.forEach(function (fruitKey, i) {
    const filled = fruitKey != null;
    const fruit = filled ? fruitByKey(fruitKey) : null;
    slotsEl.appendChild(el('div', {
      class: 'logic-slot' + (filled ? ' logic-slot--filled' : ''),
      attrs: {
        'data-slot-index': i,
        'aria-label': 'Box ' + (i + 1) + ' of ' + game.slots.length + ': '
          + (fruit ? fruit.name : 'empty'),
      },
      text: fruit ? fruit.emoji : '',
    }));
  });

  // Placed fruits leave the hand entirely — only the copies still in hand
  // are rendered (the row keeps its height via CSS so nothing jumps).
  handEl.textContent = '';
  FRUITS.forEach(function (fruit) {
    const remaining = remainingInHand(fruit.key);
    for (let copy = 0; copy < remaining; copy++) {
      handEl.appendChild(el('div', {
        class: 'logic-token',
        attrs: { 'data-fruit': fruit.key, 'aria-label': fruit.name },
        text: fruit.emoji,
      }));
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

/* ------------------------------------------------------------------ *
 * Drag & drop — the ONLY way fruits move (no tap-to-place; the drag is
 * the realism). Pointer Events, so mouse and touch behave identically
 * (HTML5 drag-and-drop never fires on most mobile browsers). Past a
 * small threshold the press lifts the fruit into a ghost that follows
 * the pointer; the box underneath highlights as the drop target.
 * Dropping a box on a box swaps (or moves into an empty one), hand to
 * box places, and box to hand returns the fruit.
 * ------------------------------------------------------------------ */

const DRAG_THRESHOLD_PX = 6;

/** @type {{pointerId:number, source:{type:'slot',index:number}|{type:'hand',fruit:string}, originEl:Element, startX:number, startY:number, active:boolean, ghost:Element|null}|null} */
let drag = null;

function dragSourceFruit(source) {
  return source.type === 'slot' ? game.slots[source.index] : source.fruit;
}

function clearDropHighlights() {
  document.querySelectorAll('.logic-slot--drop-target').forEach(function (n) {
    n.classList.remove('logic-slot--drop-target');
  });
  const hand = document.getElementById('logic-hand');
  if (hand) hand.classList.remove('logic-hand--drop-target');
}

// Tear down every trace of a drag (ghost, highlights, listeners). Safe to
// call twice; also called from finishGame/stopLogicGame so a game ending
// mid-drag never strands a ghost on the page.
function endDrag() {
  window.removeEventListener('pointermove', handleDragMove);
  window.removeEventListener('pointerup', handleDragUp);
  window.removeEventListener('pointercancel', handleDragCancel);
  document.body.classList.remove('logic-dragging');
  if (drag) {
    if (drag.ghost && drag.ghost.parentNode) drag.ghost.parentNode.removeChild(drag.ghost);
    if (drag.originEl && drag.originEl.classList) {
      drag.originEl.classList.remove('logic-slot--drag-source', 'logic-token--drag-source');
    }
  }
  clearDropHighlights();
  drag = null;
}

function handleDragDown(event) {
  if (!game || !game.started || game.finished || drag) return;
  if (event.button != null && event.button !== 0) return;
  const target = event.target;
  if (!target || !target.closest || !target.closest('#screen-logic')) return;

  const slotEl = target.closest('.logic-slot--filled');
  const tokenEl = target.closest('.logic-token');
  let source = null;
  let originEl = null;
  if (slotEl && slotEl.dataset.slotIndex != null) {
    source = { type: 'slot', index: Number(slotEl.dataset.slotIndex) };
    originEl = slotEl;
  } else if (tokenEl && tokenEl.dataset.fruit) {
    source = { type: 'hand', fruit: tokenEl.dataset.fruit };
    originEl = tokenEl;
  }
  if (!source) return;

  drag = {
    pointerId: event.pointerId,
    source,
    originEl,
    startX: event.clientX,
    startY: event.clientY,
    active: false,
    ghost: null,
  };
  window.addEventListener('pointermove', handleDragMove, { passive: false });
  window.addEventListener('pointerup', handleDragUp);
  window.addEventListener('pointercancel', handleDragCancel);
}

// Threshold crossed — lift the fruit: dim the origin, spawn the ghost.
function beginActiveDrag() {
  drag.active = true;
  drag.originEl.classList.add(
    drag.source.type === 'slot' ? 'logic-slot--drag-source' : 'logic-token--drag-source');
  document.body.classList.add('logic-dragging');

  const fruit = fruitByKey(dragSourceFruit(drag.source));
  const rect = drag.originEl.getBoundingClientRect();
  const ghost = el('div', {
    class: 'logic-drag-ghost',
    attrs: { 'aria-hidden': 'true' },
    text: fruit.emoji,
  });
  ghost.style.width = rect.width + 'px';
  ghost.style.height = rect.height + 'px';
  document.body.appendChild(ghost);
  drag.ghost = ghost;
}

function moveGhost(x, y) {
  if (drag && drag.ghost) {
    drag.ghost.style.left = x + 'px';
    drag.ghost.style.top = y + 'px';
  }
}

// What is under the pointer right now? The ghost is pointer-events:none, so
// elementFromPoint sees straight through it.
function dropTargetAt(x, y) {
  const under = document.elementFromPoint(x, y);
  if (!under || !under.closest) return null;
  const slotEl = under.closest('.logic-slot');
  if (slotEl && slotEl.closest('#screen-logic') && slotEl.dataset.slotIndex != null) {
    return { type: 'slot', index: Number(slotEl.dataset.slotIndex), el: slotEl };
  }
  const handEl = under.closest('.logic-hand');
  if (handEl) return { type: 'hand', el: handEl };
  return null;
}

function handleDragMove(event) {
  if (!drag || event.pointerId !== drag.pointerId) return;
  if (!drag.active) {
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (dx * dx + dy * dy < DRAG_THRESHOLD_PX * DRAG_THRESHOLD_PX) return;
    if (!game || game.finished) { endDrag(); return; }
    beginActiveDrag();
  }
  event.preventDefault(); // this gesture is a drag, never a scroll
  moveGhost(event.clientX, event.clientY);

  clearDropHighlights();
  const target = dropTargetAt(event.clientX, event.clientY);
  if (!target) return;
  if (target.type === 'slot') {
    const isSource = drag.source.type === 'slot' && drag.source.index === target.index;
    if (!isSource) target.el.classList.add('logic-slot--drop-target');
  } else if (target.type === 'hand' && drag.source.type === 'slot') {
    target.el.classList.add('logic-hand--drop-target');
  }
}

function handleDragUp(event) {
  if (!drag || event.pointerId !== drag.pointerId) return;
  const wasActive = drag.active;
  const source = drag.source;
  const x = event.clientX;
  const y = event.clientY;
  endDrag();
  if (!wasActive) return; // below threshold: never lifted — nothing to drop

  if (!game || game.finished) return;
  const target = dropTargetAt(x, y);
  if (target && target.type === 'slot' && Number.isInteger(target.index)) {
    if (source.type === 'slot') {
      if (target.index !== source.index) {
        // The drag swap: exchange the two boxes' contents (target may be empty).
        const tmp = game.slots[source.index];
        game.slots[source.index] = game.slots[target.index];
        game.slots[target.index] = tmp;
      }
    } else if (remainingInHand(source.fruit) > 0) {
      // Hand -> box: place; any occupant returns to the hand implicitly.
      game.slots[target.index] = source.fruit;
    }
  } else if (target && target.type === 'hand' && source.type === 'slot') {
    game.slots[source.index] = null; // dragged back to the hand
  }
  paintBoard();
}

function handleDragCancel(event) {
  if (!drag || event.pointerId !== drag.pointerId) return;
  endDrag();
}

// ONE delegated listener on the document (added once), scoped to controls
// inside #screen-logic — same pattern app.js uses for its own screens.
function wireEvents() {
  if (eventsWired) return;
  eventsWired = true;
  document.addEventListener('pointerdown', handleDragDown);
  document.addEventListener('click', function (event) {
    const target = event.target;
    if (!target || !target.closest) return;
    if (!target.closest('#screen-logic')) return;

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
  endDrag(); // the clock can run out mid-drag — never strand a ghost
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
  endDrag();
  game = null;
}
