import { useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { APP_VERSION } from '../version';
import { GalleryCardPreview } from './GalleryCardPreview';

/** Quiet dedication — DEDICATION.md · not a loud splash. */
export const DEDICATION_LINE =
  'Baboo is dedicated in honor of Dr. Donna Matteson, and named for Baboo — her beloved Bichon frise.';

/** COPYRIGHT.md */
export const COPYRIGHT_LINE = '© 2026 Diego Rogers';

export function HelpModal() {
  const open = useProjectStore((s) => s.helpOpen);
  const toggle = useProjectStore((s) => s.toggleHelp);
  const [showGallery, setShowGallery] = useState(false);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={toggle}>
      <div className="panel-card help-modal aw-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="help-title">
        <div className="drawer-head">
          <h2 id="help-title">Help · About · Baboo {APP_VERSION}</h2>
          <button type="button" className="ghost-btn secondary-btn aw-pressable" onClick={toggle}>Close</button>
        </div>
        <ul className="help-list">
          <li><strong>Wall</strong> — click start, click end. Snap optional in Settings.</li>
          <li><strong>Door / Window</strong> — click on a wall.</li>
          <li><strong>Furniture</strong> — pick from the list, click to place, or drag onto the plan; then move with Select.</li>
          <li><strong>Select</strong> — click something to move it. Delete removes it.</li>
          <li><strong>Pan</strong> — drag to move the view. Wheel zooms.</li>
          <li><strong>Units</strong> — Settings → Feet or Meters for size labels.</li>
          <li><strong>Materials</strong> — Settings → wallpaper packs (teacher may help import).</li>
          <li><strong>2D edits only</strong> — 3D View is <strong>look-only</strong> — edit walls back in 2D.</li>
          <li><strong>Local save</strong> — autosaves here. Use <strong>Save file</strong> to download your plan for class.</li>
          <li><strong>Class card</strong> — for the hallway board. Use your <strong>alias</strong> only (no last name).</li>
          <li><strong>Phone OK</strong> — same app at home; big buttons on small screens.</li>
        </ul>
        <div className="aw-gallery-preview-block">
          <button
            type="button"
            className="ghost-btn aw-pressable"
            aria-expanded={showGallery}
            onClick={() => setShowGallery((v) => !v)}
          >
            {showGallery ? 'Hide class card preview' : 'Class card preview'}
          </button>
          {showGallery ? <GalleryCardPreview /> : null}
        </div>
        <footer className="dedication">
          <p className="dedication-line">{DEDICATION_LINE}</p>
          <p className="dedication-meta">Solvay Middle School Technology Education</p>
          <p className="copyright-line">{COPYRIGHT_LINE}</p>
        </footer>
      </div>
    </div>
  );
}
