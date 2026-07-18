#!/usr/bin/env node
// tests/bank-validate.mjs
//
// Structural + semantic validator for questions.json (Batch E, TRD Section 6).
// Node-only, ESM, no dependencies. Imports the REAL checkRules.js so this
// validator exercises exactly the parsing/marking logic the app ships with —
// not a reimplementation that could drift from it.
//
// Checks:
//   - unique ids
//   - valid enum fields (type, check.rule, difficulty range, topic present)
//   - MCQ: options.length === 4 and answer is an in-range option index
//   - every check.accepted string parses via parseNumeric
//   - fraction-equivalent questions: all accepted entries mutually equivalent
//   - short-numeric: the canonical `answer` itself passes its own check rule
//   - bank-level: bankVersion === 2, >= 60 questions total, >= 10 per topic
//
// Exits non-zero (and prints every failure) on any violation; exits 0 and
// prints a summary on success. Not part of the app runtime — never precached
// (Invariant 3: docs/ and tests/ are never precached).

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { parseNumeric, checkAnswer, isEquivalentFraction } from '../checkRules.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BANK_PATH = join(__dirname, '..', 'questions.json');

const VALID_TYPES = new Set(['mcq', 'short-numeric']);
const VALID_RULES = new Set(['exact', 'tolerance', 'fraction-equivalent']);
const MIN_TOTAL = 60;
const MIN_PER_TOPIC = 10;
const EXPECTED_BANK_VERSION = 2;

const errors = [];

function fail(qid, message) {
  errors.push(qid ? `[${qid}] ${message}` : message);
}

function isPlainObject(v) {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

let raw;
try {
  raw = readFileSync(BANK_PATH, 'utf8');
} catch (err) {
  console.error(`Could not read questions.json at ${BANK_PATH}: ${err.message}`);
  process.exit(1);
}

let bank;
try {
  bank = JSON.parse(raw);
} catch (err) {
  console.error(`questions.json is not valid JSON: ${err.message}`);
  process.exit(1);
}

if (!isPlainObject(bank) || !Array.isArray(bank.questions)) {
  console.error('questions.json must be an object with a `questions` array.');
  process.exit(1);
}

// --- bank-level checks -------------------------------------------------

if (bank.bankVersion !== EXPECTED_BANK_VERSION) {
  fail(null, `bankVersion must be ${EXPECTED_BANK_VERSION}, got ${JSON.stringify(bank.bankVersion)}`);
}

if (bank.questions.length < MIN_TOTAL) {
  fail(null, `bank must have >= ${MIN_TOTAL} questions, got ${bank.questions.length}`);
}

// --- per-question checks ------------------------------------------------

const seenIds = new Set();
const perTopicCount = new Map();
const ID_PATTERN = /^pm-[a-z]+-\d{2}$/;

for (const q of bank.questions) {
  const qid = q && typeof q.id === 'string' ? q.id : '(missing id)';

  if (!q || typeof q !== 'object') {
    fail(qid, 'question entry is not an object');
    continue;
  }

  // id: present, pattern, unique
  if (typeof q.id !== 'string' || !ID_PATTERN.test(q.id)) {
    fail(qid, `id must match /${ID_PATTERN.source}/, got ${JSON.stringify(q.id)}`);
  } else if (seenIds.has(q.id)) {
    fail(qid, 'duplicate id');
  } else {
    seenIds.add(q.id);
  }

  // topic
  if (typeof q.topic !== 'string' || q.topic.trim() === '') {
    fail(qid, 'topic must be a non-empty string');
  } else {
    perTopicCount.set(q.topic, (perTopicCount.get(q.topic) || 0) + 1);
  }

  // difficulty
  if (!Number.isInteger(q.difficulty) || q.difficulty < 1 || q.difficulty > 5) {
    fail(qid, `difficulty must be an integer 1-5, got ${JSON.stringify(q.difficulty)}`);
  }

  // type
  if (!VALID_TYPES.has(q.type)) {
    fail(qid, `type must be one of ${[...VALID_TYPES].join('|')}, got ${JSON.stringify(q.type)}`);
  }

  // prompt
  if (typeof q.prompt !== 'string' || q.prompt.trim() === '') {
    fail(qid, 'prompt must be a non-empty string');
  }

  // check block
  const check = q.check;
  if (!isPlainObject(check)) {
    fail(qid, 'check must be an object');
  } else {
    if (!VALID_RULES.has(check.rule)) {
      fail(qid, `check.rule must be one of ${[...VALID_RULES].join('|')}, got ${JSON.stringify(check.rule)}`);
    }
    if (check.accepted !== undefined && !Array.isArray(check.accepted)) {
      fail(qid, 'check.accepted must be an array when present');
    }
    if (check.rule === 'tolerance' && !(typeof check.tolerance === 'number' && check.tolerance >= 0)) {
      fail(qid, 'check.rule "tolerance" requires a non-negative numeric check.tolerance');
    }

    // Every accepted string must parse via the canonical parser.
    const accepted = Array.isArray(check.accepted) ? check.accepted : [];
    for (const a of accepted) {
      const parsed = parseNumeric(a);
      if ('error' in parsed) {
        fail(qid, `check.accepted entry ${JSON.stringify(a)} does not parse via parseNumeric`);
      }
    }

    // fraction-equivalent: every accepted entry must be mutually equivalent.
    if (check.rule === 'fraction-equivalent' && accepted.length > 1) {
      const [first, ...rest] = accepted;
      for (const other of rest) {
        if (!isEquivalentFraction(first, other)) {
          fail(qid, `check.accepted entries are not mutually equivalent: ${JSON.stringify(first)} vs ${JSON.stringify(other)}`);
        }
      }
    }
  }

  // type-specific checks
  if (q.type === 'mcq') {
    if (!Array.isArray(q.options) || q.options.length !== 4) {
      fail(qid, `mcq options must be an array of length 4, got ${Array.isArray(q.options) ? q.options.length : typeof q.options}`);
    }
    if (!Number.isInteger(q.answer) || q.answer < 0 || (Array.isArray(q.options) && q.answer >= q.options.length)) {
      fail(qid, `mcq answer must be an in-range option index, got ${JSON.stringify(q.answer)}`);
    }
  } else if (q.type === 'short-numeric') {
    if (q.answer === null || q.answer === undefined || q.answer === '') {
      fail(qid, 'short-numeric answer must be present');
    } else if (isPlainObject(check)) {
      // The canonical answer, run through the question's OWN check rule as the
      // "given" value, must itself be marked correct — i.e. a perfect student
      // typing exactly the canonical answer always scores the point.
      const ok = checkAnswer(q, String(q.answer));
      if (!ok) {
        fail(qid, `canonical answer ${JSON.stringify(q.answer)} does NOT pass its own check rule (${check.rule})`);
      }
    }
  }
}

// --- per-topic minimum ---------------------------------------------------

for (const [topic, count] of perTopicCount) {
  if (count < MIN_PER_TOPIC) {
    fail(null, `topic "${topic}" has only ${count} question(s), needs >= ${MIN_PER_TOPIC}`);
  }
}

// --- report ---------------------------------------------------------------

if (errors.length > 0) {
  console.error(`bank-validate: ${errors.length} problem(s) found in questions.json:\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

const topicSummary = [...perTopicCount.entries()]
  .map(([t, c]) => `${t}: ${c}`)
  .join(', ');

console.log(
  `bank-validate: OK — ${bank.questions.length} questions, bankVersion ${bank.bankVersion} (${topicSummary})`
);
process.exit(0);
