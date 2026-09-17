import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildMass, camBasis, defaultCam, project, projectFaces, sunDir, walkForward } from './mass3d.ts';
import type { Floor, Node, Opening, Wall } from '../types';

function boxFloor(w: number, h: number): Floor {
  const nodes: Node[] = [
    { id: 'a', x: 0, y: 0 },
    { id: 'b', x: w, y: 0 },
    { id: 'c', x: w, y: h },
    { id: 'd', x: 0, y: h },
  ];
  const walls: Wall[] = [
    { id: 'w1', a: 'a', b: 'b', kind: 'exterior', thickness: 0.5 },
    { id: 'w2', a: 'b', b: 'c', kind: 'exterior', thickness: 0.5 },
    { id: 'w3', a: 'c', b: 'd', kind: 'exterior', thickness: 0.5 },
    { id: 'w4', a: 'd', b: 'a', kind: 'exterior', thickness: 0.5 },
  ];
  return {
    id: 'fl',
    name: 'F1',
    elevation: 0,
    nodes,
    walls,
    openings: [],
    furniture: [],
    rooms: [],
    dimensions: [],
    notes: [],
    landscape: [],
    sketches: [],
    roof: null,
    layers: {
      structure: true, openings: true, furniture: true, rooms: true,
      dims: true, landscape: false, sketch: true, roof: true,
    },
  };
}

const opts = {
  sky: 'day' as const,
  site: 'grass' as const,
  tint: 'sand' as const,
  showFurn: true,
  materials: false,
  lighting: false,
  blocky: false,
};

