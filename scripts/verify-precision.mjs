/**
 * Manual-check driver for the plan canvas precision work.
 * Not part of `npm test` — run it by hand against a dev server:
 *   node scripts/verify-precision.mjs
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const URL = process.env.BABOO_URL ?? 'http://localhost:8080/';
const OUT = process.env.BABOO_SHOTS ?? '/tmp/precision-shots';

const errors = [];
const notes = [];

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));

  const shot = async (name) => {
    await page.screenshot({ path: `${OUT}/${name}.png` });
    notes.push(`shot ${name}`);
  };

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('canvas', { timeout: 30000 });
  await page.waitForTimeout(1200);
  await shot('00-first-load');

  /* First run stacks a dedication card over the template picker. */
  const hello = page.locator('button', { hasText: /Let.s draw/i }).first();
  if (await hello.count()) {
    await hello.click();
    await page.waitForTimeout(600);
  }
  const blank = page.locator('.template-card', { hasText: 'Blank' }).first();
  if (await blank.count()) {
    await blank.click();
    await page.waitForTimeout(400);
    const go = page.locator('button', { hasText: /^(Start|Create|Make|Draw)/i }).first();
    if (await go.count()) await go.click().catch(() => {});
    await page.waitForTimeout(900);
  }
  const close = page.locator('button', { hasText: /^Close$/i }).first();
  if (await close.count()) await close.click().catch(() => {});
  await page.waitForTimeout(400);
  await dismissChatter(page);
  await shot('01-blank-canvas');

  const box = await page.locator('canvas').first().boundingBox();
  const at = (x, y) => [box.x + x, box.y + y];
  const click = async (x, y) => {
    await page.mouse.move(...at(x, y));
    await page.waitForTimeout(120);
    await page.mouse.click(...at(x, y));
    await page.waitForTimeout(200);
  };

  await page.keyboard.press('w');
  await page.waitForTimeout(250);

  /* A 320 x 200 rectangle, clear of the chrome. */
  const L = 430;
  const T = 250;
  const R = L + 320;
  const B = T + 200;
  const corners = [[L, T], [R, T], [R, B], [L, B]];
  for (let i = 0; i < 4; i++) {
    await click(...corners[i]);
    await click(...corners[(i + 1) % 4]);
  }
  await dismissChatter(page);
  await page.keyboard.press('w');
  await shot('02-rectangle');

  /* Corner snap: sit a few px off the top-right corner. */
  await page.mouse.move(...at(R - 9, T + 7));
  await page.waitForTimeout(450);
  await shot('03-corner-snap');

  /* Middle snap: halfway along the top wall. */
  await page.mouse.move(...at((L + R) / 2 + 6, T + 8));
  await page.waitForTimeout(450);
  await shot('04-middle-snap');

  /* Along-wall snap: a quarter of the way along the top wall. */
  await page.mouse.move(...at(L + 80, T + 7));
  await page.waitForTimeout(450);
  await shot('05-onwall-snap');

  /* Square-off snap: draw up from below and meet the bottom wall at a right angle. */
  await click(L + 120, B + 140);
  await page.mouse.move(...at(L + 132, B + 6));
  await page.waitForTimeout(450);
  await shot('06-perp-snap');
  await page.keyboard.press('Escape');

  /* Exact entry panel. */
  await page.keyboard.press('w');
  await click(300, 700);
  await page.mouse.move(...at(430, 700));
  await page.waitForTimeout(400);
  await shot('07-exact-entry');

  const dyn = await page.locator('.dyn-input').count();
  notes.push(`exact-entry panels on screen: ${dyn}`);
  if (dyn > 0) {
    const lenBox = page.locator('.dyn-input input').first();
    const angBox = page.locator('.dyn-input input').nth(1);
    await lenBox.click({ timeout: 5000 });
    await lenBox.fill('12');
    await angBox.click({ timeout: 5000 });
    await angBox.fill('0');
    await page.waitForTimeout(250);
    await shot('08-exact-typed');
    await page.locator('.dyn-go').click({ timeout: 5000 });
    await page.waitForTimeout(600);
    await shot('09-exact-committed');
    const len = await page.evaluate(() => {
      const w = window;
      return w.__babooLastWall ?? null;
    });
    if (len) notes.push(`committed wall: ${JSON.stringify(len)}`);
  }

  /* Live length + angle on the preview. */
  await page.keyboard.press('Escape');
  await page.keyboard.press('w');
  await click(300, 780);
  await page.mouse.move(...at(460, 700));
  await page.waitForTimeout(450);
  await shot('10-live-readout');
  await page.keyboard.press('Escape');

  /* Arrow-key nudge on a selected wall. */
  await page.keyboard.press('v');
  await click((L + R) / 2, B);
  await page.waitForTimeout(400);
  await shot('11-selected');
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(140);
  }
  await page.waitForTimeout(800);
  await shot('12-nudged');

  console.log(notes.join('\n'));
  console.log(`\nconsole errors: ${errors.length}`);
  for (const e of errors) console.log(`  - ${e}`);
  await browser.close();
}

/** Coach cards, "you did it" prompts and toasts sit over the canvas. */
async function dismissChatter(page) {
  for (const label of ['Not now', 'Close', 'Got it', 'Dismiss']) {
    const b = page.locator('button', { hasText: new RegExp(`^${label}$`, 'i') });
    if (await b.count()) {
      await b.first().click({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(200);
    }
  }
  await page.waitForTimeout(200);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
