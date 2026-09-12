import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DOG_HOUSE, judgeDogHouse, ribbonFor, ribbonLabel } from './contest.ts';
import type { Floor, Node, Wall } from '../types.ts';

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

function emptyFloor(): Floor {
  return { ...boxFloor(4, 4), nodes: [], walls: [] };
}

function byId(report: ReturnType<typeof judgeDogHouse>) {
  return Object.fromEntries(report.checks.map((c) => [c.id, c]));
}

describe('dog house contest judge', () => {
  it('fails an empty plan and withholds the ribbon', () => {
    const r = judgeDogHouse(emptyFloor(), { roofStyleId: 'gable' });
    const c = byId(r);
    assert.equal(c.shelter.status, 'fail');
    assert.equal(c.door.status, 'fail');
    assert.equal(r.ribbon, 'keep');
    assert.ok(r.score < 40);
  });

  it('fails a people-sized bedroom as too big to heat', () => {
    const f = boxFloor(12, 10);
    f.openings.push({
      id: 'd1', wallId: 'w1', t: 0.5, width: 3, type: 'door', symbolKind: 'swingDoor',
    });
    const r = judgeDogHouse(f, { roofStyleId: 'gable' });
    const c = byId(r);
    assert.equal(c.scale.status, 'fail');
    assert.equal(c.door.status, 'fail');
    assert.equal(c.offset.status, 'fail');
    assert.ok(c.scale.detail.includes('120'));
  });

  it('passes a textbook 4×4 den with an 18" offset door', () => {
    const f = boxFloor(4, 4);
    f.openings.push({
      id: 'd1', wallId: 'w1', t: 0.22, width: 1.5, type: 'door', symbolKind: 'swingDoor',
    });
    f.dimensions.push({ id: 'dim1', ax: 0, ay: 0, bx: 4, by: 0 });
    f.landscape.push({
      id: 't1', kind: 'tree', x: -4, y: 2, w: 4, h: 4, rot: 0, label: 'Tree',
    });
    const r = judgeDogHouse(f, { roofStyleId: 'gable' });
    const c = byId(r);
    assert.equal(c.shelter.status, 'pass');
    assert.equal(c.scale.status, 'pass');
    assert.equal(c.door.status, 'pass');
    assert.equal(c.offset.status, 'pass');
    assert.equal(c.turn.status, 'pass');
    assert.equal(c.roof.status, 'pass');
    assert.equal(c.program.status, 'pass');
    assert.equal(c.dims.status, 'pass');
    assert.equal(c.shade.status, 'pass');
    assert.equal(r.fail, 0);
    assert.equal(r.ribbon, 'best');
    assert.equal(ribbonLabel(r.ribbon), 'Best in show');
  });

  it('warns a flat roof and people furniture, and scores half on warns', () => {
    const f = boxFloor(4, 4);
    f.openings.push({
      id: 'd1', wallId: 'w1', t: 0.2, width: 1.5, type: 'door', symbolKind: 'swingDoor',
    });
    f.furniture.push({
      id: 'f1', catalogId: 'sofa', x: 2, y: 2, w: 7, h: 3, rot: 0, zIndex: 1, label: 'Sofa',
    });
    const r = judgeDogHouse(f, { roofStyleId: 'flat' });
    const c = byId(r);
    assert.equal(c.roof.status, 'fail');
    assert.equal(c.program.status, 'fail');
    assert.equal(c.dims.status, 'warn');
    assert.equal(c.shade.status, 'warn');
    // Core den is textbook (70). Roof + sofa fail (0). Missing labels/shade warn at half (3+3).
    assert.equal(r.score, 76);
    assert.equal(r.ribbon, 'blue');
    assert.notEqual(r.ribbon, 'best');
    assert.ok(r.fail >= 2);
  });

  it('maps score bands onto ribbons', () => {
    assert.equal(ribbonFor(100, 100, 0), 'best');
    assert.equal(ribbonFor(80, 100, 1), 'blue');
    assert.equal(ribbonFor(65, 100, 2), 'red');
    assert.equal(ribbonFor(45, 100, 3), 'honor');
    assert.equal(ribbonFor(10, 100, 5), 'keep');
  });

  it('treats 12" as a dog door and 3\' as a people door', () => {
    assert.ok(1 >= DOG_HOUSE.doorNiceMinFt && 1 <= DOG_HOUSE.doorNiceMaxFt);
    assert.ok(3 > DOG_HOUSE.doorMaxFt);
  });
});
