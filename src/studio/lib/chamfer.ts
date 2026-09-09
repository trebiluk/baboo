import type { Node, Opening, Point, Wall } from '../types';
import { dist, uid } from './geometry';

const MIN_SIZE = 0.6;
const STRAIGHT_DOT = Math.cos((20 * Math.PI) / 180); // skip nearly-collinear

function wallsAt(walls: Wall[], id: string): Wall[] {
  return walls.filter((w) => w.a === id || w.b === id);
}

function otherEnd(w: Wall, id: string): string {
  return w.a === id ? w.b : w.a;
}

export function cornerAngle(c: Point, a: Point, b: Point): number {
  const la = dist(c, a);
  const lb = dist(c, b);
  if (la < 1e-6 || lb < 1e-6) return Math.PI;
  const dot = ((a.x - c.x) * (b.x - c.x) + (a.y - c.y) * (b.y - c.y)) / (la * lb);
  return Math.acos(Math.min(1, Math.max(-1, dot)));
}

export function isChamferable(nodes: Node[], walls: Wall[], nodeId: string): boolean {
  const c = nodes.find((n) => n.id === nodeId);
  if (!c) return false;
  const inc = wallsAt(walls, nodeId);
  if (inc.length !== 2) return false;
  const A = nodes.find((n) => n.id === otherEnd(inc[0], nodeId));
  const B = nodes.find((n) => n.id === otherEnd(inc[1], nodeId));
  if (!A || !B) return false;
  if (Math.min(dist(c, A), dist(c, B)) < MIN_SIZE * 2 + 0.2) return false;
  const ang = cornerAngle(c, A, B);
  const dot = Math.cos(ang);
  // Skip almost-straight (T leftover) and hairpin spikes.
  if (dot > STRAIGHT_DOT || dot < -0.94) return false;
  return true;
}

export function nearestChamferable(
  nodes: Node[],
  walls: Wall[],
  p: Point,
  maxDist = 1.6,
): Node | null {
  let best: { n: Node; d: number } | null = null;
  for (const n of nodes) {
    if (!isChamferable(nodes, walls, n.id)) continue;
    const d = dist(n, p);
    if (d <= maxDist && (!best || d < best.d)) best = { n, d };
  }
  return best?.n ?? null;
}

export function chamferPreview(
  nodes: Node[],
  walls: Wall[],
  nodeId: string,
  size = 2,
): { a: Point; b: Point; c: Point } | null {
  const cut = chamferGeometry(nodes, walls, nodeId, size);
  if (!cut) return null;
  return { a: cut.p1, b: cut.p2, c: cut.c };
}

function chamferGeometry(
  nodes: Node[],
  walls: Wall[],
  nodeId: string,
  size: number,
): {
  c: Point;
  p1: Point;
  p2: Point;
  d: number;
  w1: Wall;
  w2: Wall;
  aId: string;
  bId: string;
  la: number;
  lb: number;
} | null {
  const cNode = nodes.find((n) => n.id === nodeId);
  if (!cNode) return null;
  const inc = wallsAt(walls, nodeId);
  if (inc.length !== 2) return null;
  const [w1, w2] = inc;
  const aId = otherEnd(w1, nodeId);
  const bId = otherEnd(w2, nodeId);
  const A = nodes.find((n) => n.id === aId);
  const B = nodes.find((n) => n.id === bId);
  if (!A || !B) return null;
  const la = dist(cNode, A);
  const lb = dist(cNode, B);
  const maxD = Math.min(la, lb) / 2 - 0.08;
  if (maxD < MIN_SIZE) return null;
  const d = Math.min(Math.max(size, MIN_SIZE), maxD);
  const ua = { x: (A.x - cNode.x) / la, y: (A.y - cNode.y) / la };
  const ub = { x: (B.x - cNode.x) / lb, y: (B.y - cNode.y) / lb };
  return {
    c: { x: cNode.x, y: cNode.y },
    p1: { x: cNode.x + ua.x * d, y: cNode.y + ua.y * d },
    p2: { x: cNode.x + ub.x * d, y: cNode.y + ub.y * d },
    d,
    w1,
    w2,
    aId,
    bId,
    la,
    lb,
  };
}

function remapOpening(
  o: Opening,
  w: Wall,
  cornerId: string,
  oldLen: number,
  cut: number,
  newWall: Wall,
): Opening | null {
  if (o.wallId !== w.id) return o;
  const tDist = o.t * oldLen;
  if (w.a === cornerId) {
    if (tDist < cut + 0.15) return null;
    const newLen = oldLen - cut;
    return { ...o, wallId: newWall.id, t: Math.min(0.92, Math.max(0.08, (tDist - cut) / newLen)) };
  }
  if (tDist > oldLen - cut - 0.15) return null;
  const newLen = oldLen - cut;
  return { ...o, wallId: newWall.id, t: Math.min(0.92, Math.max(0.08, tDist / newLen)) };
}

/** Clip a 2-wall corner: two new nodes + a slanted wall. Rooms re-walk the new polygon. */
export function chamferCorner(
  nodes: Node[],
  walls: Wall[],
  openings: Opening[],
  nodeId: string,
  size = 2,
): { nodes: Node[]; walls: Wall[]; openings: Opening[] } | null {
  if (!isChamferable(nodes, walls, nodeId)) return null;
  const g = chamferGeometry(nodes, walls, nodeId, size);
  if (!g) return null;
  const n1: Node = { id: uid('n'), x: g.p1.x, y: g.p1.y };
  const n2: Node = { id: uid('n'), x: g.p2.x, y: g.p2.y };
  const nw1: Wall = g.w1.a === nodeId ? { ...g.w1, a: n1.id } : { ...g.w1, b: n1.id };
  const nw2: Wall = g.w2.a === nodeId ? { ...g.w2, a: n2.id } : { ...g.w2, b: n2.id };
  const kind = g.w1.kind === 'interior' && g.w2.kind === 'interior' ? 'interior' : 'exterior';
  const clip: Wall = {
    id: uid('w'),
    a: n1.id,
    b: n2.id,
    kind,
    thickness: kind === 'interior' ? 0.35 : (g.w1.thickness || 0.5),
  };
  const nextOpen: Opening[] = [];
  for (const o of openings) {
    if (o.wallId === g.w1.id) {
      const m = remapOpening(o, g.w1, nodeId, g.la, g.d, nw1);
      if (m) nextOpen.push(m);
    } else if (o.wallId === g.w2.id) {
      const m = remapOpening(o, g.w2, nodeId, g.lb, g.d, nw2);
      if (m) nextOpen.push(m);
    } else {
      nextOpen.push(o);
    }
  }
  return {
    nodes: nodes.filter((n) => n.id !== nodeId).concat(n1, n2),
    walls: walls.map((w) => (w.id === g.w1.id ? nw1 : w.id === g.w2.id ? nw2 : w)).concat(clip),
    openings: nextOpen,
  };
}
