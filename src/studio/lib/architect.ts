import type { Floor, FurnitureItem, Point, StyleId } from '../types';
import { formatLength } from './geometry';
import { listInteriorFaces, polygonArea, roomPolygon } from './rooms';
import { exteriorBounds } from './roof';

/** Classroom room sizes — not a code book. Big enough to live in, small enough to draw. */
export const ROOM_SCALE: Record<string, { min: number; nice: number; label: string }> = {
  bedroom: { min: 70, nice: 100, label: 'Bedroom' },
  bath: { min: 30, nice: 40, label: 'Bath' },
  kitchen: { min: 50, nice: 80, label: 'Kitchen' },
  living: { min: 100, nice: 140, label: 'Living' },
  dining: { min: 60, nice: 80, label: 'Dining' },
  entry: { min: 12, nice: 20, label: 'Entry' },
};

/** NKBA work-triangle, simplified for grades 5–8. */
export const TRIANGLE = {
  legMin: 4,
  legMax: 9,
  sumMin: 13,
  sumMax: 26,
} as const;

export type ArchStatus = 'pass' | 'warn' | 'fail' | 'skip';

export type ArchHit = {
  kind: 'opening' | 'room' | 'furniture' | 'wall' | 'dim';
  id: string;
};

export type ArchCheck = {
  id: string;
  title: string;
  status: ArchStatus;
  detail: string;
  tip: string;
  hit?: ArchHit;
};

export type ArchReport = {
  checks: ArchCheck[];
  pass: number;
  warn: number;
  fail: number;
  skip: number;
};

export type KitchenTriangle = {
  sink: Point;
  stove: Point;
  fridge: Point;
  legs: [number, number, number];
  sum: number;
};

function tally(checks: ArchCheck[]): Pick<ArchReport, 'pass' | 'warn' | 'fail' | 'skip'> {
  let pass = 0, warn = 0, fail = 0, skip = 0;
  for (const c of checks) {
    if (c.status === 'pass') pass += 1;
    else if (c.status === 'warn') warn += 1;
    else if (c.status === 'fail') fail += 1;
    else skip += 1;
  }
  return { pass, warn, fail, skip };
}

export function kitchenStations(furniture: FurnitureItem[]): {
  sink: FurnitureItem | null;
  stove: FurnitureItem | null;
  fridge: FurnitureItem | null;
} {
  const list = furniture ?? [];
  return {
    sink: list.find((f) => f.catalogId === 'sink') ?? null,
    stove: list.find((f) => f.catalogId === 'stove') ?? null,
    fridge: list.find((f) => f.catalogId === 'fridge') ?? null,
  };
}

export function kitchenTriangle(furniture: FurnitureItem[]): KitchenTriangle | null {
  const { sink, stove, fridge } = kitchenStations(furniture);
  if (!sink || !stove || !fridge) return null;
  const a = dist(sink, stove);
  const b = dist(stove, fridge);
  const c = dist(fridge, sink);
  return {
    sink: { x: sink.x, y: sink.y },
    stove: { x: stove.x, y: stove.y },
    fridge: { x: fridge.x, y: fridge.y },
    legs: [a, b, c],
    sum: a + b + c,
  };
}

