import { create } from 'zustand';
import type {
  Floor, FurnitureItem, Opening, ProjectDocument, ProjectSettings,
  SaveStatus, StyleId, Tool, ViewMode, RenderTier, Point, Wall, RoofStyleId,
  TypologyShell, Room, RoomKind, DimItem, NoteItem, LandscapeItem, PlantKind,
  SketchStroke,
} from '../types';
import { blankProject, buildTemplateProject } from '../data/templates';
import { APP_VERSION } from '../version';
import { FURNITURE_CATALOG } from '../data/furniture';
import { plantType } from '../data/landscape';
import {
  dist, findOrCreateNode, hitFurniture, hitOpening, hitWall, nearestWall,
  snapPoint, uid, hitDimension, hitNote, hitLandscape, hitSketch,
  snapWallEnd, splitWallsAtNode, wallLength, wallAngle,
  simplifyPolyline, polylineLength, fitWallsFromStroke,
  nodesAfterWallEnd, nodesAfterWallLength, wallEnds,
} from '../lib/geometry';
import { chamferCorner, nearestChamferable } from '../lib/chamfer';
import { findEnclosedFace, formatArea, hitRoom, polygonArea } from '../lib/rooms';
import { DEFAULT_ROOM_KIND, roomType } from '../data/rooms';
import { defaultFloorForKind } from '../data/flooring';
import {
  t, tipLoc, readLocalePref, readTipsLocalePref, readUdlFatPref, readUdlTypePref,
  readUdlContrastPref, readEllEnglishPref, writeLocalePref, writeTipsLocalePref,
  writeUdlFatPref, writeUdlTypePref, writeUdlContrastPref, writeEllEnglishPref,
} from '../data/i18n';
import { generateRoof, roofStyleName } from '../lib/roof';
import { textureName } from '../data/textures';
import {
  deleteTextureBlob,
  newBlobRef,
  prepareTextureImport,
  putTextureBlob,
} from '../lib/textureBlobs';
import { forgetImportPattern } from '../lib/texturePattern';
import {
  defaultTinyHomeTypology,
  typologyTogglePresent,
  typologyWithShell,
} from '../data/typology';
import { exportProjectFile, importProjectFile, loadProject, saveDirtyChunks, saveProject } from '../lib/storage';
import { capReached, remaining, type CapKind } from '../lib/caps';
import { awakeTileKeys, extractChunk, tileKey, type TileKey } from '../lib/tiles';
import { exportGalleryCardFile, type GalleryCardOptions } from '../lib/galleryExport';
import { noteAutosaveSuccess } from './useDebugStore';
import {
  DEFAULT_SKILL_LEVEL, isToolUnlocked, levelRequiredFor,
  skillRank, toastMs, readSkillPref, writeSkillPref,
} from '../data/skill';
import type { SkillLevel } from '../types';

const MAX_UNDO = 40;

export type ToastTone = 'ok' | 'miss' | 'info' | 'cap';
export type ToastPlate = {
  tone: ToastTone;
  title: string;
  body?: string;
  cap?: CapKind;
};

const CAP_TOAST: Record<CapKind, string> = {
  rooms: 'toast.capRooms',
  walls: 'toast.capWalls',
  objects: 'toast.capObjects',
};

const dirtyTiles = new Set<TileKey>();
let fullFlushNeeded = false;

type Sel =
  | { kind: 'wall'; id: string }
  | { kind: 'opening'; id: string }
  | { kind: 'furniture'; id: string }
  | { kind: 'room'; id: string }
  | { kind: 'dim'; id: string }
  | { kind: 'note'; id: string }
  | { kind: 'landscape'; id: string }
  | { kind: 'sketch'; id: string }
  | null;

interface Store {
  doc: ProjectDocument;
  past: ProjectDocument[];
  future: ProjectDocument[];
  tool: Tool;
  selected: Sel;
  selectedCatalogId: string | null;
  selectedRoomKind: RoomKind;
  teachingOpen: boolean;
  accessOpen: boolean;
  contestOpen: boolean;
  catalogOpen: boolean;
  customizeOpen: boolean;
  helpOpen: boolean;
  toolsPinned: boolean;
  panelsPinned: boolean;
  chromeEpoch: number;
  fitNonce: number;
  newProjectOpen: boolean;
  debugOpen: boolean;
  driveWizardOpen: boolean;
  changelogOpen: boolean;
  demoMode: boolean;
  viewMode: ViewMode;
  panX: number;
  panY: number;
  zoom: number;
  wallDraft: Point | null;
  dimDraft: Point | null;
  wallKind: 'exterior' | 'interior';
  wallMode: 'draw' | 'clip';
  selectedPlantKind: PlantKind;
  viewport: { w: number; h: number };
  saveStatus: SaveStatus;
  toast: ToastPlate | null;
  lastSaveAt: string | null;
  floor: () => Floor;
  init: () => Promise<void>;
  setTool: (t: Tool) => void;
  setSkillLevel: (level: SkillLevel) => void;
  setWallKind: (kind: 'exterior' | 'interior') => void;
  setWallMode: (mode: 'draw' | 'clip') => void;
  setPlantKind: (kind: PlantKind) => void;
  setViewport: (w: number, h: number) => void;
  fitPlan: () => void;
  setFloorLayer: (key: keyof Floor['layers'], on: boolean) => void;
  duplicateSelected: () => void;
  rotateSelected: (dir: 1 | -1) => void;
  setTitle: (title: string) => void;
  setSettings: (partial: Partial<ProjectSettings>) => void;
  setRoofStyle: (roofStyleId: RoofStyleId | null) => void;
  setRoofLabel: (roofLabel: string) => void;
  setTexture: (textureId: string | null, textureLabel?: string, imageBlobRef?: string | null) => void;
  clearTexture: () => void;
  importTextureFile: (file: File) => Promise<void>;
  setTypologyShell: (shell: TypologyShell) => void;
  setInventoryPresent: (id: string, present: boolean) => void;
  setViewMode: (m: ViewMode) => void;
  setRenderTier: (t: RenderTier) => void;
  setPanZoom: (panX: number, panY: number, zoom?: number) => void;
  toggleTeaching: () => void;
  toggleAccess: () => void;
  toggleContest: () => void;
  toggleCatalog: () => void;
  setCatalogOpen: (open: boolean) => void;
  closeOverlays: () => void;
  setToolsPinned: (pinned: boolean) => void;
  setPanelsPinned: (pinned: boolean) => void;
  minimizeTools: () => void;
  minimizePanels: () => void;
  toggleCustomize: () => void;
  toggleHelp: () => void;
  toggleDebug: () => void;
  toggleChangelog: () => void;
  toggleDemo: () => void;
  openNewProject: (open: boolean) => void;
  openDriveWizard: (open: boolean) => void;
  selectCatalog: (id: string | null) => void;
  selectRoomKind: (kind: RoomKind) => void;
  showToast: (msg: string, ms?: number, tone?: ToastTone) => void;
  showCapToast: (kind: CapKind) => void;
  clearToast: () => void;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  markDirty: (at?: Point) => void;
  autosave: () => Promise<void>;
  flushSave: () => Promise<void>;
  newFromTemplate: (styleId: StyleId) => void;
  exportJson: () => void;
  exportGalleryCard: (opts?: GalleryCardOptions) => void;
  importJson: (file: File) => Promise<void>;
  clearSelection: () => void;
  setSelected: (sel: Sel) => void;
  deleteSelected: () => void;
  /** `exact` means the canvas already resolved an object snap — do not re-snap. */
  beginWall: (p: Point, exact?: boolean) => void;
  finishWall: (p: Point, ortho?: boolean, exact?: boolean) => void;
  chamferAt: (p: Point) => void;
  cancelWallDraft: () => void;
  placeOpening: (type: 'door' | 'window', p: Point) => void;
  patchOpening: (id: string, patch: Partial<Pick<Opening, 'width' | 'swing' | 'symbolKind' | 't'>>) => void;
  patchWall: (id: string, patch: Partial<Pick<Wall, 'kind' | 'finishId' | 'thickness'>>) => void;
  patchFurniture: (id: string, patch: Partial<Pick<FurnitureItem, 'color' | 'x' | 'y' | 'w' | 'h' | 'rot'>>) => void;
  patchLandscape: (id: string, patch: Partial<Pick<LandscapeItem, 'x' | 'y' | 'w' | 'h'>>) => void;
  moveWallEnd: (wallId: string, end: 'a' | 'b', p: Point, forceOrtho?: boolean) => void;
  setWallLength: (wallId: string, length: number) => void;
  patchRoom: (id: string, patch: Partial<Pick<Room, 'name' | 'kind' | 'floorFinishId'>>) => void;
  placeFurniture: (p: Point) => void;
  seedCrowd: (count: number) => void;
  placeRoom: (p: Point) => void;
  renameRoom: (id: string, name: string) => void;
  beginDim: (p: Point, exact?: boolean) => void;
  finishDim: (p: Point, ortho?: boolean, exact?: boolean) => void;
  placeNote: (p: Point) => void;
  renameNote: (id: string, text: string) => void;
  placePlant: (p: Point) => void;
  addSketch: (points: number[]) => void;
  traceSketch: (id?: string) => void;
  selectAt: (p: Point) => void;
  hitAt: (p: Point) => { kind: 'furniture' | 'landscape' | 'note' | 'dim' | 'opening' | 'wall' | 'sketch' | 'room'; id: string } | null;
  moveSelected: (dx: number, dy: number) => void;
  endMove: () => void;
  /** Arrow-key move. Exact, so it is never pulled back onto the grid. */
  nudgeSelected: (dx: number, dy: number) => void;
  debugJson: () => string;
}

