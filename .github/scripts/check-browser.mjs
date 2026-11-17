import {mkdir, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {axePath, chromium, devices, localOnly, routes, webkit} from './browser-lib.mjs';
import {serve} from './serve.mjs';

const [dir = 'public', base = 'https://www.netstim.org/', output] = process.argv.slice(2);
if (!axePath) throw new Error('Install the test dependencies or set AXE_SCRIPT to axe-core 4.10.3');
const prefix = new URL(base).pathname;
const {origin, close} = await serve(dir, {prefix});
const viewport = width => ({width, height: width === 1440 ? 900 : 844});
const tests = ['light', 'dark'].flatMap(colorScheme => [1440, 820, 390, 320].map(width => ({width, colorScheme})));
const report = [];
if (output) await mkdir(output, {recursive:true});

async function check(engine, profile, widths, runAxe) {
  const browser = await engine.launch();
  const queue = tests.filter(t => widths.includes(t.width));
  try {
    await Promise.all(Array.from({length:4}, async () => {
      while (queue.length) {
        const {width, colorScheme} = queue.shift();
        const phone = width < 500;
        const context = await browser.newContext({
          ...((profile === 'webkit' && phone) ? devices['iPhone 15'] : {}),
          viewport:viewport(width), screen:viewport(width), deviceScaleFactor:1, colorScheme, reducedMotion:'reduce',
        });
        await localOnly(context, origin);
        if (runAxe && (width === 1440 || width === 390)) await context.addInitScript({path:axePath});
        const page = await context.newPage();
        for (const route of [...routes, '/404.html']) {
          const item = {profile, width, colorScheme, route, errors:[]};
          const external = request => {
            if (!request.url().startsWith(origin + '/')) item.errors.push('External request ' + request.url());
          };
          const failure = response => {
            if (response.status() >= 400) item.errors.push('HTTP ' + response.status() + ' ' + response.url());
          };
          const crash = error => item.errors.push(String(error));
          page.on('request', external).on('response', failure).on('pageerror', crash);
          try {
            const url = origin + prefix + route.slice(1);
            await page.goto(url, {waitUntil:'load', timeout:25000});
            await page.evaluate(() => document.fonts.ready);
            const layout = await page.evaluate(() => ({
              width:document.documentElement.scrollWidth, viewport:innerWidth, theme:document.documentElement.dataset.theme,
              offenders:[...document.querySelectorAll('main *')].filter(el => {
                const r = el.getBoundingClientRect();
                return r.width && r.right > innerWidth + 1;
              }).slice(0, 8).map(el => el.tagName + '.' + el.className),
            }));
            if (layout.width > layout.viewport + 1) item.errors.push(`Overflow ${layout.width}px in ${layout.viewport}px: ${layout.offenders.join(', ')}`);
            if (layout.theme !== colorScheme) item.errors.push('Incorrect color theme ' + layout.theme);
            if (runAxe && (width === 1440 || width === 390)) {
              item.axe = await page.evaluate(async () => {
                const result = await axe.run();
                return {
                  violations: result.violations.map(v => ({id:v.id, nodes:v.nodes.map(n => ({target:n.target, reason:n.failureSummary}))})),
                  incomplete: result.incomplete.map(v => ({id:v.id, count:v.nodes.length})),
                };
              });
              if (item.axe.violations.length) item.errors.push('axe: ' + item.axe.violations.map(v => v.id).join(', '));
            }
          } catch (error) { item.errors.push(String(error)); }
          page.off('request', external).off('response', failure).off('pageerror', crash);
          report.push(item);
        }
        await context.close();
      }
    }));
  } finally { await browser.close(); }
}
try {
  await check(chromium, 'chromium', [1440,820,390,320], true);
  await check(webkit, 'webkit', [390,320], false);
} finally { await close(); }
if (output) await writeFile(join(output, 'browser.json'), JSON.stringify(report, null, 2));
const failed = report.filter(row => row.errors.length);
for (const row of failed) console.error(row.profile, row.width, row.colorScheme, row.route, row.errors.join(' | '));
console.log(`${report.length} browser visits, ${report.filter(r => r.axe).length} axe runs, ${failed.length} failed visits.`);
if (failed.length) process.exitCode = 1;
