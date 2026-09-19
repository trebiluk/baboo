/**
 * Object snaps — the precision layer.
 *
 * Grid snap alone can only land on multiples of the grid, so a wall can never
 * meet the middle of another wall or square up to a corner that is off-grid.
 * These snaps latch onto the geometry that is already drawn, the way a drafting
 * program does: corner, middle, crossing, square-off, along-wall.
 *
 * Every snap reports a `kind` so the canvas can draw a distinct marker shape
 * and word for it — never colour alone.
 */
import type { Node, Point, Wall } from '../types';
/* Explicit extension: the unit tests run straight through node's type stripping. */
import { dist, projectOnSegment, snapPoint, snapWallEnd } from './geometry.ts';

export type OsnapKind = 'endpoint' | 'midpoint' | 'cross' | 'perp' | 'onwall';

export type OsnapHit = {
  p: Point;
  kind: OsnapKind;
  /** Distance from the cursor, in plan-feet. */
  d: number;
  wallId?: string;
};

export type Seg = { id: string; a: Point; b: Point };

/** A dashed line-up guide: the cursor shares an axis with `anchor`. */
export type AlignGuide = { axis: 'x' | 'y'; anchor: Point; at: number };

/** Corner beats middle beats crossing beats square-off beats along-wall. */
const RANK: Record<OsnapKind, number> = {
  endpoint: 0,
  midpoint: 1,
  cross: 2,
  perp: 3,
  onwall: 4,
};

export function wallSegs(walls: Wall[], nodes: Node[]): Seg[] {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const out: Seg[] = [];
  for (const w of walls) {
    const a = byId.get(w.a);
    const b = byId.get(w.b);
    if (!a || !b) continue;
    if (dist(a, b) < 1e-6) continue;
    out.push({ id: w.id, a: { x: a.x, y: a.y }, b: { x: b.x, y: b.y } });
  }
  return out;
}

/** Proper crossing of two segments. Null when parallel or when they only touch beyond an end. */
export function segIntersect(s1: Seg, s2: Seg): Point | null {
  const r = { x: s1.b.x - s1.a.x, y: s1.b.y - s1.a.y };
  const s = { x: s2.b.x - s2.a.x, y: s2.b.y - s2.a.y };
  const denom = r.x * s.y - r.y * s.x;
  if (Math.abs(denom) < 1e-9) return null;
  const qp = { x: s2.a.x - s1.a.x, y: s2.a.y - s1.a.y };
  const t = (qp.x * s.y - qp.y * s.x) / denom;
  const u = (qp.x * r.y - qp.y * r.x) / denom;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  return { x: s1.a.x + r.x * t, y: s1.a.y + r.y * t };
}

/** Foot of the perpendicular from `from` onto the segment, if it lands on the segment. */
export function perpFoot(seg: Seg, from: Point): Point | null {
  const dx = seg.b.x - seg.a.x;
  const dy = seg.b.y - seg.a.y;
  const len2 = dx * dx + dy * dy;
  if (len2 < 1e-9) return null;
  const t = ((from.x - seg.a.x) * dx + (from.y - seg.a.y) * dy) / len2;
  if (t < 0 || t > 1) return null;
  return { x: seg.a.x + dx * t, y: seg.a.y + dy * t };
}

export type OsnapOpts = {
  /** Pull radius in plan-feet — the canvas derives this from zoom so it feels constant on screen. */
  tol: number;
  /** Anchor of the run in progress. Enables the square-off snap. */
  from?: Point | null;
  /** Walls to ignore, e.g. the one being dragged. */
  skip?: Set<string>;
  /** Corners to prefer even when no wall uses them yet. */
  nodes?: Point[];
};

/**
 * Best snap within `tol` of the cursor, or null.
 * Ties break by rank first so a corner always wins over the wall it sits on.
 */
export function findOsnap(cursor: Point, segs: Seg[], opts: OsnapOpts): OsnapHit | null {
  const { tol } = opts;
  if (tol <= 0) return null;
  const skip = opts.skip;
  const live = skip ? segs.filter((s) => !skip.has(s.id)) : segs;

  let best: OsnapHit | null = null;
  const offer = (p: Point, kind: OsnapKind, wallId?: string) => {
    const d = dist(cursor, p);
    if (d > tol) return;
    if (!best || RANK[kind] < RANK[best.kind] || (RANK[kind] === RANK[best.kind] && d < best.d)) {
      best = { p, kind, d, wallId };
    }
  };

  for (const s of live) {
    offer(s.a, 'endpoint', s.id);
    offer(s.b, 'endpoint', s.id);
    offer({ x: (s.a.x + s.b.x) / 2, y: (s.a.y + s.b.y) / 2 }, 'midpoint', s.id);
  }
  for (const n of opts.nodes ?? []) offer(n, 'endpoint');

  /* Crossings and square-offs only matter for walls the cursor is already near. */
  const near = live.filter((s) => projectOnSegment(s.a, s.b, cursor).d <= tol * 2.5);
  for (let i = 0; i < near.length; i++) {
    for (let j = i + 1; j < near.length; j++) {
      const x = segIntersect(near[i], near[j]);
      if (x) offer(x, 'cross', near[i].id);
    }
  }
  if (opts.from) {
    for (const s of near) {
      const foot = perpFoot(s, opts.from);
      if (foot) offer(foot, 'perp', s.id);
    }
  }
  for (const s of near) {
    offer(projectOnSegment(s.a, s.b, cursor).q, 'onwall', s.id);
  }
  return best;
}

