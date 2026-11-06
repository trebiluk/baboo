import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { repairFloor, MAX_COORD_FT } from './repair.ts';

const good = {
  id: 'f1', name: 'Floor 1', elevation: 0,
  nodes: [{ id: 'a', x: 0, y: 0 }, { id: 'b', x: 10, y: 0 }, { id: 'c', x: 10, y: 10 }],
  walls: [{ id: 'w1', a: 'a', b: 'b', kind: 'exterior', thickness: 0.66 }, { id: 'w2', a: 'b', b: 'c', kind: 'interior', thickness: 0.4 }],
  openings: [{ id: 'o1', wallId: 'w1', t: 0.5, width: 3, type: 'door', symbolKind: 'swingDoor' }],
  furniture: [{ id: 'p1', catalogId: 'bed', x: 3, y: 3, w: 4, h: 6, rot: 0, zIndex: 0, label: 'Bed' }],
  rooms: [{ id: 'r1', kind: 'bedroom', name: 'Bedroom', x: 5, y: 5 }],
  dimensions: [], notes: [], landscape: [], sketches: [], roof: null,
};

describe('repairFloor (2.13.49)', () => {
  it('keeps a good floor as it is', () => {
    const report = { dropped: 0 };
    const out = repairFloor(structuredClone(good), report);
    assert.equal(report.dropped, 0);
    assert.equal(out.walls.length, 2);
    assert.equal(out.openings.length, 1);
    assert.deepEqual(out.rooms[0], good.rooms[0]);
  });

  it('drops corners with bad numbers and the walls and doors that used them', () => {
    const f = structuredClone(good) as typeof good & Record<string, unknown>;
    (f.nodes[0] as Record<string, unknown>).x = null;
    (f.nodes[1] as Record<string, unknown>).y = 'abc';
    const report = { dropped: 0 };
    const out = repairFloor(f, report);
    assert.equal(out.nodes.length, 1);
    assert.equal(out.walls.length, 0);
    assert.equal(out.openings.length, 0);
    assert.equal(report.dropped, 2 + 2 + 1);
  });

  it('drops walls to nowhere, zero-length walls and far-away corners', () => {
    const f = structuredClone(good) as Record<string, unknown> & typeof good;
    f.nodes.push({ id: 'far', x: MAX_COORD_FT * 10, y: 0 });
    (f.walls as unknown[]).push({ id: 'w3', a: 'a', b: 'missing' }, { id: 'w4', a: 'a', b: 'a' }, { id: 'w5', a: 'a', b: 'far' });
    const out = repairFloor(f);
    assert.deepEqual(out.walls.map((w) => w.id), ['w1', 'w2']);
  });

  it('fixes bad wall thickness, door spots and missing door types', () => {
    const f = structuredClone(good) as Record<string, unknown> & typeof good;
    f.walls[0].thickness = -4;
    f.walls[1].thickness = 99;
    (f.openings as unknown[]).push({ id: 'o2', wallId: 'w2', t: 7, width: 2, symbolKind: 'windowFixed' }, { id: 'o3', wallId: 'w2', t: 0.2, width: 0 });
    const out = repairFloor(f);
    assert.equal(out.walls[0].thickness, 0.66);
    assert.equal(out.walls[1].thickness, 3);
    assert.equal(out.openings.length, 2);
    assert.equal(out.openings[1].type, 'window');
    assert.equal(out.openings[1].t, 1);
  });

  it('gives rooms and furniture the words and sizes they need', () => {
    const f = structuredClone(good) as Record<string, unknown> & typeof good;
    f.rooms = [{ id: 'r2', x: 1, y: 1 } as never, { id: 'r3', points: [1, 2] } as never, null as never];
    f.furniture = [{ id: 'p2', x: 1, y: 1 } as never, { id: 'p3' } as never];
    const out = repairFloor(f);
    assert.deepEqual(out.rooms.map((r) => [r.id, r.kind, r.name]), [['r2', 'other', '']]);
    assert.equal(out.furniture.length, 1);
    assert.equal(out.furniture[0].w, 2);
    assert.equal(out.furniture[0].label, '');
  });

  it('turns junk into an empty floor instead of throwing', () => {
    for (const junk of [null, 42, 'x', [], {}]) {
      const out = repairFloor(junk);
      assert.deepEqual([out.nodes, out.walls, out.rooms], [[], [], []]);
    }
  });

  it('keeps the first copy when two pieces share an id', () => {
    const f = structuredClone(good) as Record<string, unknown> & typeof good;
    f.walls.push({ ...f.walls[0], b: 'c' });
    const out = repairFloor(f);
    assert.equal(out.walls.length, 2);
    assert.equal(out.walls[0].b, 'b');
  });
});

describe('height off the floor survives a reload (2.13.86)', () => {
  it('keeps a lift, caps a wild one, drops junk', () => {
    const f = structuredClone(good) as typeof good & { furniture: Record<string, unknown>[] };
    f.furniture = [
      { ...good.furniture[0], id: 'k', elev: 4.5 },
      { ...good.furniture[0], id: 'w', elev: 900 },
      { ...good.furniture[0], id: 'j', elev: 'up' },
    ];
    const out = repairFloor(f);
    const by = Object.fromEntries(out.furniture.map((i) => [i.id, i.elev]));
    assert.equal(by.k, 4.5);
    assert.equal(by.w, 20);
    assert.equal(by.j, undefined);
  });
});

