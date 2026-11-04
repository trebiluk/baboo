import type { Floor, Opening, ProjectDocument, StyleId, StyleTemplate, Wall, Node, FurnitureItem, Room, RoomKind, LandscapeItem, PlantKind, FloorFinishId, WallSkin, WallTintId } from '../types';
import { DEFAULT_ROOF_BY_STYLE, roofStyleName } from './roofs';
import { exteriorBounds, generateRoof } from '../lib/roof';
import { APP_VERSION } from '../version';
import { uid } from '../lib/geometry';
import { defaultTinyHomeTypology } from './typology';
import { DEFAULT_WALL_HEIGHT_FT } from '../lib/wallDraft';

export const STYLE_TEMPLATES: StyleTemplate[] = [
  { id: 'blank', name: 'Blank', blurb: 'Start empty · draw your own walls.' },
  { id: 'colonial', name: 'Colonial', blurb: 'Balanced house · doors in the middle · rooms left and right.' },
  { id: 'arts-crafts', name: 'Arts & Crafts', blurb: 'Cozy porch house · rooms inside · a walk and trees outside.' },
  { id: 'greek-revival', name: 'Greek Revival', blurb: 'Fancy front · tall entry · balanced sides.' },
  { id: 'hobbit', name: 'Hobbit', blurb: 'Storybook cottage · round door · green living roof.' },
  { id: 'ranch', name: 'Ranch', blurb: 'Long one-story · rooms in a line · yard all around.' },
  { id: 'victorian', name: 'Victorian', blurb: 'Tall fancy house · steep fancy roof (mansard).' },
  { id: 'mansion', name: 'The Mansion', blurb: 'Victorian mansion · brick, bay window, columns, and grounds.' },
  { id: 'cape-cod', name: 'Cape Cod', blurb: 'Compact rectangle — steep gable feel, simple rooms.' },
  { id: 'modern', name: 'Modern', blurb: 'Clean rectangle — open plan, flat roof default.' },
  { id: 'tudor', name: 'Tudor', blurb: 'Compact L-ish starter — steep gable vocabulary.' },
  { id: 'yurt', name: 'Yurt', blurb: 'Round tent-house · cone roof · open middle.' },
  { id: 'tiny-home', name: 'Tiny Home', blurb: 'Small contest house · trailer or container type · checklist of parts.', badge: 'Contest' },
  { id: 'dog-house', name: 'Dog House', blurb: 'Baboo’s contest · a snug outdoor den · she judges from the book.', badge: 'Contest' },
];

function emptyFloor(name = 'Floor 1'): Floor {
  return {
    id: uid('fl'),
    name,
    elevation: 0,
    nodes: [],
    walls: [],
    openings: [],
    furniture: [],
    rooms: [],
    dimensions: [],
    notes: [],
    landscape: [],
    sketches: [],
    roof: null,
    layers: { structure: true, openings: true, furniture: true, rooms: true, dims: true, landscape: false, sketch: true, roof: true },
  };
}

function rectPlan(
  ox: number, oy: number, w: number, h: number, kind: Wall['kind'] = 'exterior',
): { nodes: Node[]; walls: Wall[] } {
  const n1 = { id: uid('n'), x: ox, y: oy };
  const n2 = { id: uid('n'), x: ox + w, y: oy };
  const n3 = { id: uid('n'), x: ox + w, y: oy + h };
  const n4 = { id: uid('n'), x: ox, y: oy + h };
  const nodes = [n1, n2, n3, n4];
  const thick = kind === 'exterior' ? 0.5 : 0.35;
  const walls: Wall[] = [
    { id: uid('w'), a: n1.id, b: n2.id, kind, thickness: thick },
    { id: uid('w'), a: n2.id, b: n3.id, kind, thickness: thick },
    { id: uid('w'), a: n3.id, b: n4.id, kind, thickness: thick },
    { id: uid('w'), a: n4.id, b: n1.id, kind, thickness: thick },
  ];
  return { nodes, walls };
}

function doorOn(wallId: string, t = 0.5, width = 3): Opening {
  return { id: uid('o'), wallId, t, width, type: 'door', symbolKind: 'swingDoor', swing: 'left' };
}
function slideOn(wallId: string, t = 0.5, width = 6): Opening {
  return { id: uid('o'), wallId, t, width, type: 'door', symbolKind: 'slidingDoor' };
}
function windowOn(wallId: string, t = 0.5, width = 3): Opening {
  return { id: uid('o'), wallId, t, width, type: 'window', symbolKind: 'windowFixed' };
}

function artsCraftsPlan(): { nodes: Node[]; walls: Wall[]; openings: Opening[] } {
  const nNW = { id: uid('n'), x: 0, y: 4 };
  const nPL = { id: uid('n'), x: 8, y: 4 };
  const nPR = { id: uid('n'), x: 20, y: 4 };
  const nNE = { id: uid('n'), x: 28, y: 4 };
  const nSE = { id: uid('n'), x: 28, y: 24 };
  const nSW = { id: uid('n'), x: 0, y: 24 };
  const nPFL = { id: uid('n'), x: 8, y: 0 };
  const nPFR = { id: uid('n'), x: 20, y: 0 };
  const nodes = [nNW, nPL, nPR, nNE, nSE, nSW, nPFL, nPFR];
  const T = 0.55;
  const wall = (a: Node, b: Node): Wall => ({
    id: uid('w'), a: a.id, b: b.id, kind: 'exterior', thickness: T,
  });
  const frontLeft = wall(nNW, nPL);
  const frontEntry = wall(nPL, nPR);
  const frontRight = wall(nPR, nNE);
  const right = wall(nNE, nSE);
  const back = wall(nSE, nSW);
  const left = wall(nSW, nNW);
  const porchLeft = wall(nPFL, nPL);
  const porchFront = wall(nPFL, nPFR);
  const porchRight = wall(nPFR, nPR);
  const walls = [frontLeft, frontEntry, frontRight, right, back, left, porchLeft, porchFront, porchRight];
  const openings = [
    doorOn(frontEntry.id, 0.5, 3.5),
    windowOn(frontLeft.id, 0.5, 3),
    windowOn(frontRight.id, 0.5, 3),
    windowOn(right.id, 0.3, 4),
    windowOn(right.id, 0.8, 3),
    windowOn(back.id, 0.25, 4),
    windowOn(back.id, 0.75, 4),
    windowOn(left.id, 0.2, 3),
    windowOn(left.id, 0.65, 4),
    windowOn(porchFront.id, 0.5, 3),
  ];
  return { nodes, walls, openings };
}

