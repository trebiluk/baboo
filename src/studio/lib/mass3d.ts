/** Chromebook-safe 3D massing: projected faces, no WebGL. */
import type { Floor, FurnitureItem, LandscapeItem, Opening, Point, RoofGeometry, Wall } from '../types';
import type { SiteFinish, SkyPreset, WallTintId } from '../data/scene3d';
import { SITE_PALETTE, WALL_TINT, hexAlpha } from '../data/scene3d';
import { exteriorBounds } from './roof';
import { furnitureParts, partWorldCorners, partWorldRing } from './furnShape';
import { floorFinish, asFloorFinish, type FloorFinishId, type FloorGrain } from '../data/flooring';
import { listInteriorFaces, listInteriorFloors, roomPolygon } from './rooms';
import { FACE_BUDGET, FURN_CAP, PLANT_CAP, type FurnLod } from './perf';
import { wallFootprint, wallSidesAt } from './wallJoin';

export const WALL_H = 9;
export const EYE_Z = 5.5;

export type Vec3 = { x: number; y: number; z: number };

export type Cam3 = {
  target: Vec3;
  yaw: number;
  pitch: number;
  dist: number;
  walk: boolean;
};

export type FaceKind =
  | 'yard' | 'slab' | 'floor' | 'path' | 'wall' | 'glass' | 'door'
  | 'furn' | 'roof' | 'tree' | 'shadow' | 'bed';

export type MassFace = {
  pts: Vec3[];
  fill: string;
  stroke: string;
  kind: FaceKind;
  pattern?: FloorFinishId;
};

export type MassOpts = {
  sky: SkyPreset;
  site: SiteFinish;
  tint: WallTintId;
  showFurn: boolean;
  materials: boolean;
  lighting: boolean;
  blocky: boolean;
  floorId?: FloorFinishId;
  floorGrain?: FloorGrain;
  lod?: FurnLod;
};

export const ROOF_MAT: Record<string, { fill: string; shade: string; edge: string }> = {
  gable: { fill: '#5C6B82', shade: '#46546A', edge: '#8A9BB0' },
  hip: { fill: '#6A5B4A', shade: '#524536', edge: '#A09078' },
  gambrel: { fill: '#8B3A32', shade: '#6E2C26', edge: '#C07068' },
  shed: { fill: '#5A6674', shade: '#434C58', edge: '#8896A6' },
  flat: { fill: '#7A828C', shade: '#5E656E', edge: '#A8B0B8' },
  mansard: { fill: '#3E4450', shade: '#2A3038', edge: '#6A7380' },
  grass: { fill: '#4A7A48', shade: '#356038', edge: '#7AAB72' },
  conical: { fill: '#C4A574', shade: '#A88858', edge: '#E0C8A0' },
};

export function v3(x: number, y: number, z: number): Vec3 {
  return { x, y, z };
}

export function add(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

export function sub(a: Vec3, b: Vec3): Vec3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

export function scale(a: Vec3, s: number): Vec3 {
  return { x: a.x * s, y: a.y * s, z: a.z * s };
}

export function dot(a: Vec3, b: Vec3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

export function cross(a: Vec3, b: Vec3): Vec3 {
  return { x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x };
}

export function len3(a: Vec3): number {
  return Math.hypot(a.x, a.y, a.z);
}

export function norm(a: Vec3): Vec3 {
  const l = len3(a) || 1;
  return { x: a.x / l, y: a.y / l, z: a.z / l };
}

export function faceNormal(pts: Vec3[]): Vec3 {
  if (pts.length < 3) return { x: 0, y: 0, z: 1 };
  return norm(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0])));
}

export function centroid3(pts: Vec3[]): Vec3 {
  let x = 0, y = 0, z = 0;
  for (const p of pts) { x += p.x; y += p.y; z += p.z; }
  const n = pts.length || 1;
  return { x: x / n, y: y / n, z: z / n };
}

export function sunDir(sky: SkyPreset): Vec3 {
  if (sky === 'dusk') return norm({ x: 0.85, y: 0.15, z: 0.22 });
  if (sky === 'overcast') return norm({ x: 0.2, y: 0.2, z: 1 });
  return norm({ x: 0.55, y: -0.35, z: 0.76 });
}

