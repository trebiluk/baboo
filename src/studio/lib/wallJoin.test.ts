import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { Node, Wall } from '../types.ts';
import {
  insetPoly,
  pointInWallFoot,
  wallFootprint,
  wallSidesAt,
} from './wallJoin.ts';
import { listInteriorFaces } from './rooms.ts';

function rect(w: number, h: number, t = 0.5): { nodes: Node[]; walls: Wall[] } {
  const nodes: Node[] = [
    { id: 'a', x: 0, y: 0 },
    { id: 'b', x: w, y: 0 },
    { id: 'c', x: w, y: h },
    { id: 'd', x: 0, y: h },
  ];
  const walls: Wall[] = [
    { id: 'w1', a: 'a', b: 'b', kind: 'exterior', thickness: t },
    { id: 'w2', a: 'b', b: 'c', kind: 'exterior', thickness: t },
    { id: 'w3', a: 'c', b: 'd', kind: 'exterior', thickness: t },
    { id: 'w4', a: 'd', b: 'a', kind: 'exterior', thickness: t },
  ];
  return { nodes, walls };
}

describe('wallJoin', () => {
  it('miters a closed rectangle so the node is not inside two walls', () => {
    const { nodes, walls } = rect(12, 10);
    const feet = walls.map((w) => wallFootprint(w, nodes, walls));
    assert.ok(feet.every(Boolean));
    const hw = 0.25;
    const nearInner = { x: hw + 0.05, y: hw + 0.05 };
    const onCenter = { x: 6, y: 0 };
    const alongVert = { x: 0, y: 5 };
    const alongBottom = { x: 0.15, y: 0 };
    const alongLeft = { x: 0, y: 0.15 };

    const hits = (p: { x: number; y: number }) =>
      feet.filter((f) => f && pointInWallFoot(p, f)).length;

    assert.equal(hits(onCenter), 1, 'mid of a wall is one footprint');
    assert.equal(hits(alongVert), 1, 'mid of the side wall is one footprint');
    assert.equal(hits(alongBottom), 1, 'near-corner on the bottom wall is one footprint');
    assert.equal(hits(alongLeft), 1, 'near-corner on the side wall is one footprint');
    assert.equal(hits(nearInner), 0, 'room interior is not inside a wall');

  });

  it('inner miter sits at half-thickness on a 90° corner', () => {
    const { nodes, walls } = rect(12, 10);
    const foot = wallFootprint(walls[0], nodes, walls)!;
    const a0 = wallSidesAt(foot, 0);
    const left = a0.left;
    assert.ok(Math.abs(left.x - 0.25) < 0.04, `inner x ${left.x}`);
    assert.ok(Math.abs(left.y - 0.25) < 0.04, `inner y ${left.y}`);
    const right = a0.right;
    assert.ok(Math.abs(right.x + 0.25) < 0.04, `outer x ${right.x}`);
    assert.ok(Math.abs(right.y + 0.25) < 0.04, `outer y ${right.y}`);
  });

  it('T-stem stops at the through wall face', () => {
    const { nodes, walls } = rect(20, 10);
    nodes.push({ id: 'm0', x: 8, y: 0 }, { id: 'm1', x: 8, y: 10 });
    walls[0] = { id: 'w1a', a: 'a', b: 'm0', kind: 'exterior', thickness: 0.5 };
    walls.push({ id: 'w1b', a: 'm0', b: 'b', kind: 'exterior', thickness: 0.5 });
    walls[2] = { id: 'w3a', a: 'c', b: 'm1', kind: 'exterior', thickness: 0.5 };
    walls.push({ id: 'w3b', a: 'm1', b: 'd', kind: 'exterior', thickness: 0.5 });
    walls.push({ id: 'hall', a: 'm0', b: 'm1', kind: 'interior', thickness: 0.35 });
    const stem = walls.find((w) => w.id === 'hall')!;
    const foot = wallFootprint(stem, nodes, walls)!;
    const start = wallSidesAt(foot, 0);
    const mid = { x: (start.left.x + start.right.x) / 2, y: (start.left.y + start.right.y) / 2 };
    assert.ok(mid.y > 0.2, `stem starts inside, y=${mid.y}`);
    assert.ok(mid.y < 0.4, `stem not past the through face, y=${mid.y}`);
  });

  it('insets a room so the floor sits inside the walls', () => {
    const { nodes, walls } = rect(12, 10);
    const faces = listInteriorFaces(nodes, walls);
    assert.equal(faces.length, 1);
    const inset = insetPoly(faces[0].poly, 0.25);
    assert.equal(inset.length, 4);
    const xs = inset.map((p) => p.x);
    const ys = inset.map((p) => p.y);
    assert.ok(Math.min(...xs) > 0.2 && Math.max(...xs) < 11.8);
    assert.ok(Math.min(...ys) > 0.2 && Math.max(...ys) < 9.8);
  });

  it('free wall still has a square butt', () => {
    const nodes: Node[] = [
      { id: 'a', x: 0, y: 0 },
      { id: 'b', x: 10, y: 0 },
    ];
    const walls: Wall[] = [{ id: 'w', a: 'a', b: 'b', kind: 'exterior', thickness: 0.5 }];
    const foot = wallFootprint(walls[0], nodes, walls)!;
    const a0 = wallSidesAt(foot, 0);
    assert.ok(Math.abs(a0.left.x) < 0.01);
    assert.ok(Math.abs(a0.left.y - 0.25) < 0.01);
    assert.ok(Math.abs(a0.right.y + 0.25) < 0.01);
  });
});
