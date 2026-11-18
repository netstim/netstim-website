// News (layouts/_partials/timeline.html): with a fine pointer, the picture of the post under the pointer
// floats beside it. Only its transform and opacity change; touch, keyboard and reduced motion never see it.
const preview = document.querySelector('[data-news-preview]');
const fine = matchMedia('(hover: hover) and (pointer: fine)');
const still = matchMedia('(prefers-reduced-motion: reduce)');
if (preview) {
  let frame = 0;
  const place = (x, y) => {
    const w = preview.offsetWidth || 240;
    const h = preview.offsetHeight || 180;
    const left = x + 28 + w > innerWidth - 12 ? x - 28 - w : x + 28;
    const top = Math.min(Math.max(12, y - h / 2), innerHeight - h - 12);
    preview.style.transform = `translate(${left}px, ${top}px)`;
  };
  for (const row of document.querySelectorAll('.news-row[data-preview]')) {
    row.addEventListener('pointerenter', event => {
      if (!fine.matches || still.matches) return;
      place(event.clientX, event.clientY);
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
      place(event.clientX, event.clientY);
    });
  });
}