export function camBasis(cam: Cam3): { eye: Vec3; right: Vec3; up: Vec3; forward: Vec3 } {
  const cp = Math.cos(cam.pitch);
  const sp = Math.sin(cam.pitch);
  const sy = Math.sin(cam.yaw);
  const cy = Math.cos(cam.yaw);
  const forward = { x: -sy * cp, y: -cy * cp, z: -sp };
  const eye = {
    x: cam.target.x - forward.x * cam.dist,
    y: cam.target.y - forward.y * cam.dist,
    z: cam.target.z - forward.z * cam.dist,
  };
  const worldUp = { x: 0, y: 0, z: 1 };
  const right = norm(cross(forward, worldUp));
  const up = norm(cross(right, forward));
  return { eye, right, up, forward };
}

export function project(p: Vec3, cam: Cam3, w: number, h: number): { x: number; y: number; depth: number } {
  const { eye, right, up, forward } = camBasis(cam);
  const rel = sub(p, eye);
  const sx = dot(rel, right);
  const sy = dot(rel, up);
  const sz = dot(rel, forward);
  const focal = Math.min(w, h) * 0.72;
  const k = focal / Math.max(1.2, sz);
  return { x: w / 2 + sx * k, y: h / 2 - sy * k, depth: sz };
}

export function defaultCam(floor: Floor, walk: boolean): Cam3 {
  const b = exteriorBounds(floor.nodes, floor.walls);
  const cx = b?.cx ?? 12;
  const cy = b?.cy ?? 10;
  const span = Math.max(b?.w ?? 24, b?.h ?? 18, 12);
  if (walk) {
    return {
      target: { x: cx, y: cy, z: EYE_Z },
      yaw: Math.PI * 0.15,
      pitch: 0.04,
      dist: 2.4,
      walk: true,
    };
  }
  return {
    target: { x: cx, y: cy, z: 4 },
    yaw: Math.PI * 0.28,
    pitch: 0.46,
    dist: span * 1.35 + 18,
    walk: false,
  };
}

function quad(a: Vec3, b: Vec3, c: Vec3, d: Vec3, fill: string, stroke: string, kind: FaceKind): MassFace {
  return { pts: [a, b, c, d], fill, stroke, kind };
}

function boxFaces(x0: number, y0: number, x1: number, y1: number, z0: number, z1: number, fill: string, stroke: string, kind: FaceKind): MassFace[] {
  const A = v3(x0, y0, z0);
  const B = v3(x1, y0, z0);
  const C = v3(x1, y1, z0);
  const D = v3(x0, y1, z0);
  const E = v3(x0, y0, z1);
  const F = v3(x1, y0, z1);
  const G = v3(x1, y1, z1);
  const H = v3(x0, y1, z1);
  return [
    quad(E, F, G, H, fill, stroke, kind),
    quad(B, C, G, F, fill, stroke, kind),
    quad(C, D, H, G, fill, stroke, kind),
    quad(D, A, E, H, fill, stroke, kind),
    quad(A, B, F, E, fill, stroke, kind),
  ];
}

function shade(hex: string, n: Vec3, sun: Vec3, opts: MassOpts): string {
  if (!opts.lighting) {
    const lift = n.z > 0.7 ? 1 : n.z > 0.2 ? 0.92 : 0.82;
    return hexAlpha(hex, opts.materials ? 0.96 : 0.9 * lift);
  }
  const ambient = opts.sky === 'overcast' ? 0.62 : opts.sky === 'dusk' ? 0.38 : 0.42;
  const sunAmt = opts.sky === 'overcast' ? 0.18 : opts.sky === 'dusk' ? 0.55 : 0.58;
  const ndl = Math.max(0, dot(n, sun));
  const wrap = Math.max(0, n.z) * 0.12;
  const lit = Math.min(1, ambient + ndl * sunAmt + wrap);
  return hexAlpha(hex, 0.55 + lit * 0.44);
}

