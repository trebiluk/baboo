import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
for (const w of [1360, 1280, 1100, 1024]) {
  for (const fat of [false, true]) {
    const context = await browser.newContext({ viewport: { width: w, height: 860 } });
    await context.addInitScript(([fatOn]) => {
      try {
        localStorage.clear();
        localStorage.setItem('baboo-hello-seen-v1', '1');
        if (fatOn) localStorage.setItem('baboo-udl-fat', '1');
        indexedDB.deleteDatabase('archworks');
      } catch { /* ignore */ }
    }, [fat]);
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:8080/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.chrome', { timeout: 25000 });
    await page.waitForTimeout(600);
    const blank = page.locator('.template-card').filter({ hasText: 'Blank' }).first();
    if (await blank.count()) { await blank.click(); await page.waitForTimeout(600); }
    const m = await page.evaluate(() => {
      const box = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { l: Math.round(r.left), r: Math.round(r.right), w: Math.round(r.width) };
      };
      const left = document.querySelector('.chrome-left');
      let far = 0;
      const clipped = [];
      if (left) {
        const lim = left.getBoundingClientRect().right;
        for (const c of left.children) {
          const r = c.getBoundingClientRect();
          if (r.width === 0) continue;
          far = Math.max(far, r.right);
          if (r.right > lim + 1) clipped.push(c.className + ' +' + Math.round(r.right - lim));
        }
      }
      return {
        left: box('.chrome-left'),
        tools: box('.chrome .tool-bar'),
        right: box('.chrome-right'),
        leftContentRight: Math.round(far),
        clipped,
      };
    });
    const nextLeft = m.right?.l ?? Infinity;
    const over = Math.round(m.leftContentRight - nextLeft);
    console.log(
      `${w}px fat=${fat ? 'on ' : 'off'} left=[${m.left?.l},${m.left?.r}] content→${m.leftContentRight} boxR=${m.left?.r} `
      + `next@${nextLeft} ${over > 2 ? 'OVERLAP +' + over : 'ok'} ${m.clipped.length ? 'CLIPPED ' + m.clipped.join(', ') : ''}`,
    );
    await context.close();
  }
}
await browser.close();
