import { $ } from '../utils/dom.js';

/**
 * Attach all button event listeners.
 * @param {object} handlers - { onStart, onPlay, onPitch, onAgain, onTitle }
 */
export function attachInputHandlers(handlers) {
  attachBtn('btn-start',  handlers.onStart);
  attachBtn('btn-play',   handlers.onPlay);
  attachBtn('btn-pitch',  handlers.onPitch);
  attachBtn('btn-again',  handlers.onAgain);
  attachBtn('btn-title',  handlers.onTitle);
}

function attachBtn(id, fn) {
  if (!fn) return;
  // Use event delegation so re-renders don't break listeners
  document.addEventListener('click', e => {
    if (e.target && e.target.id === id) fn(e);
  });
  // Touch support
  document.addEventListener('touchend', e => {
    if (e.target && e.target.id === id) {
      e.preventDefault();
      fn(e);
    }
  }, { passive: false });
}
