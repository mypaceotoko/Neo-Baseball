/** Random integer inclusive [min, max] */
export function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Random float [0, 1) */
export function randFloat() {
  return Math.random();
}

/** Pick a random element from an array */
export function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Shuffle array in place (Fisher-Yates) */
export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Weighted random choice.
 * @param {Record<string, number>} weights - key → weight mapping
 * @returns {string} chosen key
 */
export function weightedChoice(weights) {
  const keys = Object.keys(weights);
  const total = keys.reduce((s, k) => s + weights[k], 0);
  let r = Math.random() * total;
  for (const k of keys) {
    r -= weights[k];
    if (r <= 0) return k;
  }
  return keys[keys.length - 1];
}
