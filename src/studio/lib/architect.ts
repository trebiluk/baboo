import type { Floor, FurnitureItem, Point, StyleId } from '../types';
import { formatLength } from './geometry';
import { listInteriorFaces, polygonArea, roomPolygon } from './rooms';
import { exteriorBounds } from './roof';
import { t, type Locale } from '../data/i18n';
import { roomLabel } from '../data/rooms';
import { furnLabel } from '../data/furniture';

/** Classroom room sizes — not a code book. Big enough to live in, small enough to draw. */
export const ROOM_SCALE: Record<string, { min: number; nice: number; label: string }> = {
  bedroom: { min: 70, nice: 100, label: 'Bedroom' },
  bath: { min: 30, nice: 40, label: 'Bath' },
  kitchen: { min: 50, nice: 80, label: 'Kitchen' },
  living: { min: 100, nice: 140, label: 'Living' },
  dining: { min: 60, nice: 80, label: 'Dining' },
  entry: { min: 12, nice: 20, label: 'Entry' },
};

/** 2025 Residential Code of New York State: habitable rooms (2.13.59). Kitchens are exempt. */
export const NY_ROOM_SQFT = 70;
export const NY_ROOM_MIN_FT = 7;
export const NY_HABITABLE = new Set<string>(['bedroom', 'living', 'dining', 'office']);

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
  locale: Locale = 'en',
): ArchReport {
  // 2.13.52: every sentence comes from i18n.ts, in the student's language.
  const tr = (key: string, vars?: Record<string, string>) => t(locale, key, vars);
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
      title: tr('arch.env.title'),
      status: 'fail',
      detail: tr('arch.env.none'),
      tip: tr('arch.env.noneTip'),
    });
  } else if (faces.length === 0) {
    checks.push({
      id: 'envelope',
      title: tr('arch.env.title'),
      status: 'fail',
      detail: tr('arch.env.open'),
      tip: tr('arch.env.openTip'),
    });
  } else {
    const area = faces.reduce((s, f) => s + f.area, 0);
    checks.push({
      id: 'envelope',
      title: tr('arch.env.title'),
      status: 'pass',
      detail: envelope
        ? tr('arch.env.pass', { w: len(envelope.w), h: len(envelope.h), a: String(Math.round(area)) })
        : tr('arch.env.pass2', { a: String(Math.round(area)) }),
      tip: tr('arch.env.passTip'),
    });
  }

  const exteriorDoors = doors.filter((d) => !d.wallId || exteriorIds.size === 0 || exteriorIds.has(d.wallId));
  if (doors.length === 0) {
    checks.push({
      id: 'entry',
      title: tr('acc.entry.title'),
      status: 'fail',
      detail: tr('arch.entry.none'),
      tip: tr('arch.entry.noneTip'),
    });
  } else if (exteriorIds.size && exteriorDoors.length === 0) {
    checks.push({
      id: 'entry',
      title: tr('acc.entry.title'),
      status: 'warn',
      detail: tr('arch.entry.inside'),
      tip: tr('arch.entry.insideTip'),
      hit: { kind: 'opening', id: doors[0].id },
    });
  } else {
    checks.push({
      id: 'entry',
      title: tr('acc.entry.title'),
      status: 'pass',
      detail: (exteriorDoors.length || doors.length) === 1 ? tr('arch.entry.one') : tr('arch.entry.many', { n: String(exteriorDoors.length || doors.length) }),
      tip: tr('arch.entry.passTip'),
      hit: { kind: 'opening', id: (exteriorDoors[0] ?? doors[0]).id },
    });
  }

  if (dog) {
    checks.push({
      id: 'daylight',
      title: tr('arch.day.title'),
      status: 'skip',
      detail: tr('arch.day.dog'),
      tip: tr('arch.day.dogTip'),
    });
  } else if (windows.length === 0) {
    checks.push({
      id: 'daylight',
      title: tr('arch.day.title'),
      status: 'fail',
      detail: tr('arch.day.none'),
      tip: tr('arch.day.noneTip'),
    });
  } else {
    const doorWalls = new Set(doors.map((d) => d.wallId));
    const cross = windows.some((w) => !doorWalls.has(w.wallId));
    checks.push({
      id: 'daylight',
      title: tr('arch.day.title'),
      status: cross ? 'pass' : 'warn',
      detail: cross
        ? windows.length === 1 ? tr('arch.day.cross1') : tr('arch.day.cross', { n: String(windows.length) })
        : windows.length === 1 ? tr('arch.day.same1') : tr('arch.day.same', { n: String(windows.length) }),
      tip: tr('arch.day.tip'),
      hit: { kind: 'opening', id: windows[0].id },
    });
  }

  if (dog) {
    checks.push({
      id: 'named',
      title: tr('arch.named.title'),
      status: 'skip',
      detail: tr('arch.named.dog'),
      tip: tr('arch.named.dogTip'),
    });
  } else if (rooms.length === 0) {
    checks.push({
      id: 'named',
      title: tr('arch.named.title'),
      status: faces.length ? 'warn' : 'skip',
      detail: faces.length ? tr('arch.named.unnamed') : tr('arch.named.first'),
      tip: tr('arch.named.howTip'),
    });
  } else {
    checks.push({
      id: 'named',
      title: tr('arch.named.title'),
      status: 'pass',
      detail: rooms.length === 1 ? tr('arch.named.one') : tr('arch.named.many', { n: String(rooms.length) }),
      tip: tr('arch.named.passTip'),
      hit: { kind: 'room', id: rooms[0].id },
    });
  }

  if (dog) {
    checks.push({
      id: 'scale',
      title: tr('arch.scale.title'),
      status: 'skip',
      detail: tr('arch.scale.dog'),
      tip: tr('arch.scale.dogTip'),
    });
  } else if (rooms.length === 0) {
    checks.push({
      id: 'scale',
      title: tr('arch.scale.title'),
      status: 'skip',
      detail: tr('arch.scale.skip'),
      tip: tr('arch.ny.skipTip'),
    });
  } else {
    // 2.13.59: 2025 Residential Code of New York State — rooms people live in (bedroom, living, dining, office)
    // need at least 70 sq ft and 7 ft in every direction. Kitchens, baths, halls and storage are not counted.
    let worst: ArchCheck | null = null;
    for (const room of rooms) {
      if (!NY_HABITABLE.has(room.kind)) continue;
      const rule = ROOM_SCALE[room.kind];
      const poly = roomPolygon(room, nodes, walls);
      if (!poly) {
        worst = {
          id: 'scale',
          title: tr('arch.scale.title'),
          status: 'warn',
          detail: tr('arch.scale.open', { room: roomLabel(locale, room) }),
          tip: tr('arch.scale.openTip'),
          hit: { kind: 'room', id: room.id },
        };
        break;
      }
      const area = polygonArea(poly);
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (const p of poly) { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y); }
      const across = Math.min(maxX - minX, maxY - minY);
      if (area + 1e-6 < NY_ROOM_SQFT) {
        worst = {
          id: 'scale',
          title: tr('arch.scale.title'),
          status: 'fail',
          detail: tr('arch.ny.small', { room: roomLabel(locale, room), a: String(Math.round(area)) }),
          tip: tr('arch.scale.failTip'),
          hit: { kind: 'room', id: room.id },
        };
        break;
      }
      if (across + 1e-6 < NY_ROOM_MIN_FT) {
        worst = {
          id: 'scale',
          title: tr('arch.scale.title'),
          status: 'fail',
          detail: tr('arch.ny.narrow', { room: roomLabel(locale, room), w: len(across) }),
          tip: tr('arch.scale.failTip'),
          hit: { kind: 'room', id: room.id },
        };
        break;
      }
      if (rule && area + 1e-6 < rule.nice && (!worst || worst.status === 'pass')) {
        worst = {
          id: 'scale',
          title: tr('arch.scale.title'),
          status: 'warn',
          detail: tr('arch.scale.warn', { room: roomLabel(locale, room), a: String(Math.round(area)), nice: String(rule.nice) }),
          tip: tr('arch.scale.warnTip'),
          hit: { kind: 'room', id: room.id },
        };
      }
    }
    checks.push(worst ?? {
      id: 'scale',
      title: tr('arch.scale.title'),
      status: 'pass',
      detail: tr('arch.ny.pass'),
      tip: tr('arch.scale.passTip'),
      hit: rooms[0] ? { kind: 'room', id: rooms[0].id } : undefined,
    });
  }

  if (!envelope) {
    checks.push({
      id: 'overall',
      title: tr('arch.overall.title'),
      status: 'skip',
      detail: tr('arch.overall.skip'),
      tip: tr('arch.overall.skipTip'),
    });
  } else if (dims.length === 0) {
    checks.push({
      id: 'overall',
      title: tr('arch.overall.title'),
      status: 'warn',
      detail: tr('arch.overall.warn', { w: len(envelope.w), h: len(envelope.h) }),
      tip: tr('arch.overall.warnTip'),
    });
  } else {
    checks.push({
      id: 'overall',
      title: tr('arch.overall.title'),
      status: 'pass',
      detail: dims.length === 1
        ? tr('arch.overall.pass1', { w: len(envelope.w), h: len(envelope.h) })
        : tr('arch.overall.pass', { w: len(envelope.w), h: len(envelope.h), n: String(dims.length) }),
      tip: tr('arch.overall.passTip'),
      hit: { kind: 'dim', id: dims[0].id },
    });
  }

  if (dog) {
    checks.push({
      id: 'triangle',
      title: tr('arch.tri.title'),
      status: 'skip',
      detail: tr('arch.tri.dog'),
      tip: tr('arch.tri.dogTip'),
    });
  } else {
    const stations = kitchenStations(furniture);
    const have = [stations.sink, stations.stove, stations.fridge].filter(Boolean).length;
    const tri = kitchenTriangle(furniture);
    if (have === 0) {
      checks.push({
        id: 'triangle',
        title: tr('arch.tri.title'),
        status: 'skip',
        detail: tr('arch.tri.none'),
        tip: tr('arch.tri.noneTip'),
      });
    } else if (!tri) {
      const missing = [
        !stations.sink ? 'sink' : null,
        !stations.stove ? 'stove' : null,
        !stations.fridge ? 'fridge' : null,
      ].filter((x): x is string => !!x).map((id) => furnLabel(locale, id, '')).join(', ');
      checks.push({
        id: 'triangle',
        title: tr('arch.tri.title'),
        status: 'warn',
        detail: tr('arch.tri.missing', { list: missing }),
        tip: tr('arch.tri.missingTip'),
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
        title: tr('arch.tri.title'),
        status: ok ? 'pass' : fat || long ? 'fail' : 'warn',
        detail: tr(ok ? 'arch.tri.ok' : 'arch.tri.bad', { a: len(tri.legs[0]), b: len(tri.legs[1]), c: len(tri.legs[2]), s: len(tri.sum) }),
        tip: tr('arch.tri.tip'),
        hit: { kind: 'furniture', id: stations.sink!.id },
      });
    }
  }

  return { checks, ...tally(checks) };
}
