/** Classroom wall flyout presets (Diego 2.1.1). Plan units stay feet. */
import type { WallDrawStyle } from '../types';

export type { WallDrawStyle };

export const WALL_THICKNESS_MM = [120, 200, 300] as const;
export const WALL_HEIGHT_M = [2.4, 2.7, 3.0] as const;
export const DEFAULT_WALL_THICKNESS_MM = 200;
export const DEFAULT_WALL_HEIGHT_M = 2.7;

export type WallThicknessMm = (typeof WALL_THICKNESS_MM)[number];
export type WallHeightM = (typeof WALL_HEIGHT_M)[number];

export const WALL_DRAW_STYLES: WallDrawStyle[] = ['outline', 'brick', 'cavity'];
export const DEFAULT_WALL_DRAW_STYLE: WallDrawStyle = 'outline';

export const MM_PER_FT = 304.8;
export const M_PER_FT = 0.3048;

export function mmToFt(mm: number): number {
  return mm / MM_PER_FT;
}

export function mToFt(m: number): number {
  return m / M_PER_FT;
}

export function ftToMm(ft: number): number {
  return ft * MM_PER_FT;
}

export function ftToM(ft: number): number {
  return ft * M_PER_FT;
}

export const DEFAULT_WALL_THICKNESS_FT = mmToFt(DEFAULT_WALL_THICKNESS_MM);
export const DEFAULT_WALL_HEIGHT_FT = mToFt(DEFAULT_WALL_HEIGHT_M);

function nearest<T extends number>(value: number, presets: readonly T[]): T {
  let best = presets[0];
  let gap = Math.abs(value - best);
  for (const p of presets) {
    const d = Math.abs(value - p);
    if (d < gap) {
      best = p;
      gap = d;
    }
  }
  return best;
}

export function nearestThicknessMm(ft: number): WallThicknessMm {
  return nearest(ftToMm(ft), WALL_THICKNESS_MM);
}

export function nearestHeightM(ft: number): WallHeightM {
  return nearest(ftToM(ft), WALL_HEIGHT_M);
}

export function asWallDrawStyle(v: unknown): WallDrawStyle {
  return WALL_DRAW_STYLES.includes(v as WallDrawStyle) ? (v as WallDrawStyle) : DEFAULT_WALL_DRAW_STYLE;
}

export function asWallHeightFt(v: unknown): number {
  if (typeof v === 'number' && Number.isFinite(v) && v >= 6 && v <= 16) return v;
  return DEFAULT_WALL_HEIGHT_FT;
}

export function asWallThicknessFt(v: unknown): number {
  if (typeof v === 'number' && Number.isFinite(v) && v >= 0.2 && v <= 2) return v;
  return DEFAULT_WALL_THICKNESS_FT;
}
