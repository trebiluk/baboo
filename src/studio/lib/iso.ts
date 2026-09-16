/** Dollhouse projections. Plan feet → screen; z is up. */
export const ISO_SX = 18;
export const ISO_SY = 9;
export const ISO_SZ = 14;
export const WALL_H = 8;
/** px per foot for true-size axes (oblique front, elevation, ortho). */
export const ORTHO_S = 16;
/** Cabinet oblique: receding axis at 45°, half length. */
export const OBLIQUE_K = 0.5 * Math.SQRT1_2;
/** Tiny recede so elevation walls still sort. */
export const ELEV_K = 0.12;

export type DollProj = 'iso' | 'oblique' | 'elevation' | 'ortho';
export type YawDeg = 0 | 90 | 180 | 270;
export type DollFace = 'front' | 'right' | 'rear' | 'left' | 'top';

export const DOLL_PROJS: { id: DollProj }[] = [
  { id: 'iso' },
  { id: 'oblique' },
  { id: 'elevation' },
  { id: 'ortho' },
];

export const YAW_DEGS: YawDeg[] = [0, 90, 180, 270];

export function isDollProj(v: unknown): v is DollProj {
  return v === 'iso' || v === 'oblique' || v === 'elevation' || v === 'ortho';
}

export function asDollProj(v: unknown): DollProj {
  return isDollProj(v) ? v : 'iso';
}

export function asYawDeg(v: unknown): YawDeg {
  const n = Number(v);
  if (n === 90 || n === 180 || n === 270) return n;
  return 0;
}

export function yawToFace(yaw: YawDeg, top = false): DollFace {
  if (top) return 'top';
  if (yaw === 90) return 'right';
  if (yaw === 180) return 'rear';
  if (yaw === 270) return 'left';
  return 'front';
}

export function rotateYaw(x: number, y: number, yaw: YawDeg): { x: number; y: number } {
  const r = (yaw * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return { x: x * c - y * s, y: x * s + y * c };
}

export function unrotateYaw(x: number, y: number, yaw: YawDeg): { x: number; y: number } {
  const r = (yaw * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return { x: x * c + y * s, y: -x * s + y * c };
}

export type ProjSpec = { kind: DollProj; yaw: YawDeg; top?: boolean };

/** Screen point. y grows down. */
export function project(x: number, y: number, z: number, spec: ProjSpec): { x: number; y: number } {
  const p = rotateYaw(x, y, spec.yaw);
  const kind = spec.kind;
  if (kind === 'iso') {
    return {
      x: (p.x - p.y) * ISO_SX,
      y: (p.x + p.y) * ISO_SY - z * ISO_SZ,
    };
  }
  if (kind === 'oblique') {
    return {
      x: (p.x + OBLIQUE_K * p.y) * ORTHO_S,
      y: (-z + OBLIQUE_K * p.y) * ORTHO_S,
    };
  }
  if (kind === 'ortho' && spec.top) {
    return {
      x: p.x * ORTHO_S,
      y: p.y * ORTHO_S - z * 0.08 * ORTHO_S,
    };
  }
  // Elevation + orthographic front/side/rear: true XZ, shallow Y.
  const k = kind === 'elevation' ? ELEV_K : 0.04;
  return {
    x: (p.x + k * p.y) * ORTHO_S,
    y: (-z + k * p.y) * ORTHO_S,
  };
}

/** Floor (z = 0) inverse. */
export function unproject(sx: number, sy: number, spec: ProjSpec): { x: number; y: number } {
  let xr: number;
  let yr: number;
  if (spec.kind === 'iso') {
    const a = sx / ISO_SX;
    const b = sy / ISO_SY;
    xr = (a + b) / 2;
    yr = (b - a) / 2;
  } else if (spec.kind === 'oblique') {
    yr = sy / (ORTHO_S * OBLIQUE_K);
    xr = sx / ORTHO_S - OBLIQUE_K * yr;
  } else if (spec.kind === 'ortho' && spec.top) {
    xr = sx / ORTHO_S;
    yr = sy / ORTHO_S;
  } else {
    const k = spec.kind === 'elevation' ? ELEV_K : 0.04;
    yr = sy / (ORTHO_S * k);
    xr = sx / ORTHO_S - k * yr;
  }
  return unrotateYaw(xr, yr, spec.yaw);
}

export function projectPoints(
  pts: { x: number; y: number; z?: number }[],
  spec: ProjSpec,
): number[] {
  const out: number[] = [];
  for (const p of pts) {
    const q = project(p.x, p.y, p.z ?? 0, spec);
    out.push(q.x, q.y);
  }
  return out;
}

export function painterDepth(x: number, y: number, spec: ProjSpec): number {
  const p = rotateYaw(x, y, spec.yaw);
  if (spec.kind === 'iso') return p.x + p.y;
  if (spec.kind === 'ortho' && spec.top) return 0;
  return p.y;
}

/** Backward-compatible isometric, yaw 0. */
export function iso(x: number, y: number, z = 0): { x: number; y: number } {
  return project(x, y, z, { kind: 'iso', yaw: 0 });
}

export function fromIso(ix: number, iy: number, z = 0): { x: number; y: number } {
  void z;
  return unproject(ix, iy, { kind: 'iso', yaw: 0 });
}

export function isoPoints(pts: { x: number; y: number; z?: number }[]): number[] {
  return projectPoints(pts, { kind: 'iso', yaw: 0 });
}

export function nextYaw(yaw: YawDeg, dir: 1 | -1): YawDeg {
  const i = YAW_DEGS.indexOf(yaw);
  return YAW_DEGS[(i + dir + YAW_DEGS.length) % YAW_DEGS.length];
}
