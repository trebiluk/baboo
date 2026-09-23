/** Plan symbols from FloorPlanSVGSymbols (MIT, Richard Duerr, 2023). */
const BASE = '/objects/floorplan/';

const FILE: Record<string, string> = {
  'bed-twin': 'QueenBed.svg',
  'bed-queen': 'QueenBed.svg',
  nightstand: 'EndTable.svg',
  dresser: 'Cabinet.svg',
  closet: 'Cabinet.svg',
  'storage-shelf': 'Cabinet.svg',
  chair: 'Chair.svg',
  'coffee-table': 'Table.svg',
  'dining-table': 'Table.svg',
  'dining-chair': 'Chair.svg',
  fridge: 'Refrigerator.svg',
  stove: 'Stove.svg',
  sink: 'Sink.svg',
  toilet: 'Toilet.svg',
  bathtub: 'Tub.svg',
  desk: 'Table.svg',
  'water-heater': 'WaterHeater.svg',
  'mech-closet': 'Cabinet.svg',
  washer: 'Washer.svg',
  dryer: 'Dryer.svg',
};

export function symbolSrc(catalogId: string): string | undefined {
  const file = FILE[catalogId];
  return file ? `${BASE}${file}` : undefined;
}

export const SOFA_PARTS = [
  `${BASE}CouchLeft.svg`,
  `${BASE}CouchMiddle.svg`,
  `${BASE}CouchRight.svg`,
] as const;
