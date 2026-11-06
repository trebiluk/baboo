import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { closedLoopOf, dist, fitWallsFromStroke, furnitureFingerPad, hitSketch, polylineLength, readableAngle, simplifyPolyline, parseFeet, hitWallGrip, nodesAfterWallLength, nodesAfterWallEnd } from './geometry.ts';
import type { Wall, Node } from '../types.ts';

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

const opts = { gridSize: 1, snap: true, ortho: true };

function jitteredRect(): number[] {
  const path: [number, number][] = [
    [0, 0], [20, 0], [20, 12], [0, 12], [0, 0.2],
  ];
  const pts: number[] = [];
  for (let i = 0; i < path.length - 1; i++) {
    const [x0, y0] = path[i];
    const [x1, y1] = path[i + 1];
    const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 0.12);
    for (let k = 0; k < n; k++) {
      const t = k / n;
      const jx = 0.7 * Math.sin((i * 11 + k) * 0.6);
      const jy = 0.65 * Math.cos((i * 9 + k) * 0.8);
      pts.push(x0 + (x1 - x0) * t + jx, y0 + (y1 - y0) * t + jy);
    }
  }
  return pts;
}

function messyHouse(): number[] {
  const path: [number, number][] = [
    [4, 8], [3, 4], [6, 1.6], [16, 0.6], [28, 0.2], [40, 0.8], [52, 3],
    [53, 8], [50, 12], [47, 14], [51, 17.5], [56, 20], [52, 23.5],
    [42, 24.8], [30, 25.2], [18, 24.4], [8, 24], [3.5, 20], [2, 14], [3, 9],
  ];
  const pts: number[] = [];
  for (let i = 0; i < path.length - 1; i++) {
    const [x0, y0] = path[i];
    const [x1, y1] = path[i + 1];
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 0.12));
    for (let k = 0; k < n; k++) {
      const t = k / n;
      const jx = 0.55 * Math.sin((i * 13 + k) * 0.7) + 0.35 * Math.cos((i * 7 + k) * 1.1);
      const jy = 0.5 * Math.cos((i * 11 + k) * 0.9) + 0.4 * Math.sin((i * 5 + k) * 1.3);
      pts.push(x0 + (x1 - x0) * t + jx, y0 + (y1 - y0) * t + jy);
    }
  }
  return pts;
}

function wallCount(verts: { x: number; y: number }[]): number {
  let n = 0;
  for (let i = 1; i < verts.length; i++) {
    if (dist(verts[i - 1], verts[i]) >= 0.95) n += 1;
  }
  return n;
}

describe('fit walls from a wiggly sketch', () => {
  it('turns a jittered rectangle into about four walls, not a zigzag', () => {
    const verts = fitWallsFromStroke(jitteredRect(), opts);
    const n = wallCount(verts);
    assert.ok(n >= 3 && n <= 8, `got ${n} walls from ${verts.length} verts`);
    const xs = verts.map((p) => p.x);
    const ys = verts.map((p) => p.y);
    assert.ok(Math.max(...xs) - Math.min(...xs) >= 16, 'width collapsed');
    assert.ok(Math.max(...ys) - Math.min(...ys) >= 8, 'depth collapsed');
  });

  it('traces a messy house outline like a classroom pencil sketch', () => {
    const verts = fitWallsFromStroke(messyHouse(), opts);
    const n = wallCount(verts);
    assert.ok(n >= 6, `expected a house, got ${n} walls ${JSON.stringify(verts)}`);
    assert.ok(n <= 24, `too many jogs: ${n}`);
    const xs = verts.map((p) => p.x);
    const ys = verts.map((p) => p.y);
    assert.ok(Math.max(...xs) - Math.min(...xs) >= 40, 'lost the long run');
    assert.ok(Math.max(...ys) - Math.min(...ys) >= 16, 'lost the depth');
  });

  it('keeps a straight 20-foot run as one wall', () => {
    const flat: number[] = [];
    for (let x = 0; x <= 20; x += 0.15) {
      flat.push(x, 0.4 * Math.sin(x * 1.3));
    }
    const verts = fitWallsFromStroke(flat, opts);
    assert.equal(wallCount(verts), 1);
    assert.ok(dist(verts[0], verts[verts.length - 1]) >= 18);
  });

  it('leaves a tiny scribble untraced', () => {
    const verts = fitWallsFromStroke([0, 0, 0.4, 0.3, 0.8, 0.1], opts);
    assert.equal(wallCount(verts), 0);
  });
});

