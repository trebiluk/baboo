import { useProjectStore } from '../store/useProjectStore';
import { formatLength, pointOnWall, wallEnds, wallLength } from '../lib/geometry';
import { ROOM_CATALOG, roomType } from '../data/rooms';
import { formatArea, polygonArea, roomPolygon } from '../lib/rooms';
import type { Point } from '../types';
import { Icon } from '../icons';

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

export function selectedAnchor(
  selected: { kind: string; id: string } | null,
  floor: ReturnType<typeof useProjectStore.getState>['doc']['floors'][0],
): Point | null {
  if (!selected) return null;
  if (selected.kind === 'opening') {
    const o = floor.openings.find((x) => x.id === selected.id);
    if (!o) return null;
    const wall = floor.walls.find((w) => w.id === o.wallId);
    if (!wall) return null;
    return pointOnWall(wall, floor.nodes, o.t);
  }
  if (selected.kind === 'furniture') {
    const f = floor.furniture.find((x) => x.id === selected.id);
    return f ? { x: f.x, y: f.y + f.h / 2 } : null;
  }
  if (selected.kind === 'landscape') {
    const f = (floor.landscape ?? []).find((x) => x.id === selected.id);
    return f ? { x: f.x, y: f.y + f.h / 2 } : null;
  }
  if (selected.kind === 'note') {
    const n = (floor.notes ?? []).find((x) => x.id === selected.id);
    return n ? { x: n.x, y: n.y + 0.6 } : null;
  }
  if (selected.kind === 'dim') {
    const d = (floor.dimensions ?? []).find((x) => x.id === selected.id);
    return d ? { x: (d.ax + d.bx) / 2, y: (d.ay + d.by) / 2 } : null;
  }
  if (selected.kind === 'sketch') {
    const sk = (floor.sketches ?? []).find((x) => x.id === selected.id);
    if (!sk || sk.points.length < 2) return null;
    let minX = sk.points[0], maxX = sk.points[0], minY = sk.points[1], maxY = sk.points[1];
    for (let i = 2; i + 1 < sk.points.length; i += 2) {
      if (sk.points[i] < minX) minX = sk.points[i];
      if (sk.points[i] > maxX) maxX = sk.points[i];
      if (sk.points[i + 1] < minY) minY = sk.points[i + 1];
      if (sk.points[i + 1] > maxY) maxY = sk.points[i + 1];
    }
    return { x: (minX + maxX) / 2, y: maxY };
  }
  if (selected.kind === 'wall') {
    const w = floor.walls.find((x) => x.id === selected.id);
    if (!w) return null;
    const e = wallEnds(w, floor.nodes);
    return e ? { x: (e.a.x + e.b.x) / 2, y: (e.a.y + e.b.y) / 2 } : null;
  }
  if (selected.kind === 'room') {
    const r = (floor.rooms ?? []).find((x) => x.id === selected.id);
    return r ? { x: r.x, y: r.y + 0.7 } : null;
  }
  return null;
}

export function ObjectMenu({
  left, top, flip,
}: {
  left: number;
  top: number;
  flip?: boolean;
}) {
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
  if (!selected) return null;

  return (
    <div
      className={`object-menu${flip ? ' is-above' : ''}`}
      style={{ left, top }}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      role="dialog"
      aria-label="Object options"
    >
      {selected.kind === 'opening' && (() => {
        const o = floor.openings.find((x) => x.id === selected.id);
        if (!o) return null;
        const wall = floor.walls.find((w) => w.id === o.wallId);
        const len = wall ? wallLength(wall, floor.nodes) : 8;
        const widths = o.type === 'door' ? DOOR_WIDTHS : WIN_WIDTHS;
        const slide = o.symbolKind === 'slidingDoor';
        return (
          <>
            <div className="object-menu-head">
              <strong>{o.type === 'door' ? 'Door' : 'Window'}</strong>
              <button type="button" className="object-menu-x aw-pressable" aria-label="Close" onClick={clearSelection}>×</button>
            </div>
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
            <div className="object-menu-head">
              <strong>Wall</strong>
              <button type="button" className="object-menu-x aw-pressable" aria-label="Close" onClick={clearSelection}>×</button>
            </div>
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
            <button type="button" className="object-del aw-pressable" onClick={deleteSelected}><Icon name="trash" /> Delete</button>
          </>
        );
      })()}

      {selected.kind === 'furniture' && (() => {
        const f = floor.furniture.find((x) => x.id === selected.id);
        if (!f) return null;
        return (
          <>
            <div className="object-menu-head">
              <strong>{f.label}</strong>
              <button type="button" className="object-menu-x aw-pressable" aria-label="Close" onClick={clearSelection}>×</button>
            </div>
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
            <div className="object-menu-head">
              <strong>{f.label}</strong>
              <button type="button" className="object-menu-x aw-pressable" aria-label="Close" onClick={clearSelection}>×</button>
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
            <div className="object-menu-head">
              <strong>Room</strong>
              <button type="button" className="object-menu-x aw-pressable" aria-label="Close" onClick={clearSelection}>×</button>
            </div>
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
            <div className="object-menu-head">
              <strong>Note</strong>
              <button type="button" className="object-menu-x aw-pressable" aria-label="Close" onClick={clearSelection}>×</button>
            </div>
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
          <div className="object-menu-head">
            <strong>Size</strong>
            <button type="button" className="object-menu-x aw-pressable" aria-label="Close" onClick={clearSelection}>×</button>
          </div>
          <p className="object-menu-meta">Drag to move the label</p>
          <button type="button" className="object-del aw-pressable" onClick={deleteSelected}><Icon name="trash" /> Delete</button>
        </>
      )}

      {selected.kind === 'sketch' && (
        <>
          <div className="object-menu-head">
            <strong>Sketch</strong>
            <button type="button" className="object-menu-x aw-pressable" aria-label="Close" onClick={clearSelection}>×</button>
          </div>
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
  );
}
