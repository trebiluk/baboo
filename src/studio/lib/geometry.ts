import type { Point, Wall, Opening, Node, FurnitureItem, DimItem, NoteItem, LandscapeItem, SketchStroke } from '../types';

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

/** Snap a second point to horizontal or vertical from `from`. */
export function orthoPoint(from: Point, to: Point): Point {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (Math.abs(dx) >= Math.abs(dy)) return { x: to.x, y: from.y };
  return { x: from.x, y: to.y };
}

/** Snap a second point to 45° steps (0/45/90…). Grid keeps 45° on whole feet. */
export function polarSnapPoint(from: Point, to: Point, gridSize: number, snap: boolean): Point {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  if (len < 1e-9) return { x: from.x, y: from.y };
  const ang = Math.atan2(dy, dx);
  const oct = Math.round(ang / (Math.PI / 4));
  const snappedAng = oct * (Math.PI / 4);
  const diag = Math.abs(oct % 2) === 1;
  if (snap && gridSize > 0) {
    if (diag) {
      const ux = Math.sign(Math.cos(snappedAng)) || 1;
      const uy = Math.sign(Math.sin(snappedAng)) || 1;
      const alongLen = (dx * ux + dy * uy) / Math.SQRT2;
      const n = Math.round(Math.abs(alongLen) / (gridSize * Math.SQRT2));
      if (n === 0) return { x: from.x, y: from.y };
      const s = alongLen >= 0 ? 1 : -1;
      return { x: from.x + s * ux * n * gridSize, y: from.y + s * uy * n * gridSize };
    }
    const ux = Math.round(Math.cos(snappedAng));
    const uy = Math.round(Math.sin(snappedAng));
    const along = dx * ux + dy * uy;
    const n = Math.round(along / gridSize) * gridSize;
    return { x: from.x + ux * n, y: from.y + uy * n };
  }
  return {
    x: from.x + Math.cos(snappedAng) * len,
    y: from.y + Math.sin(snappedAng) * len,
  };
}

/** Straight walls: 45° polar snap. Shift / forceOrtho = 90° only. */
export function snapWallEnd(
  from: Point,
  to: Point,
  opts: { ortho: boolean; forceOrtho?: boolean; snap: boolean; gridSize: number },
): Point {
  if (opts.forceOrtho) return snapPoint(orthoPoint(from, to), opts.gridSize, opts.snap);
  if (!opts.ortho) return snapPoint(to, opts.gridSize, opts.snap);
  return polarSnapPoint(from, to, opts.gridSize, opts.snap);
}

