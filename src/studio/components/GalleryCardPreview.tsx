import { useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { roofStyleName } from '../lib/roof';
import { STYLE_TEMPLATES } from '../data/templates';
import { textureName } from '../data/textures';
import { shellDisplayName } from '../data/typology';
import { DEFAULT_GALLERY_ALIAS } from '../lib/galleryExport';

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
  const exportGalleryCard = useProjectStore((s) => s.exportGalleryCard);
  const [alias, setAlias] = useState(DEFAULT_GALLERY_ALIAS);
  const [reflection, setReflection] = useState('');

  const styleName =
    STYLE_TEMPLATES.find((t) => t.id === settings.styleId)?.name ?? settings.styleId;
  const roof =
    (settings.roofLabel?.trim() || roofStyleName(settings.roofStyleId)) || 'None';
  const tex = textureName(settings.textureId);
  const isTiny = settings.styleId === 'tiny-home' || settings.typology?.kind === 'tiny-home';
  const shellLabel = isTiny ? shellDisplayName(settings.typology?.shell ?? 'trailer') : '';

  return (
    <article
      className={`aw-gallery-card${compact ? ' aw-gallery-card--compact' : ''}`}
      aria-label="Class card preview"
    >
      <div className="aw-gallery-card__thumb" aria-hidden="true">
        <div className="aw-gallery-card__plan-ph">
          <span>Plan picture</span>
          <small>Coming soon</small>
        </div>
      </div>
      <div className="aw-gallery-card__body">
        <div className="aw-gallery-card__topline">
          <span className="aw-gallery-card__badge">Baboo</span>
          <p className="aw-gallery-card__alias">{alias.trim() || DEFAULT_GALLERY_ALIAS}</p>
        </div>
        <h3 className="aw-gallery-card__title">{title || 'Untitled plan'}</h3>
        {reflection.trim() && !compact ? (
          <p className="aw-gallery-card__blurb">{reflection.trim()}</p>
        ) : null}
        <dl className="aw-gallery-card__meta">
          <div>
            <dt>Style</dt>
            <dd>{styleName}</dd>
          </div>
          {shellLabel ? (
            <div>
              <dt>Shell</dt>
              <dd>{shellLabel}</dd>
            </div>
          ) : null}
          <div>
            <dt>Roof</dt>
            <dd>{roof}</dd>
          </div>
          <div>
            <dt>Wallpaper</dt>
            <dd>{tex}</dd>
          </div>
        </dl>
        {showExport ? (
          <div className="aw-gallery-card__export">
            <label className="field">
              <span>Gallery alias (no real name)</span>
              <input
                type="text"
                value={alias}
                maxLength={40}
                autoComplete="off"
                spellCheck={false}
                aria-label="Gallery alias"
                onChange={(e) => setAlias(e.target.value)}
                placeholder={DEFAULT_GALLERY_ALIAS}
              />
            </label>
            {!compact ? (
              <label className="field">
                <span>Short reflection (optional)</span>
                <textarea
                  value={reflection}
                  maxLength={500}
                  rows={2}
                  aria-label="Gallery reflection"
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="One proud detail…"
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
              Class card
            </button>
            <p className="aw-gallery-card__note muted">
              Downloads lean JSON (alias only · no image blobs). Plan PNG later.
            </p>
          </div>
        ) : (
          <p className="aw-gallery-card__note muted">
            Class card — alias only, no last name.
          </p>
        )}
      </div>
    </article>
  );
}
