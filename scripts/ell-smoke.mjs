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
await page.waitForTimeout(700);
const hello = page.getByRole('button', { name: /let'?s draw/i });
if (await hello.count()) { await hello.click(); await page.waitForTimeout(250); }
const blank = page.locator('.template-card').filter({ hasText: /Blank|Vacío/ }).first();
if (await blank.count()) { await blank.click(); await page.waitForTimeout(500); pass('blank'); }

const ver = await page.locator('.ver-chip').first().innerText().catch(() => '');
if ((ver || '').includes('1.1.4')) pass('version 1.1.4');
else log.push('NOTE version ' + JSON.stringify(ver));

const showPanels = page.getByRole('button', { name: /Show Teach|Mostrar Enseñar|Показати/i });
if (await showPanels.count()) await showPanels.click();
await page.locator('.dock-rail-btn').filter({ hasText: /Settings|Ajustes|Налашт/ }).first().click();
await page.waitForTimeout(400);

const uk = page.locator('.aw-shell-chip').filter({ hasText: 'Українська' }).first();
if (!(await uk.count())) fail('uk chip missing');
else await uk.click();
await page.waitForTimeout(400);

const ellBox = page.locator('#customize-title').locator('xpath=ancestor::aside').locator('label').filter({ hasText: /Teach English words|Вчити англійські/ });
if (await ellBox.count()) pass('ell checkbox present');
else {
  const drawer = await page.locator('.customize-drawer').innerText();
  if (/Вчити англійські|Teach English words/.test(drawer)) pass('ell copy in settings');
  else fail('ell setting missing: ' + drawer.slice(0, 280));
}

await page.screenshot({ path: '/workspace/screenshots/ell-settings-uk.png' });

await page.locator('.customize-drawer .ghost-btn, .customize-drawer .secondary-btn').first().click();
await page.waitForTimeout(300);

const wallLabel = await page.locator('.tool-rail-btn').filter({ hasText: /Wall/ }).first().innerText().catch(() => '');
if (/Wall/.test(wallLabel) && /Стіна/.test(wallLabel)) pass('tool Wall + Стіна');
else fail('tool wall label: ' + JSON.stringify(wallLabel));

await page.screenshot({ path: '/workspace/screenshots/ell-tools-uk.png' });

const showAgain = page.getByRole('button', { name: /Показати Навчання|Show Teach/i });
if (await showAgain.count()) await showAgain.click();
await page.waitForTimeout(200);
await page.locator('.dock-rail-btn').filter({ hasText: /Навчання|Teach/ }).last().click();
await page.waitForTimeout(400);

const sayWall = await page.locator('.vocab-ell-say').filter({ hasText: /Wall/ }).first().innerText().catch(() => '');
if (/Wall/.test(sayWall)) pass('vocab Say Wall');
else fail('say wall: ' + JSON.stringify(sayWall));

const practice = await page.locator('.ell-practice h3').innerText().catch(() => '');
if (/англійськ|English/.test(practice)) pass('practice heading');
else fail('practice heading: ' + JSON.stringify(practice));

const enChip = page.locator('.ell-practice-col[lang="en"] .ell-chip').filter({ hasText: 'Wall' }).first();
const homeChip = page.locator('.ell-chip-home').filter({ hasText: 'Стіна' }).first();
if (await enChip.count() && await homeChip.count()) {
  await enChip.click();
  await homeChip.click();
  await page.waitForTimeout(200);
  const matched = await enChip.getAttribute('class');
  if ((matched || '').includes('is-matched')) pass('matched Wall / Стіна');
  else fail('match class ' + matched);
} else fail('practice chips missing');

await page.screenshot({ path: '/workspace/screenshots/ell-teach-uk.png' });

writeFileSync('/tmp/ell-smoke.txt', log.join('\n') + '\n');
console.log(log.join('\n'));
await browser.close();
process.exit(log.some((l) => l.startsWith('FAIL')) ? 1 : 0);
