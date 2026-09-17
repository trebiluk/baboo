/** Solid 3D look palettes — 1.1.1 knobs. Chromebook SVG, no WebGL. */
import type { SiteFinish, SkyPreset, WallTintId } from '../types';

export type { SkyPreset, SiteFinish, WallTintId };

export const DEFAULT_SKY: SkyPreset = 'day';
export const DEFAULT_SITE: SiteFinish = 'grass';
export const DEFAULT_WALL_TINT: WallTintId = 'sand';

export const SKY_OPTIONS: { id: SkyPreset; label: string }[] = [
  { id: 'day', label: 'Day' },
  { id: 'dusk', label: 'Soft dusk' },
  { id: 'overcast', label: 'Overcast' },
];

export const SITE_OPTIONS: { id: SiteFinish; label: string }[] = [
  { id: 'grass', label: 'Grass' },
  { id: 'gravel', label: 'Gravel' },
  { id: 'pad', label: 'Pad' },
  { id: 'dirt', label: 'Dirt' },
  { id: 'sand', label: 'Sand' },
  { id: 'deck', label: 'Deck' },
  { id: 'mulch', label: 'Mulch' },
];

export const WALL_TINT_OPTIONS: { id: WallTintId; label: string }[] = [
  { id: 'sand', label: 'Sand' },
  { id: 'white', label: 'White' },
  { id: 'cream', label: 'Cream' },
  { id: 'butter', label: 'Butter' },
  { id: 'blush', label: 'Blush' },
  { id: 'clay', label: 'Clay' },
  { id: 'terra', label: 'Terra' },
  { id: 'sage', label: 'Sage' },
  { id: 'mint', label: 'Mint' },
  { id: 'sky', label: 'Sky' },
  { id: 'navy', label: 'Navy' },
  { id: 'slate', label: 'Slate' },
  { id: 'charcoal', label: 'Charcoal' },
];

export const SKY_PALETTE: Record<SkyPreset, {
  zenith: string; mid: string; horizon: string;
  horizonLine: string; horizonLineOpacity: number; fog: string;
}> = {
  day: {
    zenith: '#8EB6D8', mid: '#B7CCE0', horizon: '#D6E2EE',
    horizonLine: '#A8D4E8', horizonLineOpacity: 0.35, fog: '#C5D0DC',
  },
  dusk: {
    zenith: '#6B7F9A', mid: '#8FA0B5', horizon: '#C4B8B0',
    horizonLine: '#A8B4C8', horizonLineOpacity: 0.2, fog: '#B8C0CC',
  },
  overcast: {
    zenith: '#9AA8B5', mid: '#B8C2CB', horizon: '#D3D9DF',
    horizonLine: '#A8B4C0', horizonLineOpacity: 0.25, fog: '#C8CED4',
  },
};

export const SITE_PALETTE: Record<SiteFinish, { ground: string; deep: string; edge: string }> = {
  grass: { ground: '#5F6F52', deep: '#4A5642', edge: '#6D7A62' },
  gravel: { ground: '#8A8680', deep: '#6E6A64', edge: '#A09B94' },
  pad: { ground: '#9CA3AF', deep: '#787F8B', edge: '#B0B6C0' },
  dirt: { ground: '#6B5344', deep: '#534032', edge: '#8A6A54' },
  sand: { ground: '#D4C4A0', deep: '#B8A878', edge: '#E0D4B4' },
  deck: { ground: '#8B6914', deep: '#6B4E10', edge: '#C4A074' },
  mulch: { ground: '#5C4030', deep: '#3E2A20', edge: '#8A6248' },
};

export const WALL_TINT: Record<WallTintId, { fill: string; edge: string; fillShade: string }> = {
  white: { fill: '#F1F5F9', edge: '#94A3B8', fillShade: '#E2E8F0' },
  sand: { fill: '#E7E0D4', edge: '#A89F90', fillShade: '#D9D0C2' },
  clay: { fill: '#C4A484', edge: '#8B7355', fillShade: '#B39272' },
  slate: { fill: '#64748B', edge: '#334155', fillShade: '#52627A' },
  sage: { fill: '#8A9A7B', edge: '#5C6B50', fillShade: '#7A8A6B' },
  sky: { fill: '#B6C8DC', edge: '#6B849E', fillShade: '#A4B8CE' },
  cream: { fill: '#F5EDE0', edge: '#C4B49A', fillShade: '#E8DCC8' },
  blush: { fill: '#E8C4C4', edge: '#B88888', fillShade: '#D8B0B0' },
  navy: { fill: '#3D4F6F', edge: '#243248', fillShade: '#33445E' },
  charcoal: { fill: '#3A3F46', edge: '#1F2328', fillShade: '#2E333A' },
  butter: { fill: '#F0E4A8', edge: '#C4B46A', fillShade: '#E4D690' },
  mint: { fill: '#B8D4C8', edge: '#7AA090', fillShade: '#A4C4B6' },
  terra: { fill: '#C47850', edge: '#8A4E32', fillShade: '#B06844' },
};

export function isSkyPreset(v: unknown): v is SkyPreset {
  return v === 'day' || v === 'dusk' || v === 'overcast';
}
export function isSiteFinish(v: unknown): v is SiteFinish {
  return v === 'grass' || v === 'gravel' || v === 'pad'
    || v === 'dirt' || v === 'sand' || v === 'deck' || v === 'mulch';
}
export function isWallTintId(v: unknown): v is WallTintId {
  return v === 'white' || v === 'sand' || v === 'clay' || v === 'slate' || v === 'sage' || v === 'sky'
    || v === 'cream' || v === 'blush' || v === 'navy' || v === 'charcoal' || v === 'butter' || v === 'mint' || v === 'terra';
}

export function asSky(v: unknown): SkyPreset {
  return isSkyPreset(v) ? v : DEFAULT_SKY;
}
export function asSite(v: unknown): SiteFinish {
  return isSiteFinish(v) ? v : DEFAULT_SITE;
}
export function asTint(v: unknown): WallTintId {
  return isWallTintId(v) ? v : DEFAULT_WALL_TINT;
}
export function asShowFurniture3d(v: unknown): boolean {
  return v !== false;
}

export function hexAlpha(hex: string, a: number): string {
  const n = hex.replace('#', '');
  const rgb = n.length === 3
    ? n.split('').map((c) => parseInt(c + c, 16))
    : [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
  return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;
}
