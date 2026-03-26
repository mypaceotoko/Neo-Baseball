/** Query single element */
export const $ = (sel, root = document) => root.querySelector(sel);

/** Query all elements */
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/** Show element */
export function show(el) {
  if (el) el.classList.add('active');
}

/** Hide element */
export function hide(el) {
  if (el) el.classList.remove('active');
}

/** Set text content safely */
export function setText(el, text) {
  if (el) el.textContent = text;
}

/** Set inner HTML safely (only for trusted content) */
export function setHTML(el, html) {
  if (el) el.innerHTML = html;
}

/** Add CSS class */
export function addClass(el, cls) {
  if (el) el.classList.add(cls);
}

/** Remove CSS class */
export function removeClass(el, cls) {
  if (el) el.classList.remove(cls);
}

/** Create element with optional class and text */
export function el(tag, cls = '', text = '') {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

/** Flash animation: add class, remove after delay */
export function flash(element, cls, ms = 600) {
  if (!element) return;
  element.classList.add(cls);
  setTimeout(() => element.classList.remove(cls), ms);
}
