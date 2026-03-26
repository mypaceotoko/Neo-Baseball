/**
 * Lightweight 8-bit sound effects via Web Audio API.
 * No external files required.
 */

let ctx = null;

function getCtx() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return ctx;
}

function beep(freq, duration, type = 'square', gain = 0.18) {
  const c = getCtx();
  if (!c) return;
  try {
    const osc = c.createOscillator();
    const g   = c.createGain();
    osc.connect(g);
    g.connect(c.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime);
    g.gain.setValueAtTime(gain, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + duration);
  } catch { /* ignore audio errors */ }
}

function sequence(notes, totalMs) {
  const step = totalMs / notes.length / 1000;
  notes.forEach(([f, t], i) => {
    setTimeout(() => beep(f, step * 1.1), i * step * 1000);
  });
}

export const sounds = {
  hit() {
    beep(660, 0.12);
    setTimeout(() => beep(880, 0.10), 80);
  },
  homerun() {
    sequence([[523,0.08],[659,0.08],[784,0.08],[1047,0.15]], 350);
  },
  strikeout() {
    beep(440, 0.08);
    setTimeout(() => beep(330, 0.08), 90);
    setTimeout(() => beep(220, 0.14), 180);
  },
  out() {
    beep(300, 0.15, 'square', 0.12);
  },
  walk() {
    beep(523, 0.10);
    setTimeout(() => beep(523, 0.10), 120);
  },
  score() {
    sequence([[523,0.07],[659,0.07],[784,0.07],[659,0.07],[784,0.12]], 380);
  },
  change() {
    beep(440, 0.12);
    setTimeout(() => beep(330, 0.18), 140);
  },
  start() {
    sequence([[262,0.06],[330,0.06],[392,0.06],[523,0.12]], 300);
  },
};
