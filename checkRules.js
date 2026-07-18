// checkRules.js
// Pure, unit-testable answer-checking predicates for the Smarty
// Challenge, plus the ONE canonical short-numeric parser every other module
// routes through. No DOM, no I/O, no randomness. Imported by marker.js.
//
// Data contract (see the shared <contract>):
//   Question { id, topic, difficulty, type:'mcq'|'short-numeric',
//              prompt, options?, answer, check }
//   Check    { rule:'exact'|'tolerance'|'fraction-equivalent',
//              tolerance?, accepted?:string[] }
//
// The parser accepts, after trimming and unicode normalization:
//   - plain decimals with a dot OR comma separator ('0.75', '0,75')
//   - simple fractions ('3/4', '6/8')
//   - mixed numbers ('1 1/2', '1½')
//   - single unicode vulgar-fraction glyphs ('½', '¾', '⅓', ...)
// Anything else (letters, empty, multiple separators, division by zero, ...)
// resolves to { error } and is treated as a wrong answer by the marker.

// --- unicode vulgar-fraction glyph table --------------------------------
// Maps a single glyph to its [numerator, denominator]. Kept explicit so the
// parser is deterministic and identical across engines/platforms.
const FRACTION_GLYPHS = {
  '¼': [1, 4],   // ¼
  '½': [1, 2],   // ½
  '¾': [3, 4],   // ¾
  '⅐': [1, 7],   // ⅐
  '⅑': [1, 9],   // ⅑
  '⅒': [1, 10],  // ⅒
  '⅓': [1, 3],   // ⅓
  '⅔': [2, 3],   // ⅔
  '⅕': [1, 5],   // ⅕
  '⅖': [2, 5],   // ⅖
  '⅗': [3, 5],   // ⅗
  '⅘': [4, 5],   // ⅘
  '⅙': [1, 6],   // ⅙
  '⅚': [5, 6],   // ⅚
  '⅛': [1, 8],   // ⅛
  '⅜': [3, 8],   // ⅜
  '⅝': [5, 8],   // ⅝
  '⅞': [7, 8],   // ⅞
};

// The unicode fraction-slash (U+2044) is normalized to an ASCII '/'.
const FRACTION_SLASH = '⁄';

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

// Reduce a [num, den] pair to lowest terms with a positive denominator.
function reduceFraction(num, den) {
  if (den < 0) {
    num = -num;
    den = -den;
  }
  const g = gcd(num, den);
  return [num / g, den / g];
}

// Expand any leading unicode vulgar-fraction glyphs into ' n/d ' so the
// downstream tokenizer only ever sees ASCII. Also normalizes the unicode
// fraction slash. Returns a plain ASCII string.
function normalizeGlyphs(str) {
  let out = '';
  for (const ch of str) {
    if (Object.prototype.hasOwnProperty.call(FRACTION_GLYPHS, ch)) {
      const [n, d] = FRACTION_GLYPHS[ch];
      // pad with spaces so '1½' becomes '1 1/2' (a mixed number)
      out += ` ${n}/${d} `;
    } else if (ch === FRACTION_SLASH) {
      out += '/';
    } else {
      out += ch;
    }
  }
  return out;
}

// Parse a plain decimal token that may use a dot OR a comma as its separator.
// Rejects thousands-style multi-separator strings and non-numeric junk.
// Returns a finite number or null.
function parseDecimalToken(token) {
  if (!token) return null;
  // allow a single leading sign
  const signMatch = /^[+-]?/.exec(token);
  const sign = token[0] === '-' ? -1 : 1;
  let body = token.slice(signMatch[0].length);
  if (body === '') return null;

  // exactly one comma OR one dot may act as the decimal separator
  const commas = (body.match(/,/g) || []).length;
  const dots = (body.match(/\./g) || []).length;
  if (commas + dots > 1) return null;
  if (commas === 1) body = body.replace(',', '.');

  // only digits and at most one dot remain
  if (!/^\d*\.?\d*$/.test(body) || !/\d/.test(body)) return null;

  const value = sign * Number(body);
  return Number.isFinite(value) ? value : null;
}

/**
 * The ONE canonical short-numeric parser.
 * @param {string} raw
 * @returns {{value:number}|{fraction:[number,number]}|{error:string}}
 */
export function parseNumeric(raw) {
  if (raw === null || raw === undefined) {
    return { error: 'empty' };
  }
  let s = String(raw).trim();
  if (s === '') return { error: 'empty' };

  // normalize unicode glyphs + fraction slash to ASCII, collapse whitespace
  s = normalizeGlyphs(s).replace(/\s+/g, ' ').trim();
  if (s === '') return { error: 'empty' };

  const parts = s.split(' ');

  // mixed number: 'W n/d'  (e.g. '1 1/2')
  if (parts.length === 2 && parts[1].includes('/')) {
    const whole = parseDecimalToken(parts[0]);
    if (whole === null || !Number.isInteger(whole)) return { error: 'invalid' };
    const frac = parseFractionToken(parts[1]);
    if (!frac) return { error: 'invalid' };
    const sign = whole < 0 ? -1 : 1;
    const num = Math.abs(whole) * frac[1] + frac[0];
    return { fraction: reduceFraction(sign * num, frac[1]) };
  }

  if (parts.length !== 1) return { error: 'invalid' };
  const token = parts[0];

  // simple fraction: 'n/d'
  if (token.includes('/')) {
    const frac = parseFractionToken(token);
    if (!frac) return { error: 'invalid' };
    return { fraction: reduceFraction(frac[0], frac[1]) };
  }

  // plain decimal / integer
  const value = parseDecimalToken(token);
  if (value === null) return { error: 'invalid' };
  return { value };
}

