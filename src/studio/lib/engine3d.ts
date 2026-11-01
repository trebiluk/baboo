/** WebGL house. Plan feet: world X = plan x, world Y = up, world Z = plan y. */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { Floor, FurnitureItem, Opening, RoofGeometry, Wall } from '../types';
import type { FloorFinishId } from '../data/flooring';
import { floorTileCanvas } from '../data/flooring';
import { listInteriorFloors } from './rooms';
import { furnitureParts } from './furnShape';
import { houseHasUpper, porchBounds, upperBody, viewRoof, wallStories } from './stories';

export type HouseLook = {
  wallH: number;
  tint: string;
  ground: string;
  showFurn: boolean;
  ceiling: boolean;
  houseFinish: FloorFinishId;
  /** Bigger machines: glossy floors. Set by the 3D view, not saved (2.13.18). */
  rich?: boolean;
};

export type BuiltHouse = {
  root: THREE.Group;
  dispose: () => void;
  lights: THREE.Vector3[];
};

function segDist(px: number, py: number, ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax;
  const dy = by - ay;
  const l2 = dx * dx + dy * dy;
  if (l2 < 1e-6) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

export function hitsWall(floor: Floor, x: number, z: number): boolean {
  const nodes = new Map(floor.nodes.map((n) => [n.id, n]));
  for (const w of floor.walls) {
    const a = nodes.get(w.a);
    const b = nodes.get(w.b);
    if (!a || !b) continue;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    if (len < 0.08) continue;
    const pad = (w.thickness || 0.5) * 0.5 + 0.32;
    if (segDist(x, z, a.x, a.y, b.x, b.y) >= pad) continue;
    const along = Math.max(0, Math.min(len, ((x - a.x) * dx + (z - a.y) * dy) / len));
    const throughDoor = (floor.openings ?? []).some((o) => {
      if (o.wallId !== w.id || o.type !== 'door') return false;
      const half = Math.min((o.width || 3) / 2, len * 0.46) + 0.45;
      const cx = Math.max(half, Math.min(len - half, (o.t ?? 0.5) * len));
      return Math.abs(along - cx) < half;
    });
    if (throughDoor) continue;
    return true;
  }
  return false;
}

/** Move forward, taking a shorter step or a small slide so a doorway is not a wall. */
export function stepWalk(floor: Floor, x: number, z: number, yaw: number, steps: number): { x: number; z: number } {
  const sin = Math.sin(yaw);
  const cos = Math.cos(yaw);
  const attempt = (dist: number, strafe = 0) => {
    const nx = x + sin * dist + cos * strafe;
    const nz = z + cos * dist - sin * strafe;
    return hitsWall(floor, nx, nz) ? null : { x: nx, z: nz };
  };
  return attempt(steps)
    ?? attempt(steps * 0.45)
    ?? attempt(steps * 0.45, 0.75)
    ?? attempt(steps * 0.45, -0.75)
    ?? { x, z };
}

type Bag = {
  root: THREE.Group;
  geos: THREE.BufferGeometry[];
  mats: THREE.Material[];
  shared: Map<string, THREE.Material>;
  /** Where lamps, sconces and chandeliers glow: the view puts warm lights there (2.13.22). */
  lights: THREE.Vector3[];
};

function mat(
  bag: Bag,
  hex: string,
  rough = 0.82,
  opts?: {
    metal?: number;
    opacity?: number;
    emissive?: string;
    glow?: number;
    map?: THREE.Texture | null;
    bump?: THREE.Texture | null;
    bumpScale?: number;
    glass?: boolean;
    sheen?: number;
    side2?: boolean;
  },
): THREE.Material {
  const key = `${hex}|${rough}|${opts?.metal ?? 0}|${opts?.opacity ?? 1}|${opts?.emissive ?? ''}|${opts?.glow ?? ''}|${opts?.map?.uuid ?? ''}|${opts?.bump?.uuid ?? ''}|${opts?.bumpScale ?? ''}|${opts?.glass ? 'g' : ''}|${opts?.sheen ?? ''}|${opts?.side2 ? 'd' : ''}`;
  const hit = bag.shared.get(key);
  if (hit) return hit;
  // Glass and polished floors use the physical material so they pick up the sky reflection (2.13.18).
  const physical = !!opts?.glass || (opts?.sheen ?? 0) > 0;
  const m = physical
    ? new THREE.MeshPhysicalMaterial({
      color: hex,
      roughness: rough,
      metalness: opts?.metal ?? 0,
      map: opts?.map ?? null,
      clearcoat: opts?.sheen ?? 0,
      clearcoatRoughness: 0.35,
      envMapIntensity: opts?.glass ? 1.6 : 1,
    })
    : new THREE.MeshStandardMaterial({
      color: hex,
      roughness: rough,
      metalness: opts?.metal ?? 0,
      map: opts?.map ?? null,
    });
  if (opts?.side2) m.side = THREE.DoubleSide;
  if (opts?.bump) {
    m.bumpMap = opts.bump;
    m.bumpScale = opts.bumpScale ?? 1;
  }
  if (opts?.opacity != null && opts.opacity < 1) {
    m.transparent = true;
    m.opacity = opts.opacity;
    m.depthWrite = opts.opacity > 0.7;
  }
  if (opts?.emissive) {
    m.emissive = new THREE.Color(opts.emissive);
    m.emissiveIntensity = opts.glow ?? 0.85;
  }
  bag.shared.set(key, m);
  bag.mats.push(m);
  return m;
}

const texCache = new Map<string, THREE.CanvasTexture>();

function paintTex(key: string, draw: (ctx: CanvasRenderingContext2D, s: number) => void, size = 128): THREE.CanvasTexture | null {
  const hit = texCache.get(key);
  if (hit) return hit;
  if (typeof document === 'undefined') return null;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  texCache.set(key, tex);
  return tex;
}

function brickMap(): THREE.CanvasTexture | null {
  return paintTex('brick', (ctx, s) => {
    ctx.fillStyle = '#8E4E3E';
    ctx.fillRect(0, 0, s, s);
    const rows = 8;
    const rh = s / rows;
    const bw = rh * 2;
    for (let r = 0; r < rows; r++) {
      const off = r % 2 ? bw / 2 : 0;
      for (let x = -bw; x < s + bw; x += bw + 2) {
        ctx.fillStyle = (r + x) % 5 === 0 ? '#C4846C' : '#B56A55';
        ctx.fillRect(x + off, r * rh + 1, bw - 1, rh - 2);
      }
    }
  });
}

function grainMap(): THREE.CanvasTexture | null {
  return paintTex('grain', (ctx, s) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s, s);
    let n = 11;
    for (let i = 0; i < 90; i++) {
      n = (n * 17 + 5) % 251;
      const x = (n * 3) % s;
      const y = (n * 7) % s;
      ctx.fillStyle = i % 4 === 0 ? 'rgba(0,0,0,0.14)' : 'rgba(0,0,0,0.06)';
      ctx.fillRect(x, y, 2, i % 3 === 0 ? 10 : 4);
    }
  }, 96);
}

