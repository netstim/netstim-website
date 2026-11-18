import { wireDialog } from './dialog.js';

// a horizontal swipe on an element calls step(-1) or step(1); vertical scrolling stays native
function swipe(element, step) {
  let x = 0, y = 0, id = null;
  element.style.touchAction = 'pan-y';
  element.addEventListener('pointerdown', event => { if (event.pointerType !== 'mouse') { id = event.pointerId; x = event.clientX; y = event.clientY; } });
  element.addEventListener('pointerup', event => {
    if (event.pointerId !== id) return;
    id = null;
    const dx = event.clientX - x, dy = event.clientY - y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1);
  });
}
const chevron = direction => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${direction < 0 ? 'm14 6-6 6 6 6' : 'm10 6 6 6-6 6'}"/></svg>`;

for (const slideshow of document.querySelectorAll('.slideshow')) {
  const slides = [...slideshow.querySelectorAll('.slides > .slide')];
  if (slides.length < 2) continue;
  const controls = document.createElement('div');
  controls.className = 'slide-controls';
  const previous = document.createElement('button');
  previous.type = 'button';
  previous.className = 'icon-button';
  previous.innerHTML = chevron(-1);
  previous.setAttribute('aria-label', 'Previous image');
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'icon-button';
  next.innerHTML = chevron(1);
  next.setAttribute('aria-label', 'Next image');
  const status = document.createElement('span');
  status.setAttribute('role', 'status');
  controls.append(previous, status, next);
  slideshow.append(controls);
  let current = 0;
  function show(step) {
    current = (current + step + slides.length) % slides.length;
    slides.forEach((slide, index) => { slide.hidden = index !== current; });
    status.textContent = `${current + 1} / ${slides.length}`;
  }
  previous.addEventListener('click', () => show(-1));
  next.addEventListener('click', () => show(1));
  swipe(slideshow.querySelector('.slides'), show);
  show(0);
}


const viewer = document.querySelector('#image-viewer');
const openViewer = wireDialog(viewer, []);
const image = viewer.querySelector('img');
const caption = viewer.querySelector('figcaption');
const controls = viewer.querySelector('[data-image-controls]');
const position = viewer.querySelector('[data-image-index]');
let links = [];
let active = 0;
function showImage(step) {
  active = (active + step + links.length) % links.length;
  const link = links[active];
  const label = link.title || link.getAttribute('aria-label') || '';
  image.alt = link.querySelector('img')?.alt || label;
  image.src = link.href;
  caption.textContent = label;
  controls.hidden = links.length < 2;
  position.textContent = `${active + 1} / ${links.length}`;
}
document.addEventListener('click', event => {
  const link = event.target.closest('a[data-lightbox]');
  if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
  const gallery = link.closest('.gallery, .slideshow');
  links = gallery ? [...gallery.querySelectorAll('a[data-lightbox]')] : [link];
  active = links.indexOf(link);
  event.preventDefault();
  showImage(0);
  openViewer(link);
});
viewer.querySelector('[data-image-previous]').addEventListener('click', () => showImage(-1));
viewer.querySelector('[data-image-next]').addEventListener('click', () => showImage(1));
viewer.querySelector('[data-image-previous]').innerHTML = chevron(-1);
viewer.querySelector('[data-image-next]').innerHTML = chevron(1);
swipe(viewer.querySelector('figure'), step => { if (links.length > 1) showImage(step); });
viewer.addEventListener('keydown', event => {
  if (links.length < 2) return;
  if (event.key === 'ArrowLeft') showImage(-1);
  if (event.key === 'ArrowRight') showImage(1);
});
