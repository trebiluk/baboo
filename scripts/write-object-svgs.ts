import { mkdirSync, writeFileSync } from 'node:fs';
import { createJiti } from 'jiti';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const jiti = createJiti(import.meta.url);
const { FURNITURE_CATALOG } = jiti('../src/studio/data/furniture.ts');
const { objectSvg } = jiti('../src/studio/data/objectArt.ts');
const dir = join(root, 'public/objects/baboo');
mkdirSync(dir, { recursive: true });
for (const cat of FURNITURE_CATALOG) {
  writeFileSync(join(dir, `${cat.id}.svg`), objectSvg(cat.id));
}
console.log(`wrote ${FURNITURE_CATALOG.length} object vectors`);
