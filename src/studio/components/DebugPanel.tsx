import { useEffect, useMemo, useState } from 'react';
import { APP_RELEASE_DATE, APP_VERSION } from '../version';
import { CHANGELOG_ENTRIES, recentChangelog } from '../data/changelog';
import { useDebugStore, installGlobalErrorTraps } from '../store/useDebugStore';
import { useProjectStore } from '../store/useProjectStore';
import { skillInfo, DEFAULT_SKILL_LEVEL } from '../data/skill';

type TeacherTab = 'version' | 'changelog' | 'debug';

/** Teacher panel — Version · What’s new · Debug. Open via version chip (long-press), Alt+D, or More. */
export function DebugPanel() {
  const open = useProjectStore((s) => s.debugOpen);
  const toggle = useProjectStore((s) => s.toggleDebug);
  const toggleChangelog = useProjectStore((s) => s.toggleChangelog);
  const doc = useProjectStore((s) => s.doc);
  const tool = useProjectStore((s) => s.tool);
  const selected = useProjectStore((s) => s.selected);
  const saveStatus = useProjectStore((s) => s.saveStatus);
  const lastSaveAt = useProjectStore((s) => s.lastSaveAt);
  const viewMode = useProjectStore((s) => s.viewMode);
  const floor = useProjectStore((s) => s.floor);
  const showToast = useProjectStore((s) => s.showToast);
  const debugJson = useProjectStore((s) => s.debugJson);
  const seedCrowd = useProjectStore((s) => s.seedCrowd);
  const [tab, setTab] = useState<TeacherTab>('version');

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
  const skill = doc.settings.skillLevel ?? DEFAULT_SKILL_LEVEL;
  const counts = useMemo(
    () => ({
      nodes: f.nodes.length,
      walls: f.walls.length,
      openings: f.openings.length,
      furniture: f.furniture.length,
      rooms: (f.rooms ?? []).length,
      notes: (f.notes ?? []).length,
      dims: (f.dimensions ?? []).length,
      landscape: (f.landscape ?? []).length,
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
      console.info('[baboo debug bundle]', text);
    }
  };

  return (
    <aside className="drawer debug-drawer" aria-label="Teacher panel">
      <div className="drawer-head">
        <h2>Teacher</h2>
        <button type="button" className="ghost-btn aw-pressable" onClick={toggle}>
          Close
        </button>
      </div>

      <div className="teacher-tabs" role="tablist" aria-label="Teacher sections">
        {([
          ['version', 'Version'],
          ['changelog', "What's new"],
          ['debug', 'Debug'],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={`teacher-tab aw-pressable${tab === id ? ' active' : ''}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'version' && (
        <section className="teacher-pane" aria-label="Version">
          <p className="teacher-version">
            Baboo <strong>v{APP_VERSION}</strong>
            <span className="muted"> · {APP_RELEASE_DATE}</span>
          </p>
          <dl className="debug-meta">
            <div>
              <dt>This plan</dt>
              <dd>{doc.meta.title || 'Untitled'}</dd>
            </div>
            <div>
              <dt>Plan file</dt>
              <dd>
                {doc.meta.version ?? '—'}
                {versionWarn ? ' · older than app' : ''}
              </dd>
            </div>
            <div>
              <dt>Skill</dt>
              <dd>{skillInfo(skill).label}</dd>
            </div>
            <div>
              <dt>View</dt>
              <dd>{viewMode === 'plan' ? '2D Plan' : '3D View'}</dd>
            </div>
            <div>
              <dt>Save</dt>
              <dd>
                {saveStatus} · {savedAt ? new Date(savedAt).toLocaleString() : 'not yet'}
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
              <dt>On the plan</dt>
              <dd>
                {counts.walls} walls · {counts.openings} openings · {counts.rooms} rooms · {counts.furniture} furniture
              </dd>
            </div>
          </dl>
          <p className="muted" style={{ marginTop: 12 }}>
            Latest: {recentChangelog(1)[0] ?? '—'}
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
            <button type="button" className="ghost-btn aw-pressable" onClick={() => setTab('changelog')}>
              What's new
            </button>
            <button type="button" className="ghost-btn aw-pressable" onClick={() => { toggle(); toggleChangelog(); }}>
              Full changelog
            </button>
          </div>
        </section>
      )}

      {tab === 'changelog' && (
        <section className="teacher-pane changelog-pane" aria-label="What's new">
          {CHANGELOG_ENTRIES.slice(0, 8).map((n) => (
            <article key={n.version} className="change-block">
              <h3>
                {n.version} <span className="muted">{n.date}</span>
              </h3>
              <ul>
                {n.bullets.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>
      )}

      {tab === 'debug' && (
        <section className="teacher-pane" aria-label="Debug">
          <button type="button" className="primary-btn aw-pressable" onClick={() => void copyBundle()}>
            Copy debug bundle
          </button>
          <button type="button" className="ghost-btn aw-pressable" style={{ marginTop: 6 }} onClick={() => void refreshIdb()}>
            Re-ping IDB
          </button>

          <div style={{ marginTop: 14 }}>
            <strong>Crowd test</strong>
            <p className="muted" style={{ margin: '4px 0 8px' }}>
              Scatter furniture and watch the fps chip. Undo clears it.
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {([80, 250, 800] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  className="ghost-btn aw-pressable"
                  onClick={() => seedCrowd(n)}
                >
                  {n} pieces
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <strong>Selection</strong>
            <pre className="debug-pre">{JSON.stringify(selected, null, 2)}</pre>
          </div>

          <div style={{ marginTop: 12 }}>
            <strong>Last error</strong>
            <pre className="debug-pre">{lastError ?? '—'}</pre>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button type="button" className="ghost-btn aw-pressable" onClick={clearLastError}>
                Clear
              </button>
              <button
                type="button"
                className="ghost-btn aw-pressable"
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
          <p className="muted" style={{ fontSize: 12, margin: '8px 0 0' }}>Alt+D · Ctrl+Shift+D · long-press version</p>
        </section>
      )}
    </aside>
  );
}