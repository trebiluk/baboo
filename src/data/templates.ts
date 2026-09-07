import type { Floor, Opening, ProjectDocument, StyleId, StyleTemplate, Wall, Node, FurnitureItem } from '../types';
import { DEFAULT_ROOF_BY_STYLE, roofStyleName } from './roofs';
import { generateRoof } from '../lib/roof';
import { APP_VERSION } from '../version';
import { uid } from '../lib/geometry';
import { defaultTinyHomeTypology } from './typology';

export const STYLE_TEMPLATES: StyleTemplate[] = [
  { id: 'blank', name: 'Blank', blurb: 'Start empty · draw your own walls.' },
  { id: 'colonial', name: 'Colonial', blurb: 'Balanced house · doors in the middle · rooms left and right.' },
  { id: 'arts-crafts', name: 'Arts & Crafts', blurb: 'Cozy porch house · simple roof · handmade feel.' },
  { id: 'greek-revival', name: 'Greek Revival', blurb: 'Fancy front · tall entry · balanced sides.' },
  { id: 'hobbit', name: 'Hobbit', blurb: 'Storybook cottage · round door · green living roof.' },
  { id: 'ranch', name: 'Ranch', blurb: 'Long one-story · rooms in a line · yard all around.' },
  { id: 'victorian', name: 'Victorian', blurb: 'Tall fancy house · steep fancy roof (mansard).' },
  { id: 'cape-cod', name: 'Cape Cod', blurb: 'Compact rectangle — steep gable feel, simple rooms.' },
  { id: 'modern', name: 'Modern', blurb: 'Clean rectangle — open plan, flat roof default.' },
  { id: 'tudor', name: 'Tudor', blurb: 'Compact L-ish starter — steep gable vocabulary.' },
  { id: 'yurt', name: 'Yurt', blurb: 'Round tent-house · cone roof · open middle.' },
  { id: 'tiny-home', name: 'Tiny Home', blurb: 'Small contest house · trailer or container type · checklist of parts.', badge: 'Contest' },
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
    landscape: [],
    roof: null,
    layers: { structure: true, openings: true, furniture: true, dims: true, landscape: false, roof: true },
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

function furn(catalogId: string, x: number, y: number, w: number, h: number, label: string): FurnitureItem {
  return { id: uid('f'), catalogId, x, y, w, h, rot: 0, zIndex: 1, label };
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
  } else if (styleId === 'arts-crafts') {
    const ac = artsCraftsPlan();
    floor.nodes = ac.nodes;
    floor.walls = ac.walls;
    floor.openings = ac.openings;
    floor.furniture = [
      furn('sofa', 10, 14, 7, 3, 'Sofa'),
      furn('coffee-table', 10, 18, 4, 2, 'Coffee Table'),
      furn('chair', 22, 12, 2.5, 2.5, 'Armchair'),
      furn('washer', 24, 20, 2.5, 2.5, 'Washer'),
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
      furn('bed-queen', 38, 9, 5, 6.5, 'Bed'),
      furn('washer', 28, 14, 2.5, 2.5, 'Washer'),
      furn('closet', 42, 4, 4, 2, 'Closet'),
    ];
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
    challengeIds.push('C-TINY-HOME-CONTEST');
    assignmentId = 'tiny-home-contest';
  }

  const roofStyleId = DEFAULT_ROOF_BY_STYLE[styleId] ?? null;
  floor.roof = generateRoof(floor.nodes, floor.walls, roofStyleId);

  return {
    meta: {
      id: uid('proj'),
      title: title ?? `${style.name} Plan`,
      units: 'ft',
      version: APP_VERSION,
      createdAt: now,
      updatedAt: now,
      styleId,
      teachingMeta: {
        unitId: styleId === 'tiny-home' ? 'tiny-home-contest' : 'unit-1',
        challengeIds,
        assignmentId,
      },
    },
    floors: [floor],
    settings: {
      gridSize: 1,
      snap: true,
      units: 'ft',
      accent: '#6E72F5',
      guiTheme: 'stark',
      viewMode: 'plan',
      renderTier: 0,
      styleId,
      roofStyleId,
      roofLabel: roofStyleId ? roofStyleName(roofStyleId) : '',
      showRoof: true,
      textureId: null,
      textureLabel: '',
      imageBlobRef: null,
      ...(styleId === 'tiny-home'
        ? { typology: defaultTinyHomeTypology('trailer') }
        : {}),
    },
  };
}

export function blankProject(title = 'Untitled Plan'): ProjectDocument {
  return buildTemplateProject('blank', title);
}
