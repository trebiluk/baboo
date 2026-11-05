import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { POSTCARD_H, POSTCARD_W, classLine, postcardLayout } from './postcard.ts';

describe('postcard layout (2.13.61)', () => {
  it('is 1200×900 with a border, a picture area, a caption band and a footer that add up', () => {
    const { border, band, foot, pic } = postcardLayout();
    assert.equal(POSTCARD_W, 1200);
    assert.equal(POSTCARD_H, 900);
    assert.equal(pic.x, border);
    assert.equal(pic.w, POSTCARD_W - border * 2);
    assert.equal(pic.y + pic.h + band + foot + border, POSTCARD_H);
    assert.ok(pic.w / pic.h > 1.3 && pic.w / pic.h < 1.8, 'picture stays landscape');
  });
});

describe('postcard class line (2.13.80)', () => {
  it('joins school · class · nickname and leaves out empties — never a real name field', () => {
    assert.equal(classLine({ schoolName: 'Solvay Middle', className: 'Period 3', alias: 'Nova' }), 'Solvay Middle · Period 3 · Nova');
    assert.equal(classLine({ schoolName: ' Solvay Middle ', className: '', alias: '' }), 'Solvay Middle');
    assert.equal(classLine({}), '');
    assert.equal(classLine({ alias: 'Nova' }), 'Nova', 'a nickname the kid chose can stand alone');
  });
});
