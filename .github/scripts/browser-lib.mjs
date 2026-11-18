import {createRequire} from 'node:module';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const require = createRequire(import.meta.url);
export const {chromium, webkit, devices} = require('playwright');
const manifest = JSON.parse(await readFile(new URL('../../tests/migration.json', import.meta.url)));
export const routes = manifest.crawl;
// the crawled routes that are pages (a moved page is a redirect stub; its destination is checked itself)
export async function pageRoutes(dir) {
  const pages = [];
  for (const route of routes) {
    const html = await readFile(resolve(dir, `.${route}`, 'index.html'), 'utf8').catch(() => '');
    if (!/http-equiv="?refresh/i.test(html)) pages.push(route);
  }
  return pages;
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
