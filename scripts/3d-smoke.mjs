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
const pageErr = [];
page.on('pageerror', (e) => pageErr.push(String(e.message || e)));

await page.goto('http://127.0.0.1:8080/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.chrome, .hello-card, .new-project-modal', { timeout: 20000 });
await page.waitForTimeout(800);
const hello = page.getByRole('button', { name: /let'?s draw/i });
if (await hello.count()) { await hello.click(); await page.waitForTimeout(200); }
const ranch = page.locator('.template-card').filter({ hasText: /Ranch/ }).first();
if (await ranch.count()) { await ranch.click(); await page.waitForTimeout(900); pass('ranch'); }
else fail('no ranch');

await page.screenshot({ path: '/workspace/screenshots/3d-after-ranch.png' });
const html = await page.locator('.chrome').innerText().catch(() => '');
log.push('CHROME ' + html.replace(/\s+/g, ' ').slice(0, 220));
const view3dBtn = page.locator('button.chrome-ico').filter({ hasText: /3D/ });
log.push('3D BTN count ' + await view3dBtn.count());
if (await view3dBtn.count()) await view3dBtn.first().click();
else {
  await page.locator('button[title="view-only"]').first().click().catch(() => {});
}
await page.waitForTimeout(600);
if (pageErr.length) log.push('PAGEERR ' + pageErr.join(' | '));
const stub = page.locator('.view3d-stub');
if (await stub.count()) pass('3d stub');
else fail('no 3d stub');

const sky = await stub.getAttribute('data-aw3d-sky');
const site = await stub.getAttribute('data-aw3d-site');
if (sky === 'day' && site === 'grass') pass('day+grass');
else fail(`sky/site ${sky}/${site}`);

const paths = await page.locator('.solid-preview-svg path').count();
if (paths >= 12) pass(`paths ${paths}`);
else fail(`few paths ${paths}`);

const locked = await page.locator('.tier-card.locked').count();
if (locked === 0) pass('no locked tiers');
else fail(`locked ${locked}`);

await page.screenshot({ path: '/workspace/screenshots/3d-solid-orbit.png' });

await page.locator('.tier-card').filter({ hasText: /Materials|Materiales/ }).first().click();
await page.waitForTimeout(300);
const grass = await page.locator('#aw3d-grass').count();
if (grass) pass('materials hatch');
else fail('no grass pattern');
await page.screenshot({ path: '/workspace/screenshots/3d-materials.png' });

await page.locator('.tier-card').filter({ hasText: /^Lighting|^Luz/ }).first().click();
await page.waitForTimeout(300);
const sun = await page.locator('.solid-preview-svg circle').count();
if (sun) pass('sun disc');
else fail('no sun');
await page.screenshot({ path: '/workspace/screenshots/3d-lighting.png' });

await page.locator('.tier-card').filter({ hasText: /Walkthrough|Recorrido/ }).first().click();
await page.waitForTimeout(400);
const walk = await stub.getAttribute('data-aw3d-walk');
if (walk === '1') pass('walkthrough');
else fail('walk attr ' + walk);
const fwd = page.getByRole('button', { name: /Walk in|Entrar/i });
if (await fwd.count()) {
  await fwd.click();
  pass('walk in');
} else fail('no walk in');
await page.screenshot({ path: '/workspace/screenshots/3d-walk.png' });

writeFileSync('/tmp/3d-smoke.txt', log.join('\n') + '\n');
console.log(log.join('\n'));
await browser.close();
process.exit(log.some((l) => l.startsWith('FAIL')) ? 1 : 0);
