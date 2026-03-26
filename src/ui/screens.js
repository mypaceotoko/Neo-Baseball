import { CONFIG } from '../data/config.js';
import { setHTML } from '../utils/dom.js';

/** Build the Title screen HTML */
export function buildTitleScreen(el) {
  setHTML(el, `
    <div class="title-wrap">
      <div class="title-scanlines"></div>
      <div class="title-content">
        <div class="title-badge">FAMICOM SPORTS</div>
        <h1 class="title-logo">
          <span class="logo-neo">NEO</span><br>
          <span class="logo-base">BASE</span><span class="logo-ball">BALL</span>
        </h1>
        <div class="title-year">© 1986  RETRO SOFT</div>
        <div class="title-sub blink">PRESS START</div>
        <button id="btn-start" class="retro-btn btn-lg">▶  START GAME</button>
        <div class="title-tip">タップしてスタート</div>
      </div>
    </div>
  `);
}

/** Build the Team Generation screen HTML */
export function buildTeamScreen(el, teams) {
  const renderTeam = (team, idx) => {
    const rows = team.roster.map(p => `
      <tr>
        <td class="num">#${p.number}</td>
        <td class="pos">${p.position}</td>
        <td class="pname">${p.name}</td>
        <td>${statBar(p.meet)}</td>
        <td>${statBar(p.power)}</td>
        <td>${statBar(p.speed)}</td>
        ${p.position === 'P'
          ? `<td>${statBar(p.velocity)}</td><td>${statBar(p.control)}</td>`
          : `<td>—</td><td>—</td>`
        }
      </tr>
    `).join('');

    return `
      <div class="team-panel ${idx === 0 ? 'away' : 'home'}">
        <div class="team-header">${idx === 0 ? '【AWAY】' : '【HOME】'} ${team.name}</div>
        <table class="roster-table">
          <thead>
            <tr>
              <th>#</th><th>POS</th><th>名前</th>
              <th>MIT</th><th>PWR</th><th>SPD</th>
              <th>VEL</th><th>CTL</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  };

  setHTML(el, `
    <div class="team-screen">
      <div class="screen-title">⚾ TEAM ROSTER ⚾</div>
      <div class="teams-wrap">
        ${renderTeam(teams[0], 0)}
        ${renderTeam(teams[1], 1)}
      </div>
      <div class="team-actions">
        <button id="btn-play" class="retro-btn btn-lg blink">▶  PLAY BALL!</button>
      </div>
    </div>
  `);
}

function statBar(val) {
  const filled = Math.round(val / 10);
  return `<span class="stat-bar">${'█'.repeat(filled)}${'░'.repeat(10 - filled)}</span>`;
}

/** Build the Game screen HTML skeleton */
export function buildGameScreen(el) {
  setHTML(el, `
    <div class="game-wrap">
      <!-- Scoreboard -->
      <div class="scoreboard-section">
        <div class="scoreboard" id="scoreboard"></div>
      </div>

      <!-- Field status row -->
      <div class="field-row">
        <div class="inning-box" id="inning-box">
          <div class="inning-label" id="inning-label">TOP 1</div>
          <div class="half-indicator" id="half-indicator">▲</div>
        </div>
        <div class="outs-box" id="outs-box">
          <div class="outs-label">OUTS</div>
          <div class="outs-circles" id="outs-circles">○○○</div>
        </div>
        <div class="bases-box">
          <div class="bases-label">BASES</div>
          <div class="bases-diamond" id="bases-diamond">
            <div class="base b2" id="base-2"></div>
            <div class="base b1" id="base-1"></div>
            <div class="base b3" id="base-3"></div>
            <div class="base-home">⌂</div>
          </div>
        </div>
      </div>

      <!-- Matchup info -->
      <div class="matchup-row" id="matchup-row">
        <div class="matchup-batter">
          <span class="mlabel">打者</span>
          <span class="mname" id="batter-name">—</span>
          <span class="mpos" id="batter-pos"></span>
        </div>
        <div class="matchup-vs">VS</div>
        <div class="matchup-pitcher">
          <span class="mlabel">投手</span>
          <span class="mname" id="pitcher-name">—</span>
        </div>
      </div>
      <div class="stat-row" id="stat-row">
        <span id="batter-stats"></span>
        <span id="pitcher-stats"></span>
      </div>

      <!-- At-bat result -->
      <div class="result-area" id="result-area">
        <div class="result-text" id="result-text"></div>
        <div class="result-runs" id="result-runs"></div>
      </div>

      <!-- Play log -->
      <div class="log-section">
        <div class="log-title">PLAY LOG</div>
        <div class="log-box" id="log-box"></div>
      </div>

      <!-- Controls -->
      <div class="controls-row">
        <button id="btn-pitch" class="retro-btn btn-pitch">⚾  PITCH!</button>
      </div>
    </div>
  `);
}

/** Build the Result screen HTML */
export function buildResultScreen(el, state) {
  const [away, home] = state.teams;
  const [as, hs] = state.score;
  const [ah, hh] = state.hits;
  const winner = as > hs ? away.name : hs > as ? home.name : null;

  const inningRow = (teamIdx) =>
    Array.from({ length: CONFIG.INNINGS }, (_, i) => {
      const v = state.scoreByInning[teamIdx][i];
      return `<td class="${v > 0 ? 'has-run' : ''}">${v ?? '0'}</td>`;
    }).join('');

  setHTML(el, `
    <div class="result-wrap">
      <div class="result-title">${winner ? '⚾  GAME OVER  ⚾' : '⚾  DRAW  ⚾'}</div>
      ${winner ? `<div class="winner-banner blink">🏆 ${winner} 勝利!</div>` : '<div class="winner-banner">引き分け</div>'}

      <table class="final-board">
        <thead>
          <tr>
            <th>TEAM</th>
            ${Array.from({ length: CONFIG.INNINGS }, (_, i) => `<th>${i + 1}</th>`).join('')}
            <th>R</th><th>H</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="team-col away">${away.name}</td>
            ${inningRow(0)}
            <td class="total-col">${as}</td>
            <td class="total-col">${ah}</td>
          </tr>
          <tr>
            <td class="team-col home">${home.name}</td>
            ${inningRow(1)}
            <td class="total-col">${hs}</td>
            <td class="total-col">${hh}</td>
          </tr>
        </tbody>
      </table>

      <div class="result-actions">
        <button id="btn-again" class="retro-btn btn-lg">↺  PLAY AGAIN</button>
        <button id="btn-title" class="retro-btn">⌂  TITLE</button>
      </div>
    </div>
  `);
}
