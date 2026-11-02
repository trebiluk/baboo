import { useEffect, useRef, useState } from 'react';
import { t, tipLoc } from '../data/i18n';
import { furnLabel } from '../data/furniture';
import { useProjectStore } from '../store/useProjectStore';
import { formatLength, parseFeet, wallLength, dist } from '../lib/geometry';
import { ROOM_CATALOG, roomLabel, roomType } from '../data/rooms';
import { formatArea, polygonArea, roomBundle, roomPolygon } from '../lib/rooms';
import { Icon } from '../icons';
import { TEXTURE_PACKS } from '../data/textures';
import { FLOOR_FINISHES, asFloorFinish } from '../data/flooring';
import { FURN_PAINTS, samePaint } from '../data/furnPaint';
import { ModelPeek } from './ModelPeek';
import { WALL_PAINTS, WALL_SKINS, faceLookup, storedFace, wallFaces, withFace } from '../lib/finishes';

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

/**
 * The note's text box. A new note grabs the keyboard with its text selected, so typing replaces "Note" instead of
 * firing tool shortcuts (T, N, H...). It waits a moment: the click that made the note would otherwise take focus back (2.13.19).
 */
function NoteText({ value, fresh, onChange, label }: { value: string; fresh: boolean; onChange: (v: string) => void; label: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const freshAtMount = useRef(fresh);
  useEffect(() => {
    if (!freshAtMount.current) return;
    const id = window.setTimeout(() => {
      ref.current?.focus();
      ref.current?.select();
    }, 120);
    return () => window.clearTimeout(id);
  }, []);
  return <input ref={ref} value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} />;
}

function DockHead({ title, onCollapse, onClose }: { title: string; onCollapse: () => void; onClose: () => void }) {
  const locale = tipLoc(useProjectStore((s) => s.doc.settings));
  return (
    <div className="object-menu-head">
      <strong>{title}</strong>
      <span className="object-menu-actions">
        <button type="button" className="inspect-collapse aw-pressable" onClick={onCollapse} title={t(locale, 'obj.collapse')} aria-label={t(locale, 'obj.collapseAria')}>
          <Icon name="min" />
        </button>
        <button type="button" className="object-menu-x aw-pressable" aria-label={t(locale, 'obj.close')} onClick={onClose}>×</button>
      </span>
    </div>
  );
}

