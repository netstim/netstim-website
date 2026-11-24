// The header (layouts/_partials/header.html, nav.html): the phone menu sheet (dialog.js), its groups that
// unfold, and the sheets of the desktop menu. A sheet opens from its arrow button (click, Enter, Space; a
// second press closes it), on hover with a mouse, and with the Down arrow key. Escape closes it and hands
// focus back to the button; it also closes on a press outside and when focus moves on. Without this
// script the sheets open on hover and focus (header.css), and every title stays a plain link.
import { wireDialog } from './dialog.js';

const phone = document.querySelector('.phone-menu');
const menu = document.querySelector('[data-menu-open]');
const nav = document.querySelector('.desktop-nav');
const header = document.querySelector('.site-header');
const wide = matchMedia('(min-width: 900px)');

wireDialog(phone, [menu]);
for (const button of phone.querySelectorAll('.nav-group')) {
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', open);
    document.getElementById(button.getAttribute('aria-controls')).hidden = !open;
  });
}

// one sheet is open at a time; `pinned` means a button or key opened it, so the mouse leaving keeps it.
// `has-open` dims the other items and `is-menu-open` makes the bar opaque; `is-closing` fades a sheet out
// (not when the next one takes its place).
let current = null;
let pinned = false;
let pressed = false;
let timer;
const toggleOf = item => item.querySelector('.nav-toggle');
function hide(fade = true) {
  clearTimeout(timer);
  for (const item of nav.querySelectorAll('.is-closing')) item.classList.remove('is-closing');
  if (!current) return;
  current.classList.remove('is-open', 'is-switch');
  current.classList.toggle('is-closing', fade);
  toggleOf(current).setAttribute('aria-expanded', 'false');
  nav.classList.remove('has-open');
  header.classList.remove('is-menu-open');
  current = null;
  pinned = false;
}
function show(item, pin) {
  clearTimeout(timer);
  if (current === item) { pinned ||= pin; return; }
  const swap = Boolean(current);
  hide(false);
  current = item;
  pinned = pin;
  item.classList.add('is-open');
  item.classList.toggle('is-switch', swap);
  toggleOf(item).setAttribute('aria-expanded', 'true');
  nav.classList.add('has-open');
  header.classList.add('is-menu-open');
}

for (const item of nav.querySelectorAll('.has-sub')) {
  const toggle = toggleOf(item);
  const panel = item.querySelector('.nav-panel');
  panel.addEventListener('animationend', event => {
    if (event.target === panel && !event.pseudoElement) item.classList.remove('is-closing');
  });
  toggle.addEventListener('click', () => (current === item && pinned ? hide() : show(item, true)));
  // hover: a short wait before the first sheet, none when moving from one open sheet to the next
  item.addEventListener('pointerenter', event => {
    if (event.pointerType !== 'mouse') return;
    clearTimeout(timer);
    if (current) show(item, false);
    else timer = setTimeout(() => show(item, false), 100);
  });
  item.addEventListener('pointerleave', event => {
    if (event.pointerType !== 'mouse') return;
    clearTimeout(timer);
    if (current === item && !pinned) timer = setTimeout(hide, 160);
  });
  // Tab walks through the open sheet and closes it on the way out. A press inside the item may also
  // take focus away (Safari does not focus a link that is clicked): that must not close the sheet
  // before the click lands, hence `pressed`.
  item.addEventListener('focusout', event => {
    if (current !== item || item.contains(event.relatedTarget)) return;
    if (event.relatedTarget || !pressed) hide();
  });
  item.addEventListener('keydown', event => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const links = [...item.querySelectorAll('.nav-sub__link')];
    const at = links.indexOf(document.activeElement);
    const next = event.key === 'ArrowDown' ? at + 1 : at - 1;
    if (at === -1 && event.key === 'ArrowUp') return;
    event.preventDefault();
    show(item, true);
    (links[Math.min(next, links.length - 1)] || toggle).focus();
  });
}
document.addEventListener('pointerdown', event => {
  pressed = Boolean(current?.contains(event.target));
  if (current && !pressed) hide();
}, true);
for (const type of ['pointerup', 'pointercancel']) document.addEventListener(type, () => { pressed = false; }, true);
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !current) return;
  const item = current;
  const inside = item.contains(document.activeElement);
  hide();
  if (inside) toggleOf(item).focus();
});
addEventListener('pageshow', event => { if (event.persisted) hide(false); });
wide.addEventListener('change', event => {
  if (event.matches && phone.open) phone.close();
  if (!event.matches) hide(false);
});
nav.classList.add('is-ready');

