// Home: the two buttons of the journal-cover strip (layouts/home.html). Without this script the strip still
// scrolls by touch, trackpad and keyboard, and keeps its scrollbar; with it the buttons appear, move the
// strip by most of its width, and switch off at either end.
const strip = document.querySelector('[data-covers]');
if (strip) {
  const scroller = strip.querySelector('[data-covers-scroller]');
  const nav = strip.querySelector('[data-covers-nav]');
  const buttons = [...nav.querySelectorAll('[data-covers-step]')];
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  function update() {
    const end = scroller.scrollWidth - scroller.clientWidth;
    for (const button of buttons) {
      button.disabled = Number(button.dataset.coversStep) < 0 ? scroller.scrollLeft <= 2 : scroller.scrollLeft >= end - 2;
    }
  }
  for (const button of buttons) {
    button.addEventListener('click', () => {
      const distance = Math.max(200, scroller.clientWidth * 0.8) * Number(button.dataset.coversStep);
      scroller.scrollBy({ left: distance, behavior: still.matches ? 'auto' : 'smooth' });
    });
  }
  scroller.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(scroller);
  nav.hidden = false;
  strip.classList.add('is-enhanced');
  update();
}
