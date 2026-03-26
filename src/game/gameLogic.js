import { CONFIG } from '../data/config.js';
import { rand, shuffle } from '../utils/random.js';
import { clamp } from '../utils/math.js';
import { PLAYER_NAMES, formatName } from '../data/playerNames.js';

// ── Base Running ─────────────────────────────────────────────────────────────

/**
 * Advance bases after a batting result.
 * @param {boolean[]} bases  [1st, 2nd, 3rd]
 * @param {string}    type   result type string
 * @param {object}    batter batter object (for speed)
 * @param {number}    outs   current outs BEFORE this play
 * @returns {{ newBases: boolean[], runs: number, extraOuts: number, special: string|null }}
 */
export function advanceBases(bases, type, batter, outs) {
  let [b1, b2, b3] = bases;
  const fast = batter.speed >= 65;
  let runs = 0;
  let extraOuts = 0;
  let special = null;

  switch (type) {
    case 'HOMERUN': {
      runs = 1 + (b1 ? 1 : 0) + (b2 ? 1 : 0) + (b3 ? 1 : 0);
      return { newBases: [false, false, false], runs, extraOuts: 0, special: null };
    }

    case 'TRIPLE': {
      runs = (b1 ? 1 : 0) + (b2 ? 1 : 0) + (b3 ? 1 : 0);
      return { newBases: [false, false, true], runs, extraOuts: 0, special: null };
    }

    case 'DOUBLE': {
      runs = (b2 ? 1 : 0) + (b3 ? 1 : 0);
      const n3 = b1 && !fast ? true : false;
      if (b1 && fast) runs++;
      return { newBases: [false, true, n3], runs, extraOuts: 0, special: null };
    }

    case 'SINGLE': {
      // 3rd and 2nd always score; 1st → 2nd (or 3rd if fast)
      runs = (b3 ? 1 : 0) + (b2 ? 1 : 0);
      const s2 = b1 ? !fast : false;
      const s3 = b1 && fast ? true : false;
      return { newBases: [true, s2, s3], runs, extraOuts: 0, special: null };
    }

    case 'INFIELD_HIT': {
      // Everyone advances exactly one base; 3rd scores
      runs = b3 ? 1 : 0;
      return { newBases: [true, b1, b2], runs, extraOuts: 0, special: null };
    }

    case 'WALK': {
      // Force advance only
      let wb3 = b3;
      let wb2 = b2;
      if (b1) wb2 = true;
      if (b1 && b2) wb3 = true;
      if (b1 && b2 && b3) runs = 1;
      return { newBases: [true, wb2, wb3], runs, extraOuts: 0, special: null };
    }

    case 'GROUNDOUT': {
      // Double play if runner on 1st and < 2 outs
      if (b1 && outs < 2) {
        extraOuts = 1;
        b1 = false;
        special = CONFIG.RESULT_LABELS.DOUBLE_PLAY;
      }
      return { newBases: [b1, b2, b3], runs: 0, extraOuts, special };
    }

    case 'FLYOUT': {
      // Sac fly if runner on 3rd and < 2 outs
      if (b3 && outs < 2) {
        runs = 1;
        b3 = false;
        special = CONFIG.RESULT_LABELS.SAC_FLY;
      }
      return { newBases: [b1, b2, b3], runs, extraOuts: 0, special };
    }

    default:
      return { newBases: [b1, b2, b3], runs: 0, extraOuts: 0, special: null };
  }
}

// ── Player Generation ────────────────────────────────────────────────────────

/** Stat biases per position: [meet, power, speed, defense, arm, velocity, control, stamina] */
const POS_BIASES = {
  P:   [35, 35, 40, 40, 60, 70, 70, 65],
  C:   [50, 45, 40, 70, 70, 30, 30, 50],
  '1B':[52, 68, 42, 52, 50, 30, 30, 50],
  '2B':[55, 42, 68, 65, 52, 30, 30, 50],
  '3B':[52, 62, 48, 55, 58, 30, 30, 50],
  SS:  [55, 42, 70, 70, 60, 30, 30, 50],
  LF:  [55, 62, 52, 48, 52, 30, 30, 50],
  CF:  [55, 45, 75, 65, 55, 30, 30, 50],
  RF:  [55, 65, 48, 48, 65, 30, 30, 50],
};

function genStat(base, spread = 25) {
  return clamp(base + rand(-spread, spread), 15, 99);
}

function generatePlayer(nameObj, position, number) {
  const bias = POS_BIASES[position];
  return {
    name: formatName(nameObj),
    number,
    position,
    meet:     genStat(bias[0]),
    power:    genStat(bias[1]),
    speed:    genStat(bias[2]),
    defense:  genStat(bias[3]),
    arm:      genStat(bias[4]),
    pitching: position === 'P' ? genStat(bias[5]) : genStat(35, 15),
    velocity: position === 'P' ? genStat(bias[6]) : 30,
    control:  position === 'P' ? genStat(bias[7]) : 30,
    stamina:  position === 'P' ? genStat(65, 20)  : 60,
  };
}

/** Generate a full 9-player team */
export function generateTeam(teamName) {
  const positions = [...CONFIG.POSITIONS];
  const pool = shuffle([...PLAYER_NAMES]);

  const roster = positions.map((pos, i) => {
    const nameObj = pool[i] ?? { last: '選手', first: String(i + 1) };
    return generatePlayer(nameObj, pos, i + 1);
  });

  return { name: teamName, roster };
}
