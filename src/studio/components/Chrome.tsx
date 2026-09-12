import { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import type { Tool } from '../types';
import { DEFAULT_SKILL_LEVEL, skillInfo, toolsForLevel } from '../data/skill';
import { BABOO_LOGO } from '../logo';
import { Icon, type IconName } from '../icons';
import { ClassShareModal } from './ClassShareModal';
import { COPYRIGHT_LINE } from './HelpModal';
import { VersionChip } from './VersionChip';

const TOOLS: { id: Tool; label: string; tip?: string; icon: IconName }[] = [
  { id: 'select', label: 'Select', tip: 'Click something to move it', icon: 'select' },
  { id: 'sketch', label: 'Sketch', tip: 'Drag like a pencil, then Trace into walls', icon: 'sketch' },
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
const HIDDEN_IN_3D: Tool[] = ['sketch', 'wall', 'door', 'window', 'furniture', 'room', 'dim', 'note', 'plant', 'pan'];


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
  const openDriveWizard = useProjectStore((s) => s.openDriveWizard);
  const toggleAccess = useProjectStore((s) => s.toggleAccess);
  const toggleContest = useProjectStore((s) => s.toggleContest);
  const setViewMode = useProjectStore((s) => s.setViewMode);
  const setRenderTier = useProjectStore((s) => s.setRenderTier);
  const viewMode = useProjectStore((s) => s.viewMode);
  const teachingOpen = useProjectStore((s) => s.teachingOpen);
  const fileRef = useRef<HTMLInputElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
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
    const onTeacher = () => setTeacherChrome(true);
    window.addEventListener('baboo-teacher', onTeacher);
    return () => window.removeEventListener('baboo-teacher', onTeacher);
  }, []);

  const statusLabel =
    saveStatus === 'saved' ? 'Saved' :
    saveStatus === 'saving' ? 'Saving…' :
    saveStatus === 'unsaved' ? 'Unsaved' : 'Save error';

  const runAndClose = (fn: () => void) => () => {
    setMoreOpen(false);
    fn();
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
          <VersionChip onTeacher={() => setTeacherChrome(true)} />
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
          <Icon name="undo" /> <span className="chrome-label">Undo</span>
        </button>
        <button type="button" className="ghost-btn aw-pressable chrome-ico" onClick={redo} title="Redo" disabled={!isPlan}>
          <Icon name="redo" /> <span className="chrome-label">Redo</span>
        </button>
        <button type="button" className="ghost-btn aw-pressable chrome-wide keep-phone chrome-ico" onClick={fitPlan} title="Fit the house on the grid (0)" disabled={!isPlan}>
          <Icon name="fit" /> <span className="chrome-label">Fit</span>
        </button>
        <button
          type="button"
          className={`ghost-btn aw-pressable chrome-ico ${viewMode === 'plan' ? 'active' : ''}`}
          onClick={() => { setRenderTier(0); setViewMode('plan'); }}
          title="2D Plan"
        >
          <Icon name="plan" /> <span className="chrome-label">2D Plan</span>
        </button>
        <button
          type="button"
          className={`ghost-btn aw-pressable chrome-ico ${viewMode !== 'plan' ? 'active' : ''}`}
          onClick={() => { setRenderTier(1); setViewMode('solid3d'); }}
          title="3D is view-only"
        >
          <Icon name="view3d" /> <span className="chrome-label">3D View</span>
        </button>
        <span className="view-only-chip" hidden={viewMode === 'plan'} title="Switch to 2D Plan to edit">View only</span>

        <button type="button" className="ghost-btn aw-pressable chrome-primary chrome-ico" onClick={exportJson} title="Download your plan file for class">
          <Icon name="save" /> <span className="chrome-label">Save file</span>
        </button>
        <button type="button" className="ghost-btn aw-pressable chrome-wide chrome-ico" onClick={() => openNewProject(true)}>
          <Icon name="new" /> <span className="chrome-label">New</span>
        </button>
        <button type="button" className="ghost-btn aw-pressable chrome-phone-only chrome-ico" onClick={toggleTeaching}>
          <Icon name="teach" /> <span className="chrome-label">{teachingOpen ? 'Close Teach' : 'Teach'}</span>
        </button>
        <button type="button" className="ghost-btn aw-pressable chrome-phone-only chrome-ico" onClick={toggleHelp}>
          <Icon name="help" /> <span className="chrome-label">Help</span>
        </button>

        <div className="chrome-more" ref={moreRef}>
          <button
            type="button"
            className={`ghost-btn aw-pressable chrome-more-btn chrome-ico${moreOpen ? ' active' : ''}`}
            aria-expanded={moreOpen}
            aria-haspopup="menu"
            onClick={() => setMoreOpen((v) => !v)}
            title="More"
          >
            <Icon name="more" /> <span className="chrome-label">More</span>
          </button>
          {moreOpen && (
            <div className="chrome-more-menu" role="menu">
              <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => openNewProject(true))}><Icon name="new" /> New</button>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => exportGalleryCard())}><Icon name="note" /> Class card</button>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => toggleContest())}><Icon name="contest" /> Baboo’s contest</button>
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