// Parse a bare 'n/d' token into a reduced-free [num, den], or null.
// Denominator must be non-zero; both parts are integers.
function parseFractionToken(token) {
  const bits = token.split('/');
  if (bits.length !== 2) return null;
  const num = parseDecimalToken(bits[0]);
  const den = parseDecimalToken(bits[1]);
  if (num === null || den === null) return null;
  if (!Number.isInteger(num) || !Number.isInteger(den)) return null;
  if (den === 0) return null;
  return [num, den];
}

// Coerce any parseNumeric result into a real number for comparison, or null
// if the input did not parse.
function toNumber(parsed) {
  if (!parsed) return null;
  if (typeof parsed.value === 'number') return parsed.value;
  if (parsed.fraction) return parsed.fraction[0] / parsed.fraction[1];
  return null;
}

// --- pure predicates ----------------------------------------------------

// exactMatch: string-equal after trim + case-fold; used for MCQ option text
// and exact short answers where formatting must match.
export function exactMatch(given, expected) {
  if (given === null || given === undefined) return false;
  if (expected === null || expected === undefined) return false;
  return normalizeText(String(given)) === normalizeText(String(expected));
}

function normalizeText(str) {
  return str.trim().replace(/\s+/g, ' ').toLowerCase();
}

// withinTolerance: numeric equality within an absolute tolerance. Both sides
// go through the canonical parser so '0,75' and '3/4' compare equal to 0.75.
export function withinTolerance(given, expected, tolerance) {
  const g = toNumber(parseNumeric(given));
  const e = toNumber(parseNumeric(expected));
  if (g === null || e === null) return false;
  const tol = typeof tolerance === 'number' && tolerance >= 0 ? tolerance : 0;
  return Math.abs(g - e) <= tol + 1e-9;
}

// isEquivalentFraction: two inputs name the same rational value. '3/4','6/8'
// and '0.75' are all equivalent. Falls back to numeric closeness so decimal
// forms of a fraction still match.
export function isEquivalentFraction(given, expected) {
  const g = parseNumeric(given);
  const e = parseNumeric(expected);
  const gError = 'error' in g;
  const eError = 'error' in e;
  if (gError || eError) return false;

  if (g.fraction && e.fraction) {
    const [gn, gd] = reduceFraction(g.fraction[0], g.fraction[1]);
    const [en, ed] = reduceFraction(e.fraction[0], e.fraction[1]);
    return gn === en && gd === ed;
  }
  // mixed decimal/fraction comparison via value
  const gv = toNumber(g);
  const ev = toNumber(e);
  if (gv === null || ev === null) return false;
  return Math.abs(gv - ev) <= 1e-9;
}

// acceptedEquivalent: true when `given` matches ANY string in the enumerated
// accepted set, using fraction-equivalence so listed forms like
// ['3/4','6/8','0.75'] all pass.
export function acceptedEquivalent(given, accepted) {
  if (!Array.isArray(accepted) || accepted.length === 0) return false;
  return accepted.some((a) => isEquivalentFraction(given, a) || exactMatch(given, a));
}

// --- dispatch -----------------------------------------------------------

/**
 * checkAnswer — the single entry point marker.js calls per question.
 * Blank / unanswered (null, undefined, '') is always incorrect and never
 * throws.
 * @param {object} question
 * @param {string|number|null} given
 * @returns {boolean}
 */
export function checkAnswer(question, given) {
  if (!question || !question.check) return false;
  if (given === null || given === undefined) return false;

  const check = question.check;

  // MCQ: `given` is the selected option index (as string or number); the
  // canonical answer is the correct option index. Compare as integers.
  if (question.type === 'mcq') {
    const gi = Number(given);
    const ai = Number(question.answer);
    if (!Number.isFinite(gi) || !Number.isFinite(ai)) return false;
    return gi === ai;
  }

  const givenStr = String(given).trim();
  if (givenStr === '') return false;

  const accepted = Array.isArray(check.accepted) ? check.accepted : [];
  const canonical =
    question.answer !== null && question.answer !== undefined
      ? String(question.answer)
      : null;

  switch (check.rule) {
    case 'tolerance': {
      // any accepted value within tolerance, else the canonical answer
      const candidates = accepted.length ? accepted : (canonical ? [canonical] : []);
      return candidates.some((c) => withinTolerance(givenStr, c, check.tolerance));
    }
    case 'fraction-equivalent': {
      if (acceptedEquivalent(givenStr, accepted)) return true;
      return canonical !== null && isEquivalentFraction(givenStr, canonical);
    }
    case 'exact':
    default: {
      // exact string match against the accepted set (or canonical answer)
      if (accepted.length) {
        return accepted.some((c) => exactMatch(givenStr, c));
      }
      return canonical !== null && exactMatch(givenStr, canonical);
    }
  }
}
