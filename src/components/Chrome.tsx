import { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { APP_VERSION } from '../version';
import { COPYRIGHT_LINE } from './HelpModal';
import type { Tool } from '../types';

const TOOLS: { id: Tool; label: string; tip?: string }[] = [
  { id: 'select', label: 'Select', tip: 'Click something to move it' },
  { id: 'wall', label: 'Wall', tip: 'Click start, then click end' },
  { id: 'door', label: 'Door', tip: 'Click on a wall' },
  { id: 'window', label: 'Window', tip: 'Click on a wall' },
  { id: 'furniture', label: 'Furniture', tip: 'Pick an item, then click the plan' },
  { id: 'pan', label: 'Pan', tip: 'Drag to move the view' },
];

/** Edit tools hidden in 3D (view-only). Select stays so chrome does not look empty. */
const HIDDEN_IN_3D: Tool[] = ['wall', 'door', 'window', 'furniture', 'pan'];


export function Chrome() {
  const tool = useProjectStore((s) => s.tool);
  const setTool = useProjectStore((s) => s.setTool);
  const title = useProjectStore((s) => s.doc.meta.title);
  const setTitle = useProjectStore((s) => s.setTitle);
  const saveStatus = useProjectStore((s) => s.saveStatus);
  const undo = useProjectStore((s) => s.undo);
  const redo = useProjectStore((s) => s.redo);
  const exportJson = useProjectStore((s) => s.exportJson);
  const exportGalleryCard = useProjectStore((s) => s.exportGalleryCard);
  const importJson = useProjectStore((s) => s.importJson);
  const openNewProject = useProjectStore((s) => s.openNewProject);
  const toggleCustomize = useProjectStore((s) => s.toggleCustomize);
  const toggleTeaching = useProjectStore((s) => s.toggleTeaching);
  const toggleHelp = useProjectStore((s) => s.toggleHelp);
  const toggleDebug = useProjectStore((s) => s.toggleDebug);
  const toggleChangelog = useProjectStore((s) => s.toggleChangelog);
  const openDriveWizard = useProjectStore((s) => s.openDriveWizard);
  const setViewMode = useProjectStore((s) => s.setViewMode);
  const setRenderTier = useProjectStore((s) => s.setRenderTier);
  const viewMode = useProjectStore((s) => s.viewMode);
  const teachingOpen = useProjectStore((s) => s.teachingOpen);
  const fileRef = useRef<HTMLInputElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [teacherChrome, setTeacherChrome] = useState(false);

  useEffect(() => {
    if (!moreOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onKey);
    };
  }, [moreOpen]);

  // Teacher gate: ?teacher=1 or localStorage, Alt+D still works via DebugPanel
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      if (q.get('teacher') === '1' || localStorage.getItem('baboo-teacher') === '1') {
        setTeacherChrome(true);
      }
    } catch { /* ignore */ }
  }, []);

  const statusLabel =
    saveStatus === 'saved' ? 'Saved' :
    saveStatus === 'saving' ? 'Saving…' :
    saveStatus === 'unsaved' ? 'Unsaved' : 'Save error';

  const runAndClose = (fn: () => void) => () => {
    setMoreOpen(false);
    fn();
  };

  const clearPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const onVerPointerDown = () => {
    clearPress();
    pressTimer.current = setTimeout(() => {
      try { localStorage.setItem('baboo-teacher', '1'); } catch { /* ignore */ }
      setTeacherChrome(true);
      toggleDebug();
    }, 700);
  };

  const isPlan = viewMode === 'plan';
  const visibleTools = TOOLS.filter((t) => isPlan || !HIDDEN_IN_3D.includes(t.id));

  return (
    <header className={`chrome${teachingOpen ? ' chrome-teaching-open' : ''}`}>
      <div className="chrome-left">
        <div className="brand">
          <img
            className="brand-logo"
            src="/baboo-logo.png"
            alt=""
            width={32}
            height={32}
            decoding="async"
          />
          <span className="brand-name">Baboo</span>
          <button
            type="button"
            className="ver-chip aw-pressable"
            onClick={toggleChangelog}
            onPointerDown={onVerPointerDown}
            onPointerUp={clearPress}
            onPointerLeave={clearPress}
            onPointerCancel={clearPress}
            title="Changelog · long-press for Teacher"
          >
            v{APP_VERSION}
          </button>
        </div>
        <span className="brand-purpose" title="What Baboo is for">Draw floor plans for class</span>
        <input
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Project name"
        />
        <span className={`save-chip save-${saveStatus}`}>{statusLabel}</span>
      </div>

      <div className="tool-bar" role="toolbar" aria-label="Primary tools">
        {visibleTools.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`tool-btn aw-pressable ${tool === t.id ? 'active' : ''}`}
            onClick={() => setTool(t.id)}
            title={t.tip}
            aria-pressed={tool === t.id}
            disabled={!isPlan && t.id !== 'select'}
          >
            {tool === t.id ? <span className="tool-check" aria-hidden="true">✓ </span> : null}
            {t.label}
          </button>
        ))}
      </div>

      <div className="chrome-right">
        <button type="button" className="ghost-btn aw-pressable" onClick={undo} title="Undo" disabled={!isPlan}>Undo</button>
        <button type="button" className="ghost-btn aw-pressable" onClick={redo} title="Redo" disabled={!isPlan}>Redo</button>
        <button
          type="button"
          className={`ghost-btn aw-pressable ${viewMode === 'plan' ? 'active' : ''}`}
          onClick={() => { setRenderTier(0); setViewMode('plan'); }}
        >
          2D Plan
        </button>
        <button
          type="button"
          className={`ghost-btn aw-pressable ${viewMode !== 'plan' ? 'active' : ''}`}
          onClick={() => { setRenderTier(1); setViewMode('solid3d'); }}
          title="3D is view-only"
        >
          3D View
        </button>
        <span className="view-only-chip" hidden={viewMode === 'plan'} title="Switch to 2D Plan to edit">View only</span>

        <button type="button" className="ghost-btn aw-pressable chrome-primary" onClick={exportJson} title="Download your plan file for class">Save file</button>
        <button type="button" className="ghost-btn aw-pressable chrome-primary" onClick={toggleTeaching}>
          {teachingOpen ? 'Close Teach' : 'Teach'}
        </button>
        <button type="button" className="ghost-btn aw-pressable chrome-primary" onClick={toggleHelp}>Help</button>

        <button type="button" className="ghost-btn aw-pressable chrome-desk" onClick={() => openNewProject(true)}>New</button>
        <button type="button" className="ghost-btn aw-pressable chrome-desk" onClick={() => exportGalleryCard()} title="Make a class board card (alias only)">Class card</button>
        <button type="button" className="ghost-btn aw-pressable chrome-desk" onClick={() => openDriveWizard(true)}>Drive</button>
        <button type="button" className="ghost-btn aw-pressable chrome-desk" onClick={() => fileRef.current?.click()}>Import</button>
        <button type="button" className="ghost-btn aw-pressable chrome-desk" onClick={toggleCustomize} title="Settings" aria-label="Settings">Settings</button>
        {teacherChrome && (
          <button type="button" className="ghost-btn aw-pressable chrome-desk" onClick={toggleDebug} title="Teacher tools">Teacher</button>
        )}

        <div className="chrome-more" ref={moreRef}>
          <button
            type="button"
            className={`ghost-btn aw-pressable chrome-more-btn${moreOpen ? ' active' : ''}`}
            aria-expanded={moreOpen}
            aria-haspopup="menu"
            onClick={() => setMoreOpen((v) => !v)}
          >
            More
          </button>
          {moreOpen && (
            <div className="chrome-more-menu" role="menu">
              <button type="button" role="menuitem" className="ghost-btn aw-pressable" onClick={runAndClose(() => openNewProject(true))}>New</button>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable" onClick={runAndClose(() => exportGalleryCard())}>Class card</button>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable" onClick={runAndClose(() => openDriveWizard(true))}>Drive</button>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable" onClick={runAndClose(() => fileRef.current?.click())}>Import</button>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable" onClick={runAndClose(toggleCustomize)}>Settings</button>
              {teacherChrome && (
                <button type="button" role="menuitem" className="ghost-btn aw-pressable" onClick={runAndClose(toggleDebug)}>Teacher</button>
              )}
            </div>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept=".json,.archworks.json,application/json"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void importJson(f);
            e.target.value = '';
          }}
        />
        <span className="copyright-line copyright-chrome" title={COPYRIGHT_LINE}>{COPYRIGHT_LINE}</span>
      </div>
    </header>
  );
}
