import type { Floor, FurnitureItem, Opening, Point, Wall, Node } from '../types';
import { dist, formatLength, pointOnWall, wallAngle, wallEnds } from './geometry';
import { centroid, pointInPoly, polygonArea, roomPolygon } from './rooms';
import { t, type Locale } from '../data/i18n';
import { roomLabel } from '../data/rooms';
import { furnLabel } from '../data/furniture';

/** Classroom ADA reminders (2010 Standards, simplified). Not a legal review. */
export const ADA = {
  doorClearFt: 32 / 12, // 404.2.3 clear opening
  doorNiceFt: 3, // typical 3'-0" leaf
  routeFt: 3, // 403.5.1 accessible route
  turnFt: 5, // 304.3.1 60" circle
  turnWarnFt: 4,
  kitchenAisleFt: 40 / 12, // 804.2.2
} as const;

/** 2025 Residential Code of New York State (based on the 2024 IRC), simplified for class (2.13.59). */
export const NY = {
  exitDoorFt: 3, // one exit door with 32" clear opening — a 3'-0" door
  hallFt: 3, // hallways at least 3 feet wide
  roomSqFt: 70, // habitable rooms at least 70 sq ft…
  roomMinFt: 7, // …and at least 7 ft in every direction (kitchens exempt)
} as const;

export type AccessStatus = 'pass' | 'warn' | 'fail' | 'skip';

export type AccessHit = {
  kind: 'opening' | 'room' | 'furniture' | 'wall';
  id: string;
};

export type AccessCheck = {
  id: string;
  title: string;
  status: AccessStatus;
  detail: string;
  tip: string;
  hit?: AccessHit;
};

export type AccessReport = {
  checks: AccessCheck[];
  pass: number;
  warn: number;
  fail: number;
  skip: number;
};

const KITCHEN_IDS = new Set(['fridge', 'stove', 'sink', 'dining-table']);

function doorHinge(opening: Opening, walls: Wall[], nodes: Node[]): {
  hinge: Point;
  center: Point;
  radius: number;
  ang: number;
  swing: 1 | -1;
} | null {
  const wall = walls.find((w) => w.id === opening.wallId);
  if (!wall) return null;
  const c = pointOnWall(wall, nodes, opening.t);
  const e = wallEnds(wall, nodes);
  if (!c || !e) return null;
  const ang = wallAngle(wall, nodes);
  const ux = Math.cos(ang);
  const uy = Math.sin(ang);
  const half = opening.width / 2;
  const a = { x: c.x - ux * half, y: c.y - uy * half };
  const swing: 1 | -1 = opening.swing === 'right' ? -1 : 1;
  return { hinge: a, center: c, radius: opening.width, ang, swing };
}

function furnitureInSwing(item: FurnitureItem, hinge: Point, ang: number, swing: 1 | -1, radius: number): boolean {
  const dx = item.x - hinge.x;
  const dy = item.y - hinge.y;
  const pad = Math.max(item.w, item.h) / 2;
  const d = Math.hypot(dx, dy);
  if (d > radius + pad || d < 0.15) return false;
  const nx = -Math.sin(ang);
  const ny = Math.cos(ang);
  const side = dx * nx + dy * ny;
  if (swing > 0 && side < -0.15) return false;
  if (swing < 0 && side > 0.15) return false;
  const along = dx * Math.cos(ang) + dy * Math.sin(ang);
  if (along < -0.2 || along > radius + pad) return false;
  return true;
}

function bbox(poly: Point[]): { minX: number; maxX: number; minY: number; maxY: number } {
  let minX = poly[0].x, maxX = poly[0].x, minY = poly[0].y, maxY = poly[0].y;
  for (const p of poly) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  return { minX, maxX, minY, maxY };
}

export function circleFitsInPoly(poly: Point[], r: number, origin?: Point): boolean {
  if (poly.length < 3) return false;
  const c = origin ?? centroid(poly);
  const steps = 16;
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const p = { x: c.x + Math.cos(a) * r, y: c.y + Math.sin(a) * r };
    if (!pointInPoly(p, poly)) return false;
  }
  return true;
}

type Seg = { id: string; a: Point; b: Point; ux: number; uy: number; len: number };

