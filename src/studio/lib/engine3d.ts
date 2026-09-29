/** WebGL house. Plan feet: world X = plan x, world Y = up, world Z = plan y. */
import * as THREE from 'three';
import type { Floor, FurnitureItem, Opening, RoofGeometry, Wall } from '../types';
import type { FloorFinishId } from '../data/flooring';
import { floorFinish } from '../data/flooring';
import { listInteriorFloors } from './rooms';
import { furnitureParts } from './furnShape';

export type HouseLook = {
  wallH: number;
  tint: string;
  ground: string;
  showFurn: boolean;
  ceiling: boolean;
  houseFinish: FloorFinishId;
};

export type BuiltHouse = {
  root: THREE.Group;
  dispose: () => void;
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
};

function mat(
  bag: Bag,
  hex: string,
  rough = 0.82,
  opts?: { metal?: number; opacity?: number; emissive?: string; map?: THREE.Texture | null },
): THREE.Material {
  const key = `${hex}|${rough}|${opts?.metal ?? 0}|${opts?.opacity ?? 1}|${opts?.emissive ?? ''}|${opts?.map?.uuid ?? ''}`;
  const hit = bag.shared.get(key);
  if (hit) return hit;
  const m = new THREE.MeshStandardMaterial({
    color: hex,
    roughness: rough,
    metalness: opts?.metal ?? 0,
    map: opts?.map ?? null,
  });
  if (opts?.opacity != null && opts.opacity < 1) {
    m.transparent = true;
    m.opacity = opts.opacity;
    m.depthWrite = opts.opacity > 0.7;
  }
  if (opts?.emissive) {
    m.emissive = new THREE.Color(opts.emissive);
    m.emissiveIntensity = 0.85;
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
  bag.root.add(mesh);
  return mesh;
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

function meshFromPos(bag: Bag, pos: number[], material: THREE.Material, name?: string): void {
  if (pos.length < 9) return;
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.computeVertexNormals();
  const nrm = geo.getAttribute('normal');
  let ny = 0;
  for (let i = 0; i < nrm.count; i++) ny += nrm.getY(i);
  if (ny < 0) {
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

function addWall(bag: Bag, floor: Floor, wall: Wall, look: HouseLook, nodes: Map<string, { x: number; y: number }>) {
  const a = nodes.get(wall.a);
  const b = nodes.get(wall.b);
  if (!a || !b) return;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  if (len < 0.08) return;
  const thick = Math.max(0.35, wall.thickness || 0.45);
  const h = wall.kind === 'interior' ? Math.max(7, look.wallH - 0.35) : look.wallH;
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
    const y0 = o.type === 'window' ? look.wallH * 0.28 : 0.02;
    const y1 = o.type === 'window' ? look.wallH * 0.78 : look.wallH * 0.8;
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
  const geo = new THREE.ExtrudeGeometry(shape, { depth: thick, bevelEnabled: false });
  geo.translate(0, 0, -thick / 2);
  const brick = wall.drawStyle === 'brick' && wall.kind === 'exterior';
  if (brick) uvFeet(geo, 2.2, 1.15);
  const color = brick ? '#ffffff' : wall.kind === 'exterior' ? look.tint : '#F4EFE6';
  const mesh = addMesh(bag, geo, mat(bag, color, brick ? 0.92 : 0.8, brick ? { map: brickMap() } : undefined), true, true);
  mesh.position.set(a.x, 0, a.y);
  mesh.rotation.y = ang;
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
      mat(bag, '#C5DFF0', 0.06, { opacity: 0.45, metal: 0.08 }),
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

function addRoof(bag: Bag, roof: RoofGeometry) {
  const o = roof.outline;
  if (o.length < 3) return;
  const eh = roof.eavesHeight;
  const rh = roof.ridgeHeight;
  const slate = roof.styleId === 'grass'
    ? mat(bag, '#3E6B3A', 0.8)
    : mat(bag, '#ffffff', 0.78, { map: slateMap() });
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
    meshFromPos(bag, pos, slate, 'roof');
    floorMesh(bag, inner, capY + 0.05, slate, 'roof');
    const dormer = (t: number) => {
      const mix = (p: { x: number; y: number }, q: { x: number; y: number }) => ({
        x: p.x + (q.x - p.x) * t,
        y: p.y + (q.y - p.y) * t,
      });
      const eave = mix(o[0], o[1]);
      const top = mix(inner[0], inner[1]);
      const x = eave.x * 0.4 + top.x * 0.6;
      const z = eave.y * 0.4 + top.y * 0.6 - 0.4;
      const y = eh * 0.4 + capY * 0.6;
      const win = addMesh(bag, new THREE.BoxGeometry(2.2, 2.4, 0.35), mat(bag, '#D5E8F4', 0.15, { opacity: 0.85 }), false);
      win.position.set(x, y + 1.2, z);
      win.name = 'roof';
      const frame = addMesh(bag, new THREE.BoxGeometry(2.7, 3.2, 0.2), mat(bag, '#E7D7C1', 0.7), true);
      frame.position.set(x, y + 1.3, z + 0.15);
      frame.name = 'roof';
    };
    dormer(0.34);
    dormer(0.66);
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
    meshFromPos(bag, pos, slate, 'roof');
    return;
  }
  floorMesh(bag, o, eh + 0.4, slate, 'roof');
}

function addFurniture(bag: Bag, item: FurnitureItem) {
  const parts = furnitureParts(item, 'full');
  const g = new THREE.Group();
  g.position.set(item.x, 0, item.y);
  g.rotation.y = -item.rot;
  for (const p of parts) {
    const tall = Math.max(0.04, p.z1 - p.z0);
    const geo = p.shape === 'cyl' || p.shape === 'oval'
      ? new THREE.CylinderGeometry(Math.max(0.05, Math.min(p.lw, p.lh) / 2), Math.max(0.05, Math.min(p.lw, p.lh) / 2), tall, p.shape === 'oval' ? 12 : 8)
      : new THREE.BoxGeometry(Math.max(0.05, p.lw), tall, Math.max(0.05, p.lh));
    const rough = p.tex === 'metal' ? 0.28 : p.tex === 'glass' ? 0.08 : p.tex === 'fabric' ? 0.9 : 0.72;
    const metal = p.tex === 'metal' ? 0.45 : 0;
    const big = p.lw * p.lh > 2.5 || tall > 2.2;
    const mesh = new THREE.Mesh(geo, mat(bag, p.fill, rough, { metal }));
    bag.geos.push(geo);
    mesh.position.set(p.lx, (p.z0 + p.z1) / 2, p.ly);
    mesh.castShadow = big;
    mesh.receiveShadow = false;
    g.add(mesh);
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
      const globe = addMesh(bag, new THREE.SphereGeometry(0.42, 12, 8), mat(bag, '#F3E2A8', 0.35, { emissive: '#F3E2A8' }), false);
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

export function buildHouse(floor: Floor, look: HouseLook): BuiltHouse {
  const bag: Bag = { root: new THREE.Group(), geos: [], mats: [], shared: new Map() };
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
  const groundMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.96, vertexColors: true });
  bag.mats.push(groundMat);
  const ground = addMesh(bag, pad, groundMat, false, true);
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(gx, -0.02, gz);

  const nodes = new Map(floor.nodes.map((n) => [n.id, n]));
  for (const wall of floor.walls) addWall(bag, floor, wall, look, nodes);

  let floors: { poly: { x: number; y: number }[]; finish: FloorFinishId }[] = [];
  try {
    floors = listInteriorFloors(floor.nodes, floor.walls, floor.rooms, look.houseFinish);
  } catch {
    floors = [];
  }
  for (const face of floors) {
    floorMesh(bag, face.poly, 0.03, mat(bag, floorFinish(face.finish).color, 0.72));
  }
  for (const face of floors) {
    floorMesh(bag, face.poly, look.wallH - 0.2, mat(bag, '#F7F3EC', 0.92), 'ceiling');
  }

  if (floor.roof) addRoof(bag, floor.roof);
  if (look.showFurn) {
    for (const item of floor.furniture) addFurniture(bag, item);
  }
  addLandscape(bag, floor);

  return {
    root: bag.root,
    dispose: () => {
      bag.geos.forEach((g) => g.dispose());
      bag.mats.forEach((m) => m.dispose());
    },
  };
}
