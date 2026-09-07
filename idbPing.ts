import { openDB } from 'idb';

export type IdbStatus = 'ok' | 'unavailable' | 'error';

export async function pingIndexedDb(): Promise<{ status: IdbStatus; detail?: string }> {
  try {
    if (typeof indexedDB === 'undefined') return { status: 'unavailable', detail: 'no indexedDB' };
    const db = await openDB('archworks', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('projects')) db.createObjectStore('projects');
      },
    });
    await db.get('projects', 'current');
    return { status: 'ok' };
  } catch (e) {
    return { status: 'error', detail: e instanceof Error ? e.message : String(e) };
  }
}
