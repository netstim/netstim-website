import { wireDialog } from './dialog.js';

const phone = document.querySelector('.phone-menu');
const menu = document.querySelector('[data-menu-open]');
const desktop = document.querySelector('.desktop-nav');

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
for (const button of toggles) {
  const item = button.closest('.nav-item');
  if (!desktop.contains(button)) {
    button.addEventListener('click', () => expanded(button, !isOpen(button)));
    continue;
  }
  button.addEventListener('click', () => {
    closeDesktop(button);
    expanded(button, !isOpen(button));
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
document.addEventListener('click', event => {
  if (!desktop.contains(event.target)) closeDesktop();
});
