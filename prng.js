// prng.js
// Vendored, self-contained MT19937 Mersenne-Twister.
//
// This module is the SINGLE source of determinism for the whole app. Given the
// same 32-bit seed it produces a byte-identical stream of unsigned 32-bit
// integers on every device — iOS Safari, Android Chrome, desktop — because it
// operates entirely in 32-bit integer space using unsigned shifts (>>> 0) and
// Math.imul, never touching floating point or Math.random during generation.
//
// Reference: Matsumoto & Nishimura's MT19937 (1998). This is a clean-room
// integer-exact reimplementation; the tempering, twist, and seeding constants
// are the standard published ones.
//
// Public interface (pinned by the shared contract):
//   makeMT19937(seedUint32) -> { next() -> uint32, nextInt(bound) -> int in [0, bound) }
//
// No external imports, no globals, same-origin ES module so it works fully
// offline once the service worker has cached the shell.

// --- MT19937 constants -------------------------------------------------------
const N = 624;
const M = 397;
const MATRIX_A = 0x9908b0df; // constant vector a
const UPPER_MASK = 0x80000000; // most significant w-r bits
const LOWER_MASK = 0x7fffffff; // least significant r bits

/**
 * Create a MT19937 generator seeded with a 32-bit unsigned integer.
 *
 * @param {number} seedUint32 - the seed. It is normalized to an unsigned 32-bit
 *   value with `>>> 0`, so callers may pass any integer and still key the
 *   generator identically across devices for the same spoken number.
 * @returns {{ next: () => number, nextInt: (bound: number) => number }}
 */
export function makeMT19937(seedUint32) {
  // State vector. Int-typed array keeps every element in exact 32-bit space.
  const mt = new Uint32Array(N);
  let mti = N + 1; // mti === N + 1 means mt[] is not initialized

  /**
   * Seed the generator. Follows Knuth's / the reference init_genrand:
   *   mt[i] = 1812433253 * (mt[i-1] ^ (mt[i-1] >> 30)) + i
   * computed in 32-bit unsigned arithmetic via Math.imul.
   *
   * @param {number} s - seed value; normalized with `>>> 0`.
   */
  function seed(s) {
    mt[0] = s >>> 0;
    for (mti = 1; mti < N; mti++) {
      const prev = mt[mti - 1] ^ (mt[mti - 1] >>> 30);
      // 1812433253 * prev + mti, kept exact in 32 bits.
      mt[mti] = (Math.imul(1812433253, prev) + mti) >>> 0;
    }
  }

  /**
   * Generate the next unsigned 32-bit integer in the sequence.
   * @returns {number} an integer in [0, 2^32).
   */
  function next() {
    let y;

    if (mti >= N) {
      // Generate N words at one time (the twist).
      let kk;

      // Guard: if seed() was never called, seed with the default 5489 as the
      // reference implementation does. In practice seed() runs in the
      // constructor below, so this path is defensive only.
      if (mti === N + 1) {
        seed(5489);
      }

      for (kk = 0; kk < N - M; kk++) {
        y = (mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK);
        mt[kk] = (mt[kk + M] ^ (y >>> 1) ^ (y & 0x1 ? MATRIX_A : 0)) >>> 0;
      }
      for (; kk < N - 1; kk++) {
        y = (mt[kk] & UPPER_MASK) | (mt[kk + 1] & LOWER_MASK);
        mt[kk] = (mt[kk + (M - N)] ^ (y >>> 1) ^ (y & 0x1 ? MATRIX_A : 0)) >>> 0;
      }
      y = (mt[N - 1] & UPPER_MASK) | (mt[0] & LOWER_MASK);
      mt[N - 1] = (mt[M - 1] ^ (y >>> 1) ^ (y & 0x1 ? MATRIX_A : 0)) >>> 0;

      mti = 0;
    }

    y = mt[mti++];

    // Tempering.
    y ^= y >>> 11;
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= y >>> 18;

    return y >>> 0;
  }

  /**
   * Return an integer uniformly in [0, bound) using rejection sampling so the
   * distribution is unbiased and identical across engines. For bound <= 0 the
   * result is 0 (defensive; callers pass positive bounds).
   *
   * Rejection sampling avoids the modulo bias that a plain `next() % bound`
   * would introduce, and uses only integer ops so every device rejects and
   * redraws at exactly the same points — preserving cross-device determinism.
   *
   * @param {number} bound - exclusive upper bound (positive integer).
   * @returns {number} an integer in [0, bound).
   */
  function nextInt(bound) {
    const b = Math.floor(bound);
    if (b <= 1) {
      // For bound <= 1 the only valid value is 0; still consume no special
      // path so behavior stays predictable. Draw nothing extra.
      return 0;
    }

    // Largest multiple of b that fits in 2^32, i.e. the rejection threshold.
    // 2^32 = 4294967296. limit = floor(2^32 / b) * b.
    const limit = Math.floor(4294967296 / b) * b;

    let r;
    do {
      r = next();
    } while (r >= limit);

    return r % b;
  }

  // Seed immediately so the returned generator is ready to draw.
  seed(seedUint32);

  return { next, nextInt };
}
