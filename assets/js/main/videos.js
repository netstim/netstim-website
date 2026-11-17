document.addEventListener('click', event => {
  const start = event.target.closest('.video-start');
  if (!start || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
  const facade = start.closest('.video-embed');
  const url = new URL(facade.dataset.embed);
  if (!['www.youtube-nocookie.com', 'player.vimeo.com', 'open.spotify.com', 'html5-player.libsyn.com'].includes(url.hostname)) return;
  event.preventDefault();
  url.searchParams.set('autoplay', '1');
  if (url.hostname === 'player.vimeo.com') url.searchParams.set('dnt', '1');
  const player = document.createElement('iframe');
  player.src = url;
  player.title = facade.dataset.embedTitle;
  player.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
  player.allowFullscreen = true;
  player.referrerPolicy = 'strict-origin-when-cross-origin';
  facade.replaceChildren(player);
  player.focus();
});
