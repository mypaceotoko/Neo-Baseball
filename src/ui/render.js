import { CONFIG } from '../data/config.js';
import { $, setText, setHTML, addClass, removeClass, flash } from '../utils/dom.js';
import { currentBatter, currentPitcher, battingTeam } from '../game/gameState.js';

/** Update the full scoreboard */
export function renderScoreboard(state) {
  const board = $('#scoreboard');
  if (!board) return;

  const [away, home] = state.teams;
  const innings = Array.from({ length: CONFIG.INNINGS }, (_, i) => i);

  const cellClass = (teamIdx, i) => {
    const v = state.scoreByInning[teamIdx][i];
    if (v === null) return 'sb-empty';
    if (v > 0) return 'sb-run';
    return 'sb-zero';
  };

  const cellVal = (teamIdx, i) => {
    const v = state.scoreByInning[teamIdx][i];
    if (v === null) {
      // Current half being played?
      if (teamIdx === state.half && i === state.inning - 1) return '<span class="sb-cur">▸</span>';
      return '';
    }
    return v > 0 ? `<span class="sb-run-num">${v}</span>` : '0';
  };

  setHTML(board, `
    <table class="sb-table">
      <thead>
        <tr>
          <th class="sb-team">TEAM</th>
          ${innings.map(i => `<th class="${i === state.inning - 1 ? 'sb-cur-inn' : ''}">${i + 1}</th>`).join('')}
          <th class="sb-total">R</th>
          <th class="sb-total">H</th>
        </tr>
      </thead>
      <tbody>
        <tr class="${state.half === 0 ? 'sb-batting' : ''}">
          <td class="sb-team away-label">${away.name}</td>
          ${innings.map(i => `<td class="${cellClass(0, i)}">${cellVal(0, i)}</td>`).join('')}
          <td class="sb-total-val">${state.score[0]}</td>
          <td class="sb-total-val">${state.hits[0]}</td>
        </tr>
        <tr class="${state.half === 1 ? 'sb-batting' : ''}">
          <td class="sb-team home-label">${home.name}</td>
          ${innings.map(i => `<td class="${cellClass(1, i)}">${cellVal(1, i)}</td>`).join('')}
          <td class="sb-total-val">${state.score[1]}</td>
          <td class="sb-total-val">${state.hits[1]}</td>
        </tr>
      </tbody>
    </table>
  `);
}

/** Update inning/half display */
export function renderInning(state) {
  const halfStr = state.half === 0 ? '▲ TOP' : '▼ BOT';
  setText($('#inning-label'), `${state.inning}回`);
  setText($('#half-indicator'), halfStr);
}

/** Update out circles */
export function renderOuts(state) {
  const circles = ['○', '○', '○'];
  for (let i = 0; i < state.outs && i < 3; i++) circles[i] = '●';
  setText($('#outs-circles'), circles.join(''));
}

/** Update base diamonds */
export function renderBases(state) {
  const [b1, b2, b3] = state.bases;
  const setBase = (id, on) => {
    const el = $(`#base-${id}`);
    if (!el) return;
    if (on) addClass(el, 'on');
    else removeClass(el, 'on');
  };
  setBase(1, b1);
  setBase(2, b2);
  setBase(3, b3);
}

/** Update matchup info (batter/pitcher) */
export function renderMatchup(state) {
  const batter  = currentBatter(state);
  const pitcher = currentPitcher(state);
  if (!batter || !pitcher) return;

  const batting = battingTeam(state);
  setText($('#batter-name'), batter.name);
  setText($('#batter-pos'), `#${batter.number} ${batter.position}`);
  setText($('#pitcher-name'), pitcher.name);

  setHTML($('#batter-stats'),
    `ミート<b>${batter.meet}</b> パワー<b>${batter.power}</b> 走力<b>${batter.speed}</b>`
  );
  setHTML($('#pitcher-stats'),
    `球速<b>${pitcher.velocity}</b> 制球<b>${pitcher.control}</b> スタミナ<b>${pitcher.stamina}</b>`
  );
}

/** Show at-bat result with flash animation */
export function renderAtBatResult(state, result, runs) {
  const textEl = $('#result-text');
  const runsEl = $('#result-runs');
  if (!textEl) return;

  // Determine CSS class for result type
  let cls = 'res-out';
  if (result.isHit && result.type === 'HOMERUN') cls = 'res-hr';
  else if (result.isHit) cls = 'res-hit';
  else if (result.isWalk) cls = 'res-walk';

  textEl.className = `result-text ${cls} flash-in`;
  const label = result.special ?? result.label;
  setText(textEl, label);

  if (runs > 0) {
    runsEl.className = 'result-runs score-flash';
    setText(runsEl, `+${runs} 点!`);
  } else {
    runsEl.className = 'result-runs';
    setText(runsEl, '');
  }

  // Remove animation class after a tick so it can re-trigger
  setTimeout(() => removeClass(textEl, 'flash-in'), 50);
}

/** Render half-over / change message */
export function renderHalfOver(state) {
  const textEl = $('#result-text');
  const runsEl = $('#result-runs');
  if (!textEl) return;

  textEl.className = 'result-text res-change flash-in';
  const halfStr = state.half === 0 ? '▲ TOP' : '▼ BOT';
  setText(textEl, `3 OUTS — CHANGE!`);
  setText(runsEl, `${state.half === 0 ? '表' : '裏'}終了`);
}

/** Update play log */
export function renderLog(state) {
  const logBox = $('#log-box');
  if (!logBox) return;

  const lines = state.log.slice(0, CONFIG.LOG_MAX_LINES);
  setHTML(logBox,
    lines.map((l, i) => `<div class="log-line ${i === 0 ? 'log-new' : ''}">${l}</div>`).join('')
  );
}

/** Full game screen refresh */
export function renderGame(state) {
  renderScoreboard(state);
  renderInning(state);
  renderOuts(state);
  renderBases(state);
  renderMatchup(state);
  renderLog(state);
}
