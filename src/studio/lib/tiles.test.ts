import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  TILE_FT,
  awakeTileKeys,
  extractChunk,
  mergeChunk,
  parseTileKey,
  tileCoord,
  tileKey,
  autosaveMode,
} from './tiles.ts';
import type { Floor } from '../types.ts';

function floor(): Floor {
  return {
    id: 'fl-1',
    name: '1',
    elevation: 0,
    nodes: [
      { id: 'a', x: 1, y: 1 },
      { id: 'b', x: 6, y: 1 },
    ],
    walls: [{ id: 'w1', a: 'a', b: 'b', kind: 'exterior', thickness: 0.5 }],
    openings: [{ id: 'o1', wallId: 'w1', t: 0.5, width: 3, type: 'door', symbolKind: 'swingDoor' }],
    furniture: [{ id: 'f1', catalogId: 'bed', x: 2, y: 2, w: 6, h: 4, rot: 0, zIndex: 1, label: 'Bed' }],
    rooms: [{ id: 'r1', kind: 'bedroom', name: 'Bedroom', x: 3, y: 3 }],
    dimensions: [],
    notes: [],
    landscape: [{ id: 'p1', kind: 'tree', x: 20, y: 20, w: 4, h: 4, rot: 0, label: 'Tree' }],
    sketches: [],
    roof: null,
    layers: {
      structure: true, openings: true, furniture: true, rooms: true,
      dims: true, landscape: true, sketch: true, roof: true,
    },
  };
}

describe('awake tiles', () => {
  it('uses 8 ft tiles and 1-ring neighbors', () => {
    assert.equal(TILE_FT, 8);
    assert.equal(tileCoord(0), 0);
    assert.equal(tileCoord(7.9), 0);
    assert.equal(tileCoord(8), 1);
    assert.equal(tileKey('fl-1', 2, 2), 'fl-1:0:0');
    const parsed = parseTileKey('fl-1:2:3');
    assert.deepEqual(parsed, { floorId: 'fl-1', cx: 2, cy: 3 });

    const keys = awakeTileKeys({
      floorId: 'fl-1',
      panX: 0,
      panY: 0,
      zoom: 1,
      w: 8,
      h: 8,
    });
    // world 0..8 includes the start of tile 1, then a 1-ring halo
    assert.ok(keys.length >= 9);
    assert.ok(keys.includes('fl-1:0:0'));
    assert.ok(keys.includes('fl-1:-1:-1'));
    assert.ok(keys.includes('fl-1:1:1'));
  });

  it('extracts only entities on that tile and merges by id', () => {
    const f = floor();
    const home = extractChunk(f, 'fl-1:0:0');
    assert.ok(home);
    assert.equal(home.furniture.length, 1);
    assert.equal(home.walls.length, 1);
    assert.equal(home.landscape.length, 0);

    const far = extractChunk(f, 'fl-1:2:2');
    assert.ok(far);
    assert.equal(far.furniture.length, 0);
    assert.equal(far.landscape.length, 1);

    const merged = mergeChunk(
      { ...f, furniture: [] },
      { ...home, furniture: [{ ...home.furniture[0], label: 'Moved bed' }] },
    );
    assert.equal(merged.furniture[0].label, 'Moved bed');
    assert.equal(merged.walls.length, 1);
  });
});

describe('autosave mode', () => {
  it('writes the whole plan when a dirty tile is off screen', () => {
    assert.equal(autosaveMode(0, 0, false), 'skip');
    assert.equal(autosaveMode(2, 2, false), 'chunks');
    assert.equal(autosaveMode(2, 0, false), 'full');
    assert.equal(autosaveMode(3, 1, false), 'full');
    assert.equal(autosaveMode(0, 0, true), 'full');
  });
});