function slateMap(): THREE.CanvasTexture | null {
  return paintTex('slate', (ctx, s) => {
    ctx.fillStyle = '#6A7686';
    ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = '#3E4854';
    ctx.lineWidth = 2;
    for (let y = 8; y < s; y += 16) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(s, y);
      ctx.stroke();
      const off = (y / 16) % 2 ? 20 : 0;
      for (let x = off; x < s; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, y - 14);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  });
}

function grassMap(): THREE.CanvasTexture | null {
  return paintTex('grass', (ctx, s) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, s, s);
    let n = 7;
    for (let i = 0; i < 900; i++) {
      n = (n * 73 + 41) % 1021;
      const x = (n * 13) % s;
      const y = (n * 29 + i) % s;
      const v = 222 + (n % 33);
      ctx.fillStyle = `rgb(${v - 10},${v},${v - 16})`;
      ctx.fillRect(x, y, 2, 2);
    }
  }, 128);
}

function plasterMap(): THREE.CanvasTexture | null {
  return paintTex('plaster', (ctx, s) => {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, s, s);
    let n = 3;
    for (let i = 0; i < 700; i++) {
      n = (n * 61 + 17) % 997;
      const v = 110 + (n % 40);
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect((n * 7) % s, (n * 11 + i) % s, 2, 2);
    }
  }, 96);
}

const floorTexCache = new Map<string, THREE.CanvasTexture>();

/** The same tile picture Dollhouse paints, so 3D floors match it (2.13.18). */
function floorTex(id: FloorFinishId): THREE.CanvasTexture | null {
  if (typeof document === 'undefined') return null;
  const hit = floorTexCache.get(id);
  if (hit) return hit;
  const tex = new THREE.CanvasTexture(floorTileCanvas(id));
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  floorTexCache.set(id, tex);
  return tex;
}

function uvFeet(geo: THREE.BufferGeometry, fu: number, fv: number, useZ = false) {
  const pos = geo.getAttribute('position');
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = pos.getX(i) / fu;
    uv[i * 2 + 1] = (useZ ? pos.getZ(i) : pos.getY(i)) / fv;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
}

let shadeGeo: THREE.CircleGeometry | null = null;
let shadeMat: THREE.MeshBasicMaterial | null = null;

function dropShadow(bag: Bag, x: number, z: number, w: number, h: number, rot: number) {
  if (!shadeGeo) shadeGeo = new THREE.CircleGeometry(0.5, 12);
  if (!shadeMat) {
    shadeMat = new THREE.MeshBasicMaterial({
      color: 0x1a2418,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    });
  }
  const mesh = new THREE.Mesh(shadeGeo, shadeMat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.rotation.z = -rot;
  mesh.scale.set(Math.max(0.7, w * 0.52), Math.max(0.7, h * 0.52), 1);
  mesh.position.set(x, 0.04, z);
  bag.root.add(mesh);
}
function addMesh(
  bag: Bag,
  geo: THREE.BufferGeometry,
  material: THREE.Material,
  cast = false,
  receive = false,
): THREE.Mesh {
  bag.geos.push(geo);
  const mesh = new THREE.Mesh(geo, material);
  mesh.castShadow = cast;
  mesh.receiveShadow = receive;
  mesh.userData.batch = true;
  bag.root.add(mesh);
  return mesh;
}

/**
 * Merge the many small static pieces (rails, sills, shutters, trim, dormers) that share a material and a name into
 * one mesh each, so a detailed house costs a few draw calls instead of hundreds (2.13.20).
 */
function flushBatches(bag: Bag) {
  const groups = new Map<string, THREE.Mesh[]>();
  for (const child of [...bag.root.children]) {
    const m = child as THREE.Mesh;
    if (!m.isMesh || !m.userData.batch) continue;
    const key = `${(m.material as THREE.Material).uuid}|${m.name}|${m.castShadow ? 1 : 0}${m.receiveShadow ? 1 : 0}`;
    const list = groups.get(key);
    if (list) list.push(m);
    else groups.set(key, [m]);
  }
  for (const list of groups.values()) {
    if (list.length < 2) continue;
    const parts: THREE.BufferGeometry[] = [];
    for (const m of list) {
      m.updateMatrix();
      let g = m.geometry.clone();
      if (g.index) g = g.toNonIndexed();
      for (const name of Object.keys(g.attributes)) if (name !== 'position' && name !== 'normal' && name !== 'uv') g.deleteAttribute(name);
      if (!g.getAttribute('uv')) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(g.getAttribute('position').count * 2), 2));
      g.applyMatrix4(m.matrix);
      parts.push(g);
    }
    const merged = mergeGeometries(parts, false);
    parts.forEach((g) => g.dispose());
    if (!merged) continue;
    const one = new THREE.Mesh(merged, list[0].material);
    one.name = list[0].name;
    one.castShadow = list[0].castShadow;
    one.receiveShadow = list[0].receiveShadow;
    bag.geos.push(merged);
    for (const m of list) bag.root.remove(m);
    bag.root.add(one);
  }
}

function shapeOnGround(pts: { x: number; y: number }[]): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(pts[0].x, -pts[0].y);
  for (let i = 1; i < pts.length; i++) shape.lineTo(pts[i].x, -pts[i].y);
  shape.closePath();
  return shape;
}

function floorMesh(bag: Bag, pts: { x: number; y: number }[], y: number, material: THREE.Material, name?: string) {
  if (pts.length < 3) return;
  const geo = new THREE.ShapeGeometry(shapeOnGround(pts));
  geo.rotateX(-Math.PI / 2);
  uvFeet(geo, 2.6, 2.6, true);
  const mesh = addMesh(bag, geo, material, false, name !== 'ceiling');
  mesh.position.y = y;
  if (name) mesh.name = name;
  if (name === 'ceiling') {
    mesh.castShadow = false;
    mesh.receiveShadow = false;
  }
}

function pushTri(out: number[], a: number[], b: number[], c: number[]) {
  out.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
}

function pushQuad(out: number[], a: number[], b: number[], c: number[], d: number[]) {
  pushTri(out, a, b, c);
  pushTri(out, a, c, d);
}

