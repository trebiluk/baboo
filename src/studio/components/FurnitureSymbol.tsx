import { Group, Rect, Ellipse } from 'react-konva';
import type { FurnitureItem } from '../types';
import { FURNITURE_CATALOG } from '../data/furniture';
import { furnitureParts } from '../lib/furnShape';

type Props = {
  item: FurnitureItem;
  selected: boolean;
  accent: string;
  stroke: string;
  zoom: number;
  light: boolean;
  simple?: boolean;
};

/** Plan picture from the same parts as the vector file and the 3D. Color rides on the piece. */
export function FurnitureSymbol({ item, selected, accent, stroke, zoom, simple }: Props) {
  const sw = (selected ? 2.2 : 1.15) / zoom;
  const ink = selected ? accent : stroke;
  const parts = furnitureParts(item, simple ? 'simple' : 'full');
  return (
    <Group listening={false}>
      {parts.map((p, i) => {
        const round = p.shape === 'cyl' || p.shape === 'oval';
        if (round) {
          return (
            <Ellipse
              key={i}
              x={p.lx}
              y={p.ly}
              radiusX={p.lw / 2}
              radiusY={p.lh / 2}
              fill={p.fill}
              stroke={ink}
              strokeWidth={sw * 0.65}
              listening={false}
            />
          );
        }
        return (
          <Rect
            key={i}
            x={p.lx - p.lw / 2}
            y={p.ly - p.lh / 2}
            width={p.lw}
            height={p.lh}
            fill={p.fill}
            stroke={ink}
            strokeWidth={sw * 0.6}
            cornerRadius={0.05}
            listening={false}
          />
        );
      })}
    </Group>
  );
}

/** Tiny catalog glyph — the same vector, no Konva. */
export function FurnitureGlyph({ catalogId }: { catalogId: string }) {
  const cat = FURNITURE_CATALOG.find((c) => c.id === catalogId);
  const w = cat?.w ?? 3;
  const h = cat?.h ?? 3;
  const item: FurnitureItem = {
    id: 'g',
    catalogId,
    x: 0,
    y: 0,
    w,
    h,
    rot: 0,
    zIndex: 1,
    label: cat?.name ?? catalogId,
  };
  const parts = furnitureParts(item);
  const pad = 0.28;
  return (
    <svg
      className="furn-glyph"
      viewBox={`${-w / 2 - pad} ${-h / 2 - pad} ${w + pad * 2} ${h + pad * 2}`}
      aria-hidden="true"
    >
      <rect x={-w / 2 - pad} y={-h / 2 - pad} width={w + pad * 2} height={h + pad * 2} fill="#ffffff" />
      {parts.map((p, i) => {
        const round = p.shape === 'cyl' || p.shape === 'oval';
        if (round) {
          return (
            <ellipse
              key={i}
              cx={p.lx}
              cy={p.ly}
              rx={p.lw / 2}
              ry={p.lh / 2}
              fill={p.fill}
              stroke="#2a2e34"
              strokeWidth={0.05}
            />
          );
        }
        return (
          <rect
            key={i}
            x={p.lx - p.lw / 2}
            y={p.ly - p.lh / 2}
            width={p.lw}
            height={p.lh}
            fill={p.fill}
            stroke="#2a2e34"
            strokeWidth={0.05}
            rx={0.06}
          />
        );
      })}
    </svg>
  );
}
