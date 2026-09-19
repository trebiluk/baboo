import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { APP_VERSION } from '../version.ts';
import { LOCALES, t } from '../data/i18n.ts';

const studio = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('P0.1 Edge Pocket chrome', () => {
  it('keeps Edge Pocket after the version chip moves to 2.1.0', () => {
    assert.equal(APP_VERSION, '2.1.0');
    const changelog = readFileSync(join(studio, 'data/changelog.ts'), 'utf8');
    assert.match(changelog, /version:\s*'2\.1\.0'/);
    assert.match(changelog, /version:\s*'2\.0\.1'/);
    assert.match(changelog, /Edge Pocket/);
  });

  it('long-press matches a right-click hold', () => {
    const pocket = readFileSync(join(studio, 'lib/edgePocket.ts'), 'utf8');
    assert.match(pocket, /EDGE_POCKET_LONG_PRESS_MS = 500/);
  });

  it('removes the right DockRail from the live tree', () => {
    const app = readFileSync(join(studio, 'App.tsx'), 'utf8');
    assert.equal(app.includes('DockRail'), false);
    assert.match(app, /ToolRail/);
    assert.equal(existsSync(join(studio, 'components/DockRail.tsx')), false);
  });

  it('Teach and Help sit on the top row, not a phone-only ribbon', () => {
    const chrome = readFileSync(join(studio, 'components/Chrome.tsx'), 'utf8');
    assert.match(chrome, /toggleTeaching/);
    assert.match(chrome, /toggleHelp/);
    assert.equal(chrome.includes('chrome-phone-only'), false);
    assert.match(chrome, /chrome-ess/);
  });

  it('left rail is an overlay Edge Pocket, not a reserved right gutter', () => {
    const css = readFileSync(join(studio, 'index.css'), 'utf8');
    assert.match(css, /--aw-rail-right:\s*0px/);
    assert.match(css, /\.tool-rail\.edge-pocket/);
    assert.match(css, /100svh/);
    assert.doesNotMatch(css, /\.dock-rail\s*\{/);
  });

  it('keeps the version chip in the header until phone widths', () => {
    const css = readFileSync(join(studio, 'index.css'), 'utf8');
    const tight = css.match(/@media \(width < 1540px\) \{[\s\S]*?\n\}/);
    assert.ok(tight, 'expected the 1540px title-strip query');
    assert.doesNotMatch(tight[0], /ver-chip/);
    assert.match(css, /@media \(width <= 1100px\).*ver-chip-header/s);
  });

  it('Help copy describes the pocket, not a right Teach column', () => {
    assert.match(t('en', 'help.chrome'), /Edge Pocket/);
    assert.match(t('en', 'help.chrome'), /Teach/);
    assert.doesNotMatch(t('en', 'help.chrome'), /sit on the right/);
    assert.doesNotMatch(t('es', 'help.chrome'), /van a la derecha/);
    for (const loc of LOCALES) {
      const line = t(loc, 'help.chrome');
      assert.match(line, /Teach|Enseñar|Навчан|Урок|ምምሃር|آموزش/i);
    }
  });
});
