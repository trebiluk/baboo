import { ROOM_CATALOG } from '../data/rooms';
import { useProjectStore } from '../store/useProjectStore';
import { DEFAULT_SKILL_LEVEL, isToolUnlocked } from '../data/skill';
import { formatArea, roomPolygon, polygonArea } from '../lib/rooms';
import { t, tipLoc } from '../data/i18n';

export function RoomSidebar() {
  const tool = useProjectStore((s) => s.tool);
  const selectedRoomKind = useProjectStore((s) => s.selectedRoomKind);
  const selectRoomKind = useProjectStore((s) => s.selectRoomKind);
  const catalogOpen = useProjectStore((s) => s.catalogOpen);
  const setCatalogOpen = useProjectStore((s) => s.setCatalogOpen);
  const viewMode = useProjectStore((s) => s.viewMode);
  const selected = useProjectStore((s) => s.selected);
  const doc = useProjectStore((s) => s.doc);
  const renameRoom = useProjectStore((s) => s.renameRoom);
  const units = doc.settings.units;
  const locale = tipLoc(doc.settings);
  const skillLevel = doc.settings.skillLevel ?? DEFAULT_SKILL_LEVEL;

  if (viewMode !== 'plan' || !catalogOpen || tool !== 'room' || !isToolUnlocked('room', skillLevel)) return null;

  const floor = doc.floors[0];
  const editing = selected?.kind === 'room'
    ? floor.rooms.find((r) => r.id === selected.id)
    : null;
  const editPoly = editing ? roomPolygon(editing, floor.nodes, floor.walls) : null;
  const editArea = editPoly ? polygonArea(editPoly) : null;

  return (
    <aside className="side-panel furniture-side" aria-label={t(locale, 'rooms.aria')}>
      <div className="drawer-head">
        <h2>{t(locale, 'rooms.title')}</h2>
        <button
          type="button"
          className="ghost-btn aw-pressable"
          onClick={() => setCatalogOpen(false)}
          title={t(locale, 'rooms.hideTitle')}
        >
          {t(locale, 'chrome.hide')}
        </button>
      </div>
      <p className="muted">
        {t(locale, 'rooms.lead')}
      </p>
      {editing && (
        <div className="room-edit-block">
          <label className="field">
            <span>{t(locale, 'rooms.nameThis')}</span>
            <input
              value={editing.name}
              onChange={(e) => renameRoom(editing.id, e.target.value)}
              aria-label={t(locale, 'obj.roomName')}
            />
          </label>
          <p className="muted">
            {editArea != null ? formatArea(editArea, units) : t(locale, 'rooms.openSpace')}
          </p>
        </div>
      )}
      <div className="catalog-grid">
        {ROOM_CATALOG.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`catalog-card ${selectedRoomKind === item.id ? 'active' : ''}`}
            onClick={() => selectRoomKind(item.id)}
          >
            <span className="swatch" style={{ background: item.color }} />
            <span>{t(locale, `room.kind.${item.id}`)}</span>
            <small>{t(locale, `room.blurb.${item.id}`)}</small>
          </button>
        ))}
      </div>
    </aside>
  );
}
