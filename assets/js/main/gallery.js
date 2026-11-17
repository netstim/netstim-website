import { wireDialog } from './dialog.js';

for (const slideshow of document.querySelectorAll('.slideshow')) {
  const slides = [...slideshow.querySelectorAll('.slides > .slide')];
  if (slides.length < 2) continue;
  const controls = document.createElement('div');
  controls.className = 'slide-controls';
  const previous = document.createElement('button');
  previous.type = 'button';
  previous.className = 'icon-button';
  previous.textContent = '‹';
  previous.setAttribute('aria-label', 'Previous image');
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'icon-button';
  next.textContent = '›';
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
viewer.addEventListener('keydown', event => {
  if (links.length < 2) return;
  if (event.key === 'ArrowLeft') showImage(-1);
  if (event.key === 'ArrowRight') showImage(1);
});
