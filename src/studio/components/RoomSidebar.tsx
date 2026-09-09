import { ROOM_CATALOG } from '../data/rooms';
import { useProjectStore } from '../store/useProjectStore';
import { DEFAULT_SKILL_LEVEL, isToolUnlocked } from '../data/skill';
import { formatArea, roomPolygon, polygonArea } from '../lib/rooms';

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
  const skillLevel = doc.settings.skillLevel ?? DEFAULT_SKILL_LEVEL;

  if (viewMode !== 'plan' || !catalogOpen || tool !== 'room' || !isToolUnlocked('room', skillLevel)) return null;

  const floor = doc.floors[0];
  const editing = selected?.kind === 'room'
    ? floor.rooms.find((r) => r.id === selected.id)
    : null;
  const editPoly = editing ? roomPolygon(editing, floor.nodes, floor.walls) : null;
  const editArea = editPoly ? polygonArea(editPoly) : null;

  return (
    <aside className="side-panel furniture-side" aria-label="Room types">
      <div className="drawer-head">
        <h2>Rooms</h2>
        <button
          type="button"
          className="ghost-btn aw-pressable"
          onClick={() => setCatalogOpen(false)}
          title="Hide list — grid stays full"
        >
          Hide
        </button>
      </div>
      <p className="muted">
        Pick a type, then click inside walls that close. Draw an interior wall to split rooms.
      </p>
      {editing && (
        <div className="room-edit-block">
          <label className="field">
            <span>Name this room</span>
            <input
              value={editing.name}
              onChange={(e) => renameRoom(editing.id, e.target.value)}
              aria-label="Room name"
            />
          </label>
          <p className="muted">
            {editArea != null ? formatArea(editArea, units) : 'Open space — close the walls to measure'}
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
            <span>{item.name}</span>
            <small>{item.blurb}</small>
          </button>
        ))}
      </div>
    </aside>
  );
}
