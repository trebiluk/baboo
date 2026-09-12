export type Tool = 'select' | 'sketch' | 'wall' | 'door' | 'window' | 'furniture' | 'room' | 'dim' | 'note' | 'plant' | 'pan';
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
  | 'tiny-home'
  | 'dog-house';

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

/** Two-click size string that stays on the plan. */
export interface DimItem {
  id: string;
  ax: number;
  ay: number;
  bx: number;
  by: number;
}

/** Click-to-place plan note (systems, tags, reminders). */
export interface NoteItem {
  id: string;
  x: number;
  y: number;
  text: string;
}

export type PlantKind = 'tree' | 'bed' | 'path';

export interface LandscapeItem {
  id: string;
  kind: PlantKind;
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  label: string;
}

/** Freehand pencil stroke in plan-feet. points is a flat [x,y,x,y,…] list. */
export interface SketchStroke {
  id: string;
  points: number[];
}

/** Named enclosed space. Polygon is derived from walls around (x, y). */
export type RoomKind =
  | 'entry'
  | 'living'
  | 'kitchen'
  | 'dining'
  | 'bedroom'
  | 'bath'
  | 'office'
  | 'utility'
  | 'storage'
  | 'outdoor'
  | 'other';

export interface Room {
  id: string;
  kind: RoomKind;
  name: string;
  x: number;
  y: number;
}

export interface Floor {
  id: string;
  name: string;
  elevation: number;
  nodes: Node[];
  walls: Wall[];
  openings: Opening[];
  furniture: FurnitureItem[];
  rooms: Room[];
  dimensions: DimItem[];
  notes: NoteItem[];
  landscape: LandscapeItem[];
  sketches: SketchStroke[];
  roof: RoofGeometry | null;
  layers: {
    structure: boolean;
    openings: boolean;
    furniture: boolean;
    rooms: boolean;
    dims: boolean;
    landscape: boolean;
    sketch: boolean;
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

/** How much help vs how many tools — Settings and New project. */
export type SkillLevel = 'novice' | 'beginner' | 'moderate' | 'expert';

export interface ProjectSettings {
  gridSize: number;
  snap: boolean;
  /** Straight H/V walls. Hold Shift to force; turn off in Settings for free angles. */
  ortho: boolean;
  units: 'ft' | 'm';
  accent: string;
  /** GUI chrome theme; default stark (Diego GO). */
  guiTheme: GuiThemeId;
  /** Classroom skill: novice extra help, expert extra tools. Default beginner. */
  skillLevel: SkillLevel;
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
