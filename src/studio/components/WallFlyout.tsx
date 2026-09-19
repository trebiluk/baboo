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
  const thickMm = nearestThicknessMm(thickness);
  const heightM = nearestHeightM(height);

  return (
    <aside className="wall-flyout" data-wall-flyout="1" aria-label={t(locale, 'tool.wall')}>
      <header className="wall-flyout-head">
        <Icon name="wall" />
        <span>{t(locale, 'tool.wall')}</span>
      </header>

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
            {mm}mm
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
            {m.toFixed(1)}m
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
        {t(locale, 'wall.tip')}
      </p>
    </aside>
  );
}
