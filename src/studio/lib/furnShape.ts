/** Shared furniture solids. Plan, dollhouse, and 3D all read these parts. Local feet; origin is the item center. −Y is the head/back (against a wall). */
import type { FurnitureItem } from '../types';
import { FURNITURE_CATALOG } from '../data/furniture';
import type { FurnLod } from './perf';

export type FurnShapeKind = 'box' | 'cyl' | 'oval';
export type FurnTex = 'wood' | 'fabric' | 'metal' | 'ceramic' | 'glass';

export type FurnPart = {
  lx: number;
  ly: number;
  lw: number;
  lh: number;
  z0: number;
  z1: number;
  fill: string;
  shape?: FurnShapeKind;
  /** How the top should read in 3D. Color is separate, on fill. */
  tex?: FurnTex;
};

const WOOD = '#8B6914';
const WOOD_LT = '#C4A074';
const WOOD_DK = '#5C4030';
const LINEN = '#E8DCC8';
const BLANKET = '#5E6E8E';
const PILLOW = '#F4EEE4';
const UPH = '#4A6741';
const UPH_DK = '#3A5234';
const UPH_LT = '#6A8A62';
const STEEL = '#9AA8B8';
const STEEL_DK = '#6A7888';
const WHITE = '#EEF2F6';
const PORC = '#E8EEF2';
const BLACK = '#2A2A2E';
const IRON = '#3A3A40';
const DRUM = '#C5D0DC';
const WATER = '#7EB3D4';
const CHROME = '#D0D8E0';
const KNOB = '#D4C4A0';

const PAINTABLE = new Set([WOOD, WOOD_LT, WOOD_DK, LINEN, BLANKET, UPH, UPH_DK, UPH_LT, PILLOW]);

