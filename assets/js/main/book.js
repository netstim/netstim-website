// The home page's 3D book (layouts/_partials/book-section.html): with a fine pointer, the book turns a few
// degrees toward it from its resting angle. Only the transform changes. Reduced motion leaves it at rest.
const book = document.querySelector('[data-book]');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const still = matchMedia('(prefers-reduced-motion: reduce)');
if (book) {
  const area = book.closest('section') || book;
  let frame = 0;
  area.addEventListener('pointermove', event => {
    if (!fine.matches || still.matches) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const r = book.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (event.clientX - (r.left + r.width / 2)) / (r.width * 1.5)));
      const y = Math.max(-1, Math.min(1, (event.clientY - (r.top + r.height / 2)) / (r.height)));
      book.style.setProperty('--ry', `${-34 + x * 22}deg`);
      book.style.setProperty('--rx', `${8 - y * 10}deg`);
    });
  });
  area.addEventListener('pointerleave', () => {
    cancelAnimationFrame(frame);
    book.style.removeProperty('--ry');
    book.style.removeProperty('--rx');
  });
}
