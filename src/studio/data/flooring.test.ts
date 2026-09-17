import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  FLOOR_FINISHES, asFloorFinish, asFloorGrain, defaultFloorForKind, isFloorFinish,
} from './flooring.ts';

describe('flooring', () => {
  it('accepts new classroom finishes', () => {
    assert.equal(isFloorFinish('walnut'), true);
    assert.equal(isFloorFinish('herringbone'), true);
    assert.equal(isFloorFinish('slate'), true);
    assert.equal(isFloorFinish('terracotta'), true);
    assert.equal(isFloorFinish('cork'), true);
    assert.equal(isFloorFinish('marble'), true);
    assert.equal(asFloorFinish('nope'), 'oak');
    assert.equal(FLOOR_FINISHES.length >= 16, true);
  });

  it('grain is 0 or 90', () => {
    assert.equal(asFloorGrain(90), 90);
    assert.equal(asFloorGrain(0), 0);
    assert.equal(asFloorGrain('x'), 0);
  });

  it('kind defaults teach typical rooms', () => {
    assert.equal(defaultFloorForKind('kitchen'), 'tile');
    assert.equal(defaultFloorForKind('bath'), 'hex');
    assert.equal(defaultFloorForKind('bedroom'), 'carpet');
    assert.equal(defaultFloorForKind('dining'), 'herringbone');
    assert.equal(defaultFloorForKind('outdoor'), null);
  });
});
