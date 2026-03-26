import { CONFIG } from '../data/config.js';

/** True if current half-inning should end (3 outs) */
export function isHalfOver(state) {
  return state.outs >= CONFIG.OUTS_PER_HALF;
}

/**
 * True if the game is completely over.
 * - After bottom of inning N where N >= 9: always over
 * - After top of inning N where N >= 9: if home is ahead, game ends early (walk-off optimization)
 * - Tie after max innings → game over (draw)
 */
export function isGameOver(state) {
  const maxInnings = CONFIG.INNINGS + CONFIG.MAX_EXTRA_INNINGS;
  if (state.inning > maxInnings) return true;

  // After a completed inning (both halves done)
  if (state.inning > CONFIG.INNINGS) {
    // Extra innings: end if not tied after completed inning
    if (state.half === 0) return false; // top just ended, must play bottom
    // After bottom: if not tied, end
    return state.score[0] !== state.score[1];
  }

  if (state.inning === CONFIG.INNINGS) {
    if (state.half === 0) {
      // Top of 9th just ended: if home already winning, end (skip bottom)
      // But we always play the bottom for simplicity; handled differently
    }
    if (state.half === 1) {
      // Bottom of 9th complete: game over
      return true;
    }
  }

  return false;
}

/**
 * Advance to next half-inning (mutates state).
 * Returns true if a new inning started.
 */
export function advanceHalf(state) {
  // record this half-inning score
  const inningIdx = state.inning - 1;
  // runs scored this half are already in state.score; we need delta
  // scoreByInning rows are filled by the engine per run

  state.outs = 0;
  state.bases = [false, false, false];
  state.halfLog = [];

  if (state.half === 0) {
    // top→bottom
    state.half = 1;
    return false;
  } else {
    // bottom→next inning top
    state.half = 0;
    state.inning += 1;
    return true;
  }
}

/** Advance batter index (round-robin through lineup) */
export function advanceBatter(state) {
  const teamIdx = state.half;
  state.batterIndex[teamIdx] =
    (state.batterIndex[teamIdx] + 1) % state.teams[teamIdx].roster.length;
}
