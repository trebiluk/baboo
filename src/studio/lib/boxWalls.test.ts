import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { boxCorners } from './boxWalls.ts';

describe('box walls', () => {
  it('two opposite corners become four meeting corners', () => {
    const c = boxCorners({ x: 10, y: 4 }, { x: 2, y: 12 });
    assert.deepEqual(c, [
      { x: 2, y: 4 },
      { x: 10, y: 4 },
      { x: 10, y: 12 },
      { x: 2, y: 12 },
    ]);
  });

  it('refuses a sliver', () => {
    assert.equal(boxCorners({ x: 0, y: 0 }, { x: 1, y: 8 }), null);
    assert.equal(boxCorners({ x: 0, y: 0 }, { x: 8, y: 0.5 }), null);
  });
});
