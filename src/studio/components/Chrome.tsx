import { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import type { Tool } from '../types';
import { DEFAULT_SKILL_LEVEL, toolsForLevel } from '../data/skill';
import { BABOO_LOGO } from '../logo';
import { Icon, type IconName } from '../icons';
import { ClassShareModal } from './ClassShareModal';
import { COPYRIGHT_LINE } from './HelpModal';
import { VersionChip } from './VersionChip';
import { usePhoneChrome } from '../hooks/usePhoneChrome';
import { t, tipLoc } from '../data/i18n';
import { capReached } from '../lib/caps';

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
const DOLLHOUSE_TOOLS: Tool[] = ['select', 'furniture', 'plant', 'pan'];


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
  const helpOpen = useProjectStore((s) => s.helpOpen);
  const fileRef = useRef<HTMLInputElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [teacherChrome, setTeacherChrome] = useState(false);
  const [classShareOpen, setClassShareOpen] = useState(false);
  const fileShare = typeof window !== 'undefined' && window.location.protocol === 'file:';
  const phoneChrome = usePhoneChrome();

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

  const skillLevel = useProjectStore((s) => s.doc.settings.skillLevel) ?? DEFAULT_SKILL_LEVEL;
  const locale = tipLoc(useProjectStore((s) => s.doc.settings));
  const floor = useProjectStore((s) => s.doc.floors[0]);
  const showCapToast = useProjectStore((s) => s.showCapToast);
  const statusLabel =
    saveStatus === 'saved' ? t(locale, 'chrome.saved') :
    saveStatus === 'saving' ? t(locale, 'chrome.saving') :
    saveStatus === 'unsaved' ? t(locale, 'chrome.unsaved') : t(locale, 'chrome.saveError');

  const runAndClose = (fn: () => void) => () => {
    setMoreOpen(false);
    fn();
  };

  const isPlan = viewMode === 'plan';
  const isDollhouse = viewMode === 'dollhouse';
  const canEdit = isPlan || isDollhouse;
  const allowed = toolsForLevel(skillLevel);
  const visibleTools = TOOLS.filter((t) => {
    if (!allowed.includes(t.id)) return false;
    if (isPlan) return true;
    if (isDollhouse) return DOLLHOUSE_TOOLS.includes(t.id);
    return !HIDDEN_IN_3D.includes(t.id);
  });

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
          {phoneChrome ? null : <VersionChip onTeacher={() => setTeacherChrome(true)} />}
          {fileShare ? (
            <span className="save-chip" title="Opened from a class folder — no server">Class share</span>
          ) : null}
        </div>
        <span className="brand-purpose" title={t(locale, 'chrome.drawHouse')}>{t(locale, 'chrome.drawHouse')}</span>
        <span className="copyright-line copyright-chrome" title={COPYRIGHT_LINE}>{COPYRIGHT_LINE}</span>
        <input
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label={t(locale, 'chrome.projectName')}
        />
        {phoneChrome ? null : (
          <span className={`save-chip save-${saveStatus}`}>{statusLabel}</span>
        )}
        <button
          type="button"
          className="ghost-btn aw-pressable chrome-wide skill-chrome-chip"
          onClick={toggleCustomize}
          title={t(locale, 'skill.legend')}
        >
          {t(locale, `skill.${skillLevel}`)}
        </button>
      </div>

      <div className="tool-bar chrome-tools" role="toolbar" aria-label="Primary tools">
        {visibleTools.map((item) => {
          const capped = (item.id === 'wall' && capReached(floor, 'walls'))
            || (item.id === 'room' && capReached(floor, 'rooms'))
            || ((item.id === 'furniture' || item.id === 'plant') && capReached(floor, 'objects'));
          return (
          <button
            key={item.id}
            type="button"
            className={`tool-btn aw-pressable ${tool === item.id ? 'active' : ''}${capped ? ' is-capped' : ''}`}
            onClick={() => {
              if (capped) {
                if (item.id === 'wall') showCapToast('walls');
                else if (item.id === 'room') showCapToast('rooms');
                else showCapToast('objects');
                return;
              }
              setTool(item.id);
            }}
            title={item.tip}
            aria-pressed={tool === item.id}
            aria-disabled={capped}
            disabled={!canEdit && item.id !== 'select'}
          >
            {tool === item.id ? <span className="tool-check" aria-hidden="true">✓ </span> : null}
            <Icon name={item.icon} />
            <span className="tool-btn-label">{t(locale, `tool.${item.id}`)}</span>
          </button>
          );
        })}
      </div>

      <div className="chrome-right">
        <button type="button" className="ghost-btn aw-pressable chrome-ico chrome-undo" onClick={undo} title={t(locale, 'chrome.undo')} aria-label={t(locale, 'chrome.undo')} disabled={!canEdit}>
          <Icon name="undo" /> <span className="chrome-label">{t(locale, 'chrome.undo')}</span>
        </button>
        <button type="button" className="ghost-btn aw-pressable chrome-ico chrome-wide" onClick={redo} title={t(locale, 'chrome.redo')} disabled={!canEdit}>
          <Icon name="redo" /> <span className="chrome-label">{t(locale, 'chrome.redo')}</span>
        </button>
        <button type="button" className="ghost-btn aw-pressable chrome-wide keep-phone chrome-ico" onClick={fitPlan} title={t(locale, 'chrome.fit')} disabled={!canEdit}>
          <Icon name="fit" /> <span className="chrome-label">{t(locale, 'chrome.fit')}</span>
        </button>
        <button
          type="button"
          className={`ghost-btn aw-pressable chrome-ico ${viewMode === 'plan' ? 'active' : ''}`}
          onClick={() => { setRenderTier(0); setViewMode('plan'); }}
          title={t(locale, 'chrome.plan')}
        >
          <Icon name="plan" /> <span className="chrome-label">{t(locale, 'chrome.plan')}</span>
        </button>
        <button
          type="button"
          className={`ghost-btn aw-pressable chrome-ico ${viewMode === 'dollhouse' ? 'active' : ''}`}
          onClick={() => setViewMode('dollhouse')}
          title={t(locale, 'chrome.dollhouse')}
        >
          <Icon name="room" /> <span className="chrome-label">{t(locale, 'chrome.dollhouse')}</span>
        </button>
        <button
          type="button"
          className={`ghost-btn aw-pressable chrome-ico ${viewMode !== 'plan' && viewMode !== 'dollhouse' ? 'active' : ''}`}
          onClick={() => { setRenderTier(1); setViewMode('solid3d'); }}
          title={t(locale, '3d.viewonly')}
        >
          <Icon name="view3d" /> <span className="chrome-label">{t(locale, 'chrome.view3d')}</span>
        </button>
        <span className="view-only-chip" hidden={canEdit} title={t(locale, 'chrome.viewonly')}>{t(locale, 'chrome.viewonly')}</span>

        <button type="button" className="ghost-btn aw-pressable chrome-primary chrome-ico chrome-ess" onClick={exportJson} title={t(locale, 'chrome.save')} aria-label={t(locale, 'chrome.save')}>
          <Icon name="save" /> <span className="chrome-label">{t(locale, 'chrome.save')}</span>
        </button>
        <button type="button" className="ghost-btn aw-pressable chrome-wide chrome-ico" onClick={() => openNewProject(true)}>
          <Icon name="new" /> <span className="chrome-label">{t(locale, 'chrome.new')}</span>
        </button>
        <button
          type="button"
          className={`ghost-btn aw-pressable chrome-ico chrome-ess${teachingOpen ? ' active' : ''}`}
          onClick={toggleTeaching}
          title={t(locale, 'chrome.teach')}
          aria-label={teachingOpen ? t(locale, 'chrome.teachClose') : t(locale, 'chrome.teach')}
          aria-pressed={teachingOpen}
        >
          <Icon name="teach" /> <span className="chrome-label">{teachingOpen ? t(locale, 'chrome.teachClose') : t(locale, 'chrome.teach')}</span>
        </button>
        <button
          type="button"
          className={`ghost-btn aw-pressable chrome-ico chrome-ess${helpOpen ? ' active' : ''}`}
          onClick={toggleHelp}
          title={t(locale, 'chrome.help')}
          aria-label={t(locale, 'chrome.help')}
          aria-pressed={helpOpen}
        >
          <Icon name="help" /> <span className="chrome-label">{t(locale, 'chrome.help')}</span>
        </button>

        <div className="chrome-more" ref={moreRef}>
          <button
            type="button"
            className={`ghost-btn aw-pressable chrome-more-btn chrome-ico${moreOpen ? ' active' : ''}`}
            aria-expanded={moreOpen}
            aria-haspopup="menu"
            onClick={() => setMoreOpen((v) => !v)}
            title={t(locale, 'chrome.more')}
          >
            <Icon name="more" /> <span className="chrome-label">{t(locale, 'chrome.more')}</span>
          </button>
          {moreOpen && (
            <div className="chrome-more-menu" role="menu">
              <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => openNewProject(true))}><Icon name="new" /> {t(locale, 'chrome.new')}</button>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => exportGalleryCard())}><Icon name="note" /> {t(locale, 'chrome.classCard')}</button>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => toggleContest())}><Icon name="contest" /> {t(locale, 'chrome.contestBaboo')}</button>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => toggleAccess())}><Icon name="access" /> {t(locale, 'chrome.accessCheck')}</button>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => openDriveWizard(true))}><Icon name="drive" /> {t(locale, 'chrome.drive')}</button>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => setClassShareOpen(true))}><Icon name="folder" /> {t(locale, 'chrome.classFolder')}</button>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => fileRef.current?.click())}><Icon name="import" /> {t(locale, 'chrome.import')}</button>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(toggleCustomize)}><Icon name="settings" /> {t(locale, 'chrome.settings')} · {t(locale, `skill.${skillLevel}`)}</button>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => seedCrowd(250))}><Icon name="list" /> Crowd test · 250</button>
              {teacherChrome && (
                <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(toggleDebug)}><Icon name="teach" /> {t(locale, 'chrome.teacher')}</button>
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
