import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  ELEV_K,
  OBLIQUE_K,
  WALL_H,
  asDollProj,
  fromIso,
  iso,
  isoPoints,
  nextYaw,
  project,
  unproject,
  yawToFace,
  shouldCutawayWall,
  isCameraFacingSide,
  cameraDepth,
} from './iso.ts';

describe('isometric dollhouse', () => {
  it('round-trips plan feet at floor height', () => {
    const p = iso(12, 8, 0);
    const back = fromIso(p.x, p.y, 0);
    assert.ok(Math.abs(back.x - 12) < 1e-9);
    assert.ok(Math.abs(back.y - 8) < 1e-9);
  });

  it('lifts walls up the screen', () => {
    const floor = iso(4, 4, 0);
    const top = iso(4, 4, WALL_H);
    assert.ok(top.y < floor.y);
  });

  it('flattens a closed wall quad to eight numbers', () => {
    const pts = isoPoints([
      { x: 0, y: 0, z: 0 },
      { x: 10, y: 0, z: 0 },
      { x: 10, y: 0, z: 8 },
      { x: 0, y: 0, z: 8 },
    ]);
    assert.equal(pts.length, 8);
  });
});

describe('dollhouse projections', () => {
  it('asDollProj falls back to iso', () => {
    assert.equal(asDollProj('nope'), 'iso');
    assert.equal(asDollProj('oblique'), 'oblique');
  });

  it('yaw labels Front Right Rear Left Top', () => {
    assert.equal(yawToFace(0), 'front');
    assert.equal(yawToFace(90), 'right');
    assert.equal(yawToFace(180), 'rear');
    assert.equal(yawToFace(270), 'left');
    assert.equal(yawToFace(0, true), 'top');
    assert.equal(nextYaw(0, 1), 90);
    assert.equal(nextYaw(0, -1), 270);
  });

  it('oblique cabinet recedes at half-45 and round-trips the floor', () => {
    const spec = { kind: 'oblique' as const, yaw: 0 as const };
    const p = project(10, 6, 0, spec);
    const back = unproject(p.x, p.y, spec);
    assert.ok(Math.abs(back.x - 10) < 1e-6);
    assert.ok(Math.abs(back.y - 6) < 1e-6);
    const front = project(0, 0, 8, spec);
    const recede = project(0, 8, 8, spec);
    const recedeLen = Math.hypot(recede.x - front.x, recede.y - front.y);
    const true8 = 8 * 16;
    assert.ok(Math.abs(recedeLen - true8 * OBLIQUE_K * Math.SQRT2) < 0.5 || recedeLen < true8 * 0.6);
  });

  it('elevation keeps height true and almost drops depth', () => {
    const spec = { kind: 'elevation' as const, yaw: 0 as const };
    const floor = project(4, 2, 0, spec);
    const top = project(4, 2, 8, spec);
    assert.ok(Math.abs((floor.y - top.y) - 8 * 16) < 1e-6);
    const near = project(0, 0, 0, spec);
    const far = project(0, 10, 0, spec);
    const depth = Math.hypot(far.x - near.x, far.y - near.y);
    assert.ok(depth < 10 * 16 * (ELEV_K + 0.05) * 2);
    const back = unproject(floor.x, floor.y, spec);
    assert.ok(Math.abs(back.x - 4) < 1e-6);
  });

  it('orthographic top is a plan: x and y true, height almost gone', () => {
    const spec = { kind: 'ortho' as const, yaw: 0 as const, top: true };
    const a = project(0, 0, 0, spec);
    const b = project(10, 0, 0, spec);
    const c = project(0, 6, 0, spec);
    assert.ok(Math.abs(b.x - a.x - 160) < 1e-6);
    assert.ok(Math.abs(c.y - a.y - 96) < 1e-6);
    const up = project(0, 0, 8, spec);
    assert.ok(Math.abs(a.y - up.y) < 20);
    const back = unproject(b.x, b.y, spec);
    assert.ok(Math.abs(back.x - 10) < 1e-6);
  });

  it('rotating 90° shows a different face and still invert', () => {
    const spec = { kind: 'iso' as const, yaw: 90 as const };
    const p = project(8, 3, 0, spec);
    const back = unproject(p.x, p.y, spec);
    assert.ok(Math.abs(back.x - 8) < 1e-6);
    assert.ok(Math.abs(back.y - 3) < 1e-6);
  });
});

describe('dollhouse cutaway', () => {
  const iso0 = { kind: 'iso' as const, yaw: 0 as const };
  const iso180 = { kind: 'iso' as const, yaw: 180 as const };

  it('opens the two near walls of a square on isometric front', () => {
    const c = 5;
    assert.equal(shouldCutawayWall(10, 5, c, c, iso0), true); // +X near
    assert.equal(shouldCutawayWall(5, 10, c, c, iso0), true); // +Y near
    assert.equal(shouldCutawayWall(0, 5, c, c, iso0), false); // −X far
    assert.equal(shouldCutawayWall(5, 0, c, c, iso0), false); // −Y far
  });

  it('swaps which walls open when you turn the house 180°', () => {
    const c = 5;
    assert.equal(shouldCutawayWall(0, 5, c, c, iso180), true);
    assert.equal(shouldCutawayWall(5, 0, c, c, iso180), true);
    assert.equal(shouldCutawayWall(10, 5, c, c, iso180), false);
    assert.equal(shouldCutawayWall(5, 10, c, c, iso180), false);
  });

  it('never cuts elevation or a top view — those faces stay true', () => {
    assert.equal(shouldCutawayWall(10, 5, 5, 5, { kind: 'elevation', yaw: 0 }), false);
    assert.equal(shouldCutawayWall(10, 5, 5, 5, { kind: 'ortho', yaw: 0, top: true }), false);
  });

  it('keeps the camera-facing side of a box and drops the far side', () => {
    const spec = iso0;
    const cx = 4;
    const cy = 4;
    assert.equal(isCameraFacingSide(6, 2, 6, 6, cx, cy, spec), true); // +X
    assert.equal(isCameraFacingSide(2, 6, 6, 6, cx, cy, spec), true); // +Y
    assert.equal(isCameraFacingSide(2, 2, 2, 6, cx, cy, spec), false); // −X
    assert.equal(isCameraFacingSide(2, 2, 6, 2, cx, cy, spec), false); // −Y
  });

  it('cameraDepth is larger for the near corner in isometric', () => {
    assert.ok(cameraDepth(10, 10, iso0) > cameraDepth(0, 0, iso0));
  });
});
