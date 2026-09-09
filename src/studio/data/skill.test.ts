import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  isToolUnlocked,
  nextCoach,
  toolsForLevel,
  skillRank,
  levelRequiredFor,
} from './skill';
import type { Floor, Node, Wall } from '../types';

function emptyFloor(): Floor {
  return {
    id: 'fl',
    name: 'F1',
    elevation: 0,
    nodes: [],
    walls: [],
    openings: [],
    furniture: [],
    rooms: [],
    dimensions: [],
    notes: [],
    landscape: [],
    roof: null,
    layers: {
      structure: true, openings: true, furniture: true, rooms: true,
      dims: true, landscape: false, roof: true,
    },
  };
}

function closedBox(): Floor {
  const nodes: Node[] = [
    { id: 'a', x: 0, y: 0 },
    { id: 'b', x: 12, y: 0 },
    { id: 'c', x: 12, y: 10 },
    { id: 'd', x: 0, y: 10 },
  ];
  const walls: Wall[] = [
    { id: 'w1', a: 'a', b: 'b', kind: 'exterior', thickness: 0.5 },
    { id: 'w2', a: 'b', b: 'c', kind: 'exterior', thickness: 0.5 },
    { id: 'w3', a: 'c', b: 'd', kind: 'exterior', thickness: 0.5 },
    { id: 'w4', a: 'd', b: 'a', kind: 'exterior', thickness: 0.5 },
  ];
  return { ...emptyFloor(), nodes, walls };
}

describe('skill levels', () => {
  it('unlocks tools in order', () => {
    assert.deepEqual(toolsForLevel('novice'), ['select', 'wall', 'door', 'pan']);
    assert.equal(isToolUnlocked('window', 'novice'), false);
    assert.ok(isToolUnlocked('window', 'beginner'));
    assert.equal(isToolUnlocked('furniture', 'beginner'), false);
    assert.ok(isToolUnlocked('furniture', 'moderate'));
    assert.ok(isToolUnlocked('dim', 'beginner'));
    assert.equal(isToolUnlocked('dim', 'novice'), false);
    assert.equal(isToolUnlocked('plant', 'beginner'), false);
    assert.ok(isToolUnlocked('plant', 'moderate'));
    assert.equal(skillRank('expert'), 3);
    assert.equal(levelRequiredFor('furniture'), 'moderate');
    assert.equal(levelRequiredFor('window'), 'beginner');
  });

  it('coaches novices on an empty plan and stays quiet for experts', () => {
    const f = emptyFloor();
    const novice = nextCoach('novice', f);
    assert.equal(novice?.id, 'wall');
    assert.equal(nextCoach('expert', f), null);
    const moderate = nextCoach('moderate', f);
    assert.equal(moderate?.id, 'wall');
  });

  it('walks beginner help from closed walls to door then window then room', () => {
    const f = closedBox();
    assert.equal(nextCoach('beginner', f)?.id, 'door');
    f.openings.push({
      id: 'd1', wallId: 'w1', t: 0.5, width: 3, type: 'door', symbolKind: 'swingDoor',
    });
    assert.equal(nextCoach('beginner', f)?.id, 'window');
    f.openings.push({
      id: 'win1', wallId: 'w3', t: 0.5, width: 3, type: 'window', symbolKind: 'windowFixed',
    });
    assert.equal(nextCoach('beginner', f)?.id, 'room');
    f.rooms.push({ id: 'r1', kind: 'living', name: 'Living', x: 6, y: 5 });
    assert.equal(nextCoach('beginner', f)?.id, 'done');
    assert.equal(nextCoach('novice', f)?.id, 'novice-done');
    assert.equal(nextCoach('moderate', f), null);
  });
});
