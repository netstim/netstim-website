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
for (const button of toggles) {
  const item = button.closest('.nav-item');
  const isDesktop = desktop.contains(button);
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'false';
    if (isDesktop) closeDesktop(button);
    expanded(button, open);
  });
  if (!isDesktop) continue;
  item.addEventListener('pointerenter', event => {
    if (pointer.matches && event.pointerType !== 'touch') {
      closeDesktop(button);
      expanded(button, true);
    }
  });
  item.addEventListener('pointerleave', () => {
    if (pointer.matches && !item.contains(document.activeElement)) expanded(button, false);
  });
  item.addEventListener('focusout', event => {
    if (!item.contains(event.relatedTarget)) expanded(button, false);
  });
  item.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || button.getAttribute('aria-expanded') === 'false') return;
    event.preventDefault();
    expanded(button, false);
    button.focus();
  });
}
document.addEventListener('click', event => {
  if (!desktop.contains(event.target)) closeDesktop();
});
