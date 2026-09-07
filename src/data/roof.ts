import type { Node, Point, RoofGeometry, RoofStyleId, Wall } from '../types';
import { uid } from './geometry';
export {
  ROOF_STYLE_OPTIONS,
  roofStyleName,
  DEFAULT_ROOF_BY_STYLE,
  roofDefaultForStyle,
} from '../data/roofs';

export function exteriorBounds(nodes: Node[], walls: Wall[]): {
  minX: number; minY: number; maxX: number; maxY: number;
  cx: number; cy: number; w: number; h: number;
} | null {
  const exterior = walls.filter((w) => w.kind === 'exterior');
  const use = exterior.length ? exterior : walls;
  const ids = new Set<string>();
  for (const w of use) { ids.add(w.a); ids.add(w.b); }
  const pts = nodes.filter((n) => (ids.size ? ids.has(n.id) : true));
  if (!pts.length) return null;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of pts) {
    minX = Math.min(minX, p.x); minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y);
  }
  const w = maxX - minX;
  const h = maxY - minY;
  if (w < 0.5 || h < 0.5) return null;
  return { minX, minY, maxX, maxY, cx: (minX + maxX) / 2, cy: (minY + maxY) / 2, w, h };
}

function rectOutline(minX: number, minY: number, maxX: number, maxY: number, oh: number): Point[] {
  return [
    { x: minX - oh, y: minY - oh },
    { x: maxX + oh, y: minY - oh },
    { x: maxX + oh, y: maxY + oh },
    { x: minX - oh, y: maxY + oh },
  ];
}

/** Soft irregular sod perimeter (deterministic wobble — no Math.random in regen). */
function sodEdgePoints(cx: number, cy: number, rx: number, ry: number, n = 16): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    const wobble = 1 + 0.08 * Math.sin(i * 2.7) + 0.05 * Math.cos(i * 1.3);
    pts.push({ x: cx + Math.cos(a) * rx * wobble, y: cy + Math.sin(a) * ry * wobble });
  }
  return pts;
}

/**
 * Generate simple recognizable roof plan geometry from exterior outline.
 */
