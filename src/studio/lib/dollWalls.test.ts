import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { footprintPad, wallCutFaces, wallPrism } from './dollWalls.ts';

describe('dollhouse walls', () => {
  it('a wall is a prism, not a paper line', () => {
    const faces = wallPrism({ x: 0, y: 0 }, { x: 10, y: 0 }, 0.5, 9);
    assert.equal(faces.length, 5);
    const top = faces[4];
    const ys = top.map((p) => p.y);
    assert.ok(Math.max(...ys) - Math.min(...ys) >= 0.42);
    assert.ok(top.every((p) => p.z === 9));
  });

  it('a door is a hole, not a sticker on the wall', () => {
    const cut = wallCutFaces({ x: 0, y: 0 }, { x: 12, y: 0 }, 0.5, 9, [
      { t: 0.5, width: 3, kind: 'door' },
    ]);
    assert.equal(cut.holes.length, 1);
    assert.equal(cut.holes[0].kind, 'door');
    const zs = cut.holes[0].ring.map((p) => p.z);
    assert.ok(Math.max(...zs) < 8);
    assert.ok(cut.walls.length >= 5);
    const full = wallPrism({ x: 0, y: 0 }, { x: 12, y: 0 }, 0.5, 9);
    assert.equal(full.length, 5);
  });
  it('the pad is bigger than one short wall', () => {
    const pad = footprintPad([{ x: 2, y: 4 }, { x: 3, y: 4 }]);
    assert.ok(pad);
    const xs = pad!.map((p) => p.x);
    assert.ok(Math.max(...xs) - Math.min(...xs) > 8);
  });
});
