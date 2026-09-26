import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createJiti } from 'jiti';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const jiti = createJiti(import.meta.url);
const { FURNITURE_CATALOG } = jiti('../src/studio/data/furniture.ts');
const { objectSvg } = jiti('../src/studio/data/objectArt.ts');
const { symbolSrc } = jiti('../src/studio/data/objectSymbols.ts');

describe('object vectors', () => {
  it('writes one unique scalable picture per catalog object', () => {
    const sofa = objectSvg('sofa');
    assert.notEqual(sofa, objectSvg('chair'));
    assert.notEqual(objectSvg('closet'), objectSvg('dresser'));
    assert.match(sofa, /data-tex="fabric"/);
    assert.match(objectSvg('dresser'), /data-tex="wood"/);
    assert.match(objectSvg('fridge'), /data-tex="metal"/);
    assert.match(objectSvg('sofa', '#3D4F6F'), /#3D4F6F/i);
    assert.match(objectSvg('toilet', '#3D4F6F'), /#E8EEF2|#EEF2F6/);
    const dir = join(root, 'public/objects/baboo');
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
