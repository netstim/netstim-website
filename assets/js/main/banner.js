// Home (layouts/home.html): the pictures of the opening change. A frame that holds several photos is a tile;
// every HOLD ms the next photo of every tile fades in over the last (opacity only, see assets/css/home.css),
// all tiles at the same time. The photos that wait are `hidden` and so not loaded; each is fetched while
// the one before it is on show. The duet layout also has a silent video loop, which plays while the photos
// change. Nothing moves under reduced motion, while the pictures are out of view or the tab is in the
// background, or after the visitor has pressed the pause button.
const banner = document.querySelector('[data-banner]');
const toggle = banner?.querySelector('[data-banner-toggle]');
const still = matchMedia('(prefers-reduced-motion: reduce)');
if (banner && toggle) {
  const HOLD = 6000;
  const FADE = 1000;
  const video = banner.querySelector('[data-banner-video]');
  const tiles = [...banner.querySelectorAll('[data-banner-tile]')]
    .map(frame => ({ frame, slides: [...frame.querySelectorAll('[data-banner-slide]')], at: 0 }));
  let timer = 0;
  let fading = false;
  let paused = false;
  let inView = true;
  // a tile the layout does not show at this width (display: none) is passed over
  const shown = () => tiles.filter(tile => tile.slides.length > 1 && tile.frame.offsetParent);
  const upcoming = tile => tile.slides[(tile.at + 1) % tile.slides.length];
  const allowed = () => (shown().length > 0 || !!video) && !still.matches;
  const running = () => allowed() && !paused && inView && !document.hidden;
  const step = () => {
    timer = 0;
    if (!running()) return;
    const now = shown();
    if (!now.length) return;
    const images = now.map(tile => upcoming(tile).querySelector('img'));
    if (images.some(img => !img.complete)) { timer = setTimeout(step, 400); return; }
    const broken = now.filter((tile, i) => !images[i].naturalWidth);
    if (broken.length) {
      // a file did not load: leave that photo out and go on
      for (const tile of broken) {
        const current = tile.slides[tile.at];
        const slide = upcoming(tile);
        slide.hidden = true;
        tile.slides.splice(tile.slides.indexOf(slide), 1);
        tile.at = tile.slides.indexOf(current);
      }
      sync();
      return;
    }
    fading = true;
    const done = now.map(tile => {
      const last = tile.slides[tile.at];
      const slide = upcoming(tile);
      slide.classList.add('is-in');
      slide.getBoundingClientRect();
      slide.classList.add('is-on');
      tile.at = tile.slides.indexOf(slide);
      return { last, slide };
    });
    setTimeout(() => {
      for (const { last, slide } of done) {
        last.classList.remove('is-on');
        last.hidden = true;
        slide.classList.remove('is-in');
      }
      fading = false;
      sync();
    }, FADE + 100);
  };
  const sync = () => {
    toggle.hidden = !allowed();
    if (video) {
      // a browser may refuse to start a video (power saving): it then stays on its still
      if (running()) { video.muted = true; video.play()?.catch(() => {}); } else video.pause();
    }
    if (!running()) { clearTimeout(timer); timer = 0; return; }
    if (timer || fading || !shown().length) return;
    for (const tile of shown()) {
      const slide = upcoming(tile);
      slide.querySelector('img').loading = 'eager';
      slide.hidden = false;
    }
    timer = setTimeout(step, HOLD);
  };
  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.classList.toggle('is-paused', paused);
    toggle.setAttribute('aria-label', paused ? toggle.dataset.play : toggle.dataset.pause);
    sync();
  });
  new IntersectionObserver(entries => {
    inView = entries[entries.length - 1].isIntersecting;
    sync();
  }).observe(banner);
  document.addEventListener('visibilitychange', sync);
  still.addEventListener('change', sync);
  addEventListener('resize', sync);
  sync();
}
