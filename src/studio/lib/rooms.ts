import type { Node, Point, Room, Wall } from '../types';
import { dist } from './geometry';

export type Face = { poly: Point[]; area: number };

function nodeMap(nodes: Node[]): Map<string, Node> {
  return new Map(nodes.map((n) => [n.id, n]));
}

function adjacency(nodes: Node[], walls: Wall[]): Map<string, string[]> {
  const byId = nodeMap(nodes);
  const adj = new Map<string, string[]>();
  const add = (a: string, b: string) => {
    if (!adj.has(a)) adj.set(a, []);
    const list = adj.get(a)!;
    if (!list.includes(b)) list.push(b);
  };
  for (const w of walls) {
    if (!byId.has(w.a) || !byId.has(w.b) || w.a === w.b) continue;
    if (dist(byId.get(w.a)!, byId.get(w.b)!) < 0.05) continue;
    add(w.a, w.b);
    add(w.b, w.a);
  }
  return adj;
}

/** Signed polygon area (CCW positive). World units = feet. */
export function signedArea(poly: Point[]): number {
  let a = 0;
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % n];
    a += p.x * q.y - q.x * p.y;
  }
  return a / 2;
}

export function polygonArea(poly: Point[]): number {
  return Math.abs(signedArea(poly));
}

export function centroid(poly: Point[]): Point {
  const n = poly.length;
  if (!n) return { x: 0, y: 0 };
  const a = signedArea(poly);
  if (Math.abs(a) < 1e-6) {
    let x = 0, y = 0;
    for (const p of poly) { x += p.x; y += p.y; }
    return { x: x / n, y: y / n };
  }
  let cx = 0, cy = 0;
  for (let i = 0; i < n; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % n];
    const cross = p.x * q.y - q.x * p.y;
    cx += (p.x + q.x) * cross;
    cy += (p.y + q.y) * cross;
  }
  const f = 1 / (6 * a);
  return { x: cx * f, y: cy * f };
}

/** Even-odd point in polygon. */
export function pointInPoly(p: Point, poly: Point[]): boolean {
  let inside = false;
  const n = poly.length;
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const a = poly[i];
    const b = poly[j];
    const hit = (a.y > p.y) !== (b.y > p.y)
      && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y || 1e-12) + a.x;
    if (hit) inside = !inside;
  }
  return inside;
}

function nextNeighborCCW(
  from: string,
  at: string,
  adj: Map<string, string[]>,
  byId: Map<string, Node>,
): string | null {
  const neighbors = adj.get(at);
  if (!neighbors?.length) return null;
  const atP = byId.get(at)!;
  const scored = neighbors.map((id) => {
    const n = byId.get(id)!;
    return { id, ang: Math.atan2(n.y - atP.y, n.x - atP.x) };
  });
  scored.sort((a, b) => a.ang - b.ang);
  const idx = scored.findIndex((s) => s.id === from);
  if (idx < 0) return scored[0]?.id ?? null;
  // Previous in CCW polar order = sharpest interior turn (Y-down plans).
  return scored[(idx - 1 + scored.length) % scored.length].id;
}

/**
 * Interior wall-loop faces (CCW, positive area).
 * A simple rectangle yields one room. Interior walls split extra rooms.
 */
export function listInteriorFaces(nodes: Node[], walls: Wall[]): Face[] {
  const byId = nodeMap(nodes);
  const adj = adjacency(nodes, walls);
  const used = new Set<string>();
  const key = (a: string, b: string) => `${a}>${b}`;
  const faces: Face[] = [];

  const starts: [string, string][] = [];
  for (const [a, ns] of adj) {
    for (const b of ns) starts.push([a, b]);
  }

  for (const [sa, sb] of starts) {
    if (used.has(key(sa, sb))) continue;
    const cycle: string[] = [];
    let a = sa;
    let b = sb;
    let closed = false;
    for (let guard = 0; guard < 256; guard++) {
      const k = key(a, b);
      if (used.has(k)) break;
      used.add(k);
      cycle.push(a);
      const nxt = nextNeighborCCW(a, b, adj, byId);
      if (!nxt) break;
      a = b;
      b = nxt;
      if (a === sa && b === sb && cycle.length >= 3) {
        closed = true;
        break;
      }
    }
    if (!closed || cycle.length < 3) continue;
    const poly = cycle.map((id) => {
      const n = byId.get(id)!;
      return { x: n.x, y: n.y };
    });
    const area = signedArea(poly);
    if (area < 4) continue; // skip slivers + clockwise outer walk
    faces.push({ poly, area });
  }

  return faces;
}

export function findEnclosedFace(nodes: Node[], walls: Wall[], p: Point): Point[] | null {
  const faces = listInteriorFaces(nodes, walls);
  let best: Face | null = null;
  for (const f of faces) {
    if (!pointInPoly(p, f.poly)) continue;
    if (!best || f.area < best.area) best = f;
  }
  return best ? best.poly : null;
}

export function roomPolygon(room: Room, nodes: Node[], walls: Wall[]): Point[] | null {
  return findEnclosedFace(nodes, walls, { x: room.x, y: room.y });
}

export function hitRoom(
  rooms: Room[],
  nodes: Node[],
  walls: Wall[],
  p: Point,
): string | null {
  let bestLabel: { id: string; d: number } | null = null;
  for (const r of rooms) {
    const d = dist({ x: r.x, y: r.y }, p);
    if (d <= 1.8 && (!bestLabel || d < bestLabel.d)) bestLabel = { id: r.id, d };
  }
  if (bestLabel) return bestLabel.id;

  let best: { id: string; area: number } | null = null;
  for (const r of rooms) {
    const poly = roomPolygon(r, nodes, walls);
    if (!poly || !pointInPoly(p, poly)) continue;
    const area = polygonArea(poly);
    if (!best || area < best.area) best = { id: r.id, area };
  }
  return best?.id ?? null;
}

export function formatArea(sqFt: number, units: 'ft' | 'm'): string {
  if (units === 'm') {
    const m2 = sqFt * 0.092903;
    return `${m2 < 10 ? m2.toFixed(1) : Math.round(m2)} m²`;
  }
  return `${Math.round(sqFt)} sq ft`;
}

/** Flatten polygon for Konva Line. */
export function polyPoints(poly: Point[]): number[] {
  const pts: number[] = [];
  for (const p of poly) pts.push(p.x, p.y);
  return pts;
}
