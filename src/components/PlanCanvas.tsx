import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from 'react';
import { Stage, Layer, Line, Rect, Text, Arc, Group, Circle } from 'react-konva';
import type Konva from 'konva';
import { useProjectStore } from '../store/useProjectStore';
import { useDebugStore } from '../store/useDebugStore';
import { formatLength, nearestWall, pointOnWall, screenToWorld, wallAngle, wallEnds, wallLength } from '../lib/geometry';
import {
  loadImportPattern,
  patternForPack,
  patternWorldScale,
  textureStrokeFallback,
} from '../lib/texturePattern';
import { FURNITURE_CATALOG } from '../data/furniture';
import type { Opening, Wall, Node } from '../types';
import { DEFAULT_GUI_THEME } from '../data/themes';

export function PlanCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const doc = useProjectStore((s) => s.doc);
  const floor = doc.floors[0];
  const tool = useProjectStore((s) => s.tool);
  const selected = useProjectStore((s) => s.selected);
  const panX = useProjectStore((s) => s.panX);
  const panY = useProjectStore((s) => s.panY);
  const zoom = useProjectStore((s) => s.zoom);
  const wallDraft = useProjectStore((s) => s.wallDraft);
  const showNodeIds = useDebugStore((s) => s.showNodeIds);
  const showHitboxes = useDebugStore((s) => s.showHitboxes);
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [wallCtaDismissed, setWallCtaDismissed] = useState(() => {
    try { return localStorage.getItem('baboo-wall-cta-dismissed') === '1'; } catch { return false; }
  });
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const panning = useRef(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setSize({ w: el.clientWidth || 800, h: el.clientHeight || 600 });
    return () => ro.disconnect();
  }, []);

  const settings = doc.settings;
  const accent = settings.accent || '#22D3EE';
  const units = settings.units || 'ft';
  const guiTheme = settings.guiTheme ?? DEFAULT_GUI_THEME;
  const lightPlan = guiTheme !== 'ink'; /* stark / projector light */
  const planColors = useMemo(() => {
    const light = lightPlan;
    return {
      grid: light ? '#D1D5DB' : '#1a2438',
      gridAxis: light ? '#9CA3AF' : '#243048',
      wallExt: light ? '#1E293B' : '#d7e2f5',
      wallInt: light ? '#64748B' : '#a8b6cc',
      dimBg: light ? 'rgba(255,255,255,0.92)' : 'rgba(11, 16, 40, 0.75)',
      dimFg: light ? '#0B1220' : '#c5d0ea',
      doorCut: '#0B1220',
      furnStroke: light ? '#64748B' : '#9ab',
    };
  }, [lightPlan]);

  const textureId = settings.textureId ?? null;
  const imageBlobRef = settings.imageBlobRef ?? null;
  const [texPattern, setTexPattern] = useState<HTMLImageElement | HTMLCanvasElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    setTexPattern(null);
    if (!textureId || textureId === 'pack:plain') {
      return;
    }
    if (textureId === 'import:local') {
      void loadImportPattern(imageBlobRef).then((img) => {
        if (!cancelled) setTexPattern(img);
      });
      return () => { cancelled = true; };
    }
    const pack = patternForPack(textureId);
    if (!cancelled) setTexPattern(pack);
    return () => { cancelled = true; };
  }, [textureId, imageBlobRef]);

  const toWorld = useCallback((sx: number, sy: number) => {
    return screenToWorld(sx, sy, panX, panY, zoom, 0, 0);
  }, [panX, panY, zoom]);

  const onPointerDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;
    const world = toWorld(pos.x, pos.y);

    if (tool === 'pan' || e.evt.button === 1 || e.evt.altKey) {
      panning.current = true;
      lastRef.current = { x: pos.x, y: pos.y };
      return;
    }

    const store = useProjectStore.getState();
    if (tool === 'wall') {
      if (!store.wallDraft) store.beginWall(world);
      else store.finishWall(world);
      return;
    }
    if (tool === 'door') { store.placeOpening('door', world); return; }
    if (tool === 'window') { store.placeOpening('window', world); return; }
    if (tool === 'furniture') { store.placeFurniture(world); return; }

    // select
    store.selectAt(world);
    setDragging(true);
    lastRef.current = world;
  };

  const onPointerMove = (e: Konva.KonvaEventObject<PointerEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;
    const world = toWorld(pos.x, pos.y);
    setHover(world);

    if (panning.current && lastRef.current) {
      const dx = pos.x - lastRef.current.x;
      const dy = pos.y - lastRef.current.y;
      lastRef.current = { x: pos.x, y: pos.y };
      useProjectStore.getState().setPanZoom(panX + dx, panY + dy);
      return;
    }

    if (dragging && lastRef.current && tool === 'select') {
      const dx = world.x - lastRef.current.x;
      const dy = world.y - lastRef.current.y;
      lastRef.current = world;
      useProjectStore.getState().moveSelected(dx, dy);
    }
  };

  const onPointerUp = () => {
    if (panning.current) panning.current = false;
    if (dragging) {
      setDragging(false);
      useProjectStore.getState().endMove();
    }
    lastRef.current = null;
  };

  const onWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.08;
    const old = zoom;
    const next = e.evt.deltaY > 0 ? old / scaleBy : old * scaleBy;
    useProjectStore.getState().setPanZoom(panX, panY, Math.min(80, Math.max(8, next)));
  };

  const clientToWorld = (clientX: number, clientY: number) => {
    const el = wrapRef.current;
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    return toWorld(clientX - rect.left, clientY - rect.top);
  };

  const onDragOver = (e: DragEvent) => {
    if (![...e.dataTransfer.types].includes('text/archworks-furniture')) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOver(true);
  };

  const onDragLeave = (e: DragEvent) => {
    if (e.currentTarget === e.target) setDragOver(false);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const catalogId = e.dataTransfer.getData('text/archworks-furniture');
    if (!catalogId) return;
    const world = clientToWorld(e.clientX, e.clientY);
    const store = useProjectStore.getState();
    store.selectCatalog(catalogId);
    store.placeFurniture(world);
  };

  const nearWall = useMemo(() => {
    if ((tool !== 'door' && tool !== 'window') || !hover) return null;
    return nearestWall(floor.walls, floor.nodes, hover, 1.5);
  }, [tool, hover, floor.walls, floor.nodes]);

  const showWallCta = floor.walls.length === 0 && !wallCtaDismissed && !wallDraft;

  const dismissWallCta = () => {
    setWallCtaDismissed(true);
    try { localStorage.setItem('baboo-wall-cta-dismissed', '1'); } catch { /* ignore */ }
  };

    const gridLines = useMemo(() => {
    const lines: number[][] = [];
    const gs = settings.gridSize || 1;
    const span = 80;
    for (let x = -span; x <= span; x += gs) lines.push([x, -span, x, span]);
    for (let y = -span; y <= span; y += gs) lines.push([-span, y, span, y]);
    return lines;
  }, [settings.gridSize]);

  const zoomLabel = units === 'm'
    ? `${Math.round(zoom / 0.3048)} px/m`
    : `${Math.round(zoom)} px/ft`;

  return (
    <div
      className={`plan-canvas ${dragOver ? 'drag-over' : ''}`}
      ref={wrapRef}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <Stage
        width={size.w}
        height={size.h}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onWheel={onWheel}
        style={{ cursor: tool === 'pan' ? 'grab' : tool === 'wall' ? 'crosshair' : 'default' }}
      >
        <Layer x={panX} y={panY} scaleX={zoom} scaleY={zoom}>
          {/* grid */}
          {gridLines.map((pts, i) => (
            <Line key={`g${i}`} points={pts} stroke={planColors.grid} strokeWidth={1 / zoom} listening={false} />
          ))}
          {/* axes hint */}
          <Line points={[-80, 0, 80, 0]} stroke={planColors.gridAxis} strokeWidth={1.5 / zoom} listening={false} />
          <Line points={[0, -80, 0, 80]} stroke={planColors.gridAxis} strokeWidth={1.5 / zoom} listening={false} />

          {floor.layers.structure && floor.walls.map((w) => (
            <WallShape
              key={w.id}
              wall={w}
              nodes={floor.nodes}
              selected={selected?.kind === 'wall' && selected.id === w.id}
              accent={accent}
              zoom={zoom}
              showDim={floor.layers.dims}
              units={units}
              textureId={textureId}
              texturePattern={texPattern}
              wallExt={planColors.wallExt}
              wallInt={planColors.wallInt}
              dimFg={planColors.dimFg}
            />
          ))}

          {(settings.showRoof !== false) && (floor.layers.roof !== false) && floor.roof && (
            <RoofPlanShapes roof={floor.roof} zoom={zoom} lightPlan={lightPlan} />
          )}

          {floor.layers.openings && floor.openings.map((o) => (
            <OpeningShape
              key={o.id}
              opening={o}
              walls={floor.walls}
              nodes={floor.nodes}
              selected={selected?.kind === 'opening' && selected.id === o.id}
              accent={accent}
              zoom={zoom}
              lightPlan={lightPlan}
            />
          ))}

          {floor.layers.furniture && floor.furniture.map((f) => {
            const cat = FURNITURE_CATALOG.find((c) => c.id === f.catalogId);
            const sel = selected?.kind === 'furniture' && selected.id === f.id;
            return (
              <Group key={f.id} x={f.x} y={f.y} rotation={(f.rot * 180) / Math.PI}>
                <Rect
                  x={-f.w / 2}
                  y={-f.h / 2}
                  width={f.w}
                  height={f.h}
                  fill={cat?.color ?? '#445'}
                  opacity={0.85}
                  stroke={sel ? accent : planColors.furnStroke}
                  strokeWidth={(sel ? 2.5 : 1) / zoom}
                  cornerRadius={0.08}
                />
                <Text
                  text={f.label}
                  x={-f.w / 2}
                  y={-0.2}
                  width={f.w}
                  align="center"
                  fontSize={Math.max(0.45, Math.min(0.7, f.w / 6))}
                  fill="#e8eef8"
                  listening={false}
                />
              </Group>
            );
          })}

          {showHitboxes && floor.walls.map((w) => {
            const e = wallEnds(w, floor.nodes);
            if (!e) return null;
            const hit = Math.max(w.thickness || 0.5, 0.6);
            return (
              <Line
                key={`hb-w-${w.id}`}
                points={[e.a.x, e.a.y, e.b.x, e.b.y]}
                stroke="#44e8a0"
                strokeWidth={hit}
                opacity={0.35}
                listening={false}
              />
            );
          })}
          {showHitboxes && floor.openings.map((o) => {
            const wall = floor.walls.find((w) => w.id === o.wallId);
            if (!wall) return null;
            const c = pointOnWall(wall, floor.nodes, o.t);
            if (!c) return null;
            return (
              <Circle
                key={`hb-o-${o.id}`}
                x={c.x}
                y={c.y}
                radius={0.7}
                stroke="#ffb86b"
                strokeWidth={1.5 / zoom}
                dash={[0.15, 0.1]}
                listening={false}
              />
            );
          })}
          {showHitboxes && floor.furniture.map((f) => (
            <Group key={`hb-f-${f.id}`} x={f.x} y={f.y} rotation={(f.rot * 180) / Math.PI} listening={false}>
              <Rect
                x={-f.w / 2}
                y={-f.h / 2}
                width={f.w}
                height={f.h}
                stroke="#ff6b9d"
                strokeWidth={1.5 / zoom}
                dash={[0.2, 0.15]}
                fillEnabled={false}
              />
            </Group>
          ))}

          {showNodeIds && floor.nodes.map((n) => (
            <Group key={`nid-${n.id}`} listening={false}>
              <Circle x={n.x} y={n.y} radius={4 / zoom} fill="#e8a054" />
              <Text
                x={n.x + 6 / zoom}
                y={n.y - 10 / zoom}
                text={n.id.replace(/^n_?/, '').slice(-6)}
                fontSize={11 / zoom}
                fill="#e8a054"
              />
            </Group>
          ))}


          {nearWall && (() => {
            const e = wallEnds(nearWall.wall, floor.nodes);
            if (!e) return null;
            return (
              <Line
                key="near-wall-hl"
                points={[e.a.x, e.a.y, e.b.x, e.b.y]}
                stroke="#22d3ee"
                strokeWidth={(nearWall.wall.thickness || 0.5) + 0.18}
                opacity={0.95}
                lineCap="square"
                listening={false}
              />
            );
          })()}

          {wallDraft && hover && (
            <Line
              points={[wallDraft.x, wallDraft.y, hover.x, hover.y]}
              stroke={accent}
              strokeWidth={3 / zoom}
              dash={[0.4, 0.25]}
              listening={false}
            />
          )}
          {wallDraft && (
            <Circle x={wallDraft.x} y={wallDraft.y} radius={4 / zoom} fill={accent} listening={false} />
          )}
        </Layer>
      </Stage>
      {showWallCta && (
        <div className="wall-cta" role="status">
          <div className="wall-cta-body">
            <strong>Wall → click start → click end</strong>
            <span className="wall-cta-sub">Then add a Door on a wall.</span>
          </div>
          <button
            type="button"
            className="wall-cta-x aw-pressable"
            aria-label="Dismiss tip"
            onClick={dismissWallCta}
          >
            ×
          </button>
        </div>
      )}
      <div className="canvas-hint">
        {tool === 'wall'
          ? (wallDraft ? 'Click where the wall ends' : 'Wall → click start → click end')
          : tool === 'door' || tool === 'window'
            ? 'Click on a wall'
            : tool === 'furniture'
              ? 'Click to place · or drag from the side list'
              : tool === 'pan'
                ? 'Drag to move the view'
                : 'Click something to move it'}
        {settings.snap ? ' · Snap ON' : ' · Snap OFF'}
        {' · '}{zoomLabel}
        {units === 'm' ? ' · m' : ' · ft'}
      </div>
    </div>
  );
}

