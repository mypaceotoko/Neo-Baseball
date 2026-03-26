import { CONFIG } from '../data/config.js';

/**
 * Create and return a fresh game state object.
 * teams[0] = away, teams[1] = home
 */
export function createGameState(teams) {
  return {
    phase: 'game',           // 'game' | 'halfOver' | 'over'
    teams,                   // [awayTeam, homeTeam]
    inning: 1,               // 1-based
    half: 0,                 // 0 = top (away bats), 1 = bottom (home bats)
    outs: 0,
    bases: [false, false, false], // [1st, 2nd, 3rd]
    score: [0, 0],           // [away, home]
    hits: [0, 0],
    scoreByInning: [         // per-inning runs: [awayRuns[], homeRuns[]]
      Array(CONFIG.INNINGS).fill(null),
      Array(CONFIG.INNINGS).fill(null),
    ],
    batterIndex: [0, 0],     // current spot in batting order per team
    currentPitcherFatigue: [0, 0], // 0-100: increases each at-bat
    lastResult: null,        // most recent AtBatResult
    log: [],                 // play-by-play strings
    halfLog: [],             // log for current half-inning
  };
}

/** Which team is currently batting */
export function battingTeam(state) {
  return state.teams[state.half];
}

/** Which team is currently pitching */
export function pitchingTeam(state) {
  return state.teams[state.half ^ 1];
}

/** Current batter object */
export function currentBatter(state) {
  const team = battingTeam(state);
  return team.roster[state.batterIndex[state.half]];
}

/** Current pitcher object */
export function currentPitcher(state) {
  const team = pitchingTeam(state);
  return team.roster[0]; // pitcher is always index 0
}