export function buildMass(floor: Floor, opts: MassOpts): MassFace[] {
  const faces: MassFace[] = [];
  const tint = WALL_TINT[opts.tint];
  const site = SITE_PALETTE[opts.site];
  const stroke = opts.blocky ? '#1a1208' : tint.edge;
  const nodes = Object.fromEntries(floor.nodes.map((n) => [n.id, n]));
  const b = exteriorBounds(floor.nodes, floor.walls);
  const minX = b?.minX ?? 0;
  const maxX = b?.maxX ?? 24;
  const minY = b?.minY ?? 0;
  const maxY = b?.maxY ?? 18;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  const yardPad = 12;
  faces.push(quad(
    v3(minX - yardPad, minY - yardPad, 0),
    v3(maxX + yardPad, minY - yardPad, 0),
    v3(maxX + yardPad, maxY + yardPad, 0),
    v3(minX - yardPad, maxY + yardPad, 0),
    site.ground,
    site.edge,
    'yard',
  ));
  const loops = listInteriorFaces(floor.nodes, floor.walls);
  if (loops.length) {
    for (const loop of loops) {
      faces.push({
        pts: loop.poly.map((pt) => v3(pt.x, pt.y, 0.04)),
        fill: site.deep,
        stroke: site.edge,
        kind: 'slab',
      });
    }
  } else {
    faces.push(quad(
      v3(minX - 1.5, minY - 1.5, 0.04),
      v3(maxX + 1.5, minY - 1.5, 0.04),
      v3(maxX + 1.5, maxY + 1.5, 0.04),
      v3(minX - 1.5, maxY + 1.5, 0.04),
      site.deep,
      site.edge,
      'slab',
    ));
  }

  const houseFloor = asFloorFinish(opts.floorId);
  const interiorFloors = listInteriorFloors(floor.nodes, floor.walls, floor.rooms, houseFloor);
  if (interiorFloors.length) {
    for (const rf of interiorFloors) {
      faces.push({
        pts: rf.poly.map((pt) => v3(pt.x, pt.y, 0.07)),
        fill: floorFinish(rf.finish).color,
        stroke: opts.blocky ? '#1a1208' : floorFinish(rf.finish).color,
        kind: 'floor',
        pattern: opts.blocky ? undefined : rf.finish,
      });
    }
  } else if (b) {
    faces.push({
      pts: [
        v3(minX, minY, 0.06),
        v3(maxX, minY, 0.06),
        v3(maxX, maxY, 0.06),
        v3(minX, maxY, 0.06),
      ],
      fill: floorFinish(houseFloor).color,
      stroke: opts.blocky ? '#1a1208' : floorFinish(houseFloor).color,
      kind: 'floor',
      pattern: opts.blocky ? undefined : houseFloor,
    });
    for (const room of floor.rooms ?? []) {
      if (room.kind === 'outdoor') continue;
      const poly = roomPolygon(room, floor.nodes, floor.walls);
      if (!poly || poly.length < 3) continue;
      const fid = room.floorFinishId ?? houseFloor;
      if (!fid) continue;
      faces.push({
        pts: poly.map((pt) => v3(pt.x, pt.y, 0.07)),
        fill: floorFinish(fid).color,
        stroke: opts.blocky ? '#1a1208' : floorFinish(fid).color,
        kind: 'floor',
        pattern: opts.blocky ? undefined : fid,
      });
    }
  }

  const walkW = 3.2;
  faces.push(quad(
    v3(cx - walkW / 2, maxY - 0.4, 0.05),
    v3(cx + walkW / 2, maxY - 0.4, 0.05),
    v3(cx + walkW / 2, maxY + 8, 0.05),
    v3(cx - walkW / 2, maxY + 8, 0.05),
    opts.site === 'grass' ? '#6E6A64' : site.deep,
    site.edge,
    'path',
  ));

  const byWall = new Map<string, Opening[]>();
  for (const o of floor.openings ?? []) {
    const list = byWall.get(o.wallId) ?? [];
    list.push(o);
    byWall.set(o.wallId, list);
  }

  for (const wall of floor.walls) {
    const a = nodes[wall.a];
    const bpt = nodes[wall.b];
    if (!a || !bpt) continue;
    const dx = bpt.x - a.x;
    const dy = bpt.y - a.y;
    const len = Math.hypot(dx, dy);
    if (len < 0.05) continue;
    const ux = dx / len;
    const uy = dy / len;
    const nx = -uy;
    const ny = ux;
    const hw = (wall.thickness || 0.5) / 2;
    const fill = wall.kind === 'exterior' ? tint.fill : tint.fillShade;
    const h = wall.kind === 'interior' ? WALL_H - 0.4 : WALL_H;
    const ops = (byWall.get(wall.id) ?? []).slice().sort((p, q) => p.t - q.t);
    const foot = wallFootprint(wall, floor.nodes, floor.walls);

    type Span = { t0: number; t1: number; z0: number; z1: number };
    const spans: Span[] = [];
    let cursor = 0;
    for (const o of ops) {
      const half = Math.min((o.width || 3) / 2 / len, 0.45);
      const t0 = Math.max(0, (o.t ?? 0.5) - half);
      const t1 = Math.min(1, (o.t ?? 0.5) + half);
      if (t0 > cursor + 0.008) spans.push({ t0: cursor, t1: t0, z0: 0, z1: h });
      if (o.type === 'window') {
        spans.push({ t0, t1, z0: 0, z1: 2.2 });
        spans.push({ t0, t1, z0: 7, z1: h });
        const g0 = along(a, ux, uy, nx, ny, len, t0, hw, 2.25);
        const g1 = along(a, ux, uy, nx, ny, len, t1, hw, 2.25);
        const g2 = along(a, ux, uy, nx, ny, len, t1, hw, 6.95);
        const g3 = along(a, ux, uy, nx, ny, len, t0, hw, 6.95);
        faces.push(quad(g0, g1, g2, g3, opts.sky === 'dusk' ? '#F3D9A4' : '#9EC4DC', '#6A8AA4', 'glass'));
      } else {
        spans.push({ t0, t1, z0: 7.15, z1: h });
        const leaf = Math.min(0.85, (o.width || 3) * 0.55);
        const swing = o.swing === 'right' ? -1 : 1;
        const d0 = along(a, ux, uy, nx, ny, len, t0, hw, 0.05);
        const d1 = along(a, ux, uy, nx, ny, len, t0, hw + leaf * swing, 0.05);
        const d2 = along(a, ux, uy, nx, ny, len, t0, hw + leaf * swing, 7.1);
        const d3 = along(a, ux, uy, nx, ny, len, t0, hw, 7.1);
        faces.push(quad(d0, d1, d2, d3, '#6B5344', '#3A2E24', 'door'));
      }
      cursor = Math.max(cursor, t1);
    }
    if (cursor < 0.995) spans.push({ t0: cursor, t1: 1, z0: 0, z1: h });

    for (const s of spans) {
      const side0 = foot ? wallSidesAt(foot, s.t0) : null;
      const side1 = foot ? wallSidesAt(foot, s.t1) : null;
      const p00 = side0 ? v3(side0.left.x, side0.left.y, s.z0) : along(a, ux, uy, nx, ny, len, s.t0, hw, s.z0);
      const p10 = side1 ? v3(side1.left.x, side1.left.y, s.z0) : along(a, ux, uy, nx, ny, len, s.t1, hw, s.z0);
      const p11 = side1 ? v3(side1.left.x, side1.left.y, s.z1) : along(a, ux, uy, nx, ny, len, s.t1, hw, s.z1);
      const p01 = side0 ? v3(side0.left.x, side0.left.y, s.z1) : along(a, ux, uy, nx, ny, len, s.t0, hw, s.z1);
      const n00 = side0 ? v3(side0.right.x, side0.right.y, s.z0) : along(a, ux, uy, nx, ny, len, s.t0, -hw, s.z0);
      const n10 = side1 ? v3(side1.right.x, side1.right.y, s.z0) : along(a, ux, uy, nx, ny, len, s.t1, -hw, s.z0);
      const n11 = side1 ? v3(side1.right.x, side1.right.y, s.z1) : along(a, ux, uy, nx, ny, len, s.t1, -hw, s.z1);
      const n01 = side0 ? v3(side0.right.x, side0.right.y, s.z1) : along(a, ux, uy, nx, ny, len, s.t0, -hw, s.z1);
      faces.push(quad(p00, p10, p11, p01, fill, stroke, 'wall'));
      faces.push(quad(n10, n00, n01, n11, fill, stroke, 'wall'));
      if (s.z1 >= h - 0.05) {
        faces.push(quad(p01, p11, n11, n01, tint.fillShade, stroke, 'wall'));
      }
    }
  }

  if (floor.roof) faces.push(...roofFaces(floor.roof, opts.blocky));

  if (opts.showFurn) {
    const lod = opts.lod ?? 'full';
    const cap = FURN_CAP[lod];
    const budget = FACE_BUDGET[lod];
    for (const item of (floor.furniture ?? []).slice(0, cap)) {
      faces.push(...furnBox(item, opts.blocky, lod));
      if (faces.length > budget) break;
    }
  }

  {
    const lod = opts.lod ?? 'full';
    const budget = FACE_BUDGET[lod];
    const plantCap = PLANT_CAP[lod];
    if (faces.length < budget) {
      for (const plant of (floor.landscape ?? []).slice(0, plantCap)) {
        faces.push(...plantFaces(plant, opts.site, opts.blocky, lod));
        if (faces.length > budget) break;
      }
    }
  }

  if (opts.lighting && opts.lod !== 'simple' && opts.sky !== 'overcast' && b) {
    const sun = sunDir(opts.sky);
    const corners = [
      v3(minX, minY, WALL_H * 0.5),
      v3(maxX, minY, WALL_H * 0.5),
      v3(maxX, maxY, WALL_H * 0.5),
      v3(minX, maxY, WALL_H * 0.5),
    ].map((p) => projectOntoGround(p, sun));
    if (corners.length === 4) {
      faces.push({
        pts: corners,
        fill: '#2A3228',
        stroke: 'none',
        kind: 'shadow',
      });
    }
    const extras = faces.filter((f) => f.kind === 'furn' || f.kind === 'tree').slice(0, 28);
    for (const f of extras) {
      const c = centroid3(f.pts);
      const ground = projectOntoGround(c, sun);
      const r = f.kind === 'tree' ? 1.8 : 1.0;
      faces.push(quad(
        v3(ground.x - r, ground.y - r * 0.45, 0.03),
        v3(ground.x + r, ground.y - r * 0.45, 0.03),
        v3(ground.x + r, ground.y + r * 0.45, 0.03),
        v3(ground.x - r, ground.y + r * 0.45, 0.03),
        '#2A3228',
        'none',
        'shadow',
      ));
    }
  }

  return faces;
}