function polygonPlan(cx: number, cy: number, r: number, sides: number, thick = 0.5): { nodes: Node[]; walls: Wall[] } {
  const nodes: Node[] = [];
  for (let i = 0; i < sides; i++) {
    const a = (Math.PI * 2 * i) / sides - Math.PI / 2;
    nodes.push({ id: uid('n'), x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
  }
  const walls: Wall[] = nodes.map((n, i) => ({
    id: uid('w'),
    a: n.id,
    b: nodes[(i + 1) % nodes.length].id,
    kind: 'exterior' as const,
    thickness: thick,
  }));
  return { nodes, walls };
}

function furn(catalogId: string, x: number, y: number, w: number, h: number, label: string, rot = 0, color?: string): FurnitureItem {
  return { id: uid('f'), catalogId, x, y, w, h, rot, zIndex: 1, label, ...(color ? { color } : {}) };
}

function plant(kind: PlantKind, x: number, y: number, w: number, h: number, label: string): LandscapeItem {
  return { id: uid('p'), kind, x, y, w, h, rot: 0, label };
}

/** A walk to the front door, two trees, and a flower bed. Outside the walls. */
function furnishYard(floor: Floor) {
  const b = exteriorBounds(floor.nodes, floor.walls);
  if (!b) return;
  const door = floor.openings.find((o) => o.type === 'door');
  let dx = (b.minX + b.maxX) / 2;
  let dy = b.minY;
  if (door) {
    const wall = floor.walls.find((w) => w.id === door.wallId);
    const a = floor.nodes.find((n) => n.id === wall?.a);
    const c = floor.nodes.find((n) => n.id === wall?.b);
    if (a && c) {
      dx = a.x + (c.x - a.x) * (door.t ?? 0.5);
      dy = a.y + (c.y - a.y) * (door.t ?? 0.5);
    }
  }
  const cx = (b.minX + b.maxX) / 2;
  const cy = (b.minY + b.maxY) / 2;
  const vx = dx - cx;
  const vy = dy - cy;
  const len = Math.hypot(vx, vy) || 1;
  const ux = vx / len;
  const uy = vy / len;
  const span = 10;
  const wide = Math.abs(ux) > Math.abs(uy);
  floor.landscape = [
    plant('path', dx + ux * (span / 2 + 1.2), dy + uy * (span / 2 + 1.2), wide ? span : 3.2, wide ? 3.2 : span, 'Walk'),
    plant('tree', b.minX - 5, b.minY - 3, 6, 6, 'Tree'),
    plant('tree', b.maxX + 5, b.maxY + 3, 6, 6, 'Tree'),
    plant('bed', dx + ux * 7 - uy * 5, dy + uy * 7 + ux * 5, 7, 3, 'Flowers'),
  ];
  floor.layers = { ...floor.layers, landscape: true };
}

function room(kind: RoomKind, x: number, y: number, name?: string, floorFinishId?: FloorFinishId): Room {
  const names: Record<RoomKind, string> = {
    entry: 'Entry', living: 'Living', kitchen: 'Kitchen', dining: 'Dining',
    bedroom: 'Bedroom', bath: 'Bath', office: 'Office', utility: 'Utility',
    storage: 'Storage', outdoor: 'Outdoor', other: 'Other',
  };
  return { id: uid('rm'), kind, name: name ?? names[kind], x, y, floorFinishId };
}

/** Evaluation house: a closed Victorian mansion with grounds. */
function buildMansion(floor: Floor) {
  const N = (x: number, y: number): Node => ({ id: uid('n'), x, y });
  const pFL = N(18, 0);
  const pFR = N(38, 0);
  const fL = N(0, 8);
  const hL = N(22, 8);
  const hR = N(34, 8);
  const fR = N(56, 8);
  const midL = N(0, 24);
  const parR = N(22, 24);
  const dinL = N(34, 24);
  const kSplit = N(46, 24);
  const midR = N(56, 24);
  const stL = N(22, 28);
  const stR = N(34, 28);
  const bL = N(0, 40);
  const bHL = N(22, 40);
  const bHR = N(34, 40);
  const bBath = N(46, 40);
  const bR = N(56, 40);
  const W = (a: Node, b: Node, kind: Wall['kind'] = 'exterior', levels?: number): Wall => ({
    id: uid('w'), a: a.id, b: b.id, kind,
    thickness: kind === 'exterior' ? 0.55 : 0.35,
    drawStyle: kind === 'exterior' ? 'brick' : 'outline',
    ...(kind === 'exterior' ? { levels: levels ?? 2 } : {}),
  });
  const bayA = N(3, 8);
  const bayB = N(3, 4.2);
  const bayC = N(15, 4.2);
  const bayD = N(15, 8);
  const porchFront = W(pFL, pFR, 'exterior', 1);
  const porchLeft = W(pFL, hL, 'exterior', 1);
  const porchRight = W(pFR, hR, 'exterior', 1);
  const frontFar = W(fL, bayA);
  const baySideL = W(bayA, bayB);
  const bayFront = W(bayB, bayC);
  const baySideR = W(bayC, bayD);
  const frontNear = W(bayD, hL);
  const frontDoor = W(hL, hR);
  const frontR = W(hR, fR);
  const rightL = W(fR, midR);
  const rightU = W(midR, bR);
  const backR = W(bR, bBath);
  const backBath = W(bBath, bHR);
  const backStair = W(bHR, bHL);
  const backLib = W(bHL, bL);
  const leftU = W(bL, midL);
  const leftL = W(midL, fL);
  const parLib = W(midL, parR, 'interior');
  const hallPar = W(hL, parR, 'interior');
  const hallDin = W(hR, dinL, 'interior');
  const galL = W(parR, stL, 'interior');
  const galR = W(dinL, stR, 'interior');
  const stairFront = W(stL, stR, 'interior');
  const stairL = W(stL, bHL, 'interior');
  const stairR = W(stR, bHR, 'interior');
  const dinKit = W(dinL, kSplit, 'interior');
  const dinBath = W(kSplit, midR, 'interior');
  const bathWall = W(kSplit, bBath, 'interior');
  floor.nodes = [pFL, pFR, fL, bayA, bayB, bayC, bayD, hL, hR, fR, midL, parR, dinL, kSplit, midR, stL, stR, bL, bHL, bHR, bBath, bR];
  floor.walls = [
    porchFront, porchLeft, porchRight, frontFar, baySideL, bayFront, baySideR, frontNear, frontDoor, frontR, rightL, rightU,
    backR, backBath, backStair, backLib, leftU, leftL,
    parLib, hallPar, hallDin, galL, galR, stairFront, stairL, stairR, dinKit, dinBath, bathWall,
  ];
  floor.openings = [
    slideOn(porchFront.id, 0.5, 8),
    doorOn(frontDoor.id, 0.5, 3.5),
    // sidelights by the front door and a window over the parlor wall: a full row of windows upstairs (2.13.20)
    windowOn(frontDoor.id, 0.14, 1.6),
    windowOn(frontDoor.id, 0.86, 1.6),
    windowOn(frontNear.id, 0.5, 3),
    windowOn(bayFront.id, 0.5, 6),
    windowOn(baySideL.id, 0.55, 2.4),
    windowOn(baySideR.id, 0.55, 2.4),
    windowOn(frontR.id, 0.3, 4),
    windowOn(frontR.id, 0.72, 4),
    windowOn(rightL.id, 0.45, 4),
    windowOn(rightU.id, 0.4, 3),
    windowOn(leftL.id, 0.5, 4),
    windowOn(leftU.id, 0.55, 3),
    windowOn(backLib.id, 0.5, 4),
    windowOn(backR.id, 0.5, 3),
    doorOn(hallPar.id, 0.55, 2.8),
    doorOn(hallDin.id, 0.45, 2.8),
    doorOn(parLib.id, 0.62, 2.6),
    doorOn(dinKit.id, 0.5, 2.6),
    doorOn(bathWall.id, 0.3, 2.4),
    { ...doorOn(stairFront.id, 0.5, 3), swing: 'right' }, // opens into the hall, away from the bottom step (2.13.63)
  ];
  floor.furniture = [
    furn('rug', 11, 16, 12, 8, 'Parlor rug'),
    furn('sofa', 11, 12, 7, 3, 'Settee', 0, '#6E2E3A'),
    // armchairs turn in toward the coffee table (2.13.34)
    furn('chair', 5, 18, 2.5, 2.5, 'Armchair', -Math.PI / 2, '#6E2E3A'),
    furn('chair', 17, 18, 2.5, 2.5, 'Armchair', Math.PI / 2, '#4A3A28'),
    furn('coffee-table', 11, 15.2, 4, 2, 'Table'),
    furn('fireplace', 11, 22.3, 6, 1.2, 'Fireplace'),
    furn('fireplace', 45, 22.3, 6, 1.2, 'Fireplace'),
    furn('floor-lamp', 3.4, 11, 1.2, 1.2, 'Lamp'),
    furn('sconce', 3, 16, 0.8, 0.5, 'Sconce'),
    furn('sconce', 19, 16, 0.8, 0.5, 'Sconce'),
    furn('wainscot', 11, 9.2, 16, 0.35, 'Paneling'),
    furn('desk', 8, 32, 4, 2, 'Library desk'),
    furn('chair', 8, 34.4, 1.6, 1.6, 'Desk chair', 0, '#5C4030'),
    furn('storage-shelf', 4, 38.2, 3, 1.3, 'Bookcase'),
    furn('floor-lamp', 16, 34, 1.2, 1.2, 'Reading lamp'),
    furn('rug', 28, 18, 4.5, 10, 'Hall runner', 0, '#1E3A5F'),
    furn('chandelier', 28, 16, 3.2, 3.2, 'Hall chandelier'),
    furn('sconce', 23.2, 12, 0.7, 0.45, 'Sconce'),
    furn('sconce', 32.8, 12, 0.7, 0.45, 'Sconce'),
    furn('banister', 24.9, 34.2, 0.3, 8, 'Banister'), // the stair rail, beside the steps (2.13.63)
    furn('stairs', 28, 34.2, 5.2, 8, 'Stairs'),
    furn('dining-table', 45, 15, 8, 3.6, 'Dining table'),
    furn('dining-chair', 42, 12.6, 1.5, 1.5, 'Chair'),
    furn('dining-chair', 48, 12.6, 1.5, 1.5, 'Chair'),
    // the far-side chairs turn to face the table (2.13.34)
    furn('dining-chair', 42, 17.4, 1.5, 1.5, 'Chair', Math.PI),
    furn('dining-chair', 48, 17.4, 1.5, 1.5, 'Chair', Math.PI),
    furn('chandelier', 45, 15, 3.4, 3.4, 'Dining chandelier'),
    furn('wainscot', 45, 9.2, 14, 0.35, 'Paneling'),
    furn('stove', 38, 36.5, 2.5, 2.2, 'Range'),
    furn('sink', 42.5, 37.2, 3, 1.6, 'Sink'),
    furn('fridge', 40, 29, 3, 2.2, 'Ice box'),
    furn('bathtub', 51.2, 36, 4, 2.3, 'Tub'),
    furn('toilet', 52.2, 27.5, 1.5, 2.2, 'WC'),
    furn('window-seat', 9, 6.15, 8, 1.5, 'Window seat', 0, '#6E2E3A'),
    furn('painting', 11, 21.5, 3.4, 0.22, 'Portrait'),
    furn('column', 20.2, 1.3, 0.7, 0.7, 'Column'),
    furn('column', 24.6, 1.3, 0.7, 0.7, 'Column'),
    furn('column', 31.4, 1.3, 0.7, 0.7, 'Column'),
    furn('column', 35.8, 1.3, 0.7, 0.7, 'Column'),
  ];
  floor.rooms = [
    room('outdoor', 28, 4, 'Porch', 'brick'),
    room('living', 11, 16, 'Parlor', 'herringbone'),
    room('office', 11, 32, 'Library', 'carpet'),
    room('entry', 28, 21, 'Hall', 'marble'),
    room('other', 24.2, 38.4, 'Stair hall', 'oak'),
    room('dining', 45, 15, 'Dining room', 'walnut'),
    room('kitchen', 40, 32, 'Kitchen', 'checker'),
    room('bath', 51, 33, 'Bath', 'hex'),
  ];
  floor.landscape = [
    plant('path', 28, -8, 4.2, 14, 'Carriage walk'),
    plant('hedge', 9, -1.2, 16, 2.2, 'Box hedge'),
    plant('hedge', 47, -1.2, 16, 2.2, 'Box hedge'),
    plant('hedge', 28, 46, 36, 2.2, 'Back hedge'),
    plant('hedge', -2, 24, 2.2, 18, 'Side hedge'),
    plant('hedge', 58, 24, 2.2, 18, 'Side hedge'),
    plant('lamp', 14, -6, 1.2, 1.2, 'Lamppost'),
    plant('lamp', 42, -6, 1.2, 1.2, 'Lamppost'),
    // outside the side hedges, not in the parlor and dining room (2.13.31)
    plant('lamp', -4, 38, 1.2, 1.2, 'Lamppost'),
    plant('lamp', 60, 38, 1.2, 1.2, 'Lamppost'),
    plant('tree', 8, -10, 8, 8, 'Oak'),
    plant('tree', 48, -10, 8, 8, 'Elm'),
    plant('tree', -6, 12, 7, 7, 'Beech'),
    plant('tree', 62, 12, 7, 7, 'Maple'),
    plant('tree', 6, 48, 8, 8, 'Oak'),
    plant('tree', 50, 48, 8, 8, 'Chestnut'),
    plant('bed', 8, 1.6, 6, 2.4, 'Roses'),
    plant('bed', 48, 3, 7, 3, 'Lilies'),
    plant('bed', 28, 44, 10, 3, 'Border'),
  ];
  floor.layers = { ...floor.layers, landscape: true, rooms: true, furniture: true };
}

/**
 * Each starter house wears its own outside, so they do not all look like the same beige box (2.13.41).
 * The colour is the house wall colour (Settings), so students can still repaint it.
 */
const STYLE_LOOK: Partial<Record<StyleId, { skin: WallSkin; tint: WallTintId }>> = {
  colonial: { skin: 'brick', tint: 'white' },
  'arts-crafts': { skin: 'siding', tint: 'sage' },
  'greek-revival': { skin: 'siding', tint: 'white' },
  hobbit: { skin: 'stone', tint: 'cream' },
  ranch: { skin: 'stucco', tint: 'clay' },
  victorian: { skin: 'siding', tint: 'blush' },
  'cape-cod': { skin: 'wood', tint: 'white' },
  modern: { skin: 'stucco', tint: 'white' },
  tudor: { skin: 'stucco', tint: 'cream' },
};

/**
 * Where an inside wall ends on an outside wall, split the outside wall there, so each room is a closed shape:
 * that is what lets every room get its own size, floor and paint (2.13.42). Doors and windows keep their place.
 */
function splitAtJunctions(floor: Floor) {
  const at = new Map(floor.nodes.map((n) => [n.id, n]));
  const out: Wall[] = [];
  const moved = new Map<string, { id: string; t0: number; t1: number }[]>();
  for (const w of floor.walls) {
    const a = at.get(w.a);
    const b = at.get(w.b);
    if (!a || !b) { out.push(w); continue; }
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    const cuts = floor.nodes
      .filter((n) => n.id !== w.a && n.id !== w.b)
      .map((n) => {
        const t = ((n.x - a.x) * (b.x - a.x) + (n.y - a.y) * (b.y - a.y)) / (len * len);
        const off = Math.abs((n.x - a.x) * (b.y - a.y) - (n.y - a.y) * (b.x - a.x)) / len;
        return { n, t, off };
      })
      .filter((c) => c.t > 0.01 && c.t < 0.99 && c.off < 0.05 && floor.walls.some((o) => o !== w && (o.a === c.n.id || o.b === c.n.id)))
      .sort((p, q) => p.t - q.t);
    if (!cuts.length) { out.push(w); continue; }
    const stops = [{ id: w.a, t: 0 }, ...cuts.map((c) => ({ id: c.n.id, t: c.t })), { id: w.b, t: 1 }];
    const parts: { id: string; t0: number; t1: number }[] = [];
    for (let i = 0; i < stops.length - 1; i++) {
      const id = i === 0 ? w.id : uid('w');
      out.push({ ...w, id, a: stops[i].id, b: stops[i + 1].id });
      parts.push({ id, t0: stops[i].t, t1: stops[i + 1].t });
    }
    moved.set(w.id, parts);
  }
  floor.walls = out;
  floor.openings = floor.openings.map((o) => {
    const parts = moved.get(o.wallId);
    if (!parts) return o;
    const p = parts.find((q) => o.t >= q.t0 && o.t <= q.t1) ?? parts[parts.length - 1];
    return { ...o, wallId: p.id, t: (o.t - p.t0) / Math.max(1e-6, p.t1 - p.t0) };
  });
}

function dressOutside(styleId: StyleId, floor: Floor): WallTintId {
  const look = STYLE_LOOK[styleId];
  if (!look) return 'sand';
  floor.walls = floor.walls.map((w) => {
    if (w.kind !== 'exterior') return w;
    // the covering only shows on the outside face; inside faces keep their room's paint
    const faces = { a: { paint: null, skin: look.skin }, b: { paint: null, skin: look.skin } };
    return look.skin === 'brick' ? { ...w, drawStyle: 'brick', faces } : { ...w, faces };
  });
  return look.tint;
}

export function buildTemplateProject(styleId: StyleId, title?: string): ProjectDocument {
  const now = new Date().toISOString();
  const floor = emptyFloor();
  const style = STYLE_TEMPLATES.find((s) => s.id === styleId) ?? STYLE_TEMPLATES[0];
  const challengeIds = ['ch-scale-room', 'ch-openings', 'C-ROOF-NAME'];
  let assignmentId: string | undefined;

  if (styleId === 'colonial') {
    const outer = rectPlan(0, 0, 36, 24);
    const midA = { id: uid('n'), x: 18, y: 0 };
    const midB = { id: uid('n'), x: 18, y: 24 };
    outer.nodes.push(midA, midB);
    const hall: Wall = { id: uid('w'), a: midA.id, b: midB.id, kind: 'interior', thickness: 0.35 };
    outer.walls.push(hall);
    floor.nodes = outer.nodes;
    floor.walls = outer.walls;
    floor.openings = [
      // the front door sat on the centre wall; it opens into the living room now, with windows across the front (2.13.42)
      doorOn(outer.walls[0].id, 0.38, 3.5),
      windowOn(outer.walls[0].id, 0.15, 3),
      windowOn(outer.walls[0].id, 0.75, 3),
      windowOn(outer.walls[0].id, 0.9, 3),
      windowOn(outer.walls[2].id, 0.25, 4),
      windowOn(outer.walls[2].id, 0.75, 4),
      windowOn(outer.walls[1].id, 0.5, 3),
      windowOn(outer.walls[3].id, 0.5, 3),
      doorOn(hall.id, 0.35, 2.5),
      doorOn(hall.id, 0.7, 2.5),
    ];
    floor.furniture = [
      furn('sofa', 9, 12, 7, 3, 'Sofa'),
      furn('dining-table', 27, 12, 5, 3, 'Dining Table'),
      furn('closet', 9, 4, 4, 2, 'Closet'),
      furn('water-heater', 30, 20, 2, 2, 'Water Heater'),
    ];
    floor.rooms = [
      room('living', 9, 12),
      room('dining', 27, 12),
    ];
  } else if (styleId === 'arts-crafts') {
    // Living room across the front; a bedroom and a kitchen behind it (2.13.43).
    const ac = artsCraftsPlan();
    const hL = { id: uid('n'), x: 0, y: 15 };
    const hM = { id: uid('n'), x: 14, y: 15 };
    const hR = { id: uid('n'), x: 28, y: 15 };
    const hB = { id: uid('n'), x: 14, y: 24 };
    const across: Wall = { id: uid('w'), a: hL.id, b: hR.id, kind: 'interior', thickness: 0.35 };
    const split: Wall = { id: uid('w'), a: hM.id, b: hB.id, kind: 'interior', thickness: 0.35 };
    floor.nodes = [...ac.nodes, hL, hM, hR, hB];
    floor.walls = [...ac.walls, across, split];
    floor.openings = [
      ...ac.openings,
      doorOn(across.id, 0.25, 2.5),
      doorOn(across.id, 0.75, 2.5),
    ];
    floor.furniture = [
      furn('sofa', 10, 11.5, 7, 3, 'Sofa'),
      furn('coffee-table', 10, 8, 4, 2, 'Coffee Table'),
      furn('chair', 22, 9, 2.5, 2.5, 'Armchair', Math.PI / 2),
      furn('storage-shelf', 3, 6, 3, 1.5, 'Bookcase'),
      furn('bed-queen', 3.2, 20.4, 5, 6.5, 'Bed'), // clear of the door swing (2.13.63)
      furn('nightstand', 1.2, 17.2, 1.5, 1.5, 'Nightstand'),
      furn('fridge', 26.2, 22.6, 3, 2.5, 'Fridge'),
      furn('stove', 22.5, 22.6, 2.5, 2.5, 'Stove'),
      furn('sink', 19, 22.8, 2.5, 2, 'Sink'),
    ];
    floor.rooms = [
      room('entry', 14, 2, 'Porch'),
      room('living', 17, 6),
      room('bedroom', 11, 21, undefined, 'carpet'),
      room('kitchen', 21, 18, undefined, 'tile'),
    ];
  } else if (styleId === 'greek-revival') {
    // A centre hall with a parlor and a dining room on either side, windows on every side (2.13.42).
    const outer = rectPlan(0, 0, 32, 20);
    const lA = { id: uid('n'), x: 11, y: 0 };
    const lB = { id: uid('n'), x: 11, y: 20 };
    const rA = { id: uid('n'), x: 21, y: 0 };
    const rB = { id: uid('n'), x: 21, y: 20 };
    const left: Wall = { id: uid('w'), a: lA.id, b: lB.id, kind: 'interior', thickness: 0.35 };
    const right: Wall = { id: uid('w'), a: rA.id, b: rB.id, kind: 'interior', thickness: 0.35 };
    floor.nodes = [...outer.nodes, lA, lB, rA, rB];
    floor.walls = [...outer.walls, left, right];
    floor.openings = [
      doorOn(outer.walls[0].id, 0.5, 4),
      windowOn(outer.walls[0].id, 0.17, 3),
      windowOn(outer.walls[0].id, 0.83, 3),
      windowOn(outer.walls[2].id, 0.17, 3),
      windowOn(outer.walls[2].id, 0.5, 4),
      windowOn(outer.walls[2].id, 0.83, 3),
      windowOn(outer.walls[1].id, 0.5, 3),
      windowOn(outer.walls[3].id, 0.5, 3),
      doorOn(left.id, 0.3, 2.5),
      doorOn(right.id, 0.3, 2.5),
    ];
    floor.furniture = [
      furn('sofa', 5.5, 15, 7, 3, 'Sofa'),
      furn('coffee-table', 5.5, 11.5, 4, 2, 'Table'),
      furn('closet', 16, 18, 4, 1.6, 'Coat closet'),
      furn('dining-table', 26.5, 11, 5, 3, 'Dining table'),
      furn('dining-chair', 25.2, 8.6, 1.5, 1.5, 'Chair'),
      furn('dining-chair', 27.8, 8.6, 1.5, 1.5, 'Chair'),
      furn('dining-chair', 25.2, 13.4, 1.5, 1.5, 'Chair', Math.PI),
      furn('dining-chair', 27.8, 13.4, 1.5, 1.5, 'Chair', Math.PI),
    ];
    floor.rooms = [room('living', 5.5, 6, 'Parlor'), room('entry', 16, 10, 'Hall', 'marble'), room('dining', 26.5, 5)];
  } else if (styleId === 'hobbit') {
    const poly = polygonPlan(12, 12, 10, 8, 0.55);
    floor.nodes = poly.nodes;
    floor.walls = poly.walls;
    floor.openings = [
      doorOn(poly.walls[0].id, 0.5, 3.5),
      windowOn(poly.walls[3].id, 0.5, 2.5),
      windowOn(poly.walls[5].id, 0.5, 2.5),
    ];
    floor.furniture = [
      furn('bed-twin', 12, 14, 3.25, 6.25, 'Bed'),
      furn('chair', 8, 10, 2.5, 2.5, 'Chair'),
      furn('storage-shelf', 15, 8, 3, 1.5, 'Shelf'),
    ];
    floor.rooms = [room('living', 12, 12)];
  } else if (styleId === 'ranch') {
    // Rooms in a line: living, kitchen, bath, bedroom, each with its own door and windows (2.13.42).
    const outer = rectPlan(0, 0, 48, 18);
    const cuts = [18, 28, 34].map((x) => {
      const a = { id: uid('n'), x, y: 0 };
      const b = { id: uid('n'), x, y: 18 };
      return { a, b, wall: { id: uid('w'), a: a.id, b: b.id, kind: 'interior', thickness: 0.35 } as Wall };
    });
    floor.nodes = [...outer.nodes, ...cuts.flatMap((c) => [c.a, c.b])];
    floor.walls = [...outer.walls, ...cuts.map((c) => c.wall)];
    floor.openings = [
      doorOn(outer.walls[0].id, 0.28, 3),
      doorOn(outer.walls[2].id, 0.6, 3),
      windowOn(outer.walls[0].id, 0.1, 4),
      windowOn(outer.walls[0].id, 0.48, 3),
      windowOn(outer.walls[0].id, 0.85, 4),
      windowOn(outer.walls[2].id, 0.15, 4),
      windowOn(outer.walls[2].id, 0.8, 4),
      windowOn(outer.walls[1].id, 0.5, 4),
      windowOn(outer.walls[3].id, 0.5, 4),
      doorOn(cuts[0].wall.id, 0.5, 3),
      doorOn(cuts[1].wall.id, 0.7, 2.5),
      doorOn(cuts[2].wall.id, 0.7, 2.5),
    ];
    floor.furniture = [
      furn('sofa', 9, 10, 7, 3, 'Sofa'),
      furn('coffee-table', 9, 13.5, 4, 2, 'Coffee Table'),
      furn('stove', 24, 1.8, 2.5, 2.5, 'Stove'),
      furn('fridge', 20.2, 1.8, 3, 2.5, 'Fridge'),
      furn('sink', 26.5, 1.8, 2.5, 2, 'Sink'),
      furn('washer', 26.4, 16, 2.5, 2.5, 'Washer'),
      furn('toilet', 32.5, 2, 1.5, 2.5, 'Toilet'),
      furn('bathtub', 31, 16, 5, 2.5, 'Tub'),
      furn('bed-queen', 41, 9, 5, 6.5, 'Bed'),
      furn('nightstand', 37.5, 6.5, 1.5, 1.5, 'Nightstand'),
      furn('closet', 45, 1.8, 4, 2, 'Closet'),
    ];
    floor.rooms = [
      room('living', 9, 5),
      room('kitchen', 23, 9, undefined, 'tile'),
      room('bath', 31, 9, undefined, 'hex'),
      room('bedroom', 41, 15, undefined, 'carpet'),
    ];
  } else if (styleId === 'victorian') {
    // Parlor on the left; dining room in front and kitchen behind on the right (2.13.43).
    const outer = rectPlan(0, 0, 28, 22);
    const vA = { id: uid('n'), x: 16, y: 0 };
    const vM = { id: uid('n'), x: 16, y: 11 };
    const vB = { id: uid('n'), x: 16, y: 22 };
    const hR = { id: uid('n'), x: 28, y: 11 };
    const upper: Wall = { id: uid('w'), a: vA.id, b: vM.id, kind: 'interior', thickness: 0.35 };
    const lower: Wall = { id: uid('w'), a: vM.id, b: vB.id, kind: 'interior', thickness: 0.35 };
    const across: Wall = { id: uid('w'), a: vM.id, b: hR.id, kind: 'interior', thickness: 0.35 };
    floor.nodes = [...outer.nodes, vA, vM, vB, hR];
    floor.walls = [...outer.walls, upper, lower, across];
    floor.openings = [
      doorOn(outer.walls[0].id, 0.35, 3.5),
      windowOn(outer.walls[0].id, 0.12, 3),
      windowOn(outer.walls[0].id, 0.78, 3),
      windowOn(outer.walls[1].id, 0.25, 3),
      windowOn(outer.walls[1].id, 0.75, 3),
      windowOn(outer.walls[2].id, 0.22, 3),
      windowOn(outer.walls[2].id, 0.7, 4),
      windowOn(outer.walls[3].id, 0.5, 3),
      doorOn(upper.id, 0.55, 2.5),
      doorOn(lower.id, 0.5, 2.5),
      doorOn(across.id, 0.5, 2.5),
    ];
    floor.furniture = [
      furn('sofa', 8, 10, 7, 3, 'Sofa'),
      furn('coffee-table', 8, 13.5, 4, 2, 'Table'),
      furn('fireplace', 8, 21.1, 6, 1.2, 'Fireplace', Math.PI),
      furn('mech-closet', 2, 2, 3, 3, 'Mech'),
      furn('dining-table', 22, 5.5, 5, 3, 'Dining'),
      furn('dining-chair', 20.7, 3.1, 1.5, 1.5, 'Chair'),
      furn('dining-chair', 23.3, 3.1, 1.5, 1.5, 'Chair'),
      furn('dining-chair', 20.7, 7.9, 1.5, 1.5, 'Chair', Math.PI),
      furn('dining-chair', 23.3, 7.9, 1.5, 1.5, 'Chair', Math.PI),
      furn('fridge', 26.2, 20.4, 3, 2.5, 'Fridge'),
      furn('stove', 22.6, 20.4, 2.5, 2.5, 'Stove'),
      furn('sink', 19, 20.6, 2.5, 2, 'Sink'),
    ];
    floor.rooms = [
      room('living', 8, 5, 'Parlor'),
      room('dining', 22, 9.3),
      room('kitchen', 22, 15, undefined, 'checker'),
    ];
  } else if (styleId === 'mansion') {
    buildMansion(floor);
  } else if (styleId === 'cape-cod') {
    // Living room on the left; a front bedroom and a back bath on the right (2.13.42).
    const outer = rectPlan(0, 0, 30, 20);
    const top = { id: uid('n'), x: 17, y: 0 };
    const mid = { id: uid('n'), x: 17, y: 11 };
    const bot = { id: uid('n'), x: 17, y: 20 };
    const side = { id: uid('n'), x: 30, y: 11 };
    const upper: Wall = { id: uid('w'), a: top.id, b: mid.id, kind: 'interior', thickness: 0.35 };
    const lower: Wall = { id: uid('w'), a: mid.id, b: bot.id, kind: 'interior', thickness: 0.35 };
    const across: Wall = { id: uid('w'), a: mid.id, b: side.id, kind: 'interior', thickness: 0.35 };
    floor.nodes = [...outer.nodes, top, mid, bot, side];
    floor.walls = [...outer.walls, upper, lower, across];
    floor.openings = [
      doorOn(outer.walls[0].id, 0.45, 3),
      windowOn(outer.walls[0].id, 0.18, 3),
      windowOn(outer.walls[0].id, 0.8, 3),
      windowOn(outer.walls[2].id, 0.25, 3),
      windowOn(outer.walls[2].id, 0.8, 4),
      windowOn(outer.walls[1].id, 0.3, 3),
      windowOn(outer.walls[3].id, 0.5, 3),
      doorOn(upper.id, 0.6, 2.5),
      doorOn(lower.id, 0.5, 2.5),
    ];
    floor.furniture = [
      furn('sofa', 8, 10, 7, 3, 'Sofa'),
      furn('coffee-table', 8, 13.5, 4, 2, 'Table'),
      furn('bed-twin', 24, 5, 3.25, 6.25, 'Bed'),
      furn('nightstand', 21.3, 2, 1.5, 1.5, 'Nightstand'),
      furn('closet', 28, 2, 3, 2, 'Closet'),
      furn('toilet', 28.3, 18, 1.5, 2.5, 'Toilet'),
      furn('bathtub', 21, 18.5, 5, 2.5, 'Tub'),
    ];
    floor.rooms = [room('living', 8, 5), room('bedroom', 24, 9.5, undefined, 'carpet'), room('bath', 25, 14, undefined, 'hex')];
  } else if (styleId === 'modern') {
    const outer = rectPlan(0, 0, 36, 22);
    floor.nodes = outer.nodes;
    floor.walls = outer.walls;
    floor.openings = [
      doorOn(outer.walls[0].id, 0.25, 4),
      windowOn(outer.walls[0].id, 0.7, 8),
      windowOn(outer.walls[2].id, 0.5, 6),
    ];
    floor.furniture = [
      furn('sofa', 14, 12, 7, 3, 'Sofa'),
      furn('dining-table', 26, 10, 5, 3, 'Table'),
      furn('fridge', 30, 18, 3, 2.5, 'Fridge'),
      furn('water-heater', 4, 18, 2, 2, 'Water Heater'),
    ];
    floor.rooms = [room('living', 18, 11)];
  } else if (styleId === 'tudor') {
    // Simple L: main 24×16 + wing 10×12. The wing is a bedroom with its own door (2.13.43).
    const n1 = { id: uid('n'), x: 0, y: 0 };
    const n2 = { id: uid('n'), x: 24, y: 0 };
    const n3 = { id: uid('n'), x: 24, y: 16 };
    const n4 = { id: uid('n'), x: 10, y: 16 };
    const n5 = { id: uid('n'), x: 10, y: 28 };
    const n6 = { id: uid('n'), x: 0, y: 28 };
    const n7 = { id: uid('n'), x: 0, y: 16 };
    floor.nodes = [n1, n2, n3, n4, n5, n6, n7];
    const w = (a: Node, b: Node): Wall => ({ id: uid('w'), a: a.id, b: b.id, kind: 'exterior', thickness: 0.5 });
    const wingWall: Wall = { id: uid('w'), a: n7.id, b: n4.id, kind: 'interior', thickness: 0.35 };
    floor.walls = [w(n1, n2), w(n2, n3), w(n3, n4), w(n4, n5), w(n5, n6), w(n6, n1), wingWall];
    floor.openings = [
      doorOn(floor.walls[0].id, 0.4, 3),
      windowOn(floor.walls[0].id, 0.15, 3),
      windowOn(floor.walls[0].id, 0.75, 3),
      windowOn(floor.walls[1].id, 0.5, 3),
      windowOn(floor.walls[2].id, 0.5, 3),
      windowOn(floor.walls[3].id, 0.5, 3),
      windowOn(floor.walls[4].id, 0.5, 3),
      windowOn(floor.walls[5].id, 0.3, 3),
      windowOn(floor.walls[5].id, 0.75, 3),
      doorOn(wingWall.id, 0.6, 2.5),
    ];
    floor.furniture = [
      furn('sofa', 12, 8, 7, 3, 'Sofa'),
      furn('coffee-table', 12, 11.5, 4, 2, 'Table'),
      furn('bed-queen', 5, 23, 5, 6.5, 'Bed'),
      furn('nightstand', 8.6, 20.3, 1.5, 1.5, 'Nightstand'),
      furn('washer', 22, 14, 2.5, 2.5, 'Washer'),
    ];
    floor.rooms = [room('living', 17, 4), room('bedroom', 5, 18.2, undefined, 'carpet')];
  } else if (styleId === 'yurt') {
    const poly = polygonPlan(12, 12, 11, 12, 0.45);
    floor.nodes = poly.nodes;
    floor.walls = poly.walls;
    floor.openings = [
      doorOn(poly.walls[0].id, 0.5, 3),
      windowOn(poly.walls[3].id, 0.5, 2.5),
      windowOn(poly.walls[6].id, 0.5, 2.5),
      windowOn(poly.walls[9].id, 0.5, 2.5),
    ];
    floor.furniture = [
      furn('bed-twin', 12, 16, 3.25, 6.25, 'Bed'),
      furn('stove', 8, 10, 2.5, 2.5, 'Stove'),
      furn('storage-shelf', 16, 8, 3, 1.5, 'Shelf'),
    ];
    floor.rooms = [room('living', 12, 12)];
  } else if (styleId === 'tiny-home') {
    const outer = rectPlan(0, 0, 18, 10);
    floor.nodes = outer.nodes;
    floor.walls = outer.walls;
    floor.openings = [
      doorOn(outer.walls[0].id, 0.5, 3), // 3'-0" front door: NY code wants 32" clear (2.13.63)
      windowOn(outer.walls[0].id, 0.8, 3),
      windowOn(outer.walls[2].id, 0.5, 3),
    ];
    floor.furniture = [
      furn('bed-twin', 14, 5, 3.25, 6.25, 'Bed'),
      // kitchen in one row along the left wall, out of the door swing
      furn('fridge', 1.5, 1.6, 3, 2.5, 'Fridge', Math.PI / 2),
      furn('stove', 1.4, 4.4, 2.5, 2.5, 'Stove', Math.PI / 2),
      furn('sink', 1.5, 7.2, 3, 2, 'Sink', Math.PI / 2),
      furn('toilet', 9, 7.5, 1.5, 2.5, 'Toilet'),
      furn('closet', 16, 1.5, 2, 2, 'Closet'),
      furn('washer', 11, 7.5, 2.5, 2.5, 'Washer'),
    ];
    floor.rooms = [room('living', 9, 5, 'Tiny home')];
    challengeIds.push('C-TINY-HOME-CONTEST');
    assignmentId = 'tiny-home-contest';
  } else if (styleId === 'dog-house') {
    challengeIds.push('C-DOG-HOUSE-CONTEST');
    assignmentId = 'dog-house-contest';
  }

  const roofStyleId = DEFAULT_ROOF_BY_STYLE[styleId] ?? null;
  const wallH = styleId === 'mansion' ? 10 : DEFAULT_WALL_HEIGHT_FT;
  if (styleId !== 'dog-house' && styleId !== 'tiny-home' && styleId !== 'mansion' && floor.walls.length > 2) furnishYard(floor);
  splitAtJunctions(floor);
  const wallTintId = dressOutside(styleId, floor);
  floor.roof = generateRoof(floor.nodes, floor.walls, roofStyleId, wallH);

  return {
    meta: {
      id: uid('proj'),
      title: title ?? (styleId === 'mansion' ? 'The Mansion' : `${style.name} Plan`),
      units: 'ft',
      version: APP_VERSION,
      createdAt: now,
      updatedAt: now,
      styleId,
      teachingMeta: {
        unitId: styleId === 'tiny-home'
          ? 'tiny-home-contest'
          : styleId === 'dog-house'
            ? 'dog-house-contest'
            : 'unit-1',
        challengeIds,
        assignmentId,
      },
    },
    floors: [floor],
    settings: {
      gridSize: 1,
      snap: true,
      ortho: true,
      osnap: true,
      wallHeight: wallH,
      units: 'ft',
      accent: '#6E72F5',
      guiTheme: 'stark',
      skillLevel: 'novice',
      viewMode: 'plan',
      renderTier: 0,
      styleId,
      roofStyleId,
      roofLabel: roofStyleId ? roofStyleName(roofStyleId) : '',
      showRoof: true,
      textureId: null,
      textureLabel: '',
      imageBlobRef: null,
      skyPreset: 'day',
      siteFinish: 'grass',
      wallTintId,
      showFurniture3d: true,
      floorFinishId: 'oak',
      floorGrain: 0,
      dollProj: 'iso',
      dollYaw: 0,
      dollTop: false,
      locale: 'en',
      tipsLocale: 'en',
      udlFat: false,
      udlType: false,
      udlContrast: false,
      ellEnglish: true,
      ...(styleId === 'tiny-home'
        ? { typology: defaultTinyHomeTypology('trailer') }
        : {}),
    },
  };
}

export function blankProject(title = 'Untitled Plan'): ProjectDocument {
  return buildTemplateProject('blank', title);
}
