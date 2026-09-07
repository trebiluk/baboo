import { create } from 'zustand';
import type {
  Floor, FurnitureItem, Opening, ProjectDocument, ProjectSettings,
  SaveStatus, StyleId, Tool, ViewMode, RenderTier, Point, Wall, RoofStyleId,
  TypologyShell,
} from '../types';
import { blankProject, buildTemplateProject } from '../data/templates';
import { APP_VERSION } from '../version';
import { FURNITURE_CATALOG } from '../data/furniture';
import {
  findOrCreateNode, hitFurniture, hitOpening, hitWall, nearestWall,
  snapPoint, uid,
} from '../lib/geometry';
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
import { exportProjectFile, importProjectFile, loadProject, saveProject } from '../lib/storage';
import { exportGalleryCardFile, type GalleryCardOptions } from '../lib/galleryExport';
import { noteAutosaveSuccess } from './useDebugStore';

const MAX_UNDO = 40;

type Sel =
  | { kind: 'wall'; id: string }
  | { kind: 'opening'; id: string }
  | { kind: 'furniture'; id: string }
  | null;

interface Store {
  doc: ProjectDocument;
  past: ProjectDocument[];
  future: ProjectDocument[];
  tool: Tool;
  selected: Sel;
  selectedCatalogId: string | null;
  teachingOpen: boolean;
  customizeOpen: boolean;
  helpOpen: boolean;
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
  saveStatus: SaveStatus;
  toast: string | null;
  lastSaveAt: string | null;
  floor: () => Floor;
  init: () => Promise<void>;
  setTool: (t: Tool) => void;
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
  toggleCustomize: () => void;
  toggleHelp: () => void;
  toggleDebug: () => void;
  toggleChangelog: () => void;
  toggleDemo: () => void;
  openNewProject: (open: boolean) => void;
  openDriveWizard: (open: boolean) => void;
  selectCatalog: (id: string | null) => void;
  showToast: (msg: string, ms?: number) => void;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  markDirty: () => void;
  autosave: () => Promise<void>;
  newFromTemplate: (styleId: StyleId) => void;
  exportJson: () => void;
  exportGalleryCard: (opts?: GalleryCardOptions) => void;
  importJson: (file: File) => Promise<void>;
  clearSelection: () => void;
  deleteSelected: () => void;
  beginWall: (p: Point) => void;
  finishWall: (p: Point) => void;
  cancelWallDraft: () => void;
  placeOpening: (type: 'door' | 'window', p: Point) => void;
  placeFurniture: (p: Point) => void;
  selectAt: (p: Point) => void;
  moveSelected: (dx: number, dy: number) => void;
  endMove: () => void;
  debugJson: () => string;
}

function cloneDoc(d: ProjectDocument): ProjectDocument {
  return JSON.parse(JSON.stringify(d)) as ProjectDocument;
}

function withFloor(doc: ProjectDocument, fn: (f: Floor) => Floor): ProjectDocument {
  return { ...doc, floors: doc.floors.map((f, i) => (i === 0 ? fn(f) : f)) };
}


