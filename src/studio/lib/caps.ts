import type { Floor } from '../types';

/** Classroom stamp caps — FeatureBot contract. Refuse before mutate. */
export const CAP = {
  rooms: 12,
  walls: 40,
  objects: 60,
} as const;

export type CapKind = keyof typeof CAP;

export function floorCounts(floor: Floor): Record<CapKind, number> {
  return {
    rooms: floor.rooms?.length ?? 0,
    walls: floor.walls?.length ?? 0,
    objects: (floor.furniture?.length ?? 0) + (floor.landscape?.length ?? 0),
  };
}

export function capReached(floor: Floor, kind: CapKind): boolean {
  return floorCounts(floor)[kind] >= CAP[kind];
}

export function remaining(floor: Floor, kind: CapKind): number {
  return Math.max(0, CAP[kind] - floorCounts(floor)[kind]);
}
