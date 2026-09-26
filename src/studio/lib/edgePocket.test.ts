import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { APP_VERSION } from '../version.ts';
import { LOCALES, t } from '../data/i18n.ts';

const studio = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('2.2.6 full screen', () => {
  it('chips 2.2.6 and keeps the tap row and the first step', () => {
    assert.equal(APP_VERSION, '2.2.6');
    const changelog = readFileSync(join(studio, 'data/changelog.ts'), 'utf8');
    assert.match(changelog, /version:\s*'2\.2\.6'/);
    assert.match(changelog, /version:\s*'2\.2\.5'/);
    assert.match(changelog, /version:\s*'2\.2\.4'/);
    assert.match(changelog, /version:\s*'2\.2\.3'/);
    assert.match(changelog, /version:\s*'2\.2\.2'/);
    assert.match(changelog, /version:\s*'2\.2\.1'/);
    assert.match(changelog, /version:\s*'2\.2\.0'/);
    assert.match(changelog, /version:\s*'2\.1\.4'/);
    assert.equal(t('en', 'coach.sketch.body').includes('Open Tools'), false);
    assert.match(t('en', 'coach.trace.body'), /Trace on this card/);
    assert.match(t('en', 'chip.roof'), /Roof/);
    for (const loc of LOCALES) {
      assert.ok(t(loc, 'chip.roof').length > 0);
      assert.ok(t(loc, 'chip.roofNone').length > 0);
    }
    const plan = readFileSync(join(studio, 'components/PlanCanvas.tsx'), 'utf8');
    assert.match(plan, /plan-roof-menu/);
    assert.match(plan, /setRoofStyle/);
    assert.match(plan, /coachLeads/);
    const coach = readFileSync(join(studio, 'components/CoachBanner.tsx'), 'utf8');
    assert.match(coach, /selected.kind !== 'sketch'/);
    const doll = readFileSync(join(studio, 'components/DollhouseCanvas.tsx'), 'utf8');
    assert.match(doll, /function DollPlant/);
    const css = readFileSync(join(studio, 'index.css'), 'utf8');
    assert.match(css, /flex-wrap:nowrap/);
    assert.match(css, /:has\(\.coach-card\) \.plan-sheet/);
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

  it('gear and hamburger sit on the top row; Teach and Help are menu pictograms', () => {
    const chrome = readFileSync(join(studio, 'components/Chrome.tsx'), 'utf8');
    const themes = readFileSync(join(studio, 'data/themes.ts'), 'utf8');
    assert.match(chrome, /toggleTeaching/);
    assert.match(chrome, /toggleHelp/);
    assert.match(chrome, /chrome-gear/);
    assert.match(chrome, /chrome-hamburger/);
    assert.equal(chrome.includes('chrome-phone-only'), false);
    assert.match(chrome, /chrome-ess/);
    assert.match(chrome, /data-baboo-chrome="top"/);
    assert.doesNotMatch(chrome, /tool-bar chrome-tools/);
    assert.match(chrome, /<VersionChip onTeacher/);
    assert.match(chrome, /save-chip save-\$\{saveStatus\}/);
    assert.doesNotMatch(chrome, /phoneChrome \? null/);
    assert.match(themes, /only light/);
    assert.match(themes, /only dark/);
    assert.doesNotMatch(themes, /prefers-color-scheme/);
    const store = readFileSync(join(studio, 'store/useProjectStore.ts'), 'utf8');
    assert.doesNotMatch(store, /newProjectOpen:\s*true/);
    assert.match(chrome, /openNewProject\(true\)/);
    const gear = readFileSync(join(studio, 'components/CustomizePanel.tsx'), 'utf8');
    assert.match(gear, /look-chip/);
    assert.match(gear, /set\.look/);
    assert.doesNotMatch(gear, /<span>Theme<\/span>/);
    for (const loc of LOCALES) {
      assert.ok(t(loc, 'set.look').length > 0);
      assert.ok(t(loc, 'set.look.lead').length > 0);
      assert.ok(t(loc, 'chrome.full').length > 0);
    }
    const css = readFileSync(join(studio, 'index.css'), 'utf8');
    assert.match(css, /is-phone \.chrome/);
    assert.match(css, /chrome\.is-hidden/);
    assert.match(chrome, /requestFullscreen/);
  });

  it('Wall flyout is docked to the Wall chip, not a permanent rail', () => {
    const rail = readFileSync(join(studio, 'components/ToolRail.tsx'), 'utf8');
    const fly = readFileSync(join(studio, 'components/WallFlyout.tsx'), 'utf8');
    const draft = readFileSync(join(studio, 'lib/wallDraft.ts'), 'utf8');
    assert.match(rail, /WallFlyout/);
    assert.match(rail, /is-fancy/);
    assert.match(fly, /WALL_THICKNESS_MM/);
    assert.match(fly, /WALL_HEIGHT_M/);
    assert.match(fly, /wall\.tip/);
    assert.match(draft, /120, 200, 300/);
    assert.match(draft, /2\.4, 2\.7, 3\.0/);
  });

  it('left rail is an overlay Edge Pocket, not a reserved right gutter', () => {
    const css = readFileSync(join(studio, 'index.css'), 'utf8');
    assert.match(css, /--aw-rail-right:\s*0px/);
    assert.match(css, /\.tool-rail\.edge-pocket/);
    assert.match(css, /100svh/);
    assert.doesNotMatch(css, /\.dock-rail\s*\{/);
  });

  it('locks one thin Chromebook top row at 1280 and 1366', () => {
    const css = readFileSync(join(studio, 'index.css'), 'utf8');
    const phone = readFileSync(join(studio, 'hooks/usePhoneChrome.ts'), 'utf8');
    assert.match(css, /@media \(width>=1100px\) \{[\s\S]*?flex-wrap:nowrap!important/s);
    assert.match(css, /max-height:52px/);
    assert.match(css, /@media \(width>=1100px\) \{[\s\S]*?\.save-chip \{\s*display:unset!important/s);
    assert.match(phone, /min-width: 1100px/);
    assert.match(phone, /coarse && !chromebook/);
  });

  it('open pocket sits above the plan card so Furn/Plant are not clipped', () => {
    const css = readFileSync(join(studio, 'index.css'), 'utf8');
    assert.match(css, /:has\(\.edge-pocket\.is-open\)[\s\S]*?overflow:\s*visible/s);
    assert.match(css, /:has\(\.edge-pocket\.is-open\) \.plan-sheet/);
    assert.match(css, /z-index:calc\(var\(--aw-z-catalogs\) \+ 4\)/);
    assert.match(css, /html\[data-ell-english\]\s*\{\s*--aw-rail-left:\s*168px/);
  });

  it('Help copy describes the pocket, not a right Teach column', () => {
    assert.match(t('en', 'help.chrome'), /Edge Pocket/);
    assert.match(t('en', 'help.chrome'), /Teach/);
    assert.match(t('en', 'help.chrome'), /plan card/i);
    assert.doesNotMatch(t('en', 'help.chrome'), /sit on the right/);
    assert.doesNotMatch(t('es', 'help.chrome'), /van a la derecha/);
    for (const loc of LOCALES) {
      const line = t(loc, 'help.chrome');
      assert.match(line, /Teach|Enseñar|Навчан|Урок|ምምሃር|آموزش/i);
    }
  });
});