/** Turn every triangle so it faces away from the shell's centre. A gable's two slopes otherwise cancel out and one stays inside-out (2.13.16). */
function faceOut(pos: number[]): void {
  const n = pos.length / 3;
  let cx = 0;
  let cy = 0;
  let cz = 0;
  for (let i = 0; i < pos.length; i += 3) {
    cx += pos[i];
    cy += pos[i + 1];
    cz += pos[i + 2];
  }
  cx /= n;
  cy /= n;
  cz /= n;
  cy -= 1; // aim a little low so near-flat tops count as facing up
  for (let i = 0; i + 8 < pos.length; i += 9) {
    const ux = pos[i + 3] - pos[i];
    const uy = pos[i + 4] - pos[i + 1];
    const uz = pos[i + 5] - pos[i + 2];
    const vx = pos[i + 6] - pos[i];
    const vy = pos[i + 7] - pos[i + 1];
    const vz = pos[i + 8] - pos[i + 2];
    const nx = uy * vz - uz * vy;
    const ny = uz * vx - ux * vz;
    const nz = ux * vy - uy * vx;
    const mx = (pos[i] + pos[i + 3] + pos[i + 6]) / 3 - cx;
    const my = (pos[i + 1] + pos[i + 4] + pos[i + 7]) / 3 - cy;
    const mz = (pos[i + 2] + pos[i + 5] + pos[i + 8]) / 3 - cz;
    if (nx * mx + ny * my + nz * mz < 0) {
      for (let k = 0; k < 3; k++) {
        const t = pos[i + 3 + k];
        pos[i + 3 + k] = pos[i + 6 + k];
        pos[i + 6 + k] = t;
      }
    }
  }
}

function meshFromPos(bag: Bag, pos: number[], material: THREE.Material, name?: string, outward = false): void {
  if (pos.length < 9) return;
  if (outward) faceOut(pos);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.computeVertexNormals();
  const nrm = geo.getAttribute('normal');
  let ny = 0;
  for (let i = 0; i < nrm.count; i++) ny += nrm.getY(i);
  if (!outward && ny < 0) {
    const p = geo.getAttribute('position');
    for (let i = 0; i < p.count; i += 3) {
      const x = p.getX(i);
      const y = p.getY(i);
      const z = p.getZ(i);
      p.setXYZ(i, p.getX(i + 1), p.getY(i + 1), p.getZ(i + 1));
      p.setXYZ(i + 1, x, y, z);
    }
    p.needsUpdate = true;
    geo.computeVertexNormals();
  }
  uvFeet(geo, 3.2, 3.2, true);
  const mesh = addMesh(bag, geo, material, true, true);
  if (name) mesh.name = name;
  void mesh;
}

function addWall(bag: Bag, floor: Floor, wall: Wall, look: HouseLook, nodes: Map<string, { x: number; y: number }>, center: { x: number; y: number }) {
  const a = nodes.get(wall.a);
  const b = nodes.get(wall.b);
  if (!a || !b) return;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  if (len < 0.08) return;
  const thick = Math.max(0.35, wall.thickness || 0.45);
  const stories = wallStories(floor, wall);
  const upper = houseHasUpper(floor);
  // Which side is outside: away from the middle of the house (2.13.20).
  const ux0 = dx / len;
  const uy0 = dy / len;
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  let out = { x: -uy0, y: ux0 };
  if (out.x * (mx - center.x) + out.y * (my - center.y) < 0) out = { x: uy0, y: -ux0 };
  // A one-story wall on a two-story house is the porch: draw it as an open rail between posts, so the porch
  // reads as a porch (columns, light, steps) instead of a closed brick box (2.13.20).
  if (upper && wall.kind === 'exterior' && stories === 1 && (floor.rooms ?? []).some((r) => r.kind === 'outdoor')) {
    addPorchRail(bag, floor, wall, a, b, look);
    return;
  }
  const h = wall.kind === 'interior' ? (upper ? look.wallH : Math.max(7, look.wallH - 0.35)) : look.wallH * stories;
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(len, 0);
  shape.lineTo(len, h);
  shape.lineTo(0, h);
  shape.closePath();
  const ops = floor.openings.filter((o) => o.wallId === wall.id);
  const ux = dx / len;
  const uy = dy / len;
  const ang = -Math.atan2(dy, dx);
  for (const o of ops) {
    const half = Math.min((o.width || 3) / 2, len * 0.46);
    const cx = Math.max(half + 0.05, Math.min(len - half - 0.05, (o.t ?? 0.5) * len));
    const x0 = cx - half;
    const x1 = cx + half;
    const bands = o.type === 'window' && stories >= 2 ? [0, look.wallH] : [0];
    for (const base of bands) {
      if (o.type !== 'window' && base > 0) continue;
      const y0 = o.type === 'window' ? base + look.wallH * 0.28 : 0.02;
      const y1 = o.type === 'window' ? base + look.wallH * 0.78 : look.wallH * 0.8;
      if (x1 - x0 < 0.4 || y1 - y0 < 0.4 || y1 > h - 0.05) continue;
      const hole = new THREE.Path();
      hole.moveTo(x0, y0);
      hole.lineTo(x1, y0);
      hole.lineTo(x1, y1);
      hole.lineTo(x0, y1);
      hole.closePath();
      shape.holes.push(hole);
      placeOpening(bag, o, a, ux, uy, ang, cx, x0, y0, y1);
    }
  }
  const geo = new THREE.ExtrudeGeometry(shape, { depth: thick, bevelEnabled: false });
  geo.translate(0, 0, -thick / 2);
  const brick = wall.drawStyle === 'brick' && wall.kind === 'exterior';
  if (brick) uvFeet(geo, 2.2, 1.15);
  const color = brick ? '#ffffff' : wall.kind === 'exterior' ? look.tint : '#F4EFE6';
  const mesh = addMesh(
    bag,
    geo,
    mat(bag, color, brick ? 0.92 : 0.8, brick
      ? { map: brickMap(), bump: look.rich ? brickMap() : null, bumpScale: 2.2 }
      : { bump: look.rich ? plasterMap() : null, bumpScale: 0.35 }),
    true,
    true,
  );
  mesh.position.set(a.x, 0, a.y);
  mesh.rotation.y = ang;
  // Inside faces: an outside brick wall is plaster indoors, and every room gets a white baseboard (2.13.22).
  const zOut = (-uy) * out.x + ux * out.y > 0 ? 1 : -1; // local +z points outside when 1
  const insideSides = wall.kind === 'exterior' ? [-zOut] : [1, -1];
  if (brick || wall.kind === 'exterior') {
    const skinGeo = new THREE.ShapeGeometry(shape);
    uvFeet(skinGeo, 3.2, 3.2);
    const skin = addMesh(bag, skinGeo, mat(bag, '#EFE8DD', 0.9, { side2: true }), false, true);
    skin.position.set(a.x, 0, a.y);
    skin.rotation.y = ang;
    skinGeo.translate(0, 0, -zOut * (thick / 2 + 0.012));
  }
  const doorRanges = ops.filter((o) => o.type === 'door').map((o) => {
    const half = Math.min((o.width || 3) / 2, len * 0.46);
    const c = Math.max(half + 0.05, Math.min(len - half - 0.05, (o.t ?? 0.5) * len));
    return [c - half, c + half] as const;
  }).sort((p, q) => p[0] - q[0]);
  const runs: [number, number][] = [];
  let from = 0;
  for (const [d0, d1] of doorRanges) { if (d0 > from + 0.2) runs.push([from, d0]); from = Math.max(from, d1); }
  if (len > from + 0.2) runs.push([from, len]);
  const base = mat(bag, '#FBF8F2', 0.55);
  for (const side of insideSides) {
    for (const [r0, r1] of runs) {
      const bb = addMesh(bag, new THREE.BoxGeometry(r1 - r0, 0.45, 0.06), base, false, true);
      const along = (r0 + r1) / 2;
      const off = side * (thick / 2 + 0.03);
      // local z offset turned into plan coordinates: local +z is plan (-uy, ux)
      bb.position.set(a.x + ux * along + (-uy) * off, 0.225, a.y + uy * along + ux * off);
      bb.rotation.y = ang;
    }
  }
  if (wall.kind === 'exterior') {
    // Stone plinth at the base and a band between floors: the lines that make a facade look built (2.13.20).
    const stone = mat(bag, '#D8CFC2', 0.85);
    const band = (y: number, hgt: number, proud: number) => {
      const m = addMesh(bag, new THREE.BoxGeometry(len + proud * 2, hgt, thick + proud * 2), stone, false, true);
      m.position.set(mx, y, my);
      m.rotation.y = ang;
    };
    band(0.55, 1.1, 0.08);
    if (stories >= 2) band(look.wallH, 0.42, 0.1);
  }
  for (const o of ops) dressOpening(bag, o, a, ux, uy, ang, len, thick, out, stories, look, wall.drawStyle === 'brick');
}

