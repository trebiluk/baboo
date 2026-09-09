import { BABOO_LOGO } from '../logo';

export function ClassShareModal({ onClose }: { onClose: () => void }) {
  const download = () => {
    const a = document.createElement('a');
    a.href = `${import.meta.env.BASE_URL}baboo-class-folder.zip`;
    a.download = 'baboo-class-folder.zip';
    a.rel = 'noopener';
    a.click();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="panel-card drive-wizard"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Class folder"
      >
        <div className="drawer-head">
          <h2>Class folder</h2>
          <button type="button" className="ghost-btn secondary-btn aw-pressable" onClick={onClose}>
            Close
          </button>
        </div>
        <img className="hello-logo" src={BABOO_LOGO} alt="" width={64} height={64} />
        <p>
          Baboo is a web page. Copy one folder onto the share kids already use — N: drive, USB, or
          Chromebook Downloads. No login. No internet after that.
        </p>
        <ol className="drive-steps">
          <li>Download the class folder zip below.</li>
          <li>Unzip it onto the class share.</li>
          <li>Each student opens <strong>index.html</strong> in Chrome (Open with Chrome — not a Drive preview).</li>
          <li>Plans autosave on that Chromebook. Turn in with <strong>Save file</strong>.</li>
        </ol>
        <button type="button" className="primary-btn aw-pressable" onClick={download}>
          Download class folder
        </button>
        <p className="muted">
          One HTML file plus the logo. If Chrome shows a blank page from Drive, copy the folder to
          Downloads and open it there.
        </p>
      </div>
    </div>
  );
}
