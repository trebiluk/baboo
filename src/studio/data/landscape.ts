import type { PlantKind } from '../types';

export const PLANT_CATALOG: {
  id: PlantKind;
  name: string;
  w: number;
  h: number;
  color: string;
}[] = [
  { id: 'tree', name: 'Tree', w: 6, h: 6, color: '#3D7A4A' },
  { id: 'bed', name: 'Plant bed', w: 8, h: 3, color: '#5A8F4A' },
  { id: 'path', name: 'Path', w: 8, h: 2.2, color: '#C4B59A' },
];

export function plantType(id: PlantKind) {
  return PLANT_CATALOG.find((p) => p.id === id) ?? PLANT_CATALOG[0];
}

export const BLOOM = ['#E25B6A', '#F2C14E', '#F7F3EA', '#E07A3D', '#C94B7A'] as const;

/** Stable flower positions so a bed looks planted, not random each frame. */
export function bloomSpots(id: string, n: number, w: number, h: number): { x: number; y: number; color: string }[] {
  let s = 2166136261;
  for (let i = 0; i < id.length; i++) s = Math.imul(s ^ id.charCodeAt(i), 16777619);
  const out: { x: number; y: number; color: string }[] = [];
  for (let i = 0; i < n; i++) {
    s = Math.imul(s, 1664525) + 1013904223;
    const u = ((s >>> 0) % 1000) / 1000;
    s = Math.imul(s, 1664525) + 1013904223;
    const v = ((s >>> 0) % 1000) / 1000;
    out.push({
      x: (u - 0.5) * w * 0.72,
      y: (v - 0.5) * h * 0.66,
      color: BLOOM[i % BLOOM.length],
    });
  }
  return out;
}
