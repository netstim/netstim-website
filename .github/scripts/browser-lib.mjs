import {createRequire} from 'node:module';
import {readFile} from 'node:fs/promises';

const require = createRequire(import.meta.url);
export const {chromium, webkit, devices} = require('playwright');
const manifest = JSON.parse(await readFile(new URL('../../tests/migration.json', import.meta.url)));
export const routes = manifest.crawl;
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
