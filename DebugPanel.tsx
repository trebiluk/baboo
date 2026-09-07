import { useEffect, useMemo, type CSSProperties } from 'react';
import { APP_VERSION } from '../version';
import { recentChangelog } from '../data/changelog';
import { useDebugStore, installGlobalErrorTraps } from '../store/useDebugStore';
import { useProjectStore } from '../store/useProjectStore';

/** Teacher debug panel — open via Chrome "Dbg" (project store) or Alt+D / ?debug=1 */
export function DebugPanel() {
  const open = useProjectStore((s) => s.debugOpen);
  const toggle = useProjectStore((s) => s.toggleDebug);
  const doc = useProjectStore((s) => s.doc);
  const tool = useProjectStore((s) => s.tool);
  const selected = useProjectStore((s) => s.selected);
  const saveStatus = useProjectStore((s) => s.saveStatus);
  const lastSaveAt = useProjectStore((s) => s.lastSaveAt);
  const viewMode = useProjectStore((s) => s.viewMode);
  const floor = useProjectStore((s) => s.floor);
  const showToast = useProjectStore((s) => s.showToast);
  const debugJson = useProjectStore((s) => s.debugJson);

  const lastError = useDebugStore((s) => s.lastError);
  const showNodeIds = useDebugStore((s) => s.showNodeIds);
  const showHitboxes = useDebugStore((s) => s.showHitboxes);
  const idbStatus = useDebugStore((s) => s.idbStatus);
  const idbDetail = useDebugStore((s) => s.idbDetail);
  const refreshIdb = useDebugStore((s) => s.refreshIdb);
  const clearLastError = useDebugStore((s) => s.clearLastError);
  const recreateLastError = useDebugStore((s) => s.recreateLastError);
  const setShowNodeIds = useDebugStore((s) => s.setShowNodeIds);
  const setShowHitboxes = useDebugStore((s) => s.setShowHitboxes);
  const setEnabled = useDebugStore((s) => s.setEnabled);
  const lastAutosaveAtDbg = useDebugStore((s) => s.lastAutosaveAt);

  const f = floor();
  const counts = useMemo(
    () => ({
      nodes: f.nodes.length,
      walls: f.walls.length,
      openings: f.openings.length,
      furniture: f.furniture.length,
      landscape: f.landscape.length,
    }),
    [f],
  );

  useEffect(() => {
    installGlobalErrorTraps();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        toggle();
      }
      if (e.altKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        toggle();
        setEnabled(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle, setEnabled]);

  useEffect(() => {
    if (open) void refreshIdb();
  }, [open, refreshIdb]);

  if (!open) return null;

  const savedAt = lastSaveAt ?? lastAutosaveAtDbg;
  const versionWarn = doc.meta.version && doc.meta.version !== APP_VERSION;

  const bundle = {
    appVersion: APP_VERSION,
    docVersion: doc.meta.version,
    title: doc.meta.title,
    savedAt,
    saveStatus,
    idb: idbStatus,
    idbDetail,
    viewMode,
    renderTier: doc.settings.renderTier,
    tool,
    counts,
    selected,
    lastError,
    scaffoldDebugJson: (() => {
      try {
        return JSON.parse(debugJson()) as unknown;
      } catch {
        return null;
      }
    })(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    exportedAt: new Date().toISOString(),
  };

  const copyBundle = async () => {
    const text = JSON.stringify(bundle, null, 2);
    try {
      await navigator.clipboard.writeText(text);
      showToast('Debug bundle copied');
    } catch {
      showToast('Copy failed');
      console.info('[archworks debug bundle]', text);
    }
  };

  return (
    <aside className="drawer debug-drawer" aria-label="ArchWorks debug panel">
      <div className="drawer-head">
        <h2>Teacher / Debug</h2>
        <button type="button" className="ghost-btn" onClick={toggle}>
          Close
        </button>
      </div>

      <dl className="debug-meta">
        <div>
          <dt>Version</dt>
          <dd>
            v{APP_VERSION}
            {versionWarn ? ` (doc ${doc.meta.version})` : ''}
          </dd>
        </div>
        <div>
          <dt>Save</dt>
          <dd>
            {saveStatus} · {savedAt ? new Date(savedAt).toLocaleString() : '—'}
          </dd>
        </div>
        <div>
          <dt>IndexedDB</dt>
          <dd>
            {idbStatus}
            {idbDetail ? ` (${idbDetail})` : ''}
          </dd>
        </div>
        <div>
          <dt>Counts</dt>
          <dd>
            n{counts.nodes} w{counts.walls} o{counts.openings} f{counts.furniture} L
            {counts.landscape}
          </dd>
        </div>
      </dl>

      <button type="button" className="primary-btn" onClick={() => void copyBundle()}>
        Copy debug bundle
      </button>
      <button type="button" className="ghost-btn" style={{ marginTop: 6 }} onClick={() => void refreshIdb()}>
        Re-ping IDB
      </button>

      <div style={{ marginTop: 12 }}>
        <strong>Selection</strong>
        <pre className="debug-pre">{JSON.stringify(selected, null, 2)}</pre>
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>Last error</strong>
        <pre className="debug-pre">{lastError ?? '—'}</pre>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button type="button" className="ghost-btn" onClick={clearLastError}>
            Clear
          </button>
          <button
            type="button"
            className="ghost-btn"
            onClick={() => {
              try {
                recreateLastError();
              } catch (e) {
                showToast(e instanceof Error ? e.message : 'Recreated');
              }
            }}
          >
            Recreate
          </button>
        </div>
      </div>

      <label className="field check" style={{ marginTop: 12 }}>
        <input type="checkbox" checked={showNodeIds} onChange={(e) => setShowNodeIds(e.target.checked)} />
        <span>Show node IDs overlay</span>
      </label>
      <label className="field check">
        <input type="checkbox" checked={showHitboxes} onChange={(e) => setShowHitboxes(e.target.checked)} />
        <span>Show hitboxes overlay</span>
      </label>
      <p style={{ fontSize: 11, opacity: 0.6, margin: '4px 0 0' }}>
        Overlays draw on PlanCanvas when toggled (flags in useDebugStore).
      </p>

      <div style={{ marginTop: 12 }}>
        <strong>Recent changes</strong>
        <ul style={{ margin: '6px 0 0', paddingLeft: 18 }}>
          {recentChangelog(5).map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>

      <p style={{ fontSize: 11, opacity: 0.55, marginTop: 12 }}>Alt+D · Ctrl+Shift+D · Chrome Dbg</p>
    </aside>
  );
}

// keep type import used for future inline styles
void (0 as unknown as CSSProperties);