function wallSegs(walls: Wall[], nodes: Node[]): Seg[] {
  const out: Seg[] = [];
  for (const w of walls) {
    const e = wallEnds(w, nodes);
    if (!e) continue;
    const len = dist(e.a, e.b);
    if (len < 1.5) continue;
    out.push({
      id: w.id,
      a: e.a,
      b: e.b,
      ux: (e.b.x - e.a.x) / len,
      uy: (e.b.y - e.a.y) / len,
      len,
    });
  }
  return out;
}

function projRange(s: Seg): { lo: number; hi: number } {
  const pa = s.a.x * s.ux + s.a.y * s.uy;
  const pb = s.b.x * s.ux + s.b.y * s.uy;
  return { lo: Math.min(pa, pb), hi: Math.max(pa, pb) };
}

/** Tightest gap between roughly parallel walls (circulation). */
export function tightestHall(walls: Wall[], nodes: Node[]): { dist: number; a: string; b: string } | null {
  const segs = wallSegs(walls, nodes);
  let best: { dist: number; a: string; b: string } | null = null;
  for (let i = 0; i < segs.length; i++) {
    for (let j = i + 1; j < segs.length; j++) {
      const A = segs[i];
      const B = segs[j];
      const dot = A.ux * B.ux + A.uy * B.uy;
      if (Math.abs(Math.abs(dot) - 1) > 0.08) continue;
      const vx = B.a.x - A.a.x;
      const vy = B.a.y - A.a.y;
      const gap = Math.abs(vx * -A.uy + vy * A.ux);
      if (gap < 1.8 || gap > 6.5) continue;
      const ra = projRange(A);
      const rb = projRange({ ...B, ux: A.ux, uy: A.uy });
      const overlap = Math.min(ra.hi, rb.hi) - Math.max(ra.lo, rb.lo);
      if (overlap < 2.5) continue;
      if (!best || gap < best.dist) best = { dist: gap, a: A.id, b: B.id };
    }
  }
  return best;
}

/** Box of a piece on the plan; a quarter turn swaps width and depth. */
function footprint(i: FurnitureItem) {
  const q = Math.round((((i.rot ?? 0) % 360) + 360) % 360 / 90) % 2;
  const w = q ? i.h : i.w;
  const h = q ? i.w : i.h;
  return { minX: i.x - w / 2, maxX: i.x + w / 2, minY: i.y - h / 2, maxY: i.y + h / 2, facesY: q === 0 };
}

/**
 * Floor between two kitchen pieces that face each other across an aisle, in feet.
 * null when they sit side by side in one row, or at an angle (no straight aisle between them).
 */
export function aisleGap(p: FurnitureItem, q: FurnitureItem): number | null {
  const A = footprint(p);
  const B = footprint(q);
  const sepX = Math.max(A.minX, B.minX) - Math.min(A.maxX, B.maxX); // > 0 gap, < 0 overlap
  const sepY = Math.max(A.minY, B.minY) - Math.min(A.maxY, B.maxY);
  if (sepX < -0.1 && sepY < -0.1) return 0; // really on top of each other
  const gapX = Math.max(0, sepX);
  const gapY = Math.max(0, sepY);
  const overlapX = sepX < -0.1;
  const overlapY = sepY < -0.1;
  if (A.facesY !== B.facesY) return null;
  // Facing each other: lined up across the floor, with the gap between their fronts.
  if (A.facesY) return overlapX ? gapY : null;
  return overlapY ? gapX : null;
}