export function ObjectMenu() {
  const selected = useProjectStore((s) => s.selected);
  const floor = useProjectStore((s) => s.doc.floors[0]);
  const units = useProjectStore((s) => s.doc.settings.units) || 'ft';
  const locale = tipLoc(useProjectStore((s) => s.doc.settings));
  // A piece still named like the catalog shows its name in the kid's language; a renamed piece keeps its name.
  const furnName = (catalogId: string, label: string) => furnLabel(locale, catalogId, label);
  const houseFloor = useProjectStore((s) => asFloorFinish(s.doc.settings.floorFinishId));
  const styleId = useProjectStore((s) => s.doc.settings.styleId);
  const patchOpening = useProjectStore((s) => s.patchOpening);
  const patchWall = useProjectStore((s) => s.patchWall);
  const patchFurniture = useProjectStore((s) => s.patchFurniture);
  const patchLandscape = useProjectStore((s) => s.patchLandscape);
  const setWallLength = useProjectStore((s) => s.setWallLength);
  const patchRoom = useProjectStore((s) => s.patchRoom);
  const patchRooms = useProjectStore((s) => s.patchRooms);
  const renameRoom = useProjectStore((s) => s.renameRoom);
  const setRoomWallKind = useProjectStore((s) => s.setRoomWallKind);
  const setSelected = useProjectStore((s) => s.setSelected);
  const renameNote = useProjectStore((s) => s.renameNote);
  const deleteSelected = useProjectStore((s) => s.deleteSelected);
  const traceSketch = useProjectStore((s) => s.traceSketch);
  const rotateSelected = useProjectStore((s) => s.rotateSelected);
  const duplicateSelected = useProjectStore((s) => s.duplicateSelected);
  const clearSelection = useProjectStore((s) => s.clearSelection);
  const [collapsed, setCollapsed] = useState(false);

  const viewMode = useProjectStore((s) => s.viewMode);
  useEffect(() => {
    setCollapsed(false);
  }, [selected?.kind, selected?.id]);
  // In 3D the panel folds to its small tab, so it does not cover a third of the view; tap it to open (2.13.27).
  const autoFolded = useRef(false);
  useEffect(() => {
    const in3d = viewMode === 'solid3d' || viewMode === 'walkthrough';
    if (in3d) {
      autoFolded.current = true;
      setCollapsed(true);
    } else if (autoFolded.current) {
      // back in 2D or the Dollhouse: open again if it was 3D that folded it
      autoFolded.current = false;
      setCollapsed(false);
    }
  }, [viewMode]);

  if (!selected) return null;

  const title =
    selected.kind === 'opening' ? (floor.openings.find((x) => x.id === selected.id)?.type === 'window' ? t(locale, 'tool.window') : t(locale, 'tool.door'))
      : selected.kind === 'wall' ? t(locale, 'tool.wall')
        : selected.kind === 'furniture' ? (floor.furniture.find((x) => x.id === selected.id)?.label ?? t(locale, 'furn.title'))
          : selected.kind === 'landscape' ? (floor.landscape.find((x) => x.id === selected.id)?.label ?? t(locale, 'tool.plant'))
            : selected.kind === 'room' ? t(locale, 'tool.room')
              : selected.kind === 'note' ? t(locale, 'tool.note')
                : selected.kind === 'dim' ? t(locale, 'tool.dim')
                  : selected.kind === 'sketch' ? t(locale, 'tool.sketch')
                    : t(locale, 'obj.edit');

  return (
    <aside
      className={`inspect-dock${collapsed ? ' is-min' : ''}`}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      role="dialog"
      aria-label={t(locale, 'obj.editSel')}
      aria-expanded={!collapsed}
    >
      {collapsed ? (
        <button
          type="button"
          className="inspect-chip aw-pressable"
          onClick={() => setCollapsed(false)}
          title={t(locale, 'obj.openPanel')}
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
            <DockHead title={o.type === 'door' ? t(locale, 'tool.door') : t(locale, 'tool.window')} onCollapse={() => setCollapsed(true)} onClose={clearSelection} />
            <div className="object-menu-row" role="group" aria-label={t(locale, 'obj.width')}>
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
              <p className="object-menu-meta">{t(locale, 'obj.dogDoor')}</p>
            )}
            {o.type === 'door' && (
              <div className="object-menu-row">
                <button
                  type="button"
                  className={`object-chip aw-pressable${!slide && o.swing !== 'right' ? ' active' : ''}`}
                  onClick={() => patchOpening(o.id, { symbolKind: 'swingDoor', swing: 'left' })}
                >
                  {t(locale, 'obj.swingL')}
                </button>
                <button
                  type="button"
                  className={`object-chip aw-pressable${!slide && o.swing === 'right' ? ' active' : ''}`}
                  onClick={() => patchOpening(o.id, { symbolKind: 'swingDoor', swing: 'right' })}
                >
                  {t(locale, 'obj.swingR')}
                </button>
                <button
                  type="button"
                  className={`object-chip aw-pressable${slide ? ' active' : ''}`}
                  onClick={() => patchOpening(o.id, { symbolKind: 'slidingDoor' })}
                >
                  {t(locale, 'obj.slide')}
                </button>
              </div>
            )}
            <div className="object-menu-row">
              <button
                type="button"
                className="object-chip aw-pressable"
                onClick={() => patchOpening(o.id, { t: o.t - 0.06 })}
                aria-label={t(locale, 'obj.slideAlong')}
              >
                ←
              </button>
              <button
                type="button"
                className="object-chip aw-pressable"
                onClick={() => patchOpening(o.id, { t: o.t + 0.06 })}
                aria-label={t(locale, 'obj.slideBack')}
              >
                →
              </button>
              <span className="object-menu-meta">{t(locale, 'obj.wide', { w: formatLength(Math.min(o.width, len), units) })}</span>
            </div>
            <div className="object-menu-grid">
              <FeetField label={t(locale, 'obj.width')} feet={o.width} units={units} onCommit={(n) => patchOpening(o.id, { width: n })} />
            </div>
            <button type="button" className="object-del aw-pressable" onClick={deleteSelected}><Icon name="trash" /> {t(locale, 'obj.delete')}</button>
          </>
        );
      })()}

      {selected.kind === 'wall' && (() => {
        const w = floor.walls.find((x) => x.id === selected.id);
        if (!w) return null;
        const thickIn = Math.round((w.thickness || 0.5) * 12);
        return (
          <>
            <DockHead title={t(locale, 'tool.wall')} onCollapse={() => setCollapsed(true)} onClose={clearSelection} />
            <div className="object-menu-row">
              <button
                type="button"
                className={`object-chip aw-pressable${w.kind === 'exterior' ? ' active' : ''}`}
                onClick={() => patchWall(w.id, { kind: 'exterior' })}
              >
                {t(locale, 'obj.outside')}
              </button>
              <button
                type="button"
                className={`object-chip aw-pressable${w.kind === 'interior' ? ' active' : ''}`}
                onClick={() => patchWall(w.id, { kind: 'interior' })}
              >
                {t(locale, 'obj.inside')}
              </button>
            </div>
            <div className="object-menu-grid">
              <FeetField
                label={t(locale, 'obj.length')}
                feet={wallLength(w, floor.nodes)}
                units={units}
                onCommit={(n) => setWallLength(w.id, n)}
              />
              <FeetField
                label={t(locale, 'obj.thick')}
                feet={w.thickness || 0.5}
                units={units}
                onCommit={(n) => patchWall(w.id, { thickness: n })}
              />
            </div>
            <div className="object-menu-row" role="group" aria-label={t(locale, 'wall.thickness')}>
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
              <span className="object-menu-meta">{t(locale, 'obj.stretch')}</span>
            </div>
            {/* Each side of this wall section, on its own (2.13.24). */}
            {wallFaces(w, faceLookup(floor)).map((rf) => {
              const mine = storedFace(w, rf.side);
              const title = rf.room && !rf.outside
                ? t(locale, 'face.room', { room: roomLabel(locale, rf.room) })
                : w.kind === 'exterior' ? t(locale, 'face.outside') : t(locale, 'face.other');
              return (
                <div key={rf.side} className="face-block" role="group" aria-label={title}>
                  <p className="object-menu-meta face-title">{title}</p>
                  {rf.outside && w.kind === 'exterior' ? (
                    <div className="object-menu-row object-tex-row" role="group" aria-label={t(locale, 'face.cover')}>
                      {WALL_SKINS.map((k) => (
                        <button
                          key={k.id}
                          type="button"
                          className={`object-chip tex-swatch aw-pressable${rf.skin === k.id ? ' active' : ''}`}
                          style={{ background: k.previewCss }}
                          aria-pressed={rf.skin === k.id}
                          onClick={() => patchWall(w.id, { faces: withFace(w, rf.side, { skin: k.id }) })}
                        >
                          <span className="tex-swatch-label">{t(locale, `skin.${k.id}`)}</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                  {rf.outside && w.kind === 'exterior' ? <p className="object-menu-meta">{t(locale, 'obj.paint')}</p> : null}
                  <div className="object-menu-row object-tex-row" role="group" aria-label={t(locale, 'obj.paint')}>
                    <button
                      type="button"
                      className={`object-chip aw-pressable${!mine?.paint ? ' active' : ''}`}
                      aria-pressed={!mine?.paint}
                      onClick={() => patchWall(w.id, { faces: withFace(w, rf.side, { paint: null }) })}
                    >
                      {rf.outside ? t(locale, 'obj.house') : t(locale, 'face.roomPaint')}
                    </button>
                    {WALL_PAINTS.map((p) => {
                      const on = samePaint(mine?.paint, p.hex);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          className={`object-chip tex-swatch aw-pressable${on ? ' active' : ''}`}
                          style={{ background: p.hex }}
                          aria-pressed={on}
                          onClick={() => patchWall(w.id, { faces: withFace(w, rf.side, { paint: p.hex }) })}
                        >
                          <span className="tex-swatch-label">{t(locale, `paint.${p.id}`)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {/* Wallpaper only shows in the Dollhouse: tucked away so the sides come first (2.13.25). */}
            <details className="object-more">
              <summary className="object-menu-meta">{t(locale, 'obj.wallpaper')}</summary>
            <div className="object-menu-row object-tex-row" role="group" aria-label={t(locale, 'obj.wallpaper')}>
              {TEXTURE_PACKS.filter((p) => p.id !== 'import:local').map((p) => {
                const on = (p.id === 'pack:plain' && !w.finishId) || w.finishId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    className={`object-chip tex-swatch aw-pressable${on ? ' active' : ''}`}
                    style={{ background: p.previewCss }}
                    title={t(locale, `tex.${p.id.replace(':', '.')}`)}
                    onClick={() => patchWall(w.id, { finishId: p.id === 'pack:plain' ? null : p.id })}
                  >
                    <span className="tex-swatch-label">{t(locale, `tex.${p.id.replace(':', '.')}`)}</span>
                  </button>
                );
              })}
            </div>
            </details>
            <button type="button" className="object-del aw-pressable" onClick={deleteSelected}><Icon name="trash" /> {t(locale, 'obj.delete')}</button>
          </>
        );
      })()}

      {selected.kind === 'furniture' && (() => {
        const f = floor.furniture.find((x) => x.id === selected.id);
        if (!f) return null;
        return (
          <>
            <DockHead title={furnName(f.catalogId, f.label)} onCollapse={() => setCollapsed(true)} onClose={clearSelection} />
            <div className="object-menu-grid">
              <FeetField label="X" feet={f.x} units={units} allowZero onCommit={(n) => patchFurniture(f.id, { x: n })} />
              <FeetField label="Y" feet={f.y} units={units} allowZero onCommit={(n) => patchFurniture(f.id, { y: n })} />
              <FeetField label={t(locale, 'obj.width')} feet={f.w} units={units} onCommit={(n) => patchFurniture(f.id, { w: n })} />
              <FeetField label={t(locale, 'obj.depth')} feet={f.h} units={units} onCommit={(n) => patchFurniture(f.id, { h: n })} />
            </div>
            <div className="object-menu-grid">
              <DegField label={t(locale, 'obj.angle')} rad={f.rot || 0} onCommit={(n) => patchFurniture(f.id, { rot: n })} />
            </div>
            <div className="object-menu-row">
              <button type="button" className="object-chip aw-pressable" onClick={() => rotateSelected(1)}><Icon name="rotate" /> {t(locale, 'obj.rotate')}</button>
              <button type="button" className="object-chip aw-pressable" onClick={duplicateSelected}><Icon name="copy" /> {t(locale, 'tool.copy')}</button>
            </div>
            <p className="object-menu-meta">{t(locale, 'obj.paint')}</p>
            <div className="object-menu-row object-tex-row" role="group" aria-label={t(locale, 'obj.paint')}>
              {FURN_PAINTS.map((p) => {
                const on = samePaint(f.color, p.hex);
                return (
                  <button
                    key={p.id}
                    type="button"
                    className={`object-chip tex-swatch aw-pressable${on ? ' active' : ''}`}
                    style={{ background: p.hex ?? 'linear-gradient(135deg,#C4A074,#8B6914)' }}
                    title={t(locale, `paint.${p.id}`)}
                    onClick={() => patchFurniture(f.id, { color: p.hex })}
                  >
                    <span className="tex-swatch-label">{t(locale, `paint.${p.id}`)}</span>
                  </button>
                );
              })}
            </div>
            <p className="object-menu-meta">{t(locale, 'obj.dragMove')}</p>
            <ModelPeek catalogId={f.catalogId} name={furnName(f.catalogId, f.label)} />
            <button type="button" className="object-del aw-pressable" onClick={deleteSelected}><Icon name="trash" /> {t(locale, 'obj.delete')}</button>
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
              <FeetField label={t(locale, 'obj.width')} feet={f.w} units={units} onCommit={(n) => patchLandscape(f.id, { w: n })} />
              <FeetField label={t(locale, 'obj.depth')} feet={f.h} units={units} onCommit={(n) => patchLandscape(f.id, { h: n })} />
            </div>
            <p className="object-menu-meta">{t(locale, 'obj.dragMove')}</p>
            <button type="button" className="object-del aw-pressable" onClick={deleteSelected}><Icon name="trash" /> {t(locale, 'obj.delete')}</button>
          </>
        );
      })()}

      {selected.kind === 'room' && (() => {
        const r = (floor.rooms ?? []).find((x) => x.id === selected.id);
        if (!r) return null;
        const poly = roomPolygon(r, floor.nodes, floor.walls);
        return (
          <>
            <DockHead title={roomLabel(locale, r)} onCollapse={() => setCollapsed(true)} onClose={clearSelection} />
            <label className="object-menu-field">
              <span>{t(locale, 'obj.name')}</span>
              <input value={r.name} onChange={(e) => renameRoom(r.id, e.target.value)} aria-label={t(locale, 'obj.roomName')} />
            </label>
            <label className="object-menu-field">
              <span>{t(locale, 'obj.type')}</span>
              <select value={r.kind} onChange={(e) => patchRoom(r.id, { kind: e.target.value as typeof r.kind })}>
                {ROOM_CATALOG.map((c) => (
                  <option key={c.id} value={c.id}>{t(locale, `room.kind.${c.id}`)}</option>
                ))}
              </select>
            </label>
            <p className="object-menu-meta">
              {poly ? formatArea(polygonArea(poly), units) : t(locale, 'obj.openArea')}
              {' · '}{t(locale, `room.blurb.${r.kind}`)}
            </p>
            {r.kind !== 'outdoor' ? (
              <>
                <p className="object-menu-meta">{t(locale, 'floor.title')}</p>
                <div className="object-menu-row object-tex-row">
                  <button
                    type="button"
                    className={`object-chip aw-pressable${r.floorFinishId == null ? ' active' : ''}`}
                    onClick={() => patchRoom(r.id, { floorFinishId: null })}
                  >
                    {t(locale, 'obj.house')}
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
                        title={t(locale, `floor.${p.id}`)}
                        onClick={() => patchRoom(r.id, { floorFinishId: p.id })}
                      >
                        <span className="tex-swatch-label">{t(locale, `floor.${p.id}`)}</span>
                      </button>
                    );
                  })}
                </div>
                {r.floorFinishId ? (
                  <button
                    type="button"
                    className="object-chip aw-pressable"
                    onClick={() => patchRooms((floor.rooms ?? []).filter((o) => o.kind === r.kind && o.kind !== 'outdoor').map((o) => o.id), { floorFinishId: r.floorFinishId })}
                  >
                    {t(locale, 'obj.sameFloor', { room: t(locale, `room.kind.${r.kind}`) })}
                  </button>
                ) : null}
                {/* Paint for this room's walls; a wall side can still have its own (2.13.24). */}
                <p className="object-menu-meta">{t(locale, 'obj.wallPaint')}</p>
                <div className="object-menu-row object-tex-row" role="group" aria-label={t(locale, 'obj.wallPaint')}>
                  <button
                    type="button"
                    className={`object-chip aw-pressable${!r.wallPaint ? ' active' : ''}`}
                    aria-pressed={!r.wallPaint}
                    onClick={() => patchRoom(r.id, { wallPaint: null })}
                  >
                    {t(locale, 'obj.house')}
                  </button>
                  {WALL_PAINTS.map((p) => {
                    const on = samePaint(r.wallPaint, p.hex);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        className={`object-chip tex-swatch aw-pressable${on ? ' active' : ''}`}
                        style={{ background: p.hex }}
                        aria-pressed={on}
                        onClick={() => patchRoom(r.id, { wallPaint: p.hex })}
                      >
                        <span className="tex-swatch-label">{t(locale, `paint.${p.id}`)}</span>
                      </button>
                    );
                  })}
                </div>
                {r.wallPaint ? (
                  <button
                    type="button"
                    className="object-chip aw-pressable"
                    onClick={() => patchRooms((floor.rooms ?? []).filter((o) => o.kind === r.kind).map((o) => o.id), { wallPaint: r.wallPaint })}
                  >
                    {t(locale, 'obj.sameWalls', { room: t(locale, `room.kind.${r.kind}`) })}
                  </button>
                ) : null}
              </>
            ) : (
              <>
                {/* Outdoor rooms: grass, or a picked ground like pavers or a wood deck (2.13.24). */}
                <p className="object-menu-meta">{t(locale, 'obj.ground')}</p>
                <div className="object-menu-row object-tex-row" role="group" aria-label={t(locale, 'obj.ground')}>
                  <button
                    type="button"
                    className={`object-chip tex-swatch aw-pressable${r.floorFinishId == null ? ' active' : ''}`}
                    style={{ background: 'repeating-linear-gradient(80deg,#6FA05A 0 3px,#5E8E4C 3px 5px)' }}
                    aria-pressed={r.floorFinishId == null}
                    onClick={() => patchRoom(r.id, { floorFinishId: null })}
                  >
                    <span className="tex-swatch-label">{t(locale, 'obj.grass')}</span>
                  </button>
                  {FLOOR_FINISHES.filter((p) => ['brick', 'slate', 'concrete', 'terracotta', 'oak', 'walnut'].includes(p.id)).map((p) => {
                    const on = r.floorFinishId === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        className={`object-chip tex-swatch aw-pressable${on ? ' active' : ''}`}
                        style={{ background: p.previewCss }}
                        aria-pressed={on}
                        onClick={() => patchRoom(r.id, { floorFinishId: p.id })}
                      >
                        <span className="tex-swatch-label">{t(locale, `floor.${p.id}`)}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
            {(() => {
              const bundle = roomBundle(r, floor.nodes, floor.walls, floor.openings, floor.furniture);
              const doors = bundle.openings.filter((o) => o.type === 'door');
              const windows = bundle.openings.filter((o) => o.type !== 'door');
              const exterior = bundle.walls.filter((w) => w.kind !== 'interior').length;
              return (
                <>
                  <p className="object-menu-meta">
                    {t(locale, 'obj.roomCounts', { w: String(bundle.walls.length), e: String(exterior), d: String(doors.length), n: String(windows.length), f: String(bundle.furniture.length) })}
                  </p>
                  <div className="object-menu-row">
                    <button type="button" className="object-chip aw-pressable" onClick={() => setRoomWallKind(r.id, 'exterior')}>{t(locale, 'obj.extWalls')}</button>
                    <button type="button" className="object-chip aw-pressable" onClick={() => setRoomWallKind(r.id, 'interior')}>{t(locale, 'obj.intWalls')}</button>
                  </div>
                  {bundle.openings.map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      className="object-chip aw-pressable"
                      onClick={() => setSelected({ kind: 'opening', id: o.id })}
                    >
                      {o.type === 'door' ? t(locale, 'tool.door') : t(locale, 'tool.window')}
                    </button>
                  ))}
                  {bundle.furniture.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="object-chip aw-pressable"
                      onClick={() => setSelected({ kind: 'furniture', id: item.id })}
                    >
                      {furnName(item.catalogId, item.label)}
                    </button>
                  ))}
                </>
              );
            })()}
            <button type="button" className="object-del aw-pressable" onClick={deleteSelected}><Icon name="trash" /> {t(locale, 'obj.delete')}</button>
          </>
        );
      })()}

      {selected.kind === 'note' && (() => {
        const n = (floor.notes ?? []).find((x) => x.id === selected.id);
        if (!n) return null;
        return (
          <>
            <DockHead title={t(locale, 'tool.note')} onCollapse={() => setCollapsed(true)} onClose={clearSelection} />
            <label className="object-menu-field">
              <span>{t(locale, 'obj.text')}</span>
              {/* A new note ("Note") takes the keyboard right away, text selected, so typing replaces it
                  instead of firing tool shortcuts (T, N, H...) (2.13.19). */}
              <NoteText
                key={n.id}
                value={n.text}
                fresh={n.text === 'Note'}
                onChange={(v) => renameNote(n.id, v)}
                label={t(locale, 'obj.noteText')}
              />
            </label>
            <button type="button" className="object-del aw-pressable" onClick={deleteSelected}><Icon name="trash" /> {t(locale, 'obj.delete')}</button>
          </>
        );
      })()}

      {selected.kind === 'dim' && (() => {
        const d = (floor.dimensions ?? []).find((x) => x.id === selected.id);
        const len = d ? dist({ x: d.ax, y: d.ay }, { x: d.bx, y: d.by }) : 0;
        return (
          <>
            <DockHead title={t(locale, 'tool.dim')} onCollapse={() => setCollapsed(true)} onClose={clearSelection} />
            <p className="object-menu-meta">{t(locale, 'obj.sizeLead', { len: formatLength(len, units) })}</p>
            <button type="button" className="object-del aw-pressable" onClick={deleteSelected}><Icon name="trash" /> {t(locale, 'obj.delete')}</button>
          </>
        );
      })()}

      {selected.kind === 'sketch' && (
        <>
          <DockHead title={t(locale, 'tool.sketch')} onCollapse={() => setCollapsed(true)} onClose={clearSelection} />
          <p className="object-menu-meta">{t(locale, 'obj.sketchLead')}</p>
          <div className="object-menu-row">
            <button type="button" className="object-chip aw-pressable" onClick={() => traceSketch()}>
              {t(locale, 'obj.trace')}
            </button>
          </div>
          <button type="button" className="object-del aw-pressable" onClick={deleteSelected}><Icon name="trash" /> {t(locale, 'obj.delete')}</button>
        </>
      )}
        </div>
      )}
    </aside>
  );
}
