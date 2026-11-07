import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { APP_VERSION } from '../version.ts';
import { LOCALES, roofShown, roofWord, t, texShown } from '../data/i18n.ts';
import { upperBody } from './stories.ts';
import { VOCAB, VOCAB_PACKS } from '../data/teaching.ts';

const studio = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('2.13.90 touch bar fix and desktop-site tip, 2.13.89 installed app is Baboo, light, 2.13.88 readable bar labels, 2.13.87 auto-trace closed sketches, 2.13.86 height off the floor, 2.13.85 worksheet items, 2.13.84 windows and furniture at every level, 2.13.83 tiny class house, 2.13.82 tigrinya menu words, 2.13.81 photo bar one line, 2.13.80 class section, 2.13.79 settings boxes 44px, 2.13.78 hint steps aside, 2.13.77 export on screen, 2.13.76 bar words wrap, 2.13.75 teach panel roof line, 2.13.74 blank card roof line, 2.13.73 what\'s new and wallpaper names, 2.13.72 roof names in your language, 2.13.71 wall chip off the job card, 2.13.70 shed and gambrel roofs, 2.13.69 turf mound, 2.13.68 a real cone roof, 2.13.67 class card in your language, 2.13.66 every message in your language, 2.13.65 3d on phones, 2.13.64 phone menu name, 2.13.63 templates pass, 2.13.62 photo in the walk, 2.13.61 postcard, 2.13.60 photo mode, 2.13.59 new york code, 2.13.58 rtl sizes, 2.13.57 fit in view, 2.13.56 readable tags, 2.13.55 plan names, 2.13.54 wall units, 2.13.53 challenge words, 2.13.52 teach words, 2.13.51 dog house words, 2.13.50 access words, 2.13.49 sturdier, 2.13.48 tips and labels, 2.13.47 settings words, 2.13.46 one room one name, 2.13.45 new plan on phones, 2.13.44 join walls, 2.13.43 more rooms, 2.13.42 real rooms, 2.13.41 house looks, 2.13.40 screen readers, 2.13.39 one font, 2.13.38 clear sizes, 2.13.37 sizes on top, 2.13.36 lighter walk, 2.13.35 speed readout, 2.13.34 furniture, 2.13.33 soft shade, 2.13.32 glass, 2.13.31 crown, 2.13.30 lamps, 2.13.29 fixtures, 2.13.28 roof tag, 2.13.27 tidy, 2.13.26 touch 3d, 2.13.25 polish, 2.13.24 finishes, 2.13.23 frames, 2.13.22 inside 3d, 2.13.21 modes, 2.13.20 grand mansion, 2.13.19 2d tools, 2.13.18 richer 3d, 2.13.17 furniture list, 2.13.16 3d and dollhouse fixes, 2.13.15 more languages, 2.13.14 save status, 2.13.13 3d viewer update, 2.13.12 drawing engine update, 2.13.11 own 3d decoders, 2.13.10 menu close, 2.13.9 one menu, 2.13.8 bottom edge, 2.13.7 view buttons, More menu, Ink', () => {
  it('chips 2.13.90 and keeps the tap row and the first step', () => {
    assert.equal(APP_VERSION, '2.13.90');
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'ti'] as const) for (const k of ['news.touchBar', 'toast.desktopSite']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    const css90 = readFileSync(join(studio, 'index.css'), 'utf8');
    assert.match(css90, /@media \(min-width: 915px\) \{\n\s*\.app-shell\.is-phone \.chrome-right \.chrome-ico,\n\s*\.app-shell\.is-phone \.chrome-right \.chrome-view,/, 'phone mode hides the desktop bar buttons above 914px too');
    assert.match(readFileSync(join(studio, 'App.tsx'), 'utf8'), /if \(!looksLikeDesktopSiteOnPhone\(\)\) return;/, 'a phone on Desktop site gets the tip');
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.89'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'ti'] as const) assert.notEqual(t(l, 'news.installApp'), t('en', 'news.installApp'), l);
    const pwa89 = readFileSync(join(studio, '../../scripts/grok-pwa-shared.mjs'), 'utf8');
    assert.match(pwa89, /background_color: "#FFFFFF",\n\s*theme_color: "#FFFFFF",/, 'installed app is light');
    assert.match(pwa89, /icon-512\.png", sizes: "512x512"/, 'installed app has a 512 icon');
    assert.match(pwa89, /export const INSTALLED_APP_NAME = "Baboo";/, 'installed app is named Baboo');
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.88'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'ti'] as const) assert.notEqual(t(l, 'news.barText'), t('en', 'news.barText'), l);
    const css88 = readFileSync(join(studio, 'index.css'), 'utf8');
    assert.match(css88, /overflow-wrap: anywhere; \/\* 2\.13\.88[^\n]*\n\s*max-height: 2\.3em;\n[^\n]*\n\s*font-size: 12px;\n\s*font-weight: 500;/, 'bar labels are 12px weight 500 and wrap a long word');
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.87'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'ti'] as const) {
      for (const k of ['news.autoTrace', 'toast.autoTrace', 'hint.sketch', 'hint.sketch.short']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    assert.match(t('en', 'toast.autoTrace', { n: '4' }), /4 walls/);
    const st87 = readFileSync(join(studio, 'store/useProjectStore.ts'), 'utf8');
    assert.match(st87, /if \(closedLoopOf\(points\)\) \{\n\s*get\(\)\.traceSketch\(item\.id, true\);/, 'a closed sketch traces itself');
    assert.match(readFileSync(join(studio, 'lib/geometry.ts'), 'utf8'), /const loop = closedLoopOf\(flat\);\n\s*if \(loop\) \{\n\s*const closed = fitClosedStroke\(loop, opts\);/, 'Trace fits a closed sketch as one closed outline');
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.86'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'ti'] as const) {
      for (const k of ['news.elev', 'obj.elev', 'obj.onFloor', 'obj.onCounter']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    const om86 = readFileSync(join(studio, 'components/ObjectMenu.tsx'), 'utf8');
    assert.match(om86, /label=\{t\(locale, 'obj\.elev'\)\} feet=\{furnHeightOffFloor\(f\)\}/, 'the item panel has Height off floor');
    assert.match(readFileSync(join(studio, 'components/PlanCanvas.tsx'), 'utf8'), /sort\(\(a, b\) => furnHeightOffFloor\(a\) - furnHeightOffFloor\(b\)\)/, 'higher pieces draw on top in the plan');
    assert.match(readFileSync(join(studio, 'lib/repair.ts'), 'utf8'), /elev: Math\.max\(-20, Math\.min\(20, i\.elev\)\)/, 'a saved lift is capped on load');
    assert.match(readFileSync(join(studio, 'index.css'), 'utf8'), /\.object-chip \{ min-height: 44px; \}\n\.object-menu-field input, \.object-menu-field select \{ min-height: 44px; \}/, 'item panel buttons and boxes are 44 px');
    assert.match(readFileSync(join(studio, 'index.css'), 'utf8'), /\.object-chip\[aria-pressed="true"\]::before \{ content: "✓"; \}/, 'the chosen height is marked, not colour only');
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.85'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'ti'] as const) {
      for (const k of ['news.worksheetItems', 'furn.item.bath-sink', 'furn.item.mirror', 'furn.item.counter', 'furn.item.microwave', 'furn.item.tv']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    const fu85 = readFileSync(join(studio, 'data/furniture.ts'), 'utf8');
    for (const id of ['bath-sink', 'mirror', 'counter', 'microwave', 'tv']) assert.match(fu85, new RegExp(`\\{ id: '${id}', `), `${id} is in the furniture list`);
    assert.match(readFileSync(join(studio, 'lib/access.ts'), 'utf8'), /'mirror', 'microwave'\]\);/, 'mirror and microwave are not in a door\'s way');
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.84'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'ti'] as const) {
      for (const k of ['news.itemsAll', 'skill.help.novice', 'skill.help.beginner', 'skill.help.moderate']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    const sk84 = readFileSync(join(studio, 'data/skill.ts'), 'utf8');
    assert.match(sk84, / {2}window: 0,\n/, 'windows at every level');
    assert.match(sk84, / {2}furniture: 0,\n/, 'furniture at every level');
    assert.match(sk84, / {2}plant: 2,\n/, 'plants stay parked at Moderate');
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.83'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'ti'] as const) {
      for (const k of ['news.tinyClass', 'tpl.tiny-class', 'new.moreHead']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    const tpl83 = readFileSync(join(studio, 'data/templates.ts'), 'utf8');
    assert.match(tpl83, /\{ id: 'tiny-class', name: 'Tiny House 7 × 14'/, 'the class tiny house is a New plan card');
    assert.match(tpl83, /styleId === 'tiny-class'\) \{\n[^}]*rectPlan\(0, 0, 14, 7\)/, 'the class tiny house is 14 × 7, the worksheet net');
    assert.match(tpl83, /styleId === 'tiny-class' \? 7 :/, 'the class tiny house has 7 ft walls');
    for (const id of ['tiny-home', 'dog-house', 'mansion']) assert.match(tpl83, new RegExp(`\\{ id: '${id}'[^\\n]*group: 'more' \\}`), `${id} sits in the Contests and the Mansion section`);
    assert.match(readFileSync(join(studio, 'components/NewProjectModal.tsx'), 'utf8'), /tpl\.group === 'more'/, 'the New plan window has a second section');
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.82'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'ti'] as const) assert.notEqual(t(l, 'news.tiNew'), t('en', 'news.tiNew'), l);
    // No language may use one word for both "What's new" and "New".
    for (const l of LOCALES) assert.notEqual(t(l, 'chrome.whatsNew'), t(l, 'chrome.new'), `${l}: What's new and New must differ`);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.81'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'ti'] as const) assert.notEqual(t(l, 'news.photoBarLine'), t('en', 'news.photoBarLine'), l);
    assert.match(readFileSync(join(studio, 'index.css'), 'utf8'), /\.photo-bar button \{ min-height: 44px; padding: 0 16px; white-space: nowrap;/, 'photo bar buttons stay on one line');
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.80'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'ti'] as const) {
      for (const k of ['news.classSection', 'set2.classTitle', 'set2.classNote', 'set2.school', 'set2.className', 'set2.alias', 'set2.aliasHint']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    const cp80 = readFileSync(join(studio, 'components/CustomizePanel.tsx'), 'utf8');
    for (const f of ['schoolName', 'className', 'alias']) assert.match(cp80, new RegExp(`setSettings\\(\\{ ${f}: e\\.target\\.value \\}\\)`), `Settings edits ${f}`);
    assert.ok(!/realName|studentName|firstName|lastName/.test(cp80), 'no real-name field anywhere in Settings');
    assert.match(readFileSync(join(studio, 'lib/storage.ts'), 'utf8'), /alias: classField\(/, 'alias is trimmed and capped on load');
    assert.match(readFileSync(join(studio, 'lib/galleryExport.ts'), 'utf8'), /alias: sanitizeAlias\(opts\.alias\)/, 'the class card export still carries the alias only');
    assert.ok(!/schoolName|className/.test(readFileSync(join(studio, 'lib/galleryExport.ts'), 'utf8')), 'school and class stay out of the class card file');
    assert.match(readFileSync(join(studio, 'components/PhotoBar.tsx'), 'utf8'), /makePostcard\(picture, \{ title, note, byline, footer:/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.79'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'ti'] as const) assert.notEqual(t(l, 'news.settingsTap'), t('en', 'news.settingsTap'), l);
    assert.match(readFileSync(join(studio, 'index.css'), 'utf8'), /\.field input\[type=number\], \.field input\[type=text\], \.field input\[type=color\], \.field select \{[^}]*min-height:44px;/s, 'Settings boxes are 44 px tall');
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.78'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'ti'] as const) assert.notEqual(t(l, 'news.hintAside'), t('en', 'news.hintAside'), l);
    assert.match(readFileSync(join(studio, 'index.css'), 'utf8'), /\.app-shell:has\(\.toast\) \.plan-sheet,\n  \.app-shell:has\(\.toast\) \.canvas-hint \{/, 'the hint steps aside with the sheet');
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.77'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'ti'] as const) assert.notEqual(t(l, 'news.exportFits'), t('en', 'news.exportFits'), l);
    const css77 = readFileSync(join(studio, 'index.css'), 'utf8');
    assert.match(css77, /\.app-shell\.is-phone \.ver-row \{\n    padding: 0 6px;\n    font-size: 10px;[^}]*flex: 0 1 auto;[^}]*min-width: 0;[^}]*text-overflow: ellipsis;/s, 'the phone version chip gives way');
    assert.match(css77, /\.app-shell\.is-phone \.chrome-right > \.save-export > \.chrome-primary \{\n    flex: 0 0 auto;/, 'Export never shrinks');
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.76'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'ti'] as const) assert.notEqual(t(l, 'news.barWrap'), t('en', 'news.barWrap'), l);
    const css76 = readFileSync(join(studio, 'index.css'), 'utf8');
    const tile = css76.slice(css76.indexOf('.chrome-right .chrome-ico,\n  .chrome-right .chrome-more-btn {'));
    assert.match(tile.slice(0, 600), /width: auto;[^}]*min-width: 68px;[^}]*max-width: 100px;/s, 'bar tiles grow for long words (100px since 2.13.88)');
    const label = css76.slice(css76.indexOf('.chrome-ess .chrome-label {\n    display: block !important;'));
    assert.match(label.slice(0, 500), /white-space: normal;[^}]*max-height: 2\.3em;/s, 'bar labels wrap to two lines (2.3em since 2.13.88)');
    assert.ok(!/display: block !important;[^}]*text-overflow: ellipsis/s.test(label.slice(0, 500)), 'no ellipsis on bar labels');
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.75'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'ti'] as const) assert.notEqual(t(l, 'news.teachRoof'), t('en', 'news.teachRoof'), l);
    assert.ok(!/roofStyleName\(null\)/.test(readFileSync(join(studio, 'components/TeachingDrawer.tsx'), 'utf8')), 'Teach panel does not fall back to the English None');
    // Every vocab term has a home-language gloss in every language pack (ar and rw covered 8 of 44 before).
    for (const L of ['ar', 'rw', 'ti', 'fa', 'es', 'uk', 'ru'] as const) {
      for (const v of VOCAB) assert.ok(VOCAB_PACKS[L][v.term] && VOCAB_PACKS[L][v.term].def !== v.def, `${L} vocab ${v.term}`);
    }
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.74'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'ti'] as const) assert.notEqual(t(l, 'news.blankRoof'), t('en', 'news.blankRoof'), l);
    assert.match(readFileSync(join(studio, 'components/NewProjectModal.tsx'), 'utf8'), /\{roof \? roofWord\(roof, locale\) : t\(locale, 'chip\.roofNone'\)\}/, 'a template with no roof says No roof');
    assert.equal(roofWord(null, 'ar'), '', 'roofWord stays empty for no roof; callers add the No roof word');
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.73'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'ti'] as const) {
      for (const k of ['news.newsWords', 'news.cardFits', 'news.dogDoors', 'news.aisle', 'news.robust2', 'news.escape']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    // Every What's new bullet from 2.13.48 on has a translation key (the modal matches bullets by their English text).
    const modal73 = readFileSync(join(studio, 'components/ChangelogModal.tsx'), 'utf8');
    const keys73 = [...(modal73.match(/const NEWS_KEYS = \[([^\]]*)\]/)?.[1] ?? '').matchAll(/'([^']+)'/g)].map((m) => m[1]);
    const english73 = new Set(keys73.map((k) => t('en', k)));
    const cmp = (a: string, b: string) => a.split('.').map(Number).reduce((r, n, i) => r || Math.sign(n - Number(b.split('.')[i] ?? 0)), 0);
    const log73 = readFileSync(join(studio, 'data/changelog.ts'), 'utf8');
    for (const m of log73.matchAll(/version: '([\d.]+)',[\s\S]*?bullets: \[([\s\S]*?)\]/g)) {
      if (cmp(m[1], '2.13.48') < 0) continue;
      for (const b of m[2].matchAll(/'((?:[^'\\]|\\.)*)'/g)) {
        const line = b[1].replace(/\\'/g, "'");
        assert.ok(english73.has(line), `${m[1]} bullet has no news key: ${line.slice(0, 60)}`);
      }
    }
    assert.equal(texShown({ textureId: 'pack:linen', textureLabel: 'Linen' }, 'es', () => 'Linen'), t('es', 'tex.pack.linen'));
    assert.equal(texShown({ textureId: 'pack:linen', textureLabel: 'Papel de la abuela' }, 'es', () => 'Linen'), 'Papel de la abuela');
    assert.equal(texShown({ textureId: 'import:local', textureLabel: 'Imported image' }, 'ar', () => 'Imported image'), t('ar', 'tex.imported'));
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.72'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'ti'] as const) {
      for (const k of ['news.roofWords', 'roof.name.gable', 'roof.name.shed', 'roof.name.grass', 'roof.name.conical', 'tex.imported']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    assert.equal(roofWord('gable', 'ar'), t('ar', 'roof.name.gable'));
    assert.equal(roofShown({ roofStyleId: 'gable', roofLabel: 'Gable' }, 'es', () => 'Gable'), 'A dos aguas', 'the stored English name translates');
    assert.equal(roofShown({ roofStyleId: 'gable', roofLabel: 'Techo de Abuela' }, 'es', () => 'Gable'), 'Techo de Abuela', 'a typed roof name wins');
    for (const f of ['components/PlanCanvas.tsx', 'components/CustomizePanel.tsx', 'components/GalleryCardPreview.tsx', 'lib/photoNote.ts', 'components/TeachingDrawer.tsx']) {
      assert.ok(!/roofLabel\?\.trim\(\) \|\| /.test(readFileSync(join(studio, f), 'utf8')), `${f} shows roofs through roofShown`);
    }
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.71'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.wallChip'), t('en', 'news.wallChip'), l);
    assert.match(readFileSync(join(studio, 'index.css'), 'utf8'), /\.app-shell\.is-phone:has\(\.job-chip\) \.edge-pocket\.has-wall-flyout \.wall-flyout\.is-phone \{ align-self: flex-end; \}/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.70'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.roofs2'), t('en', 'news.roofs2'), l);
    const e70 = readFileSync(join(studio, 'lib/engine3d.ts'), 'utf8');
    assert.match(e70, /if \(roof\.styleId === 'shed' && o\.length >= 4\) \{/, 'shed roofs get one slope');
    assert.match(e70, /if \(roof\.styleId === 'gambrel' && roof\.ridges\.length && o\.length >= 4\) \{/, 'gambrel roofs get a break');
    assert.ok(e70.indexOf("roof.styleId === 'shed'") < e70.indexOf("if (roof.ridges.length && o.length >= 4) {"), 'shed and gambrel come before the gable builder');
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.69'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.mound'), t('en', 'news.mound'), l);
    const e69 = readFileSync(join(studio, 'lib/engine3d.ts'), 'utf8');
    assert.match(e69, /if \(roof\.styleId === 'grass' && roof\.sodEdge && roof\.sodEdge\.length >= 6\) \{/, 'grass roofs get a mound');
    assert.match(e69, /new THREE\.CircleGeometry\(640, 64\)/, 'ground runs past the fog');
    assert.match(readFileSync(join(studio, 'components/EngineView.tsx'), 'utf8'), /PerspectiveCamera\(48, 1, 0\.15, 900\)/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.68'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.cone'), t('en', 'news.cone'), l);
    const e68 = readFileSync(join(studio, 'lib/engine3d.ts'), 'utf8');
    assert.match(e68, /if \(roof\.styleId === 'conical' && roof\.hips\.length\) \{/, 'conical roofs get a cone, not the flat fallback');
    assert.ok(e68.indexOf("roof.styleId === 'conical' && roof.hips.length") < e68.indexOf("floorMesh(bag, o, eh + 0.4, slate, 'roof');"));
    assert.match(readFileSync(join(studio, 'index.css'), 'utf8'), /\.app-shell:has\(\.toast\) \.plan-sheet,?\n[^{]*\{\n[^}]*opacity:0;/, 'plan sheet steps aside under a toast (2.13.68; joined by the hint in 2.13.78)');
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.67'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      for (const k of ['news.cardWords', 'card.preview', 'card.hide', 'card.alias', 'card.proud', 'card.aliasOnly']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    const gc67 = readFileSync(join(studio, 'components/GalleryCardPreview.tsx'), 'utf8');
    assert.ok(!/Plan picture|Coming soon|Gallery alias \(no real name\)|One proud detail|Untitled plan/.test(gc67), 'class card has no hard-coded English');
    assert.match(gc67, /contest\.ribbon\.\$\{/);
    assert.match(readFileSync(join(studio, 'components/HelpModal.tsx'), 'utf8'), /t\(locale, showGallery \? 'card\.hide' : 'card\.preview'\)/);
    const css67 = readFileSync(join(studio, 'index.css'), 'utf8');
    assert.match(css67, /\.aw-gallery-card__body \{ min-width:0; \}/);
    assert.match(css67, /\.aw-gallery-preview-block \.aw-gallery-card \{ grid-template-columns:1fr; \}/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.66'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      for (const k of ['news.allWords', 'crash.title', 'crash.body', 'toast.roofOff', 'toast.wallpaperOff', 'tooltip.catalogFurn']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    const eb66 = readFileSync(join(studio, 'components/ErrorBoundary.tsx'), 'utf8');
    assert.ok(!/Baboo hit a snag|Try recover/.test(eb66), 'crash screen has no hard-coded English');
    assert.equal((eb66.match(/t\(loc, 'crash\./g) ?? []).length, 4);
    const st66 = readFileSync(join(studio, 'store/useProjectStore.ts'), 'utf8');
    assert.ok(!/`Roof: \$\{label\}`|`Wallpaper: \$\{label\}`/.test(st66));
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.65'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.phone3d'), t('en', 'news.phone3d'), l);
    assert.match(readFileSync(join(studio, 'components/EngineView.tsx'), 'utf8'), /const halfH = halfV \* Math\.max\(0\.35, aspect\);/);
    assert.match(readFileSync(join(studio, 'index.css'), 'utf8'), /\.view3d-hud \.view3d-hint \{ display: none; \}/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.64'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.phoneName'), t('en', 'news.phoneName'), l);
    const ch64 = readFileSync(join(studio, 'components/Chrome.tsx'), 'utf8');
    assert.equal((ch64.match(/placeholder=\{t\(locale, 'plan\.untitled'\)\}/g) ?? []).length, 3, 'all three name boxes show the translated hint');
    assert.ok(!/value=\{title\}/.test(ch64));
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.63'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.templatesPass'), t('en', 'news.templatesPass'), l);
    const acc63 = readFileSync(join(studio, 'lib/access.ts'), 'utf8');
    assert.match(acc63, /if \(door\.width >= 6\) continue;/);
    assert.match(acc63, /NOT_IN_THE_WAY\.has\(item\.catalogId\)/);
    assert.match(acc63, /Math\.PI \/ 2\)\) % 2;/);
    assert.match(readFileSync(join(studio, 'data/templates.ts'), 'utf8'), /doorOn\(outer\.walls\[0\]\.id, 0\.5, 3\), \/\/ 3'-0" front door/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.62'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      for (const k of ['news.photoWalk', 'room.nick.Parlor', 'room.nick.Porch']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    // Every template room nickname translates outside English.
    const rooms62 = readFileSync(join(studio, 'data/rooms.ts'), 'utf8');
    for (const m of readFileSync(join(studio, 'data/templates.ts'), 'utf8').matchAll(/room\('[a-z]+', [^)]*?, '([A-Z][^']*)'/g)) {
      if (!['Kitchen', 'Bath', 'Living', 'Dining', 'Entry', 'Bedroom', 'Office', 'Utility', 'Storage', 'Outdoor', 'Other'].includes(m[1])) assert.ok(rooms62.includes(`'${m[1]}'`), `room nickname ${m[1]} is not in ROOM_NICKS`);
    }
    assert.match(readFileSync(join(studio, 'components/EngineView.tsx'), 'utf8'), /try \{ renderer\.domElement\.setPointerCapture/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.61'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      for (const k of ['news.postcard', 'photo.card', 'photo.madeWith']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    assert.match(readFileSync(join(studio, 'components/DollhouseCanvas.tsx'), 'utf8'), /toCanvas\(\{ pixelRatio: 2 \}\)/);
    assert.match(readFileSync(join(studio, 'components/View3DStub.tsx'), 'utf8'), /<PhotoBar /);
    assert.match(readFileSync(join(studio, 'components/PhotoBar.tsx'), 'utf8'), /makePostcard\(/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.60'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      for (const k of ['news.photo', 'photo.hint', 'photo.saved']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    const v60 = readFileSync(join(studio, 'components/View3DStub.tsx'), 'utf8');
    assert.match(readFileSync(join(studio, 'components/PhotoBar.tsx'), 'utf8'), /className="photo-bar"/); // moved into PhotoBar in 2.13.61
    assert.match(v60, /engineRef\.current\?\.snapshot\(2\)/);
    assert.match(readFileSync(join(studio, 'components/EngineView.tsx'), 'utf8'), /__babooSnapshot = \(scale: number\)/);
    assert.ok(!readFileSync(join(studio, 'lib/photo.ts'), 'utf8').includes('fetch('), 'photo must not touch the network');
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.59'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      for (const k of ['news.nyCode', 'acc.ny.dwTitle', 'acc.ny.dwFail', 'acc.ny.legal', 'acc.ny.adaNote', 'arch.ny.small', 'arch.ny.narrow']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    const ad59 = readFileSync(join(studio, 'components/AccessDrawer.tsx'), 'utf8');
    assert.match(ad59, /acc\.ny\.disclaimer/);
    assert.match(ad59, /acc\.ny\.legal/);
    assert.match(t('en', 'acc.ny.legal'), /2025 Residential Code of New York State/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.58'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      for (const k of ['news.rtlSizes', 'ver.holdTeacher']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    assert.ok(t('ar', 'sheet.grid', { n: '1\'-0"' }).includes('\u20681\'-0"\u2069'));
    assert.ok(!readFileSync(join(studio, 'components/VersionChip.tsx'), 'utf8').includes('long-press for Teacher'));
    assert.match(readFileSync(join(studio, 'components/PlanCanvas.tsx'), 'utf8'), /toLocaleDateString\(localeOption\(locale\)\.htmlLang/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.57'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.fitFree'), t('en', 'news.fitFree'), l);
    const st57 = readFileSync(join(studio, 'store/useProjectStore.ts'), 'utf8');
    assert.match(st57, /const ins = readInsets\(\);/);
    assert.match(st57, /panY: ins\.top \+ fh \/ 2 - cy \* zoom/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.56'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.tags'), t('en', 'news.tags'), l);
    const dh56 = readFileSync(join(studio, 'components/DollhouseCanvas.tsx'), 'utf8');
    assert.match(dh56, /cornerRadius=\{tagH \/ 2\}/);
    const css56 = readFileSync(join(studio, 'index.css'), 'utf8');
    assert.match(css56, /@media \(max-height: 500px\) \{\n  \.app-shell\.is-phone \.job-chip \{ flex-wrap: nowrap;/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.55'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      for (const k of ['news.names', 'plan.untitled', 'chrome.classShare']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    const st55 = readFileSync(join(studio, 'lib/storage.ts'), 'utf8');
    assert.ok(!st55.includes("replace(/[^\\w\\- ]+/g"), 'storage still drops non-ASCII letters');
    assert.match(st55, /\\p\{L\}/);
    const ch55 = readFileSync(join(studio, 'components/Chrome.tsx'), 'utf8');
    assert.match(ch55, /placeholder=\{t\(locale, 'plan\.untitled'\)\}/);
    assert.ok(!ch55.includes('>Class share<'));
    assert.ok(!readFileSync(join(studio, 'components/PlanCanvas.tsx'), 'utf8').includes("title || 'Untitled Plan'"));
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.54'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.wallUnits'), t('en', 'news.wallUnits'), l);
    const wf54 = readFileSync(join(studio, 'components/WallFlyout.tsx'), 'utf8');
    assert.doesNotMatch(wf54, /^\s+\{mm\}mm$|^\s+\{m\.toFixed\(1\)\}m$/m);
    assert.match(wf54, /thicknessLabel\(mm, units\)/);
    assert.match(wf54, /<details className="wall-flyout-fold">/);
    assert.ok(!wf54.includes("t(locale, 'wall.tip')"));
    for (const l of ['en', 'es', 'ar', 'uk', 'rw', 'ti', 'fa-AF'] as const) assert.match(t(l, 'tooltip.wall'), /\s\([A-Z]\)$/, l);
    const rooms54 = readFileSync(join(studio, 'lib/rooms.ts'), 'utf8');
    assert.ok(!rooms54.includes('} sq ft`'));
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.53'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      for (const k of ['news.challengeWords', 'ch.ch-scale-room.title', 'ch.C-BRIEF.prompt', 'ch.C-DOG-HOUSE-CONTEST.r2']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    const td53 = readFileSync(join(studio, 'components/TeachingDrawer.tsx'), 'utf8');
    for (const old of ['<h4>{c.title}</h4>', '{c.prompt}', '{r.text}', 'pts)</em>']) assert.ok(!td53.includes(old), old);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.52'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      for (const k of ['news.teachWords', 'arch.env.title', 'arch.tri.bad', 'teach.u1.s7', 'teach.dog.done', 'teach.nov.s4', 'teach.ref.traffic.prompt']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    const ar52 = readFileSync(join(studio, 'lib/architect.ts'), 'utf8');
    assert.doesNotMatch(ar52.slice(ar52.indexOf('export function runArchitectCheck')), /(?:title|detail|tip):\s*['`][A-Z]/);
    // English step keys must match the lesson data word for word.
    const teach52 = readFileSync(join(studio, 'data/teaching.ts'), 'utf8');
    const skill52 = readFileSync(join(studio, 'data/skill.ts'), 'utf8');
    const listOf = (src: string, name: string) => [...src.slice(src.indexOf(name)).split(/\n\s*\],?/)[0].matchAll(/^\s*'((?:[^'\\]|\\.)*)',?$/gm)].map((m) => m[1].replace(/\\'/g, "'"));
    const sets: [string, string[]][] = [['teach.u1', listOf(teach52.slice(teach52.indexOf('export const UNIT_1')), 'steps:')], ['teach.dog', listOf(teach52.slice(teach52.indexOf('export const DOG_HOUSE_UNIT')), 'steps:')], ['teach.nov', listOf(skill52, 'NOVICE_UNIT_STEPS')]];
    for (const [key, steps] of sets) {
      assert.ok(steps.length >= 4, key);
      steps.forEach((s, i) => assert.equal(t('en', `${key}.s${i + 1}`), s, `${key}.s${i + 1}`));
    }
    assert.match(readFileSync(join(studio, 'components/TeachingDrawer.tsx'), 'utf8'), /runArchitectCheck\(floor, units, styleId, locale\)/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.51'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      for (const k of ['news.dogWords', 'dog.den.title', 'dog.scale.pass', 'dog.door.extra', 'dog.shade.passTip', 'teach.areaLabel', 'teach.util', 'teach.check.sleep']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    const dog51 = readFileSync(join(studio, 'lib/contest.ts'), 'utf8');
    assert.doesNotMatch(dog51.slice(dog51.indexOf('export function judgeDogHouse')), /(?:title|detail|tip):\s*['`][A-Z]/);
    assert.match(readFileSync(join(studio, 'components/ContestDrawer.tsx'), 'utf8'), /judgeDogHouse\(floor, \{ roofStyleId, units, locale \}\)/);
    const td51 = readFileSync(join(studio, 'components/TeachingDrawer.tsx'), 'utf8');
    for (const old of ['Approx. floor area', '<h3>Style term</h3>', '<h3>Named rooms</h3>', 'Every student project needs', 'Dismiss teaching']) assert.ok(!td51.includes(old), old);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.50'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      for (const k of ['news.accessWords', 'acc.legal', 'acc.head.good', 'acc.dw.fail', 'acc.turn.pass', 'acc.k.fail']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    const acc50 = readFileSync(join(studio, 'lib/access.ts'), 'utf8');
    assert.doesNotMatch(acc50, /(?:title|detail|tip): ['`][A-Z]/);
    const ad50 = readFileSync(join(studio, 'components/AccessDrawer.tsx'), 'utf8');
    for (const old of ["'Looks good'", 'Classroom check', '<h2>Access</h2>', 'Real ADA is bigger']) assert.ok(!ad50.includes(old), old);
    // Every template furniture nickname translates outside English.
    const cat50 = Object.fromEntries([...readFileSync(join(studio, 'data/furniture.ts'), 'utf8').matchAll(/\{ id: '([\w-]+)', name: '([^']+)'/g)].map((m) => [m[1], m[2]]));
    const stock50 = readFileSync(join(studio, 'data/furniture.ts'), 'utf8');
    for (const m of readFileSync(join(studio, 'data/templates.ts'), 'utf8').matchAll(/furn\('([\w-]+)',[^)]*?,\s*'([^'#][^']*)'/g)) {
      if (cat50[m[1]] !== m[2]) assert.ok(stock50.includes(`'${m[2]}'`), `template name ${m[2]} for ${m[1]} is not in STOCK_LABELS`);
    }
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.49'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      for (const k of ['news.robust', 'toast.importFixed', 'toast.importFixed1', 'toast.notPlan', '3d.fail.title', '3d.fail.body', '3d.fail.retry']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    assert.ok(t('uk', 'toast.importFixed', { n: '3' }).includes('3'));
    const v3d49 = readFileSync(join(studio, 'components/View3DStub.tsx'), 'utf8');
    assert.match(v3d49, /<Engine3DGuard loc=\{loc\}/);
    assert.match(readFileSync(join(studio, 'components/EngineView.tsx'), 'utf8'), /addEventListener\('webglcontextlost', onLost\)/);
    assert.match(readFileSync(join(studio, 'lib/storage.ts'), 'utf8'), /const f = repairFloor\(raw, report\);/);
    for (const m of ['ChangelogModal', 'HelpModal', 'NewProjectModal', 'AccessDrawer', 'ContestDrawer', 'TeachingDrawer', 'ClassShareModal']) {
      assert.match(readFileSync(join(studio, `components/${m}.tsx`), 'utf8'), /useEscape\(/, m);
    }
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.48'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      for (const k of ['news.tipsWords', 'tip.trace', 'tip.fold', 'save.ok', 'save.fail', 'toast.mansionReady', 'a11y.next', 'a11y.access']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    assert.ok(t('es', 'save.ok', { title: 'Casa' }).includes('Casa'));
    const tr48 = readFileSync(join(studio, 'components/ToolRail.tsx'), 'utf8');
    for (const old of ['title="Duplicate', 'title="Rotate 90', 'title="Hide tools', 'title="Turn the latest']) assert.ok(!tr48.includes(old), old);
    const st48 = readFileSync(join(studio, 'store/useProjectStore.ts'), 'utf8');
    assert.ok(!st48.includes("'Could not save on this Chromebook") && !st48.includes("'The Mansion is ready"));
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.47'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      for (const k of ['news.settingsWords', 'set2.layers', 'set2.roofNote', 'set2.footer', 'theme.ink', 'toast.clipped', 'toast.wallpaperFail']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    const cp47 = readFileSync(join(studio, 'components/CustomizePanel.tsx'), 'utf8');
    for (const old of ['Hide plan overlays while you draft.', 'Few settings on purpose.', 'Accent color</span>', "'Plain paint'", 'Current:{']) assert.ok(!cp47.includes(old), old);
    const st47 = readFileSync(join(studio, 'store/useProjectStore.ts'), 'utf8');
    assert.ok(!st47.includes("'Corner clipped") && !st47.includes("'That corner is too tight"));
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.46'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      for (const k of ['news.oneRoom', 'tooltip.wall', 'tooltip.pan', 'toast.roomOutside', 'toast.roomSame']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    const store46 = readFileSync(join(studio, 'store/useProjectStore.ts'), 'utf8');
    assert.match(store46, /const already = \(floor\.rooms \?\? \[\]\)\.find\(\(r\) => pointInPoly\(/);
    assert.doesNotMatch(store46, /'That room is already named/);
    assert.match(readFileSync(join(studio, 'components/ToolRail.tsx'), 'utf8'), /title=\{tx\(locale, `tooltip\.\$\{t\.id\}`\)\}/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.45'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      for (const k of ['news.newPlan', 'tpl.blank', 'tpl.colonial', 'tpl.mansion', 'tpl.dog-house']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    const np45 = readFileSync(join(studio, 'components/NewProjectModal.tsx'), 'utf8');
    assert.match(np45, /<details className="new-skill-fold">/);
    assert.match(np45, /t\(locale, `tpl\.\$\{tpl\.id\}`\)/);
    assert.doesNotMatch(np45, /\{tpl\.blurb\}/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.44'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      for (const k of ['news.chain', 'hint.wall.next']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    const store44 = readFileSync(join(studio, 'store/useProjectStore.ts'), 'utf8');
    assert.match(store44, /wallDraft: endsOnCorner \? null : endPt,/);
    assert.match(store44, /if \(!chained\) get\(\)\.showToast/);
    assert.match(readFileSync(join(studio, 'components/ObjectMenu.tsx'), 'utf8'), /r\.name === roomType\(r\.kind\)\.name \? roomLabel\(locale, r\) : r\.name/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.43'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.rooms2'), t('en', 'news.rooms2'));
    const tpl43 = readFileSync(join(studio, 'data/templates.ts'), 'utf8');
    assert.match(tpl43, /room\('kitchen', 22, 15, undefined, 'checker'\)/);
    assert.match(tpl43, /room\('bedroom', 5, 18\.2, undefined, 'carpet'\)/);
    assert.match(tpl43, /room\('bedroom', 11, 21, undefined, 'carpet'\)/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.42'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.rooms'), t('en', 'news.rooms'));
    const tpl42 = readFileSync(join(studio, 'data/templates.ts'), 'utf8');
    assert.match(tpl42, /function splitAtJunctions\(floor: Floor\)/);
    assert.match(tpl42, /room\('bedroom', 41, 15, undefined, 'carpet'\)/);
    assert.match(tpl42, /room\('entry', 16, 10, 'Hall', 'marble'\)/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.41'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.styles'), t('en', 'news.styles'));
    const tpl41 = readFileSync(join(studio, 'data/templates.ts'), 'utf8');
    assert.match(tpl41, /const STYLE_LOOK: Partial<Record<StyleId/);
    assert.match(tpl41, /const wallTintId = dressOutside\(styleId, floor\);/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.40'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      for (const k of ['news.a11y', 'plan.label', 'plan.summary', 'plan.rooms']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    const plan40 = readFileSync(join(studio, 'components/PlanCanvas.tsx'), 'utf8');
    assert.match(plan40, /aria-describedby="plan-sr-summary"/);
    assert.match(plan40, /role="region"\n      tabIndex=\{0\}/);
    assert.match(readFileSync(join(studio, 'index.css'), 'utf8'), /\.plan-canvas:focus-visible/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.39'/);
    assert.equal(t('en', 'tool.min'), 'Fold');
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      for (const k of ['news.fold', 'tool.min']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    assert.match(readFileSync(join(studio, 'index.css'), 'utf8'), /\.view-only-chip \{\n  font-family: inherit !important;/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.38'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.sizesClear'), t('en', 'news.sizesClear'));
    const plan38 = readFileSync(join(studio, 'components/PlanCanvas.tsx'), 'utf8');
    assert.match(plan38, /const onTag = \[\.\.\.roomTagRects\.values\(\)\]/);
    assert.match(plan38, /openings=\{floor\.layers\.openings \? floor\.openings : \[\]\}/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.37'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.sizesOnTop'), t('en', 'news.sizesOnTop'));
    const plan37 = readFileSync(join(studio, 'components/PlanCanvas.tsx'), 'utf8');
    assert.match(plan37, /function WallSizeLabel\(/);
    assert.ok(plan37.indexOf('<WallSizeLabel') > plan37.indexOf("floor.layers.landscape !== false && (floor.landscape ?? []).map"), 'sizes draw after plants');
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.36'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.walkFast'), t('en', 'news.walkFast'));
    const ev36 = readFileSync(join(studio, 'components/EngineView.tsx'), 'utf8');
    assert.match(ev36, /const FAR_FURN_FT = 26;/);
    assert.match(ev36, /f\.visible = !walking \|\| Math\.hypot/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.35'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      for (const k of ['news.fps', '3d.fps', '3d.look.rich', '3d.look.plain']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    assert.match(readFileSync(join(studio, 'components/EngineView.tsx'), 'utf8'), /new CustomEvent\('baboo-fps'/);
    assert.match(readFileSync(join(studio, 'components/View3DStub.tsx'), 'utf8'), /function FpsBadge\(/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.34'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.furniture3d'), t('en', 'news.furniture3d'));
    assert.match(readFileSync(join(studio, 'components/EngineView.tsx'), 'utf8'), /const RICHER = new Set\(\['bed-twin'/);
    const tpl34 = readFileSync(join(studio, 'data/templates.ts'), 'utf8');
    assert.match(tpl34, /furn\('dining-chair', 42, 17\.4, 1\.5, 1\.5, 'Chair', Math\.PI\)/);
    assert.match(tpl34, /furn\('chair', 5, 18, 2\.5, 2\.5, 'Armchair', -Math\.PI \/ 2/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.33'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.shade'), t('en', 'news.shade'));
    const eng33 = readFileSync(join(studio, 'lib/engine3d.ts'), 'utf8');
    assert.match(eng33, /function aoMat\(bag: Bag, top: boolean\)/);
    assert.match(eng33, /for \(const \[r0, r1\] of runs\) strip\(r0, r1, 0\.45, 1\.9, false\)/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.32'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.glass'), t('en', 'news.glass'));
    const eng32 = readFileSync(join(studio, 'lib/engine3d.ts'), 'utf8');
    assert.match(eng32, /function glassMap\(/);
    assert.doesNotMatch(eng32, /mat\(bag, '#3E5468'/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.31'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.crown'), t('en', 'news.crown'));
    assert.match(readFileSync(join(studio, 'lib/engine3d.ts'), 'utf8'), /Crown molding where the wall meets the ceiling/);
    const tpl31 = readFileSync(join(studio, 'data/templates.ts'), 'utf8');
    assert.doesNotMatch(tpl31, /plant\('lamp', 4, 16,/);
    assert.match(tpl31, /plant\('lamp', -4, 38,/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.30'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.lamps'), t('en', 'news.lamps'));
    const eng30 = readFileSync(join(studio, 'lib/engine3d.ts'), 'utf8');
    assert.match(eng30, /function addSconce\(/);
    assert.match(eng30, /function addFloorLamp\(/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.29'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.fixtures'), t('en', 'news.fixtures'));
    const eng29 = readFileSync(join(studio, 'lib/engine3d.ts'), 'utf8');
    assert.match(eng29, /function addChandelier\(/);
    assert.match(eng29, /function bake\(/);
    assert.match(eng29, /ang \+ swing \* 1\.45/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.28'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.roofTag'), t('en', 'news.roofTag'));
    assert.match(readFileSync(join(studio, 'components/PlanCanvas.tsx'), 'utf8'), /\{isGrass \? \(<>/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.27'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.tidy'), t('en', 'news.tidy'));
    const store27 = readFileSync(join(studio, 'store/useProjectStore.ts'), 'utf8');
    assert.match(store27, /'floorFinishId' in patch \|\| 'wallPaint' in patch\) get\(\)\.pushHistory\(\)/);
    assert.match(store27, /patchRooms: \(ids, patch\) => \{/);
    const plan27 = readFileSync(join(studio, 'components/PlanCanvas.tsx'), 'utf8');
    assert.match(plan27, /if \(tw \+ 6 \/ zoom > len\) return null;/);
    assert.match(plan27, /const pad = 1\.2 \+ 34 \/ Math\.max\(1, zoom\);/);
    assert.match(readFileSync(join(studio, 'components/ObjectMenu.tsx'), 'utf8'), /const autoFolded = useRef\(false\);/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.26'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      for (const k of ['news.touch3d', '3d.drag.touch', '3d.drag.walk.touch', '3d.walk.exit']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    const ev26 = readFileSync(join(studio, 'components/EngineView.tsx'), 'utf8');
    assert.match(ev26, /let pinch: \{ d: number; dist: number; walked: number \} \| null/);
    assert.match(ev26, /function fitCam\(root: THREE\.Object3D, aspect = 1\.6\)/);
    assert.match(readFileSync(join(studio, 'components/View3DStub.tsx'), 'utf8'), /'3d\.walk\.exit'/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.25'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.polish'), t('en', 'news.polish'));
    const css25 = readFileSync(join(studio, 'index.css'), 'utf8');
    assert.match(css25, /\.view3d-hud-btns \.ghost-btn \{\n  white-space: nowrap;/);
    assert.match(css25, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
    assert.match(readFileSync(join(studio, 'components/ObjectMenu.tsx'), 'utf8'), /<details className="object-more">/);
    assert.match(readFileSync(join(studio, 'components/PlanCanvas.tsx'), 'utf8'), /const roomTagRects = new Map/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.24'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      for (const k of ['news.finishes', 'face.outside', 'face.room', 'skin.siding', 'obj.wallPaint', 'obj.ground', 'chrome.views']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    const menu24 = readFileSync(join(studio, 'components/ObjectMenu.tsx'), 'utf8');
    assert.match(menu24, /wallFaces\(w, faceLookup\(floor\)\)/);
    assert.match(menu24, /patchRoom\(r\.id, \{ wallPaint: p\.hex \}\)/);
    assert.match(readFileSync(join(studio, 'lib/engine3d.ts'), 'utf8'), /resolveFace\(wall, inSide, roomOf\)/);
    assert.match(readFileSync(join(studio, 'components/DollhouseCanvas.tsx'), 'utf8'), /const faceFill = /);
    assert.match(readFileSync(join(studio, 'components/Chrome.tsx'), 'utf8'), /className="phone-views"/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.23'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.frames'), t('en', 'news.frames'));
    const plan23 = readFileSync(join(studio, 'components/PlanCanvas.tsx'), 'utf8');
    assert.match(plan23, /label\.length \* font \* 0\.64/);
    assert.match(plan23, /wrap="none"/);
    assert.match(readFileSync(join(studio, 'lib/engine3d.ts'), 'utf8'), /const lineHole = /);
    const ev23 = readFileSync(join(studio, 'components/EngineView.tsx'), 'utf8');
    assert.match(ev23, /function flattenModel\(/);
    assert.match(ev23, /if \(f\) camRef\.current = \{[^}]*pitch: 1\.1\d \}/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.22'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.inside3d'), t('en', 'news.inside3d'));
    const eng22 = readFileSync(join(studio, 'lib/engine3d.ts'), 'utf8');
    assert.match(eng22, /lights: THREE\.Vector3\[\]/);
    assert.match(eng22, /name = 'ceiling'|'ceiling'/);
    const ev22 = readFileSync(join(studio, 'components/EngineView.tsx'), 'utf8');
    assert.match(ev22, /function dressFurniture\(/);
    assert.doesNotMatch(ev22, /https?:\/\/[^'"\s]*\.glb/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.21'/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.21'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      for (const k of ['news.modes', '3d.top', '3d.front', '3d.turnL', 'skill.uses', 'skill.help.expert']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    const ev = readFileSync(join(studio, 'components/EngineView.tsx'), 'utf8');
    assert.match(ev, /let savedCam/);
    assert.match(ev, /preset: \(kind: 'front' \| 'top'\)/);
    assert.match(ev, /window\.addEventListener\('keydown', onKey\)/);
    assert.match(readFileSync(join(studio, 'App.tsx'), 'utf8'), /vm === 'solid3d' \|\| vm === 'walkthrough'/);
    assert.match(readFileSync(join(studio, 'components/SkillPicker.tsx'), 'utf8'), /skill-what/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.20'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.mansion'), t('en', 'news.mansion'));
    const eng = readFileSync(join(studio, 'lib/engine3d.ts'), 'utf8');
    for (const fn of ['addPorchRail', 'addPorchRoof', 'addChimneys', 'addDormers', 'dressOpening']) assert.match(eng, new RegExp(`function ${fn}\\(`));
    const tpl = readFileSync(join(studio, 'data/templates.ts'), 'utf8');
    assert.equal((tpl.match(/furn\('fireplace'/g) ?? []).length >= 2, true);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.19'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      for (const k of ['news.tools2d', 'obj.swingL', 'obj.outside', 'obj.wallpaper', 'rooms.lead', 'room.kind.living', 'room.blurb.kitchen', 'tex.pack.plain']) assert.notEqual(t(l, k), t('en', k), `${l} ${k}`);
    }
    const menuSrc = readFileSync(join(studio, 'components/ObjectMenu.tsx'), 'utf8');
    assert.match(menuSrc, /function NoteText/);
    assert.match(menuSrc, /fresh=\{n\.text === 'Note'\}/);
    assert.doesNotMatch(menuSrc, />\s*(Swing L|Swing R|Outside|Inside|Wallpaper|Trace to walls)\s*</);
    assert.doesNotMatch(readFileSync(join(studio, 'components/RoomSidebar.tsx'), 'utf8'), /<h2>Rooms<\/h2>/);
    assert.match(readFileSync(join(studio, 'components/PlanCanvas.tsx'), 'utf8'), /pointInPoly\(\{ x: room\.x, y: room\.y \+ oy \}/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.18'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.look3d'), t('en', 'news.look3d'));
    const engineSrc = readFileSync(join(studio, 'components/EngineView.tsx'), 'utf8');
    assert.match(engineSrc, /scene\.environment = /);
    assert.match(engineSrc, /function pickTier/);
    assert.match(engineSrc, /avg > 40 && composer/);
    assert.doesNotMatch(engineSrc, /PCFSoftShadowMap/);
    assert.doesNotMatch(engineSrc, /https?:\/\//);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.17'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      assert.notEqual(t(l, 'news.furn'), t('en', 'news.furn'));
      assert.notEqual(t(l, 'furn.item.bed-twin'), t('en', 'furn.item.bed-twin'));
      assert.notEqual(t(l, 'furn.cat.kitchen'), t('en', 'furn.cat.kitchen'));
      assert.notEqual(t(l, 'obj.delete'), t('en', 'obj.delete'));
    }
    const side = readFileSync(join(studio, 'components/FurnitureSidebar.tsx'), 'utf8');
    assert.match(side, /furn\.item\./);
    assert.doesNotMatch(side, /<h2>Furniture<\/h2>|>\s*Hide\s*</);
    const cat = readFileSync(join(studio, 'data/furniture.ts'), 'utf8');
    for (const m of cat.matchAll(/id: '([^']+)'/g)) assert.ok(existsSync(join(studio, '../../public/objects/baboo', `${m[1]}.svg`)), m[1]);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.16'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.view3d'), t('en', 'news.view3d'));
    const dollSrc = readFileSync(join(studio, 'components/DollhouseCanvas.tsx'), 'utf8');
    assert.doesNotMatch(dollSrc, /projectPoints\(floor\.nodes\.map/);
    assert.match(dollSrc, /drawList\.map/);
    assert.match(readFileSync(join(studio, 'lib/engine3d.ts'), 'utf8'), /meshFromPos\(bag, pos, slate, 'roof', true\)/);
    // a two-story box with a 4 ft bay: the upstairs floor stops at the main wall, not the bay
    const n = (id: string, x: number, y: number) => ({ id, x, y });
    const w = (id: string, a: string, b: string) => ({ id, a, b, kind: 'exterior' as const, thickness: 0.55, levels: 2 });
    const body = upperBody({
      nodes: [n('a', 0, 8), n('b', 3, 8), n('c', 3, 4), n('d', 15, 4), n('e', 15, 8), n('f', 56, 8), n('g', 56, 40), n('h', 0, 40)],
      walls: [w('1', 'a', 'b'), w('2', 'b', 'c'), w('3', 'c', 'd'), w('4', 'd', 'e'), w('5', 'e', 'f'), w('6', 'f', 'g'), w('7', 'g', 'h'), w('8', 'h', 'a')],
      rooms: [], openings: [], furniture: [],
    } as never);
    assert.deepEqual(body, { minX: 0, minY: 8, maxX: 56, maxY: 40 });
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.15'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.words'), t('en', 'news.words'));
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.lead'), t('en', 'news.lead'));
    assert.match(readFileSync(join(studio, 'components/ChangelogModal.tsx'), 'utf8'), /'news\.words'/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.14'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.save'), t('en', 'news.save'));
    assert.match(readFileSync(join(studio, 'components/Chrome.tsx'), 'utf8'), /save-status/);
    assert.match(readFileSync(join(studio, 'components/Chrome.tsx'), 'utf8'), /aria-live="polite"/);
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.13'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.modelviewer'), t('en', 'news.modelviewer'));
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.12'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.konva'), t('en', 'news.konva'));
    const pkg = JSON.parse(readFileSync(join(studio, '../../package.json'), 'utf8'));
    assert.equal(pkg.dependencies.konva, '^10.7.0');
    assert.equal(pkg.dependencies['react-konva'], '^19.3.0');
    assert.match(readFileSync(join(studio, 'data/changelog.ts'), 'utf8'), /version:\s*'2\.13\.11'/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.decoders'), t('en', 'news.decoders'));
    const peek = readFileSync(join(studio, 'components/ModelPeek.tsx'), 'utf8');
    assert.match(peek, /dracoDecoderLocation: DRACO_DECODER_PATH/);
    assert.match(peek, /ktx2TranscoderLocation: KTX2_TRANSCODER_PATH/);
    assert.ok(peek.indexOf('g.ModelViewerElement = {') < peek.indexOf("import('@google/model-viewer')"));
    const pub = join(studio, '../../public/vendor');
    for (const f of ['draco/1.5.6/draco_decoder.js', 'draco/1.5.6/draco_decoder.wasm', 'draco/1.5.6/draco_wasm_wrapper.js', 'basis/2021-04-15-ba1c3e4/basis_transcoder.js', 'basis/2021-04-15-ba1c3e4/basis_transcoder.wasm']) assert.ok(readFileSync(join(pub, f)).length > 50000, f);
    assert.doesNotMatch(readFileSync(join(studio, '../styles.css'), 'utf8'), /fonts\.googleapis/);
    const changelog = readFileSync(join(studio, 'data/changelog.ts'), 'utf8');
    assert.match(changelog, /version:\s*'2\.13\.10'/);
    assert.match(changelog, /The Menu starts under the top bar/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.close'), t('en', 'news.close'));
    const closeCss = readFileSync(join(studio, 'index.css'), 'utf8');
    assert.match(closeCss, /html:not\(\.kb-framed\) body\.kb-on \.menu-drawer \{\s*top: 48px;/);
    assert.match(changelog, /version:\s*'2\.13\.9'/);
    assert.match(changelog, /One Menu button, at the top left/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.menu'), t('en', 'news.menu'));
    const menuCss = readFileSync(join(studio, 'index.css'), 'utf8');
    assert.match(menuCss, /\.app-shell\.is-phone \.menu-btn:not\(\.kb-menu-dupe\)/);
    assert.match(changelog, /version:\s*'2\.13\.8'/);
    assert.match(changelog, /Nothing is cut off at the bottom of the screen/);
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(t(l, 'news.fit'), t('en', 'news.fit'));
    const shellCss = readFileSync(join(studio, 'index.css'), 'utf8');
    assert.doesNotMatch(shellCss, /html, body, #root, #app, \.app-shell \{/);
    assert.match(changelog, /version:\s*'2\.13\.7'/);
    assert.match(changelog, /3D View and Dollhouse open every time/);
    const chrome = readFileSync(join(studio, 'components/Chrome.tsx'), 'utf8');
    assert.doesNotMatch(chrome, /disabled=\{!closed\}/);
    assert.match(changelog, /version:\s*'2\.13\.6'/);
    assert.match(changelog, /Safety update to the app engine/);
    assert.match(changelog, /version:\s*'2\.13\.5'/);
    assert.match(changelog, /Baboo follows your Hub language/);
    assert.match(changelog, /version:\s*'2\.13\.4'/);
    assert.match(changelog, /Baboo follows the Hub language/);
    assert.match(changelog, /version:\s*'2\.13\.3'/);
    assert.match(changelog, /version:\s*'2\.13\.2'/);
    assert.match(changelog, /version:\s*'2\.13\.1'/);
    assert.match(changelog, /version:\s*'2\.10\.1'/);
    const engine = readFileSync(join(studio, 'lib/engine3d.ts'), 'utf8');
    assert.match(engine, /ExtrudeGeometry/);
    assert.match(engine, /type !== 'door'/);
    assert.match(readFileSync(join(studio, 'lib/stories.ts'), 'utf8'), /houseHasUpper/);
    assert.match(readFileSync(join(studio, 'components/CoachBanner.tsx'), 'utf8'), /Start the job/);
    assert.match(readFileSync(join(studio, '../routes/__root.tsx'), 'utf8'), /kulibert-bar\.js/);
    const view = readFileSync(join(studio, 'components/EngineView.tsx'), 'utf8');
    assert.match(view, /WebGLRenderer/);
    const stub = readFileSync(join(studio, 'components/View3DStub.tsx'), 'utf8');
    assert.match(stub, /import\('\.\/EngineView'\)/);
    assert.doesNotMatch(stub, /<svg/);
    assert.match(changelog, /version:\s*'2\.10\.0'/);
    assert.match(changelog, /version:\s*'2\.9\.1'/);
    assert.match(changelog, /version:\s*'2\.9\.0'/);
    assert.match(changelog, /version:\s*'2\.8\.1'/);
    const templates = readFileSync(join(studio, 'data/templates.ts'), 'utf8');
    assert.match(templates, /function buildMansion/);
    assert.match(changelog, /version:\s*'2\.8\.0'/);
    assert.match(changelog, /version:\s*'2\.7\.0'/);
    assert.match(changelog, /version:\s*'2\.6\.0'/);
    assert.match(changelog, /version:\s*'2\.5\.3'/);
    const rooms = readFileSync(join(studio, 'lib/rooms.ts'), 'utf8');
    assert.match(rooms, /export function roomBundle/);
    assert.match(changelog, /version:\s*'2\.5\.2'/);
    assert.match(changelog, /version:\s*'2\.5\.1'/);
    assert.match(changelog, /version:\s*'2\.5\.0'/);
    assert.match(changelog, /version:\s*'2\.4\.3'/);
    assert.match(templates, /function furnishYard/);
    assert.match(templates, /Bookcase/);
    assert.match(changelog, /version:\s*'2\.4\.2'/);
    assert.match(changelog, /version:\s*'2\.4\.1'/);
    assert.match(changelog, /version:\s*'2\.4\.0'/);
    assert.match(changelog, /version:\s*'2\.3\.2'/);
    assert.match(changelog, /version:\s*'2\.3\.1'/);
    assert.match(changelog, /version:\s*'2\.3\.0'/);
    assert.match(changelog, /version:\s*'2\.2\.9'/);
    assert.match(changelog, /version:\s*'2\.2\.8'/);
    assert.match(changelog, /version:\s*'2\.2\.7'/);
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
    assert.match(css, /\.inspect-dock \{[\s\S]*?left:\s*56px/);
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
    assert.match(css, /\.aw-ribbon/);
    const rail = readFileSync(join(studio, 'components/ToolRail.tsx'), 'utf8');
    assert.match(rail, /id: 'box'/);
    assert.match(t('en', 'coach.close.body'), /Tap Box/);
    assert.match(t('en', 'tool.box'), /Box/);
    const menu = chrome.slice(chrome.indexOf('chrome-more-menu'));
    const student = menu.slice(0, menu.indexOf('{teacherChrome &&'));
    assert.doesNotMatch(student, /classCard/);
    assert.match(menu, /teacherChrome[\s\S]*classCard/);
    assert.doesNotMatch(readFileSync(join(studio, 'components/View3DStub.tsx'), 'utf8'), /tier-ladder/);
    assert.match(css, /left:88px/);
  });

  it('Wall flyout is docked to the Wall chip, not a permanent rail', () => {
    const rail = readFileSync(join(studio, 'components/ToolRail.tsx'), 'utf8');
    const fly = readFileSync(join(studio, 'components/WallFlyout.tsx'), 'utf8');
    const draft = readFileSync(join(studio, 'lib/wallDraft.ts'), 'utf8');
    assert.match(rail, /WallFlyout/);
    assert.match(rail, /is-fancy/);
    assert.match(fly, /WALL_THICKNESS_MM/);
    assert.match(fly, /WALL_HEIGHT_M/);
    assert.match(fly, /tooltip\.wall/); // 2.13.54: the card tip matches the corner-to-corner Wall tool
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
      assert.match(line, /Teach|Enseñar|Навчан|Урок|ምምሃር|آموزش|تعلّم|Kwiga/i);
    }
  });
});
