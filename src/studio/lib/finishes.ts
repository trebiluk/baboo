import type { Floor, Point, Room, Wall, WallFace, WallSkin } from '../types';
import { listInteriorFaces, pointInPoly, type Face } from './rooms';

/**
 * Room-by-room and wall-by-wall finishes (2.13.24).
 *
 * Every wall section has two faces. Face `a` is on the left going from end a to end b; face `b` is on the right.
 * A face that looks into a room follows that room's wall paint unless the face has its own. A face with no room
 * behind it (or a porch) is an outside face: it has a covering (brick, siding, stone, stucco, wood) and a paint.
 */
export type FaceSide = 'a' | 'b';

export const WALL_SKINS: { id: WallSkin; color: string; previewCss: string }[] = [
  { id: 'brick', color: '#A15A48', previewCss: 'repeating-linear-gradient(0deg,#A15A48 0 7px,#E8DCCB 7px 8px),#A15A48' },
  { id: 'siding', color: '#DCD6C8', previewCss: 'repeating-linear-gradient(0deg,#E4DED2 0 6px,#B8B2A6 6px 7px)' },
  { id: 'stone', color: '#A8A196', previewCss: 'radial-gradient(circle at 30% 30%,#B8B1A6 0 5px,transparent 6px),radial-gradient(circle at 75% 70%,#9A9388 0 5px,transparent 6px),#A8A196' },
  { id: 'stucco', color: '#E6DCC8', previewCss: 'radial-gradient(circle at 20% 40%,#EFE6D4 0 2px,transparent 3px),#E2D8C4' },
  { id: 'wood', color: '#9C7350', previewCss: 'repeating-linear-gradient(90deg,#A27A56 0 7px,#7E5A3C 7px 8px)' },
];

/** Paints for walls: the same names as furniture paint, so kids learn one list. */
export const WALL_PAINTS: { id: string; hex: string }[] = [
  { id: 'white', hex: '#F4F0E8' },
  { id: 'cream', hex: '#E8D4B0' },
  { id: 'blush', hex: '#E8B4B4' },
  { id: 'sun', hex: '#E8C04A' },
  { id: 'mint', hex: '#8FBEB0' },
  { id: 'sky', hex: '#7EB3D4' },
  { id: 'terra', hex: '#C47850' },
  { id: 'plum', hex: '#7A5A78' },
  { id: 'forest', hex: '#3A5234' },
  { id: 'navy', hex: '#3D4F6F' },
  { id: 'charcoal', hex: '#3A3F46' },
];

export function isWallSkin(v: unknown): v is WallSkin {
  return v === 'brick' || v === 'siding' || v === 'stone' || v === 'stucco' || v === 'wood';
}

function cleanHex(v: unknown): string | null {
  return typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v) ? v : null;
}

/** The face as stored, cleaned (a bad file never breaks the 3D). */
export function storedFace(wall: Wall, side: FaceSide): WallFace | null {
  const f = wall.faces?.[side];
  if (!f || typeof f !== 'object') return null;
  const paint = cleanHex(f.paint);
  const skin = isWallSkin(f.skin) ? f.skin : null;
  return paint || skin ? { paint, skin } : null;
}

/** Faces and which room each belongs to, worked out once per floor. */
export type FaceLookup = (wall: Wall, side: FaceSide) => Room | null;

export function faceLookup(floor: Pick<Floor, 'nodes' | 'walls' | 'rooms'>): FaceLookup {
  let faces: Face[] = [];
  try {
    faces = listInteriorFaces(floor.nodes, floor.walls);
  } catch {
    faces = [];
  }
  const rooms = floor.rooms ?? [];
  const faceRoom = faces.map((f) => rooms.find((r) => pointInPoly({ x: r.x, y: r.y }, f.poly)) ?? null);
  const nodes = new Map(floor.nodes.map((n) => [n.id, n]));
  const cache = new Map<string, Room | null>();
  return (wall, side) => {
    const key = `${wall.id}:${side}`;
    if (cache.has(key)) return cache.get(key) ?? null;
    const a = nodes.get(wall.a);
    const b = nodes.get(wall.b);
    let found: Room | null = null;
    if (a && b) {
      const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
      const s = side === 'a' ? 1 : -1;
      const off = (Math.max(0.35, wall.thickness || 0.45) / 2 + 0.6) * s;
      const p: Point = { x: (a.x + b.x) / 2 + (-(b.y - a.y) / len) * off, y: (a.y + b.y) / 2 + ((b.x - a.x) / len) * off };
      let best = -1;
      for (let i = 0; i < faces.length; i++) {
        if (!pointInPoly(p, faces[i].poly)) continue;
        if (best < 0 || faces[i].area < faces[best].area) best = i;
      }
      found = best >= 0 ? faceRoom[best] : null;
    }
    cache.set(key, found);
    return found;
  };
}

export interface ResolvedFace {
  side: FaceSide;
  /** The room this face looks into (null = outside). */
  room: Room | null;
  outside: boolean;
  /** Paint to use, or null for the default look. */
  paint: string | null;
  /** Outside covering, or null for the default look. */
  skin: WallSkin | null;
  /** True when the face has its own choice (not following its room). */
  own: boolean;
}

export function resolveFace(wall: Wall, side: FaceSide, roomOf: FaceLookup): ResolvedFace {
  const room = roomOf(wall, side);
  const outside = !room || room.kind === 'outdoor';
  const mine = storedFace(wall, side);
  const roomPaint = !outside ? cleanHex(room?.wallPaint) : null;
  const skin = outside
    ? (mine?.skin ?? (wall.kind === 'exterior' && wall.drawStyle === 'brick' ? 'brick' : null))
    : null;
  return { side, room, outside, paint: mine?.paint ?? roomPaint, skin, own: !!mine };
}

/** Both faces of a wall, inside first when there is one. */
export function wallFaces(wall: Wall, roomOf: FaceLookup): ResolvedFace[] {
  const both = [resolveFace(wall, 'a', roomOf), resolveFace(wall, 'b', roomOf)];
  return both.sort((x, y) => Number(x.outside) - Number(y.outside));
}

/** Merge one choice into a wall's faces (null clears the face). */
export function withFace(wall: Wall, side: FaceSide, patch: WallFace | null): Wall['faces'] {
  const prev = storedFace(wall, side);
  const next: WallFace | null = patch ? { ...(prev ?? {}), ...patch } : null;
  const clean = next && (next.paint || next.skin) ? { paint: next.paint ?? null, skin: next.skin ?? null } : null;
  return { ...(wall.faces ?? {}), [side]: clean };
}

/** Darken or lighten a hex for shading faces (k < 1 darker). */
export function shadeHex(hex: string, k: number): string {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(c * k)));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => f(c).toString(16).padStart(2, '0')).join('')}`;
}
