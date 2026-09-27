import type { Floor, Opening, ProjectDocument, StyleId, StyleTemplate, Wall, Node, FurnitureItem, Room, RoomKind, LandscapeItem, PlantKind, FloorFinishId } from '../types';
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
    windowOn(right.id, 0.4, 4),
    windowOn(back.id, 0.5, 5),
    windowOn(left.id, 0.55, 4),
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
  const W = (a: Node, b: Node, kind: Wall['kind'] = 'exterior'): Wall => ({
    id: uid('w'), a: a.id, b: b.id, kind,
    thickness: kind === 'exterior' ? 0.55 : 0.35,
    drawStyle: kind === 'exterior' ? 'brick' : 'outline',
  });
  const bayA = N(3, 8);
  const bayB = N(3, 4.2);
  const bayC = N(15, 4.2);
  const bayD = N(15, 8);
  const porchFront = W(pFL, pFR);
  const porchLeft = W(pFL, hL);
  const porchRight = W(pFR, hR);
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
    windowOn(bayFront.id, 0.5, 6),
    windowOn(baySideL.id, 0.55, 2.4),
    windowOn(baySideR.id, 0.55, 2.4),
    slideOn(frontR.id, 0.55, 6),
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
    doorOn(stairFront.id, 0.5, 3),
  ];
  floor.furniture = [
    furn('rug', 11, 16, 12, 8, 'Parlor rug'),
    furn('sofa', 11, 12, 7, 3, 'Settee', 0, '#6E2E3A'),
    furn('chair', 5, 18, 2.5, 2.5, 'Armchair', 0, '#6E2E3A'),
    furn('chair', 17, 18, 2.5, 2.5, 'Armchair', 0, '#4A3A28'),
    furn('coffee-table', 11, 15.2, 4, 2, 'Table'),
    furn('fireplace', 11, 22.3, 6, 1.2, 'Fireplace'),
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
    furn('banister', 28, 27.55, 10, 0.3, 'Banister'),
    furn('stairs', 28, 34.2, 5.2, 8, 'Stairs'),
    furn('dining-table', 45, 15, 8, 3.6, 'Dining table'),
    furn('dining-chair', 42, 12.6, 1.5, 1.5, 'Chair'),
    furn('dining-chair', 48, 12.6, 1.5, 1.5, 'Chair'),
    furn('dining-chair', 42, 17.4, 1.5, 1.5, 'Chair'),
    furn('dining-chair', 48, 17.4, 1.5, 1.5, 'Chair'),
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
    plant('lamp', 4, 16, 1.2, 1.2, 'Lamppost'),
    plant('lamp', 52, 16, 1.2, 1.2, 'Lamppost'),
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
      doorOn(outer.walls[0].id, 0.5, 3.5),
      windowOn(outer.walls[2].id, 0.25, 4),
      windowOn(outer.walls[2].id, 0.75, 4),
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
    const ac = artsCraftsPlan();
    floor.nodes = ac.nodes;
    floor.walls = ac.walls;
    floor.openings = ac.openings;
    floor.furniture = [
      furn('sofa', 10, 14, 7, 3, 'Sofa'),
      furn('coffee-table', 10, 18, 4, 2, 'Coffee Table'),
      furn('chair', 22, 12, 2.5, 2.5, 'Armchair'),
      furn('storage-shelf', 24, 20, 3, 1.5, 'Bookcase'),
    ];
    floor.rooms = [
      room('entry', 14, 2, 'Porch'),
      room('living', 14, 14),
    ];
  } else if (styleId === 'greek-revival') {
    const outer = rectPlan(0, 0, 32, 20);
    floor.nodes = outer.nodes;
    floor.walls = outer.walls;
    floor.openings = [
      doorOn(outer.walls[0].id, 0.5, 4),
      windowOn(outer.walls[0].id, 0.2, 3),
      windowOn(outer.walls[0].id, 0.8, 3),
      windowOn(outer.walls[2].id, 0.5, 4),
    ];
    floor.furniture = [
      furn('dining-table', 16, 10, 5, 3, 'Table'),
      furn('closet', 4, 16, 4, 2, 'Closet'),
    ];
    floor.rooms = [room('living', 16, 10)];
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
    const outer = rectPlan(0, 0, 48, 18);
    floor.nodes = outer.nodes;
    floor.walls = outer.walls;
    floor.openings = [
      doorOn(outer.walls[0].id, 0.35, 3),
      doorOn(outer.walls[2].id, 0.6, 3),
      windowOn(outer.walls[0].id, 0.7, 4),
      windowOn(outer.walls[2].id, 0.25, 4),
    ];
    floor.furniture = [
      furn('sofa', 12, 9, 7, 3, 'Sofa'),
      furn('coffee-table', 12, 13, 4, 2, 'Coffee Table'),
      furn('bed-queen', 38, 9, 5, 6.5, 'Bed'),
      furn('nightstand', 34.5, 6.5, 1.5, 1.5, 'Nightstand'),
      furn('stove', 24, 4, 2.5, 2.5, 'Stove'),
      furn('fridge', 21, 4, 3, 2.5, 'Fridge'),
      furn('toilet', 32, 4, 1.5, 2.5, 'Toilet'),
      furn('bathtub', 29, 4.5, 5, 2.5, 'Tub'),
      furn('washer', 28, 14, 2.5, 2.5, 'Washer'),
      furn('closet', 42, 4, 4, 2, 'Closet'),
    ];
    floor.rooms = [room('living', 24, 9)];
  } else if (styleId === 'victorian') {
    const outer = rectPlan(0, 0, 28, 22);
    floor.nodes = outer.nodes;
    floor.walls = outer.walls;
    floor.openings = [
      doorOn(outer.walls[0].id, 0.4, 3.5),
      windowOn(outer.walls[0].id, 0.75, 3),
      windowOn(outer.walls[1].id, 0.5, 3),
      windowOn(outer.walls[2].id, 0.5, 4),
    ];
    floor.furniture = [
      furn('sofa', 10, 10, 7, 3, 'Sofa'),
      furn('dining-table', 20, 12, 5, 3, 'Dining'),
      furn('mech-closet', 4, 18, 3, 3, 'Mech'),
    ];
    floor.rooms = [room('living', 14, 11)];
  } else if (styleId === 'mansion') {
    buildMansion(floor);
  } else if (styleId === 'cape-cod') {
    const outer = rectPlan(0, 0, 30, 20);
    floor.nodes = outer.nodes;
    floor.walls = outer.walls;
    floor.openings = [
      doorOn(outer.walls[0].id, 0.5, 3),
      windowOn(outer.walls[0].id, 0.2, 3),
      windowOn(outer.walls[0].id, 0.8, 3),
      windowOn(outer.walls[2].id, 0.5, 4),
    ];
    floor.furniture = [
      furn('bed-twin', 8, 12, 3.25, 6.25, 'Bed'),
      furn('sofa', 20, 10, 7, 3, 'Sofa'),
      furn('closet', 24, 16, 4, 2, 'Closet'),
    ];
    floor.rooms = [room('living', 15, 10)];
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
    // Simple L: main 24×16 + wing 10×12
    const n1 = { id: uid('n'), x: 0, y: 0 };
    const n2 = { id: uid('n'), x: 24, y: 0 };
    const n3 = { id: uid('n'), x: 24, y: 16 };
    const n4 = { id: uid('n'), x: 10, y: 16 };
    const n5 = { id: uid('n'), x: 10, y: 28 };
    const n6 = { id: uid('n'), x: 0, y: 28 };
    floor.nodes = [n1, n2, n3, n4, n5, n6];
    const w = (a: Node, b: Node): Wall => ({ id: uid('w'), a: a.id, b: b.id, kind: 'exterior', thickness: 0.5 });
    floor.walls = [w(n1, n2), w(n2, n3), w(n3, n4), w(n4, n5), w(n5, n6), w(n6, n1)];
    floor.openings = [
      doorOn(floor.walls[0].id, 0.4, 3),
      windowOn(floor.walls[1].id, 0.5, 3),
      windowOn(floor.walls[4].id, 0.5, 3),
    ];
    floor.furniture = [
      furn('sofa', 12, 8, 7, 3, 'Sofa'),
      furn('bed-queen', 5, 22, 5, 6.5, 'Bed'),
      furn('washer', 20, 12, 2.5, 2.5, 'Washer'),
    ];
    floor.rooms = [room('living', 12, 8)];
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
      doorOn(outer.walls[0].id, 0.2, 2.5),
      windowOn(outer.walls[0].id, 0.7, 3),
      windowOn(outer.walls[2].id, 0.5, 3),
    ];
    floor.furniture = [
      furn('bed-twin', 14, 5, 3.25, 6.25, 'Bed'),
      furn('sink', 6, 2.5, 3, 2, 'Sink'),
      furn('stove', 3, 2.5, 2.5, 2.5, 'Stove'),
      furn('fridge', 1.5, 7, 3, 2.5, 'Fridge'),
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
      wallTintId: 'sand',
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
