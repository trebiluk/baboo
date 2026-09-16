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
const fail = (m) => { log.push('FAIL ' + m); };
const pass = (m) => { log.push('PASS ' + m); };

await page.goto('http://127.0.0.1:8080/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.chrome, .hello-card, .new-project-modal', { timeout: 20000 });
await page.waitForTimeout(700);

const hello = page.getByRole('button', { name: /let'?s draw/i });
if (await hello.count()) {
  await hello.click();
  await page.waitForTimeout(250);
}

const blank = page.locator('.template-card').filter({ hasText: /Blank|Vacío/ }).first();
if (await blank.count()) {
  await blank.click();
  await page.waitForTimeout(500);
  pass('started blank plan');
} else {
  log.push('NOTE no Blank card');
}

const ver = await page.locator('.ver-chip').first().innerText().catch(() => '');
if ((ver || '').includes('1.1.3')) pass('version chip 1.1.3');
else log.push('NOTE version: ' + JSON.stringify(ver));

const showPanels = page.getByRole('button', { name: /Show Teach|Mostrar Enseñar/i });
if (await showPanels.count()) {
  await showPanels.click();
  await page.waitForTimeout(200);
}
const dockSettings = page.locator('.dock-rail-btn').filter({ hasText: /Settings|Ajustes/ });
if (await dockSettings.count()) {
  await dockSettings.click();
} else {
  const more = page.locator('.chrome-more-btn');
  await more.click();
  await page.getByRole('menuitem', { name: /Settings|Ajustes/ }).click();
}
await page.waitForTimeout(400);

if (await page.locator('#customize-title').count()) pass('settings drawer open');
else fail('settings drawer missing');

const chips = {
  English: 'en',
  Español: 'es',
  Cubano: 'cu',
  Українська: 'uk',
  Русский: 'ru',
  ትግርኛ: 'ti',
  فارسی: 'fa',
};

for (const [label, id] of Object.entries(chips)) {
  const btn = page.locator('.aw-shell-chip').filter({ hasText: label }).first();
  if (await btn.count()) pass('chip ' + label);
  else fail('missing chip ' + label + ' / ' + id);
}

const shots = [
  ['Українська', 'uk', 'Мова', 'vocab-uk.png'],
  ['Русский', 'ru', 'Язык', 'vocab-ru.png'],
  ['ትግርኛ', 'ti', 'ቋንቋ', 'vocab-ti.png'],
  ['Cubano', 'cu', 'Idioma', 'vocab-cu.png'],
  ['فارسی', 'fa', 'زبان', 'vocab-fa.png'],
];

for (const [label, id, heading, shot] of shots) {
  const btn = page.locator('.aw-shell-chip').filter({ hasText: label }).first();
  await btn.click();
  await page.waitForTimeout(350);
  const htmlLang = await page.evaluate(() => document.documentElement.lang);
  const dataLoc = await page.evaluate(() => document.documentElement.getAttribute('data-locale'));
  const dataDir = await page.evaluate(() => document.documentElement.getAttribute('data-dir'));
  if (dataLoc === id) pass('data-locale ' + id);
  else fail('data-locale for ' + id + ' got ' + dataLoc + ' lang=' + htmlLang);
  if (id === 'fa') {
    if (dataDir === 'rtl') pass('farsi data-dir rtl');
    else fail('farsi data-dir ' + dataDir);
    if (htmlLang === 'fa') pass('html lang fa');
    else fail('html lang ' + htmlLang);
  }
  const title = await page.locator('#lang-title').innerText().catch(() => '');
  if (title.includes(heading)) pass('heading ' + id + ' = ' + heading);
  else log.push('NOTE heading ' + id + ': ' + JSON.stringify(title));
  await page.screenshot({ path: '/workspace/screenshots/' + shot });
}

// Open Teach and check Ukrainian vocab after switching back to uk
const ukBtn = page.locator('.aw-shell-chip').filter({ hasText: 'Українська' }).first();
await ukBtn.click();
await page.waitForTimeout(250);
const closeSettings = page.locator('.customize-drawer .ghost-btn, .customize-drawer .secondary-btn').first();
if (await closeSettings.count()) await closeSettings.click();
else await page.keyboard.press('Escape');
await page.waitForTimeout(250);

const showAgain = page.getByRole('button', { name: /Show Teach|Mostrar Enseñar|Показати Навчання|Показать Уроки/i });
if (await showAgain.count()) {
  await showAgain.click();
  await page.waitForTimeout(200);
}
const dockTeach = page.locator('.dock-rail-btn').filter({ hasText: /Навчання|Уроки|Teach|Enseñar|ምምሃር|آموزش/ }).last();
if (await dockTeach.count()) {
  await dockTeach.click();
} else {
  fail('teach dock missing');
}
await page.waitForTimeout(400);
const vocabHead = await page.locator('.teaching-drawer h3').filter({ hasText: /Словник|Vocab|Vocabulario|واژ|ቃላት/ }).first().innerText().catch(() => '');
if (vocabHead.includes('Словник')) pass('uk vocab heading');
else log.push('NOTE vocab heading: ' + JSON.stringify(vocabHead));
const sketchTerm = await page.locator('.vocab-list dt').filter({ hasText: /Ескіз/ }).first().innerText().catch(() => '');
if (sketchTerm.includes('Sketch')) pass('uk sketch CAD paren');
else fail('uk sketch term: ' + JSON.stringify(sketchTerm));
await page.screenshot({ path: '/workspace/screenshots/vocab-teach-uk.png' });

writeFileSync('/tmp/vocab-smoke.txt', log.join('\n') + '\n');
console.log(log.join('\n'));
const failed = log.some((l) => l.startsWith('FAIL'));
await browser.close();
process.exit(failed ? 1 : 0);

