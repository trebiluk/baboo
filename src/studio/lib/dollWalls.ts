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
