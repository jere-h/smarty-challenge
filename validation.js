// validation.js
//
// Seed parsing and 32-bit key normalization for the Smarty
// Challenge. This is the single boundary between the spoken/typed seed and the
// MT19937 PRNG: friends agree on a number aloud, type it in, and every device
// must derive the SAME uint32 key so the sampled paper is byte-identical.
//
// Engine-independent on purpose: this module knows nothing about the PRNG,
// the sampler, or the DOM. It only turns raw string input into either a clean
// 32-bit seed or a short, user-facing error string. app.js writes the error
// into #seed-error and never starts a paper when an error is returned.
//
// Contract:
//   export function parseSeed(raw: string) -> { seed: number } | { error: string }
//   - trims surrounding whitespace
//   - rejects blank, non-integer, and negative input with an inline message
//   - normalizes an accepted non-negative integer to a 32-bit key via (v >>> 0)

// Accept an OPTIONAL leading '+' followed by one or more ASCII digits, with no
// decimal point, exponent, or other characters. We deliberately do NOT use
// parseInt/Number here for the accept/reject decision, because both silently
// swallow trailing garbage ("12abc" -> 12, "1e3" -> 1000, "0x10" -> 16) and
// would let two people typing different strings key the same paper by accident.
const INTEGER_PATTERN = /^\+?\d+$/;

// A leading '-' followed by digits: a real, well-formed negative integer. We
// single this out so we can give a specific "must not be negative" message
// instead of the generic "whole number" one.
const NEGATIVE_INTEGER_PATTERN = /^-\d+$/;

// 2^32. An integer key lives in [0, 2^32). Very large typed numbers (beyond
// what a 32-bit value or even a JS safe integer can hold) are folded into that
// range deterministically so the same typed string always yields the same key.
const TWO_POW_32 = 4294967296;

/**
 * Parse and normalize a raw seed string into a 32-bit MT19937 key.
 *
 * @param {string} raw - the seed exactly as the user typed it.
 * @returns {{seed: number} | {error: string}}
 *   On success, `seed` is an integer in [0, 2^32). On failure, `error` is a
 *   short, user-facing message suitable for the #seed-error live region.
 */
export function parseSeed(raw) {
  // Guard non-string / missing input without throwing. app.js reads from an
  // <input>.value (always a string), but keeping this total makes the function
  // safe to unit-test at its boundaries and safe against odd call sites.
  if (raw === null || raw === undefined) {
    return { error: 'Enter a game number to start.' };
  }

  const value = String(raw).trim();

  if (value === '') {
    return { error: 'Enter a game number to start.' };
  }

  // Give negatives their own message: a well-formed negative integer is a
  // different mistake from typing letters, and a clearer hint helps two friends
  // reconcile the number they agreed on aloud.
  if (NEGATIVE_INTEGER_PATTERN.test(value)) {
    return { error: 'The game number must be a whole number that is 0 or greater.' };
  }

  if (!INTEGER_PATTERN.test(value)) {
    return { error: 'The game number must be made of digits only.' };
  }

  // At this point the string is [+]digits. Normalize into the 32-bit key space.
  //
  // For values that fit in a safe integer we use (v >>> 0), the canonical
  // unsigned-32 fold, so this matches the exact operation the sampler/PRNG
  // expect. For values beyond Number.MAX_SAFE_INTEGER, floating-point precision
  // would make (v >>> 0) non-deterministic across the last bits, so we fold the
  // DIGIT STRING modulo 2^32 by hand (Horner's method), which stays exact and
  // identical on every device for the same typed characters.
  const numeric = Number(value);
  let key;
  if (Number.isSafeInteger(numeric)) {
    // >>> 0 coerces to an unsigned 32-bit integer: exactly the MT19937 key.
    key = numeric >>> 0;
  } else {
    key = foldDigitsMod2Pow32(value);
  }

  return { seed: key };
}

/**
 * Fold a (optionally '+'-prefixed) decimal digit string modulo 2^32 without
 * ever holding the full value as a float. Horner's method on each digit keeps
 * the running total inside the safe-integer range (max intermediate is
 * ~(2^32 - 1) * 10 + 9, well under 2^53), so the result is bit-exact and
 * portable across iOS Safari and Android Chrome.
 *
 * @param {string} digits - a string matching /^\+?\d+$/.
 * @returns {number} integer in [0, 2^32).
 */
function foldDigitsMod2Pow32(digits) {
  let acc = 0;
  for (let i = 0; i < digits.length; i++) {
    const ch = digits.charCodeAt(i);
    if (ch === 43) {
      // '+' — only ever the leading character per the accept pattern; skip it.
      continue;
    }
    const digit = ch - 48; // '0' is char code 48.
    acc = (acc * 10 + digit) % TWO_POW_32;
  }
  // acc is already a non-negative integer < 2^32; >>> 0 keeps it a clean uint32.
  return acc >>> 0;
}
