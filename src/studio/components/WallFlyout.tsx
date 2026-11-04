import { Icon } from '../icons';
import { t, tipLoc } from '../data/i18n';
import {
  WALL_HEIGHT_M,
  WALL_THICKNESS_MM,
  mToFt,
  mmToFt,
  nearestHeightM,
  nearestThicknessMm,
  type WallDrawStyle,
} from '../lib/wallDraft';
import { useProjectStore } from '../store/useProjectStore';
import { formatLength } from '../lib/geometry';
import { usePhoneChrome } from '../hooks/usePhoneChrome';

/** 2.13.54: preset sizes stay metric underneath, but the labels follow the plan's units (feet plans read in inches and feet). */
export function thicknessLabel(mm: number, units: 'ft' | 'm'): string {
  return units === 'm' ? `${mm}mm` : `${Math.round(mm / 25.4)}"`;
}
export function heightLabel(m: number, units: 'ft' | 'm'): string {
  return units === 'm' ? `${m.toFixed(1)}m` : formatLength(mToFt(m), 'ft');
}

const STYLES: { id: WallDrawStyle; labelKey: string }[] = [
  { id: 'outline', labelKey: 'wall.style.outline' },
  { id: 'brick', labelKey: 'wall.style.brick' },
  { id: 'cavity', labelKey: 'wall.style.cavity' },
];

export function WallFlyout() {
  const locale = tipLoc(useProjectStore((s) => s.doc.settings));
  const thickness = useProjectStore((s) => s.wallThickness);
  const height = useProjectStore((s) => s.doc.settings.wallHeight);
  const style = useProjectStore((s) => s.wallDrawStyle);
  const setWallThickness = useProjectStore((s) => s.setWallThickness);
  const setWallHeight = useProjectStore((s) => s.setWallHeight);
  const setWallDrawStyle = useProjectStore((s) => s.setWallDrawStyle);
  const units = useProjectStore((s) => s.doc.settings.units);
  const phone = usePhoneChrome();
  const thickMm = nearestThicknessMm(thickness);
  const heightM = nearestHeightM(height);

  const body = (
    <>

      <p className="wall-flyout-kicker">{t(locale, 'wall.thickness')}</p>
      <div className="wall-flyout-chips" role="group" aria-label={t(locale, 'wall.thickness')}>
        {WALL_THICKNESS_MM.map((mm) => (
          <button
            key={mm}
            type="button"
            className={`wall-flyout-chip aw-pressable${thickMm === mm ? ' is-on' : ''}`}
            aria-pressed={thickMm === mm}
            onClick={() => setWallThickness(mmToFt(mm))}
          >
            {thicknessLabel(mm, units)}
          </button>
        ))}
      </div>

      <p className="wall-flyout-kicker">{t(locale, 'wall.height')}</p>
      <div className="wall-flyout-chips" role="group" aria-label={t(locale, 'wall.height')}>
        {WALL_HEIGHT_M.map((m) => (
          <button
            key={m}
            type="button"
            className={`wall-flyout-chip aw-pressable${heightM === m ? ' is-on' : ''}`}
            aria-pressed={heightM === m}
            onClick={() => setWallHeight(mToFt(m))}
          >
            {heightLabel(m, units)}
          </button>
        ))}
      </div>

      <p className="wall-flyout-kicker">{t(locale, 'wall.style')}</p>
      <div className="wall-flyout-styles" role="group" aria-label={t(locale, 'wall.style')}>
        {STYLES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`wall-style-tile aw-pressable${style === s.id ? ' is-on' : ''}`}
            aria-pressed={style === s.id}
            aria-label={t(locale, s.labelKey)}
            title={t(locale, s.labelKey)}
            onClick={() => setWallDrawStyle(s.id)}
          >
            <span className={`wall-style-glyph is-${s.id}`} aria-hidden="true" />
          </button>
        ))}
      </div>

      <p className="wall-flyout-tip">
        {/* 2.13.54: the Wall tool draws corner to corner; dragging draws nothing, so the tip says what the tool does. */}
        {t(locale, 'tooltip.wall').replace(/\s*\([A-Z]\)\s*$/, '')}
      </p>
    </>
  );

  return (
    <aside className={`wall-flyout${phone ? ' is-phone' : ''}`} data-wall-flyout="1" aria-label={t(locale, 'tool.wall')}>
      {phone ? (
        // On phones the options fold to one line so the grid stays free to draw on.
        <details className="wall-flyout-fold">
          <summary className="wall-flyout-head">
            <Icon name="wall" />
            <span>{t(locale, 'tool.wall')} · <bdi dir="ltr">{thicknessLabel(thickMm, units)} · {heightLabel(heightM, units)}</bdi></span>
          </summary>
          {body}
        </details>
      ) : (
        <>
      <header className="wall-flyout-head">
        <Icon name="wall" />
        <span>{t(locale, 'tool.wall')}</span>
      </header>
          {body}
        </>
      )}
    </aside>
  );
}
