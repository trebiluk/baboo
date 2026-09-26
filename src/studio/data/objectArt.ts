/** One scalable vector picture per catalog object. Same parts as the plan and the 3D. */
import type { FurnitureItem } from '../types';
import { FURNITURE_CATALOG } from './furniture';
import { furnitureParts } from '../lib/furnShape';

function n(v: number): string {
  return (Math.round(v * 1000) / 1000).toString();
}

function esc(s: string): string {
  return s.replace(/&/g, '&').replace(/</g, '<').replace(/"/g, '"');
}

export function objectSvg(catalogId: string, color?: string | null): string {
  const cat = FURNITURE_CATALOG.find((c) => c.id === catalogId);
  if (!cat) return '';
  const item: FurnitureItem = {
    id: 'art',
    catalogId,
    x: 0,
    y: 0,
    w: cat.w,
    h: cat.h,
    rot: 0,
    zIndex: 1,
    label: cat.name,
    ...(color ? { color } : {}),
  };
  const parts = furnitureParts(item);
  const pad = 0.28;
  const x = -cat.w / 2 - pad;
  const y = -cat.h / 2 - pad;
  const vbW = cat.w + pad * 2;
  const vbH = cat.h + pad * 2;
  const shapes = parts.map((p) => {
    const paint = p.tex ? ` data-tex="${p.tex}"` : '';
    if (p.shape === 'cyl' || p.shape === 'oval') {
      return `<ellipse cx="${n(p.lx)}" cy="${n(p.ly)}" rx="${n(p.lw / 2)}" ry="${n(p.lh / 2)}" fill="${p.fill}" stroke="#2a2e34" stroke-width="0.05"${paint}/>`;
    }
    return `<rect x="${n(p.lx - p.lw / 2)}" y="${n(p.ly - p.lh / 2)}" width="${n(p.lw)}" height="${n(p.lh)}" rx="0.06" fill="${p.fill}" stroke="#2a2e34" stroke-width="0.05"${paint}/>`;
  }).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${n(x)} ${n(y)} ${n(vbW)} ${n(vbH)}" role="img" aria-label="${esc(cat.name)}">
<rect x="${n(x)}" y="${n(y)}" width="${n(vbW)}" height="${n(vbH)}" fill="#ffffff"/>
${shapes}
</svg>
`;
}
