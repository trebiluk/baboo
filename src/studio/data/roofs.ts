import type { RoofStyleId, StyleId } from '../types';

export type RoofDef = {
  id: RoofStyleId;
  name: string;
  blurb: string;
};

/** Curriculum ROOF-STYLES-MVP.md + Diego grass/sod. */
export const ROOF_STYLE_OPTIONS: RoofDef[] = [
  { id: 'gable', name: 'Gable', blurb: 'Two slopes meet at a ridge — triangle ends.' },
  { id: 'hip', name: 'Hip', blurb: 'Slopes on all sides meet toward the top.' },
  { id: 'gambrel', name: 'Gambrel', blurb: 'Barn-like — shallow then steep pitch each side.' },
  { id: 'shed', name: 'Shed', blurb: 'One single slope — lean-to look.' },
  { id: 'flat', name: 'Flat', blurb: 'Almost level — modern / low profile.' },
  { id: 'mansard', name: 'Mansard', blurb: 'Steep sides + flatter top — French attic roof.' },
  { id: 'grass', name: 'Grass / sod', blurb: 'Living turf roof — soft green mound, readable hatch (Hobbit). Apple-polish, not cartoon.' },
  { id: 'conical', name: 'Conical', blurb: 'Cone roof over a round plan — Yurt; radial spokes to a peak.' },
];

export function roofStyleName(id: RoofStyleId | null | undefined): string {
  if (!id) return 'None';
  return ROOF_STYLE_OPTIONS.find((o) => o.id === id)?.name ?? id;
}

/**
 * Default roof by house template.
 * Colonial / Arts & Crafts / Greek Revival → gable
 * Ranch → hip · Hobbit → grass (Diego) · Tiny Home → shed · Yurt → conical
 */
export const DEFAULT_ROOF_BY_STYLE: Record<StyleId, RoofStyleId | null> = {
  blank: null,
  colonial: 'gable',
  'arts-crafts': 'gable',
  'greek-revival': 'gable',
  hobbit: 'grass',
  ranch: 'hip',
  victorian: 'mansard',
  'cape-cod': 'gable',
  modern: 'flat',
  tudor: 'gable',
  yurt: 'conical',
  'tiny-home': 'shed',
  'dog-house': 'gable',
};

export function roofDefaultForStyle(styleId: StyleId | string): RoofStyleId | null {
  return DEFAULT_ROOF_BY_STYLE[styleId as StyleId] ?? null;
}
