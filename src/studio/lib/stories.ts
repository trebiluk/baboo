/** Second-story rules. A mansion with stairs grows a floor. A porch stays one story. */
import type { Floor, Point, RoofGeometry, Wall } from '../types';

export function houseHasUpper(floor: Floor): boolean {
  if (floor.walls.some((w) => (w.levels ?? 1) >= 2)) return true;
  return floor.roof?.styleId === 'mansard' && (floor.furniture ?? []).some((f) => f.catalogId === 'stairs');
}

export function wallStories(floor: Floor, wall: Wall): number {
  if (wall.kind !== 'exterior') return 1;
  if (wall.levels != null) return Math.max(1, wall.levels);
  if (!houseHasUpper(floor)) return 1;
  const nodes = new Map(floor.nodes.map((n) => [n.id, n]));
  const a = nodes.get(wall.a);
  const b = nodes.get(wall.b);
  if (!a || !b) return 1;
  const porch = (floor.rooms ?? []).find((r) => r.kind === 'outdoor');
  if (!porch) return 2;
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  if (Math.hypot(mx - porch.x, my - porch.y) < 12 && my < porch.y + 2.5) return 1;
  return 2;
}

export function upperOutline(floor: Floor): Point[] | null {
  if (!houseHasUpper(floor)) return null;
  const nodes = new Map(floor.nodes.map((n) => [n.id, n]));
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let n = 0;
  for (const w of floor.walls) {
    if (wallStories(floor, w) < 2) continue;
    const a = nodes.get(w.a);
    const b = nodes.get(w.b);
    if (!a || !b) continue;
    n += 1;
    minX = Math.min(minX, a.x, b.x);
    minY = Math.min(minY, a.y, b.y);
    maxX = Math.max(maxX, a.x, b.x);
    maxY = Math.max(maxY, a.y, b.y);
  }
  if (n < 3 || maxX - minX < 4 || maxY - minY < 4) return null;
  const oh = 1;
  return [
    { x: minX - oh, y: minY - oh },
    { x: maxX + oh, y: minY - oh },
    { x: maxX + oh, y: maxY + oh },
    { x: minX - oh, y: maxY + oh },
  ];
}

export function porchBounds(floor: Floor): { minX: number; minY: number; maxX: number; maxY: number } | null {
  if (!houseHasUpper(floor)) return null;
  const up = upperOutline(floor);
  if (!up) return null;
  const nodes = new Map(floor.nodes.map((n) => [n.id, n]));
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let n = 0;
  for (const w of floor.walls) {
    if (w.kind !== 'exterior' || wallStories(floor, w) !== 1) continue;
    const a = nodes.get(w.a);
    const b = nodes.get(w.b);
    if (!a || !b) continue;
    n += 1;
    minX = Math.min(minX, a.x, b.x);
    minY = Math.min(minY, a.y, b.y);
    maxX = Math.max(maxX, a.x, b.x);
    maxY = Math.max(maxY, a.y, b.y);
  }
  if (n < 1 || maxX - minX < 2) return null;
  const oh = 0.55;
  return { minX: minX - oh, minY: minY - oh, maxX: maxX + oh, maxY: maxY + oh };
}

function rectBreaks(outline: Point[]): RoofGeometry['breaks'] {
  const xs = outline.map((p) => p.x);
  const ys = outline.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const inset = Math.min(maxX - minX, maxY - minY) * 0.18 + 0.4;
  const inner = [
    { x: minX + inset, y: minY + inset },
    { x: maxX - inset, y: minY + inset },
    { x: maxX - inset, y: maxY - inset },
    { x: minX + inset, y: maxY - inset },
  ];
  return inner.map((a, i) => ({ a, b: inner[(i + 1) % 4] }));
}

/** Roof raised onto the second story, and pulled off the porch. */
export function viewRoof(floor: Floor, wallH: number): RoofGeometry | null {
  if (!floor.roof) return null;
  if (!houseHasUpper(floor)) return floor.roof;
  const outline = upperOutline(floor) ?? floor.roof.outline;
  const rise = Math.max(6, floor.roof.ridgeHeight - floor.roof.eavesHeight);
  const eh = wallH * 2;
  return {
    ...floor.roof,
    outline,
    breaks: floor.roof.styleId === 'mansard' ? rectBreaks(outline) : floor.roof.breaks,
    eavesHeight: eh,
    ridgeHeight: eh + rise,
  };
}
