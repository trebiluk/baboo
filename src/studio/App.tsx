import { useEffect } from 'react';
import { Chrome } from './components/Chrome';
import { PlanCanvas } from './components/PlanCanvas';
import { DollhouseCanvas } from './components/DollhouseCanvas';
import { FurnitureSidebar } from './components/FurnitureSidebar';
import { RoomSidebar } from './components/RoomSidebar';
import { TeachingDrawer } from './components/TeachingDrawer';
import { AccessDrawer } from './components/AccessDrawer';
import { ContestDrawer } from './components/ContestDrawer';
import { CustomizePanel } from './components/CustomizePanel';
import { NewProjectModal } from './components/NewProjectModal';
import { HelpModal } from './components/HelpModal';
import { DedicationOnce } from './components/DedicationOnce';
import { View3DStub } from './components/View3DStub';
import { DebugDrawer } from './components/DebugDrawer';
import { DriveWizard } from './components/DriveWizard';
import { ChangelogModal } from './components/ChangelogModal';
import { Toast } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToolRail } from './components/ToolRail';
import { CoachBanner } from './components/CoachBanner';
import { VersionChip } from './components/VersionChip';
import { ObjectMenu } from './components/ObjectMenu';
import { usePhoneChrome } from './hooks/usePhoneChrome';
import { useProjectStore } from './store/useProjectStore';
import { applyGuiTheme, DEFAULT_GUI_THEME } from './data/themes';
import { applyDocumentLocale, localeOption, tipLoc } from './data/i18n';

