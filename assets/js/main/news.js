// News (layouts/_partials/timeline.html): with a fine pointer, the picture of the post under the pointer
// floats beside it. Only its transform and opacity change; touch, keyboard and reduced motion never see it.
const preview = document.querySelector('[data-news-preview]');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const still = matchMedia('(prefers-reduced-motion: reduce)');
if (preview) {
  let frame = 0;
  for (const row of document.querySelectorAll('.news-row[data-preview]')) {
    row.addEventListener('pointerenter', () => {
      if (!fine.matches || still.matches) return;
      if (preview.getAttribute('src') !== row.dataset.preview) preview.src = row.dataset.preview;
      preview.hidden = false;
      requestAnimationFrame(() => preview.classList.add('is-on'));
    });
    row.addEventListener('pointerleave', () => preview.classList.remove('is-on'));
  }
  document.addEventListener('pointermove', event => {
    if (!preview.classList.contains('is-on')) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      preview.style.transform = `translate(${event.clientX + 28}px, ${event.clientY - 90}px)`;
    });
  });
}
