import { useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { APP_VERSION } from '../version';
import { GalleryCardPreview } from './GalleryCardPreview';
import { LOCALE_OPTIONS, asLocale, t, tipLoc } from '../data/i18n';
import type { Locale } from '../types';

/** Quiet dedication — DEDICATION.md · not a loud splash. */
export const DEDICATION_LINE =
  'Baboo is dedicated in honor of Dr. Donna Matteson, and named for Baboo — her beloved Bichon frise.';

/** COPYRIGHT.md */
export const COPYRIGHT_LINE = '© 2026 Richard Kulibert Jr.';

export function HelpModal() {
  const open = useProjectStore((s) => s.helpOpen);
  const toggle = useProjectStore((s) => s.toggleHelp);
  const settings = useProjectStore((s) => s.doc.settings);
  const setSettings = useProjectStore((s) => s.setSettings);
  const locale = tipLoc(settings);
  const showTips = useProjectStore((s) => s.showTips);
  const setShowTips = useProjectStore((s) => s.setShowTips);
  const taAssist = useProjectStore((s) => s.taAssist);
  const setTaAssist = useProjectStore((s) => s.setTaAssist);
  const [showGallery, setShowGallery] = useState(false);
  // With an aide driving, the long list folds away until someone asks for it.
  const [showList, setShowList] = useState(false);
  if (!open) return null;
  const listOpen = !taAssist || showList;
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

        <section className="help-include" aria-labelledby="udl-title">
          <h3 id="udl-title">{t(locale, 'udl.title')}</h3>
          <p className="muted dense-lead">{t(locale, 'udl.lead')}</p>
          <div className="help-include-toggles" role="group" aria-label={t(locale, 'udl.title')}>
            <button
              type="button"
              className={`aw-shell-chip aw-pressable${settings.udlType ? ' active' : ''}`}
              aria-pressed={!!settings.udlType}
              onClick={() => setSettings({ udlType: !settings.udlType })}
            >
              {t(locale, 'udl.type')}
            </button>
            <button
              type="button"
              className={`aw-shell-chip aw-pressable${settings.udlContrast ? ' active' : ''}`}
              aria-pressed={!!settings.udlContrast}
              onClick={() => setSettings({ udlContrast: !settings.udlContrast })}
            >
              {t(locale, 'udl.contrastOn')}
            </button>
            <button
              type="button"
              className={`aw-shell-chip aw-pressable${settings.udlFat ? ' active' : ''}`}
              aria-pressed={!!settings.udlFat}
              onClick={() => setSettings({ udlFat: !settings.udlFat })}
            >
              {t(locale, 'udl.fat')}
            </button>
            <button
              type="button"
              className={`aw-shell-chip aw-pressable${showTips ? ' active' : ''}`}
              aria-pressed={showTips}
              onClick={() => setShowTips(!showTips)}
            >
              {t(locale, 'tip.show')}
            </button>
            <button
              type="button"
              className={`aw-shell-chip aw-pressable${taAssist ? ' active' : ''}`}
              aria-pressed={taAssist}
              onClick={() => setTaAssist(!taAssist)}
            >
              {t(locale, 'tip.ta')}
            </button>
          </div>
          <p className="muted dense-lead">{t(locale, 'tip.show.lead')}</p>
          <p className="muted dense-lead">{t(locale, 'tip.ta.lead')}</p>
          <p className="muted dense-lead">{t(locale, 'udl.contrast')}</p>
          <h4 className="help-lang-label">{t(locale, 'lang.tips')}</h4>
          <div className="aw-shell-toggle aw-lang-toggle" role="group" aria-label={t(locale, 'lang.tips')}>
            {LOCALE_OPTIONS.map((opt) => {
              const on = asLocale(settings.tipsLocale ?? settings.locale) === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  lang={opt.htmlLang}
                  dir={opt.dir}
                  title={opt.blurb}
                  className={`aw-shell-chip aw-pressable${on ? ' active' : ''}`}
                  aria-pressed={on}
                  onClick={() => setSettings({ tipsLocale: opt.id as Locale })}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </section>

        {taAssist ? (
          <button
            type="button"
            className="ghost-btn aw-pressable help-more-btn"
            aria-expanded={showList}
            onClick={() => setShowList((v) => !v)}
          >
            {t(locale, 'tip.help.more')}
          </button>
        ) : null}
        {listOpen ? (
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
        ) : null}
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
