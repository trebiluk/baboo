/** One Baboo vector per catalog object. See public/objects/baboo/. */
import { FURNITURE_CATALOG } from './furniture';

const IDS = new Set(FURNITURE_CATALOG.map((c) => c.id));

export function symbolSrc(catalogId: string): string | undefined {
  return IDS.has(catalogId) ? `/objects/baboo/${catalogId}.svg` : undefined;
}
