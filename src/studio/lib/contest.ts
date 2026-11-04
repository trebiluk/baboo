import type { Floor, FurnitureItem, Opening, RoofStyleId } from '../types';
import { formatLength } from './geometry';
import { circleFitsInPoly } from './access';
import { listInteriorFaces } from './rooms';
import { t, type Locale } from '../data/i18n';
import { roomLabel } from '../data/rooms';
import { furnLabel } from '../data/furniture';

/** Textbook dog-house rules (classroom, not a kennel license). */
export const DOG_HOUSE = {
  /** Interior area that a medium dog can warm with body heat. */
  areaMin: 8,
  areaMax: 18,
  areaWarnLo: 6,
  areaWarnHi: 24,
  /** Door clear: 12–18" typical; 10–21" still a dog door. */
  doorMinFt: 10 / 12,
  doorMaxFt: 21 / 12,
  doorNiceMinFt: 12 / 12,
  doorNiceMaxFt: 18 / 12,
  /** |t − 0.5| at or above this counts as offset from center. */
  offsetT: 0.12,
  /** Turning diameter inside the den (~2 ft for a medium dog). */
  turnFt: 1,
} as const;

export type ContestStatus = 'pass' | 'warn' | 'fail' | 'skip';
export type ContestRibbon = 'best' | 'blue' | 'red' | 'honor' | 'keep';

export type ContestHit = {
  kind: 'opening' | 'room' | 'furniture' | 'wall' | 'landscape' | 'dim';
  id: string;
};

export type ContestCheck = {
  id: string;
  title: string;
  status: ContestStatus;
  detail: string;
  tip: string;
  points: number;
  max: number;
  hit?: ContestHit;
};

export type ContestReport = {
  checks: ContestCheck[];
  score: number;
  max: number;
  pass: number;
  warn: number;
  fail: number;
  skip: number;
  ribbon: ContestRibbon;
  quote: string;
};

const PEOPLE_ROOMS = new Set(['kitchen', 'bath', 'dining', 'living']);
const PEOPLE_FURN = new Set([
  'sofa', 'stove', 'fridge', 'toilet', 'bathtub', 'dining-table',
  'washer', 'dryer', 'water-heater', 'desk',
]);
const PITCHED = new Set<RoofStyleId>(['gable', 'shed', 'hip']);
const ODD_ROOF = new Set<RoofStyleId>(['gambrel', 'grass', 'conical', 'mansard']);

function pts(status: ContestStatus, max: number): number {
  if (status === 'pass') return max;
  if (status === 'warn') return Math.round(max / 2);
  return 0;
}

function tally(checks: ContestCheck[]): Pick<ContestReport, 'pass' | 'warn' | 'fail' | 'skip' | 'score' | 'max'> {
  let pass = 0, warn = 0, fail = 0, skip = 0, score = 0, max = 0;
  for (const c of checks) {
    if (c.status === 'pass') pass += 1;
    else if (c.status === 'warn') warn += 1;
    else if (c.status === 'fail') fail += 1;
    else skip += 1;
    score += c.points;
    max += c.max;
  }
  return { pass, warn, fail, skip, score, max };
}

export function ribbonFor(score: number, max: number, fail: number): ContestRibbon {
  const pct = max > 0 ? score / max : 0;
  if (fail === 0 && pct >= 0.88) return 'best';
  if (pct >= 0.75) return 'blue';
  if (pct >= 0.6) return 'red';
  if (pct >= 0.4) return 'honor';
  return 'keep';
}

export function ribbonLabel(ribbon: ContestRibbon): string {
  if (ribbon === 'best') return 'Best in show';
  if (ribbon === 'blue') return 'Blue ribbon';
  if (ribbon === 'red') return 'Red ribbon';
  if (ribbon === 'honor') return 'Honorable mention';
  return 'Keep drawing';
}

export function babooQuote(ribbon: ContestRibbon, fail: number): string {
  if (ribbon === 'best') return 'I’d nap here. This den follows the book.';
  if (ribbon === 'blue') return 'Almost — a couple textbook fixes and I’d pick this.';
  if (ribbon === 'red') return 'I see a shelter. Tighten size, door, or roof and I’ll look again.';
  if (ribbon === 'honor' || fail > 0) return 'Not yet a dog house the book would pick. Start with a snug closed den.';
  return 'Sketch a den, close the walls, and ask me again.';
}

function push(
  checks: ContestCheck[],
  partial: Omit<ContestCheck, 'points'> & { max: number },
): void {
  checks.push({ ...partial, points: pts(partial.status, partial.max) });
}