export function runAccessCheck(floor: Floor, units: 'ft' | 'm' = 'ft', locale: Locale = 'en'): AccessReport {
  // 2.13.50: every sentence comes from i18n.ts, in the student's language.
  const tr = (key: string, vars?: Record<string, string>) => t(locale, key, vars);
  const roomName = (r: Parameters<typeof roomLabel>[1]) => roomLabel(locale, r);
  const itemName = (i: FurnitureItem) => furnLabel(locale, i.catalogId, i.label);
  const checks: AccessCheck[] = [];
  if (!floor) {
    return { checks, pass: 0, warn: 0, fail: 0, skip: 0 };
  }
  const openings = floor.openings ?? [];
  const walls = floor.walls ?? [];
  const nodes = floor.nodes ?? [];
  const furniture = floor.furniture ?? [];
  const doors = openings.filter((o) => o.type === 'door');
  const len = (n: number) => formatLength(n, units);

  if (doors.length === 0) {
    checks.push({
      id: 'entry',
      title: tr('acc.entry.title'),
      status: 'fail',
      detail: tr('acc.entry.none'),
      tip: tr('acc.entry.noneTip'),
    });
  } else {
    checks.push({
      id: 'entry',
      title: tr('acc.entry.title'),
      status: 'pass',
      detail: doors.length === 1 ? tr('acc.entry.one') : tr('acc.entry.many', { n: String(doors.length) }),
      tip: tr('acc.entry.tip'),
      hit: { kind: 'opening', id: doors[0].id },
    });
  }

  // 2.13.59: 2025 Residential Code of New York State — one exit door with 32" clear (a 3'-0" door).
  // Inside doors have no minimum width, so only doors on outside walls are measured.
  const exteriorIds = new Set(walls.filter((w) => w.kind === 'exterior').map((w) => w.id));
  const outside = doors.filter((d) => exteriorIds.has(d.wallId));
  const exit = outside.slice().sort((a, b) => b.width - a.width)[0];
  if (doors.length === 0) {
    checks.push({
      id: 'door-width',
      title: tr('acc.ny.dwTitle'),
      status: 'skip',
      detail: tr('acc.dw.skip'),
      tip: tr('acc.ny.dwTip'),
    });
  } else if (!exit) {
    checks.push({
      id: 'door-width',
      title: tr('acc.ny.dwTitle'),
      status: 'warn',
      detail: tr('acc.ny.dwNoExt'),
      tip: tr('acc.ny.dwTip'),
      hit: { kind: 'opening', id: doors[0].id },
    });
  } else if (exit.width + 1e-6 < NY.exitDoorFt) {
    checks.push({
      id: 'door-width',
      title: tr('acc.ny.dwTitle'),
      status: 'fail',
      detail: tr('acc.ny.dwFail', { w: len(exit.width) }),
      tip: tr('acc.ny.dwTip'),
      hit: { kind: 'opening', id: exit.id },
    });
  } else {
    checks.push({
      id: 'door-width',
      title: tr('acc.ny.dwTitle'),
      status: 'pass',
      detail: tr('acc.ny.dwPass', { w: len(exit.width) }),
      tip: tr('acc.dw.passTip'),
      hit: { kind: 'opening', id: exit.id },
    });
  }

  let blocked: { door: Opening; item: FurnitureItem } | null = null;
  for (const door of doors) {
    const geo = doorHinge(door, walls, nodes);
    if (!geo) continue;
    for (const item of furniture) {
      if (furnitureInSwing(item, geo.hinge, geo.ang, geo.swing, geo.radius)) {
        blocked = { door, item };
        break;
      }
    }
    if (blocked) break;
  }
  if (doors.length === 0) {
    checks.push({
      id: 'swing',
      title: tr('acc.sw.title'),
      status: 'skip',
      detail: tr('acc.sw.skip'),
      tip: tr('acc.sw.skipTip'),
    });
  } else if (blocked) {
    checks.push({
      id: 'swing',
      title: tr('acc.sw.title'),
      status: 'fail',
      detail: tr('acc.sw.fail', { item: itemName(blocked.item) }),
      tip: tr('acc.sw.failTip'),
      hit: { kind: 'furniture', id: blocked.item.id },
    });
  } else {
    checks.push({
      id: 'swing',
      title: tr('acc.sw.title'),
      status: 'pass',
      detail: tr('acc.sw.pass'),
      tip: tr('acc.sw.passTip'),
    });
  }

  const hall = tightestHall(walls, nodes);
  if (!hall) {
    checks.push({
      id: 'hall',
      title: tr('acc.hall.title'),
      status: 'skip',
      detail: tr('acc.hall.skip'),
      tip: tr('acc.hall.skipTip'),
    });
  } else if (hall.dist + 1e-6 < ADA.routeFt) {
    checks.push({
      id: 'hall',
      title: tr('acc.hall.title'),
      status: 'fail',
      detail: tr('acc.hall.fail', { w: len(hall.dist) }),
      tip: tr('acc.hall.failTip'),
      hit: { kind: 'wall', id: hall.a },
    });
  } else {
    checks.push({
      id: 'hall',
      title: tr('acc.hall.title'),
      status: 'pass',
      detail: tr('acc.hall.pass', { w: len(hall.dist) }),
      tip: tr('acc.hall.passTip'),
      hit: { kind: 'wall', id: hall.a },
    });
  }

  const baths = (floor.rooms ?? []).filter((r) => r.kind === 'bath');
  if (baths.length === 0) {
    checks.push({
      id: 'turn',
      title: tr('acc.turn.title'),
      status: 'skip',
      detail: tr('acc.turn.skip'),
      tip: tr('acc.turn.skipTip'),
    });
  } else {
    let worst: { roomId: string; status: AccessStatus; detail: string } | null = null;
    for (const room of baths) {
      const poly = roomPolygon(room, nodes, walls);
      if (!poly) {
        worst = {
          roomId: room.id,
          status: 'warn',
          detail: tr('acc.turn.open', { room: roomName(room) }),
        };
        continue;
      }
      const box = bbox(poly);
      const minSide = Math.min(box.maxX - box.minX, box.maxY - box.minY);
      const area = polygonArea(poly);
      if (circleFitsInPoly(poly, ADA.turnFt) || minSide + 1e-6 >= ADA.turnFt) {
        const next = {
          roomId: room.id,
          status: 'pass' as AccessStatus,
          detail: tr('acc.turn.pass', { room: roomName(room), w: len(minSide), a: String(Math.round(area)) }),
        };
        if (!worst || worst.status === 'skip') worst = next;
      } else if (circleFitsInPoly(poly, ADA.turnWarnFt) || minSide >= ADA.turnWarnFt) {
        worst = {
          roomId: room.id,
          status: 'warn',
          detail: tr('acc.turn.warn', { room: roomName(room), w: len(minSide) }),
        };
      } else {
        worst = {
          roomId: room.id,
          status: 'warn', // 2.13.59: accessibility guidance, not one-family code
          detail: tr('acc.turn.fail', { room: roomName(room), w: len(minSide) }),
        };
        break;
      }
    }
    const w = worst!;
    checks.push({
      id: 'turn',
      title: tr('acc.turn.title'),
      status: w.status,
      detail: w.detail,
      tip: `${tr('acc.turn.tip')} ${tr('acc.ny.adaNote')}`,
      hit: { kind: 'room', id: w.roomId },
    });
  }

  const kitchen = furniture.filter((f) => KITCHEN_IDS.has(f.catalogId));
  if (kitchen.length < 2) {
    checks.push({
      id: 'kitchen',
      title: tr('acc.k.title'),
      status: 'skip',
      detail: tr('acc.k.skip'),
      tip: tr('acc.k.skipTip'),
    });
  } else {
    // 2.13.50: an aisle is the floor between pieces that face each other. Pieces side by side on one
    // counter are a row, not an aisle (the Ranch sink and stove used to fail at 1'-3").
    let minGap = Infinity;
    let a = kitchen[0];
    let b = kitchen[1];
    for (let i = 0; i < kitchen.length; i++) {
      for (let j = i + 1; j < kitchen.length; j++) {
        const gap = aisleGap(kitchen[i], kitchen[j]);
        if (gap !== null && gap < minGap) {
          minGap = gap;
          a = kitchen[i];
          b = kitchen[j];
        }
      }
    }
    if (minGap === Infinity) {
      checks.push({
        id: 'kitchen',
        title: tr('acc.k.title'),
        status: 'pass',
        detail: tr('acc.k.row'),
        tip: tr('acc.k.passTip'),
        hit: { kind: 'furniture', id: kitchen[0].id },
      });
    } else if (minGap + 1e-6 < ADA.kitchenAisleFt) {
      checks.push({
        id: 'kitchen',
        title: tr('acc.k.title'),
        status: 'warn', // 2.13.59: accessibility guidance, not one-family code
        detail: tr('acc.k.fail', { a: itemName(a), b: itemName(b), w: len(Math.max(0, minGap)) }),
        tip: `${tr('acc.k.failTip')} ${tr('acc.ny.adaNote')}`,
        hit: { kind: 'furniture', id: a.id },
      });
    } else {
      checks.push({
        id: 'kitchen',
        title: tr('acc.k.title'),
        status: 'pass',
        detail: tr('acc.k.pass', { w: len(minGap) }),
        tip: tr('acc.k.passTip'),
        hit: { kind: 'furniture', id: a.id },
      });
    }
  }

  const pass = checks.filter((c) => c.status === 'pass').length;
  const warn = checks.filter((c) => c.status === 'warn').length;
  const fail = checks.filter((c) => c.status === 'fail').length;
  const skip = checks.filter((c) => c.status === 'skip').length;
  return { checks, pass, warn, fail, skip };
}