function WallShape({
  wall, nodes, selected, accent, zoom, showDim, units, textureId, texturePattern,
  wallExt, wallInt, dimFg,
}: {
  wall: Wall; nodes: Node[]; selected: boolean; accent: string; zoom: number; showDim: boolean; units: 'ft' | 'm';
  textureId: string | null;
  texturePattern: HTMLImageElement | HTMLCanvasElement | null;
  wallExt: string;
  wallInt: string;
  dimFg: string;
}) {
  const e = wallEnds(wall, nodes);
  if (!e) return null;
  const thick = wall.thickness || 0.5;
  const len = wallLength(wall, nodes);
  const ang = wallAngle(wall, nodes);
  const mx = (e.a.x + e.b.x) / 2;
  const my = (e.a.y + e.b.y) / 2;
  const paint = selected ? accent : wall.kind === 'exterior' ? wallExt : wallInt;
  const textured = Boolean(textureId && textureId !== 'pack:plain');
  const fallback = textureStrokeFallback(textureId);
  const scale = patternWorldScale(textureId);

  return (
    <Group>
      {textured && texturePattern && len > 0.05 ? (
        <Group x={e.a.x} y={e.a.y} rotation={(ang * 180) / Math.PI} listening={false}>
          <Rect
            x={0}
            y={-thick / 2}
            width={len}
            height={thick}
            fillPatternImage={texturePattern as CanvasImageSource as HTMLImageElement}
            fillPatternRepeat="repeat"
            fillPatternScaleX={scale}
            fillPatternScaleY={scale}
            opacity={wall.kind === 'exterior' ? 0.95 : 0.72}
          />
          <Rect
            x={0}
            y={-thick / 2}
            width={len}
            height={thick}
            stroke={selected ? accent : (fallback ?? paint)}
            strokeWidth={1.25 / zoom}
            fillEnabled={false}
          />
        </Group>
      ) : textured && fallback ? (
        <Line
          points={[e.a.x, e.a.y, e.b.x, e.b.y]}
          stroke={selected ? accent : fallback}
          strokeWidth={thick}
          lineCap="square"
          dash={[0.35, 0.18]}
          listening={false}
        />
      ) : null}
      <Line
        points={[e.a.x, e.a.y, e.b.x, e.b.y]}
        stroke={textured ? (texturePattern ? 'transparent' : (fallback ?? paint)) : paint}
        strokeWidth={thick}
        lineCap="square"
        hitStrokeWidth={Math.max(thick, 0.6)}
        opacity={textured && (texturePattern || fallback) ? 0 : 1}
      />
      {showDim && len > 0.8 && (
        <Text
          x={mx}
          y={my}
          text={formatLength(len, units)}
          offsetX={18 / zoom}
          offsetY={18 / zoom}
          fontSize={11 / zoom}
          fill={dimFg}
          rotation={(ang * 180) / Math.PI}
          listening={false}
        />
      )}
    </Group>
  );
}

