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
