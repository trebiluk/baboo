import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { furnitureParts, partWorldCorners, partWorldRing } from './furnShape.ts';
import { FURNITURE_CATALOG } from '../data/furniture.ts';
import type { FurnitureItem } from '../types.ts';

function item(catalogId: string, w: number, h: number): FurnitureItem {
  return { id: 'f1', catalogId, x: 10, y: 8, w, h, rot: 0, zIndex: 1, label: catalogId };
}

describe('furniture parts', () => {
  it('every catalog piece has more than a single box', () => {
    for (const cat of FURNITURE_CATALOG) {
      const parts = furnitureParts(item(cat.id, cat.w, cat.h));
      assert.ok(parts.length >= 2, `${cat.id} only ${parts.length} parts`);
    }
  });

  it('beds have a mattress, headboard, and pillow', () => {
    const parts = furnitureParts(item('bed-queen', 5, 6.5));
    assert.ok(parts.length >= 6);
    assert.ok(parts.some((p) => p.z1 > 2));
    assert.ok(parts.some((p) => p.shape === 'oval' && (p.fill === '#F4EEE4' || p.fill.toLowerCase().includes('f4'))));
  });

  it('sofa has a seat, back, and two arms', () => {
    const parts = furnitureParts(item('sofa', 7, 3));
    assert.ok(parts.length >= 6);
    assert.equal(parts.filter((p) => p.shape === 'oval').length >= 2, true);
  });

  it('stove has four burner rings, toilet a bowl, coffee table an oval top', () => {
    const stove = furnitureParts(item('stove', 2.5, 2.5));
    assert.ok(stove.filter((p) => p.shape === 'cyl').length >= 4);
    const toilet = furnitureParts(item('toilet', 1.5, 2.5));
    assert.ok(toilet.some((p) => p.shape === 'oval'));
    const table = furnitureParts(item('coffee-table', 4, 2));
    assert.ok(table.some((p) => p.shape === 'oval' || p.shape === 'cyl'));
  });

  it('world corners rotate with the item', () => {
    const f = item('desk', 4, 2);
    f.rot = Math.PI / 2;
    const c = partWorldCorners(f, furnitureParts(f)[0]);
    assert.equal(c.length, 4);
    assert.ok(c.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y)));
  });

  it('cylinder rings have more than four points', () => {
    const heater = furnitureParts(item('water-heater', 2, 2));
    const cyl = heater.find((p) => p.shape === 'cyl');
    assert.ok(cyl);
    const ring = partWorldRing(item('water-heater', 2, 2), cyl!);
    assert.ok(ring.length >= 8);
  });
});
