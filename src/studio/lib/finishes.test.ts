import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { faceLookup, resolveFace, storedFace, wallFaces, withFace, shadeHex } from './finishes.ts';
import type { Node, Room, Wall } from '../types.ts';

// A 20 x 10 box split down the middle: Kitchen on the left, Bath on the right.
const nodes: Node[] = [
  { id: 'n1', x: 0, y: 0 },
  { id: 'n2', x: 10, y: 0 },
  { id: 'n3', x: 20, y: 0 },
  { id: 'n4', x: 20, y: 10 },
  { id: 'n5', x: 10, y: 10 },
  { id: 'n6', x: 0, y: 10 },
] as Node[];
const ext = (id: string, a: string, b: string): Wall => ({ id, a, b, kind: 'exterior', thickness: 0.5 });
const walls: Wall[] = [
  ext('top1', 'n1', 'n2'), ext('top2', 'n2', 'n3'), ext('right', 'n3', 'n4'),
  ext('bot2', 'n4', 'n5'), ext('bot1', 'n5', 'n6'), ext('left', 'n6', 'n1'),
  { id: 'mid', a: 'n2', b: 'n5', kind: 'interior', thickness: 0.35 },
];
const kitchen: Room = { id: 'k', kind: 'kitchen', name: 'Kitchen', x: 5, y: 5, wallPaint: '#8FBEB0' } as Room;
const bath: Room = { id: 'b', kind: 'bath', name: 'Bath', x: 15, y: 5 } as Room;
const floor = { nodes, walls, rooms: [kitchen, bath] };

describe('2.13.24 wall faces', () => {
  it('finds the room on each side of an inside wall', () => {
    const roomOf = faceLookup(floor);
    const mid = walls.find((w) => w.id === 'mid')!;
    const sides = [roomOf(mid, 'a')?.id, roomOf(mid, 'b')?.id].sort();
    assert.deepEqual(sides, ['b', 'k']);
  });

  it('an outside wall has one outside face and one room face', () => {
    const roomOf = faceLookup(floor);
    const left = walls.find((w) => w.id === 'left')!;
    const faces = wallFaces(left, roomOf);
    assert.equal(faces[0].outside, false);
    assert.equal(faces[0].room?.id, 'k');
    assert.equal(faces[1].outside, true);
  });

  it('a room face follows the room paint until the face has its own', () => {
    const roomOf = faceLookup(floor);
    const left = walls.find((w) => w.id === 'left')!;
    const inside = wallFaces(left, roomOf)[0];
    assert.equal(inside.paint, '#8FBEB0');
    assert.equal(inside.own, false);
    const painted: Wall = { ...left, faces: withFace(left, inside.side, { paint: '#E8B4B4' }) };
    const again = resolveFace(painted, inside.side, faceLookup({ ...floor, walls: walls.map((w) => (w.id === 'left' ? painted : w)) }));
    assert.equal(again.paint, '#E8B4B4');
    assert.equal(again.own, true);
  });

  it('outside faces take a covering; brick walls default to brick', () => {
    const roomOf = faceLookup(floor);
    const top = { ...walls[0], drawStyle: 'brick' } as Wall;
    const out = wallFaces(top, roomOf)[1];
    assert.equal(out.skin, 'brick');
    const sided: Wall = { ...top, faces: withFace(top, out.side, { skin: 'siding' }) };
    assert.equal(storedFace(sided, out.side)?.skin, 'siding');
  });

  it('clearing a face removes it, and bad saved values are ignored', () => {
    const w: Wall = { ...walls[0], faces: { a: { paint: '#123456', skin: 'stone' } } };
    const cleared: Wall = { ...w, faces: withFace(w, 'a', null) };
    assert.equal(storedFace(cleared, 'a'), null);
    const bad = { ...walls[0], faces: { a: { paint: 'red; drop', skin: 'lava' } } } as unknown as Wall;
    assert.equal(storedFace(bad, 'a'), null);
  });

  it('shades a color', () => {
    assert.equal(shadeHex('#808080', 0.5), '#404040');
    assert.equal(shadeHex('#ffffff', 2), '#ffffff');
  });
});