describe('closed sketches trace themselves, and the tracer tries harder (2.13.87)', () => {
  const kid = (path: [number, number][], amp: number, seed: number): number[] => {
    const out: number[] = [];
    let k = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const [x0, y0] = path[i];
      const [x1, y1] = path[i + 1];
      const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / 0.15));
      for (let j = 0; j < n; j++, k++) {
        const t = j / n;
        const jx = amp * (Math.sin(k * 0.37 + seed) * 0.6 + Math.sin(k * 0.11 + seed * 2.3) * 0.4);
        const jy = amp * (Math.cos(k * 0.29 + seed * 1.7) * 0.6 + Math.cos(k * 0.07 + seed * 3.1) * 0.4);
        out.push(x0 + (x1 - x0) * t + jx, y0 + (y1 - y0) * t + jy);
      }
    }
    return out;
  };
  const rot = (p: [number, number][], deg: number): [number, number][] => {
    const a = (deg * Math.PI) / 180;
    return p.map(([x, y]) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)]);
  };
  const outline = (v: { x: number; y: number }[]) => {
    const xs = v.map((p) => p.x);
    const ys = v.map((p) => p.y);
    return { walls: wallCount(v), closed: v.length > 3 && dist(v[0], v[v.length - 1]) < 0.01, w: Math.max(...xs) - Math.min(...xs), d: Math.max(...ys) - Math.min(...ys) };
  };
  const cases: [string, (s: number) => [number, number][], number, number, number, number][] = [
    ['starts mid-wall and runs past the start', () => [[12, 0], [24, 0], [24, 16], [0, 16], [0, 0], [15, 0.4]], 0.5, 4, 24, 16],
    ['leaves a gap at the last corner', () => [[0, 2.5], [0, 12], [20, 12], [20, 0], [2.5, 0]], 0.45, 4, 20, 12],
    ['is drawn a little crooked', (s) => rot([[0, 0], [22, 0], [22, 14], [0, 14], [0, 0.2]], s % 2 ? 7 : -7), 0.45, 4, -1, -1],
    ['is an L-shaped room', () => [[0, 0], [24, 0], [24, 9], [12, 9], [12, 18], [0, 18], [0, 0.3]], 0.45, 6, 24, 18],
    ['is the 14 x 7 class tiny house', () => [[0, 0], [14, 0], [14, 7], [0, 7], [0, 0.2]], 0.3, 4, 14, 7],
    ['is a 6 x 4 closet', () => [[0, 0], [6, 0], [6, 4], [0, 4], [0, 0.15]], 0.18, 4, 6, 4],
    ['has real 45° walls', () => [[6, 0], [24, 0], [30, 6], [30, 14], [24, 20], [6, 20], [0, 14], [0, 6], [6, 0.2]], 0.4, 8, 30, 20],
  ];
  for (const [name, path, amp, walls, w, d] of cases) {
    it(`a closed shape that ${name} → ${walls} clean walls, 20 different hands`, () => {
      for (let seed = 1; seed <= 20; seed++) {
        const flat = kid(path(seed), amp, seed);
        assert.ok(closedLoopOf(flat), `seed ${seed}: not seen as closed`);
        const o = outline(fitWallsFromStroke(flat, opts));
        assert.ok(o.closed, `seed ${seed}: outline not closed`);
        assert.equal(o.walls, walls, `seed ${seed}`);
        if (w > 0) {
          assert.ok(Math.abs(o.w - w) <= 1 && Math.abs(o.d - d) <= 1, `seed ${seed}: ${o.w} x ${o.d}`);
        }
      }
    });
  }
  it('never auto-traces an open stroke or a scribble', () => {
    const open: [number, number][][] = [
      [[0, 0], [0, 16], [24, 16], [24, 0]],
      [[0, 0], [0, 16], [24, 16]],
      [[0, 0], [20, 0], [0, 0.8], [20, 1.2], [1, 1.5]],
      [[0, 0], [20, 0]],
    ];
    for (const path of open) {
      for (let seed = 1; seed <= 20; seed++) assert.equal(closedLoopOf(kid(path, 0.7, seed)), null, `${JSON.stringify(path)} seed ${seed}`);
    }
    assert.equal(closedLoopOf([0, 0, 0.5, 0.4, 0.9, 0, 0.1, 0.1]), null, 'a dot is not a room');
  });
});

