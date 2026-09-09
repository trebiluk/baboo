import { FURNITURE_CATALOG } from '../data/furniture';
import { useProjectStore } from '../store/useProjectStore';
import { DEFAULT_SKILL_LEVEL, isToolUnlocked } from '../data/skill';

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

  if (viewMode !== 'plan' || !catalogOpen || tool === 'room' || !isToolUnlocked('furniture', skillLevel)) return null;

  const cats = [...new Set(FURNITURE_CATALOG.map((c) => c.category))];
  const sizeLabel = (w: number, h: number) =>
    units === 'm'
      ? `${(w * 0.3048).toFixed(1)}×${(h * 0.3048).toFixed(1)} m`
      : `${w}'×${h}'`;

  return (
    <aside className="side-panel furniture-side" aria-label="Furniture catalog">
      <div className="drawer-head">
        <h2>Furniture</h2>
        <button
          type="button"
          className="ghost-btn aw-pressable"
          onClick={() => setCatalogOpen(false)}
          title="Hide catalog — grid stays full"
        >
          Hide
        </button>
      </div>
      <p className="muted">
        {tool === 'furniture' || tool === 'select'
          ? 'Click an item, then click the plan — or drag onto the canvas.'
          : 'Pick an item to switch to Furniture.'}
      </p>
      {cats.map((cat) => (
        <div key={cat} className="cat-block">
          <h3>{cat}</h3>
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
                <span className="swatch" style={{ background: item.color }} />
                <span>{item.name}</span>
                <small>{sizeLabel(item.w, item.h)}</small>
              </button>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
