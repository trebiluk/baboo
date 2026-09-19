import { openDB, type IDBPDatabase } from 'idb';
import type { ProjectDocument, RoofStyleId } from '../types';
import { isGuiThemeId } from '../data/themes';
import { isSkillLevel, readSkillPref } from '../data/skill';
import { asShowFurniture3d, asSite, asSky, asTint } from '../data/scene3d';
import { asFloorFinish, asFloorGrain } from '../data/flooring';
import { asLocale } from '../data/i18n';
import { asWallHeightFt } from './wallDraft';
import { mergeChunk, type DirtyChunk } from './tiles';
import { asDollProj, asYawDeg } from './iso';
import { APP_VERSION } from '../version';
import { blankProject } from '../data/templates';
import { defaultTinyHomeTypology } from '../data/typology';
import { generateRoof, roofDefaultForStyle, roofStyleName } from './roof';

const DB_NAME = 'archworks';
const STORE = 'projects';
const CHUNK_STORE = 'dirtyChunks';
const KEY = 'current';
const DB_VERSION = 2;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
        if (!db.objectStoreNames.contains(CHUNK_STORE)) db.createObjectStore(CHUNK_STORE);
      },
    });
  }
  return dbPromise;
}

function normalizeDoc(data: ProjectDocument): ProjectDocument {
  const base = blankProject(data.meta?.title || 'Imported Plan');
  const styleId = data.meta?.styleId ?? data.settings?.styleId ?? base.settings.styleId;
  let roofStyleId = (data.settings as { roofStyleId?: RoofStyleId | null })?.roofStyleId;
  if (roofStyleId === undefined) {
    // migrate old roofKind if present
    const legacy = data.settings as { roofKind?: string };
    const map: Record<string, RoofStyleId | null> = {
      none: null,
      flat: 'flat',
      gable: 'gable',
      'low-gable': 'gable',
      pediment: 'gable',
      hip: 'hip',
      curved: 'grass',
      grass: 'grass',
      gambrel: 'gambrel',
      shed: 'shed',
      mansard: 'mansard',
      conical: 'conical',
    };
    if (legacy.roofKind && legacy.roofKind in map) roofStyleId = map[legacy.roofKind];
    else roofStyleId = roofDefaultForStyle(styleId);
  }

  const floors = (data.floors ?? base.floors).map((f) => {
    const layers = {
      ...(f.layers ?? {}),
      structure: f.layers?.structure ?? true,
      openings: f.layers?.openings ?? true,
      furniture: f.layers?.furniture ?? true,
      rooms: f.layers?.rooms ?? true,
      dims: f.layers?.dims ?? true,
      landscape: f.layers?.landscape ?? false,
      sketch: f.layers?.sketch ?? true,
      roof: f.layers?.roof ?? true,
    };
    let roof = f.roof ?? null;
    if (!roof && roofStyleId) {
      roof = generateRoof(f.nodes ?? [], f.walls ?? [], roofStyleId, asWallHeightFt(data.settings?.wallHeight));
    }
    return {
      ...f,
      rooms: Array.isArray(f.rooms) ? f.rooms : [],
      dimensions: Array.isArray(f.dimensions) ? f.dimensions : [],
      notes: Array.isArray(f.notes) ? f.notes : [],
      landscape: Array.isArray(f.landscape) ? f.landscape : [],
      sketches: Array.isArray((f as { sketches?: unknown }).sketches)
        ? (f as { sketches: { id: string; points: number[] }[] }).sketches.filter(
          (s) => s && typeof s.id === 'string' && Array.isArray(s.points) && s.points.length >= 4 && s.points.length % 2 === 0,
        )
        : [],
      roof,
      layers,
    };
  });

  return {
    ...base,
    ...data,
    meta: {
      ...base.meta,
      ...data.meta,
      version: APP_VERSION,
      updatedAt: new Date().toISOString(),
      styleId,
    },
    settings: (() => {
      const merged = {
        ...base.settings,
        ...data.settings,
        styleId,
        roofStyleId: roofStyleId ?? null,
        roofLabel: (data.settings as { roofLabel?: string })?.roofLabel
          ?? (roofStyleId ? roofStyleName(roofStyleId) : ''),
        showRoof: data.settings?.showRoof !== false,
        textureId: data.settings?.textureId ?? null,
        textureLabel: data.settings?.textureLabel ?? '',
        imageBlobRef: data.settings?.imageBlobRef ?? null,
        ortho: data.settings?.ortho !== false,
        osnap: (data.settings as { osnap?: unknown })?.osnap !== false,
        wallHeight: asWallHeightFt((data.settings as { wallHeight?: unknown })?.wallHeight),
        guiTheme: isGuiThemeId(data.settings?.guiTheme)
          ? data.settings.guiTheme
          : 'stark',
        skillLevel: isSkillLevel(data.settings?.skillLevel)
          ? data.settings.skillLevel
          : readSkillPref(),
        skyPreset: asSky(data.settings?.skyPreset),
        siteFinish: asSite(data.settings?.siteFinish),
        wallTintId: asTint(data.settings?.wallTintId),
        floorFinishId: asFloorFinish(data.settings?.floorFinishId),
        floorGrain: asFloorGrain(data.settings?.floorGrain),
        showFurniture3d: asShowFurniture3d(data.settings?.showFurniture3d),
        dollProj: asDollProj(data.settings?.dollProj),
        dollYaw: asYawDeg(data.settings?.dollYaw),
        dollTop: data.settings?.dollTop === true,
        locale: asLocale(data.settings?.locale),
        tipsLocale: asLocale(
          (data.settings as { tipsLocale?: unknown })?.tipsLocale ?? data.settings?.locale,
        ),
        udlFat: data.settings?.udlFat === true,
        udlType: data.settings?.udlType === true,
        udlContrast: data.settings?.udlContrast === true,
        ellEnglish: data.settings?.ellEnglish !== false,
      };
      const typology =
        data.settings?.typology
        ?? (styleId === 'tiny-home' ? defaultTinyHomeTypology('trailer') : undefined);
      if (typology) merged.typology = typology;
      else delete merged.typology;
      return merged;
    })(),
    floors,
  };
}

