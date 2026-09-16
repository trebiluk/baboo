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

  it('day sun points up-ish', () => {
    const s = sunDir('day');
    assert.ok(s.z > 0.4);
  });

  it('projectFaces returns painter-sorted paths', () => {
    const floor = boxFloor(12, 10);
    const cam = defaultCam(floor, false);
    const painted = projectFaces(buildMass(floor, opts), cam, 800, 400, opts);
    assert.ok(painted.length > 4);
    assert.ok(painted[0].kind === 'yard' || painted[0].d.startsWith('M'));
  });
});
