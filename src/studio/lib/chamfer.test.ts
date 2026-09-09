import assert from 'node:assert/strict';
import test from 'node:test';
import type { Node, Wall } from '../types.ts';
import { chamferCorner, isChamferable } from './chamfer.ts';
import { polarSnapPoint, snapWallEnd } from './geometry.ts';
import { findEnclosedFace, listInteriorFaces, polygonArea } from './rooms.ts';

function rect(w: number, h: number): { nodes: Node[]; walls: Wall[] } {
  const nodes: Node[] = [
    { id: 'a', x: 0, y: 0 },
    { id: 'b', x: w, y: 0 },
    { id: 'c', x: w, y: h },
    { id: 'd', x: 0, y: h },
  ];
  const walls: Wall[] = [
    { id: 'w1', a: 'a', b: 'b', kind: 'exterior', thickness: 0.5 },
    { id: 'w2', a: 'b', b: 'c', kind: 'exterior', thickness: 0.5 },
    { id: 'w3', a: 'c', b: 'd', kind: 'exterior', thickness: 0.5 },
    { id: 'w4', a: 'd', b: 'a', kind: 'exterior', thickness: 0.5 },
  ];
  return { nodes, walls };
}

test('45° polar snap lands on grid', () => {
  const p = polarSnapPoint({ x: 0, y: 0 }, { x: 5, y: 4.6 }, 1, true);
  assert.equal(p.x, 5);
  assert.equal(p.y, 5);
});

test('shift-style 90° snap stays axis-aligned', () => {
  const p = snapWallEnd({ x: 0, y: 0 }, { x: 8, y: 3 }, { ortho: true, forceOrtho: true, snap: true, gridSize: 1 });
  assert.equal(p.y, 0);
  assert.equal(p.x, 8);
});

test('chamfered rectangle is still one room', () => {
  const { nodes, walls } = rect(12, 10);
  assert.equal(isChamferable(nodes, walls, 'b'), true);
  const cut = chamferCorner(nodes, walls, [], 'b', 2);
  assert.ok(cut);
  const faces = listInteriorFaces(cut!.nodes, cut!.walls);
  assert.equal(faces.length, 1);
  // 12×10 minus a 2×2 right triangle (2 sq ft)
  assert.equal(Math.round(faces[0].area), 118);
  const poly = findEnclosedFace(cut!.nodes, cut!.walls, { x: 6, y: 5 });
  assert.ok(poly);
  assert.equal(poly!.length, 5);
  assert.equal(Math.round(polygonArea(poly!)), 118);
  // click near the clipped corner still inside
  assert.ok(findEnclosedFace(cut!.nodes, cut!.walls, { x: 10.2, y: 1.5 }));
});

test('two opposite chamfers stay one room', () => {
  let { nodes, walls } = rect(12, 10);
  const c1 = chamferCorner(nodes, walls, [], 'a', 2)!;
  const c2 = chamferCorner(c1.nodes, c1.walls, [], 'c', 2)!;
  nodes = c2.nodes;
  walls = c2.walls;
  const faces = listInteriorFaces(nodes, walls);
  assert.equal(faces.length, 1);
  assert.equal(Math.round(faces[0].area), 116);
});
