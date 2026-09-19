import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_WALL_HEIGHT_FT,
  DEFAULT_WALL_HEIGHT_M,
  DEFAULT_WALL_THICKNESS_FT,
  DEFAULT_WALL_THICKNESS_MM,
  asWallDrawStyle,
  asWallHeightFt,
  mToFt,
  mmToFt,
  nearestHeightM,
  nearestThicknessMm,
} from './wallDraft.ts';

describe('wall draft presets', () => {
  it('defaults match the Diego flyout (200mm · 2.7m)', () => {
    assert.equal(DEFAULT_WALL_THICKNESS_MM, 200);
    assert.equal(DEFAULT_WALL_HEIGHT_M, 2.7);
    assert.equal(nearestThicknessMm(DEFAULT_WALL_THICKNESS_FT), 200);
    assert.equal(nearestHeightM(DEFAULT_WALL_HEIGHT_FT), 2.7);
  });

  it('round-trips the thickness chips', () => {
    for (const mm of [120, 200, 300] as const) {
      assert.equal(nearestThicknessMm(mmToFt(mm)), mm);
    }
  });

  it('round-trips the height chips', () => {
    for (const m of [2.4, 2.7, 3.0] as const) {
      assert.equal(nearestHeightM(mToFt(m)), m);
    }
  });

  it('coerces bad settings back to the classroom default', () => {
    assert.equal(asWallHeightFt(undefined), DEFAULT_WALL_HEIGHT_FT);
    assert.equal(asWallHeightFt(2), DEFAULT_WALL_HEIGHT_FT);
    assert.equal(asWallDrawStyle('brick'), 'brick');
    assert.equal(asWallDrawStyle('nope'), 'outline');
  });
});