/** Low rail with turned balusters, posts at the ends, and a gap where the door or opening is. */
function addPorchRail(
  bag: Bag,
  floor: Floor,
  wall: Wall,
  a: { x: number; y: number },
  b: { x: number; y: number },
  look: HouseLook,
) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const ang = -Math.atan2(dy, dx);
  const white = mat(bag, '#F4F0E8', 0.6);
  const gaps = floor.openings.filter((o) => o.wallId === wall.id).map((o) => {
    const half = Math.min((o.width || 3) / 2, len * 0.46);
    const c = Math.max(half, Math.min(len - half, (o.t ?? 0.5) * len));
    return [c - half, c + half] as const;
  });
  const inGap = (t: number) => gaps.some(([g0, g1]) => t > g0 - 0.05 && t < g1 + 0.05);
  const at = (t: number) => ({ x: a.x + ux * t, z: a.y + uy * t });
  // rails, broken at the gaps
  const runs: [number, number][] = [];
  let start = 0;
  for (const [g0, g1] of [...gaps].sort((p, q) => p[0] - q[0])) {
    if (g0 > start + 0.3) runs.push([start, g0]);
    start = Math.max(start, g1);
  }
  if (len > start + 0.3) runs.push([start, len]);
  for (const [r0, r1] of runs) {
    const c = at((r0 + r1) / 2);
    for (const [y, hgt] of [[3.0, 0.22], [0.45, 0.16]] as const) {
      const rail = addMesh(bag, new THREE.BoxGeometry(r1 - r0, hgt, 0.34), white, true, true);
      rail.position.set(c.x, y, c.z);
      rail.rotation.y = ang;
    }
  }
  const baluster = new THREE.CylinderGeometry(0.07, 0.09, 2.45, 6);
  bag.geos.push(baluster);
  for (let t = 0.35; t < len - 0.2; t += 0.55) {
    if (inGap(t)) continue;
    const p = at(t);
    const m = new THREE.Mesh(baluster, white);
    m.position.set(p.x, 1.75, p.z);
    m.castShadow = true;
    m.userData.batch = true;
    bag.root.add(m);
  }
  // square posts at both ends carry the porch roof
  for (const t of [0.2, len - 0.2]) {
    const p = at(t);
    const post = addMesh(bag, new THREE.BoxGeometry(0.62, look.wallH, 0.62), white, true, true);
    post.position.set(p.x, look.wallH / 2, p.z);
  }
  // porch floor edge: a stone step under the opening
  for (const [g0, g1] of gaps) {
    const c = at((g0 + g1) / 2);
    const step = addMesh(bag, new THREE.BoxGeometry(g1 - g0 + 1.2, 0.4, 1.4), mat(bag, '#CFC6B8', 0.85), false, true);
    step.position.set(c.x, 0.2, c.z);
    step.rotation.y = ang;
  }
}

/** Sill, lintel and shutters on windows; a frame and a hood on outside doors (2.13.20). */
function dressOpening(
  bag: Bag,
  o: Opening,
  a: { x: number; y: number },
  ux: number,
  uy: number,
  ang: number,
  len: number,
  thick: number,
  out: { x: number; y: number },
  stories: number,
  look: HouseLook,
  brick: boolean,
) {
  const half = Math.min((o.width || 3) / 2, len * 0.46);
  const cx = Math.max(half + 0.05, Math.min(len - half - 0.05, (o.t ?? 0.5) * len));
  const stone = mat(bag, '#E3DACB', 0.8);
  const face = thick / 2 + 0.02;
  const put = (geo: THREE.BufferGeometry, m: THREE.Material, along: number, y: number, outBy: number) => {
    const mesh = addMesh(bag, geo, m, true, true);
    mesh.position.set(a.x + ux * along + out.x * outBy, y, a.y + uy * along + out.y * outBy);
    mesh.rotation.y = ang;
    return mesh;
  };
  if (o.type === 'window') {
    const bands = stories >= 2 ? [0, look.wallH] : [0];
    for (const base of bands) {
      const y0 = base + look.wallH * 0.28;
      const y1 = base + look.wallH * 0.78;
      const w = half * 2;
      put(new THREE.BoxGeometry(w + 0.6, 0.2, thick + 0.36), stone, cx, y0 - 0.1, 0.06);
      put(new THREE.BoxGeometry(w + 0.5, 0.42, thick + 0.1), stone, cx, y1 + 0.21, 0.02);
      if (brick) {
        const shutter = mat(bag, '#2F4A3A', 0.7);
        for (const sgn of [-1, 1]) {
          put(new THREE.BoxGeometry(Math.min(1.3, w * 0.42), y1 - y0, 0.1), shutter, cx + sgn * (half + Math.min(1.3, w * 0.42) / 2 + 0.12), (y0 + y1) / 2, face + 0.05);
        }
      }
    }
    return;
  }
  // outside door: casing on the outer face and a small hood above
  if (o.symbolKind === 'slidingDoor') return;
  const y1 = look.wallH * 0.8;
  const casing = mat(bag, '#F2EDE3', 0.6);
  for (const sgn of [-1, 1]) put(new THREE.BoxGeometry(0.32, y1 + 0.2, 0.14), casing, cx + sgn * (half + 0.16), (y1 + 0.2) / 2, face);
  put(new THREE.BoxGeometry(half * 2 + 1.0, 0.32, 0.9), casing, cx, y1 + 0.42, face + 0.4);
}

