// Prev/next buttons and mouse click-and-drag scrolling for horizontal cover strips (layouts/home.html).
// Without this script a strip still scrolls by touch, trackpad and keyboard; with it the buttons appear,
// scroll by most of the strip's width, switch off at either end, and mouse users can grab and drag the strip
// while plain clicks still open the image viewer.
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

  let active = false;
  let moved = false;
  let suppressClick = false;
  let startX = 0;
  let startLeft = 0;
  scroller.addEventListener('dragstart', event => event.preventDefault());
  scroller.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    active = true;
    moved = false;
    startX = event.clientX;
    startLeft = scroller.scrollLeft;
  });
  scroller.addEventListener('pointermove', event => {
    if (!active) return;
    const dx = event.clientX - startX;
    if (!moved && Math.abs(dx) > 5) {
      moved = true;
      scroller.setPointerCapture(event.pointerId);
      scroller.classList.add('is-dragging');
    }
    if (moved) scroller.scrollLeft = startLeft - dx;
  });
  const endDrag = event => {
    if (!active) return;
    active = false;
    if (moved) {
      if (scroller.hasPointerCapture(event.pointerId)) scroller.releasePointerCapture(event.pointerId);
      scroller.classList.remove('is-dragging');
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 0);
    }
    moved = false;
  };
  scroller.addEventListener('pointerup', endDrag);
  scroller.addEventListener('pointercancel', endDrag);
  scroller.addEventListener('click', event => {
    if (!suppressClick) return;
    suppressClick = false;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);

  scroller.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(scroller);
  nav.hidden = false;
  strip.classList.add('is-enhanced');
  update();
}
