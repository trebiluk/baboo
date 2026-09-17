/** Mitered wall footprints so closed rooms don't blob at corners. */
import type { Node, Point, Wall } from '../types';
import { dist, wallEnds } from './geometry';

export type WallFoot = { al: Point; ar: Point; bl: Point; br: Point };

function add(a: Point, b: Point): Point {
  return { x: a.x + b.x, y: a.y + b.y };
}
function sub(a: Point, b: Point): Point {
  return { x: a.x - b.x, y: a.y - b.y };
}
function mul(a: Point, s: number): Point {
  return { x: a.x * s, y: a.y * s };
}
function rot90(x: number, y: number): Point {
  return { x: -y, y: x };
}
function unit(a: Point): Point {
  const l = Math.hypot(a.x, a.y) || 1;
  return { x: a.x / l, y: a.y / l };
}
function dot2(a: Point, b: Point): number {
  return a.x * b.x + a.y * b.y;
}

/** p + s*d = q + t*e. d,e should be unit for s in feet. */
export function lineIntersect(p: Point, d: Point, q: Point, e: Point): { p: Point; s: number } | null {
  const cross = d.x * e.y - d.y * e.x;
  if (Math.abs(cross) < 1e-8) return null;
  const s = ((q.x - p.x) * e.y - (q.y - p.y) * e.x) / cross;
  return { p: { x: p.x + s * d.x, y: p.y + s * d.y }, s };
}

function otherId(wall: Wall, nodeId: string): string {
  return wall.a === nodeId ? wall.b : wall.a;
}

function nodePt(nodes: Node[], id: string): Point | null {
  const n = nodes.find((x) => x.id === id);
  return n ? { x: n.x, y: n.y } : null;
}

function neighborsOf(wall: Wall, nodeId: string, walls: Wall[]): Wall[] {
  return walls.filter((w) => w.id !== wall.id && (w.a === nodeId || w.b === nodeId));
}

function buttEnd(A: Point, u: Point, hw: number): { left: Point; right: Point } {
  const n = rot90(u.x, u.y);
  return { left: add(A, mul(n, hw)), right: sub(A, mul(n, hw)) };
}

function tJoinEnd(A: Point, u: Point, hw: number, throughHw: number): { left: Point; right: Point } {
  const n = rot90(u.x, u.y);
  const P = add(A, mul(u, throughHw));
  return { left: add(P, mul(n, hw)), right: sub(P, mul(n, hw)) };
}

function miterEnd(
  A: Point,
  u: Point,
  hw: number,
  v: Point,
  hwO: number,
): { left: Point; right: Point } {
  const n = rot90(u.x, u.y);
  const nO = rot90(v.x, v.y);
  const cap = Math.max(8 * Math.max(hw, hwO), 1.6);
  const bis = unit(add(u, v));

  const pair = (signO: 1 | -1) => {
    const L = lineIntersect(add(A, mul(n, hw)), u, add(A, mul(nO, hwO * signO)), v);
    const R = lineIntersect(sub(A, mul(n, hw)), u, sub(A, mul(nO, hwO * signO)), v);
    return { L, R };
  };

  const score = (L: { p: Point; s: number } | null, R: { p: Point; s: number } | null): number => {
    if (!L || !R) return -1;
    if (Math.abs(L.s) > cap || Math.abs(R.s) > cap) return -1;
    const d = sub(L.p, R.p);
    const len = Math.hypot(d.x, d.y) || 1;
    return Math.abs((d.x / len) * bis.x + (d.y / len) * bis.y);
  };

  const a = pair(1);
  const b = pair(-1);
  const sa = score(a.L, a.R);
  const sb = score(b.L, b.R);
  const use = sb > sa ? b : a;
  if (score(use.L, use.R) < 0) return buttEnd(A, u, hw);
  return { left: use.L!.p, right: use.R!.p };
}

function joinAt(
  wall: Wall,
  nodeId: string,
  nodes: Node[],
  walls: Wall[],
): { left: Point; right: Point } | null {
  const A = nodePt(nodes, nodeId);
  const B = nodePt(nodes, otherId(wall, nodeId));
  if (!A || !B) return null;
  if (dist(A, B) < 0.05) return null;
  const u = unit(sub(B, A));
  const hw = (wall.thickness || 0.5) / 2;
  const neigh = neighborsOf(wall, nodeId, walls);

  if (neigh.length === 0) return buttEnd(A, u, hw);

  if (neigh.length === 1) {
    const O = neigh[0];
    const C = nodePt(nodes, otherId(O, nodeId));
    if (!C || dist(A, C) < 0.05) return buttEnd(A, u, hw);
    return miterEnd(A, u, hw, unit(sub(C, A)), (O.thickness || 0.5) / 2);
  }

  const continuation = neigh.find((w) => {
    const C = nodePt(nodes, otherId(w, nodeId));
    if (!C) return false;
    return dot2(u, unit(sub(C, A))) < -0.85;
  });
  if (continuation) return buttEnd(A, u, hw);

  let through = neigh[0];
  let bestAbs = 2;
  for (const w of neigh) {
    const C = nodePt(nodes, otherId(w, nodeId));
    if (!C) continue;
    const ad = Math.abs(dot2(u, unit(sub(C, A))));
    if (ad < bestAbs) {
      bestAbs = ad;
      through = w;
    }
  }
  for (let i = 0; i < neigh.length; i++) {
    const Ci = nodePt(nodes, otherId(neigh[i], nodeId));
    if (!Ci) continue;
    const vi = unit(sub(Ci, A));
    for (let j = i + 1; j < neigh.length; j++) {
      const Cj = nodePt(nodes, otherId(neigh[j], nodeId));
      if (!Cj) continue;
      if (dot2(vi, unit(sub(Cj, A))) < -0.85) {
        through = neigh[i];
        break;
      }
    }
  }
  return tJoinEnd(A, u, hw, (through.thickness || 0.5) / 2);
}

