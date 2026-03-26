import { CONFIG } from '../data/config.js';
import { createGameState, battingTeam, pitchingTeam, currentBatter, currentPitcher } from './gameState.js';
import { resolveAtBat } from './matchup.js';
import { advanceBases, generateTeam } from './gameLogic.js';
import { isHalfOver, advanceHalf, advanceBatter } from './inning.js';
import { shuffle } from '../utils/random.js';

export class GameEngine {
  constructor(callbacks = {}) {
    this.callbacks = callbacks; // { onUpdate, onAtBat, onHalfOver, onGameOver }
    this.state = null;
    this._busy = false;
  }

  /** Start a brand-new game */
  newGame() {
    const teamNames = shuffle([...CONFIG.TEAM_NAMES]);
    const teams = [
      generateTeam(teamNames[0]),
      generateTeam(teamNames[1]),
    ];
    this.state = createGameState(teams);
    // Initialize per-inning score tracker
    this._inningRunsStart = [0, 0];
    this.callbacks.onUpdate?.(this.state);
  }

  /** Simulate one at-bat. Returns immediately; UI updates via callbacks. */
  async pitch() {
    if (this._busy || !this.state) return;
    if (this.state.phase === 'over') return;

    this._busy = true;
    const state = this.state;

    const batter  = currentBatter(state);
    const pitcher = currentPitcher(state);
    const fatigue = state.currentPitcherFatigue[state.half ^ 1];

    // ── Resolve at-bat ────────────────────────────────────────
    const result = resolveAtBat(batter, pitcher, fatigue);
    const { newBases, runs, extraOuts, special } = advanceBases(
      state.bases, result.type, batter, state.outs
    );

    // Update pitcher fatigue
    state.currentPitcherFatigue[state.half ^ 1] = Math.min(100, fatigue + 3);

    // Record result
    state.lastResult = { ...result, special, runs };
    if (result.isHit) state.hits[state.half]++;

    // Build log line
    const batterName  = batter.name;
    const label       = special ?? result.label;
    let logLine = `${batterName}  ${label}`;
    if (runs > 0) logLine += `  +${runs}点`;
    state.log.unshift(logLine);
    state.halfLog.push(logLine);
    if (state.log.length > 40) state.log.pop();

    // ── Notify UI (show at-bat result) ────────────────────────
    this.callbacks.onAtBat?.(state, result, runs);

    // Apply outs
    let newOuts = state.outs + 1 + extraOuts; // +1 for batter

    // Apply runs
    if (runs > 0) {
      state.score[state.half] += runs;
      // Record per-inning
      const idx = state.inning - 1;
      if (idx < CONFIG.INNINGS) {
        const cur = state.scoreByInning[state.half][idx] ?? 0;
        state.scoreByInning[state.half][idx] = cur + runs;
      }
    }

    // Apply base state (advanceBases handles all cases correctly)
    state.bases = newBases;
    state.outs = newOuts;
    advanceBatter(state);

    // ── Walk-off check: bottom of final inning, home takes lead ──
    const isLateGame = state.inning >= CONFIG.INNINGS;
    if (isLateGame && state.half === 1 && runs > 0 && state.score[1] > state.score[0]) {
      // Seal the inning score now
      const wi = state.inning - 1;
      if (wi < CONFIG.INNINGS && state.scoreByInning[1][wi] === null) {
        state.scoreByInning[1][wi] = state.score[1] -
          (state.scoreByInning[1].slice(0, wi).reduce((a, v) => a + (v ?? 0), 0));
      }
      await this._delay(CONFIG.RESULT_DISPLAY_MS);
      state.phase = 'over';
      this.callbacks.onGameOver?.(state);
      this._busy = false;
      return;
    }

    await this._delay(CONFIG.RESULT_DISPLAY_MS);

    // ── Check half-inning over ────────────────────────────────
    if (isHalfOver(state)) {
      // Record inning score for this side if no runs yet recorded
      const idx = state.inning - 1;
      if (idx < CONFIG.INNINGS && state.scoreByInning[state.half][idx] === null) {
        state.scoreByInning[state.half][idx] = 0;
      }

      // Bottom half complete: check win condition
      const isLastInning = state.inning >= CONFIG.INNINGS;
      const isBottom     = state.half === 1;
      if (isLastInning && isBottom && state.score[1] !== state.score[0]) {
        state.phase = 'over';
        this.callbacks.onGameOver?.(state);
        this._busy = false;
        return;
      }

      state.phase = 'halfOver';
      this.callbacks.onHalfOver?.(state);
      await this._delay(1400);

      advanceHalf(state);

      // Check game over properly
      if (state.inning > CONFIG.INNINGS + CONFIG.MAX_EXTRA_INNINGS) {
        state.phase = 'over';
        this.callbacks.onGameOver?.(state);
        this._busy = false;
        return;
      }

      // After 9 complete innings check
      if (state.inning > CONFIG.INNINGS && state.half === 0) {
        if (state.score[0] !== state.score[1]) {
          state.phase = 'over';
          this.callbacks.onGameOver?.(state);
          this._busy = false;
          return;
        }
      }

      state.phase = 'game';
      this.callbacks.onUpdate?.(state);
    } else {
      this.callbacks.onUpdate?.(state);
    }

    this._busy = false;
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  isBusy() {
    return this._busy;
  }
}
