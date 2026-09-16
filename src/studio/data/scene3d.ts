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
];

export const WALL_TINT_OPTIONS: { id: WallTintId; label: string }[] = [
  { id: 'sand', label: 'Sand' },
  { id: 'white', label: 'White' },
  { id: 'clay', label: 'Clay' },
  { id: 'slate', label: 'Slate' },
  { id: 'sage', label: 'Sage' },
  { id: 'sky', label: 'Sky' },
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
};

export const WALL_TINT: Record<WallTintId, { fill: string; edge: string; fillShade: string }> = {
  white: { fill: '#F1F5F9', edge: '#94A3B8', fillShade: '#E2E8F0' },
  sand: { fill: '#E7E0D4', edge: '#A89F90', fillShade: '#D9D0C2' },
  clay: { fill: '#C4A484', edge: '#8B7355', fillShade: '#B39272' },
  slate: { fill: '#64748B', edge: '#334155', fillShade: '#52627A' },
  sage: { fill: '#8A9A7B', edge: '#5C6B50', fillShade: '#7A8A6B' },
  sky: { fill: '#B6C8DC', edge: '#6B849E', fillShade: '#A4B8CE' },
};

export function isSkyPreset(v: unknown): v is SkyPreset {
  return v === 'day' || v === 'dusk' || v === 'overcast';
}
export function isSiteFinish(v: unknown): v is SiteFinish {
  return v === 'grass' || v === 'gravel' || v === 'pad';
}
export function isWallTintId(v: unknown): v is WallTintId {
  return v === 'white' || v === 'sand' || v === 'clay' || v === 'slate' || v === 'sage' || v === 'sky';
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
