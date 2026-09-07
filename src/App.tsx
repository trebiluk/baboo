import { useEffect } from 'react';
import { Chrome } from './components/Chrome';
import { PlanCanvas } from './components/PlanCanvas';
import { FurnitureSidebar } from './components/FurnitureSidebar';
import { TeachingDrawer } from './components/TeachingDrawer';
import { CustomizePanel } from './components/CustomizePanel';
import { NewProjectModal } from './components/NewProjectModal';
import { HelpModal } from './components/HelpModal';
import { DedicationOnce } from './components/DedicationOnce';
import { View3DStub } from './components/View3DStub';
import { DebugDrawer } from './components/DebugDrawer';
import { DriveWizard } from './components/DriveWizard';
import { ChangelogModal } from './components/ChangelogModal';
import { Toast } from './components/Toast';
import { Plan2DOverlay } from './components/Plan2DOverlay';
import { duplicateSelected, rotateSelected90 } from './lib/plan2d';
import { ErrorBoundary } from './components/ErrorBoundary';
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

  useEffect(() => { void init(); }, [init]);

  const guiTheme = useProjectStore((s) => s.doc.settings.guiTheme);
  useEffect(() => { applyGuiTheme(guiTheme ?? DEFAULT_GUI_THEME); }, [guiTheme]);
  useEffect(() => {
    if (viewMode !== 'plan') { setTool('select'); cancelWallDraft(); }
  }, [viewMode, setTool, cancelWallDraft]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); deleteSelected(); }
      else if (e.key === 'Escape') { cancelWallDraft(); useProjectStore.getState().clearSelection(); }
      else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); if (e.shiftKey) redo(); else undo(); }
      else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); }
      else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'd') { e.preventDefault(); duplicateSelected(); }
      else if (e.key === 'r') rotateSelected90();
      else if (e.key === 'v') setTool('select');
      else if (e.key === 'w') setTool('wall');
      else if (e.key === 'd') setTool('door');
      else if (e.key === 'n') setTool('window');
      else if (e.key === 'f') setTool('furniture');
      else if (e.key === 'h') setTool('pan');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [deleteSelected, undo, redo, cancelWallDraft, setTool]);

  return (
    <div className="app-shell">
      <Chrome />
      <div className={`workspace${viewMode !== 'plan' ? ' workspace-3d' : ''}`}>
        {viewMode === 'plan' ? <FurnitureSidebar /> : null}
        <main className="stage-area">
          {viewMode === 'plan' ? <ErrorBoundary label="plan"><PlanCanvas /></ErrorBoundary> : <View3DStub />}
          {viewMode === 'plan' ? <Plan2DOverlay /> : null}
          {demoMode && <div className="demo-watermark">DEMO</div>}
        </main>
      </div>
      <TeachingDrawer />
      <DebugDrawer />
      <CustomizePanel />
      <NewProjectModal />
      <HelpModal />
      <DedicationOnce />
      <DriveWizard />
      <ChangelogModal />
      <Toast />
    </div>
  );
}
