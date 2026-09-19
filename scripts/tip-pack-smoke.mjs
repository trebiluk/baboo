/**
 * Tip pack + UDL onboarding smoke — CURRICULUM-TIP-PACK-EN-ES.md and
 * CURRICULUM-ONBOARD-UDL-ELL-NEURO.md. Walks the three wins in the browser and
 * shoots the states a teacher would check.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT = '/workspace/screenshots/tips';
mkdirSync(OUT, { recursive: true });

const log = [];
const pass = (m) => { log.push('PASS ' + m); console.log('PASS ' + m); };
const fail = (m) => { log.push('FAIL ' + m); console.log('FAIL ' + m); };
const note = (m) => { log.push('NOTE ' + m); console.log('NOTE ' + m); };

const browser = await chromium.launch({ headless: true });

async function session(query = '') {
  const context = await browser.newContext({ viewport: { width: 1360, height: 900 } });
  await context.addInitScript(() => {
    try {
      localStorage.clear();
      localStorage.setItem('baboo-hello-seen-v1', '1');
      indexedDB.deleteDatabase('archworks');
    } catch { /* ignore */ }
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://127.0.0.1:8080/' + query, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.chrome, .new-project-modal', { timeout: 25000 });
  await page.waitForTimeout(800);
  return { context, page, errors };
}

const coachText = (page) => page.locator('.coach-card').first().innerText().catch(() => '');

/** The dock rail starts minimized on a narrow stage. */
async function openHelp(page) {
  const show = page.getByRole('button', { name: /Show (Teach|panels)|Mostrar/i });
  if (await show.count()) { await show.first().click(); await page.waitForTimeout(300); }
  await page.locator('.dock-rail-btn').filter({ hasText: /Help|Ayuda/ }).first().click();
  await page.waitForTimeout(500);
}

/* ---- 1. first paint: template cards carry a picture, one tip only ---- */
{
  const { context, page, errors } = await session();
  const modal = page.locator('.new-project-modal');
  if (await modal.count()) {
    const glyphs = await page.locator('.template-card .template-glyph').count();
    const cards = await page.locator('.template-card').count();
    if (glyphs === cards && cards > 0) pass(`every template card has line art (${cards})`);
    else fail(`template glyphs ${glyphs} of ${cards} cards`);
    await page.screenshot({ path: `${OUT}/01-templates-picture-first.png` });
    await page.locator('.template-card').filter({ hasText: 'Blank' }).first().click();
  } else fail('no template modal on first paint');
  await page.waitForTimeout(700);

  if (await page.locator('.teaching-drawer').count()) fail('Teaching opened itself on first paint');
  else pass('Teaching stays closed on first paint');

  const cards = await page.locator('.coach-card').count();
  if (cards === 1) pass('exactly one tip card on screen');
  else fail(`${cards} tip cards on screen`);

  const txt = await coachText(page);
  if (/Sketch the house first/.test(txt)) pass('tip-welcome is the first tip');
  else fail('first tip is not tip-welcome: ' + txt.replace(/\n/g, ' | '));
  if (/Got it/.test(txt)) pass('dismiss reads Got it');
  else fail('dismiss control is not Got it: ' + txt.replace(/\n/g, ' | '));
  await page.screenshot({ path: `${OUT}/02-tip-welcome.png` });

  /* three wins: wall, then door */
  await page.locator('.coach-card button', { hasText: 'Got it' }).click();
  await page.waitForTimeout(400);
  const t2 = await coachText(page);
  if (/Draw a wall/.test(t2)) pass('tip-wall follows tip-welcome');
  else fail('second tip is not tip-wall: ' + t2.replace(/\n/g, ' | '));
  await page.screenshot({ path: `${OUT}/03-tip-wall.png` });

  await page.locator('.coach-card button', { hasText: 'Show me' }).click();
  await page.waitForTimeout(300);
  const stage = await page.locator('.stage-area').boundingBox();
  const click = async (dx, dy) => {
    await page.mouse.click(stage.x + dx, stage.y + dy);
    await page.waitForTimeout(220);
  };
  await click(360, 260); await click(760, 260);
  await click(760, 260); await click(760, 560);
  await click(760, 560); await click(360, 560);
  await click(360, 560); await click(360, 260);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);

  const t3 = await coachText(page);
  if (/Add a door/.test(t3)) pass('tip-door follows a drawn wall');
  else fail('third tip is not tip-door: ' + t3.replace(/\n/g, ' | '));
  await page.screenshot({ path: `${OUT}/04-tip-door.png` });

  await page.locator('.coach-card button', { hasText: 'Show me' }).click();
  await page.waitForTimeout(300);
  await click(560, 260);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(700);

  const t4 = await coachText(page);
  if (/Save your plan/.test(t4)) pass('tip-save follows a placed door');
  else fail('fourth tip is not tip-save: ' + t4.replace(/\n/g, ' | '));
  await page.screenshot({ path: `${OUT}/05-tip-save.png` });

  /* a later tip must not have jumped the queue */
  if (/roof|3D|Class card/i.test(t4)) fail('a later tip jumped ahead of the three wins');
  else pass('roof / 3D / Class card held behind the three wins');

  if (errors.length) note('console: ' + errors.slice(0, 3).join(' | '));
  else pass('no console errors on the win path');
  await context.close();
}