export default function App() {
  const init = useProjectStore((s) => s.init);
  const viewMode = useProjectStore((s) => s.viewMode);
  const demoMode = useProjectStore((s) => s.demoMode);
  const deleteSelected = useProjectStore((s) => s.deleteSelected);
  const undo = useProjectStore((s) => s.undo);
  const redo = useProjectStore((s) => s.redo);
  const cancelWallDraft = useProjectStore((s) => s.cancelWallDraft);
  const setTool = useProjectStore((s) => s.setTool);
  const closeOverlays = useProjectStore((s) => s.closeOverlays);
  const minimizeTools = useProjectStore((s) => s.minimizeTools);
  const duplicateSelected = useProjectStore((s) => s.duplicateSelected);
  const rotateSelected = useProjectStore((s) => s.rotateSelected);
  const nudgeSelected = useProjectStore((s) => s.nudgeSelected);
  const fitPlan = useProjectStore((s) => s.fitPlan);

  useEffect(() => {
    void init();
  }, [init]);

  const guiTheme = useProjectStore((s) => s.doc.settings.guiTheme);
  const tipsLocale = tipLoc(useProjectStore((s) => s.doc.settings));
  const udlFat = useProjectStore((s) => s.doc.settings.udlFat);
  const udlType = useProjectStore((s) => s.doc.settings.udlType);
  const udlContrast = useProjectStore((s) => s.doc.settings.udlContrast);
  const ellEnglish = useProjectStore((s) => s.doc.settings.ellEnglish !== false);
  const phoneChrome = usePhoneChrome();

  useEffect(() => {
    applyGuiTheme(guiTheme ?? DEFAULT_GUI_THEME);
  }, [guiTheme]);

  useEffect(() => {
    applyDocumentLocale(tipsLocale);
    const root = document.documentElement;
    root.toggleAttribute('data-udl-fat', !!udlFat);
    root.toggleAttribute('data-udl-type', !!udlType);
    root.toggleAttribute('data-udl-contrast', !!udlContrast);
    root.toggleAttribute('data-ell-english', !!ellEnglish && tipsLocale !== 'en');
  }, [tipsLocale, udlFat, udlType, udlContrast, ellEnglish]);

  useEffect(() => {
    const flush = () => {
      if (document.visibilityState === 'hidden') {
        void useProjectStore.getState().flushSave();
      }
    };
    document.addEventListener('visibilitychange', flush);
    window.addEventListener('pagehide', () => { void useProjectStore.getState().flushSave(); });
    return () => {
      document.removeEventListener('visibilitychange', flush);
    };
  }, []);

  useEffect(() => {
    if (viewMode === 'plan') return;
    const t = useProjectStore.getState().tool;
    if (viewMode === 'dollhouse') {
      if (t !== 'select' && t !== 'furniture' && t !== 'plant' && t !== 'pan') {
        setTool('select');
      }
      cancelWallDraft();
      return;
    }
    setTool('select');
    cancelWallDraft();
  }, [viewMode, setTool, cancelWallDraft]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
      } else if (e.key === 'Escape') {
        cancelWallDraft();
        useProjectStore.getState().clearSelection();
        closeOverlays();
        minimizeTools();
        const el = document.activeElement as HTMLElement | null;
        if (el && typeof el.blur === 'function' && el !== document.body) el.blur();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        duplicateSelected();
      } else if (e.altKey || e.metaKey || e.ctrlKey) {
        return;
      } else if (e.key.startsWith('Arrow')) {
        if (!useProjectStore.getState().selected) return;
        e.preventDefault();
        const grid = useProjectStore.getState().doc.settings.gridSize || 1;
        /* Shift is the fine nudge — one inch at the classroom default. */
        const step = e.shiftKey ? Math.max(1 / 12, grid / 4) : grid;
        const dx = e.key === 'ArrowRight' ? step : e.key === 'ArrowLeft' ? -step : 0;
        const dy = e.key === 'ArrowDown' ? step : e.key === 'ArrowUp' ? -step : 0;
        if (dx || dy) nudgeSelected(dx, dy);
      } else if (e.key.toLowerCase() === 'v') setTool('select');
      else if (e.key.toLowerCase() === 's') { if (viewMode === 'plan') setTool('sketch'); }
      else if (e.key.toLowerCase() === 'w') { if (viewMode === 'plan') setTool('wall'); }
      else if (e.key.toLowerCase() === 'b') { if (viewMode === 'plan') setTool('box'); }
      else if (e.key.toLowerCase() === 'd') { if (viewMode === 'plan') setTool('door'); }
      else if (e.key.toLowerCase() === 'n') { if (viewMode === 'plan') setTool('window'); }
      else if (e.key.toLowerCase() === 'f') { if (viewMode === 'plan' || viewMode === 'dollhouse') setTool('furniture'); }
      else if (e.key.toLowerCase() === 'r') { if (viewMode === 'plan') setTool('room'); }
      else if (e.key.toLowerCase() === 'm') { if (viewMode === 'plan') setTool('dim'); }
      else if (e.key.toLowerCase() === 't') { if (viewMode === 'plan') setTool('note'); }
      else if (e.key.toLowerCase() === 'l') { if (viewMode === 'plan' || viewMode === 'dollhouse') setTool('plant'); }
      else if (e.key.toLowerCase() === 'h') { if (viewMode === 'plan' || viewMode === 'dollhouse') setTool('pan'); }
      else if (e.key === '0') { e.preventDefault(); fitPlan(); }
      else if (e.key === ']') rotateSelected(1);
      else if (e.key === '[') rotateSelected(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [deleteSelected, undo, redo, cancelWallDraft, setTool, closeOverlays, minimizeTools, duplicateSelected, rotateSelected, nudgeSelected, fitPlan, viewMode]);

  return (
    <div
      className={`app-shell${phoneChrome ? ' is-phone' : ''}`}
      lang={localeOption(tipsLocale).htmlLang}
    >
      <Chrome />
      <div className={`workspace${viewMode !== 'plan' && viewMode !== 'dollhouse' ? ' workspace-3d' : ''}`}>
        <div className="stage-stack">
          <main className="stage-area">
            {viewMode === 'plan' ? (
              <ErrorBoundary label="plan"><PlanCanvas /></ErrorBoundary>
            ) : viewMode === 'dollhouse' ? (
              <ErrorBoundary label="dollhouse"><DollhouseCanvas /></ErrorBoundary>
            ) : (
              <View3DStub />
            )}
            {(viewMode === 'plan' || viewMode === 'dollhouse') && <CoachBanner />}
            {demoMode && <div className="demo-watermark">DEMO</div>}
          </main>
          <ObjectMenu />
          <VersionChip floating />
          <ToolRail />
          <FurnitureSidebar />
          <RoomSidebar />
          <TeachingDrawer />
          <ErrorBoundary label="access"><AccessDrawer /></ErrorBoundary>
          <ErrorBoundary label="contest"><ContestDrawer /></ErrorBoundary>
          <HelpModal />
          <CustomizePanel />
        </div>
      </div>
      <DebugDrawer />
      <NewProjectModal />
      <DedicationOnce />
      <DriveWizard />
      <ChangelogModal />
      <Toast />
    </div>
  );
}