/**
 * Line-up guides: pull the cursor onto the x or y of a corner that is already drawn,
 * so a new wall ends flush with one across the room.
 *
 * `axes` limits which axes may move — a wall locked horizontal can only slide in x.
 */
export function alignSnap(
  cursor: Point,
  anchors: Point[],
  tol: number,
  axes: { x: boolean; y: boolean } = { x: true, y: true },
): { p: Point; guides: AlignGuide[] } {
  const out = { x: cursor.x, y: cursor.y };
  const guides: AlignGuide[] = [];
  if (tol <= 0) return { p: out, guides };

  let bestX: { a: Point; d: number } | null = null;
  let bestY: { a: Point; d: number } | null = null;
  for (const a of anchors) {
    const dx = Math.abs(a.x - cursor.x);
    const dy = Math.abs(a.y - cursor.y);
    if (axes.x && dx <= tol && (!bestX || dx < bestX.d)) bestX = { a, d: dx };
    if (axes.y && dy <= tol && (!bestY || dy < bestY.d)) bestY = { a, d: dy };
  }
  if (bestX) {
    out.x = bestX.a.x;
    guides.push({ axis: 'x', anchor: bestX.a, at: bestX.a.x });
  }
  if (bestY) {
    out.y = bestY.a.y;
    guides.push({ axis: 'y', anchor: bestY.a, at: bestY.a.y });
  }
  return { p: out, guides };
}

export type ResolveCtx = {
  segs: Seg[];
  nodes: Point[];
  /** Pull radius in plan-feet. */
  tol: number;
  osnap: boolean;
  /** Anchor of the run in progress; null for a first click. */
  from?: Point | null;
  skip?: Set<string>;
  ortho: boolean;
  forceOrtho: boolean;
  snap: boolean;
  gridSize: number;
};

export type Resolved = {
  p: Point;
  osnap: OsnapHit | null;
  guides: AlignGuide[];
};

const AXIS_EPS = 1e-6;

/**
 * One place decides where a click actually lands.
 *
 * Object snap wins outright — it is the most specific thing the user can mean.
 * Otherwise the usual angle + grid snap runs, and line-up guides may still slide
 * the point along whichever axis the angle lock left free.
 */
export function resolveDrawPoint(cursor: Point, ctx: ResolveCtx): Resolved {
  if (ctx.osnap) {
    const hit = findOsnap(cursor, ctx.segs, {
      tol: ctx.tol,
      from: ctx.from,
      skip: ctx.skip,
      nodes: ctx.nodes,
    });
    if (hit) return { p: hit.p, osnap: hit, guides: [] };
  }

  const from = ctx.from;
  const base = from
    ? snapWallEnd(from, cursor, {
      ortho: ctx.ortho,
      forceOrtho: ctx.forceOrtho,
      snap: ctx.snap,
      gridSize: ctx.gridSize,
    })
    : snapPoint(cursor, ctx.gridSize, ctx.snap);

  if (!ctx.osnap) return { p: base, osnap: null, guides: [] };

  /* An angle lock pins one axis; only the other one may slide onto a guide. */
  const locked = from && (ctx.forceOrtho || ctx.ortho);
  const axes = locked
    ? {
      x: Math.abs(base.y - from.y) < AXIS_EPS,
      y: Math.abs(base.x - from.x) < AXIS_EPS,
    }
    : { x: true, y: true };
  if (locked && !axes.x && !axes.y) return { p: base, osnap: null, guides: [] };

  const aligned = alignSnap(base, ctx.nodes, ctx.tol, axes);
  return { p: aligned.p, osnap: null, guides: aligned.guides };
}

/** Angle of a run in degrees, measured the way a protractor reads: 0 right, 90 up. */
export function headingDeg(from: Point, to: Point): number {
  const deg = (Math.atan2(-(to.y - from.y), to.x - from.x) * 180) / Math.PI;
  return deg < 0 ? deg + 360 : deg + 0;
}

/** Trig dust would leave a typed 12' wall at 11.999999999'. */
function tidy(v: number): number {
  return Math.round(v * 1e6) / 1e6 + 0;
}

/** Endpoint of a run given an exact length and protractor angle. */
export function polarPoint(from: Point, length: number, deg: number): Point {
  const rad = (deg * Math.PI) / 180;
  return {
    x: tidy(from.x + Math.cos(rad) * length),
    y: tidy(from.y - Math.sin(rad) * length),
  };
}