function refreshRoof(f: Floor, roofStyleId: RoofStyleId | null): Floor {
  return { ...f, roof: generateRoof(f.nodes, f.walls, roofStyleId) };
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;
let toastTimer: ReturnType<typeof setTimeout> | null = null;
let moving = false;

export const useProjectStore = create<Store>((set, get) => ({
  doc: blankProject(),
  past: [],
  future: [],
  tool: 'select',
  selected: null,
  selectedCatalogId: null,
  // Desktop default-open; phone/PWA ≤640 collapsed so sheet does not cover plan/chrome
  teachingOpen: typeof window !== 'undefined' && window.matchMedia('(min-width: 641px)').matches,
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
      });
    } else {
      set({ newProjectOpen: true, saveStatus: 'saved' });
    }
  },

  setTool: (tool) => set({ tool, wallDraft: null }),
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
  setPanZoom: (panX, panY, zoom) => set((s) => ({ panX, panY, zoom: zoom ?? s.zoom })),
  toggleTeaching: () => set((s) => ({ teachingOpen: !s.teachingOpen })),
  toggleCustomize: () => set((s) => ({ customizeOpen: !s.customizeOpen })),
  toggleHelp: () => set((s) => ({ helpOpen: !s.helpOpen })),
  toggleDebug: () => set((s) => ({ debugOpen: !s.debugOpen })),
  toggleChangelog: () => set((s) => ({ changelogOpen: !s.changelogOpen })),
  toggleDemo: () => set((s) => ({ demoMode: !s.demoMode })),
  openNewProject: (newProjectOpen) => set({ newProjectOpen }),
  openDriveWizard: (driveWizardOpen) => set({ driveWizardOpen }),
  selectCatalog: (selectedCatalogId) =>
    set({ selectedCatalogId, tool: selectedCatalogId ? 'furniture' : get().tool }),
  showToast: (toast, ms = 2400) => {
    if (toastTimer) clearTimeout(toastTimer);
    set({ toast });
    toastTimer = setTimeout(() => {
      toastTimer = null;
      set({ toast: null });
    }, ms);
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

  markDirty: () => {
    set({ saveStatus: 'unsaved' });
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { void get().autosave(); }, 500);
  },
  autosave: async () => {
    set({ saveStatus: 'saving' });
    try {
      await saveProject(get().doc);
      const ts = new Date().toISOString();
      noteAutosaveSuccess();
      const doc = get().doc;
      set({
        saveStatus: 'saved',
        lastSaveAt: ts,
        doc: { ...doc, meta: { ...doc.meta, version: APP_VERSION, updatedAt: ts } },
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
    const doc = buildTemplateProject(styleId);
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
    });
    get().markDirty();
    get().showToast(`Started: ${doc.meta.title}`);
  },
  exportJson: () => {
    exportProjectFile(get().doc);
    get().showToast('Plan saved as a file for class');
  },
  exportGalleryCard: (opts) => {
    exportGalleryCardFile(get().doc, opts);
    get().showToast('Class card ready — no last name');
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
      get().showToast('Project imported');
    } catch {
      get().showToast('Import failed');
    }
  },

  clearSelection: () => set({ selected: null }),
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
      return { ...f, furniture: f.furniture.filter((x) => x.id !== selected.id) };
    });
    set({ doc: next, selected: null });
    get().markDirty();
  },

  beginWall: (p) => {
    const s = get().doc.settings;
    set({ wallDraft: snapPoint(p, s.gridSize, s.snap) });
  },
  finishWall: (p) => {
    const { wallDraft, doc } = get();
    if (!wallDraft) return;
    const s = doc.settings;
    const endPt = snapPoint(p, s.gridSize, s.snap);
    if (Math.hypot(endPt.x - wallDraft.x, endPt.y - wallDraft.y) < 0.5) {
      set({ wallDraft: null });
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
        const wall: Wall = {
          id: uid('w'), a: aRes.id, b: bRes.id, kind: 'exterior', thickness: 0.5,
        };
        const next = { ...f, nodes, walls: [...f.walls, wall] };
        return refreshRoof(next, get().doc.settings.roofStyleId ?? null);
      }),
      wallDraft: null,
    });
    get().markDirty();
  },
  cancelWallDraft: () => set({ wallDraft: null }),

  placeOpening: (type, p) => {
    const floor = get().floor();
    const hit = nearestWall(floor.walls, floor.nodes, p, 1.5);
    if (!hit) {
      get().showToast('Click closer to a wall', 3200);
      return;
    }
    get().pushHistory();
    const opening: Opening = {
      id: uid('o'),
      wallId: hit.wall.id,
      t: hit.t,
      width: type === 'door' ? 3 : 3.5,
      type,
      symbolKind: type === 'door' ? 'swingDoor' : 'windowFixed',
      swing: 'left',
    };
    set({
      doc: withFloor(get().doc, (f) => ({ ...f, openings: [...f.openings, opening] })),
      selected: { kind: 'opening', id: opening.id },
    });
    get().markDirty();
    get().showToast(type === 'door' ? 'Door placed' : 'Window placed', 1800);
  },

  placeFurniture: (p) => {
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
    get().markDirty();
    get().showToast('Switched to Select — click to move', 2800);
  },

  selectAt: (p) => {
    const f = get().floor();
    const fid = hitFurniture(f.furniture, p);
    if (fid) { set({ selected: { kind: 'furniture', id: fid } }); return; }
    const oid = hitOpening(f.openings, f.walls, f.nodes, p);
    if (oid) { set({ selected: { kind: 'opening', id: oid } }); return; }
    const wid = hitWall(f.walls, f.nodes, p);
    if (wid) { set({ selected: { kind: 'wall', id: wid } }); return; }
    set({ selected: null });
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
      } else if (selected?.kind === 'wall' && s.roofStyleId) {
        set({
          doc: withFloor(get().doc, (f) => refreshRoof(f, s.roofStyleId)),
        });
      }
      get().markDirty();
    }
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
      landscape: get().floor().landscape.length,
      roof: get().floor().roof?.styleId ?? null,
    },
  }, null, 2),
}));
