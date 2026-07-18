// marker.js — auto-marks a generated paper entirely on-device.
//
// mark(paper, answers, elapsedMs) applies each question's check rule via
// checkRules.checkAnswer, treats a blank/unanswered response as incorrect (0)
// without ever throwing, and returns a Result whose shape matches the shared
// contract:
//
//   Result {
//     total:       int,
//     maxTotal:    20,
//     perTopic:    Record<string, { correct:int, total:int }>,
//     perQuestion: boolean[]   // in paper order
//     elapsedMs:   int
//   }
//
// No answers, prompts, or scores leave the device — this is pure in-memory
// computation with no network, storage, or logging side effects.

import { checkAnswer } from './checkRules.js';

// The paper is always exactly 20 questions per the sampler contract; maxTotal is
// pinned so the results screen and share summary agree even on a short paper.
const MAX_TOTAL = 20;

// Pull the answer a player gave for a question out of the answers map without
// assuming any particular key is present. Missing, null, or whitespace-only
// entries all collapse to `null` so checkAnswer sees a clean "unanswered".
function readAnswer(answers, questionId) {
  if (!answers || typeof answers !== 'object') return null;
  if (!Object.prototype.hasOwnProperty.call(answers, questionId)) return null;

  const given = answers[questionId];
  if (given === null || given === undefined) return null;

  // Short-numeric answers arrive as strings; a blank string is unanswered.
  if (typeof given === 'string' && given.trim() === '') return null;

  return given;
}

// Grade one question defensively: any unexpected shape in the question or the
// answer is scored as incorrect rather than allowed to crash the whole paper.
function gradeOne(question, given) {
  if (!question || typeof question !== 'object') return false;
  if (given === null) return false;

  try {
    return checkAnswer(question, given) === true;
  } catch (err) {
    // A malformed check rule or answer must not abort marking — treat it as a
    // miss and keep going so the player still gets a full result.
    return false;
  }
}

export function mark(paper, answers, elapsedMs) {
  const questions = Array.isArray(paper) ? paper : [];

  const perQuestion = [];
  const perTopic = {};
  let total = 0;

  for (const question of questions) {
    const topic = question && typeof question.topic === 'string' ? question.topic : 'Other';

    if (!perTopic[topic]) {
      perTopic[topic] = { correct: 0, total: 0 };
    }
    perTopic[topic].total += 1;

    const given = readAnswer(answers, question && question.id);
    const isCorrect = gradeOne(question, given);

    perQuestion.push(isCorrect);
    if (isCorrect) {
      total += 1;
      perTopic[topic].correct += 1;
    }
  }

  // Normalize elapsed time to a non-negative integer of milliseconds so the
  // comparison/tie-break field is always well-formed for the share summary.
  const rawElapsed = Number(elapsedMs);
  const safeElapsed = Number.isFinite(rawElapsed) && rawElapsed > 0 ? Math.round(rawElapsed) : 0;

  return {
    total,
    maxTotal: MAX_TOTAL,
    perTopic,
    perQuestion,
    elapsedMs: safeElapsed,
  };
}
