import {createRequire} from 'node:module';
import {readFile, readdir} from 'node:fs/promises';
import {join, relative, sep} from 'node:path';

const require = createRequire(import.meta.url);
export const {chromium, webkit, devices} = require('playwright');
// every page of the build (a forwarding page for an old address is skipped: its destination is a page)
export async function pageRoutes(dir) {
  const pages = [];
  for (const entry of await readdir(dir, {recursive: true})) {
    if (!entry.endsWith('index.html') || entry.startsWith('media' + sep) || entry.startsWith('wp-content' + sep)) continue;
    const html = await readFile(join(dir, entry), 'utf8');
    if (/http-equiv="?refresh/i.test(html)) continue;
    pages.push('/' + relative('.', entry).split(sep).join('/').replace(/index\.html$/, ''));
  }
  return pages.sort();
}
export const axePath = process.env.AXE_SCRIPT || (() => {
  try { return require.resolve('axe-core/axe.min.js'); } catch { return null; }
})();

export async function localOnly(context, origin, allowPlayer = false) {
  await context.route('**/*', request => {
    const url = new URL(request.request().url());
    if (url.origin === origin) return request.continue();
    if (allowPlayer && ['www.youtube-nocookie.com', 'player.vimeo.com', 'open.spotify.com', 'html5-player.libsyn.com'].includes(url.hostname)) {
      return request.fulfill({status:200, contentType:'text/html', body:'<!doctype html><title>Player</title>'});
    }
    return request.abort();
  });
}