export function generateRoof(
  nodes: Node[],
  walls: Wall[],
  styleId: RoofStyleId | null,
): RoofGeometry | null {
  if (!styleId) return null;
  const b = exteriorBounds(nodes, walls);
  if (!b) return null;

  const overhang = styleId === 'grass' ? 1.4 : 1.0;
  const outline = rectOutline(b.minX, b.minY, b.maxX, b.maxY, overhang);
  const horiz = b.w >= b.h;
  const eavesHeight = 9;
  let ridgeHeight = eavesHeight + Math.min(b.w, b.h) * 0.28;
  ridgeHeight = Math.max(eavesHeight + 3, Math.min(ridgeHeight, eavesHeight + 12));

  const ridges: RoofGeometry['ridges'] = [];
  const hips: RoofGeometry['hips'] = [];
  const breaks: RoofGeometry['breaks'] = [];
  let sodEdge: Point[] | undefined;
  let coneEdge: Point[] | undefined;

  const oMinX = b.minX - overhang;
  const oMaxX = b.maxX + overhang;
  const oMinY = b.minY - overhang;
  const oMaxY = b.maxY + overhang;
  const ocx = (oMinX + oMaxX) / 2;
  const ocy = (oMinY + oMaxY) / 2;

  if (styleId === 'flat') {
    ridgeHeight = eavesHeight + 0.5;
  } else if (styleId === 'gable') {
    if (horiz) ridges.push({ a: { x: oMinX, y: ocy }, b: { x: oMaxX, y: ocy } });
    else ridges.push({ a: { x: ocx, y: oMinY }, b: { x: ocx, y: oMaxY } });
  } else if (styleId === 'hip') {
    const inset = Math.min(b.w, b.h) * 0.22 + overhang * 0.3;
    if (horiz) {
      const rx0 = oMinX + inset, rx1 = oMaxX - inset;
      ridges.push({ a: { x: rx0, y: ocy }, b: { x: rx1, y: ocy } });
      hips.push(
        { a: { x: oMinX, y: oMinY }, b: { x: rx0, y: ocy } },
        { a: { x: oMaxX, y: oMinY }, b: { x: rx1, y: ocy } },
        { a: { x: oMaxX, y: oMaxY }, b: { x: rx1, y: ocy } },
        { a: { x: oMinX, y: oMaxY }, b: { x: rx0, y: ocy } },
      );
    } else {
      const ry0 = oMinY + inset, ry1 = oMaxY - inset;
      ridges.push({ a: { x: ocx, y: ry0 }, b: { x: ocx, y: ry1 } });
      hips.push(
        { a: { x: oMinX, y: oMinY }, b: { x: ocx, y: ry0 } },
        { a: { x: oMaxX, y: oMinY }, b: { x: ocx, y: ry0 } },
        { a: { x: oMaxX, y: oMaxY }, b: { x: ocx, y: ry1 } },
        { a: { x: oMinX, y: oMaxY }, b: { x: ocx, y: ry1 } },
      );
    }
  } else if (styleId === 'gambrel') {
    if (horiz) {
      ridges.push({ a: { x: oMinX, y: ocy }, b: { x: oMaxX, y: ocy } });
      const dy = (oMaxY - oMinY) * 0.22;
      breaks.push(
        { a: { x: oMinX, y: ocy - dy }, b: { x: oMaxX, y: ocy - dy } },
        { a: { x: oMinX, y: ocy + dy }, b: { x: oMaxX, y: ocy + dy } },
      );
    } else {
      ridges.push({ a: { x: ocx, y: oMinY }, b: { x: ocx, y: oMaxY } });
      const dx = (oMaxX - oMinX) * 0.22;
      breaks.push(
        { a: { x: ocx - dx, y: oMinY }, b: { x: ocx - dx, y: oMaxY } },
        { a: { x: ocx + dx, y: oMinY }, b: { x: ocx + dx, y: oMaxY } },
      );
    }
    ridgeHeight = eavesHeight + Math.min(b.w, b.h) * 0.38;
  } else if (styleId === 'shed') {
    if (horiz) ridges.push({ a: { x: ocx, y: oMinY }, b: { x: ocx, y: oMaxY } });
    else ridges.push({ a: { x: oMinX, y: ocy }, b: { x: oMaxX, y: ocy } });
    ridgeHeight = eavesHeight + Math.min(b.w, b.h) * 0.22;
  } else if (styleId === 'mansard') {
    const inset = Math.min(b.w, b.h) * 0.18 + 0.5;
    const inner = rectOutline(b.minX, b.minY, b.maxX, b.maxY, overhang - inset);
    for (let i = 0; i < 4; i++) {
      breaks.push({ a: inner[i], b: inner[(i + 1) % 4] });
      hips.push({ a: outline[i], b: inner[i] });
    }
    ridgeHeight = eavesHeight + Math.min(b.w, b.h) * 0.32;
  } else if (styleId === 'grass') {
    sodEdge = sodEdgePoints(b.cx, b.cy, b.w / 2 + overhang, b.h / 2 + overhang, 18);
    ridgeHeight = eavesHeight + Math.min(b.w, b.h) * 0.18;
  } else if (styleId === 'conical') {
    // Simple cone: circular eaves + radial spokes to center peak (Yurt curriculum)
    const r = Math.max(b.w, b.h) / 2 + overhang * 0.55;
    const n = 12;
    const ring: Point[] = [];
    for (let i = 0; i < n; i++) {
      const a = (Math.PI * 2 * i) / n - Math.PI / 2;
      ring.push({ x: b.cx + Math.cos(a) * r, y: b.cy + Math.sin(a) * r });
    }
    coneEdge = ring;
    const peak = { x: b.cx, y: b.cy };
    for (const p of ring) {
      hips.push({ a: p, b: peak });
    }
    ridgeHeight = eavesHeight + Math.min(b.w, b.h) * 0.36;
  }

  return {
    id: uid('roof'),
    styleId,
    outline: styleId === 'grass' && sodEdge
      ? sodEdge
      : styleId === 'conical' && coneEdge
        ? coneEdge
        : outline,
    ridges,
    hips,
    breaks,
    sodEdge,
    eavesHeight,
    ridgeHeight,
    longAxis: horiz ? 'x' : 'y',
  };
}

/** Approximate enclosed floor area (sq ft) from exterior AABB — good enough for teaching readout. */
export function exteriorFloorAreaSqFt(nodes: Node[], walls: Wall[]): number | null {
  const b = exteriorBounds(nodes, walls);
  if (!b) return null;
  return Math.round(b.w * b.h * 10) / 10;
}
