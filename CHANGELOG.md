# Baboo Changelog (technical path: ArchWorks)

App version matches `src/version.ts` (`APP_VERSION`). Newest first. DataBot twins bullets with `src/data/changelog.ts` + workshop `../CHANGELOG.md`.
Student-facing product = **Baboo**; file format stays `.archworks.json`.


## 1.0.11 — 2026-09-06
- Fix: guiTheme fallbacks coerced to stark; dream remains Flo HOLD default
- APP_VERSION 1.0.11

## 1.0.10 — 2026-09-06
- **Flo HOLD:** dream dark purple–blue stays classroom DEFAULT (`guiTheme: null`); stark/ink/projector optional Customize only — reverse stark-as-default
- **Tools-ease UDL / special-ed** — Wall empty CTA · second-click hint · Door/Window on-wall + miss toast · furniture → Select toast · fat tools + focus + active check
- **3D view-only chrome** — hide Wall/Door/Window/Furniture/Pan + Furniture sidebar; View only stays; Plan restores
- **Chrome labels** — Save file · Class card · Settings; Teacher gated (not student Dbg); Teaching soften paste
- Optional GUI themes on tree (stark · ink · projector) — Diego lock: Baboo default Stark; dream = TechWorks only
- APP_VERSION 1.0.10

## 1.0.9 — 2026-09-06
- **3D site + sky** — Solid SVG stub: soft blue sky gradient + muted sage ground pad under massing (StyleBot palette)
- Horizon cyan hairline + one soft ground shade (sun cue); drag-to-pan; view-only; no WebGL / shadow stacks
- APP_VERSION 1.0.9

## 1.0.8 — 2026-09-06
- **P0 phone Teaching overlay** — defaults collapsed ≤640px; bottom sheet ≤~40vh with backdrop dismiss + body scroll lock only while open; sticky chrome stays tappable (Teach/Help/2D/Export)
- **P0 toolbar overflow** — primary tools wrap in 3-col grid (≥44px); secondary chrome actions collapse into More menu on phone
- APP_VERSION 1.0.8

## 1.0.7 — 2026-09-06
- **Export gallery card** — `format: archworks-gallery-card` lean JSON download (SHARE-GALLERY · SCHEMA)
- Fields: alias · title · styleName · roofLabel · shell (tiny-home) · areaSqFt null · reflection · appVersion · textureId (id only)
- FERPA: alias only — never legal names / email; no image blob bytes in export
- UI: GalleryCardPreview **Export gallery card** (Customize / Help) + chrome **Gallery card**
- APP_VERSION 1.0.7

## 1.0.6 — 2026-09-06
- Student-facing brand: **Baboo** — Bichon lockup on dark purple–blue mast
- Quiet About / first-run: Donna Matteson + named for her Baboo (Bichon frise)
- Drive wizard student strings → Baboo; PWA manifest name/short_name → Baboo
- Technical format unchanged: `.archworks.json` · `format: archworks` · IDB `archworks`


## 1.0.5 — 2026-09-06
- Plan walls: pack textureId draws tile hatch (procedural ≤64px tiles, Chromebook-light)
- Import:local stores blob in IndexedDB `archworks-blobs`; settings.imageBlobRef only in JSON
- Soft max ≤512px / ~750KB — reject oversize with clear toast; one-tap Clear texture
- Tiny Home checklist: required/missing visual states; shell swap hitch-wheels ↔ container-corners present
- APP_VERSION 1.0.5

## 1.0.4 — 2026-09-06
- Tiny Home typology on `settings.typology` (kind · shell trailer|shipping-container · inventory checklist)
- Customize: shell toggle Trailer | Container + present toggles (only when style is tiny-home)
- Default inventory ids: wet-bath · kitchenette · sleep-loft · utility · storage · hitch-wheels (trailer) / container-corners (container)
- Template load auto-sets typology for tiny-home; round-trips via IndexedDB + `.archworks.json`
- GalleryCardPreview shows shell when Tiny Home
- Light PWA: `public/manifest.webmanifest` (standalone, theme #06122B); linked from index.html; theme-color + title → 1.0.4
- No service worker yet (installable manifest only)

## 1.0.3 — 2026-09-06
- Customize → Materials: silly texture pack chips + Import image + clear/revert
- `settings.textureId` / `textureLabel` (pack ids only; no blobs in `.archworks.json`)
- Toast: “Debugzy wires apply” — StyleBot owns look; Debugzy hooks plan/3D apply + IDB blob import
- Mobile: fat ≥44px targets; one-column chrome under ~640px; drawers/modals bottom-sheet feel
- Gallery card CSS (`.aw-gallery-card`) + `GalleryCardPreview` stub (alias “Nova” only)
- Dream theme tokens verified FINAL (`#06122B`, `#22D3EE`, `#3B82F6`, `#6366F1`, `#A855F7`, `#6D28D9`)

## 1.0.2 — 2026-09-06
- Automatic roof generation from house style (ROOF-STYLES-MVP + Diego grass/sod)
- RoofStyleId: gable · hip · gambrel · shed · flat · mansard · grass · conical
- Template → roof: Colonial/A&C/Greek → gable; Ranch → hip; Hobbit → grass; Tiny Home → shed; Victorian → mansard; Modern → flat; Yurt → conical
- Plan: dashed eaves/ridge/hip (+ green sod hatch for grass; radial spokes for conical); 3D view-only pitched/flat/mound/cone massing
- Amend: Yurt default roof is conical (Curriculum), not hip — cone plan spokes + 3D cone massing; teaching vocab includes conical
- Customize: roof style dropdown regenerates geometry; show-roof toggle
- Expanded templates: Ranch · Victorian · Cape Cod · Modern · Tudor · Yurt · Tiny Home (Contest badge)
- THEME-PURPLE-BLUE default (paw orange demoted to seasonal); solid fills, Chromebook-light (no blur stacks)
- Teaching: C-ROOF-NAME, C-TINY-HOME-CONTEST, floor area sq ft, traffic + kitchen triangle stubs, utility/storage checklist
- Catalog: water heater, mech closet, washer, dryer, closet, storage shelf

## 1.0.1 — 2026-09-06
- Debug overlays on PlanCanvas: node IDs + hitbox outlines (`useDebugStore`)
- Arts & Crafts porch uses shared nodes — no overlapping front walls
- Drag furniture from sidebar onto canvas; click-to-place remains solid
- Dimension labels respect Customize units (ft or meters)
- 3D View sets render tier 1; debug drawer no longer steals a grid column
- Autosave syncs in-memory `meta.version`; ErrorBoundary recover/reload polish
- Changelog modal reads `CHANGELOG_ENTRIES`; Customize meters live

## 1.0.0 — 2026-09-06
- Local MVP scaffold: React + Vite + Konva + Zustand
- Document model: floors[] with nodes / walls / openings / furniture; landscape[] reserved empty
- Local-first save: IndexedDB + `.archworks.json` export/import
- Product laws: 2D edits only; 3D view-only (render tier ladder later); textbook architectural symbols
- Debug tools (Teacher / `archworks-debug`): version chip, counts, autosave + IDB status, selection dump, copy debug JSON, last error, node/hitbox overlays — see `../DEBUG-TOOLS.md`
- `DebugPanel.tsx` + `ErrorBoundary` mounted from `main.tsx`; `useDebugStore` + `archworks-debug` flag
