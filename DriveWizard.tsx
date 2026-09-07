import { useProjectStore } from '../store/useProjectStore';

export function DriveWizard() {
  const open = useProjectStore((s) => s.driveWizardOpen);
  const close = useProjectStore((s) => s.openDriveWizard);
  const exportJson = useProjectStore((s) => s.exportJson);
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={() => close(false)}>
      <div className="panel-card drive-wizard" onClick={(e) => e.stopPropagation()} role="dialog">
        <div className="drawer-head">
          <h2>Save to Google Drive</h2>
          <button type="button" className="ghost-btn secondary-btn aw-pressable" onClick={() => close(false)}>Close</button>
        </div>
        <p>Baboo is <strong>local-first</strong>. Download your project file, then upload it to Drive yourself — no Google login inside the app.</p>
        <ol className="drive-steps">
          <li>Click <strong>Download .archworks.json</strong> below.</li>
          <li>On your Chromebook, open <strong>Google Drive</strong> in the browser.</li>
          <li>Go to <strong>My Drive → Baboo</strong> (create the folder if needed).</li>
          <li>Drag the downloaded file in, or use New → File upload.</li>
          <li>Later: use <strong>Import</strong> in Baboo to open that file again.</li>
        </ol>
        <button
          type="button"
          className="primary-btn aw-pressable"
          onClick={() => {
            exportJson();
          }}
        >
          Download .archworks.json
        </button>
        <p className="muted">Tip: Export before switching Chromebooks. One device = one live IndexedDB copy.</p>
      </div>
    </div>
  );
}
