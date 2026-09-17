import { useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { APP_VERSION } from '../version';
import { GalleryCardPreview } from './GalleryCardPreview';
import { t } from '../data/i18n';

/** Quiet dedication — DEDICATION.md · not a loud splash. */
export const DEDICATION_LINE =
  'Baboo is dedicated in honor of Dr. Donna Matteson, and named for Baboo — her beloved Bichon frise.';

/** COPYRIGHT.md */
export const COPYRIGHT_LINE = '© 2026 Richard Kulibert Jr.';

export function HelpModal() {
  const open = useProjectStore((s) => s.helpOpen);
  const toggle = useProjectStore((s) => s.toggleHelp);
  const locale = useProjectStore((s) => s.doc.settings.locale);
  const [showGallery, setShowGallery] = useState(false);
  if (!open) return null;
  return (
    <>
      <button
        type="button"
        className="teaching-backdrop"
        aria-label={t(locale, 'chrome.close')}
        onClick={toggle}
      />
      <aside className="drawer help-drawer" role="dialog" aria-label="Help">
        <div className="drawer-head">
          <div className="drawer-head-title">
            <span className="sheet-handle" aria-hidden="true" />
            <h2 id="help-title">{t(locale, 'help.title')}</h2>
          </div>
          <button type="button" className="ghost-btn secondary-btn aw-pressable" onClick={toggle}>{t(locale, 'chrome.close')}</button>
        </div>
        <p className="muted">Baboo {APP_VERSION} — {t(locale, 'help.lead')}</p>
        <ul className="help-list">
          <li>{t(locale, 'help.sketch')}</li>
          <li>{t(locale, 'help.wall')}</li>
          <li>{t(locale, 'help.door')}</li>
          <li>{t(locale, 'help.furn')}</li>
          <li>{t(locale, 'help.room')}</li>
          <li>{t(locale, 'help.size')}</li>
          <li>{t(locale, 'help.note')}</li>
          <li>{t(locale, 'help.plant')}</li>
          <li>{t(locale, 'help.doll')}</li>
          <li>{t(locale, 'help.view3d')}</li>
          <li>{t(locale, 'help.chrome')}</li>
          <li>{t(locale, 'help.skill')}</li>
          <li>{t(locale, 'help.lang')}</li>
          <li>{t(locale, 'help.udl')}</li>
          <li>{t(locale, 'help.read')}</li>
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