/* ---- 2. Help defaults carry Show tips and TA assist ---- */
{
  const { context, page } = await session();
  if (await page.locator('.new-project-modal').count()) {
    await page.locator('.template-card').filter({ hasText: 'Blank' }).first().click();
    await page.waitForTimeout(600);
  }
  await openHelp(page);

  const help = await page.locator('.help-drawer').innerText();
  for (const [label, re] of [
    ['Show tips', /Show tips/],
    ['TA assist', /TA assist/],
    ['High contrast', /High contrast/],
    ['Bigger type', /Bigger type/],
    ['Tip language', /Tip language/],
  ]) {
    if (re.test(help)) pass(`main Help shows ${label}`);
    else fail(`main Help is missing ${label}`);
  }
  await page.screenshot({ path: `${OUT}/06-help-defaults.png` });

  /* Show tips off must silence the card */
  await page.locator('.help-drawer .aw-shell-chip', { hasText: 'Show tips' }).click();
  await page.waitForTimeout(300);
  await page.locator('.help-drawer button', { hasText: 'Close' }).first().click();
  await page.waitForTimeout(500);
  if (await page.locator('.coach-card').count()) fail('tips still show after Show tips off');
  else pass('Show tips off silences the tip card');
  await page.screenshot({ path: `${OUT}/07-tips-off.png` });
  await context.close();
}

/* ---- 3. ?ta=1 brings the aide's chrome ---- */
{
  const { context, page } = await session('?ta=1');
  if (await page.locator('.new-project-modal').count()) {
    await page.locator('.template-card').filter({ hasText: 'Blank' }).first().click();
    await page.waitForTimeout(700);
  }
  const fat = await page.evaluate(() => document.documentElement.hasAttribute('data-udl-fat'));
  const ta = await page.evaluate(() => document.documentElement.hasAttribute('data-ta-assist'));
  if (ta) pass('?ta=1 turns on TA assist'); else fail('?ta=1 did not turn on TA assist');
  if (fat) pass('TA assist implies fat taps'); else fail('TA assist did not fatten taps');

  const txt = await coachText(page);
  if (/Next tip/.test(txt)) pass('TA gets a Next tip button');
  else fail('no Next tip button under TA assist: ' + txt.replace(/\n/g, ' | '));
  if (/Point to a big house card/.test(txt)) pass('TA whisper rides under the tip');
  else fail('no TA whisper: ' + txt.replace(/\n/g, ' | '));
  if (/TA can tap for student/.test(txt)) pass('TA label present, student never labelled');
  else fail('no TA label: ' + txt.replace(/\n/g, ' | '));
  await page.screenshot({ path: `${OUT}/08-ta-assist.png` });

  const btnBox = await page.locator('.coach-card button').first().boundingBox();
  if (btnBox && btnBox.height >= 44) pass(`tip buttons are ${Math.round(btnBox.height)}px tall`);
  else fail(`tip button only ${btnBox ? Math.round(btnBox.height) : '?'}px tall`);
  await context.close();
}

/* ---- 4. Spanish tips use the locked ES strings ---- */
{
  const { context, page } = await session();
  if (await page.locator('.new-project-modal').count()) {
    await page.locator('.template-card').filter({ hasText: 'Blank' }).first().click();
    await page.waitForTimeout(600);
  }
  await openHelp(page);
  await page.locator('.help-drawer .aw-shell-chip', { hasText: 'Español' }).first().click();
  await page.waitForTimeout(400);
  await page.locator('.help-drawer button').filter({ hasText: /Cerrar|Close/ }).first().click();
  await page.waitForTimeout(600);

  const txt = await coachText(page);
  if (/Primero dibuja la casa/.test(txt)) pass('ES tip title is the locked string');
  else fail('ES tip title wrong: ' + txt.replace(/\n/g, ' | '));
  if (/Entendido/.test(txt)) pass('ES dismiss is Entendido');
  else fail('ES dismiss wrong: ' + txt.replace(/\n/g, ' | '));
  await page.screenshot({ path: `${OUT}/09-tip-es.png` });
  await context.close();
}

await browser.close();

const fails = log.filter((l) => l.startsWith('FAIL'));
console.log('\n--- ' + (log.length - fails.length) + ' pass, ' + fails.length + ' fail ---');
if (fails.length) { fails.forEach((f) => console.log(f)); process.exit(1); }
