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
await page.waitForTimeout(600);
const hello = page.getByRole('button', { name: /let'?s draw/i });
if (await hello.count()) { await hello.click(); await page.waitForTimeout(200); }
const ranch = page.locator('.template-card').filter({ hasText: /Ranch/ }).first();
if (await ranch.count()) { await ranch.click(); await page.waitForTimeout(900); pass('ranch'); }

const ver = await page.locator('.ver-chip').first().innerText().catch(() => '');
if ((ver || '').includes('1.3.5')) pass('version 1.3.5');
else log.push('NOTE version ' + JSON.stringify(ver));

await page.screenshot({ path: '/workspace/screenshots/furn-plan.png' });

const settingsBtn = page.locator('.skill-chrome-chip');
if (await settingsBtn.count()) {
  await settingsBtn.click();
} else {
  const more = page.locator('.chrome-more-btn');
  if (await more.count()) {
    await more.click();
    await page.getByRole('menuitem', { name: /Settings|Ajustes/ }).click();
  }
}
await page.waitForTimeout(400);
const floorHead = page.locator('#floor-title');
if (await floorHead.count()) pass('flooring settings');
else fail('no flooring settings');
const walnut = page.locator('.aw-tex-chip').filter({ hasText: /Walnut/ }).first();
if (await walnut.count()) {
  await walnut.click();
  await page.waitForTimeout(200);
  pass('picked walnut');
}
await page.screenshot({ path: '/workspace/screenshots/furn-settings-floor.png' });
await page.locator('.teaching-backdrop, .ghost-btn').filter({ hasText: /Close|Cerrar/ }).first().click().catch(() => {});
await page.waitForTimeout(300);

const doll = page.locator('button.chrome-ico').filter({ hasText: /Dollhouse|Casa/ }).first();
if (await doll.count()) {
  await doll.click();
  await page.waitForTimeout(500);
  pass('dollhouse');
  await page.screenshot({ path: '/workspace/screenshots/furn-dollhouse.png' });
}

const view3d = page.locator('button.chrome-ico').filter({ hasText: /3D/ }).first();
if (await view3d.count()) {
  await view3d.click();
  await page.waitForTimeout(700);
  pass('3d');
  await page.screenshot({ path: '/workspace/screenshots/furn-3d.png' });
}

const walk = page.getByRole('button', { name: /Walk|Caminar|Прогул/ }).first();
if (await walk.count()) {
  await walk.click();
  await page.waitForTimeout(500);
  pass('walk');
  await page.screenshot({ path: '/workspace/screenshots/furn-walk.png' });
}

writeFileSync('/tmp/furn-floor-smoke.txt', log.join('\n') + '\n');
console.log(log.join('\n'));
await browser.close();
process.exit(log.some((l) => l.startsWith('FAIL')) ? 1 : 0);
