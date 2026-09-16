import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { kitchenTriangle, runArchitectCheck, TRIANGLE } from './architect.ts';
import type { Floor, FurnitureItem, Node, Opening, Room, Wall } from '../types';

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

describe('architect check', () => {
  it('empty plan fails envelope and entry', () => {
    const floor = boxFloor(12, 10);
    floor.walls = [];
    floor.nodes = [];
    const report = runArchitectCheck(floor);
    const env = report.checks.find((c) => c.id === 'envelope')!;
    const entry = report.checks.find((c) => c.id === 'entry')!;
    assert.equal(env.status, 'fail');
    assert.equal(entry.status, 'fail');
  });

  it('closed 12x10 with door and window on different walls passes envelope, entry, daylight', () => {
    const floor = boxFloor(12, 10);
    floor.openings = [
      { id: 'd1', wallId: 'w1', t: 0.5, width: 3, type: 'door', symbolKind: 'swingDoor', swing: 'left' },
      { id: 'n1', wallId: 'w3', t: 0.5, width: 3, type: 'window', symbolKind: 'windowFixed' },
    ] as Opening[];
    const report = runArchitectCheck(floor);
    assert.equal(report.checks.find((c) => c.id === 'envelope')?.status, 'pass');
    assert.equal(report.checks.find((c) => c.id === 'entry')?.status, 'pass');
    assert.equal(report.checks.find((c) => c.id === 'daylight')?.status, 'pass');
  });

  it('tiny bedroom fails room scale', () => {
    const floor = boxFloor(6, 6);
    floor.rooms = [{ id: 'r1', kind: 'bedroom', name: 'Bedroom', x: 3, y: 3 }] as Room[];
    const report = runArchitectCheck(floor);
    assert.equal(report.checks.find((c) => c.id === 'scale')?.status, 'fail');
  });

  it('kitchen triangle sums the three walks', () => {
    const furniture: FurnitureItem[] = [
      { id: 's', catalogId: 'sink', x: 0, y: 0, w: 3, h: 2, rot: 0, zIndex: 1, label: 'Sink' },
      { id: 't', catalogId: 'stove', x: 6, y: 0, w: 2.5, h: 2.5, rot: 0, zIndex: 1, label: 'Stove' },
      { id: 'f', catalogId: 'fridge', x: 0, y: 6, w: 3, h: 2.5, rot: 0, zIndex: 1, label: 'Fridge' },
    ];
    const tri = kitchenTriangle(furniture)!;
    assert.ok(Math.abs(tri.legs[0] - 6) < 0.01);
    assert.ok(tri.sum > TRIANGLE.sumMin);
    assert.ok(tri.sum < TRIANGLE.sumMax);
  });

  it('dog house skips daylight, rooms, and kitchen', () => {
    const floor = boxFloor(4, 3);
    floor.openings = [
      { id: 'd1', wallId: 'w1', t: 0.3, width: 1, type: 'door', symbolKind: 'swingDoor', swing: 'left' },
    ] as Opening[];
    const report = runArchitectCheck(floor, 'ft', 'dog-house');
    assert.equal(report.checks.find((c) => c.id === 'daylight')?.status, 'skip');
    assert.equal(report.checks.find((c) => c.id === 'named')?.status, 'skip');
    assert.equal(report.checks.find((c) => c.id === 'triangle')?.status, 'skip');
    assert.equal(report.checks.find((c) => c.id === 'envelope')?.status, 'pass');
  });
});