export function isDiagonal(a: Point, b: Point, eps = 0.2): boolean {
  return Math.abs(b.x - a.x) > eps && Math.abs(b.y - a.y) > eps;
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

export function hitLandscape(items: LandscapeItem[], p: Point): string | null {
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

export function hitNote(items: NoteItem[], p: Point): string | null {
  for (let i = items.length - 1; i >= 0; i--) {
    const n = items[i];
    const w = Math.max(2.2, n.text.length * 0.28);
    if (Math.abs(p.x - n.x) <= w / 2 && Math.abs(p.y - n.y) <= 0.7) return n.id;
  }
  return null;
}

export function projectOnSegment(a: Point, b: Point, p: Point): { t: number; d: number; q: Point } {
  const len2 = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
  if (len2 < 1e-8) return { t: 0, d: dist(a, p), q: { x: a.x, y: a.y } };
  let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / len2;
  t = Math.max(0, Math.min(1, t));
  const q = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  return { t, d: dist(q, p), q };
}

function distToSegment(a: Point, b: Point, p: Point): number {
  return projectOnSegment(a, b, p).d;
}

export function hitDimension(items: DimItem[], p: Point, thr = 0.5): string | null {
  for (let i = items.length - 1; i >= 0; i--) {
    const d = items[i];
    if (distToSegment({ x: d.ax, y: d.ay }, { x: d.bx, y: d.by }, p) <= thr) return d.id;
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

/** If a node sits on an existing wall, split that wall so rooms can close (chamfers, T-joins). */
export function splitWallsAtNode(
  walls: Wall[],
  openings: Opening[],
  nodes: Node[],
  nodeId: string,
  mergeDist: number,
): { walls: Wall[]; openings: Opening[] } {
  const n = nodes.find((x) => x.id === nodeId);
  if (!n) return { walls, openings };
  const nextWalls: Wall[] = [];
  let nextOpen = openings;
  for (const w of walls) {
    if (w.a === nodeId || w.b === nodeId) {
      nextWalls.push(w);
      continue;
    }
    const e = wallEnds(w, nodes);
    if (!e) {
      nextWalls.push(w);
      continue;
    }
    const hit = projectOnSegment(e.a, e.b, n);
    if (hit.d > mergeDist || hit.t < 0.04 || hit.t > 0.96) {
      nextWalls.push(w);
      continue;
    }
    const w1: Wall = { ...w, id: uid('w'), b: nodeId };
    const w2: Wall = { ...w, id: uid('w'), a: nodeId };
    nextWalls.push(w1, w2);
    nextOpen = nextOpen.flatMap((o) => {
      if (o.wallId !== w.id) return [o];
      if (o.t <= hit.t) {
        const t = hit.t < 1e-6 ? 0.5 : Math.min(0.92, Math.max(0.08, o.t / hit.t));
        return [{ ...o, wallId: w1.id, t }];
      }
      const t = Math.min(0.92, Math.max(0.08, (o.t - hit.t) / (1 - hit.t)));
      return [{ ...o, wallId: w2.id, t }];
    });
  }
  return { walls: nextWalls, openings: nextOpen };
}

export function polylinePoints(flat: number[]): Point[] {
  const out: Point[] = [];
  for (let i = 0; i + 1 < flat.length; i += 2) out.push({ x: flat[i], y: flat[i + 1] });
  return out;
}

export function flattenPoints(pts: Point[]): number[] {
  const out: number[] = [];
  for (const p of pts) out.push(p.x, p.y);
  return out;
}

export function polylineLength(flat: number[]): number {
  let len = 0;
  for (let i = 2; i + 1 < flat.length; i += 2) {
    len += Math.hypot(flat[i] - flat[i - 2], flat[i + 1] - flat[i - 1]);
  }
  return len;
}

/** Ramer–Douglas–Peucker. `flat` is [x,y,x,y,…]; `epsilon` is in plan-feet. */
export function simplifyPolyline(flat: number[], epsilon: number): number[] {
  const pts = polylinePoints(flat);
  if (pts.length <= 2) return flat.slice();
  const keep = new Array(pts.length).fill(false);
  keep[0] = true;
  keep[pts.length - 1] = true;
  const rec = (a: number, b: number) => {
    let maxD = 0;
    let idx = -1;
    for (let i = a + 1; i < b; i++) {
      const d = distToSegment(pts[a], pts[b], pts[i]);
      if (d > maxD) {
        maxD = d;
        idx = i;
      }
    }
    if (maxD > epsilon && idx >= 0) {
      keep[idx] = true;
      rec(a, idx);
      rec(idx, b);
    }
  };
  rec(0, pts.length - 1);
  const out: number[] = [];
  for (let i = 0; i < pts.length; i++) {
    if (keep[i]) {
      out.push(pts[i].x, pts[i].y);
    }
  }
  return out;
}

export function hitSketch(items: SketchStroke[], p: Point, thr = 0.5): string | null {
  for (let i = items.length - 1; i >= 0; i--) {
    const pts = items[i].points;
    for (let j = 2; j + 1 < pts.length; j += 2) {
      if (distToSegment(
        { x: pts[j - 2], y: pts[j - 1] },
        { x: pts[j], y: pts[j + 1] },
        p,
      ) <= thr) return items[i].id;
    }
  }
  return null;
}