export async function loadProject(): Promise<ProjectDocument | null> {
  try {
    const raw = await Promise.race([
      (async () => {
        const db = await getDb();
        return ((await db.get(STORE, KEY)) as ProjectDocument) ?? null;
      })(),
      new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), 2500);
      }),
    ]);
    if (!raw) return null;
    const leftovers = await loadDirtyChunks();
    const doc = normalizeDoc(raw);
    if (!leftovers.length) return doc;
    return {
      ...doc,
      floors: doc.floors.map((f) => leftovers.filter((c) => c.floorId === f.id).reduce(mergeChunk, f)),
    };
  } catch {
    return null;
  }
}

export async function saveProject(doc: ProjectDocument): Promise<void> {
  const db = await getDb();
  const payload: ProjectDocument = {
    ...doc,
    meta: { ...doc.meta, version: APP_VERSION, updatedAt: new Date().toISOString() },
  };
  await db.put(STORE, payload, KEY);
  await clearDirtyChunks();
}

export async function saveDirtyChunks(chunks: DirtyChunk[]): Promise<void> {
  if (!chunks.length) return;
  const db = await getDb();
  const tx = db.transaction(CHUNK_STORE, 'readwrite');
  for (const chunk of chunks) {
    await tx.store.put(chunk, chunk.key);
  }
  await tx.done;
}

export async function loadDirtyChunks(): Promise<DirtyChunk[]> {
  try {
    const db = await getDb();
    if (!db.objectStoreNames.contains(CHUNK_STORE)) return [];
    return ((await db.getAll(CHUNK_STORE)) as DirtyChunk[]) ?? [];
  } catch {
    return [];
  }
}

export async function clearDirtyChunks(): Promise<void> {
  try {
    const db = await getDb();
    if (!db.objectStoreNames.contains(CHUNK_STORE)) return;
    await db.clear(CHUNK_STORE);
  } catch {
    /* ignore */
  }
}

export function exportProjectFile(doc: ProjectDocument): void {
  const payload = {
    ...doc,
    meta: { ...doc.meta, version: APP_VERSION, updatedAt: new Date().toISOString() },
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safe = payload.meta.title.replace(/[^\w\- ]+/g, '').trim() || 'project';
  a.download = `${safe}.archworks.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importProjectFile(file: File): Promise<ProjectDocument> {
  const data = JSON.parse(await file.text()) as ProjectDocument;
  if (!data?.floors || !Array.isArray(data.floors)) {
    throw new Error('Invalid ArchWorks project file');
  }
  return normalizeDoc(data);
}
