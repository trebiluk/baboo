/** 3D peek meshes. Kenney matches the plan. Quaternius is a curated house subset. */
const K = '/objects/kenney/';
const Q = '/objects/quaternius/';

type Row = { kenney?: string; quaternius?: string };

const RAW: Record<string, Row> = {
  'bed-twin': { kenney: 'bedSingle.glb', quaternius: 'bed-single.glb' },
  'bed-queen': { kenney: 'bedDouble.glb', quaternius: 'bed-king.glb' },
  nightstand: { kenney: 'cabinetBedDrawer.glb', quaternius: 'nightstand-1.glb' },
  dresser: { kenney: 'cabinetTelevision.glb', quaternius: 'drawer-1.glb' },
  closet: { kenney: 'bookcaseClosedDoors.glb', quaternius: 'bookshelf.glb' },
  'storage-shelf': { kenney: 'bookcaseOpen.glb', quaternius: 'shelf-large.glb' },
  sofa: { kenney: 'loungeSofa.glb', quaternius: 'couch-medium.glb' },
  chair: { kenney: 'loungeChair.glb', quaternius: 'chair-1.glb' },
  'coffee-table': { kenney: 'tableCoffee.glb', quaternius: 'table-round-small.glb' },
  'dining-table': { kenney: 'table.glb', quaternius: 'table-round-large.glb' },
  'dining-chair': { kenney: 'chair.glb', quaternius: 'chair-2.glb' },
  fridge: { kenney: 'kitchenFridge.glb', quaternius: 'kitchen-fridge.glb' },
  stove: { kenney: 'kitchenStove.glb', quaternius: 'kitchen-oven.glb' },
  sink: { kenney: 'kitchenSink.glb', quaternius: 'kitchen-sink.glb' },
  toilet: { kenney: 'toilet.glb', quaternius: 'bathroom-toilet.glb' },
  bathtub: { kenney: 'bathtub.glb', quaternius: 'bathroom-bathtub.glb' },
  desk: { kenney: 'desk.glb' },
  washer: { kenney: 'washer.glb', quaternius: 'washing-machine.glb' },
  dryer: { kenney: 'dryer.glb' },
  'mech-closet': { kenney: 'kitchenCabinet.glb', quaternius: 'kitchen-cabinet.glb' },
};

export function peekFor(catalogId: string): { kenney?: string; quaternius?: string } | null {
  const row = RAW[catalogId];
  if (!row) return null;
  const kenney = row.kenney ? `${K}${row.kenney}` : undefined;
  const quaternius = row.quaternius ? `${Q}${row.quaternius}` : undefined;
  if (!kenney && !quaternius) return null;
  return { kenney, quaternius };
}
