import { useEffect, useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { formatLength, parseFeet, wallLength, dist } from '../lib/geometry';
import { ROOM_CATALOG, roomType } from '../data/rooms';
import { formatArea, polygonArea, roomPolygon } from '../lib/rooms';
import { Icon } from '../icons';
import { TEXTURE_PACKS } from '../data/textures';
import { FLOOR_FINISHES, asFloorFinish } from '../data/flooring';
import { FURN_PAINTS, samePaint } from '../data/furnPaint';
import { ModelPeek } from './ModelPeek';

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

function FeetField({
  label, feet, units, onCommit, allowZero = false,
}: {
  label: string;
  feet: number;
  units: 'ft' | 'm';
  onCommit: (n: number) => void;
  allowZero?: boolean;
}) {
  const shown = formatLength(feet, units);
  const [text, setText] = useState(shown);
  useEffect(() => { setText(shown); }, [shown]);
  const commit = () => {
    const n = parseFeet(text, units);
    if (n == null || (!allowZero && Math.abs(n) < 0.05)) {
      setText(shown);
      return;
    }
    onCommit(n);
  };
  return (
    <label className="object-menu-field">
      <span>{label}</span>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') (e.currentTarget as HTMLInputElement).blur(); }}
        aria-label={label}
      />
    </label>
  );
}

function DegField({
  label, rad, onCommit,
}: {
  label: string;
  rad: number;
  onCommit: (rad: number) => void;
}) {
  const deg = Math.round((((rad * 180) / Math.PI) % 360 + 360) % 360);
  const [text, setText] = useState(String(deg));
  useEffect(() => { setText(String(deg)); }, [deg]);
  const commit = () => {
    const n = parseFloat(text);
    if (!Number.isFinite(n)) {
      setText(String(deg));
      return;
    }
    onCommit((n * Math.PI) / 180);
  };
  return (
    <label className="object-menu-field">
      <span>{label}</span>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') (e.currentTarget as HTMLInputElement).blur(); }}
        aria-label={label}
      />
    </label>
  );
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
  const houseFloor = useProjectStore((s) => asFloorFinish(s.doc.settings.floorFinishId));
  const styleId = useProjectStore((s) => s.doc.settings.styleId);
  const patchOpening = useProjectStore((s) => s.patchOpening);
  const patchWall = useProjectStore((s) => s.patchWall);
  const patchFurniture = useProjectStore((s) => s.patchFurniture);
  const patchLandscape = useProjectStore((s) => s.patchLandscape);
  const setWallLength = useProjectStore((s) => s.setWallLength);
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
            <div className="object-menu-grid">
              <FeetField label="Width" feet={o.width} units={units} onCommit={(n) => patchOpening(o.id, { width: n })} />
            </div>
            <button type="button" className="object-del aw-pressable" onClick={deleteSelected}><Icon name="trash" /> Delete</button>
          </>
        );
      })()}

      {selected.kind === 'wall' && (() => {
        const w = floor.walls.find((x) => x.id === selected.id);
        if (!w) return null;
        const thickIn = Math.round((w.thickness || 0.5) * 12);
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
            </div>
            <div className="object-menu-grid">
              <FeetField
                label="Length"
                feet={wallLength(w, floor.nodes)}
                units={units}
                onCommit={(n) => setWallLength(w.id, n)}
              />
              <FeetField
                label="Thick"
                feet={w.thickness || 0.5}
                units={units}
                onCommit={(n) => patchWall(w.id, { thickness: n })}
              />
            </div>
            <div className="object-menu-row" role="group" aria-label="Thickness">
              {[4, 6, 8].map((inch) => (
                <button
                  key={inch}
                  type="button"
                  className={`object-chip aw-pressable${thickIn === inch ? ' active' : ''}`}
                  onClick={() => patchWall(w.id, { thickness: inch / 12 })}
                >
                  {inch}"
                </button>
              ))}
              <span className="object-menu-meta">Drag the squares on the ends to stretch</span>
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
                    <span className="tex-swatch-label">{p.name}</span>
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
            <div className="object-menu-grid">
              <FeetField label="X" feet={f.x} units={units} allowZero onCommit={(n) => patchFurniture(f.id, { x: n })} />
              <FeetField label="Y" feet={f.y} units={units} allowZero onCommit={(n) => patchFurniture(f.id, { y: n })} />
              <FeetField label="Width" feet={f.w} units={units} onCommit={(n) => patchFurniture(f.id, { w: n })} />
              <FeetField label="Depth" feet={f.h} units={units} onCommit={(n) => patchFurniture(f.id, { h: n })} />
            </div>
            <div className="object-menu-grid">
              <DegField label="Angle °" rad={f.rot || 0} onCommit={(n) => patchFurniture(f.id, { rot: n })} />
            </div>
            <div className="object-menu-row">
              <button type="button" className="object-chip aw-pressable" onClick={() => rotateSelected(1)}><Icon name="rotate" /> Rotate</button>
              <button type="button" className="object-chip aw-pressable" onClick={duplicateSelected}><Icon name="copy" /> Copy</button>
            </div>
            <p className="object-menu-meta">Paint</p>
            <div className="object-menu-row object-tex-row" role="group" aria-label="Paint">
              {FURN_PAINTS.map((p) => {
                const on = samePaint(f.color, p.hex);
                return (
                  <button
                    key={p.id}
                    type="button"
                    className={`object-chip tex-swatch aw-pressable${on ? ' active' : ''}`}
                    style={{ background: p.hex ?? 'linear-gradient(135deg,#C4A074,#8B6914)' }}
                    title={p.label}
                    onClick={() => patchFurniture(f.id, { color: p.hex })}
                  >
                    <span className="tex-swatch-label">{p.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="object-menu-meta">Drag to move</p>
            <ModelPeek catalogId={f.catalogId} name={f.label} />
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
            <div className="object-menu-grid">
              <FeetField label="X" feet={f.x} units={units} allowZero onCommit={(n) => patchLandscape(f.id, { x: n })} />
              <FeetField label="Y" feet={f.y} units={units} allowZero onCommit={(n) => patchLandscape(f.id, { y: n })} />
              <FeetField label="Width" feet={f.w} units={units} onCommit={(n) => patchLandscape(f.id, { w: n })} />
              <FeetField label="Depth" feet={f.h} units={units} onCommit={(n) => patchLandscape(f.id, { h: n })} />
            </div>
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
            {r.kind !== 'outdoor' ? (
              <>
                <p className="object-menu-meta">Flooring</p>
                <div className="object-menu-row object-tex-row">
                  <button
                    type="button"
                    className={`object-chip aw-pressable${r.floorFinishId == null ? ' active' : ''}`}
                    onClick={() => patchRoom(r.id, { floorFinishId: null })}
                  >
                    House
                  </button>
                  {FLOOR_FINISHES.map((p) => {
                    const current = r.floorFinishId ?? houseFloor;
                    const on = r.floorFinishId != null && current === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        className={`object-chip tex-swatch aw-pressable${on ? ' active' : ''}`}
                        style={{ background: p.previewCss }}
                        title={p.name}
                        onClick={() => patchRoom(r.id, { floorFinishId: p.id })}
                      >
                        <span className="tex-swatch-label">{p.name}</span>
                      </button>
                    );
                  })}
                </div>
                {r.floorFinishId ? (
                  <button
                    type="button"
                    className="object-chip aw-pressable"
                    onClick={() => {
                      for (const other of floor.rooms ?? []) {
                        if (other.kind === r.kind && other.kind !== 'outdoor') {
                          patchRoom(other.id, { floorFinishId: r.floorFinishId });
                        }
                      }
                    }}
                  >
                    Same floor in every {roomType(r.kind).name.toLowerCase()}
                  </button>
                ) : null}
              </>
            ) : null}
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

      {selected.kind === 'dim' && (() => {
        const d = (floor.dimensions ?? []).find((x) => x.id === selected.id);
        const len = d ? dist({ x: d.ax, y: d.ay }, { x: d.bx, y: d.by }) : 0;
        return (
          <>
            <DockHead title="Size" onCollapse={() => setCollapsed(true)} onClose={clearSelection} />
            <p className="object-menu-meta">{formatLength(len, units)} · drag to move the label</p>
            <button type="button" className="object-del aw-pressable" onClick={deleteSelected}><Icon name="trash" /> Delete</button>
          </>
        );
      })()}

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
