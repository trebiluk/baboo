import { FURNITURE_CATALOG } from '../data/furniture';
import { useProjectStore } from '../store/useProjectStore';
import { DEFAULT_SKILL_LEVEL, isToolUnlocked } from '../data/skill';
import { FurnitureGlyph } from './FurnitureSymbol';
import { t, tipLoc } from '../data/i18n';

export function FurnitureSidebar() {
  const tool = useProjectStore((s) => s.tool);
  const selectedCatalogId = useProjectStore((s) => s.selectedCatalogId);
  const selectCatalog = useProjectStore((s) => s.selectCatalog);
  const setTool = useProjectStore((s) => s.setTool);
  const units = useProjectStore((s) => s.doc.settings.units);
  const catalogOpen = useProjectStore((s) => s.catalogOpen);
  const setCatalogOpen = useProjectStore((s) => s.setCatalogOpen);
  const viewMode = useProjectStore((s) => s.viewMode);
  const skillLevel = useProjectStore((s) => s.doc.settings.skillLevel) ?? DEFAULT_SKILL_LEVEL;
  const locale = tipLoc(useProjectStore((s) => s.doc.settings));

  if ((viewMode !== 'plan' && viewMode !== 'dollhouse') || !catalogOpen || tool === 'room' || !isToolUnlocked('furniture', skillLevel)) return null;

  const cats = [...new Set(FURNITURE_CATALOG.map((c) => c.category))];
  const sizeLabel = (w: number, h: number) =>
    units === 'm'
      ? `${(w * 0.3048).toFixed(1)}×${(h * 0.3048).toFixed(1)} m`
      : `${w}'×${h}'`;

  return (
    <aside className="side-panel furniture-side" aria-label={t(locale, 'furn.aria')}>
      <div className="drawer-head">
        <h2>{t(locale, 'furn.title')}</h2>
        <button
          type="button"
          className="ghost-btn aw-pressable"
          onClick={() => setCatalogOpen(false)}
          title={t(locale, 'furn.hideTitle')}
        >
          {t(locale, 'chrome.hide')}
        </button>
      </div>
      <p className="muted">
        {tool === 'furniture' || tool === 'select'
          ? t(locale, 'furn.hint.place')
          : t(locale, 'furn.hint.pick')}
      </p>
      {cats.map((cat) => (
        <div key={cat} className="cat-block">
          <h3>{t(locale, `furn.cat.${cat.toLowerCase()}`)}</h3>
          <div className="catalog-grid">
            {FURNITURE_CATALOG.filter((c) => c.category === cat).map((item) => (
              <button
                key={item.id}
                type="button"
                className={`catalog-card ${selectedCatalogId === item.id ? 'active' : ''}`}
                onClick={() => {
                  selectCatalog(item.id);
                  setTool('furniture');
                }}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/archworks-furniture', item.id);
                  e.dataTransfer.effectAllowed = 'copy';
                  selectCatalog(item.id);
                  setTool('furniture');
                }}
              >
                <FurnitureGlyph catalogId={item.id} />
                <span>{t(locale, `furn.item.${item.id}`)}</span>
                <small>{sizeLabel(item.w, item.h)}</small>
              </button>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
