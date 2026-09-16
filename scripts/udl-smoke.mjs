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
page.setDefaultTimeout(12000);
const log = [];
const fail = (m) => { log.push('FAIL ' + m); };
const pass = (m) => { log.push('PASS ' + m); };

await page.goto('http://127.0.0.1:8080/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.chrome, .hello-card, .new-project-modal', { timeout: 15000 });
await page.waitForTimeout(600);

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

await page.screenshot({ path: '/workspace/screenshots/udl-land.png' });

const ver = await page.locator('.ver-chip').first().innerText().catch(() => '');
if ((ver || '').includes('1.1.2')) pass('version chip 1.1.2');
else log.push('NOTE version: ' + JSON.stringify(ver));

// Expand dock if collapsed, then open Settings.
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
else {
  fail('settings drawer missing');
  writeFileSync('/tmp/udl-body.txt', await page.content());
}

await page.screenshot({ path: '/workspace/screenshots/udl-settings-en.png' });

const esBtn = page.locator('.aw-shell-chip').filter({ hasText: 'Español' }).first();
if (!(await esBtn.count())) {
  fail('Español chip missing');
  const drawer = await page.locator('.customize-drawer').innerText().catch(() => 'no drawer');
  log.push('DRAWER: ' + drawer.slice(0, 500));
} else {
  await esBtn.click();
  await page.waitForTimeout(300);
}

const lang = await page.evaluate(() => ({
  lang: document.documentElement.lang,
  locale: document.documentElement.getAttribute('data-locale'),
}));
if (lang.lang === 'es' && lang.locale === 'es') pass('html lang+data-locale=es');
else fail(`lang=${lang.lang} data-locale=${lang.locale}`);

const muro = await page.locator('.tool-rail-label', { hasText: 'Muro' }).count();
if (muro > 0) pass('tool label Muro (Wall)');
else fail('no Muro label on tool rail; labels=' + (await page.locator('.tool-rail-label').allInnerTexts()).join('|'));

const settingsEs = await page.locator('#customize-title').textContent();
if ((settingsEs || '').includes('Ajustes')) pass('settings title Ajustes');
else fail('settings title: ' + settingsEs);

const fat = page.locator('label.field.check').filter({ hasText: /Botones más grandes|Bigger buttons/ }).locator('input');
const type = page.locator('label.field.check').filter({ hasText: /Letra más grande|Bigger type/ }).locator('input');
if (await fat.count()) await fat.check();
else fail('fat checkbox missing');
if (await type.count()) await type.check();
else fail('type checkbox missing');
await page.waitForTimeout(200);

const flags = await page.evaluate(() => ({
  fat: document.documentElement.hasAttribute('data-udl-fat'),
  type: document.documentElement.hasAttribute('data-udl-type'),
  minH: (() => {
    const btn = document.querySelector('.tool-rail-btn');
    return btn ? Math.round(parseFloat(getComputedStyle(btn).minHeight)) : 0;
  })(),
}));
if (flags.fat) pass('data-udl-fat on'); else fail('data-udl-fat missing');
if (flags.type) pass('data-udl-type on'); else fail('data-udl-type missing');
if (flags.minH >= 52) pass(`tool min-height ${flags.minH}px`);
else fail(`tool min-height ${flags.minH}px (want ≥52)`);

await page.screenshot({ path: '/workspace/screenshots/udl-settings-es.png' });

const close = page.locator('.customize-drawer').getByRole('button', { name: /Cerrar|Close/ });
if (await close.count()) await close.click();
await page.waitForTimeout(300);

const cta = await page.locator('.wall-cta strong').textContent().catch(() => '');
if ((cta || '').includes('Pongamos un muro')) pass('empty-plan CTA in Spanish');
else fail('CTA: ' + JSON.stringify(cta));

await page.screenshot({ path: '/workspace/screenshots/udl-plan-es.png' });

await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(400);
await page.screenshot({ path: '/workspace/screenshots/udl-phone-es.png' });
const phoneMin = await page.evaluate(() => {
  const rail = document.querySelector('.tool-rail-btn');
  const chrome = document.querySelector('.chrome-ico');
  const h = (el) => el ? Math.round(parseFloat(getComputedStyle(el).minHeight)) : 0;
  return { rail: h(rail), chrome: h(chrome) };
});
if (phoneMin.rail >= 52 && phoneMin.chrome >= 52) pass(`phone tap rail ${phoneMin.rail}px chrome ${phoneMin.chrome}px`);
else fail(`phone tap rail ${phoneMin.rail}px chrome ${phoneMin.chrome}px`);

const failed = log.filter((l) => l.startsWith('FAIL'));
console.log(log.join('\n'));
console.log(failed.length ? `\nSMOKE FAIL ${failed.length}` : '\nSMOKE PASS');
await browser.close();
process.exit(failed.length ? 1 : 0);