function hexRgb(hex: string): [number, number, number] {
  const n = hex.replace('#', '');
  const full = n.length === 3 ? n.split('').map((c) => c + c).join('') : n;
  return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
}
function rgbHex(r: number, g: number, b: number): string {
  const h = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`;
}
function shadeHex(hex: string, k: number): string {
  const [r, g, b] = hexRgb(hex);
  if (k >= 1) {
    const t = Math.min(1, k - 1);
    return rgbHex(r + (255 - r) * t, g + (255 - g) * t, b + (255 - b) * t);
  }
  return rgbHex(r * k, g * k, b * k);
}

function paintFurnParts(parts: FurnPart[], color?: string | null): FurnPart[] {
  if (!color) return parts;
  const any = parts.some((p) => PAINTABLE.has(p.fill));
  if (!any) return parts;
  return parts.map((p) => {
    if (!PAINTABLE.has(p.fill)) return p;
    if (p.fill === WOOD_DK || p.fill === UPH_DK || p.fill === BLANKET) return { ...p, fill: shadeHex(color, 0.72) };
    if (p.fill === WOOD_LT || p.fill === UPH_LT || p.fill === LINEN || p.fill === PILLOW) return { ...p, fill: shadeHex(color, 1.22) };
    return { ...p, fill: color };
  });
}

function texForFill(fill: string): FurnTex | undefined {
  switch (fill) {
    case WOOD:
    case WOOD_LT:
    case WOOD_DK:
      return 'wood';
    case LINEN:
    case BLANKET:
    case UPH:
    case UPH_DK:
    case UPH_LT:
    case PILLOW:
      return 'fabric';
    case STEEL:
    case STEEL_DK:
    case CHROME:
    case IRON:
    case BLACK:
      return 'metal';
    case WHITE:
    case PORC:
    case DRUM:
      return 'ceramic';
    case WATER:
      return 'glass';
    default:
      return undefined;
  }
}

function box(lx: number, ly: number, lw: number, lh: number, z0: number, z1: number, fill: string): FurnPart {
  return { lx, ly, lw, lh, z0, z1, fill, shape: 'box', tex: texForFill(fill) };
}

function cyl(lx: number, ly: number, d: number, z0: number, z1: number, fill: string): FurnPart {
  return { lx, ly, lw: d, lh: d, z0, z1, fill, shape: 'cyl', tex: texForFill(fill) };
}

function oval(lx: number, ly: number, lw: number, lh: number, z0: number, z1: number, fill: string): FurnPart {
  return { lx, ly, lw, lh, z0, z1, fill, shape: 'oval', tex: texForFill(fill) };
}

function legs(w: number, h: number, inset: number, thick: number, z1: number, fill = WOOD_DK): FurnPart[] {
  const x = w / 2 - inset;
  const y = h / 2 - inset;
  return [
    box(-x, -y, thick, thick, 0, z1, fill),
    box(x, -y, thick, thick, 0, z1, fill),
    box(-x, y, thick, thick, 0, z1, fill),
    box(x, y, thick, thick, 0, z1, fill),
  ];
}

export function furnitureParts(item: FurnitureItem, lod: FurnLod = 'full'): FurnPart[] {
  const raw = lod === 'simple' ? furnitureSilhouette(item) : furniturePartsFull(item);
  return paintFurnParts(raw, item.color);
}

function furniturePartsFull(item: FurnitureItem): FurnPart[] {
  const w = Math.max(0.4, item.w || 2);
  const h = Math.max(0.4, item.h || 2);
  const id = item.catalogId;
  const hw = w / 2;
  const hh = h / 2;

  switch (id) {
    case 'bed-twin':
    case 'bed-queen': {
      const two = id === 'bed-queen' || w >= 4.5;
      const parts: FurnPart[] = [
        ...legs(w * 0.92, h * 0.88, 0.18, 0.16, 0.32),
        box(0, 0, w * 0.98, h * 0.96, 0.28, 0.48, WOOD),
        box(0, 0.08, w * 0.9, h * 0.82, 0.48, 1.22, LINEN),
        box(0, -hh + 0.12, w * 0.98, 0.24, 0, 2.35, WOOD),
        box(0, hh - 0.12, w * 0.92, 0.16, 0.28, 1.45, WOOD_DK),
        box(0, hh * 0.28, w * 0.88, h * 0.48, 1.22, 1.42, BLANKET),
      ];
      if (two) {
        parts.push(
          oval(-w * 0.2, -hh + 0.78, w * 0.34, 1.05, 1.22, 1.72, PILLOW),
          oval(w * 0.2, -hh + 0.78, w * 0.34, 1.05, 1.22, 1.72, PILLOW),
        );
      } else {
        parts.push(oval(0, -hh + 0.78, w * 0.58, 1.05, 1.22, 1.72, PILLOW));
      }
      return parts;
    }
    case 'nightstand':
      return [
        ...legs(w, h, 0.12, 0.12, 0.2),
        box(0, 0, w * 0.96, h * 0.92, 0.18, 1.85, WOOD),
        box(0, 0, w, h, 1.85, 2.02, WOOD_LT),
        box(0, 0.04, w * 0.78, h * 0.22, 1.1, 1.18, WOOD_DK),
        cyl(0, h * 0.18, 0.12, 1.18, 1.28, KNOB),
      ];
    case 'dresser':
      return [
        ...legs(w, h, 0.14, 0.14, 0.22),
        box(0, 0, w, h, 0.2, 3.05, WOOD),
        box(0, 0, w * 1.02, h * 1.04, 3.05, 3.2, WOOD_LT),
        box(0, 0, w * 0.88, h * 0.22, 0.7, 0.82, WOOD_DK),
        box(0, 0, w * 0.88, h * 0.22, 1.55, 1.67, WOOD_DK),
        box(0, 0, w * 0.88, h * 0.22, 2.4, 2.52, WOOD_DK),
        cyl(-w * 0.18, h * 0.28, 0.1, 0.82, 0.94, KNOB),
        cyl(w * 0.18, h * 0.28, 0.1, 0.82, 0.94, KNOB),
        cyl(-w * 0.18, h * 0.28, 0.1, 1.67, 1.79, KNOB),
        cyl(w * 0.18, h * 0.28, 0.1, 1.67, 1.79, KNOB),
        cyl(-w * 0.18, h * 0.28, 0.1, 2.52, 2.64, KNOB),
        cyl(w * 0.18, h * 0.28, 0.1, 2.52, 2.64, KNOB),
      ];
    case 'closet':
      return [
        box(0, 0, w, h, 0, 7, WOOD),
        box(-w * 0.24, 0.02, w * 0.42, h * 0.88, 0.08, 6.85, WOOD_LT),
        box(w * 0.24, 0.02, w * 0.42, h * 0.88, 0.08, 6.85, WOOD_LT),
        box(-w * 0.06, h * 0.2, 0.08, 0.08, 3.2, 3.7, KNOB),
        box(w * 0.06, h * 0.2, 0.08, 0.08, 3.2, 3.7, KNOB),
        box(0, -h * 0.2, w * 0.72, 0.08, 5.6, 5.72, WOOD_DK),
      ];
    case 'storage-shelf':
      return [
        box(-hw + 0.1, 0, 0.16, h, 0, 5.1, WOOD_DK),
        box(hw - 0.1, 0, 0.16, h, 0, 5.1, WOOD_DK),
        box(0, 0, w, h * 0.92, 0, 0.14, WOOD),
        box(0, 0, w * 0.96, h * 0.88, 1.55, 1.7, WOOD),
        box(0, 0, w * 0.96, h * 0.88, 3.1, 3.25, WOOD),
        box(0, 0, w * 0.96, h * 0.88, 4.7, 4.85, WOOD),
        box(-w * 0.22, 0, w * 0.28, h * 0.55, 1.7, 2.55, '#8A6A48'),
        box(w * 0.2, 0, w * 0.32, h * 0.5, 3.25, 4.05, '#6A7A58'),
      ];
    case 'sofa':
      return [
        ...legs(w * 0.9, h * 0.72, 0.22, 0.16, 0.22, WOOD_DK),
        box(0, 0.18, w * 0.86, h * 0.62, 0.2, 1.12, UPH),
        box(-w * 0.22, 0.12, w * 0.36, h * 0.48, 1.12, 1.32, UPH_LT),
        box(w * 0.22, 0.12, w * 0.36, h * 0.48, 1.12, 1.32, UPH_LT),
        box(0, -hh + 0.22, w * 0.92, 0.42, 1.12, 2.55, UPH_DK),
        oval(-hw + 0.28, 0.08, 0.52, h * 0.78, 1.12, 2.12, UPH_DK),
        oval(hw - 0.28, 0.08, 0.52, h * 0.78, 1.12, 2.12, UPH_DK),
      ];
    case 'chair':
      return [
        ...legs(w * 0.78, h * 0.7, 0.18, 0.14, 0.22, WOOD_DK),
        box(0, 0.16, w * 0.7, h * 0.58, 0.2, 1.18, UPH),
        box(0, -hh + 0.2, w * 0.78, 0.36, 1.18, 2.72, UPH_DK),
        oval(-hw + 0.2, 0.08, 0.32, h * 0.62, 1.18, 2.05, UPH_DK),
        oval(hw - 0.2, 0.08, 0.32, h * 0.62, 1.18, 2.05, UPH_DK),
      ];
    case 'coffee-table':
      return [
        oval(0, 0, w, h, 1.18, 1.38, WOOD_LT),
        cyl(0, 0, Math.min(w, h) * 0.22, 0.12, 1.18, WOOD),
        cyl(0, 0, Math.min(w, h) * 0.42, 0, 0.14, WOOD_DK),
      ];
    case 'dining-table':
      return [
        ...legs(w * 0.86, h * 0.82, 0.16, 0.2, 2.28),
        box(0, 0, w, h, 2.28, 2.52, WOOD_LT),
        box(0, 0, w * 0.82, h * 0.08, 2.05, 2.28, WOOD_DK),
        box(0, 0, w * 0.08, h * 0.72, 2.05, 2.28, WOOD_DK),
      ];
    case 'dining-chair':
      return [
        ...legs(w * 0.72, h * 0.7, 0.12, 0.1, 1.32),
        box(0, 0.1, w * 0.82, h * 0.68, 1.32, 1.52, WOOD),
        box(0, -hh + 0.12, w * 0.78, 0.14, 1.52, 3.05, WOOD),
        box(-w * 0.18, -hh + 0.12, 0.08, 0.08, 1.9, 2.7, WOOD_DK),
        box(w * 0.18, -hh + 0.12, 0.08, 0.08, 1.9, 2.7, WOOD_DK),
      ];
    case 'fridge':
      return [
        box(0, 0, w, h, 0, 6.2, STEEL),
        box(0, 0, w * 1.02, h * 1.02, 6.2, 6.38, STEEL_DK),
        box(0, -hh * 0.42, w * 0.9, h * 0.38, 4.35, 6.12, STEEL_DK),
        box(0, hh * 0.22, w * 0.9, h * 0.52, 0.12, 4.22, STEEL),
        box(hw - 0.12, -hh * 0.35, 0.1, 0.12, 4.7, 5.7, BLACK),
        box(hw - 0.12, hh * 0.15, 0.1, 0.12, 1.6, 3.2, BLACK),
      ];
    case 'stove': {
      const r = Math.min(w, h) * 0.22;
      const ox = w * 0.22;
      const oy = h * 0.2;
      const burners = [
        [-ox, -oy], [ox, -oy], [-ox, oy], [ox, oy],
      ].flatMap(([cx, cy]) => [
        cyl(cx, cy, r, 3.02, 3.12, IRON),
        cyl(cx, cy, r * 0.55, 3.12, 3.2, BLACK),
      ]);
      return [
        box(0, 0, w, h, 0, 2.88, IRON),
        box(0, 0, w * 0.96, h * 0.96, 2.88, 3.04, STEEL_DK),
        box(0, hh * 0.15, w * 0.78, h * 0.42, 0.18, 2.55, BLACK),
        box(0, hh * 0.15, w * 0.55, 0.08, 2.55, 2.72, STEEL),
        cyl(-w * 0.28, -hh + 0.16, 0.12, 3.04, 3.22, CHROME),
        cyl(-w * 0.1, -hh + 0.16, 0.12, 3.04, 3.22, CHROME),
        cyl(w * 0.1, -hh + 0.16, 0.12, 3.04, 3.22, CHROME),
        cyl(w * 0.28, -hh + 0.16, 0.12, 3.04, 3.22, CHROME),
        ...burners,
      ];
    }
    case 'sink':
      return [
        box(0, 0, w, h, 2.72, 3.08, STEEL),
        box(-hw + 0.14, 0, 0.22, h * 0.85, 0, 2.72, WOOD_DK),
        box(hw - 0.14, 0, 0.22, h * 0.85, 0, 2.72, WOOD_DK),
        oval(0, 0.08, w * 0.58, h * 0.52, 2.55, 2.78, WATER),
        cyl(0, -h * 0.32, 0.12, 3.08, 3.55, CHROME),
        box(0, -h * 0.18, 0.1, 0.42, 3.42, 3.55, CHROME),
      ];
    case 'toilet':
      return [
        box(0, -hh + 0.28, w * 0.92, 0.52, 1.15, 2.35, WHITE),
        box(0, -hh + 0.28, w * 0.96, 0.56, 2.35, 2.48, PORC),
        oval(0, hh - 0.82, w * 0.82, h * 0.62, 0, 1.18, PORC),
        oval(0, hh - 0.78, w * 0.7, h * 0.5, 1.18, 1.32, WHITE),
        oval(0, hh - 0.74, w * 0.42, h * 0.32, 1.05, 1.22, WATER),
        cyl(w * 0.22, -hh + 0.22, 0.14, 2.48, 2.62, CHROME),
      ];
    case 'bathtub':
      return [
        oval(0, 0, w, h, 0, 1.55, WHITE),
        oval(0, 0.04, w * 0.72, h * 0.55, 0.85, 1.38, WATER),
        cyl(-w * 0.38, -h * 0.22, 0.16, 1.55, 1.85, CHROME),
        box(-w * 0.28, -h * 0.22, 0.28, 0.1, 1.72, 1.85, CHROME),
      ];
    case 'desk':
      return [
        box(-hw + 0.22, 0.08, 0.42, h * 0.82, 0, 2.28, WOOD_DK),
        box(hw - 0.22, 0.08, 0.42, h * 0.82, 0, 2.28, WOOD_DK),
        box(0, -hh + 0.22, w, 0.48, 2.28, 2.52, WOOD_LT),
        box(-hw + 0.22, 0.08, 0.32, h * 0.28, 1.4, 1.52, WOOD),
        box(w * 0.12, -hh + 0.18, w * 0.28, 0.22, 2.52, 2.58, '#E8E0D0'),
      ];
    case 'water-heater':
      return [
        cyl(0, 0, Math.min(w, h) * 0.92, 0, 4.55, STEEL),
        cyl(0, 0, Math.min(w, h) * 0.78, 4.55, 4.78, STEEL_DK),
        cyl(0.12, 0, 0.16, 4.78, 5.35, CHROME),
        box(0.28, 0, 0.12, 0.12, 5.15, 5.35, BLACK),
      ];
    case 'mech-closet':
      return [
        box(0, 0, w, h, 0, 7, '#6A7380'),
        box(0, 0, w * 0.78, h * 0.7, 0.2, 6.6, '#7A8490'),
        box(-w * 0.18, 0, 0.08, h * 0.55, 2.2, 5.4, '#4A5460'),
        box(w * 0.18, 0, 0.08, h * 0.55, 2.2, 5.4, '#4A5460'),
        box(0, 0, w * 0.55, 0.08, 3.4, 3.55, '#4A5460'),
      ];
    case 'washer':
    case 'dryer': {
      const dark = id === 'dryer';
      return [
        box(0, 0, w, h, 0, 3.15, STEEL),
        box(0, 0, w * 1.02, h * 1.02, 3.15, 3.32, STEEL_DK),
        cyl(0, 0.08, Math.min(w, h) * 0.62, 3.32, 3.42, dark ? IRON : DRUM),
        cyl(0, 0.08, Math.min(w, h) * 0.42, 3.2, 3.38, dark ? BLACK : WATER),
        cyl(hw * 0.55, -hh * 0.55, 0.18, 3.32, 3.48, CHROME),
        box(-w * 0.28, -hh + 0.18, w * 0.35, 0.16, 3.32, 3.48, STEEL_DK),
      ];
    }
    default: {
      const color = FURNITURE_CATALOG.find((c) => c.id === id)?.color ?? '#6a7080';
      return [box(0, 0, w, h, 0, Math.min(4.2, 1.2 + Math.min(w, h) * 0.4), color)];
    }
  }
}

function furnitureSilhouette(item: FurnitureItem): FurnPart[] {
  const w = Math.max(0.4, item.w || 2);
  const h = Math.max(0.4, item.h || 2);
  const hw = w / 2;
  const hh = h / 2;
  const id = item.catalogId;
  switch (id) {
    case 'bed-twin':
    case 'bed-queen':
      return [
        box(0, 0, w, h, 0.28, 1.22, LINEN),
        box(0, -hh + 0.12, w, 0.24, 0, 2.2, WOOD),
      ];
    case 'sofa':
    case 'chair':
      return [
        box(0, 0.15, w * 0.9, h * 0.7, 0.2, 1.15, UPH),
        box(0, -hh + 0.2, w * 0.98, 0.4, 1.1, 2.4, UPH_DK),
      ];
    case 'coffee-table':
      return [oval(0, 0, w, h, 1.15, 1.4, WOOD)];
    case 'dining-table':
    case 'desk':
      return [box(0, 0, w, h, 2.28, 2.52, WOOD)];
    case 'toilet':
      return [
        box(0, -hh + 0.28, w * 0.9, 0.5, 0.9, 2.4, WHITE),
        oval(0, hh * 0.22, w * 0.85, h * 0.62, 0, 1.15, PORC),
      ];
    case 'bathtub':
      return [oval(0, 0, w, h, 0, 1.5, WHITE)];
    case 'water-heater':
      return [cyl(0, 0, Math.min(w, h) * 0.9, 0, 4.6, STEEL)];
    case 'washer':
    case 'dryer':
      return [
        box(0, 0, w, h, 0, 3.2, STEEL),
        cyl(0, 0, Math.min(w, h) * 0.5, 3.2, 3.35, DRUM),
      ];
    case 'stove':
      return [box(0, 0, w, h, 0, 3.0, BLACK)];
    default: {
      const color = FURNITURE_CATALOG.find((c) => c.id === id)?.color ?? '#6a7080';
      const z1 = id === 'fridge' || id === 'closet' || id === 'mech-closet' ? 6.2 : 3.1;
      return [box(0, 0, w, h, 0, z1, color)];
    }
  }
}

export function partRingCount(part: FurnPart): number {
  if (part.shape === 'cyl') return 8;
  if (part.shape === 'oval') return 10;
  return 4;
}

export function partLocalRing(part: FurnPart): { x: number; y: number }[] {
  const n = partRingCount(part);
  if (n === 4) {
    return [
      { x: -part.lw / 2, y: -part.lh / 2 },
      { x: part.lw / 2, y: -part.lh / 2 },
      { x: part.lw / 2, y: part.lh / 2 },
      { x: -part.lw / 2, y: part.lh / 2 },
    ];
  }
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    pts.push({ x: Math.cos(a) * part.lw / 2, y: Math.sin(a) * part.lh / 2 });
  }
  return pts;
}

function worldOf(item: FurnitureItem, lx: number, ly: number): { x: number; y: number } {
  const ca = Math.cos(item.rot || 0);
  const sa = Math.sin(item.rot || 0);
  return {
    x: item.x + lx * ca - ly * sa,
    y: item.y + lx * sa + ly * ca,
  };
}

export function partWorldRing(item: FurnitureItem, part: FurnPart): { x: number; y: number }[] {
  return partLocalRing(part).map((p) => worldOf(item, part.lx + p.x, part.ly + p.y));
}

export function partWorldCorners(item: FurnitureItem, part: FurnPart): { x: number; y: number }[] {
  const ring = partWorldRing(item, part);
  if (ring.length === 4) return ring;
  const ca = Math.cos(item.rot || 0);
  const sa = Math.sin(item.rot || 0);
  const corners: [number, number][] = [
    [-part.lw / 2, -part.lh / 2],
    [part.lw / 2, -part.lh / 2],
    [part.lw / 2, part.lh / 2],
    [-part.lw / 2, part.lh / 2],
  ];
  return corners.map(([dx, dy]) => {
    const lx = part.lx + dx;
    const ly = part.ly + dy;
    return {
      x: item.x + lx * ca - ly * sa,
      y: item.y + lx * sa + ly * ca,
    };
  });
}
