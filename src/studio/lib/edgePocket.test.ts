import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { APP_VERSION } from '../version.ts';
import { LOCALES, t } from '../data/i18n.ts';
import { upperBody } from './stories.ts';

const studio = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('2.13.48 tips and labels, 2.13.47 settings words, 2.13.46 one room one name, 2.13.45 new plan on phones, 2.13.44 join walls, 2.13.43 more rooms, 2.13.42 real rooms, 2.13.41 house looks, 2.13.40 screen readers, 2.13.39 one font, 2.13.38 clear sizes, 2.13.37 sizes on top, 2.13.36 lighter walk, 2.13.35 speed readout, 2.13.34 furniture, 2.13.33 soft shade, 2.13.32 glass, 2.13.31 crown, 2.13.30 lamps, 2.13.29 fixtures, 2.13.28 roof tag, 2.13.27 tidy, 2.13.26 touch 3d, 2.13.25 polish, 2.13.24 finishes, 2.13.23 frames, 2.13.22 inside 3d, 2.13.21 modes, 2.13.20 grand mansion, 2.13.19 2d tools, 2.13.18 richer 3d, 2.13.17 furniture list, 2.13.16 3d and dollhouse fixes, 2.13.15 more languages, 2.13.14 save status, 2.13.13 3d viewer update, 2.13.12 drawing engine update, 2.13.11 own 3d decoders, 2.13.10 menu close, 2.13.9 one menu, 2.13.8 bottom edge, 2.13.7 view buttons, More menu, Ink', () => {
  it('chips 2.13.48 and keeps the tap row and the first step', () => {
    assert.equal(APP_VERSION, '2.13.48');
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
      assert.match(line, /Teach|Enseñar|Навчан|Урок|ምምሃር|آموزش|تعلّم|Kwiga/i);
    }
  });
});