function OpeningShape({
  opening, walls, nodes, selected, accent, zoom, lightPlan = false,
}: {
  opening: Opening; walls: Wall[]; nodes: Node[]; selected: boolean; accent: string; zoom: number;
  lightPlan?: boolean;
}) {
  const swingStroke = lightPlan ? '#475569' : '#9eb0cc';
  const glassMid = lightPlan ? '#334155' : '#c5d2e8';
  const glassLine = lightPlan ? '#2563EB' : '#8eb4e8';

  const wall = walls.find((w) => w.id === opening.wallId);
  if (!wall) return null;
  const e = wallEnds(wall, nodes);
  const c = pointOnWall(wall, nodes, opening.t);
  if (!e || !c) return null;
  const ang = wallAngle(wall, nodes);
  const half = opening.width / 2;
  const ux = Math.cos(ang);
  const uy = Math.sin(ang);
  const nx = -uy;
  const ny = ux;
  const a = { x: c.x - ux * half, y: c.y - uy * half };
  const b = { x: c.x + ux * half, y: c.y + uy * half };
  const thick = wall.thickness || 0.5;

  if (opening.type === 'door') {
    // Textbook swing door: leaf + quarter-circle arc
    const swing = opening.swing === 'right' ? -1 : 1;
    const leafEnd = {
      x: a.x + nx * opening.width * swing,
      y: a.y + ny * opening.width * swing,
    };
    return (
      <Group>
        {/* wall break mask */}
        <Line points={[a.x, a.y, b.x, b.y]} stroke="#0B1220" strokeWidth={thick + 0.08} listening={false} />
        <Line
          points={[a.x, a.y, leafEnd.x, leafEnd.y]}
          stroke={selected ? accent : '#e8eef8'}
          strokeWidth={2 / zoom}
        />
        <Arc
          x={a.x}
          y={a.y}
          innerRadius={0}
          outerRadius={opening.width}
          angle={90}
          rotation={(ang * 180) / Math.PI + (swing > 0 ? -90 : 0)}
          stroke={selected ? accent : swingStroke}
          strokeWidth={1.25 / zoom}
          fillEnabled={false}
          listening={false}
        />
      </Group>
    );
  }

  // Window: wall break + double glass lines (textbook)
  const g1a = { x: a.x + nx * thick * 0.22, y: a.y + ny * thick * 0.22 };
  const g1b = { x: b.x + nx * thick * 0.22, y: b.y + ny * thick * 0.22 };
  const g2a = { x: a.x - nx * thick * 0.22, y: a.y - ny * thick * 0.22 };
  const g2b = { x: b.x - nx * thick * 0.22, y: b.y - ny * thick * 0.22 };
  return (
    <Group>
      <Line points={[a.x, a.y, b.x, b.y]} stroke="#0B1220" strokeWidth={thick + 0.08} listening={false} />
      <Line points={[a.x, a.y, b.x, b.y]} stroke={selected ? accent : glassMid} strokeWidth={1.5 / zoom} />
      <Line points={[g1a.x, g1a.y, g1b.x, g1b.y]} stroke={selected ? accent : glassLine} strokeWidth={1 / zoom} />
      <Line points={[g2a.x, g2a.y, g2b.x, g2b.y]} stroke={selected ? accent : glassLine} strokeWidth={1 / zoom} />
    </Group>
  );
}