function along(
  a: Point, ux: number, uy: number, nx: number, ny: number,
  len: number, t: number, side: number, z: number,
): Vec3 {
  return {
    x: a.x + ux * t * len + nx * side,
    y: a.y + uy * t * len + ny * side,
    z,
  };
}

function projectOntoGround(p: Vec3, sun: Vec3): Vec3 {
  if (Math.abs(sun.z) < 0.05) return { x: p.x, y: p.y, z: 0 };
  const t = p.z / sun.z;
  return { x: p.x - sun.x * t, y: p.y - sun.y * t, z: 0 };
}

function roofFaces(roof: RoofGeometry, blocky: boolean): MassFace[] {
  const mat = ROOF_MAT[roof.styleId] ?? ROOF_MAT.gable;
  const stroke = blocky ? '#1a1208' : mat.edge;
  const eh = roof.eavesHeight;
  const rh = roof.ridgeHeight;
  const o = roof.outline;
  const out: MassFace[] = [];
  if (o.length < 3) return out;

  if (roof.styleId === 'flat') {
    const z = eh + 0.45;
    out.push({ pts: o.map((p) => v3(p.x, p.y, z)), fill: mat.fill, stroke, kind: 'roof' });
    return out;
  }

  if (roof.styleId === 'grass' || roof.styleId === 'conical') {
    const cx = o.reduce((s, p) => s + p.x, 0) / o.length;
    const cy = o.reduce((s, p) => s + p.y, 0) / o.length;
    const peak = v3(cx, cy, rh);
    for (let i = 0; i < o.length; i++) {
      const a = o[i];
      const b = o[(i + 1) % o.length];
      out.push({
        pts: [v3(a.x, a.y, eh), v3(b.x, b.y, eh), peak],
        fill: i % 2 === 0 ? mat.fill : mat.shade,
        stroke,
        kind: 'roof',
      });
    }
    return out;
  }

  if (roof.ridges.length && o.length >= 4) {
    const r = roof.ridges[0];
    const ra = v3(r.a.x, r.a.y, rh);
    const rb = v3(r.b.x, r.b.y, rh);
    const p0 = v3(o[0].x, o[0].y, eh);
    const p1 = v3(o[1].x, o[1].y, eh);
    const p2 = v3(o[2].x, o[2].y, eh);
    const p3 = v3(o[3].x, o[3].y, eh);
    if (roof.longAxis === 'x') {
      out.push(quad(p0, p1, rb, ra, mat.fill, stroke, 'roof'));
      out.push(quad(p3, p2, rb, ra, mat.shade, stroke, 'roof'));
    } else {
      out.push(quad(p0, p3, ra, rb, mat.fill, stroke, 'roof'));
      out.push(quad(p1, p2, rb, ra, mat.shade, stroke, 'roof'));
    }
    if (roof.styleId === 'gambrel' && roof.breaks.length >= 2) {
      const br = roof.breaks[0];
      const midZ = (eh + rh) * 0.55;
      out.push({
        pts: [v3(br.a.x, br.a.y, midZ), v3(br.b.x, br.b.y, midZ), rb, ra],
        fill: mat.shade,
        stroke,
        kind: 'roof',
      });
    }
    return out;
  }

  if (roof.hips.length) {
    const cx = o.reduce((s, p) => s + p.x, 0) / o.length;
    const cy = o.reduce((s, p) => s + p.y, 0) / o.length;
    const peak = roof.ridges[0]
      ? v3((roof.ridges[0].a.x + roof.ridges[0].b.x) / 2, (roof.ridges[0].a.y + roof.ridges[0].b.y) / 2, rh)
      : v3(cx, cy, rh);
    for (let i = 0; i < o.length; i++) {
      const a = o[i];
      const b = o[(i + 1) % o.length];
      out.push({
        pts: [v3(a.x, a.y, eh), v3(b.x, b.y, eh), peak],
        fill: i % 2 === 0 ? mat.fill : mat.shade,
        stroke,
        kind: 'roof',
      });
    }
    return out;
  }

  out.push({ pts: o.map((p) => v3(p.x, p.y, eh + 0.4)), fill: mat.fill, stroke, kind: 'roof' });
  return out;
}

