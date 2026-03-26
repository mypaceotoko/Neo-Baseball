import './style.css';
import { $, show, hide } from './utils/dom.js';
import { sounds } from './utils/sounds.js';
import { GameEngine } from './game/gameEngine.js';
import {
  buildTitleScreen,
  buildTeamScreen,
  buildGameScreen,
  buildResultScreen,
} from './ui/screens.js';
import {
  renderGame,
  renderAtBatResult,
  renderHalfOver,
} from './ui/render.js';
import { attachInputHandlers } from './ui/input.js';

// ── Screen management ──────────────────────────────────────────
const SCREENS = ['title', 'team', 'game', 'result'];

function showScreen(name) {
  SCREENS.forEach(s => {
    const el = $(`#screen-${s}`);
    if (s === name) show(el);
    else hide(el);
  });
}

// ── Engine setup ───────────────────────────────────────────────
const engine = new GameEngine({
  onUpdate(state) {
    renderGame(state);
    updatePitchBtn(state);
  },

  onAtBat(state, result, runs) {
    // Play sound
    if (result.type === 'HOMERUN')        sounds.homerun();
    else if (result.isHit)                sounds.hit();
    else if (result.type === 'STRIKEOUT') sounds.strikeout();
    else if (result.isWalk)               sounds.walk();
    else                                  sounds.out();
    if (runs > 0 && result.type !== 'HOMERUN') sounds.score();

    renderAtBatResult(state, result, runs);
    renderGame(state);
    disablePitchBtn();
  },

  onHalfOver(state) {
    sounds.change();
    renderHalfOver(state);
    disablePitchBtn();
  },

  onGameOver(state) {
    sounds.start();
    setTimeout(() => {
      buildResultScreen($('#screen-result'), state);
      showScreen('result');
    }, 900);
  },
});

// ── Button helpers ─────────────────────────────────────────────
function disablePitchBtn() {
  const btn = $('#btn-pitch');
  if (btn) btn.disabled = true;
}

function updatePitchBtn(state) {
  const btn = $('#btn-pitch');
  if (!btn) return;
  btn.disabled = state.phase !== 'game';
  btn.textContent = state.phase === 'halfOver' ? '…' : '⚾  PITCH!';
}

// ── Input handlers ─────────────────────────────────────────────
attachInputHandlers({
  onStart() {
    sounds.start();
    engine.newGame();
    buildTeamScreen($('#screen-team'), engine.state.teams);
    showScreen('team');
  },

  onPlay() {
    sounds.start();
    buildGameScreen($('#screen-game'));
    showScreen('game');
    renderGame(engine.state);
    updatePitchBtn(engine.state);
  },

  onPitch() {
    if (engine.isBusy()) return;
    engine.pitch();
  },

  onAgain() {
    sounds.start();
    engine.newGame();
    buildTeamScreen($('#screen-team'), engine.state.teams);
    showScreen('team');
  },

  onTitle() {
    showScreen('title');
  },
});

// ── Initial render ─────────────────────────────────────────────
buildTitleScreen($('#screen-title'));
showScreen('title');
