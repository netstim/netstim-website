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
let hoverTimer;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const isOpen = button => button.getAttribute('aria-expanded') === 'true';
for (const button of toggles) {
  const item = button.closest('.nav-item');
  if (!desktop.contains(button)) {
    button.addEventListener('click', () => expanded(button, !isOpen(button)));
    continue;
  }
  item.addEventListener('pointerenter', event => {
    if (event.pointerType === 'touch' || !finePointer.matches) return;
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
      closeDesktop(button);
      expanded(button, true);
    }, 180);
  });
  item.addEventListener('pointerleave', event => {
    if (event.pointerType === 'touch' || !finePointer.matches) return;
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
      if (!item.contains(document.activeElement)) expanded(button, false);
    }, 180);
  });
  button.addEventListener('click', () => {
    clearTimeout(hoverTimer);
    closeDesktop(button);
    expanded(button, !isOpen(button));
  });
  item.addEventListener('focusout', event => {
    if (!item.contains(event.relatedTarget)) {
      clearTimeout(hoverTimer);
      expanded(button, false);
    }
  });
  item.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    clearTimeout(hoverTimer);
    if (!isOpen(button)) return;
    event.preventDefault();
    expanded(button, false);
    button.focus();
  });
}
document.addEventListener('click', event => {
  if (!desktop.contains(event.target)) closeDesktop();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    clearTimeout(hoverTimer);
    closeDesktop();
  }
});
