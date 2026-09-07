/**
 * Student texture imports — IndexedDB blobs only (never inline in .archworks.json).
 * Soft max ≤512px; reject oversize with a clear message.
 * See SILLY-TEXTURES.md · SCHEMA.md imageBlobRef.
 */
import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'archworks-blobs';
const STORE = 'blobs';
const DB_VERSION = 1;

/** Soft max edge — Chromebook / phone tile cap. */
export const TEXTURE_MAX_PX = 512;
/** Soft max file bytes (~750KB) — lean IDB. */
export const TEXTURE_MAX_BYTES = 750_000;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      },
    });
  }
  return dbPromise;
}

export function newBlobRef(): string {
  return `tex_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function putTextureBlob(ref: string, blob: Blob): Promise<void> {
  const db = await getDb();
  await db.put(STORE, blob, ref);
}

export async function getTextureBlob(ref: string): Promise<Blob | undefined> {
  const db = await getDb();
  return (await db.get(STORE, ref)) as Blob | undefined;
}

export async function deleteTextureBlob(ref: string | null | undefined): Promise<void> {
  if (!ref) return;
  try {
    const db = await getDb();
    await db.delete(STORE, ref);
  } catch {
    /* ignore missing */
  }
}

export type TextureImportOk = {
  ok: true;
  blob: Blob;
  width: number;
  height: number;
  label: string;
};

export type TextureImportErr = {
  ok: false;
  message: string;
};

export type TextureImportResult = TextureImportOk | TextureImportErr;

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read that image'));
    };
    img.src = url;
  });
}

/**
 * Validate student import: image only, ≤512px each edge, soft byte cap.
 * Does not downscale — reject with a clear classroom-friendly message.
 */
export async function prepareTextureImport(file: File): Promise<TextureImportResult> {
  if (!file.type.startsWith('image/')) {
    return { ok: false, message: 'Pick an image file (PNG, JPEG, WebP…).' };
  }
  if (file.size > TEXTURE_MAX_BYTES) {
    return {
      ok: false,
      message: `Image is too large (${Math.round(file.size / 1024)}KB). Keep under ~${Math.round(TEXTURE_MAX_BYTES / 1024)}KB for Chromebooks.`,
    };
  }
  let img: HTMLImageElement;
  try {
    img = await loadImageFromFile(file);
  } catch {
    return { ok: false, message: 'Could not read that image. Try another file.' };
  }
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  if (w > TEXTURE_MAX_PX || h > TEXTURE_MAX_PX) {
    return {
      ok: false,
      message: `Image is ${w}×${h}px. Resize to ${TEXTURE_MAX_PX}×${TEXTURE_MAX_PX}px or smaller, then import again.`,
    };
  }
  if (w < 1 || h < 1) {
    return { ok: false, message: 'That image has no pixels — try another file.' };
  }
  const label = file.name.replace(/\.[^.]+$/, '') || 'Imported image';
  return { ok: true, blob: file, width: w, height: h, label };
}
