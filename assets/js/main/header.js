// The header (layouts/_partials/header.html, nav.html).
// Phone: the menu sheet (dialog.js), its groups as toggle rows; the current page's group starts open.
// Desktop: one band at a time. With a mouse, a band opens after a short dwell on its item and switches to
// another item only after a short pause, so a diagonal move toward a band's far column doesn't flick
// through the others; a click on the chevron opens (never closes) the hovered band. Keyboard: the chevron
// toggles; Escape closes and returns to it; click outside closes.
import { wireDialog } from './dialog.js';

const phone = document.querySelector('.phone-menu');
const menu = document.querySelector('[data-menu-open]');
const desktop = document.querySelector('.desktop-nav');
const pointer = matchMedia('(hover: hover) and (pointer: fine)');

wireDialog(phone, [menu]);
matchMedia('(min-width: 900px)').addEventListener('change', event => {
  if (event.matches && phone.open) phone.close();
});

const toggles = Array.from(document.querySelectorAll('[data-disclosure]'));
function expanded(button, open) {
  button.setAttribute('aria-expanded', String(open));
  document.getElementById(button.getAttribute('aria-controls')).hidden = !open;
}
function closeDesktop(except) {
  for (const button of toggles) {
    if (button !== except && desktop.contains(button)) expanded(button, false);
  }
}
const isOpen = button => button.getAttribute('aria-expanded') === 'true';
let dwell = 0;
for (const button of toggles) {
  const item = button.closest('.nav-item');
  if (!desktop.contains(button)) {
    button.addEventListener('click', () => expanded(button, !isOpen(button)));
    continue;
  }
  button.addEventListener('click', event => {
    const mouse = pointer.matches && event.detail > 0;
    const open = mouse ? true : !isOpen(button);
    closeDesktop(button);
    expanded(button, open);
  });
  item.addEventListener('pointerenter', event => {
    if (!pointer.matches || event.pointerType === 'touch') return;
    clearTimeout(dwell);
    const anyOpen = toggles.some(other => desktop.contains(other) && isOpen(other));
    dwell = setTimeout(() => { closeDesktop(button); expanded(button, true); }, anyOpen ? 160 : 110);
  });
  item.addEventListener('pointerleave', () => {
    clearTimeout(dwell);
    if (!pointer.matches || item.contains(document.activeElement)) return;
    dwell = setTimeout(() => expanded(button, false), 160);
  });
  item.addEventListener('focusout', event => {
    if (!item.contains(event.relatedTarget)) expanded(button, false);
  });
  item.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !isOpen(button)) return;
    event.preventDefault();
    expanded(button, false);
    button.focus();
  });
}
// leaving a band toward a link of another item: the item pointerenter above handles the switch
document.addEventListener('click', event => {
  if (!desktop.contains(event.target)) closeDesktop();
});
