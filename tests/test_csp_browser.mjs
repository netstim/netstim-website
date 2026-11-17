import {chromium, localOnly, routes} from '../.github/scripts/browser-lib.mjs';
import {serve} from '../.github/scripts/serve.mjs';

const [dir = 'public'] = process.argv.slice(2);
const {origin, close} = await serve(dir, {csp:true});
const browser = await chromium.launch();
const context = await browser.newContext();
const errors = [];
let videos = 0;
try {
  await localOnly(context, origin, true);
  await context.addInitScript(() => {
    window.violations = [];
    document.addEventListener('securitypolicyviolation', event => {
      window.violations.push(`${event.effectiveDirective} blocked ${event.blockedURI}`);
    });
  });
  const jobs = [...routes, '/404.html'];
  await Promise.all(Array.from({length:4}, async () => {
    const page = await context.newPage();
    while (jobs.length) {
      const route = jobs.shift();
      await page.goto(origin + route, {waitUntil:'load'});
      const starts = page.locator('.video-start');
      while (await starts.count()) {
        await starts.first().click();
        videos++;
      }
      for (const failure of await page.evaluate(() => window.violations)) errors.push(route + ' ' + failure);
    }
  }));
} finally { await browser.close(); await close(); }
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else console.log(`CSP enforced on ${routes.length + 1} pages with ${videos} activated videos. Zero violations.`);
