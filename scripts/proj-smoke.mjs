import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

mkdirSync('/workspace/screenshots', { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
await context.addInitScript(() => {
  try {
    localStorage.setItem('baboo-hello-seen-v1', '1');
    indexedDB.deleteDatabase('archworks');
  } catch { /* ignore */ }
});
const page = await context.newPage();
page.setDefaultTimeout(18000);
const log = [];
const fail = (m) => log.push('FAIL ' + m);
const pass = (m) => log.push('PASS ' + m);

await page.goto('http://127.0.0.1:8080/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.chrome, .hello-card, .new-project-modal', { timeout: 20000 });
await page.waitForTimeout(700);
const hello = page.getByRole('button', { name: /let'?s draw/i });
if (await hello.count()) { await hello.click(); await page.waitForTimeout(200); }
const ranch = page.locator('.template-card').filter({ hasText: /Ranch/ }).first();
if (await ranch.count()) { await ranch.click(); await page.waitForTimeout(800); pass('ranch'); }

const ver = await page.locator('.ver-chip').first().innerText().catch(() => '');
if ((ver || '').includes('1.1.7')) pass('version 1.1.7');
else log.push('NOTE version ' + JSON.stringify(ver));

await page.locator('button.chrome-ico').filter({ hasText: /Dollhouse|Casa/ }).first().click();
await page.waitForTimeout(500);
if (await page.locator('.doll-proj').count()) pass('proj bar');
else fail('no proj bar');

const lesson = await page.locator('.doll-proj-lesson').innerText();
if (/Isometric/i.test(lesson)) pass('iso lesson');
else fail('lesson ' + lesson.slice(0, 80));
await page.screenshot({ path: '/workspace/screenshots/doll-iso.png' });

await page.locator('.doll-chip').filter({ hasText: /^Right$/ }).first().click();
await page.waitForTimeout(250);
await page.screenshot({ path: '/workspace/screenshots/doll-iso-right.png' });
pass('turn right');

await page.locator('.doll-chip').filter({ hasText: /^Oblique$/ }).first().click();
await page.waitForTimeout(250);
const obl = await page.locator('.doll-proj-lesson').innerText();
if (/cabinet|Oblique|45/i.test(obl)) pass('oblique');
else fail('oblique ' + obl.slice(0, 80));
await page.screenshot({ path: '/workspace/screenshots/doll-oblique.png' });

await page.locator('.doll-chip').filter({ hasText: /^Elevation$/ }).first().click();
await page.waitForTimeout(250);
const el = await page.locator('.doll-proj-lesson').innerText();
if (/Elevation|true width/i.test(el)) pass('elevation');
else fail('elev ' + el.slice(0, 80));
await page.screenshot({ path: '/workspace/screenshots/doll-elevation.png' });

await page.locator('.doll-chip').filter({ hasText: /^Orthographic$/ }).first().click();
await page.waitForTimeout(200);
await page.locator('.doll-chip').filter({ hasText: /^Top$/ }).first().click();
await page.waitForTimeout(250);
const top = await page.locator('.doll-proj-lesson').innerText();
if (/top|plan/i.test(top)) pass('ortho top');
else fail('top ' + top.slice(0, 80));
await page.screenshot({ path: '/workspace/screenshots/doll-ortho-top.png' });

writeFileSync('/tmp/proj-smoke.txt', log.join('\n') + '\n');
console.log(log.join('\n'));
await browser.close();
process.exit(log.some((l) => l.startsWith('FAIL')) ? 1 : 0);