describe('wall grips and typed sizes', () => {
  const nodes: Node[] = [
    { id: 'a', x: 0, y: 0 },
    { id: 'b', x: 10, y: 0 },
  ];
  const wall: Wall = { id: 'w', a: 'a', b: 'b', kind: 'exterior', thickness: 0.5 };

  it('hits the end squares before the middle', () => {
    assert.equal(hitWallGrip(wall, nodes, { x: 0.1, y: 0 }, 0.6), 'a');
    assert.equal(hitWallGrip(wall, nodes, { x: 9.9, y: 0 }, 0.6), 'b');
    assert.equal(hitWallGrip(wall, nodes, { x: 5, y: 0 }, 0.6), 'mid');
    assert.equal(hitWallGrip(wall, nodes, { x: 5, y: 2 }, 0.6), null);
  });

  it('rubberbands one end and leaves the other', () => {
    const next = nodesAfterWallEnd(nodes, wall, 'b', { x: 14, y: 0 });
    const a = next.find((n) => n.id === 'a')!;
    const b = next.find((n) => n.id === 'b')!;
    assert.equal(a.x, 0);
    assert.equal(b.x, 14);
  });

  it('sets length from the start of the wall', () => {
    const next = nodesAfterWallLength(nodes, wall, 16);
    const b = next.find((n) => n.id === 'b')!;
    assert.ok(Math.abs(b.x - 16) < 1e-9);
    assert.ok(Math.abs(b.y) < 1e-9);
  });

  it('reads 12, 12\'6", 8", and meters', () => {
    assert.equal(parseFeet('12'), 12);
    assert.equal(parseFeet("12'6\""), 12.5);
    assert.equal(parseFeet('8"'), 8 / 12);
    assert.ok(Math.abs((parseFeet('3.048 m') ?? 0) - 10) < 0.01);
    assert.equal(parseFeet('nope'), null);
  });
});

describe('readableAngle', () => {
  it('leaves a left-to-right label alone', () => {
    assert.deepEqual(readableAngle(0), { deg: 0, flipped: false });
    assert.deepEqual(readableAngle(30), { deg: 30, flipped: false });
  });

  it('turns an upside-down label around', () => {
    assert.deepEqual(readableAngle(180), { deg: 0, flipped: true });
    assert.deepEqual(readableAngle(135), { deg: -45, flipped: true });
    assert.deepEqual(readableAngle(-135), { deg: 45, flipped: true });
  });

  it('reads both verticals bottom to top', () => {
    assert.deepEqual(readableAngle(90), { deg: -90, flipped: true });
    assert.deepEqual(readableAngle(-90), { deg: -90, flipped: false });
  });

  it('always lands in [-90, 90)', () => {
    for (let d = -720; d <= 720; d += 7) {
      const r = readableAngle(d);
      assert.ok(r.deg >= -90 && r.deg < 90, `${d} -> ${r.deg}`);
    }
  });

  it('shrugs off a bad number', () => {
    assert.deepEqual(readableAngle(Number.NaN), { deg: 0, flipped: false });
  });
});

describe('furniture finger pad', () => {
  it('pads a small piece toward a 44px finger and caps the pad', () => {
    assert.equal(furnitureFingerPad(6, 4, 24), 0);
    const night = furnitureFingerPad(1.5, 1.5, 24);
    assert.ok(night > 0.15 && night < 0.2);
    assert.equal(furnitureFingerPad(0.2, 0.2, 4), 0.75);
  });
});
