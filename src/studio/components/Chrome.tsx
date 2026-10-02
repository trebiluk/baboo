import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { BABOO_LOGO } from '../logo';
import { Icon } from '../icons';
import { ClassShareModal } from './ClassShareModal';
import { VersionChip } from './VersionChip';
import { t, tipLoc } from '../data/i18n';

export function Chrome() {
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
  const newFromTemplate = useProjectStore((s) => s.newFromTemplate);
  const toggleCustomize = useProjectStore((s) => s.toggleCustomize);
  const customizeOpen = useProjectStore((s) => s.customizeOpen);
  const toggleChangelog = useProjectStore((s) => s.toggleChangelog);
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
  const saveCard = useProjectStore((s) => s.saveCard);
  const clearSaveCard = useProjectStore((s) => s.clearSaveCard);
  const teachingOpen = useProjectStore((s) => s.teachingOpen);
  const helpOpen = useProjectStore((s) => s.helpOpen);
  const fileRef = useRef<HTMLInputElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreBtnRef = useRef<HTMLButtonElement>(null);
  const [morePlace, setMorePlace] = useState<CSSProperties | undefined>(undefined);
  const [menuOpen, setMenuOpen] = useState(false);
  const [teacherChrome, setTeacherChrome] = useState(false);
  const [classShareOpen, setClassShareOpen] = useState(false);
  const [focus, setFocus] = useState(false);
  const fileShare = typeof window !== 'undefined' && window.location.protocol === 'file:';

  useEffect(() => {
    if (!moreOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [moreOpen]);

  /* The bar clips its children (overflow hidden on narrow and touch layouts),
     so the More menu is fixed to the screen, hung under the More button. */
  useEffect(() => {
    if (!moreOpen) return;
    const place = () => {
      const btn = moreBtnRef.current;
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const top = Math.round(r.bottom + 6);
      const right = Math.max(8, Math.round(window.innerWidth - r.right));
      setMorePlace({
        '--more-top': `${top}px`,
        '--more-right': `${right}px`,
        '--more-max-h': `${Math.max(160, window.innerHeight - top - 8)}px`,
      } as CSSProperties);
    };
    place();
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [moreOpen]);

  useEffect(() => {
    if (!menuOpen && !moreOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setMoreOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen, moreOpen]);

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

  useEffect(() => {
    const onFs = () => {
      if (!document.fullscreenElement) setFocus(false);
    };
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const enterFocus = () => {
    setMoreOpen(false);
    setFocus(true);
    const root = document.documentElement;
    if (!document.fullscreenElement && root.requestFullscreen) {
      void root.requestFullscreen().catch(() => { /* the bar still hides */ });
    }
  };
  const exitFocus = () => {
    setFocus(false);
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
  };

  const locale = tipLoc(useProjectStore((s) => s.doc.settings));
  const statusLabel =
    saveStatus === 'saved' ? t(locale, 'chrome.saved') :
    saveStatus === 'saving' ? t(locale, 'chrome.saving') :
    saveStatus === 'unsaved' ? t(locale, 'chrome.unsaved') : t(locale, 'chrome.saveError');

  const runAndClose = (fn: () => void) => () => {
    setMoreOpen(false);
    setMenuOpen(false);
    fn();
  };

  const isPlan = viewMode === 'plan';
  const isDollhouse = viewMode === 'dollhouse';
  const canEdit = isPlan || isDollhouse;

  return (
    <>
    <header className={`chrome${focus ? ' is-hidden' : ''}`} data-baboo-chrome="top">
      <div className="chrome-left">
        <button
          type="button"
          className={`ghost-btn aw-pressable menu-btn${menuOpen ? ' active' : ''}`}
          aria-expanded={menuOpen}
          aria-controls="baboo-menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="menu-mark" aria-hidden="true">☰</span>
          <span className="menu-btn-label">{t(locale, 'chrome.menu')}</span>
        </button>
        <div className="brand">
          <img
            className="brand-logo"
            src={BABOO_LOGO}
            alt=""
            width={32}
            height={32}
            decoding="async"
          />
          <span className="brand-name"><bdi>Baboo</bdi></span>
          <VersionChip onTeacher={() => setTeacherChrome(true)} />
          {fileShare ? (
            <span className="save-chip" title="Opened from a class folder — no server">Class share</span>
          ) : null}
        </div>
        <input
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label={t(locale, 'chrome.projectName')}
        />
        <span className={`save-chip save-${saveStatus}`}>{statusLabel}</span>
      </div>

      <div className="chrome-right">
        <button type="button" className="ghost-btn aw-pressable chrome-ico chrome-undo" onClick={undo} title={t(locale, 'chrome.undo')} aria-label={t(locale, 'chrome.undo')} disabled={!canEdit}>
          <Icon name="undo" />
          <span className="chrome-label">{t(locale, 'chrome.undo')}</span>
        </button>
        <button type="button" className="ghost-btn aw-pressable chrome-ico chrome-wide" onClick={redo} title={t(locale, 'chrome.redo')} aria-label={t(locale, 'chrome.redo')} disabled={!canEdit}>
          <Icon name="redo" />
          <span className="chrome-label">{t(locale, 'chrome.redo')}</span>
        </button>

        <div className="chrome-view" role="group" aria-label="Viewport">
          <button
            type="button"
            className={`ghost-btn aw-pressable chrome-ico ${viewMode === 'plan' ? 'active' : ''}`}
            onClick={() => { setRenderTier(0); setViewMode('plan'); }}
            title={t(locale, 'chrome.plan')}
            aria-label={t(locale, 'chrome.plan')}
            aria-pressed={viewMode === 'plan'}
          >
            <Icon name="plan" />
            <span className="chrome-label">{t(locale, 'chrome.plan')}</span>
          </button>
          <button
            type="button"
            className={`ghost-btn aw-pressable chrome-ico ${viewMode === 'dollhouse' ? 'active' : ''}`}
            onClick={() => setViewMode('dollhouse')}
            title={t(locale, 'chrome.dollhouse')}
            aria-label={t(locale, 'chrome.dollhouse')}
            aria-pressed={viewMode === 'dollhouse'}
          >
            <Icon name="room" />
            <span className="chrome-label">{t(locale, 'chrome.dollhouse')}</span>
          </button>
          <button
            type="button"
            className={`ghost-btn aw-pressable chrome-ico ${viewMode !== 'plan' && viewMode !== 'dollhouse' ? 'active' : ''}`}
            onClick={() => { setRenderTier(3); setViewMode('solid3d'); }}
            title={t(locale, 'chrome.view3d')}
            aria-label={t(locale, 'chrome.view3d')}
            aria-pressed={viewMode !== 'plan' && viewMode !== 'dollhouse'}
          >
            <Icon name="view3d" />
            <span className="chrome-label">{t(locale, 'chrome.view3d')}</span>
          </button>
          <span className="view-only-chip" hidden={canEdit} title={t(locale, 'chrome.viewonly')}>{t(locale, 'chrome.viewonly')}</span>
        </div>

        <button type="button" className="ghost-btn aw-pressable chrome-primary chrome-ico chrome-ess" onClick={exportJson} title={t(locale, 'chrome.save')} aria-label={t(locale, 'chrome.save')}>
          <Icon name="save" />
          <span className="chrome-label">{t(locale, 'chrome.save')}</span>
        </button>
        <button type="button" className="ghost-btn aw-pressable chrome-ico chrome-ess" onClick={() => fileRef.current?.click()} title={t(locale, 'chrome.import')} aria-label={t(locale, 'chrome.import')}>
          <Icon name="import" />
          <span className="chrome-label">{t(locale, 'chrome.import')}</span>
        </button>
        <button
          type="button"
          className={`ghost-btn aw-pressable chrome-ico chrome-gear${customizeOpen ? ' active' : ''}`}
          onClick={toggleCustomize}
          title={t(locale, 'chrome.settings')}
          aria-label={t(locale, 'chrome.settings')}
          aria-pressed={customizeOpen}
        >
          <Icon name="settings" />
          <span className="chrome-label">{t(locale, 'chrome.settings')}</span>
        </button>

        <div className="chrome-more" ref={moreRef}>
          <button
            type="button"
            ref={moreBtnRef}
            className={`ghost-btn aw-pressable chrome-more-btn chrome-ico chrome-hamburger${moreOpen ? ' active' : ''}`}
            aria-expanded={moreOpen}
            aria-haspopup="menu"
            onClick={() => setMoreOpen((v) => !v)}
            title={t(locale, 'chrome.more')}
            aria-label={t(locale, 'chrome.more')}
          >
            <Icon name="more" />
            <span className="chrome-label">{t(locale, 'chrome.more')}</span>
          </button>
          {moreOpen && (
            <div className="chrome-more-menu" role="menu" style={morePlace}>
              <div className="chrome-menu-id">
                <img className="brand-logo" src={BABOO_LOGO} alt="" width={28} height={28} decoding="async" />
                <VersionChip onTeacher={() => setTeacherChrome(true)} />
                <input
                  className="title-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  aria-label={t(locale, 'chrome.projectName')}
                />
              </div>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={focus ? exitFocus : enterFocus}><Icon name="fit" /> {t(locale, focus ? 'chrome.exitFull' : 'chrome.full')}</button>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico chrome-menu-redo" onClick={runAndClose(redo)} disabled={!canEdit}><Icon name="redo" /> {t(locale, 'chrome.redo')}</button>
              <button type="button" role="menuitem" className={`ghost-btn aw-pressable chrome-ico${teachingOpen ? ' active' : ''}`} onClick={runAndClose(toggleTeaching)} aria-pressed={teachingOpen}><Icon name="teach" /> {t(locale, 'chrome.teach')}</button>
              <button type="button" role="menuitem" className={`ghost-btn aw-pressable chrome-ico${helpOpen ? ' active' : ''}`} onClick={runAndClose(toggleHelp)} aria-pressed={helpOpen}><Icon name="help" /> {t(locale, 'chrome.help')}</button>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(fitPlan)} disabled={!canEdit}><Icon name="fit" /> {t(locale, 'chrome.fit')}</button>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => newFromTemplate('mansion'))}><Icon name="room" /> {t(locale, 'chrome.mansion')}</button>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => openNewProject(true))}><Icon name="new" /> {t(locale, 'chrome.new')}</button>
              <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => fileRef.current?.click())}><Icon name="import" /> {t(locale, 'chrome.import')}</button>
              {teacherChrome && (
                <>
                  <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => exportGalleryCard())}><Icon name="note" /> {t(locale, 'chrome.classCard')}</button>
                  <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => toggleContest())}><Icon name="contest" /> {t(locale, 'chrome.contestBaboo')}</button>
                  <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => toggleAccess())}><Icon name="access" /> {t(locale, 'chrome.accessCheck')}</button>
                  <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => openDriveWizard(true))}><Icon name="drive" /> {t(locale, 'chrome.drive')}</button>
                  <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => setClassShareOpen(true))}><Icon name="folder" /> {t(locale, 'chrome.classFolder')}</button>
                  <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(() => seedCrowd(250))}><Icon name="list" /> Crowd test · 250</button>
                  <button type="button" role="menuitem" className="ghost-btn aw-pressable chrome-ico" onClick={runAndClose(toggleDebug)}><Icon name="teach" /> {t(locale, 'chrome.teacher')}</button>
                </>
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
    {menuOpen ? (
      <>
        <button type="button" className="menu-backdrop" aria-label={t(locale, 'chrome.close')} onClick={() => setMenuOpen(false)} />
        <aside id="baboo-menu" className="menu-drawer" role="dialog" aria-labelledby="baboo-menu-title">
          <div className="drawer-head">
            <h2 id="baboo-menu-title">{t(locale, 'chrome.menu')}</h2>
            <button type="button" className="ghost-btn secondary-btn aw-pressable" onClick={() => setMenuOpen(false)}>{t(locale, 'chrome.close')}</button>
          </div>
          <input
            className="title-input menu-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-label={t(locale, 'chrome.projectName')}
          />
          <button type="button" className="ghost-btn aw-pressable" onClick={runAndClose(toggleChangelog)}>{t(locale, 'chrome.whatsNew')}</button>
          <button type="button" className="ghost-btn aw-pressable" onClick={() => { setMenuOpen(false); setMoreOpen(false); if (!customizeOpen) toggleCustomize(); }}>{t(locale, 'chrome.settings')}</button>
          <button type="button" className="ghost-btn aw-pressable" onClick={runAndClose(exportJson)}>{t(locale, 'chrome.save')}</button>
          <button type="button" className="ghost-btn aw-pressable" onClick={runAndClose(() => fileRef.current?.click())}>{t(locale, 'chrome.import')}</button>
          <h3 className="menu-kicker">{t(locale, 'chrome.view')}</h3>
          <button type="button" className={`ghost-btn aw-pressable${viewMode === 'plan' ? ' active' : ''}`} aria-pressed={viewMode === 'plan'} onClick={runAndClose(() => { setRenderTier(0); setViewMode('plan'); })}>{t(locale, 'chrome.plan')}</button>
          <button type="button" className={`ghost-btn aw-pressable${isDollhouse ? ' active' : ''}`} aria-pressed={isDollhouse} onClick={runAndClose(() => setViewMode('dollhouse'))}>{t(locale, 'chrome.dollhouse')}</button>
          <button type="button" className={`ghost-btn aw-pressable${viewMode !== 'plan' && !isDollhouse ? ' active' : ''}`} aria-pressed={viewMode !== 'plan' && !isDollhouse} onClick={runAndClose(() => { setRenderTier(3); setViewMode('solid3d'); })}>{t(locale, 'chrome.view3d')}</button>
          <button type="button" className="ghost-btn aw-pressable" onClick={runAndClose(undo)} disabled={!canEdit}>{t(locale, 'chrome.undo')}</button>
          <button type="button" className="ghost-btn aw-pressable" onClick={runAndClose(redo)} disabled={!canEdit}>{t(locale, 'chrome.redo')}</button>
          <button type="button" className={`ghost-btn aw-pressable${helpOpen ? ' active' : ''}`} aria-pressed={helpOpen} onClick={runAndClose(toggleHelp)}>{t(locale, 'chrome.help')}</button>
          <button type="button" className="ghost-btn aw-pressable" onClick={runAndClose(focus ? exitFocus : enterFocus)}>{t(locale, focus ? 'chrome.exitFull' : 'chrome.full')}</button>
          <button type="button" className={`ghost-btn aw-pressable${teachingOpen ? ' active' : ''}`} aria-pressed={teachingOpen} onClick={runAndClose(toggleTeaching)}>{t(locale, 'chrome.teach')}</button>
          <button type="button" className="ghost-btn aw-pressable" onClick={runAndClose(fitPlan)} disabled={!canEdit}>{t(locale, 'chrome.fit')}</button>
          <button type="button" className="ghost-btn aw-pressable" onClick={runAndClose(() => newFromTemplate('mansion'))}>{t(locale, 'chrome.mansion')}</button>
          <button type="button" className="ghost-btn aw-pressable" onClick={runAndClose(() => openNewProject(true))}>{t(locale, 'chrome.new')}</button>
          {teacherChrome ? (
            <>
              <button type="button" className="ghost-btn aw-pressable" onClick={runAndClose(() => exportGalleryCard())}>{t(locale, 'chrome.classCard')}</button>
              <button type="button" className="ghost-btn aw-pressable" onClick={runAndClose(() => toggleContest())}>{t(locale, 'chrome.contestBaboo')}</button>
              <button type="button" className="ghost-btn aw-pressable" onClick={runAndClose(() => toggleAccess())}>{t(locale, 'chrome.accessCheck')}</button>
              <button type="button" className="ghost-btn aw-pressable" onClick={runAndClose(() => openDriveWizard(true))}>{t(locale, 'chrome.drive')}</button>
              <button type="button" className="ghost-btn aw-pressable" onClick={runAndClose(() => setClassShareOpen(true))}>{t(locale, 'chrome.classFolder')}</button>
              <button type="button" className="ghost-btn aw-pressable" onClick={runAndClose(() => seedCrowd(250))}>Crowd test · 250</button>
              <button type="button" className="ghost-btn aw-pressable" onClick={runAndClose(toggleDebug)}>{t(locale, 'chrome.teacher')}</button>
            </>
          ) : null}
        </aside>
      </>
    ) : null}
    {focus ? (
      <button type="button" className="chrome-restore aw-pressable" onClick={exitFocus} aria-label={t(locale, 'chrome.showBar')}>
        <img src={BABOO_LOGO} alt="" width={28} height={28} decoding="async" />
      </button>
    ) : null}
    {classShareOpen ? <ClassShareModal onClose={() => setClassShareOpen(false)} /> : null}
    {saveCard ? (
      <aside className="save-proof" role="status">
        <span>{saveCard}</span>
        <button type="button" className="primary-btn aw-pressable" onClick={clearSaveCard}>OK</button>
      </aside>
    ) : null}
    </>
  );
}