function placeOpening(
  bag: Bag,
  o: Opening,
  a: { x: number; y: number },
  ux: number,
  uy: number,
  ang: number,
  cx: number,
  x0: number,
  y0: number,
  y1: number,
) {
  const px = a.x + ux * cx;
  const pz = a.y + uy * cx;
  if (o.type === 'window') {
    const fw = Math.max(0.4, (o.width || 3) * 0.92);
    const fh = y1 - y0;
    const wood = mat(bag, '#E4D2B8', 0.68);
    const jamb = 0.1;
    const trim = (lx: number, ly: number, sx: number, sy: number) => {
      const mesh = addMesh(bag, new THREE.BoxGeometry(sx, sy, 0.16), wood, false, false);
      mesh.position.set(a.x + ux * lx, ly, a.y + uy * lx);
      mesh.rotation.y = ang;
    };
    trim(cx, y1 - jamb * 0.45, fw + jamb * 2, jamb);
    trim(cx, y0 + jamb * 0.45, fw + jamb * 2, jamb);
    trim(cx - fw / 2, (y0 + y1) / 2, jamb, fh);
    trim(cx + fw / 2, (y0 + y1) / 2, jamb, fh);
    trim(cx, (y0 + y1) / 2, jamb * 0.65, fh - jamb * 2);
    trim(cx, y0 + fh * 0.62, fw - jamb, jamb * 0.55);
    const glass = addMesh(
      bag,
      new THREE.PlaneGeometry(fw - jamb, fh - jamb * 1.4),
      mat(bag, '#C5DFF0', 0.04, { opacity: 0.38, metal: 0.1, glass: true }),
      false,
    );
    glass.position.set(px, (y0 + y1) / 2, pz);
    glass.rotation.y = ang;
    return;
  }
  const leafW = Math.max(0.6, (o.width || 3) * 0.46);
  const leaf = addMesh(
    bag,
    new THREE.BoxGeometry(leafW, y1 - y0 - 0.08, 0.12),
    mat(bag, '#6B5344', 0.62),
    true,
    false,
  );
  const swing = o.swing === 'right' ? -1 : 1;
  const hingeX = a.x + ux * x0;
  const hingeZ = a.y + uy * x0;
  const nx = -uy * swing;
  const nz = ux * swing;
  leaf.position.set(hingeX + ux * leafW * 0.15 + nx * leafW * 0.42, (y0 + y1) / 2, hingeZ + uy * leafW * 0.15 + nz * leafW * 0.42);
  leaf.rotation.y = ang + swing * 0.7;
}

function addRoof(bag: Bag, roof: RoofGeometry, rich = false) {
  const o = roof.outline;
  if (o.length < 3) return;
  const eh = roof.eavesHeight;
  const rh = roof.ridgeHeight;
  // Cornice: a deep trim band all round under the eaves, so the roof sits on the house instead of floating (2.13.20).
  if (roof.styleId !== 'grass') {
    const trim = mat(bag, '#EFE8DC', 0.7);
    for (let i = 0; i < o.length; i++) {
      const p = o[i];
      const q = o[(i + 1) % o.length];
      const L = Math.hypot(q.x - p.x, q.y - p.y);
      if (L < 0.5) continue;
      for (const [y, hgt, dep] of [[eh - 0.2, 0.4, 0.5], [eh - 0.58, 0.34, 0.22]] as const) {
        const m = addMesh(bag, new THREE.BoxGeometry(L + dep * 2, hgt, dep * 2), trim, false, true);
        m.position.set((p.x + q.x) / 2, y, (p.y + q.y) / 2);
        m.rotation.y = -Math.atan2(q.y - p.y, q.x - p.x);
        m.name = 'roof';
      }
    }
  }
  const slate = roof.styleId === 'grass'
    ? mat(bag, '#3E6B3A', 0.8)
    : mat(bag, '#ffffff', 0.78, { map: slateMap(), bump: rich ? slateMap() : null, bumpScale: 2.5 });
  if (roof.styleId === 'mansard' && o.length >= 4 && roof.breaks.length >= 4) {
    const inner = roof.breaks.slice(0, 4).map((b) => b.a);
    const capY = eh + Math.max(4.5, (rh - eh) * 0.78);
    const pos: number[] = [];
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      const a = [o[i].x, eh, o[i].y];
      const b = [o[j].x, eh, o[j].y];
      const c = [inner[j].x, capY, inner[j].y];
      const d = [inner[i].x, capY, inner[i].y];
      pushQuad(pos, a, b, c, d);
    }
    meshFromPos(bag, pos, slate, 'roof', true);
    const soffit: number[] = [];
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      const a = [o[i].x, eh - 0.02, o[i].y];
      const b = [o[j].x, eh - 0.02, o[j].y];
      const c = [inner[j].x, capY - 0.02, inner[j].y];
      const d = [inner[i].x, capY - 0.02, inner[i].y];
      pushQuad(soffit, a, d, c, b);
    }
    meshFromPos(bag, soffit, mat(bag, '#E7E2DA', 0.94), 'roof');
    floorMesh(bag, inner, capY + 0.05, slate, 'roof');
    addDormers(bag, o.slice(0, 4), inner, eh, capY, slate);
    return;
  }
  if (roof.ridges.length && o.length >= 4) {
    const r = roof.ridges[0];
    const ra = [r.a.x, rh, r.a.y];
    const rb = [r.b.x, rh, r.b.y];
    const p = o.slice(0, 4).map((q) => [q.x, eh, q.y]);
    const pos: number[] = [];
    if (roof.longAxis === 'x') {
      pushQuad(pos, p[0], p[1], rb, ra);
      pushQuad(pos, p[3], p[2], rb, ra);
      pushTri(pos, p[0], p[3], ra);
      pushTri(pos, p[1], p[2], rb);
    } else {
      pushQuad(pos, p[0], p[3], ra, rb);
      pushQuad(pos, p[1], p[2], rb, ra);
      pushTri(pos, p[0], p[1], ra);
      pushTri(pos, p[3], p[2], rb);
    }
    meshFromPos(bag, pos, slate, 'roof', true);
    return;
  }
  floorMesh(bag, o, eh + 0.4, slate, 'roof');
}

/**
 * Dormer windows along the two long sides of a mansard: a small gabled box with a window, every ~9 ft.
 * They break up the big slate face, the way real mansard roofs do (2.13.20).
 */
