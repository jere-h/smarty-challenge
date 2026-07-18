// sampler.js — deterministic paper generation for the Seeded PSLE Recall Challenge.
//
// generatePaper(seed, bank, topicBuckets) is the single source of "same seed =>
// byte-identical paper" on every phone. MT19937 (prng.js) is the ONLY randomness
// source: sampling draws and every tie-break come from it, in a fixed consumption
// order, so two devices that key the twister with the same 32-bit seed produce
// identical question IDs AND identical order.

import { makeMT19937 } from './prng.js';

// Group the bank's questions into per-topic pools, preserving bank order so the
// pool a bucket draws from is itself deterministic before any PRNG is consumed.
function buildTopicPools(questions) {
  const pools = new Map();
  for (const q of questions) {
    let pool = pools.get(q.topic);
    if (!pool) {
      pool = [];
      pools.set(q.topic, pool);
    }
    pool.push(q);
  }
  return pools;
}

// Difficulty ramp bands: a warm-up band, a middle band, and a hard band. The
// paper opens easy and ends hard. Within a band the exact difficulty (then a
// PRNG tie-break, then the question id) settles the finer ordering.
function rampBand(difficulty) {
  if (difficulty <= 2) return 0; // warm-up
  if (difficulty === 3) return 1; // middle
  return 2; // hard (4-5)
}

/**
 * generatePaper
 * @param {number} seed - a 32-bit-normalizable seed (validation.parseSeed already
 *   returns value >>> 0; normalized again here so the module is safe standalone).
 * @param {{schemaVersion:number, subject:string, questions:Array}} bank - parsed questions.json.
 * @param {Record<string, number>} topicBuckets - ordered topic -> count, summing to 20.
 * @returns {Array} the ordered Question[] — 20 distinct questions on a difficulty ramp.
 * @throws {Error} if any bucket asks for more questions than its topic pool holds,
 *   or if a bucket names a topic absent from the bank.
 */
export function generatePaper(seed, bank, topicBuckets) {
  if (!bank || !Array.isArray(bank.questions)) {
    throw new Error('generatePaper: bank must be a QuestionBank with a questions array');
  }
  if (!topicBuckets || typeof topicBuckets !== 'object') {
    throw new Error('generatePaper: topicBuckets must be a topic -> count map');
  }

  const pools = buildTopicPools(bank.questions);
  const bucketEntries = Object.entries(topicBuckets);

  // Assert up front (before drawing anything) that every bucket is fillable from
  // its topic pool. A hard error here is far better than a short or duplicate
  // paper appearing later.
  for (const [topic, rawCount] of bucketEntries) {
    const count = Number(rawCount);
    if (!Number.isInteger(count) || count < 0) {
      throw new Error(`generatePaper: bucket "${topic}" count must be a non-negative integer (got ${rawCount})`);
    }
    const pool = pools.get(topic);
    const poolSize = pool ? pool.length : 0;
    if (count > poolSize) {
      throw new Error(
        `generatePaper: bucket "${topic}" wants ${count} question(s) but its pool holds only ${poolSize}`
      );
    }
  }

  // The SOLE randomness source. Normalized to a 32-bit key so an unnormalized
  // caller still keys the twister identically to a normalized one.
  const rng = makeMT19937(seed >>> 0);

  // 1) Draw DISTINCT questions per bucket, WITHOUT replacement, in bucket order.
  //    A partial Fisher-Yates over a copy of the pool removes each drawn
  //    candidate from further consideration and consumes the PRNG deterministically.
  const picks = [];
  for (const [topic, rawCount] of bucketEntries) {
    const count = Number(rawCount);
    const pool = (pools.get(topic) || []).slice(); // copy: never mutate the bank
    for (let i = 0; i < count; i += 1) {
      const remaining = pool.length - i;
      const j = i + rng.nextInt(remaining); // index into the not-yet-drawn tail
      const tmp = pool[i];
      pool[i] = pool[j];
      pool[j] = tmp;
      picks.push(pool[i]);
    }
  }

  // 2) Assign each pick a PRNG-drawn tie-break, in collection order, so the
  //    tie-break stream is deterministic. This routes ALL residual ordering
  //    decisions through MT19937 rather than through the (unstable / engine-
  //    dependent) insertion order or a non-total comparator.
  const ordered = picks.map((q) => ({
    q,
    band: rampBand(q.difficulty),
    difficulty: q.difficulty,
    tiebreak: rng.next() >>> 0,
    id: q.id,
  }));

  // 3) Order on the difficulty ramp via a fully total composite key:
  //    (rampBand, difficulty, PRNG tiebreak, question-id). The id is unique in
  //    the bank, so the comparator is a strict total order — the result is
  //    identical regardless of the host's Array.prototype.sort stability.
  ordered.sort((a, b) => {
    if (a.band !== b.band) return a.band - b.band;
    if (a.difficulty !== b.difficulty) return a.difficulty - b.difficulty;
    if (a.tiebreak !== b.tiebreak) return a.tiebreak - b.tiebreak;
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
    return 0;
  });

  return ordered.map((entry) => entry.q);
}
