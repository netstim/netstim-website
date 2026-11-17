// People and Posters (layouts/_partials/people-page.html, posters-page.html): a card opens its dialog. Where the browser
// has view transitions, the photo zooms from the card into the dialog and back; otherwise the dialog fades
// in (CSS). Reduced motion opens and closes at once.
import { wireDialog } from './dialog.js';

const still = matchMedia('(prefers-reduced-motion: reduce)');
const morph = update => (document.startViewTransition && !still.matches)
  ? document.startViewTransition(update)
  : (update(), null);

for (const card of document.querySelectorAll('[data-person]')) {
  const dialog = document.getElementById(card.dataset.person);
  if (!dialog) continue;
  const thumb = card.querySelector('[data-morph]');
  const photo = dialog.querySelector('[data-morph]');
  wireDialog(dialog, []);
  const name = (el, value) => { if (el) el.style.viewTransitionName = value; };

  const open = () => {
    if (dialog.open) return;
    name(thumb, 'person-photo');
    const t = morph(() => {
      name(thumb, '');
      name(photo, 'person-photo');
      dialog.style.viewTransitionName = 'person-panel';
      dialog.showModal();
      dialog.scrollTop = 0;
    });
    const done = () => { name(photo, ''); dialog.style.viewTransitionName = ''; dialog.scrollTop = 0; };
    requestAnimationFrame(() => { dialog.scrollTop = 0; });
    t ? t.finished.finally(done) : done();
  };
  card.addEventListener('click', open);
  // an old deep link to a poster (#GoedeSummit) opens it
  if (location.hash && card.closest('li')?.id === decodeURIComponent(location.hash.slice(1))) open();

  const close = () => {
    name(photo, 'person-photo');
    dialog.style.viewTransitionName = 'person-panel';
    const t = morph(() => {
      name(photo, '');
      name(thumb, 'person-photo');
      dialog.style.viewTransitionName = '';
      dialog.close();
    });
    const done = () => { name(thumb, ''); card.focus({ preventScroll: true }); };
    t ? t.finished.finally(done) : done();
  };
  dialog.querySelector('form[method="dialog"]')?.addEventListener('submit', event => { event.preventDefault(); close(); });
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('close', () => card.focus({ preventScroll: true }));
}
