import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

mkdirSync('/workspace/screenshots', { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
await context.addInitScript(() => {
  try {
    localStorage.setItem('baboo-hello-seen-v1', '1');
    localStorage.removeItem('baboo-wall-cta-dismissed');
    indexedDB.deleteDatabase('archworks');
  } catch { /* ignore */ }
});
const page = await context.newPage();
page.setDefaultTimeout(15000);
const log = [];
const fail = (m) => log.push('FAIL ' + m);
const pass = (m) => log.push('PASS ' + m);

await page.goto('http://127.0.0.1:8080/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.chrome, .hello-card, .new-project-modal', { timeout: 20000 });
await page.waitForTimeout(600);
const hello = page.getByRole('button', { name: /let'?s draw/i });
if (await hello.count()) { await hello.click(); await page.waitForTimeout(250); }

const ranch = page.locator('.template-card').filter({ hasText: /Ranch/ }).first();
if (await ranch.count()) { await ranch.click(); await page.waitForTimeout(800); pass('ranch'); }
else fail('ranch card missing');

const ver = await page.locator('.ver-chip').first().innerText().catch(() => '');
if ((ver || '').includes('1.1.5')) pass('version 1.1.5');
else log.push('NOTE version ' + JSON.stringify(ver));

const north = await page.locator('.plan-north').innerText().catch(() => '');
if (/N/.test(north)) pass('north arrow');
else fail('north: ' + JSON.stringify(north));

const scale = await page.locator('.plan-scale-ticks').innerText().catch(() => '');
if (/ft|m/.test(scale)) pass('scale ticks ' + scale.trim());
else fail('scale: ' + JSON.stringify(scale));

const sheet = await page.locator('.plan-sheet').innerText().catch(() => '');
if (/SCALE|1 square/i.test(sheet)) pass('title block');
else fail('sheet: ' + JSON.stringify(sheet));

await page.screenshot({ path: '/workspace/screenshots/arch-ranch-sheet.png' });

const showPanels = page.getByRole('button', { name: /Show Teach|Mostrar Enseñar|Показати/i });
if (await showPanels.count()) await showPanels.click();
await page.waitForTimeout(200);
await page.locator('.dock-rail-btn').filter({ hasText: /Teach|Enseñar|Навчання/ }).first().click();
await page.waitForTimeout(400);

const read = await page.locator('.teaching-drawer').innerText().catch(() => '');
if (/Read this plan|closed envelope|A way in|Daylight/i.test(read)) pass('teach readout');
else fail('teach: ' + read.slice(0, 280));

const rows = page.locator('.teaching-drawer .access-row');
const n = await rows.count();
if (n >= 5) pass(`${n} architect rows`);
else fail('rows ' + n);

await page.screenshot({ path: '/workspace/screenshots/arch-teach-read.png' });

writeFileSync('/tmp/arch-smoke.txt', log.join('\n') + '\n');
console.log(log.join('\n'));
await browser.close();
process.exit(log.some((l) => l.startsWith('FAIL')) ? 1 : 0);
