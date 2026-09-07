import { create } from 'zustand';
import type { IdbStatus } from '../lib/idbPing';
import { pingIndexedDb } from '../lib/idbPing';
import { isDebugEnabled, setDebugEnabled } from '../lib/debugFlag';

interface DebugState {
  debugOpen: boolean;
  lastAutosaveAt: string | null;
  lastError: string | null;
  lastErrorRepro: string | null;
  showNodeIds: boolean;
  showHitboxes: boolean;
  idbStatus: IdbStatus;
  idbDetail: string | null;
  enabled: boolean;
  setEnabled: (on: boolean) => void;
  refreshEnabled: () => void;
  toggleDebug: () => void;
  openDebug: (open: boolean) => void;
  setLastAutosaveAt: (iso: string | null) => void;
  setLastError: (msg: string | null, repro?: string | null) => void;
  clearLastError: () => void;
  recreateLastError: () => void;
  setShowNodeIds: (v: boolean) => void;
  setShowHitboxes: (v: boolean) => void;
  refreshIdb: () => Promise<void>;
}

export const useDebugStore = create<DebugState>((set, get) => ({
  debugOpen: false,
  lastAutosaveAt: null,
  lastError: null,
  lastErrorRepro: null,
  showNodeIds: false,
  showHitboxes: false,
  idbStatus: 'unavailable',
  idbDetail: null,
  enabled: typeof window !== 'undefined' ? isDebugEnabled() : false,

  setEnabled: (on) => {
    setDebugEnabled(on);
    set({ enabled: on, debugOpen: on ? get().debugOpen : false });
  },
  refreshEnabled: () => set({ enabled: isDebugEnabled() }),
  toggleDebug: () => {
    if (!get().enabled && !isDebugEnabled()) {
      setDebugEnabled(true);
      set({ enabled: true, debugOpen: true });
      return;
    }
    set((s) => ({ debugOpen: !s.debugOpen, enabled: true }));
  },
  openDebug: (debugOpen) => set({ debugOpen }),
  setLastAutosaveAt: (lastAutosaveAt) => set({ lastAutosaveAt }),
  setLastError: (lastError, repro = null) => set({ lastError, lastErrorRepro: repro ?? null }),
  clearLastError: () => set({ lastError: null, lastErrorRepro: null }),
  recreateLastError: () => {
    const tag = get().lastErrorRepro || get().lastError;
    if (!tag) return;
    throw new Error(`Recreated: ${tag}`);
  },
  setShowNodeIds: (showNodeIds) => set({ showNodeIds }),
  setShowHitboxes: (showHitboxes) => set({ showHitboxes }),
  refreshIdb: async () => {
    const r = await pingIndexedDb();
    set({ idbStatus: r.status, idbDetail: r.detail ?? null });
  },
}));

/** Call from autosave success paths */
export function noteAutosaveSuccess(): void {
  useDebugStore.getState().setLastAutosaveAt(new Date().toISOString());
}

/** Install once from app root */
export function installGlobalErrorTraps(): void {
  if (typeof window === 'undefined') return;
  const w = window as Window & { __archworksErrTraps?: boolean };
  if (w.__archworksErrTraps) return;
  w.__archworksErrTraps = true;
  window.addEventListener('error', (ev) => {
    useDebugStore.getState().setLastError(String(ev.message || ev.error || 'error').slice(0, 500));
  });
  window.addEventListener('unhandledrejection', (ev) => {
    const msg = ev.reason instanceof Error ? ev.reason.message : String(ev.reason);
    useDebugStore.getState().setLastError(msg.slice(0, 500));
  });
}
