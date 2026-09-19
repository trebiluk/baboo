import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  alignSnap,
  findOsnap,
  headingDeg,
  perpFoot,
  polarPoint,
  resolveDrawPoint,
  segIntersect,
  wallSegs,
  type Seg,
} from './osnap.ts';
import type { Node, Wall } from '../types.ts';

function seg(id: string, ax: number, ay: number, bx: number, by: number): Seg {
  return { id, a: { x: ax, y: ay }, b: { x: bx, y: by } };
}

/** A 20x10 room, corners at (0,0) and (20,10). */
function room(): Seg[] {
  return [
    seg('top', 0, 0, 20, 0),
    seg('right', 20, 0, 20, 10),
    seg('bottom', 20, 10, 0, 10),
    seg('left', 0, 10, 0, 0),
  ];
}

const base = {
  tol: 1,
  osnap: true,
  ortho: false,
  forceOrtho: false,
  snap: false,
  gridSize: 1,
  nodes: [] as { x: number; y: number }[],
};

describe('wallSegs', () => {
  it('resolves node ids and drops walls with a missing or doubled node', () => {
    const nodes: Node[] = [
      { id: 'n1', x: 0, y: 0 },
      { id: 'n2', x: 10, y: 0 },
      { id: 'n3', x: 10, y: 0 },
    ];
    const walls: Wall[] = [
      { id: 'w1', a: 'n1', b: 'n2', kind: 'exterior', thickness: 0.5 },
      { id: 'w2', a: 'n2', b: 'n3', kind: 'exterior', thickness: 0.5 },
      { id: 'w3', a: 'n1', b: 'gone', kind: 'exterior', thickness: 0.5 },
    ];
    const segs = wallSegs(walls, nodes);
    assert.deepEqual(segs.map((s) => s.id), ['w1']);
    assert.deepEqual(segs[0].b, { x: 10, y: 0 });
  });
});

describe('findOsnap', () => {
  it('latches onto a corner', () => {
    const hit = findOsnap({ x: 19.6, y: 0.3 }, room(), { tol: 1 });
    assert.equal(hit?.kind, 'endpoint');
    assert.deepEqual(hit?.p, { x: 20, y: 0 });
  });

  it('latches onto the middle of a wall', () => {
    const hit = findOsnap({ x: 10.2, y: 0.2 }, room(), { tol: 1 });
    assert.equal(hit?.kind, 'midpoint');
    assert.deepEqual(hit?.p, { x: 10, y: 0 });
  });

  it('prefers the corner over the middle and the wall it sits on', () => {
    /* A short wall whose midpoint is a hair nearer than the corner. */
    const segs = [seg('a', 0, 0, 2, 0), seg('b', 0, 0, 0, 8)];
    const hit = findOsnap({ x: 0.9, y: 0.08 }, segs, { tol: 2 });
    assert.equal(hit?.kind, 'endpoint');
  });

  it('finds where two walls cross', () => {
    const segs = [seg('h', 0, 5, 20, 5), seg('v', 8, 0, 8, 14)];
    const hit = findOsnap({ x: 8.3, y: 5.2 }, segs, { tol: 1 });
    assert.equal(hit?.kind, 'cross');
    assert.deepEqual(hit?.p, { x: 8, y: 5 });
  });

  it('squares off from the run in progress', () => {
    /* Drawing from (5,8): the square-off onto the top wall is (5,0). */
    const hit = findOsnap({ x: 5.2, y: 0.4 }, [seg('top', 0, 0, 20, 0)], {
      tol: 1,
      from: { x: 5, y: 8 },
    });
    assert.equal(hit?.kind, 'perp');
    assert.deepEqual(hit?.p, { x: 5, y: 0 });
  });

  it('falls back to a point along the wall', () => {
    const hit = findOsnap({ x: 7.3, y: 0.4 }, [seg('top', 0, 0, 20, 0)], { tol: 1 });
    assert.equal(hit?.kind, 'onwall');
    assert.deepEqual(hit?.p, { x: 7.3, y: 0 });
  });

  it('gives up outside the pull radius', () => {
    assert.equal(findOsnap({ x: 7, y: 6 }, [seg('top', 0, 0, 20, 0)], { tol: 1 }), null);
  });

  it('ignores walls asked to be skipped', () => {
    const hit = findOsnap({ x: 19.8, y: 0.1 }, room(), {
      tol: 1,
      skip: new Set(['top', 'right']),
    });
    assert.equal(hit, null);
  });

  it('snaps to a loose corner with no wall on it yet', () => {
    const hit = findOsnap({ x: 4.8, y: 4.9 }, [], { tol: 1, nodes: [{ x: 5, y: 5 }] });
    assert.equal(hit?.kind, 'endpoint');
    assert.deepEqual(hit?.p, { x: 5, y: 5 });
  });
});

describe('segIntersect', () => {
  it('returns null for parallel walls', () => {
    assert.equal(segIntersect(seg('a', 0, 0, 10, 0), seg('b', 0, 3, 10, 3)), null);
  });

  it('returns null when the crossing is past an end', () => {
    assert.equal(segIntersect(seg('a', 0, 0, 4, 0), seg('b', 8, -2, 8, 2)), null);
  });

  it('finds a diagonal crossing', () => {
    const x = segIntersect(seg('a', 0, 0, 10, 10), seg('b', 0, 10, 10, 0));
    assert.deepEqual(x, { x: 5, y: 5 });
  });
});

