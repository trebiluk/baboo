import { useEffect, useState } from 'react';
import { Group, Rect, Ellipse, Circle, Line, Arc, Image as KImage } from 'react-konva';
import type { FurnitureItem } from '../types';
import { FURNITURE_CATALOG } from '../data/furniture';
import { furnitureParts } from '../lib/furnShape';
import { SOFA_PARTS, symbolSrc } from '../data/objectSymbols';

type Props = {
  item: FurnitureItem;
  selected: boolean;
  accent: string;
  stroke: string;
  zoom: number;
  light: boolean;
  simple?: boolean;
};

/** Architectural plan symbols that read as the object, not a colored box. Local feet. */
export function FurnitureSymbol({ item, selected, accent, stroke, zoom, light, simple }: Props) {
  const w = item.w;
  const h = item.h;
  const hw = w / 2;
  const hh = h / 2;
  const sw = (selected ? 2.2 : 1.2) / zoom;
  const ink = selected ? accent : stroke;
  const id = item.catalogId;

  const wood = light ? '#C4A074' : '#6B5344';
  const woodDk = light ? '#8B6914' : '#4A382C';
  const linen = light ? '#EDE4D4' : '#8A8070';
  const uph = light ? '#5C8A58' : '#3A5234';
  const uphDk = light ? '#3F6A3C' : '#2A3E28';
  const steel = light ? '#C5D0DC' : '#6A7888';
  const white = light ? '#F4F7FA' : '#D8DEE6';
  const water = light ? '#B9D7EE' : '#3D6A88';

  const body = (fill: string, cr = 0.08) => (
    <Rect
      x={-hw}
      y={-hh}
      width={w}
      height={h}
      fill={fill}
      stroke={ink}
      strokeWidth={sw}
      cornerRadius={cr}
      listening={false}
    />
  );

  if (simple) {
    const fill =
      id.startsWith('bed') ? linen
        : id === 'sofa' || id === 'chair' ? uph
          : id === 'stove' ? (light ? '#4A4A50' : '#2A2A30')
            : id === 'toilet' || id === 'bathtub' ? white
              : id === 'fridge' || id === 'washer' || id === 'dryer' || id === 'sink' ? steel
                : wood;
    return (
      <Group listening={false}>
        {id === 'coffee-table' || id === 'water-heater' || id === 'bathtub' || id === 'toilet' ? (
          <Ellipse radiusX={hw} radiusY={hh} fill={fill} stroke={ink} strokeWidth={sw} listening={false} />
        ) : (
          body(fill, 0.1)
        )}
      </Group>
    );
  }

  const src = symbolSrc(id);
  if (src) return <SvgFootprint src={src} w={w} h={h} ink={ink} sw={sw} />;
  if (id === 'sofa') return <SofaFootprint w={w} h={h} ink={ink} sw={sw} />;

  switch (id) {
    case 'bed-twin':
    case 'bed-queen': {
      const two = id === 'bed-queen' || w >= 4.5;
      return (
        <Group listening={false}>
          {body(linen, 0.12)}
          <Rect x={-hw} y={-hh} width={w} height={0.28} fill={woodDk} stroke={ink} strokeWidth={sw} listening={false} />
          <Rect x={-hw * 0.92} y={hh - 0.22} width={w * 0.92} height={0.18} fill={wood} stroke={ink} strokeWidth={sw * 0.8} listening={false} />
          {two ? (
            <>
              <Ellipse x={-w * 0.2} y={-hh + 0.78} radiusX={w * 0.18} radiusY={0.48} fill={white} stroke={ink} strokeWidth={sw * 0.8} listening={false} />
              <Ellipse x={w * 0.2} y={-hh + 0.78} radiusX={w * 0.18} radiusY={0.48} fill={white} stroke={ink} strokeWidth={sw * 0.8} listening={false} />
            </>
          ) : (
            <Ellipse x={0} y={-hh + 0.78} radiusX={w * 0.3} radiusY={0.48} fill={white} stroke={ink} strokeWidth={sw * 0.8} listening={false} />
          )}
          <Line points={[-hw * 0.82, 0.22, hw * 0.82, 0.22]} stroke={ink} strokeWidth={sw * 0.7} dash={[0.12, 0.1]} listening={false} />
        </Group>
      );
    }
    case 'nightstand':
      return (
        <Group listening={false}>
          {body(wood, 0.06)}
          <Line points={[-hw * 0.7, -0.05, hw * 0.7, -0.05]} stroke={ink} strokeWidth={sw * 0.8} listening={false} />
          <Circle x={0} y={hh * 0.32} radius={0.1} fill={woodDk} stroke={ink} strokeWidth={sw * 0.6} listening={false} />
        </Group>
      );
    case 'dresser':
      return (
        <Group listening={false}>
          {body(wood, 0.06)}
          {[-0.32, 0, 0.32].map((t) => (
            <Group key={t} listening={false}>
              <Line points={[-hw * 0.8, t * h, hw * 0.8, t * h]} stroke={ink} strokeWidth={sw * 0.8} listening={false} />
              <Circle x={-w * 0.16} y={t * h + 0.18} radius={0.07} fill={woodDk} listening={false} />
              <Circle x={w * 0.16} y={t * h + 0.18} radius={0.07} fill={woodDk} listening={false} />
            </Group>
          ))}
        </Group>
      );
    case 'closet':
      return (
        <Group listening={false}>
          {body(wood, 0.04)}
          <Line points={[0, -hh * 0.9, 0, hh * 0.9]} stroke={ink} strokeWidth={sw} listening={false} />
          <Line points={[-hw * 0.75, -hh * 0.55, hw * 0.75, -hh * 0.55]} stroke={ink} strokeWidth={sw} listening={false} />
          <Circle x={-w * 0.08} y={0} radius={0.08} fill={woodDk} listening={false} />
          <Circle x={w * 0.08} y={0} radius={0.08} fill={woodDk} listening={false} />
        </Group>
      );
    case 'storage-shelf':
      return (
        <Group listening={false}>
          {body(wood, 0.04)}
          {[-0.3, 0, 0.3].map((t) => (
            <Line key={t} points={[-hw * 0.85, t * h, hw * 0.85, t * h]} stroke={ink} strokeWidth={sw} listening={false} />
          ))}
          <Rect x={-w * 0.32} y={-h * 0.22} width={w * 0.22} height={h * 0.18} fill={woodDk} listening={false} />
        </Group>
      );
    case 'sofa':
      return (
        <Group listening={false}>
          <Rect x={-hw} y={-hh} width={w} height={h} fill={uph} stroke={ink} strokeWidth={sw} cornerRadius={0.22} listening={false} />
          <Rect x={-hw} y={-hh} width={w} height={0.48} fill={uphDk} stroke={ink} strokeWidth={sw} cornerRadius={0.16} listening={false} />
          <Ellipse x={-hw + 0.28} y={0.08} radiusX={0.28} radiusY={h * 0.38} fill={uphDk} stroke={ink} strokeWidth={sw * 0.8} listening={false} />
          <Ellipse x={hw - 0.28} y={0.08} radiusX={0.28} radiusY={h * 0.38} fill={uphDk} stroke={ink} strokeWidth={sw * 0.8} listening={false} />
          <Line points={[-w * 0.02, -hh + 0.55, -w * 0.02, hh - 0.22]} stroke={ink} strokeWidth={sw * 0.6} listening={false} />
        </Group>
      );
    case 'chair':
      return (
        <Group listening={false}>
          <Rect x={-hw} y={-hh} width={w} height={h} fill={uph} stroke={ink} strokeWidth={sw} cornerRadius={0.18} listening={false} />
          <Rect x={-hw} y={-hh} width={w} height={0.42} fill={uphDk} stroke={ink} strokeWidth={sw} listening={false} />
          <Ellipse x={-hw + 0.2} y={0.1} radiusX={0.18} radiusY={h * 0.32} fill={uphDk} listening={false} />
          <Ellipse x={hw - 0.2} y={0.1} radiusX={0.18} radiusY={h * 0.32} fill={uphDk} listening={false} />
        </Group>
      );
    case 'coffee-table':
      return (
        <Group listening={false}>
          <Ellipse radiusX={hw} radiusY={hh} fill={wood} stroke={ink} strokeWidth={sw} listening={false} />
          <Ellipse radiusX={hw * 0.28} radiusY={hh * 0.28} fill={woodDk} stroke={ink} strokeWidth={sw * 0.7} listening={false} />
          <Ellipse radiusX={hw * 0.72} radiusY={hh * 0.72} stroke={ink} strokeWidth={sw * 0.6} listening={false} />
        </Group>
      );
    case 'dining-table':
      return (
        <Group listening={false}>
          <Rect x={-hw} y={-hh} width={w} height={h} fill={wood} stroke={ink} strokeWidth={sw} cornerRadius={0.2} listening={false} />
          <Rect x={-hw + 0.22} y={-hh + 0.22} width={w - 0.44} height={h - 0.44} stroke={ink} strokeWidth={sw * 0.7} cornerRadius={0.14} listening={false} />
          {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy]) => (
            <Rect key={`${sx}${sy}`} x={sx * hw * 0.72 - 0.1} y={sy * hh * 0.62 - 0.1} width={0.2} height={0.2} fill={woodDk} listening={false} />
          ))}
        </Group>
      );
    case 'dining-chair':
      return (
        <Group listening={false}>
          <Rect x={-hw * 0.85} y={-hh * 0.32} width={w * 0.85} height={h * 0.68} fill={wood} stroke={ink} strokeWidth={sw} cornerRadius={0.08} listening={false} />
          <Rect x={-hw * 0.85} y={-hh} width={w * 0.85} height={0.28} fill={woodDk} stroke={ink} strokeWidth={sw} listening={false} />
          <Line points={[-w * 0.18, -hh + 0.32, -w * 0.18, hh * 0.25]} stroke={ink} strokeWidth={sw * 0.7} listening={false} />
          <Line points={[w * 0.18, -hh + 0.32, w * 0.18, hh * 0.25]} stroke={ink} strokeWidth={sw * 0.7} listening={false} />
        </Group>
      );
    case 'fridge':
      return (
        <Group listening={false}>
          {body(steel, 0.06)}
          <Line points={[-hw * 0.9, -hh * 0.22, hw * 0.9, -hh * 0.22]} stroke={ink} strokeWidth={sw} listening={false} />
          <Rect x={hw * 0.52} y={-hh * 0.7} width={0.14} height={0.5} fill={woodDk} listening={false} />
          <Rect x={hw * 0.52} y={hh * 0.05} width={0.14} height={0.7} fill={woodDk} listening={false} />
        </Group>
      );
    case 'stove': {
      const r = Math.min(w, h) * 0.14;
      const ox = w * 0.22;
      const oy = h * 0.2;
      return (
        <Group listening={false}>
          {body(light ? '#4A4A50' : '#2A2A30', 0.06)}
          {[[-ox, -oy], [ox, -oy], [-ox, oy], [ox, oy]].map(([cx, cy], i) => (
            <Group key={i} listening={false}>
              <Circle x={cx} y={cy} radius={r} stroke={ink} strokeWidth={sw} fill={light ? '#6A6A70' : '#1A1A1E'} listening={false} />
              <Circle x={cx} y={cy} radius={r * 0.45} stroke={ink} strokeWidth={sw * 0.7} listening={false} />
            </Group>
          ))}
          {[-0.28, -0.1, 0.1, 0.28].map((t) => (
            <Circle key={t} x={t * w} y={-hh + 0.16} radius={0.07} fill={steel} stroke={ink} strokeWidth={sw * 0.6} listening={false} />
          ))}
        </Group>
      );
    }
    case 'sink':
      return (
        <Group listening={false}>
          {body(steel, 0.08)}
          <Ellipse radiusX={w * 0.28} radiusY={h * 0.28} fill={water} stroke={ink} strokeWidth={sw} listening={false} />
          <Line points={[0, -h * 0.42, 0, -h * 0.18]} stroke={ink} strokeWidth={sw} listening={false} />
          <Arc x={0} y={-h * 0.18} innerRadius={0} outerRadius={0.18} angle={180} rotation={180} stroke={ink} strokeWidth={sw} listening={false} />
        </Group>
      );
    case 'toilet':
      return (
        <Group listening={false}>
          <Rect x={-hw} y={-hh} width={w} height={h * 0.36} fill={white} stroke={ink} strokeWidth={sw} cornerRadius={0.06} listening={false} />
          <Ellipse x={0} y={hh * 0.28} radiusX={w * 0.42} radiusY={h * 0.38} fill={white} stroke={ink} strokeWidth={sw} listening={false} />
          <Ellipse x={0} y={hh * 0.32} radiusX={w * 0.26} radiusY={h * 0.22} fill={water} stroke={ink} strokeWidth={sw * 0.7} listening={false} />
          <Circle x={w * 0.22} y={-hh + 0.18} radius={0.08} fill={steel} listening={false} />
        </Group>
      );
    case 'bathtub':
      return (
        <Group listening={false}>
          <Ellipse radiusX={hw} radiusY={hh} fill={white} stroke={ink} strokeWidth={sw} listening={false} />
          <Ellipse radiusX={hw * 0.72} radiusY={hh * 0.52} fill={water} stroke={ink} strokeWidth={sw * 0.8} listening={false} />
          <Circle x={-w * 0.32} y={-h * 0.18} radius={0.1} fill={steel} stroke={ink} strokeWidth={sw * 0.6} listening={false} />
        </Group>
      );
    case 'desk':
      return (
        <Group listening={false}>
          <Rect x={-hw} y={-hh} width={w} height={0.48} fill={wood} stroke={ink} strokeWidth={sw} listening={false} />
          <Rect x={-hw} y={-hh} width={0.38} height={h} fill={woodDk} stroke={ink} strokeWidth={sw} listening={false} />
          <Rect x={hw - 0.38} y={-hh} width={0.38} height={h} fill={woodDk} stroke={ink} strokeWidth={sw} listening={false} />
          <Rect x={-w * 0.08} y={-hh + 0.08} width={w * 0.22} height={0.22} fill={white} listening={false} />
        </Group>
      );
    case 'water-heater':
      return (
        <Group listening={false}>
          <Circle radius={Math.min(hw, hh)} fill={steel} stroke={ink} strokeWidth={sw} listening={false} />
          <Circle radius={Math.min(hw, hh) * 0.55} stroke={ink} strokeWidth={sw * 0.7} listening={false} />
          <Line points={[0, -hh * 0.55, 0, hh * 0.55]} stroke={ink} strokeWidth={sw * 0.8} listening={false} />
        </Group>
      );
    case 'mech-closet':
      return (
        <Group listening={false}>
          {body(steel, 0.04)}
          <Line points={[-hw * 0.7, -hh * 0.7, hw * 0.7, hh * 0.7]} stroke={ink} strokeWidth={sw} listening={false} />
          <Line points={[hw * 0.7, -hh * 0.7, -hw * 0.7, hh * 0.7]} stroke={ink} strokeWidth={sw} listening={false} />
        </Group>
      );
    case 'washer':
    case 'dryer':
      return (
        <Group listening={false}>
          {body(steel, 0.08)}
          <Circle radius={Math.min(w, h) * 0.32} fill={id === 'washer' ? water : light ? '#3A3A40' : '#1A1A1E'} stroke={ink} strokeWidth={sw} listening={false} />
          <Circle radius={Math.min(w, h) * 0.18} stroke={ink} strokeWidth={sw * 0.7} listening={false} />
          <Circle x={hw * 0.55} y={-hh * 0.55} radius={0.12} fill={woodDk} listening={false} />
        </Group>
      );
    default:
      return (
        <Group listening={false}>
          {body(wood, 0.08)}
        </Group>
      );
  }
}

