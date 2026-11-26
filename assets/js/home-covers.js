// Prev/next buttons for horizontal photo/cover strips (Home covers and People lab-life). Without this script
// a strip still scrolls by touch, trackpad and keyboard; with it the buttons appear, scroll by most of the
// strip's width, and switch off at either end.
const still = matchMedia('(prefers-reduced-motion: reduce)');
for (const strip of document.querySelectorAll('[data-covers]')) {
  const scroller = strip.querySelector('[data-covers-scroller]');
  const nav = strip.querySelector('[data-covers-nav]');
  const buttons = [...nav.querySelectorAll('[data-covers-step]')];
  const update = () => {
    const end = scroller.scrollWidth - scroller.clientWidth;
    for (const button of buttons) {
      button.disabled = Number(button.dataset.coversStep) < 0 ? scroller.scrollLeft <= 2 : scroller.scrollLeft >= end - 2;
    }
  };
  for (const button of buttons) {
    button.addEventListener('click', () => {
      const distance = Math.max(240, scroller.clientWidth * 0.72) * Number(button.dataset.coversStep);
      scroller.scrollBy({ left: distance, behavior: still.matches ? 'auto' : 'smooth' });
    });
  }
  scroller.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(scroller);
  nav.hidden = false;
  strip.classList.add('is-enhanced');
  update();
}