describe('mass3d', () => {
  it('projects a point to finite screen coords', () => {
    const floor = boxFloor(12, 10);
    const cam = defaultCam(floor, false);
    const p = project({ x: 6, y: 5, z: 4 }, cam, 800, 400);
    assert.equal(Number.isFinite(p.x), true);
    assert.equal(Number.isFinite(p.y), true);
    assert.ok(p.depth > 0);
  });

  it('builds wall faces for a closed box', () => {
    const faces = buildMass(boxFloor(12, 10), opts);
    const walls = faces.filter((f) => f.kind === 'wall');
    assert.ok(walls.length >= 8, `walls ${walls.length}`);
    assert.ok(faces.some((f) => f.kind === 'yard'));
    assert.ok(faces.some((f) => f.kind === 'slab'));
  });

  it('cuts glass for a window', () => {
    const floor = boxFloor(12, 10);
    floor.openings = [{
      id: 'n1', wallId: 'w1', t: 0.5, width: 3, type: 'window', symbolKind: 'windowFixed',
    }] as Opening[];
    const faces = buildMass(floor, opts);
    assert.ok(faces.some((f) => f.kind === 'glass'));
  });

  it('walk stays at eye height', () => {
    const cam = defaultCam(boxFloor(12, 10), true);
    assert.equal(cam.walk, true);
    const next = walkForward(cam, 3);
    assert.ok(Math.abs(next.target.z - 5.5) < 0.01);
    const { forward } = camBasis(cam);
    assert.ok(Math.abs(forward.z) < 0.4);
  });

  it('lighting adds a house shadow', () => {
    const faces = buildMass(boxFloor(12, 10), { ...opts, lighting: true });
    assert.ok(faces.some((f) => f.kind === 'shadow'));
  });

  it('simple lod skips the house shadow', () => {
    const faces = buildMass(boxFloor(12, 10), { ...opts, lighting: true, lod: 'simple' as const });
    assert.equal(faces.some((f) => f.kind === 'shadow'), false);
  });

  it('day sun points up-ish', () => {
    const s = sunDir('day');
    assert.ok(s.z > 0.4);
  });

  it('furniture uses modeled parts, not one box', () => {
    const floor = boxFloor(12, 10);
    floor.furniture = [{
      id: 'f1', catalogId: 'toilet', x: 4, y: 4, w: 1.5, h: 2.5, rot: 0, zIndex: 1, label: 'Toilet',
    }];
    const faces = buildMass(floor, opts);
    const furn = faces.filter((f) => f.kind === 'furn');
    assert.ok(furn.length >= 8, `furn faces ${furn.length}`);
  });

  it('simple lod drops extra furniture faces', () => {
    const floor = boxFloor(20, 16);
    floor.furniture = Array.from({ length: 8 }, (_, i) => ({
      id: `f${i}`, catalogId: 'sofa', x: 4 + i * 2, y: 6, w: 7, h: 3, rot: 0, zIndex: 1, label: 'Sofa',
    }));
    const full = buildMass(floor, { ...opts, lod: 'full' as const }).filter((f) => f.kind === 'furn');
    const simple = buildMass(floor, { ...opts, lod: 'simple' as const }).filter((f) => f.kind === 'furn');
    assert.ok(simple.length < full.length, `simple ${simple.length} vs full ${full.length}`);
    assert.ok(simple.length >= 8);
  });

  it('house floor uses the house finish pattern', () => {
    const faces = buildMass(boxFloor(12, 10), { ...opts, floorId: 'walnut' });
    const fl = faces.filter((f) => f.kind === 'floor');
    assert.ok(fl.length >= 1);
    assert.ok(fl.some((f) => f.pattern === 'walnut'));
  });

  it('room floor carries a pattern id', () => {
    const floor = boxFloor(12, 10);
    floor.rooms = [{ id: 'r1', kind: 'kitchen', name: 'Kitchen', x: 6, y: 5, floorFinishId: 'tile' }];
    const faces = buildMass(floor, { ...opts, floorId: 'oak' });
    const fl = faces.filter((f) => f.kind === 'floor' && f.pattern === 'tile');
    assert.ok(fl.length >= 1);
  });

  it('L-shaped house floor stays inside the rooms, not the bounding box', () => {
    const nodes: Node[] = [
      { id: 'a', x: 0, y: 0 },
      { id: 'b', x: 20, y: 0 },
      { id: 'c', x: 20, y: 8 },
      { id: 'd', x: 8, y: 8 },
      { id: 'e', x: 8, y: 16 },
      { id: 'f', x: 0, y: 16 },
    ];
    const walls: Wall[] = [
      { id: 'w1', a: 'a', b: 'b', kind: 'exterior', thickness: 0.5 },
      { id: 'w2', a: 'b', b: 'c', kind: 'exterior', thickness: 0.5 },
      { id: 'w3', a: 'c', b: 'd', kind: 'exterior', thickness: 0.5 },
      { id: 'w4', a: 'd', b: 'e', kind: 'exterior', thickness: 0.5 },
      { id: 'w5', a: 'e', b: 'f', kind: 'exterior', thickness: 0.5 },
      { id: 'w6', a: 'f', b: 'a', kind: 'exterior', thickness: 0.5 },
    ];
    const floor = boxFloor(20, 16);
    floor.nodes = nodes;
    floor.walls = walls;
    const faces = buildMass(floor, { ...opts, floorId: 'oak' });
    const fl = faces.filter((f) => f.kind === 'floor');
    assert.ok(fl.length >= 1);
    const xs = fl.flatMap((f) => f.pts.map((p) => p.x));
    const ys = fl.flatMap((f) => f.pts.map((p) => p.y));
    assert.ok(Math.max(...xs) < 19.9, `floor reaches x=${Math.max(...xs)}`);
    assert.ok(Math.max(...ys) < 15.9, `floor reaches y=${Math.max(...ys)}`);
    // missing L corner is not covered
    const coversHole = fl.some((f) => f.pts.every((p) => p.x >= 8 && p.y >= 8) && f.pts.length >= 4 && f.pts.some((p) => p.x > 12 && p.y > 12));
    assert.equal(coversHole, false);
    const holePtInside = fl.some((f) => {
      const poly = f.pts;
      const p = { x: 14, y: 12 };
      let inside = false;
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const a = poly[i];
        const b = poly[j];
        const hit = (a.y > p.y) !== (b.y > p.y)
          && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y || 1e-12) + a.x;
        if (hit) inside = !inside;
      }
      return inside;
    });
    assert.equal(holePtInside, false, 'bounding-box hole should not have a floor');
  });
});