function addDormers(
  bag: Bag,
  o: { x: number; y: number }[],
  inner: { x: number; y: number }[],
  eh: number,
  capY: number,
  slate: THREE.Material,
) {
  const white = mat(bag, '#F4F0E8', 0.6);
  // dormer glass reads dark from outside (a small room behind it), with a white sash around it
  const glass = mat(bag, '#3E5468', 0.12, { metal: 0.2, glass: true });
  // the pane and the gable face are single planes: show both sides so they read from any angle
  white.side = THREE.DoubleSide;
  glass.side = THREE.DoubleSide;
  const edges = [0, 1, 2, 3].map((i) => ({ i, L: Math.hypot(o[(i + 1) % 4].x - o[i].x, o[(i + 1) % 4].y - o[i].y) }));
  const longest = Math.max(...edges.map((e) => e.L));
  for (const { i, L } of edges) {
    if (L < longest * 0.8 || L < 14) continue;
    const p = o[i];
    const q = o[(i + 1) % 4];
    const pi = inner[i];
    const ux = (q.x - p.x) / L;
    const uy = (q.y - p.y) / L;
    // outward = from the inner ring toward this edge
    const mxE = (p.x + q.x) / 2;
    const myE = (p.y + q.y) / 2;
    const mxI = (pi.x + inner[(i + 1) % 4].x) / 2;
    const myI = (pi.y + inner[(i + 1) % 4].y) / 2;
    const run = Math.hypot(mxE - mxI, myE - myI) || 1;
    const nx = (mxE - mxI) / run;
    const ny = (myE - myI) / run;
    const count = Math.max(2, Math.floor((L - 6) / 9));
    const step = (L - 6) / (count - 1 || 1);
    const ang = -Math.atan2(uy, ux);
    const dw = 3.4;
    const dh = Math.min(4.2, (capY - eh) * 0.62);
    for (let k = 0; k < count; k++) {
      const t = 3 + k * step;
      // set the face 40% up the slope, pulled out to the eave line a little
      const f = 0.38;
      const fx = p.x + ux * t - nx * run * f;
      const fz = p.y + uy * t - ny * run * f;
      const baseY = eh + (capY - eh) * f - 0.2;
      const depth = run * 0.7;
      const body = addMesh(bag, new THREE.BoxGeometry(dw, dh, depth), white, true, true);
      body.position.set(fx - nx * depth / 2, baseY + dh / 2, fz - ny * depth / 2);
      body.rotation.y = ang;
      body.name = 'roof';
      const pane = addMesh(bag, new THREE.PlaneGeometry(dw - 0.9, dh - 1.0), glass, false, false);
      pane.position.set(fx + nx * 0.03, baseY + dh / 2 - 0.1, fz + ny * 0.03);
      const bar = addMesh(bag, new THREE.BoxGeometry(0.12, dh - 1.0, 0.06), white, false, false);
      bar.position.set(fx + nx * 0.06, baseY + dh / 2 - 0.1, fz + ny * 0.06);
      bar.rotation.y = ang;
      bar.name = 'roof';
      pane.rotation.y = ang;
      pane.name = 'roof';
      // little gable cap: two slopes over the body
      const top = baseY + dh;
      const peak = top + 1.4;
      const hw = dw / 2 + 0.25;
      const fwd = 0.3;
      const back = depth + 0.2;
      const P = (along: number, out: number, y: number) => [fx + ux * along + nx * out, y, fz + uy * along + ny * out];
      const pos: number[] = [];
      pushQuad(pos, P(-hw, fwd, top), P(-hw, -back, top), P(0, -back, peak), P(0, fwd, peak));
      pushQuad(pos, P(hw, fwd, top), P(0, fwd, peak), P(0, -back, peak), P(hw, -back, top));
      meshFromPos(bag, pos, slate, 'roof', true);
      const gable: number[] = [];
      pushTri(gable, P(-hw + 0.25, 0.01, top), P(hw - 0.25, 0.01, top), P(0, 0.01, peak - 0.15));
      meshFromPos(bag, gable, white, 'roof');
    }
  }
}

/** A hipped porch roof on a beam, with a white ceiling underneath (2.13.20). */
function addPorchRoof(bag: Bag, pad: { minX: number; minY: number; maxX: number; maxY: number }, look: HouseLook, rich: boolean) {
  const eh = look.wallH + 0.15;
  const w = pad.maxX - pad.minX;
  const d = pad.maxY - pad.minY;
  const rise = Math.min(3, Math.min(w, d) * 0.45);
  const slate = mat(bag, '#ffffff', 0.78, { map: slateMap(), bump: rich ? slateMap() : null, bumpScale: 2.5 });
  const c = [[pad.minX, eh, pad.minY], [pad.maxX, eh, pad.minY], [pad.maxX, eh, pad.maxY], [pad.minX, eh, pad.maxY]];
  const pos: number[] = [];
  if (w >= d) {
    const ra = [pad.minX + d / 2, eh + rise, (pad.minY + pad.maxY) / 2];
    const rb = [pad.maxX - d / 2, eh + rise, (pad.minY + pad.maxY) / 2];
    pushQuad(pos, c[0], c[1], rb, ra);
    pushQuad(pos, c[3], c[2], rb, ra);
    pushTri(pos, c[0], c[3], ra);
    pushTri(pos, c[1], c[2], rb);
  } else {
    const ra = [(pad.minX + pad.maxX) / 2, eh + rise, pad.minY + w / 2];
    const rb = [(pad.minX + pad.maxX) / 2, eh + rise, pad.maxY - w / 2];
    pushQuad(pos, c[0], c[3], rb, ra);
    pushQuad(pos, c[1], c[2], rb, ra);
    pushTri(pos, c[0], c[1], ra);
    pushTri(pos, c[3], c[2], rb);
  }
  meshFromPos(bag, pos, slate, 'roof', true);
  const white = mat(bag, '#F4F0E8', 0.6);
  const beam = addMesh(bag, new THREE.BoxGeometry(w - 0.3, 0.7, d - 0.3), white, true, true);
  beam.position.set((pad.minX + pad.maxX) / 2, eh - 0.35, (pad.minY + pad.maxY) / 2);
  beam.name = 'roof';
}

/** Brick chimneys above every fireplace, with a stone cap and clay pots (2.13.20). */
function addChimneys(bag: Bag, floor: Floor, roof: RoofGeometry, rich: boolean) {
  const brick = mat(bag, '#ffffff', 0.92, { map: brickMap(), bump: rich ? brickMap() : null, bumpScale: 2.2 });
  const cap = mat(bag, '#D8CFC2', 0.85);
  const pot = mat(bag, '#B0603C', 0.7);
  const top = roof.ridgeHeight + 2.6;
  const base = roof.eavesHeight - 0.5;
  for (const f of floor.furniture ?? []) {
    if (f.catalogId !== 'fireplace') continue;
    const w = Math.max(2.2, Math.min(4, f.w * 0.6));
    const geo = new THREE.BoxGeometry(w, top - base, 1.8);
    uvFeet(geo, 2.2, 1.15);
    const stack = addMesh(bag, geo, brick, true, true);
    stack.position.set(f.x, (top + base) / 2, f.y);
    stack.rotation.y = -f.rot;
    stack.name = 'roof';
    const lid = addMesh(bag, new THREE.BoxGeometry(w + 0.5, 0.35, 2.3), cap, true, false);
    lid.position.set(f.x, top + 0.17, f.y);
    lid.rotation.y = -f.rot;
    lid.name = 'roof';
    for (const sgn of [-1, 1]) {
      const p = addMesh(bag, new THREE.CylinderGeometry(0.28, 0.34, 0.9, 10), pot, true, false);
      p.position.set(f.x + Math.cos(f.rot) * sgn * w * 0.25, top + 0.8, f.y - Math.sin(f.rot) * sgn * w * 0.25);
      p.name = 'roof';
    }
  }
}

