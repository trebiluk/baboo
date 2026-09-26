import type { Point } from '../types';

/** Opposite corners become a rectangle. Too-small boxes are refused. */
export function boxCorners(a: Point, b: Point, min = 2): Point[] | null {
  const x0 = Math.min(a.x, b.x);
  const x1 = Math.max(a.x, b.x);
  const y0 = Math.min(a.y, b.y);
  const y1 = Math.max(a.y, b.y);
  if (x1 - x0 < min || y1 - y0 < min) return null;
  return [
    { x: x0, y: y0 },
    { x: x1, y: y0 },
    { x: x1, y: y1 },
    { x: x0, y: y1 },
  ];
}
