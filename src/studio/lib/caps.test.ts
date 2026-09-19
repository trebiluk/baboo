import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CAP, capReached, floorCounts, remaining } from './caps.ts';
import type { Floor } from '../types.ts';

function floor(partial: Partial<Floor> = {}): Floor {
  return {
    id: 'fl-1',
    name: '1',
    elevation: 0,
    nodes: [],
    walls: [],
    openings: [],
    furniture: [],
    rooms: [],
    dimensions: [],
    notes: [],
    landscape: [],
    sketches: [],
    roof: null,
    layers: {
      structure: true, openings: true, furniture: true, rooms: true,
      dims: true, landscape: false, sketch: true, roof: true,
    },
    ...partial,
  };
}

describe('stamp caps', () => {
  it('uses classroom limits 12 / 40 / 60', () => {
    assert.equal(CAP.rooms, 12);
    assert.equal(CAP.walls, 40);
    assert.equal(CAP.objects, 60);
  });

  it('objects count furniture plus plants', () => {
    const f = floor({
      furniture: Array.from({ length: 10 }, (_, i) => ({
        id: `f${i}`, catalogId: 'chair', x: 0, y: 0, w: 2, h: 2, rot: 0, zIndex: 1, label: 'c',
      })),
      landscape: Array.from({ length: 5 }, (_, i) => ({
        id: `p${i}`, kind: 'tree' as const, x: 0, y: 0, w: 2, h: 2, rot: 0, label: 't',
      })),
    });
    assert.equal(floorCounts(f).objects, 15);
    assert.equal(remaining(f, 'objects'), 45);
    assert.equal(capReached(f, 'objects'), false);
  });

  it('refuses when a stamp would exceed', () => {
    const walls = Array.from({ length: 40 }, (_, i) => ({
      id: `w${i}`, a: 'n1', b: 'n2', kind: 'exterior' as const, thickness: 0.5,
    }));
    const f = floor({ walls });
    assert.equal(capReached(f, 'walls'), true);
    assert.equal(remaining(f, 'walls'), 0);
  });
});
