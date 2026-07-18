// share.js — spoiler-free share summary + WhatsApp/Telegram/clipboard intents.
//
// Everything here is deliberately spoiler-free: the summary carries only the
// seed, the score, the elapsed time, and a Wordle-style correct/incorrect grid.
// It never contains a question prompt, an option, or an answer, so a friend who
// has not yet played the same seed can read it without being spoiled. Tests
// assert that no paper prompt string ever appears in buildSummary output.

const CORRECT = '\u{1F7E9}';   // green square
const INCORRECT = '\u{1F7E5}'; // red square
const GRID_COLUMNS = 5;

// Format a millisecond duration as m:ss (mono-friendly, no locale strings).
function formatElapsed(elapsedMs) {
  const totalSeconds = Math.max(0, Math.round((elapsedMs || 0) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

// Build the emoji grid from the boolean per-question array, wrapped into rows.
function buildGrid(perQuestion) {
  const cells = (perQuestion || []).map((ok) => (ok ? CORRECT : INCORRECT));
  const rows = [];
  for (let i = 0; i < cells.length; i += GRID_COLUMNS) {
    rows.push(cells.slice(i, i + GRID_COLUMNS).join(''));
  }
  return rows.join('\n');
}

// buildSummary(seed, result, bankVersion) -> string
// Spoiler-free: seed, score, time, and correctness grid only. No prompts,
// no options, no answers ever enter this string. `bankVersion` is OPTIONAL
// (defaults to 1) so a mismatched-bank device can be spotted before two
// phones compare scores (A6) — it never carries any answer/prompt data.
export function buildSummary(seed, result, bankVersion) {
  const total = result && typeof result.total === 'number' ? result.total : 0;
  const maxTotal = result && typeof result.maxTotal === 'number' ? result.maxTotal : 20;
  const elapsed = formatElapsed(result ? result.elapsedMs : 0);
  const grid = buildGrid(result ? result.perQuestion : []);
  const bank = bankVersion != null ? bankVersion : 1;

  const lines = [
    'Smarty Challenge',
    `Seed ${seed} · bank v${bank}`,
    `Score ${total}/${maxTotal}  Time ${elapsed}`,
    '',
    grid,
    '',
    'Same seed, same paper. Beat my time.',
  ];
  return lines.join('\n');
}

// Open an intent URL in a new tab/window without ever navigating this app away
// (keeps the results screen intact behind the share sheet).
function openIntent(url) {
  try {
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (win) {
      win.opener = null;
    } else {
      // Popup blocked: fall back to a same-tab navigation so the share still works.
      window.location.href = url;
    }
  } catch (err) {
    try {
      window.location.href = url;
    } catch (_ignored) {
      /* nothing more we can safely do */
    }
  }
}

// shareWhatsApp(text) -> void — https://wa.me/?text=<encoded>
export function shareWhatsApp(text) {
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  openIntent(url);
}

// shareTelegram(text) -> void — https://t.me/share/url?url=&text=<encoded>
export function shareTelegram(text) {
  // Telegram's share endpoint wants a url param; we have no canonical link to
  // share, so we send the summary as text and leave url empty.
  const url = `https://t.me/share/url?url=${encodeURIComponent('')}&text=${encodeURIComponent(text)}`;
  openIntent(url);
}

// Last-resort copy using a hidden textarea + execCommand. Returns whether it
// reported success; never throws.
function legacyCopy(text) {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    // Keep it out of the layout and unfocusable to the eye, but selectable.
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);

    const selection = document.getSelection();
    const savedRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

    textarea.select();
    textarea.setSelectionRange(0, text.length);

    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (_ignored) {
      ok = false;
    }

    document.body.removeChild(textarea);

    // Restore any prior selection so we do not disturb the page.
    if (savedRange && selection) {
      selection.removeAllRanges();
      selection.addRange(savedRange);
    }
    return ok;
  } catch (_err) {
    return false;
  }
}

// copyToClipboard(text) -> Promise<boolean>
// Prefers navigator.clipboard; falls back to execCommand. Resolves to whether
// the copy is believed to have succeeded, and never rejects / never surfaces a
// visible error to the user.
export function copyToClipboard(text) {
  const value = String(text == null ? '' : text);

  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    return navigator.clipboard.writeText(value).then(
      () => true,
      () => legacyCopy(value),
    );
  }

  return Promise.resolve(legacyCopy(value));
}
