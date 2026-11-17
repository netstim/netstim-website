import assert from 'node:assert/strict';
import {chromium, devices, localOnly, webkit} from './browser-lib.mjs';
import {serve} from './serve.mjs';

const [dir = 'public', base = 'https://www.netstim.org/'] = process.argv.slice(2);
const prefix = new URL(base).pathname;
const {origin, close} = await serve(dir, {prefix});
const at = route => origin + prefix + route;
try {
  for (const engine of [chromium, webkit]) {
    const browser = await engine.launch();
    try {
      const ctx = await browser.newContext({...devices['iPhone 15'], viewport:{width:390, height:844}});
      await localOnly(ctx, origin, true);
      const page = await ctx.newPage();
      await page.goto(at(''));
      const menuButton = page.getByRole('button', {name:'Open menu'});
      await menuButton.click();
      const menu = page.getByRole('dialog', {name:'Menu'});
      assert(await menu.isVisible());
      const closeButton = menu.getByRole('button', {name:'Close menu'});
      await closeButton.focus();
      await page.keyboard.press('Shift+Tab');
      assert(await menu.evaluate(el => el.contains(document.activeElement)));
      assert.equal(await menu.evaluate(() => getComputedStyle(document.documentElement).overflow), 'hidden');
      await menu.getByRole('button', {name:'Publications pages'}).click();
      assert(await menu.getByRole('link', {name:'Posters', exact:true}).isVisible());
      await page.keyboard.press('Escape');
      assert.equal(await menu.isVisible(), false);
      assert(await menuButton.evaluate(el => el === document.activeElement));

      await page.getByRole('button', {name:'Switch to dark mode'}).click();
      assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'dark');
      await page.reload();
      assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'dark');

      await page.getByRole('button', {name:'Search', exact:true}).click();
      await page.getByRole('searchbox').fill('Normative Connectomes');
      await page.getByRole('dialog', {name:'Search'}).getByRole('link', {name:'Normative Connectomes', exact:true}).click();
      await page.waitForURL(at('research-interests/normative-connectomes/'));

      await page.goto(at('research-interests/publications/'));
      const allRows = await page.locator('.pub-row:visible').count();
      assert(allRows > 200);
      await page.getByRole('searchbox', {name:'Filter publications'}).fill('dysfunctome');
      assert(await page.locator('.pub-row:visible').count() < allRows);
      assert.match(await page.locator('[data-bib-count]').textContent(), /of \d+ publications/);
      await page.getByRole('searchbox', {name:'Filter publications'}).fill('');
      const cover = page.locator('.gallery a[data-lightbox]').first();
      await cover.click();
      const viewer = page.getByRole('dialog', {name:'Image viewer'});
      assert(await viewer.isVisible());
      await page.keyboard.press('ArrowRight');
      assert.match(await viewer.locator('[role=status]').textContent(), /^2 \/ /);
      await page.keyboard.press('Escape');
      assert.equal(await viewer.isVisible(), false);
      assert(await cover.evaluate(el => el === document.activeElement));

      await page.goto(at('research-interests/the-book/'));
      await page.getByRole('button', {name:'Next image'}).first().click();
      assert.match(await page.locator('.slide-controls [role=status]').first().textContent(), /^2 \/ /);

      await page.goto(at('research-interests/videos-talks/'));
      assert.equal(await page.locator('iframe').count(), 0);
      await page.locator('.video-start').first().click();
      assert.match(await page.locator('iframe').first().getAttribute('src'), /^https:\/\/(www\.youtube-nocookie\.com|player\.vimeo\.com)\//);
      await ctx.close();
    } finally { await browser.close(); }
  }
} finally { await close(); }
console.log('Chromium and WebKit passed the menu, keyboard and scroll lock, persisted theme, search, publications, gallery, slideshow and consent-before-video checks.');