/** Four corners of a wall's 2D solid. al/ar at wall.a, bl/br at wall.b (local left/right). */
export function wallFootprint(wall: Wall, nodes: Node[], walls: Wall[]): WallFoot | null {
  const a = joinAt(wall, wall.a, nodes, walls);
  const b = joinAt(wall, wall.b, nodes, walls);
  if (!a || !b) return null;
  return { al: a.left, ar: a.right, bl: b.left, br: b.right };
}

export function wallFootprintFlat(wall: Wall, nodes: Node[], walls: Wall[]): number[] | null {
  const f = wallFootprint(wall, nodes, walls);
  if (!f) return null;
  return [f.al.x, f.al.y, f.ar.x, f.ar.y, f.bl.x, f.bl.y, f.br.x, f.br.y];
}

/** Left/right of wall.a → wall.b at parameter t. */
export function wallSidesAt(foot: WallFoot, t: number): { left: Point; right: Point } {
  return {
    left: {
      x: foot.al.x + (foot.br.x - foot.al.x) * t,
      y: foot.al.y + (foot.br.y - foot.al.y) * t,
    },
    right: {
      x: foot.ar.x + (foot.bl.x - foot.ar.x) * t,
      y: foot.ar.y + (foot.bl.y - foot.ar.y) * t,
    },
  };
}

function pointInQuad(p: Point, a: Point, b: Point, c: Point, d: Point): boolean {
  const tri = (q: Point, r: Point, s: Point) =>
    (r.x - q.x) * (s.y - q.y) - (r.y - q.y) * (s.x - q.x);
  const s1 = tri(a, b, p);
  const s2 = tri(b, c, p);
  const s3 = tri(c, d, p);
  const s4 = tri(d, a, p);
  const hasNeg = s1 < 0 || s2 < 0 || s3 < 0 || s4 < 0;
  const hasPos = s1 > 0 || s2 > 0 || s3 > 0 || s4 > 0;
  return !(hasNeg && hasPos);
}

export function pointInWallFoot(p: Point, foot: WallFoot, eps = 1e-6): boolean {
  const pad = (q: Point): Point => q;
  void eps;
  return pointInQuad(pad(p), foot.al, foot.ar, foot.bl, foot.br);
}

/**
 * Inset a CCW (positive-area) polygon. Interior is to the left of each edge.
 * `amount` in feet; skip / fall back per-vertex if a miter blows up.
 */
export function insetPoly(poly: Point[], amount: number): Point[] {
  const n = poly.length;
  if (n < 3 || amount <= 0) return poly.map((p) => ({ x: p.x, y: p.y }));
  const out: Point[] = [];
  const cap = Math.max(amount * 12, 4);
  for (let i = 0; i < n; i++) {
    const prev = poly[(i + n - 1) % n];
    const cur = poly[i];
    const next = poly[(i + 1) % n];
    const u = unit(sub(cur, prev));
    const v = unit(sub(next, cur));
    const nU = rot90(u.x, u.y);
    const nV = rot90(v.x, v.y);
    const hit = lineIntersect(add(cur, mul(nU, amount)), u, add(cur, mul(nV, amount)), v);
    if (hit && Math.abs(hit.s) < cap) {
      out.push(hit.p);
    } else {

      const nn = unit(add(nU, nV));
      out.push(add(cur, mul(nn, amount)));
    }
  }
  return out;
}

export function loopHalfWidth(poly: Point[], nodes: Node[], walls: Wall[]): number {
  let sum = 0;
  let n = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const w = wallForEdge(a, b, nodes, walls);
    sum += (w?.thickness ?? 0.5) / 2;
    n += 1;
  }
  return n ? sum / n : 0.25;
}

function wallForEdge(a: Point, b: Point, nodes: Node[], walls: Wall[]): Wall | undefined {
  for (const w of walls) {
    const e = wallEnds(w, nodes);
    if (!e) continue;
    const ab = dist(e.a, a) < 0.12 && dist(e.b, b) < 0.12;
    const ba = dist(e.a, b) < 0.12 && dist(e.b, a) < 0.12;
    if (ab || ba) return w;
  }
  return undefined;
}
