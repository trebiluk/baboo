import type {
  DimItem,
  Floor,
  FurnitureItem,
  LandscapeItem,
  Node,
  NoteItem,
  Opening,
  Point,
  Room,
  SketchStroke,
  Wall,
} from '../types';

/** 8 ft tiles — FeatureBot awake-chunk contract. */
export const TILE_FT = 8;

export type TileKey = `${string}:${number}:${number}`;

export interface ViewportWorld {
  floorId: string;
  panX: number;
  panY: number;
  zoom: number;
  w: number;
  h: number;
}

export interface DirtyChunk {
  key: TileKey;
  floorId: string;
  cx: number;
  cy: number;
  at: string;
  nodes: Node[];
  walls: Wall[];
  openings: Opening[];
  furniture: FurnitureItem[];
  rooms: Room[];
  landscape: LandscapeItem[];
  notes: NoteItem[];
  dimensions: DimItem[];
  sketches: SketchStroke[];
}

export function tileCoord(n: number): number {
  return Math.floor(n / TILE_FT);
}

export function tileKey(floorId: string, x: number, y: number): TileKey {
  return `${floorId}:${tileCoord(x)}:${tileCoord(y)}`;
}

export function parseTileKey(key: string): { floorId: string; cx: number; cy: number } | null {
  const parts = key.split(':');
  if (parts.length < 3) return null;
  const cy = Number(parts[parts.length - 1]);
  const cx = Number(parts[parts.length - 2]);
  const floorId = parts.slice(0, -2).join(':');
  if (!floorId || !Number.isFinite(cx) || !Number.isFinite(cy)) return null;
  return { floorId, cx, cy };
}

export function pointInTile(p: Point, cx: number, cy: number): boolean {
  return tileCoord(p.x) === cx && tileCoord(p.y) === cy;
}

/** Viewport world rect plus a 1-ring neighbor halo. */
export function awakeTileKeys(view: ViewportWorld): TileKey[] {
  const zoom = Math.max(view.zoom, 0.01);
  const x0 = -view.panX / zoom;
  const y0 = -view.panY / zoom;
  const x1 = (view.w - view.panX) / zoom;
  const y1 = (view.h - view.panY) / zoom;
  const minX = Math.min(x0, x1);
  const maxX = Math.max(x0, x1);
  const minY = Math.min(y0, y1);
  const maxY = Math.max(y0, y1);
  const cx0 = tileCoord(minX) - 1;
  const cy0 = tileCoord(minY) - 1;
  const cx1 = tileCoord(maxX) + 1;
  const cy1 = tileCoord(maxY) + 1;
  const keys: TileKey[] = [];
  for (let cx = cx0; cx <= cx1; cx++) {
    for (let cy = cy0; cy <= cy1; cy++) {
      keys.push(`${view.floorId}:${cx}:${cy}`);
    }
  }
  return keys;
}

function nodeMap(nodes: Node[]): Map<string, Node> {
  return new Map(nodes.map((n) => [n.id, n]));
}

function wallTouchesTile(wall: Wall, nodes: Map<string, Node>, cx: number, cy: number): boolean {
  const a = nodes.get(wall.a);
  const b = nodes.get(wall.b);
  if (a && pointInTile(a, cx, cy)) return true;
  if (b && pointInTile(b, cx, cy)) return true;
  if (!a || !b) return false;
  const minX = Math.min(a.x, b.x);
  const maxX = Math.max(a.x, b.x);
  const minY = Math.min(a.y, b.y);
  const maxY = Math.max(a.y, b.y);
  const tx0 = cx * TILE_FT;
  const ty0 = cy * TILE_FT;
  const tx1 = tx0 + TILE_FT;
  const ty1 = ty0 + TILE_FT;
  return !(maxX < tx0 || minX > tx1 || maxY < ty0 || minY > ty1);
}

export function extractChunk(floor: Floor, key: TileKey): DirtyChunk | null {
  const parsed = parseTileKey(key);
  if (!parsed || parsed.floorId !== floor.id) return null;
  const { cx, cy } = parsed;
  const nodesById = nodeMap(floor.nodes);
  const walls = floor.walls.filter((w) => wallTouchesTile(w, nodesById, cx, cy));
  const wallIds = new Set(walls.map((w) => w.id));
  const nodeIds = new Set<string>();
  for (const w of walls) {
    nodeIds.add(w.a);
    nodeIds.add(w.b);
  }
  const nodes = floor.nodes.filter((n) => nodeIds.has(n.id) || pointInTile(n, cx, cy));
  const openings = floor.openings.filter((o) => wallIds.has(o.wallId));
  const furniture = floor.furniture.filter((item) => pointInTile(item, cx, cy));
  const rooms = (floor.rooms ?? []).filter((r) => pointInTile(r, cx, cy));
  const landscape = (floor.landscape ?? []).filter((item) => pointInTile(item, cx, cy));
  const notes = (floor.notes ?? []).filter((n) => pointInTile(n, cx, cy));
  const dimensions = (floor.dimensions ?? []).filter(
    (d) => pointInTile({ x: d.ax, y: d.ay }, cx, cy) || pointInTile({ x: d.bx, y: d.by }, cx, cy),
  );
  const sketches = (floor.sketches ?? []).filter((sk) => {
    for (let i = 0; i + 1 < sk.points.length; i += 2) {
      if (pointInTile({ x: sk.points[i], y: sk.points[i + 1] }, cx, cy)) return true;
    }
    return false;
  });
  return {
    key,
    floorId: floor.id,
    cx,
    cy,
    at: new Date().toISOString(),
    nodes,
    walls,
    openings,
    furniture,
    rooms,
    landscape,
    notes,
    dimensions,
    sketches,
  };
}

function upsert<T extends { id: string }>(list: T[], incoming: T[]): T[] {
  if (!incoming.length) return list;
  const next = [...list];
  for (const item of incoming) {
    const i = next.findIndex((x) => x.id === item.id);
    if (i >= 0) next[i] = item;
    else next.push(item);
  }
  return next;
}

/** Crash-recovery merge of leftover dirty chunks into a loaded floor. */
export function mergeChunk(floor: Floor, chunk: DirtyChunk): Floor {
  if (chunk.floorId !== floor.id) return floor;
  return {
    ...floor,
    nodes: upsert(floor.nodes, chunk.nodes),
    walls: upsert(floor.walls, chunk.walls),
    openings: upsert(floor.openings, chunk.openings),
    furniture: upsert(floor.furniture, chunk.furniture),
    rooms: upsert(floor.rooms ?? [], chunk.rooms),
    landscape: upsert(floor.landscape ?? [], chunk.landscape),
    notes: upsert(floor.notes ?? [], chunk.notes),
    dimensions: upsert(floor.dimensions ?? [], chunk.dimensions),
    sketches: upsert(floor.sketches ?? [], chunk.sketches),
  };
}