function cloneDoc(d: ProjectDocument): ProjectDocument {
  return JSON.parse(JSON.stringify(d)) as ProjectDocument;
}

function clampOpeningT(t: number, width: number, wallLen: number): number {
  const half = wallLen > 0.2 ? (width / 2) / wallLen : 0.1;
  const pad = Math.min(0.12, Math.max(0.04, half));
  return Math.max(pad, Math.min(1 - pad, t));
}

function withFloor(doc: ProjectDocument, fn: (f: Floor) => Floor): ProjectDocument {
  return { ...doc, floors: doc.floors.map((f, i) => (i === 0 ? fn(f) : f)) };
}

function tip(get: () => Store): ReturnType<typeof tipLoc> {
  return tipLoc(get().doc.settings);
}

function toneForToast(msg: string, fallback: ToastTone): ToastTone {
  if (fallback !== 'info') return fallback;
  const miss = /almost|closer|click inside|too tight|need|first|locked|fail|could not|make the wall/i;
  const ok = /is in|placed|named|saved|ready|clipped|door is|window is|wall is|plant is|switched|done/i;
  if (miss.test(msg)) return 'miss';
  if (ok.test(msg)) return 'ok';
  return 'info';
}


function refreshRoof(f: Floor, roofStyleId: RoofStyleId | null): Floor {
  return { ...f, roof: generateRoof(f.nodes, f.walls, roofStyleId) };
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;
let toastTimer: ReturnType<typeof setTimeout> | null = null;
let moving = false;
/** A burst of arrow-key nudges should undo as one move, not one per tap. */
let nudgeTimer: ReturnType<typeof setTimeout> | null = null;

export const useProjectStore = create<Store>((set, get) => ({
  doc: blankProject(),
  past: [],
  future: [],
  tool: 'select',
  selected: null,
  selectedCatalogId: null,
  selectedRoomKind: DEFAULT_ROOM_KIND,
  catalogOpen: false,
  toolsPinned: false,
  panelsPinned: false,
  chromeEpoch: 0,
  fitNonce: 0,
  // Drawers overlay the plan — stay closed so the grid is the first view
  teachingOpen: false,
  accessOpen: false,
  contestOpen: false,
  customizeOpen: false,
  helpOpen: false,
  newProjectOpen: false,
  debugOpen: false,
  driveWizardOpen: false,
  changelogOpen: false,
  demoMode: false,
  viewMode: 'plan',
  panX: 40,
  panY: 40,
  zoom: 24,
  wallDraft: null,
  dimDraft: null,
  wallKind: 'exterior',
  wallMode: 'draw',
  selectedPlantKind: 'tree',
  viewport: { w: 800, h: 600 },
  saveStatus: 'saved',
  toast: null,
  lastSaveAt: null,

  floor: () => get().doc.floors[0],

  init: async () => {
    const loaded = await loadProject();
    if (loaded?.floors?.length) {
      const styleId = loaded.settings.styleId ?? loaded.meta.styleId;
      let typology = loaded.settings.typology;
      if (styleId === 'tiny-home' && !typology) {
        typology = defaultTinyHomeTypology('trailer');
      }
      const settings = {
        ...loaded.settings,
        textureId: loaded.settings.textureId ?? null,
        textureLabel: loaded.settings.textureLabel ?? '',
        imageBlobRef: loaded.settings.imageBlobRef ?? null,
        ...(typology ? { typology } : {}),
      };
      const doc = { ...loaded, settings };
      set({
        doc,
        saveStatus: 'saved',
        viewMode: settings.viewMode ?? 'plan',
        lastSaveAt: loaded.meta.updatedAt,
        toolsPinned: (settings.skillLevel ?? DEFAULT_SKILL_LEVEL) === 'novice',
      });
      queueMicrotask(() => get().fitPlan());
    } else {
      const skill = readSkillPref();
      const doc = get().doc;
      set({
        newProjectOpen: true,
        saveStatus: 'saved',
        doc: {
          ...doc,
          settings: {
            ...doc.settings,
            skillLevel: skill,
            locale: readLocalePref(),
            tipsLocale: readTipsLocalePref(),
            udlFat: readUdlFatPref(),
            udlType: readUdlTypePref(),
            udlContrast: readUdlContrastPref(),
            ellEnglish: readEllEnglishPref(),
          },
        },
        toolsPinned: skill === 'novice',
      });
    }
  },

  setTool: (tool) => {
    const skill = get().doc.settings.skillLevel ?? DEFAULT_SKILL_LEVEL;
    if (!isToolUnlocked(tool, skill)) {
      const loc = get().doc.settings.locale;
      get().showToast(
        t(loc, 'toast.locked', { level: t(loc, `skill.${levelRequiredFor(tool)}`) }),
        toastMs(skill, 3200),
      );
      return;
    }
    set({
      tool,
      wallDraft: null,
      dimDraft: null,
      wallMode: 'draw',
      catalogOpen: tool === 'furniture' || tool === 'room',
    });
  },
  setSkillLevel: (skillLevel) => {
    writeSkillPref(skillLevel);
    const doc = get().doc;
    const tool = get().tool;
    const nextTool = isToolUnlocked(tool, skillLevel) ? tool : 'select';
    set({
      doc: { ...doc, settings: { ...doc.settings, skillLevel } },
      tool: nextTool,
      catalogOpen: nextTool === 'furniture' || nextTool === 'room',
      toolsPinned: skillLevel === 'novice' ? true : get().toolsPinned,
    });
    get().markDirty();
    get().showToast(t(get().doc.settings.locale, 'toast.helpAs', { level: t(get().doc.settings.locale, `skill.${skillLevel}`) }), toastMs(skillLevel, 2200));
  },
  setWallKind: (wallKind) => set({ wallKind, wallMode: 'draw' }),
  setWallMode: (wallMode) => set({ wallMode, wallDraft: null, tool: 'wall' }),
  setPlantKind: (selectedPlantKind) => set({ selectedPlantKind, tool: 'plant' }),
  setViewport: (w, h) => set({ viewport: { w, h } }),
  fitPlan: () => {
    const mode = get().viewMode;
    if (mode === 'dollhouse') {
      set({ fitNonce: get().fitNonce + 1 });
      return;
    }
    const f = get().floor();
    const pts: Point[] = f.nodes.map((n) => ({ x: n.x, y: n.y }));
    for (const item of f.furniture) pts.push({ x: item.x, y: item.y });
    for (const item of f.landscape ?? []) pts.push({ x: item.x, y: item.y });
    for (const n of f.notes ?? []) pts.push({ x: n.x, y: n.y });
    for (const d of f.dimensions ?? []) {
      pts.push({ x: d.ax, y: d.ay }, { x: d.bx, y: d.by });
    }
    for (const sk of f.sketches ?? []) {
      for (let i = 0; i + 1 < sk.points.length; i += 2) {
        pts.push({ x: sk.points[i], y: sk.points[i + 1] });
      }
    }
    const { w, h } = get().viewport;
    if (!pts.length || w < 40 || h < 40) {
      set({ panX: 80, panY: 80, zoom: 24, viewMode: 'plan', fitNonce: get().fitNonce + 1 });
      return;
    }
    let minX = pts[0].x, maxX = pts[0].x, minY = pts[0].y, maxY = pts[0].y;
    for (const p of pts) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
    const pad = 4;
    const bw = Math.max(8, maxX - minX + pad * 2);
    const bh = Math.max(8, maxY - minY + pad * 2);
    const zoom = Math.min(80, Math.max(8, 0.82 * Math.min(w / bw, h / bh)));
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    set({
      zoom,
      panX: w / 2 - cx * zoom,
      panY: h / 2 - cy * zoom,
      viewMode: 'plan',
      fitNonce: get().fitNonce + 1,
    });
  },
  setFloorLayer: (key, on) => {
    set({
      doc: withFloor(get().doc, (f) => ({
        ...f,
        layers: { ...f.layers, [key]: on },
      })),
    });
    get().markDirty();
  },
  setTitle: (title) => {
    get().pushHistory();
    set({ doc: { ...get().doc, meta: { ...get().doc.meta, title } } });
    get().markDirty();
  },
  setSettings: (partial) => {
    const doc = get().doc;
    const settings = { ...doc.settings, ...partial };
    const meta = partial.units
      ? { ...doc.meta, units: partial.units }
      : doc.meta;
    if (partial.tipsLocale != null) {
      settings.tipsLocale = partial.tipsLocale;
      settings.locale = partial.locale ?? partial.tipsLocale;
      writeTipsLocalePref(partial.tipsLocale);
      writeLocalePref(settings.locale);
    } else if (partial.locale != null) {
      settings.locale = partial.locale;
      settings.tipsLocale = partial.tipsLocale ?? partial.locale;
      writeLocalePref(partial.locale);
      writeTipsLocalePref(settings.tipsLocale);
    }
    if (partial.udlFat != null) writeUdlFatPref(!!partial.udlFat);
    if (partial.udlType != null) writeUdlTypePref(!!partial.udlType);
    if (partial.udlContrast != null) writeUdlContrastPref(!!partial.udlContrast);
    if (partial.ellEnglish != null) writeEllEnglishPref(!!partial.ellEnglish);
    set({ doc: { ...doc, settings, meta } });
    get().markDirty();
  },
  setRoofStyle: (roofStyleId) => {
    const doc = get().doc;
    const label = roofStyleId ? roofStyleName(roofStyleId) : '';
    const settings = {
      ...doc.settings,
      roofStyleId,
      roofLabel: roofStyleId ? label : '',
      showRoof: roofStyleId != null ? true : doc.settings.showRoof,
    };
    const next = withFloor(doc, (f) => refreshRoof(f, roofStyleId));
    set({ doc: { ...next, settings }, saveStatus: 'unsaved' as SaveStatus });
    get().showToast(roofStyleId ? `Roof: ${label}` : 'Roof cleared');
  },
  setRoofLabel: (roofLabel) => {
    const doc = get().doc;
    const settings = { ...doc.settings, roofLabel };
    set({ doc: { ...doc, settings }, saveStatus: 'unsaved' as SaveStatus });
  },
  setTexture: (textureId, textureLabel, imageBlobRef) => {
    const doc = get().doc;
    const prevRef = doc.settings.imageBlobRef ?? null;
    const label =
      textureLabel ??
      (textureId ? textureName(textureId) : '');
    const nextRef =
      textureId === 'import:local'
        ? (imageBlobRef !== undefined ? imageBlobRef : doc.settings.imageBlobRef ?? null)
        : null;
    const settings = {
      ...doc.settings,
      textureId,
      textureLabel: textureId ? label : '',
      imageBlobRef: textureId ? nextRef : null,
    };
    set({ doc: { ...doc, settings }, saveStatus: 'unsaved' as SaveStatus });
    if (prevRef && prevRef !== nextRef) {
      void deleteTextureBlob(prevRef);
      forgetImportPattern(prevRef);
    }
    get().showToast(
      textureId
        ? `Wallpaper: ${label}`
        : 'Wallpaper cleared · plain paint',
    );
  },
  clearTexture: () => {
    get().setTexture(null, '', null);
  },
  importTextureFile: async (file) => {
    const result = await prepareTextureImport(file);
    if (!result.ok) {
      get().showToast(result.message);
      return;
    }
    const ref = newBlobRef();
    try {
      await putTextureBlob(ref, result.blob);
    } catch {
      get().showToast('Could not save image locally — try again.');
      return;
    }
    get().setTexture('import:local', result.label, ref);
    get().showToast(`Wallpaper: ${result.label} (${result.width}×${result.height})`);
  },
  setTypologyShell: (shell) => {
    const doc = get().doc;
    if (doc.settings.styleId !== 'tiny-home') return;
    const typology = typologyWithShell(doc.settings.typology, shell);
    set({
      doc: { ...doc, settings: { ...doc.settings, typology } },
      saveStatus: 'unsaved' as SaveStatus,
    });
    get().showToast(shell === 'shipping-container' ? 'Shell: Shipping container' : shell === 'trailer' ? 'Shell: Trailer' : 'Shell: Other');
  },
  setInventoryPresent: (id, present) => {
    const doc = get().doc;
    const cur = doc.settings.typology;
    if (!cur || doc.settings.styleId !== 'tiny-home') return;
    const typology = typologyTogglePresent(cur, id, present);
    set({
      doc: { ...doc, settings: { ...doc.settings, typology } },
      saveStatus: 'unsaved' as SaveStatus,
    });
  },
  setViewMode: (viewMode) => {
    set({ viewMode, doc: { ...get().doc, settings: { ...get().doc.settings, viewMode } } });
    get().markDirty();
  },
  setRenderTier: (renderTier) => {
    const viewMode: ViewMode =
      renderTier === 0 ? 'plan' : renderTier === 1 ? 'solid3d' : renderTier === 2 ? 'materials' : 'lighting';
    set({
      viewMode,
      doc: { ...get().doc, settings: { ...get().doc.settings, renderTier, viewMode } },
    });
    get().markDirty();
  },
  setPanZoom: (panX, panY, zoom) => {
    set((s) => ({ panX, panY, zoom: zoom ?? s.zoom }));
    if (dirtyTiles.size) {
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(() => { void get().autosave(); }, 400);
    }
  },
  toggleTeaching: () => set((s) => ({
    teachingOpen: !s.teachingOpen,
    accessOpen: false,
    contestOpen: false,
    helpOpen: false,
    customizeOpen: false,
  })),
  toggleAccess: () => set((s) => ({
    accessOpen: !s.accessOpen,
    contestOpen: false,
    teachingOpen: false,
    helpOpen: false,
    customizeOpen: false,
  })),
  toggleContest: () => set((s) => ({
    contestOpen: !s.contestOpen,
    accessOpen: false,
    teachingOpen: false,
    helpOpen: false,
    customizeOpen: false,
  })),
  toggleCatalog: () => set((s) => ({ catalogOpen: !s.catalogOpen })),
  setCatalogOpen: (catalogOpen) => set({ catalogOpen }),
  closeOverlays: () => set((s) => ({
    catalogOpen: false,
    teachingOpen: false,
    accessOpen: false,
    contestOpen: false,
    helpOpen: false,
    customizeOpen: false,
    toolsPinned: false,
    panelsPinned: false,
    chromeEpoch: s.chromeEpoch + 1,
  })),
  setToolsPinned: (toolsPinned) => set({ toolsPinned }),
  setPanelsPinned: (panelsPinned) => set({ panelsPinned }),
  minimizeTools: () => {
    get().cancelWallDraft();
    set((s) => ({
      tool: 'select',
      catalogOpen: false,
      toolsPinned: false,
      chromeEpoch: s.chromeEpoch + 1,
    }));
  },
  minimizePanels: () => set((s) => ({
    teachingOpen: false,
    accessOpen: false,
    contestOpen: false,
    helpOpen: false,
    customizeOpen: false,
    panelsPinned: false,
    chromeEpoch: s.chromeEpoch + 1,
  })),
  toggleCustomize: () => set((s) => ({
    customizeOpen: !s.customizeOpen,
    teachingOpen: false,
    accessOpen: false,
    contestOpen: false,
    helpOpen: false,
  })),
  toggleHelp: () => set((s) => ({
    helpOpen: !s.helpOpen,
    teachingOpen: false,
    accessOpen: false,
    contestOpen: false,
    customizeOpen: false,
  })),
  toggleDebug: () => set((s) => ({ debugOpen: !s.debugOpen })),
  toggleChangelog: () => set((s) => ({ changelogOpen: !s.changelogOpen })),
  toggleDemo: () => set((s) => ({ demoMode: !s.demoMode })),
  openNewProject: (newProjectOpen) => set({ newProjectOpen }),
  openDriveWizard: (driveWizardOpen) => set({ driveWizardOpen }),
  selectCatalog: (selectedCatalogId) =>
    set({
      selectedCatalogId,
      tool: selectedCatalogId ? 'furniture' : get().tool,
      catalogOpen: selectedCatalogId ? true : get().catalogOpen,
    }),
  selectRoomKind: (selectedRoomKind) =>
    set({
      selectedRoomKind,
      tool: 'room',
      catalogOpen: true,
    }),
  showToast: (title, ms = 2400, tone = 'info') => {
    if (toastTimer) clearTimeout(toastTimer);
    const hold = get().doc.settings.udlType ? Math.max(ms + 1400, 4200) : ms;
    const plate: ToastPlate = { tone: toneForToast(title, tone), title };
    set({ toast: plate });
    toastTimer = setTimeout(() => {
      toastTimer = null;
      set({ toast: null });
    }, hold);
  },
  showCapToast: (kind) => {
    if (toastTimer) clearTimeout(toastTimer);
    const loc = tip(get);
    const plate: ToastPlate = {
      tone: 'cap',
      cap: kind,
      title: t(loc, CAP_TOAST[kind]),
      body: t(loc, 'toast.capBody'),
    };
    set({ toast: plate });
    toastTimer = setTimeout(() => {
      toastTimer = null;
      set({ toast: null });
    }, 2500);
  },
  clearToast: () => {
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = null;
    set({ toast: null });
  },

  pushHistory: () => {
    const { doc, past } = get();
    set({ past: [...past.slice(-(MAX_UNDO - 1)), cloneDoc(doc)], future: [] });
  },
  undo: () => {
    const { past, doc, future } = get();
    if (!past.length) return;
    set({
      past: past.slice(0, -1),
      future: [cloneDoc(doc), ...future],
      doc: past[past.length - 1],
      selected: null,
    });
    get().markDirty();
  },
  redo: () => {
    const { past, doc, future } = get();
    if (!future.length) return;
    set({
      future: future.slice(1),
      past: [...past, cloneDoc(doc)],
      doc: future[0],
      selected: null,
    });
    get().markDirty();
  },

  markDirty: (at) => {
    set({ saveStatus: 'unsaved' });
    if (at) {
      dirtyTiles.add(tileKey(get().floor().id, at.x, at.y));
    } else {
      fullFlushNeeded = true;
    }
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { void get().autosave(); }, 400);
  },
  flushSave: async () => {
    fullFlushNeeded = true;
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    await get().autosave();
  },
  autosave: async () => {
    const { doc, panX, panY, zoom, viewport } = get();
    try {
      if (fullFlushNeeded) {
        set({ saveStatus: 'saving' });
        await saveProject(doc);
        dirtyTiles.clear();
        fullFlushNeeded = false;
      } else if (dirtyTiles.size) {
        const awake = new Set(awakeTileKeys({
          floorId: doc.floors[0].id,
          panX, panY, zoom,
          w: viewport.w,
          h: viewport.h,
        }));
        const writeKeys = [...dirtyTiles].filter((k) => awake.has(k));
        if (!writeKeys.length) return;
        set({ saveStatus: 'saving' });
        const chunks = writeKeys
          .map((key) => extractChunk(doc.floors[0], key))
          .filter((c): c is NonNullable<typeof c> => c != null);
        await saveDirtyChunks(chunks);
        for (const key of writeKeys) dirtyTiles.delete(key);
      } else {
        return;
      }
      const ts = new Date().toISOString();
      noteAutosaveSuccess();
      set({
        saveStatus: 'saved',
        lastSaveAt: ts,
        doc: { ...get().doc, meta: { ...get().doc.meta, version: APP_VERSION, updatedAt: ts } },
      });
    } catch (e) {
      set({ saveStatus: 'error' });
      const msg = e instanceof Error ? e.message : 'autosave failed';
      void import('./useDebugStore').then(({ useDebugStore }) => {
        useDebugStore.getState().setLastError(msg.slice(0, 500), 'autosave');
      });
    }
  },

  newFromTemplate: (styleId) => {
    const cur = get().doc.settings;
    const skillLevel = cur.skillLevel ?? DEFAULT_SKILL_LEVEL;
    const doc = buildTemplateProject(styleId);
    doc.settings.skillLevel = skillLevel;
    doc.settings.locale = cur.locale;
    doc.settings.tipsLocale = cur.tipsLocale ?? cur.locale;
    doc.settings.udlFat = cur.udlFat;
    doc.settings.udlType = cur.udlType;
    doc.settings.udlContrast = cur.udlContrast;
    doc.settings.ellEnglish = cur.ellEnglish;
    doc.settings.guiTheme = cur.guiTheme;
    set({
      doc,
      past: [],
      future: [],
      selected: null,
      wallDraft: null,
      newProjectOpen: false,
      viewMode: 'plan',
      panX: 40,
      panY: 40,
      zoom: 24,
      toolsPinned: skillLevel === 'novice',
    });
    get().markDirty();
    get().showToast(
      styleId === 'dog-house'
        ? t(doc.settings.locale, 'toast.contestStart')
        : t(doc.settings.locale, 'toast.ready', { title: doc.meta.title }),
    );
    setTimeout(() => get().fitPlan(), 80);
  },
  exportJson: () => {
    void get().flushSave();
    exportProjectFile(get().doc);
    get().showToast(t(tip(get), 'toast.saved'), 2400, 'ok');
  },
  exportGalleryCard: (opts) => {
    exportGalleryCardFile(get().doc, opts);
    get().showToast(t(get().doc.settings.locale, 'toast.card'));
  },
  importJson: async (file) => {
    try {
      const loaded = await importProjectFile(file);
      const doc = {
        ...loaded,
        settings: {
          ...loaded.settings,
          textureId: loaded.settings.textureId ?? null,
          textureLabel: loaded.settings.textureLabel ?? '',
          imageBlobRef: loaded.settings.imageBlobRef ?? null,
        },
      };
      set({ doc, past: [], future: [], selected: null, newProjectOpen: false });
      get().markDirty();
      get().showToast(t(get().doc.settings.locale, 'toast.imported'));
    } catch {
      get().showToast(t(get().doc.settings.locale, 'toast.importFail'));
    }
  },

  clearSelection: () => set({ selected: null }),
  setSelected: (selected) => set({ selected }),
  deleteSelected: () => {
    const { selected, doc } = get();
    if (!selected) return;
    get().pushHistory();
    const next = withFloor(doc, (f) => {
      if (selected.kind === 'wall') {
        const next = {
          ...f,
          walls: f.walls.filter((w) => w.id !== selected.id),
          openings: f.openings.filter((o) => o.wallId !== selected.id),
        };
        return refreshRoof(next, get().doc.settings.roofStyleId ?? null);
      }
      if (selected.kind === 'opening') {
        return { ...f, openings: f.openings.filter((o) => o.id !== selected.id) };
      }
      if (selected.kind === 'room') {
        return { ...f, rooms: (f.rooms ?? []).filter((r) => r.id !== selected.id) };
      }
      if (selected.kind === 'dim') {
        return { ...f, dimensions: (f.dimensions ?? []).filter((d) => d.id !== selected.id) };
      }
      if (selected.kind === 'note') {
        return { ...f, notes: (f.notes ?? []).filter((n) => n.id !== selected.id) };
      }
      if (selected.kind === 'landscape') {
        return { ...f, landscape: (f.landscape ?? []).filter((x) => x.id !== selected.id) };
      }
      if (selected.kind === 'sketch') {
        return { ...f, sketches: (f.sketches ?? []).filter((x) => x.id !== selected.id) };
      }
      return { ...f, furniture: f.furniture.filter((x) => x.id !== selected.id) };
    });
    set({ doc: next, selected: null });
    get().markDirty();
  },

  beginWall: (p, exact) => {
    if (capReached(get().floor(), 'walls')) {
      get().showCapToast('walls');
      return;
    }
    const s = get().doc.settings;
    set({ wallDraft: exact ? p : snapPoint(p, s.gridSize, s.snap), dimDraft: null });
  },
  finishWall: (p, forceOrtho, exact) => {
    const { wallDraft, doc } = get();
    if (!wallDraft) return;
    if (capReached(get().floor(), 'walls')) {
      set({ wallDraft: null });
      get().showCapToast('walls');
      return;
    }
    const s = doc.settings;
    const endPt = exact ? p : snapWallEnd(wallDraft, p, {
      ortho: s.ortho !== false,
      forceOrtho: !!forceOrtho,
      snap: s.snap,
      gridSize: s.gridSize,
    });
    if (Math.hypot(endPt.x - wallDraft.x, endPt.y - wallDraft.y) < 0.5) {
      set({ wallDraft: null });
      get().showToast(t(tip(get), 'toast.wallShort'), 2800, 'miss');
      return;
    }
    get().pushHistory();
    const merge = s.snap ? s.gridSize * 0.4 : 0.35;
    set({
      doc: withFloor(doc, (f) => {
        let nodes = [...f.nodes];
        const aRes = findOrCreateNode(nodes, wallDraft, merge);
        nodes = aRes.nodes;
        const bRes = findOrCreateNode(nodes, endPt, merge);
        nodes = bRes.nodes;
        if (aRes.id === bRes.id) return f;
        const dup = f.walls.some(
          (w) => (w.a === aRes.id && w.b === bRes.id) || (w.a === bRes.id && w.b === aRes.id),
        );
        if (dup) return f;
        let walls = [...f.walls];
        let openings = [...f.openings];
        ({ walls, openings } = splitWallsAtNode(walls, openings, nodes, aRes.id, merge));
        ({ walls, openings } = splitWallsAtNode(walls, openings, nodes, bRes.id, merge));
        const kind = get().wallKind;
        const wall: Wall = {
          id: uid('w'), a: aRes.id, b: bRes.id, kind,
          thickness: kind === 'interior' ? 0.35 : 0.5,
        };
        const next = { ...f, nodes, walls: [...walls, wall], openings };
        return refreshRoof(next, get().doc.settings.roofStyleId ?? null);
      }),
      wallDraft: null,
    });
    get().markDirty(endPt);
    get().showToast(t(tip(get), 'toast.wallIn'), 2400, 'ok');
  },
  chamferAt: (p) => {
    const floor = get().floor();
    const node = nearestChamferable(floor.nodes, floor.walls, p, 1.8);
    if (!node) {
      get().showToast(t(get().doc.settings.locale, 'toast.clipHint'), 2800);
      return;
    }
    const size = Math.max(1, get().doc.settings.gridSize || 1) * 2;
    const cut = chamferCorner(floor.nodes, floor.walls, floor.openings, node.id, size);
    if (!cut) {
      get().showToast('That corner is too tight to clip', 2800);
      return;
    }
    get().pushHistory();
    set({
      doc: withFloor(get().doc, (f) => refreshRoof(
        { ...f, nodes: cut.nodes, walls: cut.walls, openings: cut.openings },
        get().doc.settings.roofStyleId ?? null,
      )),
    });
    get().markDirty();
    get().showToast('Corner clipped — rooms follow the slant', 2400);
  },
  cancelWallDraft: () => set({ wallDraft: null, dimDraft: null }),

  placeOpening: (type, p) => {
    const floor = get().floor();
    const existing = hitOpening(floor.openings, floor.walls, floor.nodes, p, 0.9);
    if (existing) {
      const o = floor.openings.find((x) => x.id === existing);
      if (o && o.type === type) {
        set({ selected: { kind: 'opening', id: existing }, tool: 'select' });
        return;
      }
    }
    const hit = nearestWall(floor.walls, floor.nodes, p, 1.5);
    if (!hit) {
      get().showToast(t(tip(get), 'toast.missWall'), toastMs(get().doc.settings.skillLevel ?? DEFAULT_SKILL_LEVEL, 3200), 'miss');
      return;
    }
    get().pushHistory();
    const dogHouse = get().doc.settings.styleId === 'dog-house';
    const opening: Opening = {
      id: uid('o'),
      wallId: hit.wall.id,
      t: hit.t,
      width: type === 'door' ? (dogHouse ? 1.5 : 3) : 3.5,
      type,
      symbolKind: type === 'door' ? 'swingDoor' : 'windowFixed',
      swing: 'left',
    };
    set({
      doc: withFloor(get().doc, (f) => ({ ...f, openings: [...f.openings, opening] })),
      selected: { kind: 'opening', id: opening.id },
      tool: 'select',
    });
    get().markDirty(p);
    get().showToast(
      type === 'door'
        ? (get().doc.settings.styleId === 'dog-house'
          ? t(tip(get), 'toast.doorDog')
          : t(tip(get), 'toast.doorIn'))
        : t(tip(get), 'toast.windowIn'),
      toastMs(get().doc.settings.skillLevel ?? DEFAULT_SKILL_LEVEL, 2800),
      'ok',
    );
  },

  patchOpening: (id, patch) => {
    get().pushHistory();
    set({
      doc: withFloor(get().doc, (f) => ({
        ...f,
        openings: f.openings.map((o) => {
          if (o.id !== id) return o;
          const next = { ...o, ...patch };
          if (next.symbolKind === 'slidingDoor') next.swing = o.swing;
          const wall = f.walls.find((w) => w.id === next.wallId);
          const len = wall ? wallLength(wall, f.nodes) : 8;
          next.t = clampOpeningT(next.t, next.width, len);
          return next;
        }),
      })),
    });
    get().markDirty();
  },

  patchWall: (id, patch) => {
    get().pushHistory();
    set({
      doc: withFloor(get().doc, (f) => {
        const next = {
          ...f,
          walls: f.walls.map((w) => (w.id === id ? {
            ...w,
            ...patch,
            thickness: patch.thickness
              ?? (patch.kind === 'interior' ? 0.35 : patch.kind === 'exterior' ? 0.5 : w.thickness),
          } : w)),
        };
        return refreshRoof(next, get().doc.settings.roofStyleId ?? null);
      }),
    });
    get().markDirty();
  },

  patchFurniture: (id, patch) => {
    get().pushHistory();
    set({
      doc: withFloor(get().doc, (f) => ({
        ...f,
        furniture: f.furniture.map((item) => {
          if (item.id !== id) return item;
          const next = { ...item, ...patch };
          if (next.w != null) next.w = Math.max(0.4, next.w);
          if (next.h != null) next.h = Math.max(0.4, next.h);
          return next;
        }),
      })),
    });
    get().markDirty();
  },

  patchLandscape: (id, patch) => {
    get().pushHistory();
    set({
      doc: withFloor(get().doc, (f) => ({
        ...f,
        landscape: (f.landscape ?? []).map((item) => {
          if (item.id !== id) return item;
          const next = { ...item, ...patch };
          if (next.w != null) next.w = Math.max(0.4, next.w);
          if (next.h != null) next.h = Math.max(0.4, next.h);
          return next;
        }),
      })),
    });
    get().markDirty();
  },

  moveWallEnd: (wallId, end, p, forceOrtho) => {
    const { doc } = get();
    const wall = get().floor().walls.find((w) => w.id === wallId);
    if (!wall) return;
    const e = wallEnds(wall, get().floor().nodes);
    if (!e) return;
    const from = end === 'a' ? e.b : e.a;
    const s = doc.settings;
    const to = snapWallEnd(from, p, {
      ortho: s.ortho !== false,
      forceOrtho: !!forceOrtho,
      snap: s.snap,
      gridSize: s.gridSize,
    });
    if (Math.hypot(to.x - from.x, to.y - from.y) < 0.25) return;
    if (!moving) {
      get().pushHistory();
      moving = true;
    }
    set({
      doc: withFloor(get().doc, (f) => ({
        ...f,
        nodes: nodesAfterWallEnd(f.nodes, wall, end, to),
      })),
    });
  },

  setWallLength: (wallId, length) => {
    const wall = get().floor().walls.find((w) => w.id === wallId);
    if (!wall) return;
    const len = Math.max(0.5, length);
    get().pushHistory();
    set({
      doc: withFloor(get().doc, (f) => {
        const next = { ...f, nodes: nodesAfterWallLength(f.nodes, wall, len) };
        return refreshRoof(next, get().doc.settings.roofStyleId ?? null);
      }),
    });
    get().markDirty();
  },

  patchRoom: (id, patch) => {
    if (patch.kind) get().pushHistory();
    set({
      doc: withFloor(get().doc, (f) => ({
        ...f,
        rooms: (f.rooms ?? []).map((r) => {
          if (r.id !== id) return r;
          const next = { ...r, ...patch };
          if (patch.kind && (!patch.name || !patch.name.trim()) && r.name === roomType(r.kind).name) {
            next.name = roomType(patch.kind).name;
          }
          if (patch.kind && r.floorFinishId === defaultFloorForKind(r.kind)) {
            next.floorFinishId = defaultFloorForKind(patch.kind);
          }
          if (typeof next.name === 'string') next.name = next.name.trim().slice(0, 28) || r.name;
          return next;
        }),
      })),
    });
    get().markDirty();
  },

  placeFurniture: (p) => {
    if (capReached(get().floor(), 'objects')) {
      get().showCapToast('objects');
      return;
    }
    const { selectedCatalogId, doc } = get();
    const cat = FURNITURE_CATALOG.find((c) => c.id === selectedCatalogId) ?? FURNITURE_CATALOG[0];
    const s = doc.settings;
    // Snap only when enabled — free drag/place when off
    const pt = snapPoint(p, s.gridSize, s.snap);
    get().pushHistory();
    const item: FurnitureItem = {
      id: uid('f'),
      catalogId: cat.id,
      x: pt.x,
      y: pt.y,
      w: cat.w,
      h: cat.h,
      rot: 0,
      zIndex: 1,
      label: cat.name,
    };
    set({
      doc: withFloor(doc, (f) => ({ ...f, furniture: [...f.furniture, item] })),
      selected: { kind: 'furniture', id: item.id },
      tool: 'select',
    });
    get().markDirty(pt);
    {
      const skill = get().doc.settings.skillLevel ?? DEFAULT_SKILL_LEVEL;
      get().showToast(t(tip(get), 'toast.furnMove'), toastMs(skill, 2800), 'ok');
    }
  },

  seedCrowd: (count) => {
    const roomLeft = remaining(get().floor(), 'objects');
    if (roomLeft <= 0) {
      get().showCapToast('objects');
      return;
    }
    const n = Math.max(1, Math.min(roomLeft, Math.floor(count)));
    get().pushHistory();
    const cols = Math.max(1, Math.ceil(Math.sqrt(n)));
    const gap = 4;
    const added: FurnitureItem[] = [];
    for (let i = 0; i < n; i++) {
      const cat = FURNITURE_CATALOG[i % FURNITURE_CATALOG.length];
      const col = i % cols;
      const row = Math.floor(i / cols);
      added.push({
        id: uid('f'),
        catalogId: cat.id,
        x: 3 + col * gap,
        y: 3 + row * gap,
        w: cat.w,
        h: cat.h,
        rot: 0,
        zIndex: 1,
        label: cat.name,
      });
    }
    set({
      doc: withFloor(get().doc, (f) => ({ ...f, furniture: [...f.furniture, ...added] })),
      selected: null,
      zoom: n >= 400 ? 8 : n >= 150 ? 12 : 16,
      panX: 24,
      panY: 24,
      viewMode: 'plan',
    });
    get().markDirty();
    const total = get().floor().furniture.length;
    get().showToast(`Scattered ${n} · ${total} pieces on the plan. Undo to clear.`, 3600);
  },

  placeRoom: (p) => {
    if (capReached(get().floor(), 'rooms')) {
      get().showCapToast('rooms');
      return;
    }
    const { selectedRoomKind, doc } = get();
    const kind = selectedRoomKind ?? DEFAULT_ROOM_KIND;
    const cat = roomType(kind);
    const s = doc.settings;
    const pt = snapPoint(p, s.gridSize, s.snap);
    const floor = get().floor();
    const poly = findEnclosedFace(floor.nodes, floor.walls, pt);
    if (!poly) {
      get().showToast(
        'Click inside a closed room. Walls have to meet first.',
        toastMs(get().doc.settings.skillLevel ?? DEFAULT_SKILL_LEVEL, 3600),
      );
      return;
    }
    const already = (floor.rooms ?? []).find((r) => dist({ x: r.x, y: r.y }, pt) < 1.2);
    if (already) {
      set({ selected: { kind: 'room', id: already.id } });
      get().showToast('That room is already named — click Select to rename', 2800);
      return;
    }
    get().pushHistory();
    const item: Room = {
      id: uid('rm'),
      kind,
      name: cat.name,
      x: pt.x,
      y: pt.y,
      floorFinishId: defaultFloorForKind(kind),
    };
    const area = formatArea(polygonArea(poly), s.units);
    set({
      doc: withFloor(doc, (f) => ({ ...f, rooms: [...(f.rooms ?? []), item] })),
      selected: { kind: 'room', id: item.id },
    });
    get().markDirty(pt);
    get().showToast(`${cat.name} named · ${area}`, 2400, 'ok');
  },

  renameRoom: (id, name) => {
    const trimmed = name.slice(0, 40);
    set({
      doc: withFloor(get().doc, (f) => ({
        ...f,
        rooms: (f.rooms ?? []).map((r) => (r.id === id ? { ...r, name: trimmed } : r)),
      })),
    });
    get().markDirty();
  },

  beginDim: (p, exact) => {
    const s = get().doc.settings;
    set({ dimDraft: exact ? p : snapPoint(p, s.gridSize, s.snap), wallDraft: null });
  },
  finishDim: (p, forceOrtho, exact) => {
    const { dimDraft, doc } = get();
    if (!dimDraft) return;
    const s = doc.settings;
    const endPt = exact ? p : snapWallEnd(dimDraft, p, {
      ortho: s.ortho !== false,
      forceOrtho: !!forceOrtho,
      snap: s.snap,
      gridSize: s.gridSize,
    });
    if (dist(dimDraft, endPt) < 0.4) {
      set({ dimDraft: null });
      return;
    }
    get().pushHistory();
    const item: DimItem = {
      id: uid('dim'),
      ax: dimDraft.x,
      ay: dimDraft.y,
      bx: endPt.x,
      by: endPt.y,
    };
    set({
      doc: withFloor(doc, (f) => ({ ...f, dimensions: [...(f.dimensions ?? []), item] })),
      dimDraft: null,
      selected: { kind: 'dim', id: item.id },
    });
    get().markDirty();
    const skill = get().doc.settings.skillLevel ?? DEFAULT_SKILL_LEVEL;
    if (skillRank(skill) < 3) get().showToast(t(get().doc.settings.locale, 'toast.dimIn'), toastMs(skill, 2400));
  },

  placeNote: (p) => {
    const { doc } = get();
    const s = doc.settings;
    const pt = snapPoint(p, s.gridSize, s.snap);
    get().pushHistory();
    const item: NoteItem = { id: uid('note'), x: pt.x, y: pt.y, text: 'Note' };
    set({
      doc: withFloor(doc, (f) => ({ ...f, notes: [...(f.notes ?? []), item] })),
      selected: { kind: 'note', id: item.id },
      tool: 'select',
    });
    get().markDirty();
    get().showToast(t(get().doc.settings.locale, 'toast.noteType'), 2200);
  },

  renameNote: (id, text) => {
    const trimmed = text.slice(0, 80);
    set({
      doc: withFloor(get().doc, (f) => ({
        ...f,
        notes: (f.notes ?? []).map((n) => (n.id === id ? { ...n, text: trimmed } : n)),
      })),
    });
    get().markDirty();
  },

  placePlant: (p) => {
    if (capReached(get().floor(), 'objects')) {
      get().showCapToast('objects');
      return;
    }
    const { selectedPlantKind, doc } = get();
    const cat = plantType(selectedPlantKind);
    const s = doc.settings;
    const pt = snapPoint(p, s.gridSize, s.snap);
    get().pushHistory();
    const item: LandscapeItem = {
      id: uid('pl'),
      kind: cat.id,
      x: pt.x,
      y: pt.y,
      w: cat.w,
      h: cat.h,
      rot: 0,
      label: cat.name,
    };
    set({
      doc: withFloor(doc, (f) => ({
        ...f,
        landscape: [...(f.landscape ?? []), item],
        layers: { ...f.layers, landscape: true },
      })),
      selected: { kind: 'landscape', id: item.id },
    });
    get().markDirty(pt);
    get().showToast(t(tip(get), 'toast.plantIn'), 2400, 'ok');
  },

  addSketch: (points) => {
    const simplified = simplifyPolyline(points, 0.12);
    if (simplified.length < 4 || polylineLength(simplified) < 0.4) return;
    get().pushHistory();
    const item: SketchStroke = { id: uid('sk'), points: simplified };
    set({
      doc: withFloor(get().doc, (f) => ({
        ...f,
        sketches: [...(f.sketches ?? []), item],
        layers: { ...f.layers, sketch: true },
      })),
      selected: { kind: 'sketch', id: item.id },
    });
    get().markDirty();
    const skill = get().doc.settings.skillLevel ?? DEFAULT_SKILL_LEVEL;
    if (skillRank(skill) <= 1) {
      get().showToast(t(get().doc.settings.locale, 'toast.sketchIn'), toastMs(skill, 3200));
    }
  },

  traceSketch: (id) => {
    const selected = get().selected;
    const sketches = get().floor().sketches ?? [];
    const sketchId = id
      ?? (selected?.kind === 'sketch' ? selected.id : null)
      ?? sketches[sketches.length - 1]?.id
      ?? null;
    if (!sketchId) {
      get().showToast(t(get().doc.settings.locale, 'toast.sketchFirst'), 2400);
      return;
    }
    const sketch = (get().floor().sketches ?? []).find((s) => s.id === sketchId);
    if (!sketch) return;
    const s = get().doc.settings;
    const verts = fitWallsFromStroke(sketch.points, {
      gridSize: s.gridSize,
      snap: s.snap,
      ortho: s.ortho !== false,
    });
    if (verts.length < 2) {
      get().showToast(t(s.locale, 'toast.traceNeed'), 3200, 'miss');
      return;
    }
    if (capReached(get().floor(), 'walls')) {
      get().showCapToast('walls');
      return;
    }
    const merge = s.snap ? s.gridSize * 0.4 : 0.35;
    const kind = get().wallKind;
    const thick = kind === 'interior' ? 0.35 : 0.5;
    get().pushHistory();
    let added = 0;
    set({
      doc: withFloor(get().doc, (f) => {
        let nodes = [...f.nodes];
        let walls = [...f.walls];
        let openings = [...f.openings];
        for (let i = 1; i < verts.length; i++) {
          const prev = verts[i - 1];
          const endPt = verts[i];
          if (Math.hypot(endPt.x - prev.x, endPt.y - prev.y) < 0.95) continue;
          const aRes = findOrCreateNode(nodes, prev, merge);
          nodes = aRes.nodes;
          const bRes = findOrCreateNode(nodes, endPt, merge);
          nodes = bRes.nodes;
          if (aRes.id === bRes.id) continue;
          const dup = walls.some(
            (w) => (w.a === aRes.id && w.b === bRes.id) || (w.a === bRes.id && w.b === aRes.id),
          );
          if (dup) continue;
          ({ walls, openings } = splitWallsAtNode(walls, openings, nodes, aRes.id, merge));
          ({ walls, openings } = splitWallsAtNode(walls, openings, nodes, bRes.id, merge));
          walls.push({
            id: uid('w'), a: aRes.id, b: bRes.id, kind, thickness: thick,
          });
          added += 1;
        }
        if (added === 0) return f;
        return refreshRoof({ ...f, nodes, walls, openings }, get().doc.settings.roofStyleId ?? null);
      }),
      selected: null,
      tool: 'select',
    });
    get().markDirty();
    if (added === 0) {
      get().showToast(t(get().doc.settings.locale, 'toast.traceNeed'), 3200);
    } else {
      get().showToast(
        added === 1
          ? t(get().doc.settings.locale, 'toast.traceOne')
          : t(get().doc.settings.locale, 'toast.traceMany', { n: String(added) }),
        toastMs(get().doc.settings.skillLevel ?? DEFAULT_SKILL_LEVEL, 2800),
      );
    }
  },

  selectAt: (p) => {
    const hit = get().hitAt(p);
    set({ selected: hit });
  },

  hitAt: (p) => {
    const f = get().floor();
    const fid = hitFurniture(f.furniture, p);
    if (fid) return { kind: 'furniture', id: fid };
    const lid = hitLandscape(f.landscape ?? [], p);
    if (lid) return { kind: 'landscape', id: lid };
    const nid = hitNote(f.notes ?? [], p);
    if (nid) return { kind: 'note', id: nid };
    const did = hitDimension(f.dimensions ?? [], p);
    if (did) return { kind: 'dim', id: did };
    const oid = hitOpening(f.openings, f.walls, f.nodes, p, 1.25);
    if (oid) return { kind: 'opening', id: oid };
    const wid = hitWall(f.walls, f.nodes, p);
    if (wid) return { kind: 'wall', id: wid };
    const sid = hitSketch(f.sketches ?? [], p);
    if (sid) return { kind: 'sketch', id: sid };
    const rid = hitRoom(f.rooms ?? [], f.nodes, f.walls, p);
    if (rid) return { kind: 'room', id: rid };
    return null;
  },

  moveSelected: (dx, dy) => {
    const { selected, doc } = get();
    if (!selected) return;
    if (!moving) {
      get().pushHistory();
      moving = true;
    }
    // Free drag: do not force snap mid-drag (snap optional on place / Customize)
    if (selected.kind === 'furniture') {
      set({
        doc: withFloor(doc, (f) => ({
          ...f,
          furniture: f.furniture.map((item) =>
            item.id === selected.id ? { ...item, x: item.x + dx, y: item.y + dy } : item,
          ),
        })),
      });
    } else if (selected.kind === 'room') {
      set({
        doc: withFloor(doc, (f) => ({
          ...f,
          rooms: (f.rooms ?? []).map((r) =>
            r.id === selected.id ? { ...r, x: r.x + dx, y: r.y + dy } : r,
          ),
        })),
      });
    } else if (selected.kind === 'landscape') {
      set({
        doc: withFloor(doc, (f) => ({
          ...f,
          landscape: (f.landscape ?? []).map((item) =>
            item.id === selected.id ? { ...item, x: item.x + dx, y: item.y + dy } : item,
          ),
        })),
      });
    } else if (selected.kind === 'note') {
      set({
        doc: withFloor(doc, (f) => ({
          ...f,
          notes: (f.notes ?? []).map((n) =>
            n.id === selected.id ? { ...n, x: n.x + dx, y: n.y + dy } : n,
          ),
        })),
      });
    } else if (selected.kind === 'dim') {
      set({
        doc: withFloor(doc, (f) => ({
          ...f,
          dimensions: (f.dimensions ?? []).map((d) =>
            d.id === selected.id
              ? { ...d, ax: d.ax + dx, ay: d.ay + dy, bx: d.bx + dx, by: d.by + dy }
              : d,
          ),
        })),
      });
    } else if (selected.kind === 'sketch') {
      set({
        doc: withFloor(doc, (f) => ({
          ...f,
          sketches: (f.sketches ?? []).map((sk) => {
            if (sk.id !== selected.id) return sk;
            const points = sk.points.slice();
            for (let i = 0; i + 1 < points.length; i += 2) {
              points[i] += dx;
              points[i + 1] += dy;
            }
            return { ...sk, points };
          }),
        })),
      });
    } else if (selected.kind === 'wall') {
      set({
        doc: withFloor(doc, (f) => {
          const wall = f.walls.find((w) => w.id === selected.id);
          if (!wall) return f;
          return {
            ...f,
            nodes: f.nodes.map((n) =>
              n.id === wall.a || n.id === wall.b ? { ...n, x: n.x + dx, y: n.y + dy } : n,
            ),
          };
        }),
      });
    } else if (selected.kind === 'opening') {
      set({
        doc: withFloor(doc, (f) => {
          const o = f.openings.find((x) => x.id === selected.id);
          if (!o) return f;
          const wall = f.walls.find((w) => w.id === o.wallId);
          if (!wall) return f;
          const len = wallLength(wall, f.nodes);
          if (len < 0.4) return f;
          const ang = wallAngle(wall, f.nodes);
          const along = dx * Math.cos(ang) + dy * Math.sin(ang);
          const t = clampOpeningT(o.t + along / len, o.width, len);
          return {
            ...f,
            openings: f.openings.map((x) => (x.id === o.id ? { ...x, t } : x)),
          };
        }),
      });
    }
  },
  endMove: () => {
    if (moving) {
      moving = false;
      const { selected, doc } = get();
      const s = doc.settings;
      // Optional snap-on-drop for furniture only when snap is ON
      if (selected?.kind === 'furniture' && s.snap) {
        set({
          doc: withFloor(doc, (f) => ({
            ...f,
            furniture: f.furniture.map((item) => {
              if (item.id !== selected.id) return item;
              const pt = snapPoint({ x: item.x, y: item.y }, s.gridSize, true);
              return { ...item, x: pt.x, y: pt.y };
            }),
          })),
        });
      } else if (selected?.kind === 'room' && s.snap) {
        set({
          doc: withFloor(doc, (f) => ({
            ...f,
            rooms: (f.rooms ?? []).map((r) => {
              if (r.id !== selected.id) return r;
              const pt = snapPoint({ x: r.x, y: r.y }, s.gridSize, true);
              return { ...r, x: pt.x, y: pt.y };
            }),
          })),
        });
      } else if (selected?.kind === 'wall' && s.roofStyleId) {
        set({
          doc: withFloor(get().doc, (f) => refreshRoof(f, s.roofStyleId)),
        });
      }
      get().markDirty();
    }
  },
  nudgeSelected: (dx, dy) => {
    const selected = get().selected;
    if (!selected) return;
    get().moveSelected(dx, dy);
    const s = get().doc.settings;
    if (selected.kind === 'wall' && s.roofStyleId) {
      set({ doc: withFloor(get().doc, (f) => refreshRoof(f, s.roofStyleId)) });
    }
    if (nudgeTimer) clearTimeout(nudgeTimer);
    nudgeTimer = setTimeout(() => {
      nudgeTimer = null;
      moving = false;
      get().markDirty();
    }, 600);
  },

  duplicateSelected: () => {
    const skill = get().doc.settings.skillLevel ?? DEFAULT_SKILL_LEVEL;
    if (skillRank(skill) < 3) {
      get().showToast(t(get().doc.settings.locale, 'toast.locked', { level: t(get().doc.settings.locale, 'skill.expert') }), toastMs(skill, 2800));
      return;
    }
    const { selected, doc } = get();
    if (!selected) {
      get().showToast(t(get().doc.settings.locale, 'toast.dupNeed'), 2200);
      return;
    }
    get().pushHistory();
    if (selected.kind === 'furniture') {
      const src = get().floor().furniture.find((x) => x.id === selected.id);
      if (!src) return;
      const copy: FurnitureItem = { ...src, id: uid('f'), x: src.x + 1.5, y: src.y + 1.5 };
      set({
        doc: withFloor(doc, (f) => ({ ...f, furniture: [...f.furniture, copy] })),
        selected: { kind: 'furniture', id: copy.id },
      });
      get().markDirty();
      get().showToast(t(get().doc.settings.locale, 'toast.dup'), 1400);
      return;
    }
    if (selected.kind === 'room') {
      const src = (get().floor().rooms ?? []).find((x) => x.id === selected.id);
      if (!src) return;
      const copy: Room = { ...src, id: uid('rm'), x: src.x + 1.2, y: src.y + 1.2 };
      set({
        doc: withFloor(doc, (f) => ({ ...f, rooms: [...(f.rooms ?? []), copy] })),
        selected: { kind: 'room', id: copy.id },
      });
      get().markDirty();
      get().showToast(t(get().doc.settings.locale, 'toast.dup'), 1400);
      return;
    }
    if (selected.kind === 'opening') {
      const src = get().floor().openings.find((x) => x.id === selected.id);
      if (!src) return;
      const copy: Opening = { ...src, id: uid('o'), t: Math.min(0.85, src.t + 0.18) };
      set({
        doc: withFloor(doc, (f) => ({ ...f, openings: [...f.openings, copy] })),
        selected: { kind: 'opening', id: copy.id },
      });
      get().markDirty();
      get().showToast(t(get().doc.settings.locale, 'toast.dup'), 1400);
    }
  },
  rotateSelected: (dir) => {
    const skill = get().doc.settings.skillLevel ?? DEFAULT_SKILL_LEVEL;
    if (skillRank(skill) < 3) return;
    const { selected, doc } = get();
    if (selected?.kind !== 'furniture') return;
    get().pushHistory();
    const delta = dir * (Math.PI / 2);
    set({
      doc: withFloor(doc, (f) => ({
        ...f,
        furniture: f.furniture.map((item) =>
          item.id === selected.id ? { ...item, rot: item.rot + delta } : item,
        ),
      })),
    });
    get().markDirty();
  },

  debugJson: () => JSON.stringify({
    version: get().doc.meta.version,
    title: get().doc.meta.title,
    saveStatus: get().saveStatus,
    lastSaveAt: get().lastSaveAt,
    settings: get().doc.settings,
    floor: {
      nodes: get().floor().nodes.length,
      walls: get().floor().walls.length,
      openings: get().floor().openings.length,
      furniture: get().floor().furniture.length,
      rooms: (get().floor().rooms ?? []).length,
      dimensions: (get().floor().dimensions ?? []).length,
      notes: (get().floor().notes ?? []).length,
      landscape: get().floor().landscape.length,
      sketches: (get().floor().sketches ?? []).length,
      roof: get().floor().roof?.styleId ?? null,
    },
  }, null, 2),
}));
