/** Canonical in-app changelog bullets. Mirror into CHANGELOG.md on each bump. */
import { APP_VERSION } from '../version';

export type ChangelogEntry = {
  version: string;
  date: string;
  bullets: string[];
};

export { APP_VERSION };

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    version: '2.2.5',
    date: '2026-09-26',
    bullets: [
      'A new visit lands on a blank plan and the coach. Sketch comes first',
      'The 13 houses live under the hamburger, on New',
      'The gear opens on Look: Stark, Ink, Projector, Blocky. Stark stays the default',
    ],
  },
  {
    version: '2.2.4',
    date: '2026-09-26',
    bullets: [
      'A phone or Chromebook in dark mode does not restyle Baboo',
      'The gear is the only way to pick Ink, Projector, or Blocky. Stark stays the default',
      'The top bar is pictograms. The hamburger holds Teach, Help, and the rest',
    ],
  },
  {
    version: '2.2.3',
    date: '2026-09-26',
    bullets: [
      'Tools share one card. Tucked in, they are a slim icon stack so the plan stays open',
      'Plan, Rooms, and 3D are one switch. Save is the blue button. The version stays in the top bar, not on the drawing',
      'Stark stays the default',
    ],
  },
  {
    version: '2.2.2',
    date: '2026-09-25',
    bullets: [
      '3D closes the gable ends and tucks a soffit under the eaves',
      'The yard is a field to the horizon, not a diamond of grass. Walkthrough has a ceiling',
      'On a phone the version chip sits above the scale. Stark stays the default',
    ],
  },
  {
    version: '2.2.1',
    date: '2026-09-25',
    bullets: [
      'Roof is a tap on the plan. Pick a real word: gable, hip, shed, flat, and the rest',
      'The title block sits above the coach. The tap row stays one line and leaves the north arrow clear. Stark stays the default',
    ],
  },
  {
    version: '2.2.0',
    date: '2026-09-25',
    bullets: [
      'The next card stays up while a sketch is selected. Trace sits on that card',
      'Snap, Straight, Wall snap, Fit, zoom, and feet or meters are taps on the plan',
      'The sheet names the roof. When the walls close, the toast says the outside size. Stark stays the default',
    ],
  },
  {
    version: '2.1.4',
    date: '2026-09-24',
    bullets: [
      'The first card says tap Sketch on the left. The extra Wall card stays off until you have a wall, so there is one next step',
      'When the sketch lands, the toast says so, then the card asks for a wall. Stark stays the default',
    ],
  },
  {
    version: '2.1.3',
    date: '2026-09-23',
    bullets: [
      'A tree in the dollhouse is a trunk and a canopy, not a green dot',
      'On the plan, a tree is a circle and a cross that stays inside its spot. A plant bed and a path stay inside theirs too',
    ],
  },
  {
    version: '2.1.2',
    date: '2026-09-23',
    bullets: [
      'Furniture on the plan uses real floor-plan symbols. Zoomed out, they stay simple boxes',
      'Tap a piece for a 3D peek. Kenney matches the plan. A short Quaternius house set is the other peek — not the whole pack',
      'Autosave keeps edits that slide off the screen. Save file waits so the Chromebook can finish the download. Stark stays the default',
    ],
  },
  {
    version: '2.1.1',
    date: '2026-09-19',
    bullets: [
      'One thin top row on classroom laptops — Baboo, version, plan name, Saved, Beginner, Undo/Redo, viewport, Save, Teach, Help. Nothing stacks or overlaps',
      'Fat left Edge Pocket: Select, Sketch, Wall, Door. Wall opens thickness, height, and style. Click grid to start, drag to draw',
      'The plan card moves out of the way when the pocket is open, so Furn and Plant stay tappable. Teach stays on the top row — no right ribbon',
    ],
  },
  {
    version: '2.1.0',
    date: '2026-09-19',
    bullets: [
      'Walls now land on what you already drew — corner, middle, crossing, square-off, along-wall — with a marker and a word for each',
      'Type an exact Length and Angle while a wall is in progress, or tap the boxes and set them',
      'Arrow keys move what you picked; measurements never read upside down; wallpaper names read on every swatch',
    ],
  },
  {
    version: '2.0.1',
    date: '2026-09-19',
    bullets: [
      'P0.1 Edge Pocket: the right Teach/Enseñar ribbon is gone. Teach and Help sit on the top row with Save',
      'Left overlay chips — Select · Sketch · Wall · Door · More. Tap or hover opens the pocket; right-click / long-press empty canvas does the same',
      'Menus overlay; the plan fills remaining 100dvh / 100svh. Stark white+blue stays the classroom default',
    ],
  },
  {
    version: '2.0.0',
    date: '2026-09-19',
    bullets: [
      'P0 inclusion / tools-ease: same Help for every student — bigger type, high contrast, and tip language at the top',
      'High contrast stays on Stark white + blue. Teach / Matteson words stay English; tips use tipsLocale',
      'Fat taps, icon-above-label, Undo always visible, visual success/miss toasts, cap toast, dirty-tile autosave',
    ],
  },
  {
    version: '1.3.5',
    date: '2026-09-17',
    bullets: [
      'Selected walls show squares on the ends — drag them to stretch, drag the middle to slide',
      'The right panel edits size, paint, and place for whatever you tap',
    ],
  },
  {
    version: '1.3.4',
    date: '2026-09-17',
    bullets: [
      'Dollhouse 3/4 view opens the near walls so beds and toilets stay inside the room',
      'Furniture shows only the sides you should see — no stacked bowls or through-the-wall frames',
    ],
  },
  {
    version: '1.3.3',
    date: '2026-09-17',
    bullets: [
      'Closed rooms meet clean at the corners — walls no longer blob or stack',
      '3D shows the real floor inside each room, not a rectangle around the house',
      'More paints, wallpapers, yard looks, and furniture colors in Settings and the edit panel',
    ],
  },
  {
    version: '1.3.2',
    date: '2026-09-17',
    bullets: [
      'Trace reads a wiggly pencil outline as straight walls — a wandering house still hard-lines',
    ],
  },
  {
    version: '1.3.1',
    date: '2026-09-16',
    bullets: [
      'Tools, catalogs, Settings, Teach, and the edit panel dock to the sides and collapse — the grid stays open',
      'Busy houses stay snappy: extra furniture detail drops while you spin 3D or zoom the plan out',
    ],
  },
  {
    version: '1.3.0',
    date: '2026-09-16',
    bullets: [
      'Furniture is modeled, not boxed: round tables, burner rings, toilet bowls, tubs, drums, legs',
      'Flooring: walnut, herringbone, slate, terracotta. Rotate the grain. 3D shows the pattern',
      'Catalog shows the object. Tap a room for its own floor, or House to follow the default',
    ],
  },
  {
    version: '1.2.0',
    date: '2026-09-16',
    bullets: [
      'Furniture reads as the thing: beds with pillows, sofas with arms, stove burners, toilet and tub',
      'Flooring: oak, maple, tile, hex, carpet, linoleum, concrete, checker — house default plus per-room',
      'Same shapes in Plan, Dollhouse, and 3D. Tap a named room to change its floor',
    ],
  },
  {
    version: '1.1.7',
    date: '2026-09-16',
    bullets: [
      'Dollhouse turns: Front, Right, Rear, Left — same house, new face',
      'Drawing views to teach: Isometric, Oblique (cabinet), Elevation, Orthographic + Top (a plan)',
      'Axis gizmo shows which lines are true size. Paper walls in elevation like a real sheet',
    ],
  },
  {
    version: '1.1.6',
    date: '2026-09-13',
    bullets: [
      'Full 3D: drag to orbit the house, scroll to zoom, Shift-drag to pan. Still view-only',
      'Materials and Lighting are on — grass/shingles, sun, shade, dusk window glow',
      'Walkthrough: eye-height look inside. Same plan as 2D. Edit stays in Plan or Dollhouse',
    ],
  },
  {
    version: '1.1.5',
    date: '2026-09-13',
    bullets: [
      'Architect sheet: title block, north arrow, and a 0–5–10 scale bar on the plan',
      'Overall width and depth ticks sit outside the envelope once walls close',
      'Teach → Read this plan: envelope, entry, daylight, named rooms, size, kitchen work triangle (classroom, not a stamp)',
    ],
  },
  {
    version: '1.1.4',
    date: '2026-09-13',
    bullets: [
      'Teach English words (grades 5–8 ELL): Wall, Door, Sketch sit in English on the tools; home language sits under',
      'Teach → Vocab shows Say: Wall plus a simple English meaning. Tap-to-match practice, no timer',
      'Settings → Help for everyone: turn the English-first teaching on or off',
    ],
  },
  {
    version: '1.1.3',
    date: '2026-09-13',
    bullets: [
      'Vocab pack: Ukrainian, Russian, Tigrigna, Cubano, and Farsi — Settings chips, Teach list, tools and tips',
      'Every language keeps the English CAD word in parentheses (Стіна (Wall) · دیوار (Wall))',
      'Farsi text reads right-to-left in drawers and tips. The plan grid stays left-to-right',
    ],
  },
  {
    version: '1.1.2',
    date: '2026-09-13',
    bullets: [
      'Language: Settings → English or Español. Spanish keeps the English CAD word in parentheses (muro (Wall))',
      'Help for everyone: bigger 52px taps, bigger type on tips and Teach, slower toasts',
      'Empty-plan wall tip, bilingual coach, tools, Contest titles, and vocab for ELL + special-ed',
    ],
  },
  {
    version: '1.1.1',
    date: '2026-09-13',
    bullets: [
      'Solid 3D: Day sky + grass yard by default. Doors and windows cut through the walls. Furniture shows as boxes',
      'Settings → 3D look: Sky (Day / Soft dusk / Overcast), Yard (Grass / Gravel / Pad), wall colors, Show furniture in 3D',
      'Blocky theme: chunky cubes, grass and dirt — Minecraft-inspired look for chrome, tools, Dollhouse, and 3D',
      'Keeps Dollhouse (roof-off wallpaper) and the side edit panel from 1.0.39. 3D stays view-only',
    ],
  },
  {
    version: '1.0.39',
    date: '2026-09-13',
    bullets: [
      'Edit panel docks on the side — collapse it to a chip when you need the grid',
      'Dollhouse: roof-off isometric view. Tap a wall to paper it in 2D',
    ],
  },
  {
    version: '1.0.38',
    date: '2026-09-13',
    bullets: [
      'New plan cards sit even, Contest is a quiet chip, and Close lives in the header',
      'Phones keep one version pill on the grid — the top bar stays icons. Drawers get a grab bar',
    ],
  },
  {
    version: '1.0.37',
    date: '2026-09-09',
    bullets: [
      'Floating version chip on phones — tap for what’s new, hold for Teacher. Follow it even when the top bar is icons-only',
      'Access and Teach sheets sit on top of the tool rails, so landscape phones can still read the list',
    ],
  },
  {
    version: '1.0.36',
    date: '2026-09-09',
    bullets: [
      'Tools fast: Sketch, Wall, and Door stay on the left — one tap, no extra open',
      'More opens the rest. Trace stays after a sketch. Clip sits with Wall. Grey tools wait for the next skill',
    ],
  },
  {
    version: '1.0.35',
    date: '2026-09-09',
    bullets: [
      'Phone and tablet: the top bar no longer piles on itself — icons for undo, 2D/3D, and save, with More for the rest',
      'Tools and Teach stay as side chips. Drawers slide up from the bottom on a phone',
    ],
  },
  {
    version: '1.0.34',
    date: '2026-09-09',
    bullets: [
      'Best Dog House Contest: New → Dog House, then Contest — Baboo scores the den from the textbook list',
      'She wants a snug closed box, a 12–18" door off-center, a pitched roof, and a shade tree — not a people bedroom',
    ],
  },
  {
    version: '1.0.33',
    date: '2026-09-09',
    bullets: [
      'Sketch is the first tool: drag like a pencil on the plan — architecture starts here',
      'Tap a sketch → Trace to turn it into straight walls. The pencil line stays as an underlay',
    ],
  },
  {
    version: '1.0.32',
    date: '2026-09-09',
    bullets: [
      'Copyright: © 2026 Richard Kulibert Jr.',
    ],
  },
  {
    version: '1.0.31',
    date: '2026-09-09',
    bullets: [
      'Toolbar icons redrawn so they stay clear when tiny — same black stroke, same periwinkle flash',
      'Clip is a cut corner now, not scissors. Tree, bed, and path each have their own picture',
    ],
  },
  {
    version: '1.0.30',
    date: '2026-09-09',
    bullets: [
      'New icon set for every draw tool, Teach, Access, Help, and Settings — same stroke, same periwinkle flash',
    ],
  },
  {
    version: '1.0.29',
    date: '2026-09-09',
    bullets: [
      'Tap a door, window, wall, or furniture — a tiny menu sits under it to change size, swing, or delete',
      'Drag a door or window to slide it along the wall. After you place one, the menu opens so you can finish it',
    ],
  },
  {
    version: '1.0.28',
    date: '2026-09-09',
    bullets: [
      'Angled rooms: walls snap to 45° as well as 90° — hold Shift for square only',
      'Wall → Clip a sharp corner; the room fill and area follow the chamfer',
    ],
  },
  {
    version: '1.0.27',
    date: '2026-09-08',
    bullets: [
      'Teacher drawer: Version, What’s new, and Debug in one place — tap the version chip or long-press for Teacher',
      'CHANGELOG.md matches the in-app notes so class share and studio stay in sync',
    ],
  },
  {
    version: '1.0.26',
    date: '2026-09-08',
    bullets: [
      'GUI pass: same Stark white, black, and periwinkle — quieter chrome, softer cards, friendlier type',
    ],
  },
  {
    version: '1.0.25',
    date: '2026-09-08',
    bullets: [
      'Phone: drag the plan to look around, pinch to zoom — tools tuck into a chip so the house can fill the screen',
      'Fit stays on the top bar so you can always snap the house back into view',
    ],
  },
  {
    version: '1.0.24',
    date: '2026-09-08',
    bullets: [
      'Access check: doors 32", halls 36", bath 5\' turn, kitchen aisle, door swing — classroom ADA, not a legal stamp',
      'Open Access from the right-hand chip or More. Click a row to highlight it on the plan',
    ],
  },
  {
    version: '1.0.23',
    date: '2026-09-08',
    bullets: [
      '2D: Size tool (two clicks), plan notes, and Plant (tree / bed / path)',
      'Straight walls by default, live length while you draw, Fit, plus a north arrow and scale bar',
    ],
  },
  {
    version: '1.0.22',
    date: '2026-09-07',
    bullets: [
      'Class folder: More → Class folder downloads a zip you drop on the share — kids open index.html in Chrome',
      'Works from a network drive or USB with no login and no server; each Chromebook still autosaves on that device',
    ],
  },
  {
    version: '1.0.21',
    date: '2026-09-07',
    bullets: [
      'Crowd test: scatter 80 / 250 / 800 pieces and watch the FPS chip — canvas 2D still holds a busy house',
      'Plan stays snappy: one grid draw, no redraw on every mouse wiggle, labels hide when the plan is packed',
    ],
  },
  {
    version: '1.0.20',
    date: '2026-09-07',
    bullets: [
      'Baboo talks like a studio pal: warmer welcome, cheer-you-on coach, kinder toasts',
      'Logo sits with the next-step card; empty-plan tips and Help greet you instead of barking orders',
    ],
  },
  {
    version: '1.0.19',
    date: '2026-09-07',
    bullets: [
      'Skill levels: Novice, Beginner, Moderate, Expert — pick on New project or in Settings',
      'Novice and Beginner get a next-step coach from what is missing on the plan',
      'Higher levels unlock Window, Room, Furniture, then interior walls, duplicate, rotate, and layers',
    ],
  },
  {
    version: '1.0.18',
    date: '2026-09-07',
    bullets: [
      'Floating Tools chip on the left and Teach chip on the right — grid uses the full workspace',
      'Hover, click, or an active tool opens the palette; Min or Escape tucks it away',
    ],
  },
  {
    version: '1.0.17',
    date: '2026-09-07',
    bullets: [
      'Room tool: name enclosed spaces from closed walls (Kitchen, Bath, Living…)',
      'Interior walls split rooms; Teach lists named-room checklist',
    ],
  },
  {
    version: '1.0.11',
    date: '2026-09-06',
    bullets: [
      'Fix: guiTheme fallbacks coerced to stark; dream remains Flo HOLD default',
    ],
  },
  {
    version: '1.0.10',
    date: '2026-09-06',
    bullets: [
      'Tools-ease UDL: empty-plan Wall CTA, wall second-click hint, Door/Window “click on a wall” + miss toast ≥3s + near-wall cyan highlight',
      'Furniture place → “Switched to Select — click to move”; Select/Pan tips; tool ≥44px + cyan focus + check/underline active',
      '3D view-only: hide Wall/Door/Window/Furniture/Pan + Furniture sidebar; View only chip stays; Plan restores tools',
      'Chrome labels: Save file · Class card · Settings; Teacher gated (long-press version / ?teacher=1); softer student toasts',
      'Teaching soften UDL: Unit 1 / challenges / reflections / vocab one-step prompts (ids unchanged)',
      'Optional GUI themes on tree (stark · ink · projector); Diego lock: Baboo default Stark; dream = TechWorks only',
    ],
  },
  {
    version: '1.0.9',
    date: '2026-09-06',
    bullets: [
      '3D Solid view: site ground pad + soft blue sky (StyleBot dusk-soft) around house massing',
      'Muted sage ground (#5F6F52); cyan horizon hairline; one soft sun shade cue - Chromebook SVG, no WebGL',
      'Drag-to-pan in 3D preview; view-only chip + Plan edit path unchanged',
    ],
  },
  {
    version: '1.0.8',
    date: '2026-09-06',
    bullets: [
      'P0 phone Teaching: defaults collapsed ≤640px; sheet ≤~40vh + backdrop dismiss; body scroll lock only while open; sticky chrome tappable',
      'P0 toolbar: tools wrap 3-col (≥44px); secondary actions collapse into More menu — no mystery horizontal scroll',
    ],
  },
  {
    version: '1.0.7',
    date: '2026-09-06',
    bullets: [
      'Export gallery card: format archworks-gallery-card (alias · title · styleName · roofLabel · shell · areaSqFt null · reflection · appVersion)',
      'FERPA: alias only — no legal names; textureId id only; assets.planPng/view3dPng null (Chromebook lean)',
      'UI: Export gallery card in GalleryCardPreview (Customize / Help) + chrome Gallery card',
      'StyleBot gallery-card look: Baboo badge · dream plate · phone stack',
      'Tiny Home shell echoed when typology tiny-home; regular houses shell null',
    ],
  },
  {
    version: '1.0.6',
    date: '2026-09-06',
    bullets: [
      'Student-facing brand: Baboo — Bichon lockup on dark purple–blue mast',
      'Quiet About: Donna Matteson + named for her Baboo (Bichon frise)',
      'Drive wizard student strings → Baboo; format stays .archworks.json',
      'PWA manifest name/short_name → Baboo; title Baboo 1.0.6',
    ],
  },
  {
    version: '1.0.5',
    date: '2026-09-06',
    bullets: [
      'Plan walls show pack wallpaper as tile hatch when settings.textureId is set (Chromebook-light)',
      'Import image → IndexedDB archworks-blobs via imageBlobRef; reject >512px with clear toast; no blobs in JSON',
      'One-tap Clear texture → plain paint; toast no longer says Debugzy wires apply',
      'Tiny Home inventory: required/missing visuals; shell swap preserves hitch↔corners present',
    ],
  },
  {
    version: '1.0.4',
    date: '2026-09-06',
    bullets: [
      'Tiny Home typology: settings.typology (kind · shell trailer|shipping-container · inventory checklist)',
      'Customize: Trailer | Container shell toggle + inventory present toggles (tiny-home only)',
      'Default inventory ids: wet-bath · kitchenette · sleep-loft · utility · storage · hitch-wheels / container-corners',
      'GalleryCardPreview shows shell; typology round-trips save/export',
      'Light PWA: manifest.webmanifest (standalone, #06122B); index title/theme-color → 1.0.4; no SW yet',
    ],
  },
  {
    version: '1.0.3',
    date: '2026-09-06',
    bullets: [
      'Customize Materials: silly texture packs (christmas · confetti · brick-joke · starry · paw · plain) + Import + clear',
      'settings.textureId / textureLabel (ids only — no blobs in JSON); toast: Debugzy wires apply',
      'Mobile/touch chrome: ≥44px targets, one-column under ~640px, drawers as bottom sheets',
      'Gallery card CSS + GalleryCardPreview stub (alias-only demo)',
      'THEME-DREAM / THEME-PURPLE-BLUE FINAL tokens intact (#06122B · #22D3EE · #3B82F6 · #6366F1 · #A855F7 · #6D28D9)',
    ],
  },
  {
    version: '1.0.2',
    date: '2026-09-06',
    bullets: [
      'Auto roof from house style (gable · hip · gambrel · shed · flat · mansard · grass/sod · conical)',
      'Hobbit → grass/sod; Colonial/A&C/Greek → gable; Ranch → hip; Tiny Home → shed; Yurt → conical',
      'Amend: Yurt default is conical (not hip) — radial plan spokes + cone 3D massing',
      'Expanded templates: Ranch, Victorian, Cape Cod, Modern, Tudor, Yurt, Tiny Home (Contest)',
      'Plan dashed roof symbols + 3D view-only roof massing; Customize roof dropdown',
      'THEME-PURPLE-BLUE default (paw orange demoted to seasonal); solid fills, no blur stacks',
      'Teaching: C-ROOF-NAME, floor area sq ft stubs, traffic/kitchen-triangle stubs, utility checklist',
      'Catalog: water heater, mech closet, washer/dryer, closet/storage',
    ],
  },
  {
    version: '1.0.1',
    date: '2026-09-06',
    bullets: [
      'Debug overlays on PlanCanvas: node IDs + hitbox outlines (useDebugStore)',
      'Arts & Crafts porch uses shared nodes — no overlapping front walls',
      'Drag furniture from sidebar onto canvas; click-to-place remains solid',
      'Dimension labels respect Customize units (ft or meters)',
      '3D View sets render tier 1; debug drawer no longer steals a grid column',
      'Autosave syncs in-memory meta.version; ErrorBoundary recover/reload polish',
      'Changelog modal reads CHANGELOG_ENTRIES; Customize meters live',
    ],
  },
  {
    version: '1.0.0',
    date: '2026-09-06',
    bullets: [
      'Local MVP scaffold: React + Vite + Konva + Zustand',
      'floors[] nodes/walls/openings/furniture; landscape[] empty reserved',
      'IndexedDB + .archworks.json local-first save',
      '2D edit only; 3D view-only tiers reserved; textbook plan symbols',
      'Debug Teacher drawer (version, counts, autosave, bundle, errors, overlays)',
      'DebugPanel.tsx + ErrorBoundary mounted; archworks-debug localStorage flag',
    ],
  },
];

void APP_VERSION;

export function recentChangelog(limit = 5): string[] {
  const top = CHANGELOG_ENTRIES[0];
  if (!top) return [];
  return top.bullets.slice(0, limit);
}
