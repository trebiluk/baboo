import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { footprintPad, wallPrism } from './dollWalls.ts';

describe('dollhouse walls', () => {
  it('a wall is a prism, not a paper line', () => {
    const faces = wallPrism({ x: 0, y: 0 }, { x: 10, y: 0 }, 0.5, 9);
    assert.equal(faces.length, 5);
    const top = faces[4];
    const ys = top.map((p) => p.y);
    assert.ok(Math.max(...ys) - Math.min(...ys) >= 0.42);
    assert.ok(top.every((p) => p.z === 9));
  });

  it('the pad is bigger than one short wall', () => {
    const pad = footprintPad([{ x: 2, y: 4 }, { x: 3, y: 4 }]);
    assert.ok(pad);
    const xs = pad!.map((p) => p.x);
    assert.ok(Math.max(...xs) - Math.min(...xs) > 8);
  });
});
