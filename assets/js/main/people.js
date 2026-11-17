// People (layouts/_partials/people-page.html): a portrait card opens its profile dialog. Where the browser
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
  const thumb = card.querySelector('.portrait-frame');
  const photo = dialog.querySelector('.person-dialog__photo .portrait-frame');
  wireDialog(dialog, []);
  const name = (el, value) => { if (el) el.style.viewTransitionName = value; };

  card.addEventListener('click', () => {
    if (dialog.open) return;
    name(thumb, 'person-photo');
    const t = morph(() => {
      name(thumb, '');
      name(photo, 'person-photo');
      dialog.showModal();
      dialog.scrollTop = 0;
    });
    const done = () => name(photo, '');
    t ? t.finished.finally(done) : done();
  });

  const close = () => {
    name(photo, 'person-photo');
    const t = morph(() => {
      name(photo, '');
      name(thumb, 'person-photo');
      dialog.close();
    });
    const done = () => { name(thumb, ''); card.focus({ preventScroll: true }); };
    t ? t.finished.finally(done) : done();
  };
  dialog.querySelector('.person-dialog__close')?.addEventListener('submit', event => { event.preventDefault(); close(); });
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  dialog.addEventListener('close', () => card.focus({ preventScroll: true }));
}
