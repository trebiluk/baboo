import { Rect, Circle, Ellipse, Line, Group } from 'react-konva';
import type { CatalogItem } from '../types';

export function FurnitureGlyph({
  cat, w, h, selected, accent, stroke, strokeWidth,
}: {
  cat?: CatalogItem;
  w: number; h: number; selected: boolean;
  accent: string; stroke: string; strokeWidth: number;
}) {
  const fill = cat?.color ?? '#445';
  const shape = cat?.shape ?? 'rect';
  const edge = selected ? accent : stroke;
  const x = -w / 2;
  const y = -h / 2;
  const r = Math.min(w, h) * 0.12;
  if (shape === 'circle') {
    return <Circle radius={Math.min(w, h) / 2} fill={fill} opacity={0.88} stroke={edge} strokeWidth={strokeWidth} />;
  }
  if (shape === 'ellipse' || shape === 'table') {
    return (
      <Group>
        <Ellipse radiusX={w / 2} radiusY={h / 2} fill={fill} opacity={0.88} stroke={edge} strokeWidth={strokeWidth} />
        <Ellipse radiusX={w * 0.28} radiusY={h * 0.28} fill="#2a2018" opacity={0.25} listening={false} />
      </Group>
    );
  }
  if (shape === 'bed') {
    return (
      <Group>
        <Rect x={x} y={y} width={w} height={h} fill={fill} opacity={0.88} stroke={edge} strokeWidth={strokeWidth} cornerRadius={r} />
        <Rect x={x + w * 0.08} y={y + h * 0.08} width={w * 0.84} height={h * 0.22} fill="#e8e4dc" opacity={0.55} cornerRadius={r * 0.6} listening={false} />
      </Group>
    );
  }
  if (shape === 'sofa') {
    return (
      <Group>
        <Rect x={x} y={y + h * 0.18} width={w} height={h * 0.82} fill={fill} opacity={0.88} stroke={edge} strokeWidth={strokeWidth} cornerRadius={r} />
        <Rect x={x} y={y} width={w * 0.18} height={h} fill={fill} opacity={0.95} cornerRadius={r} listening={false} />
        <Rect x={x + w * 0.82} y={y} width={w * 0.18} height={h} fill={fill} opacity={0.95} cornerRadius={r} listening={false} />
      </Group>
    );
  }
  if (shape === 'chair') {
    return (
      <Group>
        <Rect x={x + w * 0.12} y={y + h * 0.2} width={w * 0.76} height={h * 0.68} fill={fill} opacity={0.88} stroke={edge} strokeWidth={strokeWidth} cornerRadius={r} />
        <Rect x={x + w * 0.2} y={y} width={w * 0.6} height={h * 0.22} fill={fill} opacity={0.95} cornerRadius={r * 0.5} listening={false} />
      </Group>
    );
  }
  if (shape === 'sink') {
    return (
      <Group>
        <Rect x={x} y={y} width={w} height={h} fill={fill} opacity={0.88} stroke={edge} strokeWidth={strokeWidth} cornerRadius={r} />
        <Ellipse radiusX={w * 0.32} radiusY={h * 0.28} fill="#d7e3ea" opacity={0.7} listening={false} />
      </Group>
    );
  }
  if (shape === 'toilet') {
    return (
      <Group>
        <Rect x={x + w * 0.15} y={y} width={w * 0.7} height={h * 0.38} fill={fill} opacity={0.9} stroke={edge} strokeWidth={strokeWidth} cornerRadius={r} />
        <Ellipse x={0} y={h * 0.22} radiusX={w * 0.38} radiusY={h * 0.32} fill={fill} opacity={0.88} stroke={edge} strokeWidth={strokeWidth} />
      </Group>
    );
  }
  if (shape === 'tub') {
    return (
      <Group>
        <Rect x={x} y={y} width={w} height={h} fill={fill} opacity={0.88} stroke={edge} strokeWidth={strokeWidth} cornerRadius={Math.min(w, h) * 0.28} />
        <Rect x={x + w * 0.1} y={y + h * 0.16} width={w * 0.8} height={h * 0.68} fill="#d7e3ea" opacity={0.45} cornerRadius={Math.min(w, h) * 0.2} listening={false} />
      </Group>
    );
  }
  if (shape === 'appliance') {
    return (
      <Group>
        <Rect x={x} y={y} width={w} height={h} fill={fill} opacity={0.9} stroke={edge} strokeWidth={strokeWidth} cornerRadius={r * 0.4} />
        <Line points={[x + w * 0.15, y + h * 0.2, x + w * 0.85, y + h * 0.2]} stroke="#dbe4ee" strokeWidth={strokeWidth} listening={false} />
        <Circle x={x + w * 0.78} y={y + h * 0.72} radius={Math.min(w, h) * 0.08} fill="#dbe4ee" opacity={0.7} listening={false} />
      </Group>
    );
  }
  return (
    <Rect x={x} y={y} width={w} height={h} fill={fill} opacity={0.88} stroke={edge} strokeWidth={strokeWidth} cornerRadius={shape === 'round-rect' ? r : 0.04} />
  );
}