export function judgeDogHouse(
  floor: Floor,
  opts: { roofStyleId?: RoofStyleId | null; units?: 'ft' | 'm'; locale?: Locale } = {},
): ContestReport {
  const checks: ContestCheck[] = [];
  const units = opts.units ?? 'ft';
  // 2.13.51: every sentence comes from i18n.ts, in the student's language.
  const locale: Locale = opts.locale ?? 'en';
  const tr = (key: string, vars?: Record<string, string>) => t(locale, key, vars);
  const len = (n: number) => formatLength(n, units);
  const faces = listInteriorFaces(floor.nodes ?? [], floor.walls ?? []);
  const den = faces.slice().sort((a, b) => b.area - a.area)[0] ?? null;
  const doors = (floor.openings ?? []).filter((o: Opening) => o.type === 'door');
  const windows = (floor.openings ?? []).filter((o: Opening) => o.type === 'window');
  const furniture = floor.furniture ?? [];
  const rooms = floor.rooms ?? [];

  if (!den) {
    push(checks, {
      id: 'shelter',
      title: tr('dog.den.title'),
      status: 'fail',
      detail: tr('dog.den.fail'),
      tip: tr('dog.den.failTip'),
      max: 18,
    });
  } else {
    push(checks, {
      id: 'shelter',
      title: tr('dog.den.title'),
      status: 'pass',
      detail: tr('dog.den.pass'),
      tip: tr('dog.den.passTip'),
      max: 18,
    });
  }

  const area = den ? Math.round(den.area * 10) / 10 : 0;
  if (!den) {
    push(checks, {
      id: 'scale',
      title: tr('dog.scale.title'),
      status: 'skip',
      detail: tr('dog.scale.skip'),
      tip: tr('dog.scale.skipTip'),
      max: 18,
    });
  } else if (area >= DOG_HOUSE.areaMin && area <= DOG_HOUSE.areaMax) {
    push(checks, {
      id: 'scale',
      title: tr('dog.scale.title'),
      status: 'pass',
      detail: tr('dog.scale.pass', { area: String(area) }),
      tip: tr('dog.scale.passTip'),
      max: 18,
    });
  } else if (area >= DOG_HOUSE.areaWarnLo && area <= DOG_HOUSE.areaWarnHi) {
    push(checks, {
      id: 'scale',
      title: tr('dog.scale.title'),
      status: 'warn',
      detail: tr(area < DOG_HOUSE.areaMin ? 'dog.scale.warnSnug' : 'dog.scale.warnRoomy', { area: String(area) }),
      tip: area < DOG_HOUSE.areaMin
        ? tr('dog.scale.warnSnugTip')
        : tr('dog.scale.warnRoomyTip'),
      max: 18,
    });
  } else {
    push(checks, {
      id: 'scale',
      title: tr('dog.scale.title'),
      status: 'fail',
      detail: tr(area < DOG_HOUSE.areaMin ? 'dog.scale.failSmall' : 'dog.scale.failBig', { area: String(area) }),
      tip: tr('dog.scale.failTip'),
      max: 18,
    });
  }

  if (doors.length === 0) {
    push(checks, {
      id: 'door',
      title: tr('dog.door.title'),
      status: 'fail',
      detail: tr('dog.door.none'),
      tip: tr('dog.door.noneTip'),
      max: 14,
    });
  } else {
    const d = doors[0];
    const w = d.width;
    const extra = doors.length > 1 ? ` ${tr('dog.door.extra', { n: String(doors.length) })}` : '';
    let status: ContestStatus = 'pass';
    let detail = '';
    let tip = tr('dog.door.tip');
    if (w < DOG_HOUSE.doorMinFt || w > DOG_HOUSE.doorMaxFt || doors.length > 1) {
      status = 'fail';
      // 2.13.51: a good-sized door with extra doors is not "too tight" — the extra doors are the problem.
      detail = w > DOG_HOUSE.doorMaxFt
        ? tr('dog.door.big', { w: len(w) }) + extra
        : w < DOG_HOUSE.doorMinFt
          ? tr('dog.door.tight', { w: len(w) }) + extra
          : (tr('dog.door.pass', { w: len(w) }) + extra);
      tip = tr('dog.door.failTip');
    } else if (w < DOG_HOUSE.doorNiceMinFt || w > DOG_HOUSE.doorNiceMaxFt) {
      status = 'warn';
      detail = tr('dog.door.warn', { w: len(w) }) + extra;
    } else {
      detail = tr('dog.door.pass', { w: len(w) }) + extra;
    }
    push(checks, {
      id: 'door',
      title: tr('dog.door.title'),
      status,
      detail,
      tip,
      max: 14,
      hit: { kind: 'opening', id: d.id },
    });
  }

  if (doors.length === 0) {
    push(checks, {
      id: 'offset',
      title: tr('dog.offset.title'),
      status: 'skip',
      detail: tr('dog.offset.skip'),
      tip: tr('dog.offset.skipTip'),
      max: 10,
    });
  } else {
    const d = doors[0];
    const off = Math.abs(d.t - 0.5);
    if (off >= DOG_HOUSE.offsetT) {
      push(checks, {
        id: 'offset',
        title: tr('dog.offset.title'),
        status: 'pass',
        detail: tr('dog.offset.pass'),
        tip: tr('dog.offset.passTip'),
        max: 10,
        hit: { kind: 'opening', id: d.id },
      });
    } else {
      push(checks, {
        id: 'offset',
        title: tr('dog.offset.title'),
        status: 'fail',
        detail: tr('dog.offset.fail'),
        tip: tr('dog.offset.failTip'),
        max: 10,
        hit: { kind: 'opening', id: d.id },
      });
    }
  }

  if (!den) {
    push(checks, {
      id: 'turn',
      title: tr('dog.turn.title'),
      status: 'skip',
      detail: tr('dog.turn.skip'),
      tip: tr('dog.turn.skipTip'),
      max: 10,
    });
  } else if (circleFitsInPoly(den.poly, DOG_HOUSE.turnFt)) {
    push(checks, {
      id: 'turn',
      title: tr('dog.turn.title'),
      status: 'pass',
      detail: tr('dog.turn.pass'),
      tip: tr('dog.turn.passTip'),
      max: 10,
    });
  } else {
    push(checks, {
      id: 'turn',
      title: tr('dog.turn.title'),
      status: 'fail',
      detail: tr('dog.turn.fail'),
      tip: tr('dog.turn.failTip'),
      max: 10,
    });
  }

  const roofId = opts.roofStyleId ?? null;
  if (!roofId) {
    push(checks, {
      id: 'roof',
      title: tr('dog.roof.title'),
      status: 'fail',
      detail: tr('dog.roof.none'),
      tip: tr('dog.roof.noneTip'),
      max: 14,
    });
  } else if (PITCHED.has(roofId)) {
    push(checks, {
      id: 'roof',
      title: tr('dog.roof.title'),
      status: 'pass',
      detail: tr('dog.roof.pass', { roof: roofId === 'gable' ? 'Gable' : roofId === 'shed' ? 'Shed' : 'Hip' }),
      tip: tr('dog.roof.passTip'),
      max: 14,
    });
  } else if (ODD_ROOF.has(roofId)) {
    push(checks, {
      id: 'roof',
      title: tr('dog.roof.title'),
      status: 'warn',
      detail: tr('dog.roof.people'),
      tip: tr('dog.roof.peopleTip'),
      max: 14,
    });
  } else {
    push(checks, {
      id: 'roof',
      title: tr('dog.roof.title'),
      status: 'fail',
      detail: tr('dog.roof.flat'),
      tip: tr('dog.roof.flatTip'),
      max: 14,
    });
  }

  const peopleRooms = rooms.filter((r) => PEOPLE_ROOMS.has(r.kind));
  const peopleFurn = furniture.filter((f: FurnitureItem) => PEOPLE_FURN.has(f.catalogId));
  const bigWin = windows.filter((w) => w.width >= 2);
  if (peopleRooms.length || peopleFurn.length) {
    const who = peopleRooms[0] ? roomLabel(locale, peopleRooms[0]) : peopleFurn[0] ? furnLabel(locale, peopleFurn[0].catalogId, peopleFurn[0].label) : tr('dog.program.stuff');
    push(checks, {
      id: 'program',
      title: tr('dog.program.title'),
      status: 'fail',
      detail: tr('dog.program.fail', { who }),
      tip: tr('dog.program.failTip'),
      max: 6,
      hit: peopleRooms[0]
        ? { kind: 'room', id: peopleRooms[0].id }
        : { kind: 'furniture', id: peopleFurn[0].id },
    });
  } else if (bigWin.length) {
    push(checks, {
      id: 'program',
      title: tr('dog.program.title'),
      status: 'warn',
      detail: tr('dog.program.window'),
      tip: tr('dog.program.windowTip'),
      max: 6,
      hit: { kind: 'opening', id: bigWin[0].id },
    });
  } else {
    push(checks, {
      id: 'program',
      title: tr('dog.program.title'),
      status: 'pass',
      detail: tr('dog.program.pass'),
      tip: tr('dog.program.passTip'),
      max: 6,
    });
  }

  const dims = floor.dimensions ?? [];
  if (dims.length === 0) {
    push(checks, {
      id: 'dims',
      title: tr('dog.dims.title'),
      status: 'warn',
      detail: tr('dog.dims.none'),
      tip: tr('dog.dims.noneTip'),
      max: 5,
    });
  } else {
    push(checks, {
      id: 'dims',
      title: tr('dog.dims.title'),
      status: 'pass',
      detail: dims.length === 1 ? tr('dog.dims.one') : tr('dog.dims.many', { n: String(dims.length) }),
      tip: tr('dog.dims.passTip'),
      max: 5,
      hit: { kind: 'dim', id: dims[0].id },
    });
  }

  const trees = (floor.landscape ?? []).filter((x) => x.kind === 'tree');
  if (trees.length === 0) {
    push(checks, {
      id: 'shade',
      title: tr('dog.shade.title'),
      status: 'warn',
      detail: tr('dog.shade.none'),
      tip: tr('dog.shade.noneTip'),
      max: 5,
    });
  } else {
    push(checks, {
      id: 'shade',
      title: tr('dog.shade.title'),
      status: 'pass',
      detail: tr('dog.shade.pass'),
      tip: tr('dog.shade.passTip'),
      max: 5,
      hit: { kind: 'landscape', id: trees[0].id },
    });
  }

  const score = tally(checks);
  const ribbon = ribbonFor(score.score, score.max, score.fail);
  return {
    checks,
    ...score,
    ribbon,
    quote: babooQuote(ribbon, score.fail),
  };
}
