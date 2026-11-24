// The silent loop that opens a Research subject page (layouts/_partials/research-loop.html).
// The video plays only while it is on screen, never on its own for a visitor who asks for reduced motion,
// and the round button pauses and resumes it. Once the visitor has pressed the button, their choice stands.
for (const frame of document.querySelectorAll('[data-loop]')) {
  const video = frame.querySelector('video');
  const button = frame.querySelector('[data-loop-toggle]');
  if (!video || !button) continue;
  video.controls = false;
  video.muted = true;
  button.hidden = false;
  let stopped = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let onScreen = false;
  const show = () => {
    const playing = !video.paused;
    frame.classList.toggle('is-playing', playing);
    button.setAttribute('aria-label', playing ? 'Pause the animation' : 'Play the animation');
  };
  const play = () => { const started = video.play(); if (started) started.catch(() => {}); };
  video.addEventListener('play', show);
  video.addEventListener('pause', show);
  button.addEventListener('click', () => {
    stopped = !video.paused;
    if (stopped) video.pause(); else play();
  });
  new IntersectionObserver(entries => {
    onScreen = entries[entries.length - 1].isIntersecting;
    if (onScreen && !stopped) play(); else video.pause();
  }, { threshold: 0.25 }).observe(frame);
  show();
}
