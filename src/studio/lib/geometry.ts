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

/**
 * Drafting convention: a dimension never reads upside down. Angles fold into
 * [-90, 90) so a label reads left to right, or bottom to top when it is vertical.
 * `flipped` reports that the text turned around, so the caller can mirror its
 * offset and keep the label on the same side of the line it belongs to.
 */
export function readableAngle(deg: number): { deg: number; flipped: boolean } {
  if (!Number.isFinite(deg)) return { deg: 0, flipped: false };
  let out = deg % 360;
  let flipped = false;
  while (out >= 90) {
    out -= 180;
    flipped = !flipped;
  }
  while (out < -90) {
    out += 180;
    flipped = !flipped;
  }
  return { deg: out + 0, flipped };
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

/** Parse a typed size. `12`, `12'6"`, `8"`, `3.5`, `2.4 m`. Returns plan-feet. */
export function parseFeet(raw: string, units: 'ft' | 'm' = 'ft'): number | null {
  const s = raw.trim().toLowerCase().replace(/,/g, '');
  if (!s) return null;
  const looksMetric = (units === 'm' && !s.includes("'") && !s.includes('"'))
    || /m\s*$/.test(s);
  if (looksMetric) {
    const n = parseFloat(s.replace(/[m\s]/g, ''));
    return Number.isFinite(n) ? n / 0.3048 : null;
  }
  const inchesOnly = s.match(/^(-?\d+(?:\.\d+)?)\s*"$/);
  if (inchesOnly) return parseFloat(inchesOnly[1]) / 12;
  if (s.includes("'") || s.includes('ft') || s.includes('"')) {
    const fi = s.match(/^(-?\d+)\s*(?:'|ft)?\s*-?\s*(\d+(?:\.\d+)?)?\s*(?:"|in)?$/);
    if (fi) {
      const ft = parseInt(fi[1], 10);
      const inch = fi[2] ? parseFloat(fi[2]) : 0;
      if (!Number.isFinite(ft) || !Number.isFinite(inch)) return null;
      return ft + inch / 12;
    }
  }
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
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

/** Extra feet so a 44px finger can hit a small stamp. Capped so neighbors stay tappable. */
export function furnitureFingerPad(w: number, h: number, zoom: number): number {
  const fingerFt = 44 / Math.max(zoom, 1);
  const short = Math.min(Math.abs(w), Math.abs(h));
  return Math.min(0.75, Math.max(0, (fingerFt - short) / 2));
}

export function hitFurniture(items: FurnitureItem[], p: Point, zoom = 24): string | null {
  for (let i = items.length - 1; i >= 0; i--) {
    const f = items[i];
    const dx = p.x - f.x;
    const dy = p.y - f.y;
    const cos = Math.cos(-f.rot);
    const sin = Math.sin(-f.rot);
    const lx = dx * cos - dy * sin;
    const ly = dx * sin + dy * cos;
    const pad = furnitureFingerPad(f.w, f.h, zoom);
    if (Math.abs(lx) <= f.w / 2 + pad && Math.abs(ly) <= f.h / 2 + pad) return f.id;
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

export type WallGrip = 'a' | 'b' | 'mid';

export function wallGripPoints(wall: Wall, nodes: Node[]): { a: Point; b: Point; mid: Point } | null {
  const e = wallEnds(wall, nodes);
  if (!e) return null;
  return { a: e.a, b: e.b, mid: { x: (e.a.x + e.b.x) / 2, y: (e.a.y + e.b.y) / 2 } };
}

/** Squares at the ends beat the middle when both are close. */
export function hitWallGrip(wall: Wall, nodes: Node[], p: Point, thr: number): WallGrip | null {
  const g = wallGripPoints(wall, nodes);
  if (!g) return null;
  const da = dist(p, g.a);
  const db = dist(p, g.b);
  const dm = dist(p, g.mid);
  if (da <= thr && da <= db && da <= dm + 1e-6) return 'a';
  if (db <= thr && db <= da && db <= dm + 1e-6) return 'b';
  if (dm <= thr * 0.85) return 'mid';
  return null;
}

/** Move one end of a wall (shared corners move with it). */
export function nodesAfterWallEnd(nodes: Node[], wall: Wall, end: 'a' | 'b', to: Point): Node[] {
  const id = end === 'a' ? wall.a : wall.b;
  return nodes.map((n) => (n.id === id ? { ...n, x: to.x, y: to.y } : n));
}

/** Keep end A, slide B along the wall to a new length. */
export function nodesAfterWallLength(nodes: Node[], wall: Wall, length: number): Node[] {
  const e = wallEnds(wall, nodes);
  if (!e || length < 0.25) return nodes;
  const cur = dist(e.a, e.b);
  if (cur < 1e-6) return nodes;
  const k = length / cur;
  return nodes.map((n) => (n.id === wall.b ? {
    ...n,
    x: e.a.x + (e.b.x - e.a.x) * k,
    y: e.a.y + (e.b.y - e.a.y) * k,
  } : n));
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

export type FitWallsOpts = {
  gridSize: number;
  snap: boolean;
  ortho: boolean;
  /** Max wobble off a candidate wall, in feet. */
  band?: number;
  minLen?: number;
};

function strokeSpan(pts: Point[]): number {
  if (pts.length === 0) return 0;
  let minX = pts[0].x;
  let minY = pts[0].y;
  let maxX = pts[0].x;
  let maxY = pts[0].y;
  for (const p of pts) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  return Math.hypot(maxX - minX, maxY - minY);
}

function collapseClose(pts: Point[], min: number): Point[] {
  if (pts.length === 0) return pts;
  const out: Point[] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    if (dist(out[out.length - 1], pts[i]) >= min) out.push(pts[i]);
  }
  return out;
}

function mergeCollinear(pts: Point[], eps = 0.4): Point[] {
  if (pts.length < 3) return pts.slice();
  const out: Point[] = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const a = out[out.length - 1];
    const b = pts[i];
    const c = pts[i + 1];
    const hit = projectOnSegment(a, c, b);
    const dot = (b.x - a.x) * (c.x - b.x) + (b.y - a.y) * (c.y - b.y);
    if (hit.d <= eps && dot > 0) continue;
    out.push(b);
  }
  out.push(pts[pts.length - 1]);
  return out;
}

function maxDev(pts: Point[], a: number, b: number, from: Point, to: Point): number {
  let maxD = 0;
  for (let k = a; k <= b; k++) {
    const d = projectOnSegment(from, to, pts[k]).d;
    if (d > maxD) maxD = d;
  }
  return maxD;
}

/* ---------- 2.13.87: closed sketches trace themselves, and the tracer tries harder ---------- */

function loopArea(pts: Point[]): number {
  let a = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % pts.length];
    a += p.x * q.y - q.x * p.y;
  }
  return Math.abs(a) / 2;
}

function resample(pts: Point[], step: number): Point[] {
  if (pts.length < 2) return pts.slice();
  const out: Point[] = [pts[0]];
  let carry = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const L = dist(a, b);
    let t = step - carry;
    while (t <= L) {
      out.push({ x: a.x + ((b.x - a.x) * t) / L, y: a.y + ((b.y - a.y) * t) / L });
      t += step;
    }
    carry = L - (t - step);
  }
  return out;
}

/**
 * Where a sketch closes on itself: the stroke comes back near where it started
 * (a small gap, or running past the start). Returns the loop's points, start to the
 * closing point, or null when the stroke is open or a back-and-forth scribble.
 */
export function closedLoopOf(flat: number[]): Point[] | null {
  const raw = polylinePoints(flat);
  if (raw.length < 6) return null;
  const span = strokeSpan(raw);
  if (span < 2.5) return null;
  const pts = resample(raw, Math.max(0.1, span / 400));
  if (pts.length < 12) return null;
  const reach = Math.max(1.6, Math.min(5, span * 0.2));
  const start = pts[0];
  // the stroke must first get well away from the start…
  let far = 0;
  let farAt = 0;
  for (let i = 0; i < pts.length; i++) {
    const d = dist(start, pts[i]);
    if (d > far) { far = d; farAt = i; }
  }
  if (far < span * 0.45) return null;
  // …then come back: the nearest approach after the far point closes the loop (trims overshoot)
  let best = Infinity;
  let bestAt = -1;
  for (let i = farAt + 1; i < pts.length; i++) {
    const d = dist(start, pts[i]);
    if (d < best) { best = d; bestAt = i; }
  }
  if (bestAt < 0 || best > reach) return null;
  const loop = pts.slice(0, bestAt + 1);
  let len = 0;
  for (let i = 1; i < loop.length; i++) len += dist(loop[i - 1], loop[i]);
  len += dist(loop[loop.length - 1], loop[0]);
  // a real room encloses space; a scribble back over itself does not
  if (loopArea(loop) < Math.max(3, (len * len) * 0.025)) return null;
  return loop;
}

function closedCorners(loop: Point[], eps: number): number[] {
  const n = loop.length;
  let cx = 0;
  let cy = 0;
  for (const p of loop) { cx += p.x; cy += p.y; }
  cx /= n; cy /= n;
  // start at the point farthest from the middle — always a corner, never mid-wall
  let s0 = 0;
  let dm = -1;
  for (let i = 0; i < n; i++) {
    const d = Math.hypot(loop[i].x - cx, loop[i].y - cy);
    if (d > dm) { dm = d; s0 = i; }
  }
  let s1 = s0;
  dm = -1;
  for (let i = 0; i < n; i++) {
    const d = dist(loop[s0], loop[i]);
    if (d > dm) { dm = d; s1 = i; }
  }
  const keep = new Set<number>([s0, s1]);
  const at = (k: number) => loop[((k % n) + n) % n];
  const rec = (a: number, b: number) => {
    let maxD = 0;
    let idx = -1;
    for (let k = a + 1; k < b; k++) {
      const d = projectOnSegment(at(a), at(b), at(k)).d;
      if (d > maxD) { maxD = d; idx = k; }
    }
    if (maxD > eps && idx >= 0) {
      keep.add(((idx % n) + n) % n);
      rec(a, idx);
      rec(idx, b);
    }
  };
  const lo = Math.min(s0, s1);
  const hi = Math.max(s0, s1);
  rec(lo, hi);
  rec(hi, lo + n);
  return [...keep].sort((a, b) => a - b);
}

type Line = { nx: number; ny: number; c: number; dir: number };

function intersect(a: Line, b: Line): Point | null {
  const det = a.nx * b.ny - a.ny * b.nx;
  if (Math.abs(det) < 1e-6) return null;
  return { x: (a.c * b.ny - b.c * a.ny) / det, y: (a.nx * b.c - b.nx * a.c) / det };
}

/**
 * Fit a closed sketch as a closed outline: find the corners, give every side one
 * straight line through all of its pencil points (0/45/90 when ortho, snapped to
 * the grid), and meet the lines at clean corners. Returns corners with the first
 * repeated at the end, or [] when it cannot make a sensible shape.
 */
export function fitClosedStroke(loop: Point[], opts: FitWallsOpts): Point[] {
  const span = strokeSpan(loop);
  const minLen = Math.max(1, Math.min(opts.minLen ?? 1.25, span * 0.12));
  for (const frac of [0.06, 0.09, 0.045, 0.12]) {
    const eps = Math.max(0.35, Math.min(3.2, span * frac));
    const idx = closedCorners(loop, eps);
    if (idx.length < 3) continue;
    const n = loop.length;
    // each side = its corner-to-corner points
    let sides: { pts: Point[]; ang: number; len: number; gap: boolean }[] = [];
    for (let k = 0; k < idx.length; k++) {
      const a = idx[k];
      const b = idx[(k + 1) % idx.length] + (k + 1 === idx.length ? n : 0);
      const pts: Point[] = [];
      // leave the rounded ends of each side out of the line fit
      const trim = Math.floor((b - a) * 0.15);
      for (let i = a + trim; i <= b - trim; i++) pts.push(loop[i % n]);
      if (pts.length < 2) continue;
      const p0 = loop[a % n];
      const p1 = loop[b % n];
      // mostly one jump with no pencil along it: the gap the kid left when closing the shape
      let jump = 0;
      for (let i = a + 1; i <= b; i++) jump = Math.max(jump, dist(loop[(i - 1) % n], loop[i % n]));
      const len = dist(p0, p1);
      sides.push({ pts, ang: Math.atan2(p1.y - p0.y, p1.x - p0.x), len, gap: jump > 0.8 && jump >= len * 0.6 });
    }
    const step = opts.ortho ? Math.PI / 4 : 0;
    const snapAng = (ang: number) => {
      const a = ((ang % Math.PI) + Math.PI) % Math.PI;
      if (!step) return a;
      // prefer square corners: diagonals only when the side is clearly diagonal
      const toAxis = Math.min(Math.abs(a), Math.abs(a - Math.PI / 2), Math.abs(a - Math.PI));
      if (toAxis <= Math.PI / 7) return Math.round(a / (Math.PI / 2)) * (Math.PI / 2) % Math.PI;
      return Math.round(a / step) * step % Math.PI;
    };
    // a short side between two longer ones is a rounded corner or the closing gap, not a wall
    if (step) {
      const isDiag = (a: number) => Math.abs(snapAng(a) % (Math.PI / 2)) > 1e-6;
      const m = sides.length;
      const cut = sides.map((sd, k) => {
        const near = Math.min(sides[(k - 1 + m) % m].len, sides[(k + 1) % m].len);
        return sd.gap || sd.len < minLen || (isDiag(sd.ang) && sd.len < Math.min(5, near * 0.5));
      });
      if (m - cut.filter(Boolean).length >= 3) sides = sides.filter((_, k) => !cut[k]);
    }
    // merge neighbours that run the same way (a wobble mid-wall is not a corner)
    let merged = true;
    while (merged && sides.length > 3) {
      merged = false;
      for (let k = 0; k < sides.length; k++) {
        const nx = (k + 1) % sides.length;
        if (step && Math.abs(snapAng(sides[k].ang) - snapAng(sides[nx].ang)) < 1e-6) {
          const pts = [...sides[k].pts, ...sides[nx].pts];
          const ang = Math.atan2(pts[pts.length - 1].y - pts[0].y, pts[pts.length - 1].x - pts[0].x);
          sides.splice(k, 2, { pts, ang, len: sides[k].len + sides[nx].len, gap: false });
          if (nx === 0) sides.unshift(sides.pop()!);
          merged = true;
          break;
        }
      }
    }
    if (sides.length < 3) continue;
    const lines: Line[] = sides.map((sd) => {
      let ang: number;
      if (step) {
        ang = snapAng(sd.ang);
      } else {
        // free angle: least-squares direction of the side's points
        let mx = 0; let my = 0;
        for (const p of sd.pts) { mx += p.x; my += p.y; }
        mx /= sd.pts.length; my /= sd.pts.length;
        let sxx = 0; let sxy = 0; let syy = 0;
        for (const p of sd.pts) { sxx += (p.x - mx) ** 2; sxy += (p.x - mx) * (p.y - my); syy += (p.y - my) ** 2; }
        ang = 0.5 * Math.atan2(2 * sxy, sxx - syy);
      }
      const nx = -Math.sin(ang);
      const ny = Math.cos(ang);
      let c = 0;
      for (const p of sd.pts) c += nx * p.x + ny * p.y;
      c /= sd.pts.length;
      const axis = Math.abs(nx) < 1e-6 || Math.abs(ny) < 1e-6;
      if (opts.snap && axis) c = Math.round(c / opts.gridSize) * opts.gridSize;
      return { nx, ny, c, dir: ang };
    });
    const corners: Point[] = [];
    let bad = false;
    for (let k = 0; k < lines.length; k++) {
      const p = intersect(lines[(k - 1 + lines.length) % lines.length], lines[k]);
      if (!p) { bad = true; break; }
      corners.push(opts.snap && !step ? snapPoint(p, opts.gridSize, true) : p);
    }
    if (bad) continue;
    // corners must stay near the drawing; sides must be wall-sized
    let minX = Infinity; let minY = Infinity; let maxX = -Infinity; let maxY = -Infinity;
    for (const p of loop) { minX = Math.min(minX, p.x); minY = Math.min(minY, p.y); maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y); }
    const pad = Math.max(2, span * 0.15);
    if (corners.some((p) => p.x < minX - pad || p.x > maxX + pad || p.y < minY - pad || p.y > maxY + pad)) continue;
    const clean = collapseClose(corners, minLen * 0.5);
    if (clean.length >= 2 && dist(clean[0], clean[clean.length - 1]) < minLen * 0.5) clean.pop();
    if (clean.length < 3) continue;
    const out = clean.map((p) => ({ x: Math.round(p.x * 1000) / 1000, y: Math.round(p.y * 1000) / 1000 }));
    if (loopArea(out) < loopArea(loop) * 0.5) continue;
    out.push({ x: out[0].x, y: out[0].y });
    return out;
  }
  return [];
}

/**
 * Turn a wiggly pencil stroke into grid-snapped wall corners (0/45/90 when ortho).
 * Classroom sketches wander a few feet — we keep the long runs, not the wobble.
 */
export function fitWallsFromStroke(flat: number[], opts: FitWallsOpts): Point[] {
  const raw = polylinePoints(flat);
  if (raw.length < 2) return [];
  // 2.13.87: a closed sketch is fitted as one closed outline first
  const loop = closedLoopOf(flat);
  if (loop) {
    const closed = fitClosedStroke(loop, opts);
    if (closed.length >= 4) return closed;
  }
  const span = strokeSpan(raw);
  if (span < 1.75) return [];

  const band = opts.band ?? Math.min(6, Math.max(2.8, span * 0.09));
  const minLen = opts.minLen ?? Math.max(1.25, opts.gridSize * 0.9);
  const light = polylinePoints(simplifyPolyline(flat, Math.min(0.55, band * 0.18)));
  const pts = collapseClose(light.length >= 2 ? light : raw, Math.min(0.35, minLen * 0.25));
  if (pts.length < 2) return [];

  const snapEnd = (from: Point, to: Point): Point => {
    if (opts.ortho) {
      return snapWallEnd(from, to, {
        ortho: true,
        forceOrtho: false,
        snap: opts.snap,
        gridSize: opts.gridSize,
      });
    }
    return snapPoint(to, opts.gridSize, opts.snap);
  };

  const verts: Point[] = [snapPoint(pts[0], opts.gridSize, opts.snap)];
  let i = 0;
  let guard = 0;
  while (i < pts.length - 1 && guard++ < pts.length + 12) {
    const from = verts[verts.length - 1];
    let bestJ = -1;
    let bestEnd: Point | null = null;
    for (let j = i + 1; j < pts.length; j++) {
      const end = snapEnd(from, pts[j]);
      const len = dist(from, end);
      if (len < minLen) continue;
      if (maxDev(pts, i, j, from, end) > band) {
        if (bestJ >= 0) break;
        continue;
      }
      bestJ = j;
      bestEnd = end;
    }
    if (bestJ < 0 || !bestEnd) {
      i += 1;
      continue;
    }
    verts.push(bestEnd);
    i = Math.max(i + 1, bestJ);
  }

  let out = mergeCollinear(collapseClose(verts, minLen * 0.55));
  if (out.length < 2 && span >= 4) {
    const coarse = polylinePoints(simplifyPolyline(flat, Math.min(5, Math.max(2.2, span * 0.08))));
    out = [snapPoint(coarse[0], opts.gridSize, opts.snap)];
    for (let k = 1; k < coarse.length; k++) {
      const end = snapEnd(out[out.length - 1], coarse[k]);
      if (dist(out[out.length - 1], end) >= minLen) out.push(end);
    }
    out = mergeCollinear(out);
  }

  if (out.length >= 3) {
    const closeAt = Math.max(band * 1.35, 3.5);
    if (dist(out[0], out[out.length - 1]) <= closeAt) {
      out[out.length - 1] = { x: out[0].x, y: out[0].y };
    }
  }
  if (out.length >= 2 && dist(out[0], out[out.length - 1]) < 0.2) {
    const uniq = collapseClose(out, minLen * 0.5);
    if (uniq.length >= 2) {
      if (dist(uniq[0], uniq[uniq.length - 1]) >= minLen * 0.5) uniq.push({ x: uniq[0].x, y: uniq[0].y });
      return uniq;
    }
  }
  return out;
}
