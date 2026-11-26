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
      // a group in the phone menu unfolds its pages; a plain item stays a link
      const group = menu.getByRole('button', {name:'Publications', exact:true});
      assert.equal(await group.getAttribute('aria-expanded'), 'false');
      assert.equal(await menu.getByRole('link', {name:'Posters', exact:true}).isVisible(), false);
      await group.click();
      assert.equal(await group.getAttribute('aria-expanded'), 'true');
      assert(await menu.getByRole('link', {name:'Posters', exact:true}).isVisible());
      assert.match(await menu.getByRole('link', {name:'Posters', exact:true}).getAttribute('href'), /publications\/posters\/$/);
      await group.click();
      assert.equal(await menu.getByRole('link', {name:'Posters', exact:true}).isVisible(), false);
      assert(await menu.getByRole('link', {name:'News', exact:true}).isVisible());
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.keyboard.press('Escape');
      await menu.waitFor({state:'hidden', timeout:5000});
      assert(await menuButton.evaluate(el => el === document.activeElement));

      await page.getByRole('button', {name:'Switch to dark mode'}).click();
      assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'dark');
      await page.reload();
      assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'dark');

      await page.getByRole('button', {name:'Search', exact:true}).click();
      await page.getByRole('searchbox').fill('Normative Connectomes');
      await page.getByRole('dialog', {name:'Search'}).getByRole('link', {name:/^Normative Connectomes/}).first().click();
      await page.waitForURL(at('research/normative-connectomes/'));

      await page.goto(at('publications/'));
      // Publications opens on Selected; clicking "All N publications" switches to the News-style All papers view
      const selectedCount = await page.locator('.sel-paper:visible').count();
      assert(selectedCount >= 5);
      assert.equal(await page.locator('.pub-row:visible').count(), 0);
      await page.locator('[data-bib-open-all]').click();
      await page.waitForURL(/\?view=all$/);
      const allRows = await page.locator('.pub-row:visible').count();
      assert(allRows > 190);
      // the filter and topic narrow papers across all years and hide empty years
      await page.getByRole('searchbox', {name:'Filter publications'}).fill('2015');
      assert(await page.locator('.pub-row:visible').count() > 0);
      assert(await page.locator('.pub-row:visible').count() < allRows);
      await page.getByRole('searchbox', {name:'Filter publications'}).fill('dysfunctome');
      assert(await page.locator('.pub-row:visible').count() < allRows);
      assert.match(await page.locator('[data-bib-count]').textContent(), /of \d+ papers/);
      await page.getByRole('searchbox', {name:'Filter publications'}).fill('');
      assert.equal(await page.locator('.pub-row:visible').count(), allRows);
      await page.getByRole('combobox', {name:'Topic'}).selectOption('lead-dbs');
      await page.waitForURL(/\?topic=lead-dbs$/);
      const topicRows = await page.locator('.pub-row:visible').count();
      assert(topicRows > 0 && topicRows < allRows);
      assert.equal(await page.locator('.pub-row:visible:not([data-topics~="lead-dbs"])').count(), 0);
      // the address alone gives the same list (Research links to it), and Back returns to it
      await page.reload();
      assert.equal(await page.locator('.pub-row:visible').count(), topicRows);
      assert.equal(await page.getByRole('combobox', {name:'Topic'}).inputValue(), 'lead-dbs');
      await page.getByRole('combobox', {name:'Topic'}).selectOption('');
      assert.equal(await page.locator('.pub-row:visible').count(), allRows);
      await page.goBack();
      assert.equal(await page.locator('.pub-row:visible').count(), topicRows);
      // switching back to Selected hides All and returns to selected papers
      await page.getByRole('tab', {name:'Selected', exact:true}).click();
      assert.equal(await page.locator('.sel-paper:visible').count(), selectedCount);
      assert.equal(await page.locator('.pub-row:visible').count(), 0);
      await page.goto(at(''));
      const cover = page.locator('.home-covers a[data-lightbox]').first();
      await cover.click();
      const viewer = page.getByRole('dialog', {name:'Image viewer'});
      assert(await viewer.isVisible());
      await page.keyboard.press('ArrowRight');
      assert.match(await viewer.locator('[role=status]').textContent(), /^2 \/ /);
      await page.keyboard.press('Escape');
      assert.equal(await viewer.isVisible(), false);
      assert(await cover.evaluate(el => el === document.activeElement));
      // the opening (and People section): the pictures change by themselves, and the round button stops and starts that
      for (const selector of ['.home-intro [data-banner-toggle]', '.home-people [data-banner-toggle]']) {
        const pictures = page.locator(selector);
        assert(await pictures.isVisible());
        assert(await pictures.evaluate(el => el.offsetWidth >= 44 && el.offsetHeight >= 44));
        await pictures.click();
        assert.equal(await pictures.getAttribute('aria-label'), 'Play the changing pictures');
        await pictures.click();
        assert.equal(await pictures.getAttribute('aria-label'), 'Pause the changing pictures');
      }

      await page.goto(at('publications/talks/'));
      assert.equal(await page.locator('iframe').count(), 0);
      await page.locator('.video-start').first().click();
      assert.match(await page.locator('iframe').first().getAttribute('src'), /^https:\/\/(www\.youtube-nocookie\.com|player\.vimeo\.com)\//);

      // Research on a phone: an area is its title, then its plate, then the text; its links are rows of touch height
      await page.goto(at('research/'));
      assert(await page.locator('.theme').evaluateAll(list => list.length >= 3 && list.every(theme => {
        const top = part => theme.querySelector(part).getBoundingClientRect().top;
        return top('.theme__title') < top('.theme__media') && top('.theme__media') < top('.theme__lede');
      })));
      assert(await page.locator('.theme__links a').evaluateAll(list => list.every(link => link.offsetHeight >= 44)));
      // Publications on a phone: Selected opens by default, switching to All shows the topic select beside "All papers" and filters without overflow
      await page.goto(at('publications/'));
      const selected = await page.locator('.sel-paper').count();
      assert.equal(await page.locator('.sel-paper:visible').count(), selected);
      await page.getByRole('tab', {name:/^All \(/}).click();
      const phoneTopic = page.getByRole('combobox', {name:'Topic'});
      assert(await phoneTopic.evaluate(el => el.offsetHeight >= 44 && Math.abs(el.getBoundingClientRect().top - document.getElementById('publications-h').getBoundingClientRect().top) < 44));
      await phoneTopic.selectOption('tms');
      assert(await page.locator('.pub-row:visible').count() > 0);
      assert.equal(await page.locator('.pub-row:visible:not([data-topics~="tms"])').count(), 0);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
      await ctx.close();

      // the desktop menu: the arrow button opens its sheet by keyboard, the arrow keys and Tab move
      // through it, Escape closes it (a short fade) and returns focus, and the title stays a link to
      // the section. The sheet spans the window without making the page scroll sideways.
      const wide = await browser.newContext({viewport:{width:1280, height:800}});
      await localOnly(wide, origin, true);
      const desk = await wide.newPage();
      await desk.goto(at(''));
      const bar = desk.getByRole('navigation', {name:'Main navigation'});
      const arrow = bar.getByRole('button', {name:'Research pages'});
      const sub = bar.getByRole('link', {name:/^Normative Connectomes/});
      const focusIn = () => desk.evaluate(() => document.activeElement.closest('.nav-panel')?.id || document.activeElement.className);
      assert.match(await bar.getByRole('link', {name:'Research', exact:true}).getAttribute('href'), /research\/$/);
      assert.equal(await sub.isVisible(), false);
      await arrow.focus();
      await desk.keyboard.press('Enter');
      assert.equal(await arrow.getAttribute('aria-expanded'), 'true');
      assert(await sub.isVisible());
      assert(await desk.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
      await desk.keyboard.press('ArrowDown');
      assert.equal(await focusIn(), 'nav-desktop-0');
      await desk.keyboard.press('Escape');
      assert.equal(await arrow.getAttribute('aria-expanded'), 'false');
      assert(await arrow.evaluate(el => el === document.activeElement));
      await sub.waitFor({state:'hidden', timeout:5000});
      await desk.keyboard.press('Space');
      assert.equal(await arrow.getAttribute('aria-expanded'), 'true');
      // Tab goes into the sheet (WebKit skips links unless the reader has set it to stop at them) and
      // out again without a trap; leaving closes the sheet
      await desk.keyboard.press('Tab');
      if (engine === chromium) assert.equal(await focusIn(), 'nav-desktop-0');
      for (let i = 0; i < 6 && await arrow.getAttribute('aria-expanded') === 'true'; i++) await desk.keyboard.press('Tab');
      assert.equal(await arrow.getAttribute('aria-expanded'), 'false');
      await sub.waitFor({state:'hidden', timeout:5000});
      // a mouse opens the sheet on hover and a press outside closes it
      await bar.getByRole('link', {name:'Publications', exact:true}).hover();
      await bar.getByRole('link', {name:/^Posters/}).waitFor({state:'visible', timeout:5000});
      await bar.getByRole('button', {name:'Publications pages'}).click();
      await desk.mouse.move(640, 700);
      await desk.waitForTimeout(400);
      assert(await bar.getByRole('link', {name:/^Posters/}).isVisible());
      await desk.mouse.click(640, 700);
      await bar.getByRole('link', {name:/^Posters/}).waitFor({state:'hidden', timeout:5000});
      // Research on a desktop: the rows take turns (a plate at the right, a smaller one at the left, one across the
      // page), so the plates are not one size. Yet every plate, title and paragraph starts on one of two lines, the
      // page title's or the seventh column's, and stays inside the page's column; no plate lies over its own text;
      // the first row's text starts on the line of the page title
      await desk.goto(at('research/'));
      const areas = await desk.locator('.theme').evaluateAll(list => list.map(theme => Object.fromEntries(['frame', 'title', 'lede'].map(part => {
        const box = theme.querySelector(`.theme__${part}`).getBoundingClientRect();
        return [part, [box.left, box.right, box.top, box.bottom].map(Math.round)];
      }))));
      assert(areas.length >= 3);
      const [pageLeft, pageRight, titleLeft] = await desk.evaluate(() => {
        const page = document.querySelector('.theme-group__themes').getBoundingClientRect();
        return [page.left, page.right, document.querySelector('h1').getBoundingClientRect().left].map(Math.round);
      });
      const parts = areas.flatMap(area => Object.values(area));
      assert(parts.every(([left, right]) => left >= pageLeft && right <= pageRight));
      const starts = new Set(parts.map(([left]) => left));
      assert(starts.size === 2 && starts.has(titleLeft));
      assert(new Set(areas.map(({frame}) => frame[1] - frame[0])).size >= 2);
      const apart = (a, b) => a[1] <= b[0] || b[1] <= a[0] || a[3] <= b[2] || b[3] <= a[2];
      assert(areas.every(({frame, title, lede}) => apart(frame, title) && apart(frame, lede)));
      assert(areas[0].title[0] === titleLeft && areas[0].lede[0] === titleLeft);
      // Publications on a desktop: every title, selected or all, and the filter box start on one line
      await desk.goto(at('publications/'));
      const selLefts = await desk.evaluate(() => [...new Set([...document.querySelectorAll('.sel-paper h3')].map(el => Math.round(el.getBoundingClientRect().left)))]);
      assert.equal(selLefts.length, 1);
      await desk.getByRole('tab', {name:/^All \(/}).click();
      const allLefts = await desk.evaluate(() => [...new Set([...document.querySelectorAll('.pub-row h4, .bib-filter')].map(el => Math.round(el.getBoundingClientRect().left)))]);
      assert.deepEqual(allLefts, selLefts);
      await wide.close();
    } finally { await browser.close(); }
  }
} finally { await close(); }
console.log('Chromium and WebKit passed the phone menu and its groups, the desktop menu sheets by keyboard and mouse, scroll lock, persisted theme, search, publications, gallery and consent-before-video checks.');
