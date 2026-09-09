import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ADA, circleFitsInPoly, runAccessCheck, tightestHall } from './access';
import type { Floor, Node, Wall } from '../types';

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
    roof: null,
    layers: {
      structure: true, openings: true, furniture: true, rooms: true,
      dims: true, landscape: false, roof: true,
    },
  };
}

describe('access checker', () => {
  it('fails a plan with no door and skips bath/kitchen', () => {
    const r = runAccessCheck(boxFloor(12, 10));
    const by = Object.fromEntries(r.checks.map((c) => [c.id, c.status]));
    assert.equal(by.entry, 'fail');
    assert.equal(by['door-width'], 'skip');
    assert.equal(by.turn, 'skip');
    assert.equal(by.kitchen, 'skip');
    assert.ok(r.fail >= 1);
  });

  it('passes a 3-foot door', () => {
    const f = boxFloor(12, 10);
    f.openings.push({
      id: 'd1', wallId: 'w1', t: 0.5, width: 3, type: 'door', symbolKind: 'swingDoor',
    });
    const r = runAccessCheck(f);
    assert.equal(r.checks.find((c) => c.id === 'door-width')?.status, 'pass');
    assert.equal(r.checks.find((c) => c.id === 'entry')?.status, 'pass');
    assert.equal(r.checks.find((c) => c.id === 'swing')?.status, 'pass');
  });

  it('fails a door under 32 inches', () => {
    const f = boxFloor(12, 10);
    f.openings.push({
      id: 'd1', wallId: 'w1', t: 0.5, width: 2.2, type: 'door', symbolKind: 'swingDoor',
    });
    const r = runAccessCheck(f);
    assert.equal(r.checks.find((c) => c.id === 'door-width')?.status, 'fail');
  });

  it('flags furniture in the door swing', () => {
    const f = boxFloor(12, 10);
    f.openings.push({
      id: 'd1', wallId: 'w1', t: 0.5, width: 3, type: 'door', symbolKind: 'swingDoor', swing: 'left',
    });
    // hinge near mid of south wall, swing into +y (interior of this box)
    f.furniture.push({
      id: 's1', catalogId: 'sofa', x: 6, y: 1.4, w: 7, h: 3, rot: 0, zIndex: 1, label: 'Sofa',
    });
    const r = runAccessCheck(f);
    assert.equal(r.checks.find((c) => c.id === 'swing')?.status, 'fail');
  });

  it('flags a tight hall between parallel walls', () => {
    const f = boxFloor(20, 12);
    f.nodes.push({ id: 'e', x: 8, y: 0 }, { id: 'f', x: 8, y: 12 });
    f.nodes.push({ id: 'g', x: 10.4, y: 0 }, { id: 'h', x: 10.4, y: 12 });
    f.walls.push(
      { id: 'i1', a: 'e', b: 'f', kind: 'interior', thickness: 0.35 },
      { id: 'i2', a: 'g', b: 'h', kind: 'interior', thickness: 0.35 },
    );
    const hall = tightestHall(f.walls, f.nodes);
    assert.ok(hall);
    assert.ok(hall!.dist < ADA.routeFt);
    const r = runAccessCheck(f);
    assert.equal(r.checks.find((c) => c.id === 'hall')?.status, 'fail');
  });

  it('passes a bath that fits a 5-foot circle', () => {
    const f = boxFloor(12, 10);
    f.rooms.push({ id: 'b1', kind: 'bath', name: 'Bath', x: 6, y: 5 });
    const r = runAccessCheck(f);
    assert.equal(r.checks.find((c) => c.id === 'turn')?.status, 'pass');
  });

  it('fits a circle inside a square and not outside', () => {
    const poly = [
      { x: 0, y: 0 }, { x: 8, y: 0 }, { x: 8, y: 8 }, { x: 0, y: 8 },
    ];
    assert.equal(circleFitsInPoly(poly, 3.5), true);
    assert.equal(circleFitsInPoly(poly, 5), false);
  });
});
