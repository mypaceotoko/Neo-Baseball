(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const i of e)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function a(e){const i={};return e.integrity&&(i.integrity=e.integrity),e.referrerPolicy&&(i.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?i.credentials="include":e.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(e){if(e.ep)return;e.ep=!0;const i=a(e);fetch(e.href,i)}})();const u=(s,t=document)=>t.querySelector(s);function nt(s){s&&s.classList.add("active")}function at(s){s&&s.classList.remove("active")}function v(s,t){s&&(s.textContent=t)}function L(s,t){s&&(s.innerHTML=t)}function it(s,t){s&&s.classList.add(t)}function z(s,t){s&&s.classList.remove(t)}let $=null;function rt(){if(!$)try{$=new(window.AudioContext||window.webkitAudioContext)}catch{return null}return $}function b(s,t,a="square",n=.18){const e=rt();if(e)try{const i=e.createOscillator(),r=e.createGain();i.connect(r),r.connect(e.destination),i.type=a,i.frequency.setValueAtTime(s,e.currentTime),r.gain.setValueAtTime(n,e.currentTime),r.gain.exponentialRampToValueAtTime(.001,e.currentTime+t),i.start(e.currentTime),i.stop(e.currentTime+t)}catch{}}function B(s,t){const a=t/s.length/1e3;s.forEach(([n,e],i)=>{setTimeout(()=>b(n,a*1.1),i*a*1e3)})}const m={hit(){b(660,.12),setTimeout(()=>b(880,.1),80)},homerun(){B([[523,.08],[659,.08],[784,.08],[1047,.15]],350)},strikeout(){b(440,.08),setTimeout(()=>b(330,.08),90),setTimeout(()=>b(220,.14),180)},out(){b(300,.15,"square",.12)},walk(){b(523,.1),setTimeout(()=>b(523,.1),120)},score(){B([[523,.07],[659,.07],[784,.07],[659,.07],[784,.12]],380)},change(){b(440,.12),setTimeout(()=>b(330,.18),140)},start(){B([[262,.06],[330,.06],[392,.06],[523,.12]],300)}},c={INNINGS:9,OUTS_PER_HALF:3,MAX_EXTRA_INNINGS:3,RESULT_DISPLAY_MS:1200,LOG_MAX_LINES:8,BASE_WEIGHTS:{WALK:80,STRIKEOUT:160,GROUNDOUT:270,FLYOUT:200,INFIELD_HIT:40,SINGLE:155,DOUBLE:55,TRIPLE:15,HOMERUN:25},RESULT_LABELS:{WALK:"四球",STRIKEOUT:"三振",GROUNDOUT:"ゴロ",FLYOUT:"フライ",INFIELD_HIT:"内野安打",SINGLE:"ヒット",DOUBLE:"二塁打",TRIPLE:"三塁打",HOMERUN:"ホームラン!!",DOUBLE_PLAY:"ゲッツー",SAC_FLY:"犠牲フライ"},POSITIONS:["P","C","1B","2B","3B","SS","LF","CF","RF"],TEAM_NAMES:["東京ドラゴンズ","大阪タイガーズ","名古屋イーグルス","福岡ライオンズ","札幌ベアーズ","横浜ウェーブス","仙台ファイターズ","広島カープス","神戸シャークス","新潟ホークス"]};function lt(s){return{phase:"game",teams:s,inning:1,half:0,outs:0,bases:[!1,!1,!1],score:[0,0],hits:[0,0],scoreByInning:[Array(c.INNINGS).fill(null),Array(c.INNINGS).fill(null)],batterIndex:[0,0],currentPitcherFatigue:[0,0],lastResult:null,log:[],halfLog:[]}}function Q(s){return s.teams[s.half]}function ot(s){return s.teams[s.half^1]}function Z(s){return Q(s).roster[s.batterIndex[s.half]]}function tt(s){return ot(s).roster[0]}function ct(s,t){return Math.floor(Math.random()*(t-s+1))+s}function st(s){for(let t=s.length-1;t>0;t--){const a=Math.floor(Math.random()*(t+1));[s[t],s[a]]=[s[a],s[t]]}return s}function ut(s){const t=Object.keys(s),a=t.reduce((e,i)=>e+s[i],0);let n=Math.random()*a;for(const e of t)if(n-=s[e],n<=0)return e;return t[t.length-1]}function f(s,t,a){return Math.min(a,Math.max(t,s))}function dt(s,t,a){const n={...c.BASE_WEIGHTS},e=t.velocity/100,i=t.control/100,r=1+a/100*.4;n.STRIKEOUT=f(n.STRIKEOUT*(1+e*.6)/r,30,320),n.GROUNDOUT=f(n.GROUNDOUT*(1+e*.2)/r,80,500),n.FLYOUT=f(n.FLYOUT*(1+e*.1)/r,60,380),n.WALK=f(n.WALK*(1-i*.55)*r,10,160),n.SINGLE=f(n.SINGLE*(1-i*.25)*r,40,300),n.DOUBLE=f(n.DOUBLE*(1-i*.2)*r,10,130),n.HOMERUN=f(n.HOMERUN*(1-i*.2)*r,5,100);const l=s.meet/100,o=s.power/100,d=s.speed/100;return n.STRIKEOUT=f(n.STRIKEOUT*(1-l*.5),15,320),n.SINGLE=f(n.SINGLE*(1+l*.6),40,320),n.GROUNDOUT=f(n.GROUNDOUT*(1-l*.2),60,500),n.HOMERUN=f(n.HOMERUN*(1+o*2.5),5,200),n.DOUBLE=f(n.DOUBLE*(1+o*.9),10,160),n.TRIPLE=f(n.TRIPLE*(1+o*.4),5,60),n.FLYOUT=f(n.FLYOUT*(1+o*.25),60,400),n.INFIELD_HIT=f(n.INFIELD_HIT*(1+d*.9),8,120),n.TRIPLE=f(n.TRIPLE*(1+d*.5),5,80),n}function ft(s,t,a){const n=dt(s,t,a),e=ut(n),i=c.RESULT_LABELS[e]??e,r=["SINGLE","DOUBLE","TRIPLE","HOMERUN","INFIELD_HIT"].includes(e),l=["GROUNDOUT","FLYOUT","STRIKEOUT"].includes(e);return{type:e,label:i,isHit:r,isOut:l,isWalk:e==="WALK"}}const ht=[{last:"大神",first:"貞次"},{last:"長峰",first:"茂男"},{last:"大空",first:"翔平"},{last:"野沢",first:"克也"},{last:"松木",first:"秀樹"},{last:"川岸",first:"哲二"},{last:"張川",first:"功一"},{last:"落川",first:"博史"},{last:"金城",first:"知広"},{last:"清野",first:"和夫"},{last:"掛川",first:"雅之"},{last:"田中",first:"将一"},{last:"達磨",first:"裕人"},{last:"佐川",first:"朗光"},{last:"吉野",first:"正勝"},{last:"山内",first:"一朗"},{last:"古田",first:"敦人"},{last:"江川",first:"卓二"},{last:"村西",first:"忠則"},{last:"黒沢",first:"良太"},{last:"宮本",first:"慎介"},{last:"伊藤",first:"誠哉"},{last:"渡辺",first:"豪志"},{last:"小林",first:"勇磨"},{last:"鈴木",first:"大輔"},{last:"中島",first:"健吾"},{last:"高橋",first:"竜二"},{last:"木村",first:"義人"},{last:"池田",first:"蒼天"},{last:"北川",first:"雄平"},{last:"Booth",first:"Billy"},{last:"Aarons",first:"Hank"},{last:"Manton",first:"Mick"},{last:"Maze",first:"Will"},{last:"Geron",first:"Lou"},{last:"Wilson",first:"Ted"},{last:"DiMaro",first:"Joe"},{last:"Kofax",first:"Sandy"},{last:"Johnston",first:"Randy"},{last:"Stone",first:"Barry"},{last:"McGuire",first:"Mac"},{last:"Griffo",first:"Ken"},{last:"Jetter",first:"Derek"},{last:"Trost",first:"Mike"},{last:"Pujol",first:"Albert"},{last:"Raymond",first:"Nolan"},{last:"Clements",first:"Roberto"},{last:"Young",first:"Cy"},{last:"Robinson",first:"Jack"},{last:"Hooper",first:"Buster"}];function bt(s){return/[\u3000-\u9fff]/.test(s.last)?`${s.last} ${s.first}`:`${s.first} ${s.last}`}function mt(s,t,a,n){let[e,i,r]=s;const l=a.speed>=65;let o=0,d=0,g=null;switch(t){case"HOMERUN":return o=1+(e?1:0)+(i?1:0)+(r?1:0),{newBases:[!1,!1,!1],runs:o,extraOuts:0,special:null};case"TRIPLE":return o=(e?1:0)+(i?1:0)+(r?1:0),{newBases:[!1,!1,!0],runs:o,extraOuts:0,special:null};case"DOUBLE":{o=(i?1:0)+(r?1:0);const p=!!(e&&!l);return e&&l&&o++,{newBases:[!1,!0,p],runs:o,extraOuts:0,special:null}}case"SINGLE":return o=(r?1:0)+(i?1:0),{newBases:[!0,e?!l:!1,!!(e&&l)],runs:o,extraOuts:0,special:null};case"INFIELD_HIT":return o=r?1:0,{newBases:[!0,e,i],runs:o,extraOuts:0,special:null};case"WALK":{let p=r,O=i;return e&&(O=!0),e&&i&&(p=!0),e&&i&&r&&(o=1),{newBases:[!0,O,p],runs:o,extraOuts:0,special:null}}case"GROUNDOUT":return e&&n<2&&(d=1,e=!1,g=c.RESULT_LABELS.DOUBLE_PLAY),{newBases:[e,i,r],runs:0,extraOuts:d,special:g};case"FLYOUT":return r&&n<2&&(o=1,r=!1,g=c.RESULT_LABELS.SAC_FLY),{newBases:[e,i,r],runs:o,extraOuts:0,special:g};default:return{newBases:[e,i,r],runs:0,extraOuts:0,special:null}}}const vt={P:[35,35,40,40,60,70,70,65],C:[50,45,40,70,70,30,30,50],"1B":[52,68,42,52,50,30,30,50],"2B":[55,42,68,65,52,30,30,50],"3B":[52,62,48,55,58,30,30,50],SS:[55,42,70,70,60,30,30,50],LF:[55,62,52,48,52,30,30,50],CF:[55,45,75,65,55,30,30,50],RF:[55,65,48,48,65,30,30,50]};function T(s,t=25){return f(s+ct(-t,t),15,99)}function pt(s,t,a){const n=vt[t];return{name:bt(s),number:a,position:t,meet:T(n[0]),power:T(n[1]),speed:T(n[2]),defense:T(n[3]),arm:T(n[4]),pitching:t==="P"?T(n[5]):T(35,15),velocity:t==="P"?T(n[6]):30,control:t==="P"?T(n[7]):30,stamina:t==="P"?T(65,20):60}}function q(s){const t=[...c.POSITIONS],a=st([...ht]),n=t.map((e,i)=>{const r=a[i]??{last:"選手",first:String(i+1)};return pt(r,e,i+1)});return{name:s,roster:n}}function Tt(s){return s.outs>=c.OUTS_PER_HALF}function gt(s){return s.inning-1,s.outs=0,s.bases=[!1,!1,!1],s.halfLog=[],s.half===0?(s.half=1,!1):(s.half=0,s.inning+=1,!0)}function Ot(s){const t=s.half;s.batterIndex[t]=(s.batterIndex[t]+1)%s.teams[t].roster.length}class It{constructor(t={}){this.callbacks=t,this.state=null,this._busy=!1}newGame(){var n,e;const t=st([...c.TEAM_NAMES]),a=[q(t[0]),q(t[1])];this.state=lt(a),this._inningRunsStart=[0,0],(e=(n=this.callbacks).onUpdate)==null||e.call(n,this.state)}async pitch(){var w,G,P,_,M,x,H,F,D,k,C,Y,W,K,j,V;if(this._busy||!this.state||this.state.phase==="over")return;this._busy=!0;const t=this.state,a=Z(t),n=tt(t),e=t.currentPitcherFatigue[t.half^1],i=ft(a,n,e),{newBases:r,runs:l,extraOuts:o,special:d}=mt(t.bases,i.type,a,t.outs);t.currentPitcherFatigue[t.half^1]=Math.min(100,e+3),t.lastResult={...i,special:d,runs:l},i.isHit&&t.hits[t.half]++;const g=a.name,p=d??i.label;let O=`${g}  ${p}`;l>0&&(O+=`  +${l}点`),t.log.unshift(O),t.halfLog.push(O),t.log.length>40&&t.log.pop(),(G=(w=this.callbacks).onAtBat)==null||G.call(w,t,i,l);let A=t.outs+1+o;if(l>0){t.score[t.half]+=l;const h=t.inning-1;if(h<c.INNINGS){const E=t.scoreByInning[t.half][h]??0;t.scoreByInning[t.half][h]=E+l}}if(t.bases=r,t.outs=A,Ot(t),t.inning>=c.INNINGS&&t.half===1&&l>0&&t.score[1]>t.score[0]){const h=t.inning-1;h<c.INNINGS&&t.scoreByInning[1][h]===null&&(t.scoreByInning[1][h]=t.score[1]-t.scoreByInning[1].slice(0,h).reduce((E,R)=>E+(R??0),0)),await this._delay(c.RESULT_DISPLAY_MS),t.phase="over",(_=(P=this.callbacks).onGameOver)==null||_.call(P,t),this._busy=!1;return}if(await this._delay(c.RESULT_DISPLAY_MS),Tt(t)){const h=t.inning-1;h<c.INNINGS&&t.scoreByInning[t.half][h]===null&&(t.scoreByInning[t.half][h]=0);const E=t.inning>=c.INNINGS,R=t.half===1;if(E&&R&&t.score[1]!==t.score[0]){t.phase="over",(x=(M=this.callbacks).onGameOver)==null||x.call(M,t),this._busy=!1;return}if(t.phase="halfOver",(F=(H=this.callbacks).onHalfOver)==null||F.call(H,t),await this._delay(1400),gt(t),t.inning>c.INNINGS+c.MAX_EXTRA_INNINGS){t.phase="over",(k=(D=this.callbacks).onGameOver)==null||k.call(D,t),this._busy=!1;return}if(t.inning>c.INNINGS&&t.half===0&&t.score[0]!==t.score[1]){t.phase="over",(Y=(C=this.callbacks).onGameOver)==null||Y.call(C,t),this._busy=!1;return}t.phase="game",(K=(W=this.callbacks).onUpdate)==null||K.call(W,t)}else(V=(j=this.callbacks).onUpdate)==null||V.call(j,t);this._busy=!1}_delay(t){return new Promise(a=>setTimeout(a,t))}isBusy(){return this._busy}}function Lt(s){L(s,`
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
  `)}function X(s,t){const a=(n,e)=>{const i=n.roster.map(r=>`
      <tr>
        <td class="num">#${r.number}</td>
        <td class="pos">${r.position}</td>
        <td class="pname">${r.name}</td>
        <td>${N(r.meet)}</td>
        <td>${N(r.power)}</td>
        <td>${N(r.speed)}</td>
        ${r.position==="P"?`<td>${N(r.velocity)}</td><td>${N(r.control)}</td>`:"<td>—</td><td>—</td>"}
      </tr>
    `).join("");return`
      <div class="team-panel ${e===0?"away":"home"}">
        <div class="team-header">${e===0?"【AWAY】":"【HOME】"} ${n.name}</div>
        <table class="roster-table">
          <thead>
            <tr>
              <th>#</th><th>POS</th><th>名前</th>
              <th>MIT</th><th>PWR</th><th>SPD</th>
              <th>VEL</th><th>CTL</th>
            </tr>
          </thead>
          <tbody>${i}</tbody>
        </table>
      </div>
    `};L(s,`
    <div class="team-screen">
      <div class="screen-title">⚾ TEAM ROSTER ⚾</div>
      <div class="teams-wrap">
        ${a(t[0],0)}
        ${a(t[1],1)}
      </div>
      <div class="team-actions">
        <button id="btn-play" class="retro-btn btn-lg blink">▶  PLAY BALL!</button>
      </div>
    </div>
  `)}function N(s){const t=Math.round(s/10);return`<span class="stat-bar">${"█".repeat(t)}${"░".repeat(10-t)}</span>`}function St(s){L(s,`
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
  `)}function Et(s,t){const[a,n]=t.teams,[e,i]=t.score,[r,l]=t.hits,o=e>i?a.name:i>e?n.name:null,d=g=>Array.from({length:c.INNINGS},(p,O)=>{const A=t.scoreByInning[g][O];return`<td class="${A>0?"has-run":""}">${A??"0"}</td>`}).join("");L(s,`
    <div class="result-wrap">
      <div class="result-title">${o?"⚾  GAME OVER  ⚾":"⚾  DRAW  ⚾"}</div>
      ${o?`<div class="winner-banner blink">🏆 ${o} 勝利!</div>`:'<div class="winner-banner">引き分け</div>'}

      <table class="final-board">
        <thead>
          <tr>
            <th>TEAM</th>
            ${Array.from({length:c.INNINGS},(g,p)=>`<th>${p+1}</th>`).join("")}
            <th>R</th><th>H</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="team-col away">${a.name}</td>
            ${d(0)}
            <td class="total-col">${e}</td>
            <td class="total-col">${r}</td>
          </tr>
          <tr>
            <td class="team-col home">${n.name}</td>
            ${d(1)}
            <td class="total-col">${i}</td>
            <td class="total-col">${l}</td>
          </tr>
        </tbody>
      </table>

      <div class="result-actions">
        <button id="btn-again" class="retro-btn btn-lg">↺  PLAY AGAIN</button>
        <button id="btn-title" class="retro-btn">⌂  TITLE</button>
      </div>
    </div>
  `)}function Nt(s){const t=u("#scoreboard");if(!t)return;const[a,n]=s.teams,e=Array.from({length:c.INNINGS},(l,o)=>o),i=(l,o)=>{const d=s.scoreByInning[l][o];return d===null?"sb-empty":d>0?"sb-run":"sb-zero"},r=(l,o)=>{const d=s.scoreByInning[l][o];return d===null?l===s.half&&o===s.inning-1?'<span class="sb-cur">▸</span>':"":d>0?`<span class="sb-run-num">${d}</span>`:"0"};L(t,`
    <table class="sb-table">
      <thead>
        <tr>
          <th class="sb-team">TEAM</th>
          ${e.map(l=>`<th class="${l===s.inning-1?"sb-cur-inn":""}">${l+1}</th>`).join("")}
          <th class="sb-total">R</th>
          <th class="sb-total">H</th>
        </tr>
      </thead>
      <tbody>
        <tr class="${s.half===0?"sb-batting":""}">
          <td class="sb-team away-label">${a.name}</td>
          ${e.map(l=>`<td class="${i(0,l)}">${r(0,l)}</td>`).join("")}
          <td class="sb-total-val">${s.score[0]}</td>
          <td class="sb-total-val">${s.hits[0]}</td>
        </tr>
        <tr class="${s.half===1?"sb-batting":""}">
          <td class="sb-team home-label">${n.name}</td>
          ${e.map(l=>`<td class="${i(1,l)}">${r(1,l)}</td>`).join("")}
          <td class="sb-total-val">${s.score[1]}</td>
          <td class="sb-total-val">${s.hits[1]}</td>
        </tr>
      </tbody>
    </table>
  `)}function yt(s){const t=s.half===0?"▲ TOP":"▼ BOT";v(u("#inning-label"),`${s.inning}回`),v(u("#half-indicator"),t)}function At(s){const t=["○","○","○"];for(let a=0;a<s.outs&&a<3;a++)t[a]="●";v(u("#outs-circles"),t.join(""))}function Rt(s){const[t,a,n]=s.bases,e=(i,r)=>{const l=u(`#base-${i}`);l&&(r?it(l,"on"):z(l,"on"))};e(1,t),e(2,a),e(3,n)}function $t(s){const t=Z(s),a=tt(s);!t||!a||(Q(s),v(u("#batter-name"),t.name),v(u("#batter-pos"),`#${t.number} ${t.position}`),v(u("#pitcher-name"),a.name),L(u("#batter-stats"),`ミート<b>${t.meet}</b> パワー<b>${t.power}</b> 走力<b>${t.speed}</b>`),L(u("#pitcher-stats"),`球速<b>${a.velocity}</b> 制球<b>${a.control}</b> スタミナ<b>${a.stamina}</b>`))}function Bt(s,t,a){const n=u("#result-text"),e=u("#result-runs");if(!n)return;let i="res-out";t.isHit&&t.type==="HOMERUN"?i="res-hr":t.isHit?i="res-hit":t.isWalk&&(i="res-walk"),n.className=`result-text ${i} flash-in`;const r=t.special??t.label;v(n,r),a>0?(e.className="result-runs score-flash",v(e,`+${a} 点!`)):(e.className="result-runs",v(e,"")),setTimeout(()=>z(n,"flash-in"),50)}function Ut(s){const t=u("#result-text"),a=u("#result-runs");t&&(t.className="result-text res-change flash-in",s.half,v(t,"3 OUTS — CHANGE!"),v(a,`${s.half===0?"表":"裏"}終了`))}function wt(s){const t=u("#log-box");if(!t)return;const a=s.log.slice(0,c.LOG_MAX_LINES);L(t,a.map((n,e)=>`<div class="log-line ${e===0?"log-new":""}">${n}</div>`).join(""))}function U(s){Nt(s),yt(s),At(s),Rt(s),$t(s),wt(s)}function Gt(s){y("btn-start",s.onStart),y("btn-play",s.onPlay),y("btn-pitch",s.onPitch),y("btn-again",s.onAgain),y("btn-title",s.onTitle)}function y(s,t){t&&(document.addEventListener("click",a=>{a.target&&a.target.id===s&&t(a)}),document.addEventListener("touchend",a=>{a.target&&a.target.id===s&&(a.preventDefault(),t(a))},{passive:!1}))}const Pt=["title","team","game","result"];function S(s){Pt.forEach(t=>{const a=u(`#screen-${t}`);t===s?nt(a):at(a)})}const I=new It({onUpdate(s){U(s),et(s)},onAtBat(s,t,a){t.type==="HOMERUN"?m.homerun():t.isHit?m.hit():t.type==="STRIKEOUT"?m.strikeout():t.isWalk?m.walk():m.out(),a>0&&t.type!=="HOMERUN"&&m.score(),Bt(s,t,a),U(s),J()},onHalfOver(s){m.change(),Ut(s),J()},onGameOver(s){m.start(),setTimeout(()=>{Et(u("#screen-result"),s),S("result")},900)}});function J(){const s=u("#btn-pitch");s&&(s.disabled=!0)}function et(s){const t=u("#btn-pitch");t&&(t.disabled=s.phase!=="game",t.textContent=s.phase==="halfOver"?"…":"⚾  PITCH!")}Gt({onStart(){m.start(),I.newGame(),X(u("#screen-team"),I.state.teams),S("team")},onPlay(){m.start(),St(u("#screen-game")),S("game"),U(I.state),et(I.state)},onPitch(){I.isBusy()||I.pitch()},onAgain(){m.start(),I.newGame(),X(u("#screen-team"),I.state.teams),S("team")},onTitle(){S("title")}});Lt(u("#screen-title"));S("title");