function addFurniture(bag: Bag, item: FurnitureItem, storyH = 0) {
  if (item.catalogId === 'banister' && storyH > 7) return;
  if (item.catalogId === 'stairs' && storyH > 7) {
    addFullStair(bag, item, storyH);
    return;
  }
  const parts = furnitureParts(item, 'full');
  const g = new THREE.Group();
  g.position.set(item.x, 0, item.y);
  g.rotation.y = -item.rot;
  g.userData.furn = { catalogId: item.catalogId, w: item.w, h: item.h, color: item.color ?? null };
  const lamp = item.catalogId === 'chandelier' || item.catalogId === 'floor-lamp' || item.catalogId === 'sconce';
  if (lamp) {
    const top = Math.max(...parts.map((p) => p.z1), 2);
    bag.lights.push(new THREE.Vector3(item.x, Math.min(top, 8) - 0.3, item.y));
  }
  for (const p of parts) {
    const tall = Math.max(0.04, p.z1 - p.z0);
    const geo = p.shape === 'cyl' || p.shape === 'oval'
      ? new THREE.CylinderGeometry(Math.max(0.05, Math.min(p.lw, p.lh) / 2), Math.max(0.05, Math.min(p.lw, p.lh) / 2), tall, p.shape === 'oval' ? 12 : 8)
      : new THREE.BoxGeometry(Math.max(0.05, p.lw), tall, Math.max(0.05, p.lh));
    const rough = p.tex === 'metal' ? 0.28 : p.tex === 'glass' ? 0.08 : p.tex === 'fabric' ? 0.9 : 0.72;
    const metal = p.tex === 'metal' ? 0.45 : 0;
    const big = p.lw * p.lh > 2.5 || tall > 2.2;
    const bright = lamp && new THREE.Color(p.fill).getHSL({ h: 0, s: 0, l: 0 }).l > 0.55;
    const mesh = new THREE.Mesh(geo, mat(bag, p.fill, rough, bright ? { metal, emissive: '#FFE2A8', glow: 1.6 } : { metal }));
    bag.geos.push(geo);
    mesh.position.set(p.lx, (p.z0 + p.z1) / 2, p.ly);
    mesh.castShadow = big;
    mesh.receiveShadow = false;
    g.add(mesh);
  }
  bag.root.add(g);
  dropShadow(bag, item.x, item.y, item.w, item.h, item.rot);
}

function addFullStair(bag: Bag, item: FurnitureItem, top: number) {
  const steps = 14;
  const rise = top / steps;
  const run = Math.max(item.h, 6) / steps;
  const wood = mat(bag, '#8A6244', 0.72);
  const railMat = mat(bag, '#5C4030', 0.55);
  const g = new THREE.Group();
  g.position.set(item.x, 0, item.y);
  g.rotation.y = -item.rot;
  for (let i = 0; i < steps; i++) {
    const tread = new THREE.Mesh(new THREE.BoxGeometry(item.w * 0.92, rise * 0.92, run * 0.96), wood);
    bag.geos.push(tread.geometry);
    tread.position.set(0, rise * (i + 0.5), -item.h / 2 + run * (i + 0.5));
    tread.castShadow = i % 3 === 0;
    g.add(tread);
  }
  const climb = Math.atan2(top, Math.max(item.h, 6));
  const railLen = Math.hypot(item.h, top);
  for (const side of [-1, 1]) {
    const x = side * item.w * 0.46;
    for (const end of [0, 1]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.16, 3.1, 0.16), railMat);
      bag.geos.push(post.geometry);
      post.position.set(x, (end === 0 ? 0 : top) + 1.55, -item.h / 2 + end * item.h);
      g.add(post);
    }
    const rail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, railLen), railMat);
    bag.geos.push(rail.geometry);
    rail.rotation.x = -climb;
    rail.position.set(x, top / 2 + 2.85, 0);
    g.add(rail);
  }
  bag.root.add(g);
  dropShadow(bag, item.x, item.y, item.w, item.h, item.rot);
}

function addLandscape(bag: Bag, floor: Floor) {
  for (const item of floor.landscape ?? []) {
    const x = item.x;
    const z = item.y;
    if (item.kind === 'tree') {
      const r = Math.max(item.w, item.h) * 0.42;
      const trunk = addMesh(bag, new THREE.CylinderGeometry(0.22, 0.32, r * 1.1, 6), mat(bag, '#6B4220', 0.9), false, false);
      trunk.position.set(x, r * 0.55, z);
      const crown = addMesh(bag, new THREE.SphereGeometry(r, 10, 7), mat(bag, '#2F6B3A', 0.88), true, false);
      crown.position.set(x, r * 1.35, z);
      const crown2 = addMesh(bag, new THREE.SphereGeometry(r * 0.72, 8, 6), mat(bag, '#3D8A4E', 0.86), false, false);
      crown2.position.set(x + r * 0.25, r * 1.85, z + r * 0.1);
      dropShadow(bag, x, z, r * 1.7, r * 1.7, 0);
    } else if (item.kind === 'hedge') {
      const alongX = item.w >= item.h;
      const len = Math.max(item.w, item.h);
      const thick = Math.max(0.9, Math.min(item.w, item.h));
      const leaf = mat(bag, '#2C6840', 0.9);
      const leaf2 = mat(bag, '#3C8652', 0.86);
      const body = addMesh(bag, new THREE.BoxGeometry(alongX ? len : thick, 2.05, alongX ? thick : len), leaf, true, false);
      body.position.set(x, 1.15, z);
      const cap = addMesh(
        bag,
        new THREE.CylinderGeometry(thick * 0.5, thick * 0.5, len, 8),
        leaf2,
        false,
        false,
      );
      cap.rotation.z = alongX ? Math.PI / 2 : 0;
      cap.rotation.x = alongX ? 0 : Math.PI / 2;
      cap.position.set(x, 2.15, z);
      dropShadow(bag, x, z, len * 0.9, thick, 0);
    } else if (item.kind === 'lamp') {
      const post = addMesh(bag, new THREE.CylinderGeometry(0.08, 0.1, 6.2, 8), mat(bag, '#3A3A40', 0.4, { metal: 0.35 }));
      post.position.set(x, 3.1, z);
      const globe = addMesh(bag, new THREE.SphereGeometry(0.42, 12, 8), mat(bag, '#F3E2A8', 0.35, { emissive: '#FFE7A8', glow: 2.4 }), false);
      globe.position.set(x, 6.55, z);
    } else if (item.kind === 'path') {
      const path = addMesh(bag, new THREE.BoxGeometry(item.w, 0.08, item.h), mat(bag, '#C4B49A', 0.9), false);
      path.position.set(x, 0.05, z);
    } else {
      const bed = addMesh(bag, new THREE.BoxGeometry(item.w, 0.22, item.h), mat(bag, '#3E6B3A', 0.92), false);
      bed.position.set(x, 0.12, z);
      const bloom = mat(bag, '#C45A6A', 0.7);
      const cream = mat(bag, '#F2E2A0', 0.65);
      const spots: [number, number, THREE.Material][] = [[-0.28, -0.15, bloom], [0.26, 0.12, cream], [0.02, 0.22, bloom]];
      for (const [ox, oz, col] of spots) {
        const dot = addMesh(bag, new THREE.SphereGeometry(Math.min(item.w, item.h) * 0.14, 7, 5), col, false);
        dot.position.set(x + ox * item.w, 0.36, z + oz * item.h);
      }
    }
  }
}