/** Tiny catalog glyph — top-down parts, no Konva. */
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
  const pad = 0.18;
  return (
    <svg
      className="furn-glyph"
      viewBox={`${-w / 2 - pad} ${-h / 2 - pad} ${w + pad * 2} ${h + pad * 2}`}
      aria-hidden="true"
    >
      <rect x={-w / 2 - pad} y={-h / 2 - pad} width={w + pad * 2} height={h + pad * 2} fill="#F3EEE4" rx={0.12} />
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
              stroke="#3f3f46"
              strokeWidth={0.04}
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
            stroke="#3f3f46"
            strokeWidth={0.04}
            rx={0.05}
          />
        );
      })}
    </svg>
  );
}

const symbolCache = new Map<string, HTMLImageElement>();

function usePlanSymbol(src: string) {
  const [img, setImg] = useState<HTMLImageElement | null>(symbolCache.get(src) ?? null);
  useEffect(() => {
    const hit = symbolCache.get(src);
    if (hit) {
      setImg(hit);
      return;
    }
    const el = new window.Image();
    el.onload = () => {
      symbolCache.set(src, el);
      setImg(el);
    };
    el.src = src;
  }, [src]);
  return img;
}

function SvgFootprint({ src, w, h, ink, sw }: { src: string; w: number; h: number; ink: string; sw: number }) {
  const img = usePlanSymbol(src);
  const hw = w / 2;
  const hh = h / 2;
  return (
    <Group listening={false}>
      {img ? (
        <KImage image={img} x={-hw} y={-hh} width={w} height={h} listening={false} />
      ) : (
        <Rect x={-hw} y={-hh} width={w} height={h} stroke={ink} strokeWidth={sw} listening={false} />
      )}
    </Group>
  );
}

function SofaFootprint({ w, h, ink, sw }: { w: number; h: number; ink: string; sw: number }) {
  const left = usePlanSymbol(SOFA_PARTS[0]);
  const mid = usePlanSymbol(SOFA_PARTS[1]);
  const right = usePlanSymbol(SOFA_PARTS[2]);
  const hw = w / 2;
  const hh = h / 2;
  const ready = left && mid && right;
  return (
    <Group listening={false}>
      {ready ? (
        <>
          <KImage image={left} x={-hw} y={-hh} width={w * 0.28} height={h} listening={false} />
          <KImage image={mid} x={-hw + w * 0.28} y={-hh} width={w * 0.44} height={h} listening={false} />
          <KImage image={right} x={-hw + w * 0.72} y={-hh} width={w * 0.28} height={h} listening={false} />
        </>
      ) : (
        <Rect x={-hw} y={-hh} width={w} height={h} stroke={ink} strokeWidth={sw} listening={false} />
      )}
    </Group>
  );
}
