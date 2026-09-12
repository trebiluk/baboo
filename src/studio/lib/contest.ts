import type { Floor, FurnitureItem, Opening, RoofStyleId } from '../types';
import { formatLength } from './geometry';
import { circleFitsInPoly } from './access';
import { listInteriorFaces } from './rooms';

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
  opts: { roofStyleId?: RoofStyleId | null; units?: 'ft' | 'm' } = {},
): ContestReport {
  const checks: ContestCheck[] = [];
  const units = opts.units ?? 'ft';
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
      title: 'A closed den',
      status: 'fail',
      detail: 'Walls don’t meet yet. A dog house is a closed box — rain stays out.',
      tip: 'Sketch, then Trace, or Wall until the corners meet.',
      max: 18,
    });
  } else {
    push(checks, {
      id: 'shelter',
      title: 'A closed den',
      status: 'pass',
      detail: 'The walls meet. That’s a shelter.',
      tip: 'Keep it one room — a den, not a people plan.',
      max: 18,
    });
  }

  const area = den ? Math.round(den.area * 10) / 10 : 0;
  if (!den) {
    push(checks, {
      id: 'scale',
      title: 'Just large enough',
      status: 'skip',
      detail: 'Close the den before we talk size.',
      tip: 'Textbook: big enough to stand, turn, and lie down — small enough to warm with body heat.',
      max: 18,
    });
  } else if (area >= DOG_HOUSE.areaMin && area <= DOG_HOUSE.areaMax) {
    push(checks, {
      id: 'scale',
      title: 'Just large enough',
      status: 'pass',
      detail: `${area} sq ft. I can warm this with my own heat.`,
      tip: 'Textbook size for a medium dog: about 8–18 sq ft.',
      max: 18,
    });
  } else if (area >= DOG_HOUSE.areaWarnLo && area <= DOG_HOUSE.areaWarnHi) {
    push(checks, {
      id: 'scale',
      title: 'Just large enough',
      status: 'warn',
      detail: `${area} sq ft — close, but ${area < DOG_HOUSE.areaMin ? 'snug' : 'a bit roomy'} for body heat.`,
      tip: area < DOG_HOUSE.areaMin
        ? 'Nudge the walls out a foot. I still need to turn around.'
        : 'A bigger box loses heat. Pull the walls in toward 8–18 sq ft.',
      max: 18,
    });
  } else {
    push(checks, {
      id: 'scale',
      title: 'Just large enough',
      status: 'fail',
      detail: `${area} sq ft. ${area < DOG_HOUSE.areaMin ? 'I can’t turn around.' : 'That’s a people room — I can’t heat it.'}`,
      tip: 'Textbook: 8–18 sq ft for a medium dog. Not 12×10 like a bedroom.',
      max: 18,
    });
  }

  if (doors.length === 0) {
    push(checks, {
      id: 'door',
      title: 'A dog-sized door',
      status: 'fail',
      detail: 'No door. I need a way in that isn’t a 3-foot people opening.',
      tip: 'Door tool → click a wall → tap it and pick 12" or 18".',
      max: 14,
    });
  } else {
    const d = doors[0];
    const w = d.width;
    const extra = doors.length > 1 ? ` ${doors.length} doors leak drafts.` : '';
    let status: ContestStatus = 'pass';
    let detail = `${len(w)} opening.${extra}`;
    let tip = 'One opening, just wide enough to walk through.';
    if (w < DOG_HOUSE.doorMinFt || w > DOG_HOUSE.doorMaxFt || doors.length > 1) {
      status = 'fail';
      detail = w > DOG_HOUSE.doorMaxFt
        ? `${len(w)} is a people door. Heat pours out.${extra}`
        : `${len(w)} is too tight.${extra}`;
      tip = 'Tap the door → 12" or 18". One door only.';
    } else if (w < DOG_HOUSE.doorNiceMinFt || w > DOG_HOUSE.doorNiceMaxFt) {
      status = 'warn';
      detail = `${len(w)} works, but 12–18" is the textbook sweet spot.${extra}`;
    } else {
      detail = `${len(w)} — just wide enough.${extra}`;
    }
    push(checks, {
      id: 'door',
      title: 'A dog-sized door',
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
      title: 'Offset from the wind',
      status: 'skip',
      detail: 'Place a door first, then slide it off-center.',
      tip: 'Textbook: don’t put the opening in the middle — rain and wind miss the bed.',
      max: 10,
    });
  } else {
    const d = doors[0];
    const off = Math.abs(d.t - 0.5);
    if (off >= DOG_HOUSE.offsetT) {
      push(checks, {
        id: 'offset',
        title: 'Offset from the wind',
        status: 'pass',
        detail: 'Door sits off-center. Wind and rain don’t blow straight onto the bed.',
        tip: 'Keep the sleeping pad on the far side of the opening.',
        max: 10,
        hit: { kind: 'opening', id: d.id },
      });
    } else {
      push(checks, {
        id: 'offset',
        title: 'Offset from the wind',
        status: 'fail',
        detail: 'Door is in the middle of the wall. A gust goes right in.',
        tip: 'Select the door and slide it toward a corner.',
        max: 10,
        hit: { kind: 'opening', id: d.id },
      });
    }
  }

  if (!den) {
    push(checks, {
      id: 'turn',
      title: 'Room to turn',
      status: 'skip',
      detail: 'Close the den first.',
      tip: 'I need about a 2-foot circle inside.',
      max: 10,
    });
  } else if (circleFitsInPoly(den.poly, DOG_HOUSE.turnFt)) {
    push(checks, {
      id: 'turn',
      title: 'Room to turn',
      status: 'pass',
      detail: 'A 2-foot circle fits. I can spin and lie down.',
      tip: 'Don’t fill the floor with people furniture.',
      max: 10,
    });
  } else {
    push(checks, {
      id: 'turn',
      title: 'Room to turn',
      status: 'fail',
      detail: 'Too tight to turn around. Stretch the short wall.',
      tip: 'Textbook: stand, turn, lie stretched — all three.',
      max: 10,
    });
  }

  const roofId = opts.roofStyleId ?? null;
  if (!roofId) {
    push(checks, {
      id: 'roof',
      title: 'A pitched roof',
      status: 'fail',
      detail: 'No roof named yet. Rain has to shed.',
      tip: 'Settings → Roof → Gable or Shed.',
      max: 14,
    });
  } else if (PITCHED.has(roofId)) {
    push(checks, {
      id: 'roof',
      title: 'A pitched roof',
      status: 'pass',
      detail: `${roofId === 'gable' ? 'Gable' : roofId === 'shed' ? 'Shed' : 'Hip'} — water runs off.`,
      tip: 'Name it with a real word. You already did.',
      max: 14,
    });
  } else if (ODD_ROOF.has(roofId)) {
    push(checks, {
      id: 'roof',
      title: 'A pitched roof',
      status: 'warn',
      detail: 'That roof is for a people house or a story. A kennel wants gable or shed.',
      tip: 'Settings → Gable or Shed. Simple pitch, rain sheds.',
      max: 14,
    });
  } else {
    push(checks, {
      id: 'roof',
      title: 'A pitched roof',
      status: 'fail',
      detail: 'A flat roof puddles. Dogs don’t need a modern box.',
      tip: 'Settings → Gable or Shed.',
      max: 14,
    });
  }

  const peopleRooms = rooms.filter((r) => PEOPLE_ROOMS.has(r.kind));
  const peopleFurn = furniture.filter((f: FurnitureItem) => PEOPLE_FURN.has(f.catalogId));
  const bigWin = windows.filter((w) => w.width >= 2);
  if (peopleRooms.length || peopleFurn.length) {
    const who = peopleRooms[0]?.name ?? peopleFurn[0]?.label ?? 'people stuff';
    push(checks, {
      id: 'program',
      title: 'A den, not a people house',
      status: 'fail',
      detail: `${who} belongs in a house for humans. I need a sleeping box.`,
      tip: 'Delete the kitchen and bath. One named den is enough.',
      max: 6,
      hit: peopleRooms[0]
        ? { kind: 'room', id: peopleRooms[0].id }
        : { kind: 'furniture', id: peopleFurn[0].id },
    });
  } else if (bigWin.length) {
    push(checks, {
      id: 'program',
      title: 'A den, not a people house',
      status: 'warn',
      detail: 'A people-sized window leaks heat. Kennels stay mostly solid.',
      tip: 'Delete extra windows, or skip them.',
      max: 6,
      hit: { kind: 'opening', id: bigWin[0].id },
    });
  } else {
    push(checks, {
      id: 'program',
      title: 'A den, not a people house',
      status: 'pass',
      detail: 'No kitchen, no bath, no sofa. This reads as a den.',
      tip: 'One room. Sleeping only.',
      max: 6,
    });
  }

  const dims = floor.dimensions ?? [];
  if (dims.length === 0) {
    push(checks, {
      id: 'dims',
      title: 'Size labels',
      status: 'warn',
      detail: 'No size labels on the plan. The book wants numbers you can read.',
      tip: 'Size tool → click two corners of a wall.',
      max: 5,
    });
  } else {
    push(checks, {
      id: 'dims',
      title: 'Size labels',
      status: 'pass',
      detail: `${dims.length} size label${dims.length === 1 ? '' : 's'} on the plan.`,
      tip: 'Keep them in feet so the class can check scale.',
      max: 5,
      hit: { kind: 'dim', id: dims[0].id },
    });
  }

  const trees = (floor.landscape ?? []).filter((x) => x.kind === 'tree');
  if (trees.length === 0) {
    push(checks, {
      id: 'shade',
      title: 'Summer shade',
      status: 'warn',
      detail: 'No tree on the site. Textbook: shade in summer, sun in winter if you can.',
      tip: 'Plant tool → Tree. Put it on the south or west side.',
      max: 5,
    });
  } else {
    push(checks, {
      id: 'shade',
      title: 'Summer shade',
      status: 'pass',
      detail: 'A tree on the plan. I’ll thank you in July.',
      tip: 'Keep the door out of the prevailing wind if you know it.',
      max: 5,
      hit: { kind: 'landscape', id: trees[0].id },
    });
  }

  const t = tally(checks);
  const ribbon = ribbonFor(t.score, t.max, t.fail);
  return {
    checks,
    ...t,
    ribbon,
    quote: babooQuote(ribbon, t.fail),
  };
}
