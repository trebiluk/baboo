import { useEffect, useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { formatLength, wallLength } from '../lib/geometry';
import { ROOM_CATALOG, roomType } from '../data/rooms';
import { formatArea, polygonArea, roomPolygon } from '../lib/rooms';
import { Icon } from '../icons';
import { TEXTURE_PACKS } from '../data/textures';

const DOOR_WIDTHS = [
  { v: 1, label: '12"' },
  { v: 1.5, label: '18"' },
  { v: 2.5, label: "2'6\"" },
  { v: 32 / 12, label: "2'8\"" },
  { v: 3, label: "3'0\"" },
  { v: 3.5, label: "3'6\"" },
];
const WIN_WIDTHS = [
  { v: 2, label: "2'" },
  { v: 3, label: "3'" },
  { v: 4, label: "4'" },
  { v: 5, label: "5'" },
];

function near(a: number, b: number) {
  return Math.abs(a - b) < 0.04;
}

function DockHead({ title, onCollapse, onClose }: { title: string; onCollapse: () => void; onClose: () => void }) {
  return (
    <div className="object-menu-head">
      <strong>{title}</strong>
      <span className="object-menu-actions">
        <button type="button" className="inspect-collapse aw-pressable" onClick={onCollapse} title="Collapse" aria-label="Collapse edit panel">
          <Icon name="min" />
        </button>
        <button type="button" className="object-menu-x aw-pressable" aria-label="Close" onClick={onClose}>×</button>
      </span>
    </div>
  );
}

export function ObjectMenu() {
  const selected = useProjectStore((s) => s.selected);
  const floor = useProjectStore((s) => s.doc.floors[0]);
  const units = useProjectStore((s) => s.doc.settings.units) || 'ft';
  const styleId = useProjectStore((s) => s.doc.settings.styleId);
  const patchOpening = useProjectStore((s) => s.patchOpening);
  const patchWall = useProjectStore((s) => s.patchWall);
  const patchRoom = useProjectStore((s) => s.patchRoom);
  const renameRoom = useProjectStore((s) => s.renameRoom);
  const renameNote = useProjectStore((s) => s.renameNote);
  const deleteSelected = useProjectStore((s) => s.deleteSelected);
  const traceSketch = useProjectStore((s) => s.traceSketch);
  const rotateSelected = useProjectStore((s) => s.rotateSelected);
  const duplicateSelected = useProjectStore((s) => s.duplicateSelected);
  const clearSelection = useProjectStore((s) => s.clearSelection);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(false);
  }, [selected?.kind, selected?.id]);

  if (!selected) return null;

  const title =
    selected.kind === 'opening' ? (floor.openings.find((x) => x.id === selected.id)?.type === 'window' ? 'Window' : 'Door')
      : selected.kind === 'wall' ? 'Wall'
        : selected.kind === 'furniture' ? (floor.furniture.find((x) => x.id === selected.id)?.label ?? 'Furniture')
          : selected.kind === 'landscape' ? (floor.landscape.find((x) => x.id === selected.id)?.label ?? 'Plant')
            : selected.kind === 'room' ? 'Room'
              : selected.kind === 'note' ? 'Note'
                : selected.kind === 'dim' ? 'Size'
                  : selected.kind === 'sketch' ? 'Sketch'
                    : 'Edit';

  return (
    <aside
      className={`inspect-dock${collapsed ? ' is-min' : ''}`}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      role="dialog"
      aria-label="Edit selection"
      aria-expanded={!collapsed}
    >
      {collapsed ? (
        <button
          type="button"
          className="inspect-chip aw-pressable"
          onClick={() => setCollapsed(false)}
          title="Open edit panel"
        >
          <Icon name="list" />
          <span>{title}</span>
        </button>
      ) : (
        <div className="object-menu">
          {selected.kind === 'opening' && (() => {
        const o = floor.openings.find((x) => x.id === selected.id);
        if (!o) return null;
        const wall = floor.walls.find((w) => w.id === o.wallId);
        const len = wall ? wallLength(wall, floor.nodes) : 8;
        const widths = o.type === 'door' ? DOOR_WIDTHS : WIN_WIDTHS;
        const slide = o.symbolKind === 'slidingDoor';
        return (
          <>
            <DockHead title={o.type === 'door' ? 'Door' : 'Window'} onCollapse={() => setCollapsed(true)} onClose={clearSelection} />
            <div className="object-menu-row" role="group" aria-label="Width">
              {widths.map((w) => (
                <button
                  key={w.label}
                  type="button"
                  className={`object-chip aw-pressable${near(o.width, w.v) ? ' active' : ''}`}
                  onClick={() => patchOpening(o.id, { width: w.v })}
                >
                  {w.label}
                </button>
              ))}
            </div>
            {o.type === 'door' && styleId === 'dog-house' && (
              <p className="object-menu-meta">Baboo wants 12" or 18", then slide it off-center.</p>
            )}
            {o.type === 'door' && (
              <div className="object-menu-row">
                <button
                  type="button"
                  className={`object-chip aw-pressable${!slide && o.swing !== 'right' ? ' active' : ''}`}
                  onClick={() => patchOpening(o.id, { symbolKind: 'swingDoor', swing: 'left' })}
                >
                  Swing L
                </button>
                <button
                  type="button"
                  className={`object-chip aw-pressable${!slide && o.swing === 'right' ? ' active' : ''}`}
                  onClick={() => patchOpening(o.id, { symbolKind: 'swingDoor', swing: 'right' })}
                >
                  Swing R
                </button>
                <button
                  type="button"
                  className={`object-chip aw-pressable${slide ? ' active' : ''}`}
                  onClick={() => patchOpening(o.id, { symbolKind: 'slidingDoor' })}
                >
                  Slide
                </button>
              </div>
            )}
            <div className="object-menu-row">
              <button
                type="button"
                className="object-chip aw-pressable"
                onClick={() => patchOpening(o.id, { t: o.t - 0.06 })}
                aria-label="Slide along wall"
              >
                ←
              </button>
              <button
                type="button"
                className="object-chip aw-pressable"
                onClick={() => patchOpening(o.id, { t: o.t + 0.06 })}
                aria-label="Slide the other way"
              >
                →
              </button>
              <span className="object-menu-meta">{formatLength(Math.min(o.width, len), units)} wide</span>
            </div>
            <button type="button" className="object-del aw-pressable" onClick={deleteSelected}><Icon name="trash" /> Delete</button>
          </>
        );
      })()}

      {selected.kind === 'wall' && (() => {
        const w = floor.walls.find((x) => x.id === selected.id);
        if (!w) return null;
        return (
          <>
            <DockHead title="Wall" onCollapse={() => setCollapsed(true)} onClose={clearSelection} />
            <div className="object-menu-row">
              <button
                type="button"
                className={`object-chip aw-pressable${w.kind === 'exterior' ? ' active' : ''}`}
                onClick={() => patchWall(w.id, { kind: 'exterior' })}
              >
                Outside
              </button>
              <button
                type="button"
                className={`object-chip aw-pressable${w.kind === 'interior' ? ' active' : ''}`}
                onClick={() => patchWall(w.id, { kind: 'interior' })}
              >
                Inside
              </button>
              <span className="object-menu-meta">{formatLength(wallLength(w, floor.nodes), units)}</span>
            </div>
            <p className="object-menu-meta">Wallpaper</p>
            <div className="object-menu-row" role="group" aria-label="Wallpaper">
              {TEXTURE_PACKS.filter((p) => p.id !== 'import:local').map((p) => {
                const on = (p.id === 'pack:plain' && !w.finishId) || w.finishId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    className={`object-chip tex-swatch aw-pressable${on ? ' active' : ''}`}
                    style={{ background: p.previewCss }}
                    title={p.name}
                    onClick={() => patchWall(w.id, { finishId: p.id === 'pack:plain' ? null : p.id })}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
            <button type="button" className="object-del aw-pressable" onClick={deleteSelected}><Icon name="trash" /> Delete</button>
          </>
        );
      })()}

      {selected.kind === 'furniture' && (() => {
        const f = floor.furniture.find((x) => x.id === selected.id);
        if (!f) return null;
        return (
          <>
            <DockHead title={f.label} onCollapse={() => setCollapsed(true)} onClose={clearSelection} />
            <div className="object-menu-row">
              <button type="button" className="object-chip aw-pressable" onClick={() => rotateSelected(1)}><Icon name="rotate" /> Rotate</button>
              <button type="button" className="object-chip aw-pressable" onClick={duplicateSelected}><Icon name="copy" /> Copy</button>
            </div>
            <p className="object-menu-meta">Drag to move</p>
            <button type="button" className="object-del aw-pressable" onClick={deleteSelected}><Icon name="trash" /> Delete</button>
          </>
        );
      })()}

      {selected.kind === 'landscape' && (() => {
        const f = (floor.landscape ?? []).find((x) => x.id === selected.id);
        if (!f) return null;
        return (
          <>
            <DockHead title={f.label} onCollapse={() => setCollapsed(true)} onClose={clearSelection} />
            <p className="object-menu-meta">Drag to move</p>
            <button type="button" className="object-del aw-pressable" onClick={deleteSelected}><Icon name="trash" /> Delete</button>
          </>
        );
      })()}

      {selected.kind === 'room' && (() => {
        const r = (floor.rooms ?? []).find((x) => x.id === selected.id);
        if (!r) return null;
        const poly = roomPolygon(r, floor.nodes, floor.walls);
        return (
          <>
            <DockHead title="Room" onCollapse={() => setCollapsed(true)} onClose={clearSelection} />
            <label className="object-menu-field">
              <span>Name</span>
              <input value={r.name} onChange={(e) => renameRoom(r.id, e.target.value)} aria-label="Room name" />
            </label>
            <label className="object-menu-field">
              <span>Type</span>
              <select value={r.kind} onChange={(e) => patchRoom(r.id, { kind: e.target.value as typeof r.kind })}>
                {ROOM_CATALOG.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>
            <p className="object-menu-meta">
              {poly ? formatArea(polygonArea(poly), units) : 'Open — close walls to measure'}
              {' · '}{roomType(r.kind).blurb}
            </p>
            <button type="button" className="object-del aw-pressable" onClick={deleteSelected}><Icon name="trash" /> Delete</button>
          </>
        );
      })()}

      {selected.kind === 'note' && (() => {
        const n = (floor.notes ?? []).find((x) => x.id === selected.id);
        if (!n) return null;
        return (
          <>
            <DockHead title="Note" onCollapse={() => setCollapsed(true)} onClose={clearSelection} />
            <label className="object-menu-field">
              <span>Text</span>
              <input value={n.text} onChange={(e) => renameNote(n.id, e.target.value)} aria-label="Note text" />
            </label>
            <button type="button" className="object-del aw-pressable" onClick={deleteSelected}><Icon name="trash" /> Delete</button>
          </>
        );
      })()}

      {selected.kind === 'dim' && (
        <>
          <DockHead title="Size" onCollapse={() => setCollapsed(true)} onClose={clearSelection} />
          <p className="object-menu-meta">Drag to move the label</p>
          <button type="button" className="object-del aw-pressable" onClick={deleteSelected}><Icon name="trash" /> Delete</button>
        </>
      )}

      {selected.kind === 'sketch' && (
        <>
          <DockHead title="Sketch" onCollapse={() => setCollapsed(true)} onClose={clearSelection} />
          <p className="object-menu-meta">Pencil underlay · drag to move</p>
          <div className="object-menu-row">
            <button type="button" className="object-chip aw-pressable" onClick={() => traceSketch()}>
              Trace to walls
            </button>
          </div>
          <button type="button" className="object-del aw-pressable" onClick={deleteSelected}><Icon name="trash" /> Delete</button>
        </>
      )}
        </div>
      )}
    </aside>
  );
}
