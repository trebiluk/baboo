import type { Floor, FurnitureItem, Opening, Point, Wall, Node } from '../types';
import { dist, formatLength, pointOnWall, wallAngle, wallEnds } from './geometry';
import { centroid, pointInPoly, polygonArea, roomPolygon } from './rooms';

/** Classroom ADA reminders (2010 Standards, simplified). Not a legal review. */
export const ADA = {
  doorClearFt: 32 / 12, // 404.2.3 clear opening
  doorNiceFt: 3, // typical 3'-0" leaf
  routeFt: 3, // 403.5.1 accessible route
  turnFt: 5, // 304.3.1 60" circle
  turnWarnFt: 4,
  kitchenAisleFt: 40 / 12, // 804.2.2
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

export function runAccessCheck(floor: Floor, units: 'ft' | 'm' = 'ft'): AccessReport {
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
      title: 'A way in',
      status: 'fail',
      detail: 'No door yet. A wheelchair (and everyone else) needs a way in.',
      tip: 'Door tool → click a wall.',
    });
  } else {
    checks.push({
      id: 'entry',
      title: 'A way in',
      status: 'pass',
      detail: `${doors.length} door${doors.length === 1 ? '' : 's'} on the plan.`,
      tip: 'Keep a clear path from the door to kitchen, bath, and sleep.',
      hit: { kind: 'opening', id: doors[0].id },
    });
  }

  const tightDoors = doors.filter((d) => d.width + 1e-6 < ADA.doorClearFt);
  const okDoors = doors.filter((d) => d.width + 1e-6 >= ADA.doorNiceFt);
  if (doors.length === 0) {
    checks.push({
      id: 'door-width',
      title: 'Door clear width (32")',
      status: 'skip',
      detail: 'Place a door and we’ll measure it.',
      tip: 'ADA wants 32" of clear opening. A 3\'-0" door usually gets you there.',
    });
  } else if (tightDoors.length) {
    const d = tightDoors[0];
    checks.push({
      id: 'door-width',
      title: 'Door clear width (32")',
      status: 'fail',
      detail: `A door is only ${len(d.width)} wide. ADA asks for 32" clear (${len(ADA.doorClearFt)}).`,
      tip: 'Use a 3\'-0" door. Baboo’s Door tool places that size.',
      hit: { kind: 'opening', id: d.id },
    });
  } else if (okDoors.length === doors.length) {
    checks.push({
      id: 'door-width',
      title: 'Door clear width (32")',
      status: 'pass',
      detail: `Doors are ${len(doors[0].width)} — wider than the 32" clear opening.`,
      tip: 'Nice. Leave the swing side empty so the leaf can open.',
      hit: { kind: 'opening', id: doors[0].id },
    });
  } else {
    const d = doors.find((x) => x.width < ADA.doorNiceFt) ?? doors[0];
    checks.push({
      id: 'door-width',
      title: 'Door clear width (32")',
      status: 'warn',
      detail: `A door is ${len(d.width)}. It meets 32" but a 3'-0" leaf is easier to use.`,
      tip: 'When in doubt, draw doors at 3 feet.',
      hit: { kind: 'opening', id: d.id },
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
      title: 'Door swing is clear',
      status: 'skip',
      detail: 'No door to check yet.',
      tip: 'Keep sofas and beds out of the quarter-circle.',
    });
  } else if (blocked) {
    checks.push({
      id: 'swing',
      title: 'Door swing is clear',
      status: 'fail',
      detail: `${blocked.item.label} sits in a door swing.`,
      tip: 'Move the piece, or swing the door the other way, so someone can open it.',
      hit: { kind: 'furniture', id: blocked.item.id },
    });
  } else {
    checks.push({
      id: 'swing',
      title: 'Door swing is clear',
      status: 'pass',
      detail: 'Nothing is sitting in a door swing.',
      tip: 'The quarter-circle on the plan is the swing. Keep it empty.',
    });
  }

  const hall = tightestHall(walls, nodes);
  if (!hall) {
    checks.push({
      id: 'hall',
      title: 'Hall / route width (36")',
      status: 'skip',
      detail: 'No skinny parallel walls to measure yet.',
      tip: 'Interior walls make halls. Leave 3 feet so a wheelchair can roll.',
    });
  } else if (hall.dist + 1e-6 < ADA.routeFt) {
    checks.push({
      id: 'hall',
      title: 'Hall / route width (36")',
      status: 'fail',
      detail: `Tightest gap between walls is ${len(hall.dist)}. Accessible routes want 3'-0".`,
      tip: 'Nudge a wall. Halls feel better at 3\'-6" or 4\'.',
      hit: { kind: 'wall', id: hall.a },
    });
  } else {
    checks.push({
      id: 'hall',
      title: 'Hall / route width (36")',
      status: 'pass',
      detail: `Tightest wall gap is ${len(hall.dist)} — at least 36" to roll through.`,
      tip: 'Keep that path free of furniture too.',
      hit: { kind: 'wall', id: hall.a },
    });
  }

  const baths = (floor.rooms ?? []).filter((r) => r.kind === 'bath');
  if (baths.length === 0) {
    checks.push({
      id: 'turn',
      title: '5-foot turn in the bath',
      status: 'skip',
      detail: 'Name a bath and we’ll check for a 60" turning circle.',
      tip: 'Room tool → Bath → click inside the walls.',
    });
  } else {
    let worst: { roomId: string; status: AccessStatus; detail: string } | null = null;
    for (const room of baths) {
      const poly = roomPolygon(room, nodes, walls);
      if (!poly) {
        worst = {
          roomId: room.id,
          status: 'warn',
          detail: `${room.name} isn’t a closed shape yet — finish the walls.`,
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
          detail: `${room.name} can fit a 5'-0" turn (${len(minSide)} short side · ${Math.round(area)} sq ft).`,
        };
        if (!worst || worst.status === 'skip') worst = next;
      } else if (circleFitsInPoly(poly, ADA.turnWarnFt) || minSide >= ADA.turnWarnFt) {
        worst = {
          roomId: room.id,
          status: 'warn',
          detail: `${room.name} is tight (short side ${len(minSide)}). A 5'-0" circle is the usual turn.`,
        };
      } else {
        worst = {
          roomId: room.id,
          status: 'fail',
          detail: `${room.name} is only ${len(minSide)} on the short side. Wheelchairs need a 5'-0" turn.`,
        };
        break;
      }
    }
    const w = worst!;
    checks.push({
      id: 'turn',
      title: '5-foot turn in the bath',
      status: w.status,
      detail: w.detail,
      tip: 'Grow the bath, or keep the middle empty for the circle.',
      hit: { kind: 'room', id: w.roomId },
    });
  }

  const kitchen = furniture.filter((f) => KITCHEN_IDS.has(f.catalogId));
  if (kitchen.length < 2) {
    checks.push({
      id: 'kitchen',
      title: 'Kitchen aisle (40")',
      status: 'skip',
      detail: 'Place sink, stove, or fridge and we’ll check the work aisle.',
      tip: 'Leave about 3\'-4" between counters so someone can turn.',
    });
  } else {
    let minGap = Infinity;
    let a = kitchen[0];
    let b = kitchen[1];
    for (let i = 0; i < kitchen.length; i++) {
      for (let j = i + 1; j < kitchen.length; j++) {
        const gap = dist(kitchen[i], kitchen[j]) - (Math.max(kitchen[i].w, kitchen[i].h) + Math.max(kitchen[j].w, kitchen[j].h)) / 4;
        if (gap < minGap) {
          minGap = gap;
          a = kitchen[i];
          b = kitchen[j];
        }
      }
    }
    if (minGap + 1e-6 < ADA.kitchenAisleFt) {
      checks.push({
        id: 'kitchen',
        title: 'Kitchen aisle (40")',
        status: 'fail',
        detail: `${a.label} and ${b.label} are about ${len(Math.max(0, minGap))} apart. Work aisles like 40".`,
        tip: 'Spread the kitchen triangle. Sink · stove · fridge need room to work.',
        hit: { kind: 'furniture', id: a.id },
      });
    } else {
      checks.push({
        id: 'kitchen',
        title: 'Kitchen aisle (40")',
        status: 'pass',
        detail: `Kitchen pieces have about ${len(minGap)} between them.`,
        tip: 'That’s the work aisle. Keep it a path, not storage.',
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
