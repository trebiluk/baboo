import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { hitSketch, polylineLength, simplifyPolyline } from './geometry.ts';

describe('sketch geometry', () => {
  it('keeps endpoints and drops colinear mids', () => {
    const flat = [0, 0, 4, 0, 8, 0];
    assert.deepEqual(simplifyPolyline(flat, 0.2), [0, 0, 8, 0]);
  });

  it('keeps a corner that sticks out past epsilon', () => {
    const flat = [0, 0, 4, 0, 4, 3, 8, 3];
    const simple = simplifyPolyline(flat, 0.5);
    assert.equal(simple.length, 8);
    assert.deepEqual(simple, [0, 0, 4, 0, 4, 3, 8, 3]);
  });

  it('measures polyline length', () => {
    assert.equal(polylineLength([0, 0, 3, 4]), 5);
    assert.equal(polylineLength([0, 0]), 0);
  });

  it('hits a stroke near a segment and misses far away', () => {
    const items = [{ id: 'sk1', points: [0, 0, 10, 0, 10, 8] }];
    assert.equal(hitSketch(items, { x: 5, y: 0.2 }, 0.5), 'sk1');
    assert.equal(hitSketch(items, { x: 5, y: 3 }, 0.5), null);
  });
});
