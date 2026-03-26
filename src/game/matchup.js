import { CONFIG } from '../data/config.js';
import { weightedChoice } from '../utils/random.js';
import { clamp, statMult } from '../utils/math.js';

/**
 * Calculate at-bat outcome weights based on batter vs pitcher stats.
 * Returns a weight map for weightedChoice().
 */
function buildWeights(batter, pitcher, fatigue) {
  const W = { ...CONFIG.BASE_WEIGHTS };

  // ── Pitcher modifiers ────────────────────────────────────────
  const vel = pitcher.velocity / 100;        // 0-1
  const ctrl = pitcher.control / 100;        // 0-1
  const fatigueF = 1 + (fatigue / 100) * 0.4; // fatigue weakens pitcher

  // High velocity → more strikeouts, fewer hits
  W.STRIKEOUT  = clamp(W.STRIKEOUT  * (1 + vel * 0.6) / fatigueF, 30, 320);
  W.GROUNDOUT  = clamp(W.GROUNDOUT  * (1 + vel * 0.2) / fatigueF, 80, 500);
  W.FLYOUT     = clamp(W.FLYOUT     * (1 + vel * 0.1) / fatigueF, 60, 380);

  // High control → fewer walks, fewer hits
  W.WALK       = clamp(W.WALK       * (1 - ctrl * 0.55) * fatigueF, 10, 160);
  W.SINGLE     = clamp(W.SINGLE     * (1 - ctrl * 0.25) * fatigueF, 40, 300);
  W.DOUBLE     = clamp(W.DOUBLE     * (1 - ctrl * 0.20) * fatigueF, 10, 130);
  W.HOMERUN    = clamp(W.HOMERUN    * (1 - ctrl * 0.20) * fatigueF,  5, 100);

  // ── Batter modifiers ────────────────────────────────────────
  const meet  = batter.meet / 100;
  const power = batter.power / 100;
  const speed = batter.speed / 100;

  // High meet → more contact, fewer strikeouts/outs
  W.STRIKEOUT  = clamp(W.STRIKEOUT  * (1 - meet * 0.5),  15, 320);
  W.SINGLE     = clamp(W.SINGLE     * (1 + meet * 0.6),  40, 320);
  W.GROUNDOUT  = clamp(W.GROUNDOUT  * (1 - meet * 0.2),  60, 500);

  // High power → more XBH and HR
  W.HOMERUN    = clamp(W.HOMERUN    * (1 + power * 2.5),  5, 200);
  W.DOUBLE     = clamp(W.DOUBLE     * (1 + power * 0.9), 10, 160);
  W.TRIPLE     = clamp(W.TRIPLE     * (1 + power * 0.4),  5,  60);
  W.FLYOUT     = clamp(W.FLYOUT     * (1 + power * 0.25), 60, 400);

  // High speed → more infield hits, triples
  W.INFIELD_HIT = clamp(W.INFIELD_HIT * (1 + speed * 0.9),  8, 120);
  W.TRIPLE      = clamp(W.TRIPLE      * (1 + speed * 0.5),   5,  80);

  return W;
}

/**
 * Resolve a single at-bat.
 * @returns {{ type: string, label: string, isHit: boolean, isOut: boolean, isWalk: boolean }}
 */
export function resolveAtBat(batter, pitcher, fatigue) {
  const weights = buildWeights(batter, pitcher, fatigue);
  const type = weightedChoice(weights);
  const label = CONFIG.RESULT_LABELS[type] ?? type;

  const isHit  = ['SINGLE','DOUBLE','TRIPLE','HOMERUN','INFIELD_HIT'].includes(type);
  const isOut  = ['GROUNDOUT','FLYOUT','STRIKEOUT'].includes(type);
  const isWalk = type === 'WALK';

  return { type, label, isHit, isOut, isWalk };
}
