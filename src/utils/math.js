/** Clamp value between min and max */
export function clamp(val, min, max) {
  return Math.min(max, Math.max(min, val));
}

/** Linear interpolation */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/** Map a stat (0-100) to a multiplier around 1.0 with given range */
export function statMult(stat, range = 0.5) {
  return 1 + ((stat - 50) / 50) * range;
}
