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
    <>
      <button
        type="button"
        className="teaching-backdrop"
        aria-label="Dismiss help"
        onClick={toggle}
      />
      <aside className="drawer help-drawer" role="dialog" aria-label="Help">
        <div className="drawer-head">
          <h2 id="help-title">Help · About</h2>
          <button type="button" className="ghost-btn secondary-btn aw-pressable" onClick={toggle}>Close</button>
        </div>
        <p className="muted">Baboo {APP_VERSION} — two clicks make a wall. Hover Tools on the left if you get stuck.</p>
        <ul className="help-list">
          <li><strong>Wall</strong> — click start, click end. Pull 45° for a slanted corner, or Wall → Clip and click a sharp corner.</li>
          <li><strong>Door / Window</strong> — click on a wall to place. Tap an existing one: a tiny menu appears under it. Drag to slide. Change size, swing, or slide.</li>
          <li><strong>Furniture</strong> — open Tools → Furn. → List, click to place, or drag onto the plan; then move with Select.</li>
          <li><strong>Room</strong> — pick Kitchen, Bath, Living… then click inside walls that close. Angled and clipped corners count. Interior walls split rooms. Delete removes the name.</li>
          <li><strong>Size</strong> — click two points. A length label stays on the plan. Walls also show size while you draw.</li>
          <li><strong>Note</strong> — click, then type (sun, electric, “front door”).</li>
          <li><strong>Plant</strong> — tree, plant bed, or path for the yard.</li>
          <li><strong>Straight walls</strong> — on by default (90° and 45°). Hold Shift for 90° only. Settings can turn it off.</li>
          <li><strong>Fit</strong> — frames the house on the grid. North arrow and a scale bar sit on the plan.</li>
          <li><strong>Access</strong> — Teach’s neighbor, or More → Access check. Doors 32" clear, halls 36", bath 5' turn, kitchen aisle 40". Classroom check, not a legal stamp.</li>
          <li><strong>Pan</strong> — drag to move the view. Wheel zooms.</li>
          <li><strong>Units</strong> — Settings → Feet or Meters for size labels.</li>
          <li><strong>Materials</strong> — Settings → wallpaper packs (teacher may help import).</li>
          <li><strong>2D edits only</strong> — 3D View is <strong>look-only</strong> — edit walls back in 2D.</li>
          <li><strong>Local save</strong> — autosaves here. Use <strong>Save file</strong> to download your plan for class.</li>
          <li><strong>Class folder</strong> — More → Class folder. Unzip onto the class share. Kids open <strong>index.html</strong> in Chrome (not a Drive preview).</li>
          <li><strong>Class card</strong> — More → Class card. Use your <strong>alias</strong> only (no last name).</li>
          <li><strong>Tools</strong> — a small Tools chip on the left. Hover or click to open. It stays open while you draw; Min or Escape hides it.</li>
          <li><strong>What's new</strong> — tap the version chip. Teachers: long-press it for Version · What's new · Debug.</li>
          <li><strong>Skill level</strong> — New plan or Settings. Novice and Beginner get extra help. Moderate unlocks furniture. Expert adds interior walls, duplicate, rotate, and layers.</li>
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
      </aside>
    </>
  );
}
