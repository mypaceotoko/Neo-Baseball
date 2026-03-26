/** Game-wide constants */
export const CONFIG = {
  INNINGS: 9,
  OUTS_PER_HALF: 3,
  TEAM_SIZE: 9,
  MAX_EXTRA_INNINGS: 3,   // up to 12 innings total before draw
  RESULT_DISPLAY_MS: 1200, // how long to show at-bat result
  LOG_MAX_LINES: 8,        // max visible play-log lines

  /** Base weights for at-bat outcomes (total ~1000 before adjustments) */
  BASE_WEIGHTS: {
    WALK:        80,
    STRIKEOUT:  160,
    GROUNDOUT:  270,
    FLYOUT:     200,
    INFIELD_HIT: 40,
    SINGLE:     155,
    DOUBLE:      55,
    TRIPLE:      15,
    HOMERUN:     25,
  },

  /** Japanese display labels */
  RESULT_LABELS: {
    WALK:        '四球',
    STRIKEOUT:   '三振',
    GROUNDOUT:   'ゴロ',
    FLYOUT:      'フライ',
    INFIELD_HIT: '内野安打',
    SINGLE:      'ヒット',
    DOUBLE:      '二塁打',
    TRIPLE:      '三塁打',
    HOMERUN:     'ホームラン!!',
    DOUBLE_PLAY: 'ゲッツー',
    SAC_FLY:     '犠牲フライ',
  },

  POSITIONS: ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF'],

  TEAM_NAMES: [
    '東京ドラゴンズ',   '大阪タイガーズ',   '名古屋イーグルス',
    '福岡ライオンズ',   '札幌ベアーズ',     '横浜ウェーブス',
    '仙台ファイターズ', '広島カープス',     '神戸シャークス',
    '新潟ホークス',
  ],
};
