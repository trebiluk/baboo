export type Tool = 'select' | 'wall' | 'door' | 'window' | 'furniture' | 'pan';
export type ViewMode = 'plan' | 'solid3d' | 'materials' | 'lighting' | 'walkthrough';
export type RenderTier = 0 | 1 | 2 | 3;

/** House style templates (Diego expand 1.0.2 — Curriculum list may refine). */
export type StyleId =
  | 'blank'
  | 'colonial'
  | 'arts-crafts'
  | 'greek-revival'
  | 'hobbit'
  | 'ranch'
  | 'victorian'
  | 'cape-cod'
  | 'modern'
  | 'tudor'
  | 'yurt'
  | 'tiny-home';

/**
 * Roof styles — ROOF-STYLES-MVP.md + Diego grass/sod for Hobbit + conical for Yurt.
 * gable | hip | gambrel | shed | flat | mansard | grass | conical
 */
export type RoofStyleId =
  | 'gable'
  | 'hip'
  | 'gambrel'
  | 'shed'
  | 'flat'
  | 'mansard'
  | 'grass'
  | 'conical';

export interface Point { x: number; y: number; }

export interface RoofSegment { a: Point; b: Point; }

/** Plan + massing data generated from exterior outline + roof style. */
export interface RoofGeometry {
  id: string;
  styleId: RoofStyleId;
  outline: Point[];
  ridges: RoofSegment[];
  hips: RoofSegment[];
  breaks: RoofSegment[];
  /** Soft irregular edge points for grass/sod hatch (optional). */
  sodEdge?: Point[];
  eavesHeight: number;
  ridgeHeight: number;
  longAxis: 'x' | 'y';
}

export interface Node { id: string; x: number; y: number; }

export interface Wall {
  id: string;
  a: string;
  b: string;
  kind: 'exterior' | 'interior';
  thickness: number;
}

export interface Opening {
  id: string;
  wallId: string;
  t: number;
  width: number;
  type: 'door' | 'window';
  symbolKind: 'swingDoor' | 'slidingDoor' | 'windowFixed';
  swing?: 'left' | 'right';
}

export interface FurnitureItem {
  id: string;
  catalogId: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  zIndex: number;
  label: string;
}

export interface Floor {
  id: string;
  name: string;
  elevation: number;
  nodes: Node[];
  walls: Wall[];
  openings: Opening[];
  furniture: FurnitureItem[];
  landscape: never[];
  roof: RoofGeometry | null;
  layers: {
    structure: boolean;
    openings: boolean;
    furniture: boolean;
    dims: boolean;
    landscape: boolean;
    roof: boolean;
  };
}

/** Tiny Home shell — SCHEMA.md reserved typology block. */
export type TypologyKind = 'tiny-home' | 'house';
export type TypologyShell = 'trailer' | 'shipping-container' | 'other';

export interface TypologyInventoryItem {
  id: string;
  label: string;
  required: boolean;
  present: boolean;
}

export interface TypologySettings {
  kind: TypologyKind;
  shell?: TypologyShell;
  inventory: TypologyInventoryItem[];
}

/** Baboo GUI chrome — stark | ink | projector (Customize). Dream = TechWorks Board only. */
export type GuiThemeId = 'stark' | 'ink' | 'projector';

export interface ProjectSettings {
  gridSize: number;
  snap: boolean;
  units: 'ft' | 'm';
  accent: string;
  /** GUI chrome theme; default stark (Diego GO). */
  guiTheme: GuiThemeId;
  viewMode: ViewMode;
  renderTier: RenderTier;
  styleId: StyleId;
  /** null = no auto roof (Blank until Customize). */
  roofStyleId: RoofStyleId | null;
  /** Student-editable display name (does not change geometry kind). */
  roofLabel: string;
  showRoof: boolean;
  /**
   * Silly textures / wallpaper (StyleBot UI). Pack id (`pack:…`) or `import:local`.
   * Blobs stay in IDB via DataBot `imageBlobRef` — never inline in JSON.
   */
  textureId: string | null;
  /** Student-facing label mirroring roofLabel. */
  textureLabel: string;
  /**
   * Opaque id into IndexedDB `archworks-blobs` for import:local.
   * Never inline bytes in JSON — Chromebook lean-save law.
   */
  imageBlobRef: string | null;
  /** Tiny Home typology + inventory checklist (omit for regular houses). */
  typology?: TypologySettings;
}

export interface ProjectDocument {
  meta: {
    id: string;
    title: string;
    units: 'ft' | 'm';
    version: string;
    createdAt: string;
    updatedAt: string;
    styleId: StyleId;
    teachingMeta?: {
      unitId?: string;
      challengeIds?: string[];
      assignmentId?: string;
    };
  };
  floors: Floor[];
  settings: ProjectSettings;
}

export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

export interface CatalogItem {
  id: string;
  name: string;
  category: string;
  w: number;
  h: number;
  color: string;
}

export interface StyleTemplate {
  id: StyleId;
  name: string;
  blurb: string;
  /** Optional contest / assignment tag shown on card. */
  badge?: string;
}