function furnBox(item: FurnitureItem, blocky: boolean, lod: FurnLod = 'full'): MassFace[] {
  const stroke = blocky ? '#1a1208' : '#3f3f46';
  const out: MassFace[] = [];
  for (const part of furnitureParts(item, lod)) {
    const ring = lod === 'simple' ? partWorldCorners(item, part) : partWorldRing(item, part);
    if (ring.length < 3) continue;
    const z0 = part.z0;
    const z1 = part.z1;
    const T = ring.map((c) => v3(c.x, c.y, z1));
    const B = ring.map((c) => v3(c.x, c.y, z0));
    out.push({ pts: T, fill: part.fill, stroke, kind: 'furn' });
    if (z1 - z0 < 0.1) continue;
    if (lod === 'simple' && ring.length >= 4) {
      out.push(quad(B[1], B[2], T[2], T[1], part.fill, stroke, 'furn'));
      out.push(quad(B[2], B[3], T[3], T[2], part.fill, stroke, 'furn'));
      continue;
    }
    const n = ring.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      out.push(quad(B[i], B[j], T[j], T[i], part.fill, stroke, 'furn'));
    }
  }
  return out;
}

function plantFaces(item: LandscapeItem, site: SiteFinish, blocky: boolean, lod: FurnLod = 'full'): MassFace[] {
  const stroke = blocky ? '#1a1208' : '#2F5D3A';
  if (item.kind === 'tree') {
    const r = Math.max(item.w, item.h) / 2;
    const trunk = 0.35;
    if (lod === 'simple') {
      return boxFaces(
        item.x - r * 0.65,
        item.y - r * 0.65,
        item.x + r * 0.65,
        item.y + r * 0.65,
        0,
        3.2 + r,
        '#3D7A4A',
        stroke,
        'tree',
      );
    }
    const out = boxFaces(item.x - trunk, item.y - trunk, item.x + trunk, item.y + trunk, 0, 3.2, '#6B5344', stroke, 'tree');
    const peak = v3(item.x, item.y, 3.2 + r * 1.1);
    const ring = 8;
    for (let i = 0; i < ring; i++) {
      const a0 = (Math.PI * 2 * i) / ring;
      const a1 = (Math.PI * 2 * (i + 1)) / ring;
      out.push({
        pts: [
          v3(item.x + Math.cos(a0) * r, item.y + Math.sin(a0) * r, 3.2),
          v3(item.x + Math.cos(a1) * r, item.y + Math.sin(a1) * r, 3.2),
          peak,
        ],
        fill: i % 2 === 0 ? '#3D7A4A' : '#2F6B3A',
        stroke,
        kind: 'tree',
      });
    }
    return out;
  }
  if (item.kind === 'path') {
    return [quad(
      v3(item.x - item.w / 2, item.y - item.h / 2, 0.06),
      v3(item.x + item.w / 2, item.y - item.h / 2, 0.06),
      v3(item.x + item.w / 2, item.y + item.h / 2, 0.06),
      v3(item.x - item.w / 2, item.y + item.h / 2, 0.06),
      '#C4B59A',
      '#A09078',
      'path',
    )];
  }
  return [quad(
    v3(item.x - item.w / 2, item.y - item.h / 2, 0.08),
    v3(item.x + item.w / 2, item.y - item.h / 2, 0.08),
    v3(item.x + item.w / 2, item.y + item.h / 2, 0.08),
    v3(item.x - item.w / 2, item.y + item.h / 2, 0.08),
    SITE_PALETTE[site].edge,
    stroke,
    'bed',
  )];
}

