import type { Point, Wall, Opening, Node, FurnitureItem } from '../types';

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function dist(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function snapPoint(p: Point, gridSize: number, snap: boolean): Point {
  if (!snap || gridSize <= 0) return p;
  return {
    x: Math.round(p.x / gridSize) * gridSize,
    y: Math.round(p.y / gridSize) * gridSize,
  };
}

export function wallEnds(wall: Wall, nodes: Node[]): { a: Point; b: Point } | null {
  const na = nodes.find((n) => n.id === wall.a);
  const nb = nodes.find((n) => n.id === wall.b);
  if (!na || !nb) return null;
  return { a: { x: na.x, y: na.y }, b: { x: nb.x, y: nb.y } };
}

export function wallLength(wall: Wall, nodes: Node[]): number {
  const e = wallEnds(wall, nodes);
  return e ? dist(e.a, e.b) : 0;
}

export function wallAngle(wall: Wall, nodes: Node[]): number {
  const e = wallEnds(wall, nodes);
  if (!e) return 0;
  return Math.atan2(e.b.y - e.a.y, e.b.x - e.a.x);
}

export function pointOnWall(wall: Wall, nodes: Node[], t: number): Point | null {
  const e = wallEnds(wall, nodes);
  if (!e) return null;
  return { x: e.a.x + (e.b.x - e.a.x) * t, y: e.a.y + (e.b.y - e.a.y) * t };
}

/** World coords are feet; display converts when units === 'm'. */
export function formatFeet(n: number): string {
  const sign = n < 0 ? '-' : '';
  const abs = Math.abs(n);
  const whole = Math.floor(abs);
  const inches = Math.round((abs - whole) * 12);
  if (inches === 0) return `${sign}${whole}'`;
  if (inches === 12) return `${sign}${whole + 1}'`;
  return `${sign}${whole}'-${inches}"`;
}

export function formatLength(n: number, units: 'ft' | 'm' = 'ft'): string {
  if (units === 'm') {
    const m = Math.abs(n) * 0.3048;
    const sign = n < 0 ? '-' : '';
    const rounded = Math.round(m * 100) / 100;
    return `${sign}${rounded.toFixed(2)} m`;
  }
  return formatFeet(n);
}

export function screenToWorld(
  sx: number, sy: number, panX: number, panY: number, zoom: number, ox: number, oy: number,
): Point {
  return { x: (sx - ox - panX) / zoom, y: (sy - oy - panY) / zoom };
}

export function nearestWall(
  walls: Wall[], nodes: Node[], p: Point, maxDist = 1.5,
): { wall: Wall; t: number; d: number } | null {
  let best: { wall: Wall; t: number; d: number } | null = null;
  for (const wall of walls) {
    const e = wallEnds(wall, nodes);
    if (!e) continue;
    const len = dist(e.a, e.b);
    if (len < 0.01) continue;
    const dx = e.b.x - e.a.x;
    const dy = e.b.y - e.a.y;
    let t = ((p.x - e.a.x) * dx + (p.y - e.a.y) * dy) / (len * len);
    t = Math.max(0.08, Math.min(0.92, t));
    const proj = { x: e.a.x + dx * t, y: e.a.y + dy * t };
    const d = dist(p, proj);
    if (d <= maxDist && (!best || d < best.d)) best = { wall, t, d };
  }
  return best;
}

export function hitFurniture(items: FurnitureItem[], p: Point): string | null {
  for (let i = items.length - 1; i >= 0; i--) {
    const f = items[i];
    const dx = p.x - f.x;
    const dy = p.y - f.y;
    const cos = Math.cos(-f.rot);
    const sin = Math.sin(-f.rot);
    const lx = dx * cos - dy * sin;
    const ly = dx * sin + dy * cos;
    if (Math.abs(lx) <= f.w / 2 && Math.abs(ly) <= f.h / 2) return f.id;
  }
  return null;
}

export function hitOpening(openings: Opening[], walls: Wall[], nodes: Node[], p: Point, thr = 0.7): string | null {
  for (let i = openings.length - 1; i >= 0; i--) {
    const o = openings[i];
    const wall = walls.find((w) => w.id === o.wallId);
    if (!wall) continue;
    const c = pointOnWall(wall, nodes, o.t);
    if (c && dist(p, c) <= thr) return o.id;
  }
  return null;
}

export function hitWall(walls: Wall[], nodes: Node[], p: Point, thr = 0.45): string | null {
  const n = nearestWall(walls, nodes, p, thr);
  return n ? n.wall.id : null;
}

/** Find or create node near point (for wall drawing). */
export function findOrCreateNode(
  nodes: Node[], p: Point, mergeDist: number,
): { nodes: Node[]; id: string } {
  for (const n of nodes) {
    if (dist(n, p) <= mergeDist) return { nodes, id: n.id };
  }
  const id = uid('n');
  return { nodes: [...nodes, { id, x: p.x, y: p.y }], id };
}
