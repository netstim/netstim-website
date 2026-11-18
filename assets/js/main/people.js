// People and Posters (layouts/_partials/people-page.html, posters-page.html): a card opens its dialog.
// - Each dialog has an address (#andreas-horn, #GoedeSummit): opening pushes it, Back closes the dialog, and
//   opening the page at it opens the dialog.
// - Where the browser has view transitions, the photo grows from the card into the dialog and the panel
//   slides in; only those two move (the page itself is not cross-faded). Reduced motion: at once.
// - Closing by the button, Escape, a click outside or Back all run the same close.
// - Focus returns to the card, with a ring only when the dialog was opened from the keyboard.
import { wireDialog } from './dialog.js';

const still = matchMedia('(prefers-reduced-motion: reduce)');
const morph = (dialog, update) => (!dialog.classList.contains('person-sheet') && document.startViewTransition && !still.matches)
  ? document.startViewTransition(update)
  : (update(), null);
const entries = [];

for (const card of document.querySelectorAll('[data-person]')) {
  const dialog = document.getElementById(card.dataset.person);
  if (!dialog) continue;
  const slug = card.dataset.slug || card.closest('li')?.id || '';
  const thumb = card.querySelector('[data-morph]');
  const photo = dialog.querySelector('[data-morph]');
  const name = (el, value) => { if (el) el.style.viewTransitionName = value; };
  let viaKeyboard = false;
  let pushed = false;
  let closing = false;
  card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') viaKeyboard = true; });
  card.addEventListener('pointerdown', () => { viaKeyboard = false; });

  const open = ({ push = true } = {}) => {
    if (dialog.open) return;
    name(thumb, 'person-photo');
    const t = morph(dialog, () => {
      name(thumb, '');
      name(photo, 'person-photo');
      dialog.style.viewTransitionName = 'person-panel';
      dialog.showModal();
      dialog.focus({ preventScroll: true });
      dialog.scrollTop = 0;
    });
    const done = () => { name(photo, ''); dialog.style.viewTransitionName = ''; };
    t ? t.finished.finally(done) : done();
    if (push && slug) { history.pushState({ dialog: slug }, '', '#' + slug); pushed = true; }
  };
  const close = ({ fromHistory = false } = {}) => {
    if (!dialog.open || closing) return;
    closing = true;
    name(photo, 'person-photo');
    dialog.style.viewTransitionName = 'person-panel';
    const t = morph(dialog, () => {
      name(photo, '');
      name(thumb, 'person-photo');
      dialog.style.viewTransitionName = '';
      dialog.close();
    });
    const done = () => {
      closing = false;
      name(thumb, '');
      card.focus({ preventScroll: true, focusVisible: viaKeyboard });
      if (!viaKeyboard) card.classList.add('no-ring');
    };
    t ? t.finished.finally(done) : done();
    if (!fromHistory && pushed) { pushed = false; history.back(); }
    else if (!fromHistory && location.hash === '#' + slug) history.replaceState(null, '', location.pathname + location.search);
    pushed = false;
  };
  card.addEventListener('blur', () => card.classList.remove('no-ring'));
  card.addEventListener('click', () => open());
  wireDialog(dialog, [], { dismiss: () => close() });
  dialog.querySelector('form[method="dialog"]')?.addEventListener('submit', event => { event.preventDefault(); close(); });
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  entries.push({ slug, open, close, dialog });
}

function fromHash() {
  const hash = location.hash.slice(1);
  try {
    return decodeURIComponent(hash);
  } catch (error) {
    if (!(error instanceof URIError)) throw error;
    return hash;
  }
}
window.addEventListener('popstate', () => {
  const wanted = fromHash();
  for (const entry of entries) {
    if (entry.dialog.open && entry.slug !== wanted) entry.close({ fromHistory: true });
  }
  entries.find(entry => entry.slug && entry.slug === wanted)?.open({ push: false });
});
// opened at an address (a shared link, or an old poster anchor)
entries.find(entry => entry.slug && entry.slug === fromHash())?.open({ push: false });
// the sheet's bar shows the name once the head has scrolled away
for (const sheet of document.querySelectorAll('.person-sheet')) {
  sheet.addEventListener('scroll', () => sheet.classList.toggle('is-scrolled', sheet.scrollTop > 120), { passive: true });
}
