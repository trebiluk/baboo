/**
 * Repair a plan floor read from a file or from this Chromebook (2.13.49).
 * Drops pieces that would break drawing (missing corners, NaN numbers, walls to nowhere)
 * and fills in missing words, so one bad piece never breaks the whole plan.
 */
import type { Floor, Node, Wall, Opening, FurnitureItem, Room, RoomKind, DimItem, NoteItem } from '../types';

/** Farthest a corner may sit from the middle of the grid, in feet. */
export const MAX_COORD_FT = 5000;
const ROOM_KINDS: RoomKind[] = ['entry', 'living', 'kitchen', 'dining', 'bedroom', 'bath', 'office', 'utility', 'storage', 'outdoor', 'other'];

const num = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const coord = (v: unknown): v is number => num(v) && Math.abs(v) <= MAX_COORD_FT;
const obj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const str = (v: unknown, d: string) => (typeof v === 'string' ? v : d);
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Keep only the first item for each id. */
function uniq<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((i) => (seen.has(i.id) ? false : (seen.add(i.id), true)));
}

export type RepairReport = { dropped: number };

export function repairFloor(input: unknown, report: RepairReport = { dropped: 0 }): Floor {
  const f = (obj(input) ? input : {}) as Partial<Floor> & Record<string, unknown>;
  const count = (before: unknown[], after: unknown[]) => { report.dropped += before.length - after.length; };

  const rawNodes = list(f.nodes);
  const nodes = uniq(rawNodes.filter((n): n is Node => obj(n) && typeof n.id === 'string' && coord(n.x) && coord(n.y)));
  count(rawNodes, nodes);
  const nodeIds = new Set(nodes.map((n) => n.id));

  const rawWalls = list(f.walls);
  const walls = uniq(
    rawWalls
      .filter((w): w is Wall => obj(w) && typeof w.id === 'string' && nodeIds.has(w.a as string) && nodeIds.has(w.b as string) && w.a !== w.b)
      .map((w) => {
        const kind: Wall['kind'] = w.kind === 'interior' ? 'interior' : 'exterior';
        const thickness = num(w.thickness) && w.thickness > 0 ? clamp(w.thickness, 0.15, 3) : kind === 'interior' ? 0.4 : 0.66;
        return { ...w, kind, thickness };
      }),
  );
  count(rawWalls, walls);
  const wallIds = new Set(walls.map((w) => w.id));

  const rawOpen = list(f.openings);
  const openings = uniq(
    rawOpen
      .filter((o): o is Opening => obj(o) && typeof o.id === 'string' && wallIds.has(o.wallId as string) && num(o.t) && num(o.width) && o.width > 0)
      .map((o) => {
        const type: Opening['type'] = o.type === 'window' || o.type === 'door'
          ? o.type
          : o.symbolKind === 'windowFixed' ? 'window' : 'door';
        const symbolKind: Opening['symbolKind'] = o.symbolKind === 'swingDoor' || o.symbolKind === 'slidingDoor' || o.symbolKind === 'windowFixed'
          ? o.symbolKind
          : type === 'window' ? 'windowFixed' : 'swingDoor';
        return { ...o, type, symbolKind, t: clamp(o.t, 0, 1), width: Math.min(o.width, 40) };
      }),
  );
  count(rawOpen, openings);

  const rawFurn = list(f.furniture);
  const furniture = uniq(
    rawFurn
      .filter((i): i is FurnitureItem => obj(i) && typeof i.id === 'string' && coord(i.x) && coord(i.y))
      .map((i) => ({
        ...i,
        catalogId: str(i.catalogId, 'box'),
        w: num(i.w) && i.w > 0 ? Math.min(i.w, 200) : 2,
        h: num(i.h) && i.h > 0 ? Math.min(i.h, 200) : 2,
        rot: num(i.rot) ? i.rot : 0,
        zIndex: num(i.zIndex) ? i.zIndex : 0,
        label: str(i.label, ''),
      })),
  );
  count(rawFurn, furniture);

  const rawRooms = list(f.rooms);
  const rooms = uniq(
    rawRooms
      .filter((r): r is Room => obj(r) && typeof r.id === 'string' && coord(r.x) && coord(r.y))
      .map((r) => ({
        ...r,
        kind: ROOM_KINDS.includes(r.kind) ? r.kind : 'other',
        name: str(r.name, ''),
      })),
  );
  count(rawRooms, rooms);

  const rawDims = list(f.dimensions);
  const dimensions = rawDims.filter((d): d is DimItem => obj(d) && typeof d.id === 'string' && coord(d.ax) && coord(d.ay) && coord(d.bx) && coord(d.by));
  count(rawDims, dimensions);
  const rawNotes = list(f.notes);
  const notes = rawNotes
    .filter((n): n is NoteItem => obj(n) && typeof n.id === 'string' && coord(n.x) && coord(n.y))
    .map((n) => ({ ...n, text: str(n.text, '') }));
  count(rawNotes, notes);
  const rawLand = list(f.landscape);
  const landscape = rawLand.filter((l) => obj(l) && typeof l.id === 'string' && coord(l.x) && coord(l.y)) as Floor['landscape'];
  count(rawLand, landscape);

  return {
    ...(f as Floor),
    id: str(f.id, 'floor-1'),
    name: str(f.name, 'Floor 1'),
    elevation: num(f.elevation) ? f.elevation : 0,
    nodes,
    walls,
    openings,
    furniture,
    rooms,
    dimensions,
    notes,
    landscape,
  };
}
