import type { PlantKind } from '../types';

export const PLANT_CATALOG: {
  id: PlantKind;
  name: string;
  w: number;
  h: number;
  color: string;
}[] = [
  { id: 'tree', name: 'Tree', w: 6, h: 6, color: '#3D7A4A' },
  { id: 'bed', name: 'Plant bed', w: 8, h: 3, color: '#5A8F4A' },
  { id: 'path', name: 'Path', w: 8, h: 2.2, color: '#C4B59A' },
];

export function plantType(id: PlantKind) {
  return PLANT_CATALOG.find((p) => p.id === id) ?? PLANT_CATALOG[0];
}
