import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ADA, aisleGap, circleFitsInPoly, runAccessCheck, tightestHall } from './access';
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
    sketches: [],
    roof: null,
    layers: {
      structure: true, openings: true, furniture: true, rooms: true,
      dims: true, landscape: false, sketch: true, roof: true,
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

describe('access checker in other languages (2.13.50)', () => {
  it('speaks the student\'s language and names rooms and furniture in it', () => {
    const f = boxFloor(12, 10);
    f.rooms = [{ id: 'r1', kind: 'bath', name: 'Bath', x: 6, y: 5 }];
    f.openings = [{ id: 'o1', wallId: 'w1', t: 0.5, width: 3, type: 'door', symbolKind: 'swingDoor' }];
    const en = runAccessCheck(f, 'ft', 'en');
    for (const loc of ['es', 'uk', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      const r = runAccessCheck(f, 'ft', loc);
      assert.deepEqual(r.checks.map((c) => c.status), en.checks.map((c) => c.status), loc);
      for (let i = 0; i < r.checks.length; i++) {
        assert.notEqual(r.checks[i].title, en.checks[i].title, `${loc} title ${r.checks[i].id}`);
        assert.notEqual(r.checks[i].detail, en.checks[i].detail, `${loc} detail ${r.checks[i].id}`);
        assert.ok(!/\{\w+\}/.test(r.checks[i].detail), `${loc} left a {slot} in ${r.checks[i].id}`);
      }
    }
    const es = runAccessCheck(f, 'ft', 'es');
    assert.match(es.checks.find((c) => c.id === 'turn')!.detail, /Baño/);
    assert.match(en.checks.find((c) => c.id === 'turn')!.detail, /^Bath can fit/);
  });
});

describe('kitchen aisle (2.13.50)', () => {
  const piece = (id: string, catalogId: string, x: number, y: number, w: number, h: number, rot = 0) =>
    ({ id, catalogId, x, y, w, h, rot, zIndex: 1, label: '' });
  it('does not call pieces side by side on one counter an aisle', () => {
    const stove = piece('s', 'stove', 38, 36.5, 2.5, 2.2);
    const sink = piece('k', 'sink', 42.5, 37.2, 3, 1.6);
    assert.equal(aisleGap(stove, sink), null);
    // Ranch: fridge, stove and sink touching in one run.
    assert.equal(aisleGap(piece('s', 'stove', 24, 1.8, 2.5, 2.5), piece('k', 'sink', 26.5, 1.8, 2.5, 2)), null);
    const f = boxFloor(20, 20);
    f.furniture = [stove, sink];
    assert.equal(runAccessCheck(f).checks.find((c) => c.id === 'kitchen')?.status, 'pass');
  });
  it('measures pieces facing each other across the floor', () => {
    const fridge = piece('f', 'fridge', 40, 29, 3, 2.2);
    const stove = piece('s', 'stove', 38, 36.5, 2.5, 2.2);
    assert.ok(Math.abs((aisleGap(fridge, stove) ?? 0) - 5.3) < 0.01);
    const f = boxFloor(20, 20);
    f.furniture = [piece('a', 'stove', 5, 2, 2.5, 2.5), piece('b', 'sink', 5, 5, 2.5, 2)];
    const k = runAccessCheck(f).checks.find((c) => c.id === 'kitchen')!;
    assert.equal(k.status, 'warn'); // 2.13.59: accessibility guidance, not NY one-family code
    assert.match(k.detail, /Stove and Kitchen Sink/);
  });
  it('turns a rotated row the same way', () => {
    const q = Math.PI / 2; // rot is radians
    assert.equal(aisleGap(piece('a', 'stove', 2, 5, 2.5, 2.5, q), piece('b', 'sink', 2, 8, 3, 2, q)), null);
    assert.ok((aisleGap(piece('a', 'stove', 2, 5, 2.5, 2.5, q), piece('b', 'sink', 7, 5, 3, 2, q)) ?? -1) > 0);
    // a quarter turn swaps width and depth: 2.5×6 turned is 6 wide and 2.5 deep
    assert.equal(aisleGap(piece('a', 'stove', 0, 0, 2.5, 6, q), piece('b', 'sink', 6, 0, 2, 3, q)), 6 - 3 - 1.5);
  });
});

describe('New York code (2.13.59)', () => {
  const door = (id: string, wallId: string, width: number) => ({ id, wallId, t: 0.5, width, type: 'door' as const, symbolKind: 'swingDoor' as const });
  it('measures only the outside (exit) door: 32" clear means a 3\'-0" door', () => {
    const f = boxFloor(20, 14);
    f.walls.push({ id: 'in', a: 'a', b: 'c', kind: 'interior', thickness: 0.35 });
    f.openings = [door('front', 'w1', 3), door('inside', 'in', 2.5)];
    assert.equal(runAccessCheck(f).checks.find((c) => c.id === 'door-width')?.status, 'pass');
    f.openings = [door('front', 'w1', 2.5), door('inside', 'in', 3)];
    assert.equal(runAccessCheck(f).checks.find((c) => c.id === 'door-width')?.status, 'fail');
    f.openings = [door('inside', 'in', 3)];
    assert.equal(runAccessCheck(f).checks.find((c) => c.id === 'door-width')?.status, 'warn');
  });
  it('a small bath is an accessibility tip, not a code failure', () => {
    const f = boxFloor(4, 4);
    f.rooms = [{ id: 'b', kind: 'bath', name: 'Bath', x: 2, y: 2 }];
    const turn = runAccessCheck(f).checks.find((c) => c.id === 'turn')!;
    assert.equal(turn.status, 'warn');
    assert.match(turn.tip, /not required/);
  });
});

describe('every house template passes the Access check (2.13.63)', () => {
  it('no fails on doors, swings or halls', async () => {
    const { STYLE_TEMPLATES, buildTemplateProject } = await import('../data/templates');
    for (const tpl of STYLE_TEMPLATES) {
      if (tpl.id === 'blank' || tpl.id === 'dog-house') continue;
      const f = buildTemplateProject(tpl.id).floors[0];
      const fails = runAccessCheck(f).checks.filter((c) => c.status === 'fail').map((c) => `${tpl.id}:${c.id}: ${c.detail}`);
      assert.deepEqual(fails, []);
    }
  });
});
