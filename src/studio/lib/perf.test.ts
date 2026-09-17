import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { furnitureLod, FURN_CAP, FACE_BUDGET } from './perf.ts';
import { furnitureParts } from './furnShape.ts';
import type { FurnitureItem } from '../types.ts';

function item(catalogId: string): FurnitureItem {
  return { id: 'f1', catalogId, x: 4, y: 4, w: 5, h: 3, rot: 0, zIndex: 1, label: catalogId };
}

describe('furniture lod', () => {
  it('stays full for a small still house', () => {
    assert.equal(furnitureLod({ count: 8, dist: 30, zoom: 18 }), 'full');
  });

  it('goes simple when dragging, packed, far, or zoomed out', () => {
    assert.equal(furnitureLod({ dragging: true, count: 2 }), 'simple');
    assert.equal(furnitureLod({ count: 40 }), 'simple');
    assert.equal(furnitureLod({ dist: 80, count: 4 }), 'simple');
    assert.equal(furnitureLod({ zoom: 6, count: 4 }), 'simple');
  });

  it('simple parts are fewer than full parts', () => {
    const full = furnitureParts(item('sofa'), 'full');
    const simple = furnitureParts(item('sofa'), 'simple');
    assert.ok(simple.length < full.length);
    assert.ok(simple.length >= 1);
  });

  it('simple lod raises the furniture cap and tightens the face budget', () => {
    assert.ok(FURN_CAP.simple > FURN_CAP.full);
    assert.ok(FACE_BUDGET.simple < FACE_BUDGET.full);
  });
});
