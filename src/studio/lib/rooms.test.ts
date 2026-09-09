import assert from 'node:assert/strict';
import test from 'node:test';
import type { Node, Wall } from '../types.ts';
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

test('closed rectangle is one room', () => {
  const { nodes, walls } = rect(12, 10);
  const faces = listInteriorFaces(nodes, walls);
  assert.equal(faces.length, 1);
  assert.equal(Math.round(faces[0].area), 120);
  const poly = findEnclosedFace(nodes, walls, { x: 6, y: 5 });
  assert.ok(poly);
  assert.equal(Math.round(polygonArea(poly!)), 120);
});

test('click outside returns null', () => {
  const { nodes, walls } = rect(12, 10);
  assert.equal(findEnclosedFace(nodes, walls, { x: 20, y: 20 }), null);
});

test('interior wall splits two rooms', () => {
  const { nodes, walls } = rect(20, 10);
  nodes.push({ id: 'm0', x: 8, y: 0 }, { id: 'm1', x: 8, y: 10 });
  // split the top and bottom walls at the new nodes
  walls[0] = { id: 'w1a', a: 'a', b: 'm0', kind: 'exterior', thickness: 0.5 };
  walls.push({ id: 'w1b', a: 'm0', b: 'b', kind: 'exterior', thickness: 0.5 });
  walls[2] = { id: 'w3a', a: 'c', b: 'm1', kind: 'exterior', thickness: 0.5 };
  walls.push({ id: 'w3b', a: 'm1', b: 'd', kind: 'exterior', thickness: 0.5 });
  walls.push({ id: 'hall', a: 'm0', b: 'm1', kind: 'interior', thickness: 0.35 });
  const faces = listInteriorFaces(nodes, walls);
  assert.equal(faces.length, 2);
  const left = findEnclosedFace(nodes, walls, { x: 4, y: 5 });
  const right = findEnclosedFace(nodes, walls, { x: 14, y: 5 });
  assert.ok(left && right);
  assert.equal(Math.round(polygonArea(left!)), 80);
  assert.equal(Math.round(polygonArea(right!)), 120);
});

test('hexagon with two 45° corners is one room', () => {
  const nodes: Node[] = [
    { id: 'a', x: 2, y: 0 },
    { id: 'b', x: 10, y: 0 },
    { id: 'c', x: 12, y: 2 },
    { id: 'd', x: 12, y: 10 },
    { id: 'e', x: 0, y: 10 },
    { id: 'f', x: 0, y: 2 },
  ];
  const walls: Wall[] = [
    { id: 'w1', a: 'a', b: 'b', kind: 'exterior', thickness: 0.5 },
    { id: 'w2', a: 'b', b: 'c', kind: 'exterior', thickness: 0.5 },
    { id: 'w3', a: 'c', b: 'd', kind: 'exterior', thickness: 0.5 },
    { id: 'w4', a: 'd', b: 'e', kind: 'exterior', thickness: 0.5 },
    { id: 'w5', a: 'e', b: 'f', kind: 'exterior', thickness: 0.5 },
    { id: 'w6', a: 'f', b: 'a', kind: 'exterior', thickness: 0.5 },
  ];
  const faces = listInteriorFaces(nodes, walls);
  assert.equal(faces.length, 1);
  const poly = findEnclosedFace(nodes, walls, { x: 6, y: 5 });
  assert.ok(poly);
  assert.equal(poly!.length, 6);
});