function RoofPlanShapes({ roof, zoom, lightPlan = false }: { roof: import('../types').RoofGeometry; zoom: number; lightPlan?: boolean }) {
  const isGrass = roof.styleId === 'grass';
  const isConical = roof.styleId === 'conical';
  const edge = roof.sodEdge ?? roof.outline;
  const outlinePts = edge.flatMap((pt) => [pt.x, pt.y]);
  if (edge.length) {
    outlinePts.push(edge[0].x, edge[0].y);
  }
  /* Sod: readable turf (Apple-polish, not cartoon) — muted green fill + crisp hatch */
  const strokeOutline = isGrass ? '#3d7a52' : (lightPlan ? '#334155' : '#9eb4d8');
  const strokeRidge = lightPlan ? '#1E293B' : '#c8daf5';
  const strokeHip = lightPlan ? '#475569' : '#8fa8cc';
  const strokeBreak = lightPlan ? '#64748B' : '#7a93b8';

  const hatch: number[][] = [];
  let labelX = edge[0]?.x ?? 0;
  let labelY = (edge[0]?.y ?? 0) - 1.15;
  if (isGrass && edge.length) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const pt of edge) {
      minX = Math.min(minX, pt.x); minY = Math.min(minY, pt.y);
      maxX = Math.max(maxX, pt.x); maxY = Math.max(maxY, pt.y);
    }
    labelX = (minX + maxX) / 2 - 1.6;
    labelY = minY - 1.2;
    // Drafting-style sod hatch: parallel diagonals, spaced for Chromebook read
    for (let x = minX + 0.7; x < maxX - 0.3; x += 1.1) {
      for (let y = minY + 0.7; y < maxY - 0.3; y += 1.1) {
        hatch.push([x - 0.32, y + 0.32, x + 0.32, y - 0.32]);
      }
    }
  }

  return (
    <Group listening={false}>
      {isGrass && (
        <Line
          points={outlinePts}
          fill="rgba(45, 110, 70, 0.22)"
          closed
          strokeEnabled={false}
        />
      )}
      {/* Outer rim — slightly lighter for soft specular edge */}
      {isGrass && (
        <Line
          points={outlinePts}
          stroke="#8fbf9a"
          strokeWidth={2.4 / zoom}
          opacity={0.35}
          closed={false}
          lineJoin="round"
          listening={false}
        />
      )}
      <Line
        points={outlinePts}
        stroke={strokeOutline}
        strokeWidth={(isGrass ? 1.75 : 1.5) / zoom}
        dash={isGrass ? [0.4, 0.18] : [0.45, 0.28]}
        closed={false}
        lineJoin="round"
      />
      {hatch.map((pts, i) => (
        <Line
          key={`sod-${i}`}
          points={pts}
          stroke="#2f6b45"
          strokeWidth={1.15 / zoom}
          opacity={0.7}
        />
      ))}
      {roof.ridges.map((r, i) => (
        <Line
          key={`ridge-${i}`}
          points={[r.a.x, r.a.y, r.b.x, r.b.y]}
          stroke={strokeRidge}
          strokeWidth={2 / zoom}
          dash={[0.55, 0.22]}
        />
      ))}
      {roof.hips.map((r, i) => (
        <Line
          key={`hip-${i}`}
          points={[r.a.x, r.a.y, r.b.x, r.b.y]}
          stroke={strokeHip}
          strokeWidth={1.25 / zoom}
          dash={[0.3, 0.2]}
        />
      ))}
      {roof.breaks.map((r, i) => (
        <Line
          key={`brk-${i}`}
          points={[r.a.x, r.a.y, r.b.x, r.b.y]}
          stroke={strokeBreak}
          strokeWidth={1.1 / zoom}
          dash={[0.25, 0.18]}
        />
      ))}
      {/* Teaching label — high contrast chip, not cartoon shout */}
      <Rect
        x={labelX - 0.15}
        y={labelY - 0.15}
        width={isGrass ? 3.6 : isConical ? 3.2 : Math.max(2.2, roof.styleId.length * 0.42)}
        height={0.85}
        fill={isGrass
          ? (lightPlan ? 'rgba(220, 242, 228, 0.95)' : 'rgba(12, 28, 20, 0.82)')
          : (lightPlan ? 'rgba(255, 255, 255, 0.92)' : 'rgba(11, 16, 40, 0.75)')}
        cornerRadius={0.12}
        listening={false}
      />
      <Text
        text={isGrass ? 'Grass / sod' : isConical ? 'Conical' : roof.styleId}
        x={labelX}
        y={labelY}
        fontSize={Math.max(0.5, 11 / zoom)}
        fill={isGrass
          ? (lightPlan ? '#14532D' : '#b6e0c0')
          : (lightPlan ? '#0F172A' : '#c5d0ea')}
        fontStyle="bold"
        opacity={1}
      />
    </Group>
  );
}
