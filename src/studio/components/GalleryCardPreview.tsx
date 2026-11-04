import { useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { roofStyleName } from '../lib/roof';
import { STYLE_TEMPLATES } from '../data/templates';
import { textureName } from '../data/textures';
import { shellDisplayName } from '../data/typology';
import { DEFAULT_GALLERY_ALIAS } from '../lib/galleryExport';
import { judgeDogHouse } from '../lib/contest';
import { t, tipLoc, planTitle } from '../data/i18n';

/** Share-gallery card — aliases only (SHARE-GALLERY.md · FERPA). */
export function GalleryCardPreview({
  compact = false,
  showExport = true,
}: {
  compact?: boolean;
  /** Minimal Class card control (StyleBot owns look polish). */
  showExport?: boolean;
}) {
  const settings = useProjectStore((s) => s.doc.settings);
  const title = useProjectStore((s) => s.doc.meta.title);
  // 2.13.67: the card reads in the student's language.
  const locale = tipLoc(settings);
  const exportGalleryCard = useProjectStore((s) => s.exportGalleryCard);
  const [alias, setAlias] = useState(DEFAULT_GALLERY_ALIAS);
  const [reflection, setReflection] = useState('');

  const styleName =
    STYLE_TEMPLATES.find((t) => t.id === settings.styleId)?.name ?? settings.styleId;
  const roof =
    settings.roofLabel?.trim() || (settings.roofStyleId ? roofStyleName(settings.roofStyleId) : t(locale, 'card.none'));
  const tex = settings.textureId ? textureName(settings.textureId) : t(locale, 'card.none');
  const isTiny = settings.styleId === 'tiny-home' || settings.typology?.kind === 'tiny-home';
  const shellLabel = isTiny ? shellDisplayName(settings.typology?.shell ?? 'trailer') : '';
  const floor = useProjectStore((s) => s.doc.floors[0]);
  const contestRibbon = settings.styleId === 'dog-house'
    ? t(locale, `contest.ribbon.${judgeDogHouse(floor, { roofStyleId: settings.roofStyleId, locale }).ribbon}`)
    : null;

  return (
    <article
      className={`aw-gallery-card${compact ? ' aw-gallery-card--compact' : ''}`}
      aria-label={t(locale, 'card.preview')}
    >
      <div className="aw-gallery-card__thumb" aria-hidden="true">
        <div className="aw-gallery-card__plan-ph">
          <span>{t(locale, 'card.picture')}</span>
          <small>{t(locale, 'card.soon')}</small>
        </div>
      </div>
      <div className="aw-gallery-card__body">
        <div className="aw-gallery-card__topline">
          <span className="aw-gallery-card__badge">Baboo</span>
          <p className="aw-gallery-card__alias">{alias.trim() || DEFAULT_GALLERY_ALIAS}</p>
        </div>
        <h3 className="aw-gallery-card__title">{planTitle(title, locale)}</h3>
        {reflection.trim() && !compact ? (
          <p className="aw-gallery-card__blurb">{reflection.trim()}</p>
        ) : null}
        <dl className="aw-gallery-card__meta">
          <div>
            <dt>{t(locale, 'card.style')}</dt>
            <dd>{styleName}</dd>
          </div>
          {shellLabel ? (
            <div>
              <dt>{t(locale, 'card.shell')}</dt>
              <dd>{shellLabel}</dd>
            </div>
          ) : null}
          {contestRibbon ? (
            <div>
              <dt>Baboo</dt>
              <dd>{contestRibbon}</dd>
            </div>
          ) : null}
          <div>
            <dt>{t(locale, 'chip.roof')}</dt>
            <dd>{roof}</dd>
          </div>
          <div>
            <dt>{t(locale, 'obj.wallpaper')}</dt>
            <dd>{tex}</dd>
          </div>
        </dl>
        {showExport ? (
          <div className="aw-gallery-card__export">
            <label className="field">
              <span>{t(locale, 'card.alias')}</span>
              <input
                type="text"
                value={alias}
                maxLength={40}
                autoComplete="off"
                spellCheck={false}
                aria-label={t(locale, 'card.alias')}
                onChange={(e) => setAlias(e.target.value)}
                placeholder={DEFAULT_GALLERY_ALIAS}
              />
            </label>
            {!compact ? (
              <label className="field">
                <span>{t(locale, 'card.reflection')}</span>
                <textarea
                  value={reflection}
                  maxLength={500}
                  rows={2}
                  aria-label={t(locale, 'card.reflection')}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder={t(locale, 'card.proud')}
                />
              </label>
            ) : null}
            <button
              type="button"
              className="primary-btn aw-pressable"
              onClick={() =>
                exportGalleryCard({
                  alias,
                  reflection: compact ? '' : reflection,
                })
              }
            >
              {t(locale, 'chrome.classCard')}
            </button>
            <p className="aw-gallery-card__note muted">
              {t(locale, 'card.note')}
            </p>
          </div>
        ) : (
          <p className="aw-gallery-card__note muted">
            {t(locale, 'card.aliasOnly')}
          </p>
        )}
      </div>
    </article>
  );
}
