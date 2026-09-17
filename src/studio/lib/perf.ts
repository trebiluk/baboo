/** Draw less when the house is busy or the camera is moving — keep the extra parts for still, close views. */
export type FurnLod = 'full' | 'simple';

export function furnitureLod(opts: {
  count?: number;
  zoom?: number;
  dist?: number;
  dragging?: boolean;
}): FurnLod {
  if (opts.dragging) return 'simple';
  if ((opts.count ?? 0) >= 24) return 'simple';
  if (opts.zoom != null && opts.zoom < 10) return 'simple';
  if (opts.dist != null && opts.dist > 52) return 'simple';
  return 'full';
}

export const FURN_CAP: Record<FurnLod, number> = {
  full: 36,
  simple: 72,
};

export const PLANT_CAP: Record<FurnLod, number> = {
  full: 24,
  simple: 8,
};

export const FACE_BUDGET: Record<FurnLod, number> = {
  full: 1400,
  simple: 700,
};