function addUpperDeck(bag: Bag, floor: Floor, y: number, finish: FloorFinishId) {
  const body = upperBody(floor);
  if (!body) return;
  const pad = 0.3; // stop just inside the wall faces
  const minX = body.minX + pad;
  const maxX = body.maxX - pad;
  const minY = body.minY + pad;
  const maxY = body.maxY - pad;
  if (maxX - minX < 4 || maxY - minY < 4) return;
  const shape = shapeOnGround([
    { x: minX, y: minY },
    { x: maxX, y: minY },
    { x: maxX, y: maxY },
    { x: minX, y: maxY },
  ]);
  const stair = (floor.furniture ?? []).find((f) => f.catalogId === 'stairs');
  if (stair) {
    const hw = stair.w / 2 + 0.4;
    const hh = stair.h / 2 + 0.4;
    const c = Math.cos(stair.rot);
    const s = Math.sin(stair.rot);
    const corners = [[-hw, -hh], [hw, -hh], [hw, hh], [-hw, hh]].map(([lx, ly]) => ({
      x: stair.x + lx * c - ly * s,
      y: stair.y + lx * s + ly * c,
    })).reverse();
    const hole = new THREE.Path();
    hole.moveTo(corners[0].x, -corners[0].y);
    for (let i = 1; i < corners.length; i++) hole.lineTo(corners[i].x, -corners[i].y);
    hole.closePath();
    shape.holes.push(hole);
  }
  const geo = new THREE.ShapeGeometry(shape);
  geo.rotateX(-Math.PI / 2);
  uvFeet(geo, 2.6, 2.6, true);
  const material = new THREE.MeshStandardMaterial({ color: '#ffffff', map: floorTex(finish), roughness: 0.6, side: THREE.DoubleSide });
  bag.mats.push(material);
  const mesh = addMesh(bag, geo, material, false, true);
  mesh.position.y = y;
  // looking straight down, the upstairs floor lifts away with the roof so you see into the rooms (2.13.22)
  mesh.name = 'roof';
  // seen from below the upstairs floor is a white ceiling (shown when walking) (2.13.22)
  material.side = THREE.FrontSide;
  const ceil = addMesh(bag, geo, mat(bag, '#F7F3EC', 0.92, { side2: true, emissive: '#3A3226', glow: 0.6 }), false, false);
  ceil.position.y = y - 0.08;
  ceil.name = 'ceiling';
}

export function buildHouse(floor: Floor, look: HouseLook): BuiltHouse {
  const bag: Bag = { root: new THREE.Group(), geos: [], mats: [], shared: new Map(), lights: [] };
  let gx = 0;
  let gz = 0;
  if (floor.nodes.length) {
    for (const n of floor.nodes) { gx += n.x; gz += n.y; }
    gx /= floor.nodes.length;
    gz /= floor.nodes.length;
  }
  const pad = new THREE.CircleGeometry(240, 48);
  const pos = pad.getAttribute('position');
  const colors = new Float32Array(pos.count * 3);
  const grass = new THREE.Color(look.ground);
  const skyEdge = new THREE.Color('#e4eaf0');
  for (let i = 0; i < pos.count; i++) {
    const d = Math.min(1, Math.hypot(pos.getX(i), pos.getY(i)) / 240);
    const t = d < 0.62 ? 0 : (d - 0.62) / 0.38;
    const c = grass.clone().lerp(skyEdge, t * t);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  pad.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const grassTex = grassMap();
  if (grassTex) {
    grassTex.repeat.set(90, 90);
    grassTex.anisotropy = 1;
  }
  const groundMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.96, vertexColors: true, map: grassTex });
  bag.mats.push(groundMat);
  const ground = addMesh(bag, pad, groundMat, false, true);
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(gx, -0.02, gz);

  const nodes = new Map(floor.nodes.map((n) => [n.id, n]));
  const houseCenter = (() => {
    if (!floor.nodes.length) return { x: 0, y: 0 };
    let sx = 0;
    let sy = 0;
    for (const n of floor.nodes) { sx += n.x; sy += n.y; }
    return { x: sx / floor.nodes.length, y: sy / floor.nodes.length };
  })();
  for (const wall of floor.walls) addWall(bag, floor, wall, look, nodes, houseCenter);

  let floors: { poly: { x: number; y: number }[]; finish: FloorFinishId }[] = [];
  try {
    floors = listInteriorFloors(floor.nodes, floor.walls, floor.rooms, look.houseFinish);
  } catch {
    floors = [];
  }
  const upper = houseHasUpper(floor);
  const porch = (floor.rooms ?? []).find((r) => r.kind === 'outdoor');
  for (const face of floors) {
    floorMesh(bag, face.poly, 0.03, mat(bag, '#ffffff', 0.55, { map: floorTex(face.finish), sheen: look.rich ? 0.35 : 0 }));
    if (!upper) {
      floorMesh(bag, face.poly, look.wallH - 0.2, mat(bag, '#F7F3EC', 0.92, { emissive: '#3A3226', glow: 0.6 }), 'ceiling');
      continue;
    }
    const cx = face.poly.reduce((s, p) => s + p.x, 0) / face.poly.length;
    const cy = face.poly.reduce((s, p) => s + p.y, 0) / face.poly.length;
    const onPorch = !!porch && Math.hypot(cx - porch.x, cy - porch.y) < 14 && cy < porch.y + 6;
    if (onPorch || upper) continue;
    floorMesh(bag, face.poly, look.wallH - 0.2, mat(bag, '#F7F3EC', 0.92, { emissive: '#3A3226', glow: 0.6 }), 'ceiling');
  }
  if (upper) addUpperDeck(bag, floor, look.wallH, look.houseFinish);

  const shown = viewRoof(floor, look.wallH);
  if (shown) addRoof(bag, shown, !!look.rich);
  const porchPad = porchBounds(floor);
  if (porchPad) addPorchRoof(bag, porchPad, look, !!look.rich);
  if (shown) addChimneys(bag, floor, shown, !!look.rich);
  if (look.showFurn) {
    for (const item of floor.furniture) addFurniture(bag, item, upper ? look.wallH : 0);
  }
  addLandscape(bag, floor);
  flushBatches(bag);

  return {
    root: bag.root,
    lights: bag.lights,
    dispose: () => {
      bag.geos.forEach((g) => g.dispose());
      bag.mats.forEach((m) => m.dispose());
    },
  };
}
