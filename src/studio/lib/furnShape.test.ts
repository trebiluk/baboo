import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { elevForHeight, furnBaseHeight, furnHeightOffFloor, furnitureParts, partWorldCorners, partWorldRing } from './furnShape.ts';
import { FURNITURE_CATALOG } from '../data/furniture.ts';
import { objectSvg } from '../data/objectArt.ts';
import { symbolSrc } from '../data/objectSymbols.ts';
import type { FurnitureItem } from '../types.ts';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

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

  it('paint recolors a sofa and leaves a toilet porcelain', () => {
    const sofa = item('sofa', 7, 3);
    sofa.color = '#3D4F6F';
    const painted = furnitureParts(sofa);
    assert.ok(painted.some((p) => p.fill.toLowerCase() === '#3d4f6f' || p.fill.toLowerCase().startsWith('#3')));
    assert.ok(painted.some((p) => p.tex === 'fabric' && p.fill.toLowerCase() === '#3d4f6f'));
    const toilet = item('toilet', 1.5, 2.5);
    toilet.color = '#3D4F6F';
    const bowl = furnitureParts(toilet);
    assert.ok(bowl.some((p) => p.fill === '#E8EEF2' || p.fill === '#EEF2F6'));
    assert.ok(bowl.some((p) => p.tex === 'ceramic'));
  });

  it('every object has its own scalable vector', () => {
    const dir = join(dirname(fileURLToPath(import.meta.url)), '../../../public/objects/baboo');
    const sofa = objectSvg('sofa');
    const closet = objectSvg('closet');
    const dresser = objectSvg('dresser');
    assert.notEqual(sofa, objectSvg('chair'));
    assert.notEqual(closet, dresser);
    assert.match(sofa, /data-tex="fabric"/);
    assert.match(dresser, /data-tex="wood"/);
    assert.match(objectSvg('fridge'), /data-tex="metal"/);
    assert.match(objectSvg('sofa', '#3D4F6F'), /#3D4F6F/i);
    assert.match(objectSvg('toilet', '#3D4F6F'), /#E8EEF2|#EEF2F6/);
    for (const cat of FURNITURE_CATALOG) {
      assert.equal(symbolSrc(cat.id), `/objects/baboo/${cat.id}.svg`);
      const file = join(dir, `${cat.id}.svg`);
      assert.equal(existsSync(file), true, cat.id);
      const text = readFileSync(file, 'utf8');
      assert.match(text, /viewBox=/);
      const shapes = text.match(/<(rect|ellipse) /g) ?? [];
      assert.ok(shapes.length >= 2, `${cat.id} shapes ${shapes.length}`);
    }
  });
});

describe('height off the floor (2.13.86)', () => {
  const low = (parts: ReturnType<typeof furnitureParts>) => Math.min(...parts.map((p) => p.z0));
  it('a microwave sits at counter height and can go on the floor or a shelf', () => {
    const m = item('microwave', 1.75, 1.25);
    assert.ok(Math.abs(furnBaseHeight(m) - 3.08) < 0.01);
    assert.ok(Math.abs(furnHeightOffFloor(m) - 3.08) < 0.01);
    const onFloor = { ...m, elev: elevForHeight(m, 0) };
    assert.ok(Math.abs(low(furnitureParts(onFloor))) < 0.001);
    const onShelf = { ...m, elev: elevForHeight(m, 5) };
    assert.ok(Math.abs(low(furnitureParts(onShelf)) - 5) < 0.001);
    assert.ok(Math.abs(furnHeightOffFloor(onShelf) - 5) < 0.001);
  });
  it('lifts every part, in plan, dollhouse and 3D alike, and keeps the parts the same size', () => {
    const bed = item('bed-twin', 3.25, 6.25);
    const a = furnitureParts(bed);
    const b = furnitureParts({ ...bed, elev: 5 });
    assert.equal(a.length, b.length);
    a.forEach((p, i) => { assert.ok(Math.abs(b[i].z0 - p.z0 - 5) < 1e-9); assert.ok(Math.abs(b[i].z1 - p.z1 - 5) < 1e-9); });
    const s = furnitureParts({ ...bed, elev: 5 }, 'simple');
    assert.ok(low(s) >= 5 - 1e-9);
  });
  it('never goes under the floor or past 20 ft, and ignores junk', () => {
    const m = item('microwave', 1.75, 1.25);
    assert.ok(low(furnitureParts({ ...m, elev: -50 })) >= -1e-9);
    assert.ok(furnHeightOffFloor({ ...m, elev: 99 }) <= 20 + 1e-9);
    assert.ok(Math.abs(furnHeightOffFloor({ ...m, elev: Number.NaN }) - 3.08) < 0.01);
    assert.equal(elevForHeight(item('sofa', 7, 3), -3), 0);
  });
});