function dist(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function runArchitectCheck(
  floor: Floor,
  units: 'ft' | 'm' = 'ft',
  styleId: StyleId | string = 'blank',
): ArchReport {
  const checks: ArchCheck[] = [];
  if (!floor) return { checks, pass: 0, warn: 0, fail: 0, skip: 0 };

  const dog = styleId === 'dog-house';
  const walls = floor.walls ?? [];
  const nodes = floor.nodes ?? [];
  const openings = floor.openings ?? [];
  const rooms = floor.rooms ?? [];
  const furniture = floor.furniture ?? [];
  const dims = floor.dimensions ?? [];
  const len = (n: number) => formatLength(n, units);
  const faces = listInteriorFaces(nodes, walls);
  const envelope = exteriorBounds(nodes, walls);
  const doors = openings.filter((o) => o.type === 'door');
  const windows = openings.filter((o) => o.type === 'window');
  const exteriorIds = new Set(walls.filter((w) => w.kind === 'exterior').map((w) => w.id));

  if (walls.length === 0) {
    checks.push({
      id: 'envelope',
      title: 'A closed envelope',
      status: 'fail',
      detail: 'No walls yet. An envelope is the outside that keeps weather out.',
      tip: 'Sketch a box, then Trace — or Wall, two clicks at a time, until it meets.',
    });
  } else if (faces.length === 0) {
    checks.push({
      id: 'envelope',
      title: 'A closed envelope',
      status: 'fail',
      detail: 'Walls do not close a room yet. Rain would walk in at the gaps.',
      tip: 'Meet every corner. The last click should land on the first.',
    });
  } else {
    const area = faces.reduce((s, f) => s + f.area, 0);
    checks.push({
      id: 'envelope',
      title: 'A closed envelope',
      status: 'pass',
      detail: envelope
        ? `Outside is about ${len(envelope.w)} × ${len(envelope.h)} · ${Math.round(area)} sq ft inside.`
        : `Closed. About ${Math.round(area)} sq ft inside.`,
      tip: 'That outside box is the envelope. Interior walls split it into rooms.',
    });
  }

  const exteriorDoors = doors.filter((d) => !d.wallId || exteriorIds.size === 0 || exteriorIds.has(d.wallId));
  if (doors.length === 0) {
    checks.push({
      id: 'entry',
      title: 'A way in',
      status: 'fail',
      detail: 'No door. A plan needs an entry from outside.',
      tip: 'Door tool → click an outside wall. That is the front door until you say otherwise.',
    });
  } else if (exteriorIds.size && exteriorDoors.length === 0) {
    checks.push({
      id: 'entry',
      title: 'A way in',
      status: 'warn',
      detail: 'Doors sit on interior walls only. Guests still need a door from outside.',
      tip: 'Put one door on an exterior wall. That is the entry.',
      hit: { kind: 'opening', id: doors[0].id },
    });
  } else {
    checks.push({
      id: 'entry',
      title: 'A way in',
      status: 'pass',
      detail: `${exteriorDoors.length || doors.length} exterior door${(exteriorDoors.length || doors.length) === 1 ? '' : 's'}.`,
      tip: 'Keep a clear path from that door to the rooms people use first.',
      hit: { kind: 'opening', id: (exteriorDoors[0] ?? doors[0]).id },
    });
  }

  if (dog) {
    checks.push({
      id: 'daylight',
      title: 'Daylight',
      status: 'skip',
      detail: 'A den is a shelter, not a people house — skip the window check.',
      tip: 'Baboo judges this one in Contest.',
    });
  } else if (windows.length === 0) {
    checks.push({
      id: 'daylight',
      title: 'Daylight',
      status: 'fail',
      detail: 'No windows. Rooms need a way for sun and air.',
      tip: 'Window tool → click a wall, usually across from the door.',
    });
  } else {
    const doorWalls = new Set(doors.map((d) => d.wallId));
    const cross = windows.some((w) => !doorWalls.has(w.wallId));
    checks.push({
      id: 'daylight',
      title: 'Daylight',
      status: cross ? 'pass' : 'warn',
      detail: cross
        ? `${windows.length} window${windows.length === 1 ? '' : 's'} — at least one sits on a different wall than the door.`
        : `${windows.length} window${windows.length === 1 ? '' : 's'}, all on the same wall as a door. Air wants a path through.`,
      tip: 'A window across from a door is the simple cross-breeze.',
      hit: { kind: 'opening', id: windows[0].id },
    });
  }

  if (dog) {
    checks.push({
      id: 'named',
      title: 'Named rooms',
      status: 'skip',
      detail: 'A dog house is one den. No kitchen, no bath.',
      tip: 'Keep it one room. Name is Den.',
    });
  } else if (rooms.length === 0) {
    checks.push({
      id: 'named',
      title: 'Named rooms',
      status: faces.length ? 'warn' : 'skip',
      detail: faces.length
        ? 'Spaces are closed but not named. A plan without names is hard to read.'
        : 'Close walls first, then name the rooms.',
      tip: 'Room tool → Kitchen, Bath, Living… → click inside.',
    });
  } else {
    checks.push({
      id: 'named',
      title: 'Named rooms',
      status: 'pass',
      detail: `${rooms.length} named space${rooms.length === 1 ? '' : 's'}.`,
      tip: 'Every closed space people use should have a name and an area.',
      hit: { kind: 'room', id: rooms[0].id },
    });
  }

  if (dog) {
    checks.push({
      id: 'scale',
      title: 'Room scale',
      status: 'skip',
      detail: 'Den size is a Contest check (about 8–18 sq ft), not a people bedroom.',
      tip: 'Open Contest — Baboo has the textbook list.',
    });
  } else if (rooms.length === 0) {
    checks.push({
      id: 'scale',
      title: 'Room scale',
      status: 'skip',
      detail: 'Name rooms and we’ll ask if they feel like real sizes.',
      tip: 'A bedroom wants about 10×10. A bath can be 5×8.',
    });
  } else {
    let worst: ArchCheck | null = null;
    for (const room of rooms) {
      const rule = ROOM_SCALE[room.kind];
      if (!rule) continue;
      const poly = roomPolygon(room, nodes, walls);
      if (!poly) {
        worst = {
          id: 'scale',
          title: 'Room scale',
          status: 'warn',
          detail: `${room.name} is tagged but the walls are not a closed shape.`,
          tip: 'Finish the walls around it, then read the square-foot label.',
          hit: { kind: 'room', id: room.id },
        };
        break;
      }
      const area = polygonArea(poly);
      if (area + 1e-6 < rule.min) {
        worst = {
          id: 'scale',
          title: 'Room scale',
          status: 'fail',
          detail: `${room.name} is ${Math.round(area)} sq ft. A ${rule.label.toLowerCase()} wants about ${rule.min}+ (${rule.nice} feels better).`,
          tip: 'Nudge a wall. Size should match how the room is used.',
          hit: { kind: 'room', id: room.id },
        };
        break;
      }
      if (area + 1e-6 < rule.nice && (!worst || worst.status === 'pass')) {
        worst = {
          id: 'scale',
          title: 'Room scale',
          status: 'warn',
          detail: `${room.name} is ${Math.round(area)} sq ft — tight. ${rule.nice} sq ft feels more like a real ${rule.label.toLowerCase()}.`,
          tip: 'A little extra room is easier to furnish.',
          hit: { kind: 'room', id: room.id },
        };
      }
    }
    checks.push(worst ?? {
      id: 'scale',
      title: 'Room scale',
      status: 'pass',
      detail: 'Named rooms are in a size people can live in.',
      tip: 'Read the square-foot label. Does it match the furniture you put in?',
      hit: rooms[0] ? { kind: 'room', id: rooms[0].id } : undefined,
    });
  }

  if (!envelope) {
    checks.push({
      id: 'overall',
      title: 'Overall size',
      status: 'skip',
      detail: 'Need an outside box before we can label overall width and depth.',
      tip: 'Size tool → two clicks. The sheet also draws overall ticks once walls close.',
    });
  } else if (dims.length === 0) {
    checks.push({
      id: 'overall',
      title: 'Overall size',
      status: 'warn',
      detail: `Envelope is ${len(envelope.w)} × ${len(envelope.h)}. Put at least one size label so someone else can read it.`,
      tip: 'Size tool → click two ends of a wall. Overall ticks on the sheet are the architect’s outside numbers.',
    });
  } else {
    checks.push({
      id: 'overall',
      title: 'Overall size',
      status: 'pass',
      detail: `Envelope ${len(envelope.w)} × ${len(envelope.h)} · ${dims.length} size label${dims.length === 1 ? '' : 's'} on the sheet.`,
      tip: 'Outside numbers are overall. Inside numbers are rooms.',
      hit: { kind: 'dim', id: dims[0].id },
    });
  }

  if (dog) {
    checks.push({
      id: 'triangle',
      title: 'Kitchen work triangle',
      status: 'skip',
      detail: 'No kitchen in a den.',
      tip: 'People houses: sink, stove, fridge — keep the three walks short.',
    });
  } else {
    const stations = kitchenStations(furniture);
    const have = [stations.sink, stations.stove, stations.fridge].filter(Boolean).length;
    const tri = kitchenTriangle(furniture);
    if (have === 0) {
      checks.push({
        id: 'triangle',
        title: 'Kitchen work triangle',
        status: 'skip',
        detail: 'No sink, stove, or fridge yet.',
        tip: 'Furniture → kitchen pieces. The three walks between them are the work triangle.',
      });
    } else if (!tri) {
      const missing = [
        !stations.sink ? 'sink' : null,
        !stations.stove ? 'stove' : null,
        !stations.fridge ? 'fridge' : null,
      ].filter(Boolean).join(', ');
      checks.push({
        id: 'triangle',
        title: 'Kitchen work triangle',
        status: 'warn',
        detail: `Kitchen is missing ${missing}. Need all three to measure the triangle.`,
        tip: 'Sink, stove, fridge. Not in a line if you can help it.',
        hit: { kind: 'furniture', id: (stations.sink ?? stations.stove ?? stations.fridge)!.id },
      });
    } else {
      const long = tri.legs.some((l) => l > TRIANGLE.legMax + 1e-6);
      const short = tri.legs.some((l) => l + 1e-6 < TRIANGLE.legMin);
      const fat = tri.sum > TRIANGLE.sumMax + 1e-6;
      const skinny = tri.sum + 1e-6 < TRIANGLE.sumMin;
      const ok = !long && !short && !fat && !skinny;
      checks.push({
        id: 'triangle',
        title: 'Kitchen work triangle',
        status: ok ? 'pass' : fat || long ? 'fail' : 'warn',
        detail: ok
          ? `Walks ${len(tri.legs[0])}, ${len(tri.legs[1])}, ${len(tri.legs[2])} · total ${len(tri.sum)}.`
          : `Walks ${len(tri.legs[0])}, ${len(tri.legs[1])}, ${len(tri.legs[2])} · total ${len(tri.sum)}. Want each 4–9 ft, total about 13–26 ft.`,
        tip: 'Keep the cook’s three steps short. A dining table in the middle stretches them.',
        hit: { kind: 'furniture', id: stations.sink!.id },
      });
    }
  }

  return { checks, ...tally(checks) };
}
