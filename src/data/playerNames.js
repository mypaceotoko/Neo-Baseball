/**
 * Player name pool.
 * Names are fictional characters inspired by real baseball legends.
 * All names are original and not identical to real persons.
 * To swap names, edit only this file.
 */

export const PLAYER_NAMES = [
  // ── 日本風 ──────────────────────────────────────────────────
  { last: '大神',   first: '貞次' },   // 王 貞治 にインスパイア
  { last: '長峰',   first: '茂男' },   // 長嶋 茂雄 にインスパイア
  { last: '大空',   first: '翔平' },   // 大谷 翔平 にインスパイア
  { last: '野沢',   first: '克也' },   // 野村 克也 にインスパイア
  { last: '松木',   first: '秀樹' },   // 松井 秀喜 にインスパイア
  { last: '川岸',   first: '哲二' },   // 川上 哲治 にインスパイア
  { last: '張川',   first: '功一' },   // 張本 勲 にインスパイア
  { last: '落川',   first: '博史' },   // 落合 博満 にインスパイア
  { last: '金城',   first: '知広' },   // 金本 知憲 にインスパイア
  { last: '清野',   first: '和夫' },   // 清原 和博 にインスパイア
  { last: '掛川',   first: '雅之' },   // 掛布 雅之 にインスパイア
  { last: '田中',   first: '将一' },   // 田中 将大 にインスパイア
  { last: '達磨',   first: '裕人' },   // ダルビッシュ 有 にインスパイア
  { last: '佐川',   first: '朗光' },   // 佐々木 朗希 にインスパイア
  { last: '吉野',   first: '正勝' },   // 吉田 正尚 にインスパイア
  { last: '山内',   first: '一朗' },   // イチロー にインスパイア
  { last: '古田',   first: '敦人' },   // 古田 敦也 にインスパイア
  { last: '江川',   first: '卓二' },   // 江川 卓 にインスパイア
  { last: '村西',   first: '忠則' },   // 村西 とおる… 別人想定のオリジナル
  { last: '黒沢',   first: '良太' },   // オリジナル
  { last: '宮本',   first: '慎介' },   // オリジナル
  { last: '伊藤',   first: '誠哉' },   // オリジナル
  { last: '渡辺',   first: '豪志' },   // オリジナル
  { last: '小林',   first: '勇磨' },   // オリジナル
  { last: '鈴木',   first: '大輔' },   // オリジナル
  { last: '中島',   first: '健吾' },   // オリジナル
  { last: '高橋',   first: '竜二' },   // オリジナル
  { last: '木村',   first: '義人' },   // オリジナル
  { last: '池田',   first: '蒼天' },   // オリジナル
  { last: '北川',   first: '雄平' },   // オリジナル

  // ── 国際風 ──────────────────────────────────────────────────
  { last: 'Booth',     first: 'Billy' },   // Babe Ruth にインスパイア
  { last: 'Aarons',    first: 'Hank' },    // Hank Aaron にインスパイア
  { last: 'Manton',    first: 'Mick' },    // Mickey Mantle にインスパイア
  { last: 'Maze',      first: 'Will' },    // Willie Mays にインスパイア
  { last: 'Geron',     first: 'Lou' },     // Lou Gehrig にインスパイア
  { last: 'Wilson',    first: 'Ted' },     // Ted Williams にインスパイア
  { last: 'DiMaro',    first: 'Joe' },     // Joe DiMaggio にインスパイア
  { last: 'Kofax',     first: 'Sandy' },   // Sandy Koufax にインスパイア
  { last: 'Johnston',  first: 'Randy' },   // Randy Johnson にインスパイア
  { last: 'Stone',     first: 'Barry' },   // Barry Bonds にインスパイア
  { last: 'McGuire',   first: 'Mac' },     // Mark McGwire にインスパイア
  { last: 'Griffo',    first: 'Ken' },     // Ken Griffey Jr にインスパイア
  { last: 'Jetter',    first: 'Derek' },   // Derek Jeter にインスパイア
  { last: 'Trost',     first: 'Mike' },    // Mike Trout にインスパイア
  { last: 'Pujol',     first: 'Albert' },  // Albert Pujols にインスパイア
  { last: 'Raymond',   first: 'Nolan' },   // Nolan Ryan にインスパイア
  { last: 'Clements',  first: 'Roberto' }, // Roberto Clemente にインスパイア
  { last: 'Young',     first: 'Cy' },      // Cy Young にインスパイア
  { last: 'Robinson',  first: 'Jack' },    // Jackie Robinson にインスパイア
  { last: 'Hooper',    first: 'Buster' },  // オリジナル
];

/** Return a full display name string */
export function formatName(player) {
  // Detect Japanese (contains CJK characters)
  if (/[\u3000-\u9fff]/.test(player.last)) {
    return `${player.last} ${player.first}`;
  }
  return `${player.first} ${player.last}`;
}
