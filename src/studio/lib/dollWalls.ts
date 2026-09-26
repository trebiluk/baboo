/** Thick dollhouse walls and the pad they sit on. Plan feet, z up. */

export type Xyz = { x: number; y: number; z: number };

export function wallPrism(a: { x: number; y: number }, b: { x: number; y: number }, thick: number, z1: number): Xyz[][] {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const t = Math.max(0.42, thick) / 2;
  const nx = (-dy / len) * t;
  const ny = (dx / len) * t;
  const p = [
    { x: a.x + nx, y: a.y + ny },
    { x: b.x + nx, y: b.y + ny },
    { x: b.x - nx, y: b.y - ny },
    { x: a.x - nx, y: a.y - ny },
  ];
  const up = (q: { x: number; y: number }, z: number): Xyz => ({ x: q.x, y: q.y, z });
  return [
    [up(p[0], 0), up(p[1], 0), up(p[1], z1), up(p[0], z1)],
    [up(p[3], 0), up(p[2], 0), up(p[2], z1), up(p[3], z1)],
    [up(p[0], 0), up(p[3], 0), up(p[3], z1), up(p[0], z1)],
    [up(p[1], 0), up(p[2], 0), up(p[2], z1), up(p[1], z1)],
    [up(p[0], z1), up(p[1], z1), up(p[2], z1), up(p[3], z1)],
  ];
}

export type OpeningCut = { t: number; width: number; kind: 'door' | 'window' };

export type CutModel = {
  walls: Xyz[][];
  holes: { ring: Xyz[]; kind: 'door' | 'window' }[];
};

/** Thick wall with the door or window actually missing. Same span idea as the 3D view. */
export function wallCutFaces(
  a: { x: number; y: number },
  b: { x: number; y: number },
  thick: number,
  wallH: number,
  openings: OpeningCut[],
): CutModel {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const half = Math.max(0.42, thick) / 2;
  const nx = -uy;
  const ny = ux;
  const panel = (s0: number, s1: number, z0: number, z1: number, side: number): Xyz[] => {
    const ox = nx * side;
    const oy = ny * side;
    const p = (s: number, z: number): Xyz => ({
      x: a.x + ux * s + ox,
      y: a.y + uy * s + oy,
      z,
    });
    return [p(s0, z0), p(s1, z0), p(s1, z1), p(s0, z1)];
  };
  const walls: Xyz[][] = [];
  const holes: CutModel['holes'] = [];
  const cuts = openings
    .map((o) => {
      const w = Math.max(1.5, Math.min(o.width || 3, len - 0.4));
      const mid = Math.min(len - w / 2 - 0.15, Math.max(w / 2 + 0.15, (o.t ?? 0.5) * len));
      const head = o.kind === 'door' ? Math.min(7, wallH - 0.35) : Math.min(6.5, wallH - 0.4);
      const sill = o.kind === 'door' ? 0 : Math.min(3, head - 1);
      return { s0: mid - w / 2, s1: mid + w / 2, head, sill, kind: o.kind };
    })
    .filter((c) => c.s1 - c.s0 > 0.4 && c.head > c.sill + 0.4)
    .sort((p, q) => p.s0 - q.s0);

  let cursor = 0;
  for (const c of cuts) {
    if (c.s0 > cursor + 0.05) {
      walls.push(panel(cursor, c.s0, 0, wallH, half), panel(cursor, c.s0, 0, wallH, -half));
    }
    if (c.sill > 0.05) {
      walls.push(panel(c.s0, c.s1, 0, c.sill, half), panel(c.s0, c.s1, 0, c.sill, -half));
    }
    if (wallH - c.head > 0.15) {
      walls.push(panel(c.s0, c.s1, c.head, wallH, half), panel(c.s0, c.s1, c.head, wallH, -half));
    }
    const inset = 0.12;
    if (c.kind === 'window') {
      holes.push({ kind: 'window', ring: panel(c.s0 + inset, c.s1 - inset, c.sill + 0.08, c.head - 0.08, 0) });
    } else {
      holes.push({
        kind: 'door',
        ring: panel(c.s0 + inset, c.s1 - inset, 0.06, c.head - 0.12, half * 0.35),
      });
    }
    cursor = Math.max(cursor, c.s1);
  }
  if (cursor < len - 0.05) {
    walls.push(panel(cursor, len, 0, wallH, half), panel(cursor, len, 0, wallH, -half));
  }
  if (!cuts.length) {
    walls.push(panel(0, len, 0, wallH, half), panel(0, len, 0, wallH, -half));
  }
  const cap = wallPrism(a, b, thick, wallH);
  walls.push(cap[2], cap[3], cap[4]);
  return { walls, holes };
}

/** A lawn a few feet past the walls. One short wall still gets a pad you can see. */
export function footprintPad(nodes: { x: number; y: number }[], pad = 5): { x: number; y: number }[] | null {
  if (!nodes.length) return null;
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const n of nodes) {
    x0 = Math.min(x0, n.x);
    y0 = Math.min(y0, n.y);
    x1 = Math.max(x1, n.x);
    y1 = Math.max(y1, n.y);
  }
  if (x1 - x0 < 2) { x0 -= 3; x1 += 3; }
  if (y1 - y0 < 2) { y0 -= 3; y1 += 3; }
  return [
    { x: x0 - pad, y: y0 - pad },
    { x: x1 + pad, y: y0 - pad },
    { x: x1 + pad, y: y1 + pad },
    { x: x0 - pad, y: y1 + pad },
  ];
}