describe('perpFoot', () => {
  it('returns null when the square-off misses the wall', () => {
    assert.equal(perpFoot(seg('top', 0, 0, 4, 0), { x: 40, y: 5 }), null);
  });

  it('lands square on a diagonal', () => {
    const foot = perpFoot(seg('d', 0, 0, 10, 10), { x: 10, y: 0 });
    assert.deepEqual(foot, { x: 5, y: 5 });
  });
});

describe('alignSnap', () => {
  it('lines the cursor up with a corner across the room', () => {
    const r = alignSnap({ x: 19.7, y: 14 }, [{ x: 20, y: 0 }], 1);
    assert.equal(r.p.x, 20);
    assert.equal(r.p.y, 14);
    assert.deepEqual(r.guides.map((g) => g.axis), ['x']);
  });

  it('can line up on both axes at once', () => {
    const r = alignSnap({ x: 19.7, y: 10.2 }, [{ x: 20, y: 0 }, { x: 0, y: 10 }], 1);
    assert.deepEqual(r.p, { x: 20, y: 10 });
    assert.equal(r.guides.length, 2);
  });

  it('respects an axis that is locked out', () => {
    const r = alignSnap({ x: 19.7, y: 10.2 }, [{ x: 20, y: 0 }], 1, { x: false, y: true });
    assert.equal(r.p.x, 19.7);
    assert.deepEqual(r.guides, []);
  });

  it('does nothing with no anchors in reach', () => {
    const r = alignSnap({ x: 5, y: 5 }, [{ x: 20, y: 0 }], 1);
    assert.deepEqual(r.p, { x: 5, y: 5 });
    assert.deepEqual(r.guides, []);
  });
});

describe('resolveDrawPoint', () => {
  it('object snap beats the grid', () => {
    const r = resolveDrawPoint({ x: 9.8, y: 0.2 }, {
      ...base,
      segs: [seg('top', 0, 0, 20.5, 0)],
      snap: true,
      gridSize: 1,
    });
    assert.equal(r.osnap?.kind, 'midpoint');
    assert.deepEqual(r.p, { x: 10.25, y: 0 });
  });

  it('falls back to the grid when nothing is in reach', () => {
    const r = resolveDrawPoint({ x: 7.4, y: 3.6 }, {
      ...base,
      segs: [],
      snap: true,
      gridSize: 1,
    });
    assert.equal(r.osnap, null);
    assert.deepEqual(r.p, { x: 7, y: 4 });
  });

  it('keeps the angle lock and slides only along the free axis', () => {
    /* Drawing right from (0,0): y stays 0, x lines up with the corner at x=20. */
    const r = resolveDrawPoint({ x: 19.7, y: 0.2 }, {
      ...base,
      segs: [],
      nodes: [{ x: 20, y: 40 }],
      from: { x: 0, y: 0 },
      ortho: true,
      tol: 1,
    });
    assert.deepEqual(r.p, { x: 20, y: 0 });
    assert.deepEqual(r.guides.map((g) => g.axis), ['x']);
  });

  it('will not break a locked axis to line up', () => {
    const r = resolveDrawPoint({ x: 19.7, y: 0.2 }, {
      ...base,
      segs: [],
      nodes: [{ x: 40, y: 0.2 }],
      from: { x: 0, y: 0 },
      ortho: true,
      tol: 1,
    });
    assert.equal(r.p.y, 0);
    assert.deepEqual(r.guides, []);
  });

  it('leaves a diagonal run alone', () => {
    const r = resolveDrawPoint({ x: 10.2, y: 9.8 }, {
      ...base,
      segs: [],
      nodes: [{ x: 3, y: 3 }],
      from: { x: 0, y: 0 },
      ortho: true,
      tol: 1,
    });
    assert.deepEqual(r.guides, []);
    assert.ok(Math.abs(r.p.x - r.p.y) < 1e-9);
  });

  it('stays on plain grid snap when object snap is off', () => {
    const r = resolveDrawPoint({ x: 9.9, y: 0.1 }, {
      ...base,
      segs: [seg('top', 0, 0, 20.5, 0)],
      osnap: false,
      snap: true,
      gridSize: 1,
    });
    assert.equal(r.osnap, null);
    assert.deepEqual(r.p, { x: 10, y: 0 });
  });
});

describe('polar readout', () => {
  it('reads angles like a protractor', () => {
    const o = { x: 0, y: 0 };
    assert.equal(headingDeg(o, { x: 5, y: 0 }), 0);
    assert.equal(headingDeg(o, { x: 0, y: -5 }), 90);
    assert.equal(headingDeg(o, { x: -5, y: 0 }), 180);
    assert.equal(headingDeg(o, { x: 0, y: 5 }), 270);
    assert.equal(Math.round(headingDeg(o, { x: 5, y: -5 })), 45);
  });

  it('round-trips length and angle', () => {
    const from = { x: 3, y: 7 };
    const p = polarPoint(from, 12, 30);
    assert.ok(Math.abs(Math.hypot(p.x - from.x, p.y - from.y) - 12) < 1e-5);
    assert.ok(Math.abs(headingDeg(from, p) - 30) < 1e-5);
  });

  it('places an exact horizontal run', () => {
    assert.deepEqual(polarPoint({ x: 0, y: 0 }, 12, 0), { x: 12, y: 0 });
    assert.deepEqual(polarPoint({ x: 0, y: 0 }, 12, 180), { x: -12, y: 0 });
    assert.deepEqual(polarPoint({ x: 0, y: 0 }, 12, 90), { x: 0, y: -12 });
  });
});