export function projectFaces(faces: MassFace[], cam: Cam3, w: number, h: number, opts: MassOpts): {
  d: string;
  fill: string;
  stroke: string;
  sw: number;
  kind: FaceKind;
  pattern?: FloorFinishId;
}[] {
  const sun = sunDir(opts.sky);
  const painted = faces.map((f) => {
    const c = centroid3(f.pts);
    const n = faceNormal(f.pts);
    const pr = f.pts.map((p) => project(p, cam, w, h));
    if (pr.some((p) => p.depth < 0.4)) return null;
    const depth = pr.reduce((s, p) => s + p.depth, 0) / pr.length;
    const d = `M ${pr.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')} Z`;
    const fill = f.kind === 'shadow'
      ? hexAlpha('#1A2018', opts.sky === 'dusk' ? 0.28 : 0.22)
      : f.kind === 'glass'
        ? hexAlpha(f.fill, opts.sky === 'dusk' ? 0.85 : 0.55)
        : shade(f.fill, n, sun, opts);
    const sw = f.kind === 'shadow' ? 0 : opts.blocky ? 1.8 : f.kind === 'roof' ? 1.2 : 0.9;
    return {
      d,
      fill,
      stroke: f.stroke === 'none' ? 'none' : f.stroke,
      sw,
      kind: f.kind,
      pattern: f.pattern,
      depth,
      z: c.z,
      ndot: dot(n, camBasis(cam).forward),
    };
  }).filter(Boolean) as {
    d: string; fill: string; stroke: string; sw: number; kind: FaceKind;
    pattern?: FloorFinishId; depth: number; z: number; ndot: number;
  }[];

  painted.sort((a, b) => {
    const order: Record<FaceKind, number> = {
      yard: 0, shadow: 1, path: 2, bed: 2, slab: 3, floor: 3.5, wall: 4, door: 5, glass: 5,
      furn: 6, tree: 6, roof: 7,
    };
    const oa = order[a.kind] - order[b.kind];
    if (Math.abs(oa) && (a.kind === 'yard' || b.kind === 'yard' || a.kind === 'shadow' || b.kind === 'shadow')) return oa;
    return b.depth - a.depth;
  });
  return painted;
}

export function walkForward(cam: Cam3, steps: number): Cam3 {
  const { forward } = camBasis(cam);
  const flat = norm({ x: forward.x, y: forward.y, z: 0 });
  return {
    ...cam,
    target: {
      x: cam.target.x + flat.x * steps,
      y: cam.target.y + flat.y * steps,
      z: cam.walk ? EYE_Z : cam.target.z,
    },
  };
}
