import { useEffect } from 'react';
import { Chrome } from './components/Chrome';
import { PlanCanvas } from './components/PlanCanvas';
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
import { DockRail } from './components/DockRail';
import { CoachBanner } from './components/CoachBanner';
import { VersionChip } from './components/VersionChip';
import { useProjectStore } from './store/useProjectStore';
import { applyGuiTheme, DEFAULT_GUI_THEME } from './data/themes';

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
  const fitPlan = useProjectStore((s) => s.fitPlan);

  useEffect(() => {
    void init();
  }, [init]);

  const guiTheme = useProjectStore((s) => s.doc.settings.guiTheme);

  useEffect(() => {
    applyGuiTheme(guiTheme ?? DEFAULT_GUI_THEME);
  }, [guiTheme]);

  useEffect(() => {
    if (viewMode !== 'plan') {
      setTool('select');
      cancelWallDraft();
    }
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
      } else if (e.key.toLowerCase() === 'v') setTool('select');
      else if (e.key.toLowerCase() === 's') setTool('sketch');
      else if (e.key.toLowerCase() === 'w') setTool('wall');
      else if (e.key.toLowerCase() === 'd') setTool('door');
      else if (e.key.toLowerCase() === 'n') setTool('window');
      else if (e.key.toLowerCase() === 'f') setTool('furniture');
      else if (e.key.toLowerCase() === 'r') setTool('room');
      else if (e.key.toLowerCase() === 'm') setTool('dim');
      else if (e.key.toLowerCase() === 't') setTool('note');
      else if (e.key.toLowerCase() === 'l') setTool('plant');
      else if (e.key.toLowerCase() === 'h') setTool('pan');
      else if (e.key === '0') { e.preventDefault(); fitPlan(); }
      else if (e.key === ']') rotateSelected(1);
      else if (e.key === '[') rotateSelected(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [deleteSelected, undo, redo, cancelWallDraft, setTool, closeOverlays, minimizeTools, duplicateSelected, rotateSelected, fitPlan]);

  return (
    <div className="app-shell">
      <Chrome />
      <div className={`workspace${viewMode !== 'plan' ? ' workspace-3d' : ''}`}>
        <div className="stage-stack">
          <main className="stage-area">
            {viewMode === 'plan' ? <ErrorBoundary label="plan"><PlanCanvas /></ErrorBoundary> : <View3DStub />}
            {viewMode === 'plan' && <CoachBanner />}
            {demoMode && <div className="demo-watermark">DEMO</div>}
          </main>
          <VersionChip floating />
          <ToolRail />
          <FurnitureSidebar />
          <RoomSidebar />
          <TeachingDrawer />
          <ErrorBoundary label="access"><AccessDrawer /></ErrorBoundary>
          <ErrorBoundary label="contest"><ContestDrawer /></ErrorBoundary>
          <HelpModal />
          <CustomizePanel />
          <DockRail />
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
