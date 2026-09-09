import { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { APP_VERSION } from '../version';
import type { Tool } from '../types';
import { DEFAULT_SKILL_LEVEL, skillInfo, toolsForLevel } from '../data/skill';
import { BABOO_LOGO } from '../logo';
import { Icon, type IconName } from '../icons';
import { ClassShareModal } from './ClassShareModal';
import { COPYRIGHT_LINE } from './HelpModal';

const TOOLS: { id: Tool; label: string; tip?: string; icon: IconName }[] = [
  { id: 'select', label: 'Select', tip: 'Click something to move it', icon: 'select' },
  { id: 'wall', label: 'Wall', tip: 'Click start, then click end', icon: 'wall' },
  { id: 'door', label: 'Door', tip: 'Click on a wall', icon: 'door' },
  { id: 'window', label: 'Window', tip: 'Click on a wall', icon: 'window' },
  { id: 'furniture', label: 'Furniture', tip: 'Pick an item, then click the plan', icon: 'furniture' },
  { id: 'room', label: 'Room', tip: 'Pick a type, then click inside closed walls', icon: 'room' },
  { id: 'dim', label: 'Size', tip: 'Click two points for a size label', icon: 'dim' },
  { id: 'note', label: 'Note', tip: 'Click, then type', icon: 'note' },
  { id: 'plant', label: 'Plant', tip: 'Tree, bed, or path', icon: 'plant' },
  { id: 'pan', label: 'Pan', tip: 'Drag to move the view', icon: 'pan' },
];

/** Edit tools hidden in 3D (view-only). Select stays so chrome does not look empty. */
const HIDDEN_IN_3D: Tool[] = ['wall', 'door', 'window', 'furniture', 'room', 'dim', 'note', 'plant', 'pan'];


export function Chrome() {
  const tool = useProjectStore((s) => s.tool);
  const setTool = useProjectStore((s) => s.setTool);
  const title = useProjectStore((s) => s.doc.meta.title);
  const setTitle = useProjectStore((s) => s.setTitle);
  const saveStatus = useProjectStore((s) => s.saveStatus);
  const undo = useProjectStore((s) => s.undo);
  const redo = useProjectStore((s) => s.redo);
  const fitPlan = useProjectStore((s) => s.fitPlan);
  const exportJson = useProjectStore((s) => s.exportJson);
  const exportGalleryCard = useProjectStore((s) => s.exportGalleryCard);
  const importJson = useProjectStore((s) => s.importJson);
  const openNewProject = useProjectStore((s) => s.openNewProject);
  const toggleCustomize = useProjectStore((s) => s.toggleCustomize);
  const toggleTeaching = useProjectStore((s) => s.toggleTeaching);
  const toggleHelp = useProjectStore((s) => s.toggleHelp);
  const toggleDebug = useProjectStore((s) => s.toggleDebug);
  const seedCrowd = useProjectStore((s) => s.seedCrowd);
  const toggleChangelog = useProjectStore((s) => s.toggleChangelog);
  const openDriveWizard = useProjectStore((s) => s.openDriveWizard);
  const toggleAccess = useProjectStore((s) => s.toggleAccess);
  const setViewMode = useProjectStore((s) => s.setViewMode);
  const setRenderTier = useProjectStore((s) => s.setRenderTier);
  const viewMode = useProjectStore((s) => s.viewMode);
  const teachingOpen = useProjectStore((s) => s.teachingOpen);
  const fileRef = useRef<HTMLInputElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [teacherChrome, setTeacherChrome] = useState(false);
  const [classShareOpen, setClassShareOpen] = useState(false);
  const fileShare = typeof window !== 'undefined' && window.location.protocol === 'file:';

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

  const skillLevel = useProjectStore((s) => s.doc.settings.skillLevel) ?? DEFAULT_SKILL_LEVEL;
  const isPlan = viewMode === 'plan';
  const allowed = toolsForLevel(skillLevel);
  const visibleTools = TOOLS.filter((t) => (isPlan || !HIDDEN_IN_3D.includes(t.id)) && allowed.includes(t.id));

  return (
    <>
    <header className="chrome">
      <div className="chrome-left">
        <div className="brand">
          <img
            className="brand-logo"
            src={BABOO_LOGO}
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
          {fileShare ? (
            <span className="save-chip" title="Opened from a class folder — no server">Class share</span>
          ) : null}
        </div>
        <span className="brand-purpose" title="What Baboo is for">Draw a house for class</span>
        <span className="copyright-line copyright-chrome" title={COPYRIGHT_LINE}>{COPYRIGHT_LINE}</span>
        <input
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Project name"
        />
        <span className={`save-chip save-${saveStatus}`}>{statusLabel}</span>
        <button
          type="button"
          className="ghost-btn aw-pressable chrome-wide skill-chrome-chip"
          onClick={toggleCustomize}
          title="Change help vs tools"
        >
          {skillInfo(skillLevel).label}
        </button>
      </div>

      <div className="tool-bar chrome-tools" role="toolbar" aria-label="Primary tools">
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
            <Icon name={t.icon} />
            {t.label}
          </button>
        ))}
      </div>

      <div className="chrome-right">
        <button type="button" className="ghost-btn aw-pressable chrome-ico" onClick={undo} title="Undo" disabled={!isPlan}>
          <Icon name="undo" /> Undo
        </button>
        <button type="button" className="ghost-btn aw-pressable chrome-ico" onClick={redo} title="Redo" disabled={!isPlan}>
          <Icon name="redo" /> Redo
        </button>
        <button type="button" className="ghost-btn aw-pressable chrome-wide keep-phone chrome-ico" onClick={fitPlan} title="Fit the house on the grid (0)" disabled={!isPlan}>
          <Icon name="fit" /> Fit
        </button>
        <button
          type="button"
          className={`ghost-btn aw-pressable chrome-ico ${viewMode === 'plan' ? 'active' : ''}`}
          onClick={() => { setRenderTier(0); setViewMode('plan'); }}
        >
          <Icon name="plan" /> 2D Plan
        </button>
        <button
          type="button"
          className={`ghost-btn aw-pressable chrome-ico ${viewMode !== 'plan' ? 'active' : ''}`}
          onClick={() => { setRenderTier(1); setViewMode('solid3d'); }}
          title="3D is view-only"
        >
          <Icon name="view3d" /> 3D View
        </button>
        <span className="view-only-chip" hidden={viewMode === 'plan'} title="Switch to 2D Plan to edit">View only</span>

        <button type="button" className="ghost-btn aw-pressable chrome-primary chrome-ico" onClick={exportJson} title="Download your plan file for class">
          <Icon name="save" /> Save file
        </button>
        <button type="button" className="ghost-btn aw-pressable chrome-wide chrome-ico" onClick={() => openNewProject(true)}>
          <Icon name="new" /> New
        </button>
        <button type="button" className="ghost-btn aw-pressable chrome-phone-only chrome-ico" onClick={toggleTeaching}>
          <Icon name="teach" /> {teachingOpen ? 'Close Teach' : 'Teach'}
        </button>
        <button type="button" className="ghost-btn aw-pressable chrome-phone-only chrome-ico" onClick={toggleHelp}>
          <Icon name="help" /> Help
        </button>

        <div className="chrome-more" ref={moreRef}>
          <button
            type="button"
            className={`ghost-btn aw-pressable chrome-more-btn chrome-ico${moreOpen ? ' active' : ''}`}
            aria-expanded={moreOpen}
            aria-haspopup="menu"
            onClick={() => setMoreOpen((v) => !v)}
          >
            <Icon name="more" /> More
          </button>
          {moreOpen && (
            <div className="chrome-more-menu" role="menu">
              <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => openNewProject(true))}><Icon name="new" /> New</button>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => exportGalleryCard())}><Icon name="note" /> Class card</button>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => toggleAccess())}><Icon name="access" /> Access check</button>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => openDriveWizard(true))}><Icon name="drive" /> Drive</button>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => setClassShareOpen(true))}><Icon name="folder" /> Class folder</button>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => fileRef.current?.click())}><Icon name="import" /> Import</button>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(toggleCustomize)}><Icon name="settings" /> Settings · {skillInfo(skillLevel).label}</button>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => seedCrowd(250))}><Icon name="list" /> Crowd test · 250</button>
              {teacherChrome && (
                <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(toggleDebug)}><Icon name="teach" /> Teacher</button>
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
      </div>
    </header>
    {classShareOpen ? <ClassShareModal onClose={() => setClassShareOpen(false)} /> : null}
    </>
  );
}
