import { useCallback, useEffect, useMemo, useRef, useState, memo, type DragEvent, type RefObject } from 'react';
import { Stage, Layer, Line, Rect, Text, Arc, Group, Circle, Shape } from 'react-konva';
import Konva from 'konva';
import { useProjectStore } from '../store/useProjectStore';
import { useDebugStore } from '../store/useDebugStore';
import { formatLength, nearestWall, pointOnWall, screenToWorld, wallAngle, wallEnds, wallLength, dist, snapWallEnd, isDiagonal } from '../lib/geometry';
import { centroid, findEnclosedFace, formatArea, polygonArea, polyPoints, roomPolygon } from '../lib/rooms';
import { chamferPreview, nearestChamferable } from '../lib/chamfer';
import { ADA, circleFitsInPoly } from '../lib/access';
import { roomType } from '../data/rooms';
import type { FurnitureItem, Opening, Wall, Node, Room, DimItem, NoteItem, LandscapeItem } from '../types';
import {
  loadImportPattern,
  patternForPack,
  patternWorldScale,
  textureStrokeFallback,
} from '../lib/texturePattern';
import { FURNITURE_CATALOG } from '../data/furniture';
import { DEFAULT_GUI_THEME } from '../data/themes';
import { DEFAULT_SKILL_LEVEL, skillRank } from '../data/skill';
import { ObjectMenu, selectedAnchor } from './ObjectMenu';

const FURN_BY_ID = new Map(FURNITURE_CATALOG.map((c) => [c.id, c]));

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
  const dimDraft = useProjectStore((s) => s.dimDraft);
  const wallMode = useProjectStore((s) => s.wallMode);
  const accessOpen = useProjectStore((s) => s.accessOpen);
  const showNodeIds = useDebugStore((s) => s.showNodeIds);
  const showHitboxes = useDebugStore((s) => s.showHitboxes);
  const selectedRoomKind = useProjectStore((s) => s.selectedRoomKind);
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);
  const [shiftHeld, setShiftHeld] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [wallCtaDismissed, setWallCtaDismissed] = useState(() => {
    try { return localStorage.getItem('baboo-wall-cta-dismissed') === '1'; } catch { return false; }
  });
  const lastRef = useRef<{ x: number; y: number } | null>(null);
  const panning = useRef(false);
  const pendingTap = useRef<{ screen: { x: number; y: number }; world: { x: number; y: number } } | null>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const livePan = useRef({ x: panX, y: panY });
  const liveZoom = useRef(zoom);
  const pointersRef = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{
    dist: number;
    zoom: number;
    pan: { x: number; y: number };
    mid: { x: number; y: number };
  } | null>(null);
  const debugOpen = useProjectStore((s) => s.debugOpen);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth || 800;
      const h = el.clientHeight || 600;
      setSize({ w, h });
      useProjectStore.getState().setViewport(w, h);
    });
    ro.observe(el);
    setSize({ w: el.clientWidth || 800, h: el.clientHeight || 600 });
    useProjectStore.getState().setViewport(el.clientWidth || 800, el.clientHeight || 600);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    livePan.current = { x: panX, y: panY };
  }, [panX, panY]);

  useEffect(() => {
    liveZoom.current = zoom;
  }, [zoom]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const blockScroll = (ev: TouchEvent) => {
      if (ev.cancelable) ev.preventDefault();
    };
    el.addEventListener('touchmove', blockScroll, { passive: false });
    return () => el.removeEventListener('touchmove', blockScroll);
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
    const p = livePan.current;
    return screenToWorld(sx, sy, p.x, p.y, liveZoom.current, 0, 0);
  }, []);

  const applyLiveView = (nx: number, ny: number, z?: number) => {
    livePan.current = { x: nx, y: ny };
    const layer = layerRef.current;
    if (layer) {
      layer.x(nx);
      layer.y(ny);
      if (z != null) {
        liveZoom.current = z;
        layer.scaleX(z);
        layer.scaleY(z);
      }
    }
  };

  const onPointerDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;
    const world = toWorld(pos.x, pos.y);
    pointersRef.current.set(e.evt.pointerId, { x: pos.x, y: pos.y });
    try {
      (e.evt.target as Element | null)?.setPointerCapture?.(e.evt.pointerId);
    } catch { /* ignore */ }

    if (pointersRef.current.size >= 2) {
      pendingTap.current = null;
      const pts = [...pointersRef.current.values()];
      const a = pts[0];
      const b = pts[1];
      pinchRef.current = {
        dist: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)),
        zoom: liveZoom.current,
        pan: { ...livePan.current },
        mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      };
      panning.current = false;
      setDragging(false);
      return;
    }

    if (tool === 'pan' || e.evt.button === 1 || e.evt.altKey) {
      panning.current = true;
      lastRef.current = { x: pos.x, y: pos.y };
      return;
    }

    const store = useProjectStore.getState();
    const shift = e.evt.shiftKey;
    if (tool === 'wall') {
      if (store.wallMode === 'clip') {
        store.chamferAt(world);
        return;
      }
      if (!store.wallDraft) store.beginWall(world);
      else store.finishWall(world, shift);
      return;
    }
    if (tool === 'dim') {
      if (!store.dimDraft) store.beginDim(world);
      else store.finishDim(world, shift);
      return;
    }
    if (tool === 'note') { store.placeNote(world); return; }
    if (tool === 'plant') { store.placePlant(world); return; }
    if (tool === 'door') { store.placeOpening('door', world); return; }
    if (tool === 'window') { store.placeOpening('window', world); return; }
    if (tool === 'furniture') { store.placeFurniture(world); return; }
    if (tool === 'room') { store.placeRoom(world); return; }

    const isCoarse = e.evt.pointerType === 'touch' || e.evt.pointerType === 'pen';
    const hit = store.hitAt(world);
    const sel = store.selected;
    const same = !!(hit && sel && hit.kind === sel.kind && hit.id === sel.id);
    const movable = same && (hit?.kind === 'furniture' || hit?.kind === 'landscape' || hit?.kind === 'note' || hit?.kind === 'dim' || hit?.kind === 'opening');

    if (isCoarse) {
      if (movable) {
        setDragging(true);
        lastRef.current = world;
      } else {
        pendingTap.current = { screen: { x: pos.x, y: pos.y }, world };
      }
      return;
    }

    store.selectAt(world);
    if (!useProjectStore.getState().selected) {
      panning.current = true;
      lastRef.current = { x: pos.x, y: pos.y };
      return;
    }
    setDragging(true);
    lastRef.current = world;
  };

  const onPointerMove = (e: Konva.KonvaEventObject<PointerEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = stage.getPointerPosition();
    if (!pos) return;
    pointersRef.current.set(e.evt.pointerId, { x: pos.x, y: pos.y });

    if (pinchRef.current && pointersRef.current.size >= 2) {
      const pts = [...pointersRef.current.values()];
      const a = pts[0];
      const b = pts[1];
      const distNow = Math.max(1, Math.hypot(a.x - b.x, a.y - b.y));
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const nextZoom = Math.min(80, Math.max(8, pinchRef.current.zoom * (distNow / pinchRef.current.dist)));
      const origin = screenToWorld(
        pinchRef.current.mid.x,
        pinchRef.current.mid.y,
        pinchRef.current.pan.x,
        pinchRef.current.pan.y,
        pinchRef.current.zoom,
        0,
        0,
      );
      applyLiveView(mid.x - origin.x * nextZoom, mid.y - origin.y * nextZoom, nextZoom);
      return;
    }

    if (pendingTap.current) {
      const dx = pos.x - pendingTap.current.screen.x;
      const dy = pos.y - pendingTap.current.screen.y;
      if (Math.hypot(dx, dy) > 10) {
        panning.current = true;
        lastRef.current = { x: pendingTap.current.screen.x, y: pendingTap.current.screen.y };
        pendingTap.current = null;
      } else {
        return;
      }
    }

    if (panning.current && lastRef.current) {
      const dx = pos.x - lastRef.current.x;
      const dy = pos.y - lastRef.current.y;
      lastRef.current = { x: pos.x, y: pos.y };
      applyLiveView(livePan.current.x + dx, livePan.current.y + dy);
      return;
    }

    const world = toWorld(pos.x, pos.y);
    if (e.evt.shiftKey !== shiftHeld) setShiftHeld(e.evt.shiftKey);
    if (tool === 'wall' || tool === 'door' || tool === 'window' || tool === 'room' || tool === 'dim') {
      setHover(world);
    }

    if (dragging && lastRef.current && tool === 'select') {
      const dx = world.x - lastRef.current.x;
      const dy = world.y - lastRef.current.y;
      lastRef.current = world;
      useProjectStore.getState().moveSelected(dx, dy);
    }
  };

  const onPointerUp = (e?: Konva.KonvaEventObject<PointerEvent>) => {
    if (e?.evt?.pointerId != null) pointersRef.current.delete(e.evt.pointerId);
    else pointersRef.current.clear();

    if (pinchRef.current) {
      if (pointersRef.current.size < 2) {
        pinchRef.current = null;
        useProjectStore.getState().setPanZoom(livePan.current.x, livePan.current.y, liveZoom.current);
      }
      return;
    }
    if (pendingTap.current) {
      useProjectStore.getState().selectAt(pendingTap.current.world);
      pendingTap.current = null;
      lastRef.current = null;
      return;
    }
    if (panning.current) {
      panning.current = false;
      useProjectStore.getState().setPanZoom(livePan.current.x, livePan.current.y, liveZoom.current);
    }
    if (dragging) {
      setDragging(false);
      useProjectStore.getState().endMove();
    }
    lastRef.current = null;
  };

  const onWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.08;
    const old = liveZoom.current;
    const next = e.evt.deltaY > 0 ? old / scaleBy : old * scaleBy;
    const z = Math.min(80, Math.max(8, next));
    const stage = e.target.getStage();
    const pos = stage?.getPointerPosition();
    if (pos) {
      const world = screenToWorld(pos.x, pos.y, livePan.current.x, livePan.current.y, old, 0, 0);
      const nx = pos.x - world.x * z;
      const ny = pos.y - world.y * z;
      applyLiveView(nx, ny, z);
      useProjectStore.getState().setPanZoom(nx, ny, z);
    } else {
      useProjectStore.getState().setPanZoom(livePan.current.x, livePan.current.y, z);
    }
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

  const hoverFace = useMemo(() => {
    if (tool !== 'room' || !hover) return null;
    return findEnclosedFace(floor.nodes, floor.walls, hover);
  }, [tool, hover, floor.nodes, floor.walls]);

  const anchor = selectedAnchor(selected, floor);
  const menuPos = anchor ? {
    left: Math.min(size.w - 24, Math.max(24, panX + anchor.x * zoom)),
    top: panY + anchor.y * zoom,
  } : null;
  const showMenu = !!selected && !!menuPos && !wallDraft && !dimDraft && tool === 'select';
  const menuFlip = !!(menuPos && menuPos.top > size.h - 168);

  const useOrtho = settings.ortho !== false;
  const wallPreview = wallDraft && hover
    ? snapWallEnd(wallDraft, hover, {
      ortho: useOrtho,
      forceOrtho: shiftHeld,
      snap: !!settings.snap,
      gridSize: settings.gridSize || 1,
    })
    : null;
  const dimPreview = dimDraft && hover
    ? snapWallEnd(dimDraft, hover, {
      ortho: useOrtho,
      forceOrtho: shiftHeld,
      snap: !!settings.snap,
      gridSize: settings.gridSize || 1,
    })
    : null;
  const clipHover = tool === 'wall' && wallMode === 'clip' && hover
    ? nearestChamferable(floor.nodes, floor.walls, hover, 1.8)
    : null;
  const clipGhost = clipHover
    ? chamferPreview(floor.nodes, floor.walls, clipHover.id, Math.max(1, settings.gridSize || 1) * 2)
    : null;

  const skillLevel = settings.skillLevel ?? DEFAULT_SKILL_LEVEL;
  const showWallCta = skillRank(skillLevel) === 2 && floor.walls.length === 0 && !wallCtaDismissed && !wallDraft;
  const objectCount =
    floor.nodes.length +
    floor.walls.length +
    floor.openings.length +
    floor.furniture.length +
    (floor.rooms ?? []).length +
    (floor.dimensions ?? []).length +
    (floor.notes ?? []).length;
  const packed = floor.furniture.length >= 120 || objectCount >= 400;
  const showFurnLabels = !packed && zoom >= 16;
  const showDims = floor.layers.dims && !packed;

  const dismissWallCta = () => {
    setWallCtaDismissed(true);
    try { localStorage.setItem('baboo-wall-cta-dismissed', '1'); } catch { /* ignore */ }
  };

  const gridSize = settings.gridSize || 1;

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
      style={{ touchAction: 'none' }}
    >
      <Stage
        width={size.w}
        height={size.h}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        style={{ cursor: tool === 'pan' ? 'grab' : tool === 'select' ? 'default' : 'crosshair' }}
      >
        <Layer
          ref={layerRef}
          x={panX}
          y={panY}
          scaleX={zoom}
          scaleY={zoom}
          listening={false}
          perfectDrawEnabled={false}
        >
          <Shape
            listening={false}
            sceneFunc={(ctx) => {
              const gs = gridSize;
              const span = packed ? 160 : 80;
              ctx.beginPath();
              ctx.strokeStyle = planColors.grid;
              ctx.lineWidth = 1 / zoom;
              for (let x = -span; x <= span; x += gs) {
                ctx.moveTo(x, -span);
                ctx.lineTo(x, span);
              }
              for (let y = -span; y <= span; y += gs) {
                ctx.moveTo(-span, y);
                ctx.lineTo(span, y);
              }
              ctx.stroke();
              ctx.beginPath();
              ctx.strokeStyle = planColors.gridAxis;
              ctx.lineWidth = 1.5 / zoom;
              ctx.moveTo(-span, 0);
              ctx.lineTo(span, 0);
              ctx.moveTo(0, -span);
              ctx.lineTo(0, span);
              ctx.stroke();
            }}
          />

          {floor.layers.rooms !== false && (floor.rooms ?? []).map((r) => (
            <RoomFill
              key={`rf-${r.id}`}
              room={r}
              poly={roomPolygon(r, floor.nodes, floor.walls)}
              selected={selected?.kind === 'room' && selected.id === r.id}
              zoom={zoom}
              lightPlan={lightPlan}
            />
          ))}
          {tool === 'room' && hoverFace && (
            <Line
              points={polyPoints(hoverFace)}
              closed
              fill={roomType(selectedRoomKind).color}
              opacity={0.18}
              listening={false}
            />
          )}

          {floor.layers.structure && floor.walls.map((w) => (
            <WallShape
              key={w.id}
              wall={w}
              nodes={floor.nodes}
              selected={selected?.kind === 'wall' && selected.id === w.id}
              accent={accent}
              zoom={zoom}
              showDim={showDims}
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

          {floor.layers.furniture && floor.furniture.map((f) => (
            <FurnitureMark
              key={f.id}
              item={f}
              selected={selected?.kind === 'furniture' && selected.id === f.id}
              accent={accent}
              furnStroke={planColors.furnStroke}
              showLabel={showFurnLabels}
              zoom={zoom}
            />
          ))}

          {floor.layers.landscape !== false && (floor.landscape ?? []).map((item) => (
            <PlantMark
              key={item.id}
              item={item}
              selected={selected?.kind === 'landscape' && selected.id === item.id}
              accent={accent}
              zoom={zoom}
            />
          ))}

          {(floor.notes ?? []).map((n) => (
            <NoteMark
              key={n.id}
              note={n}
              selected={selected?.kind === 'note' && selected.id === n.id}
              accent={accent}
              zoom={zoom}
              lightPlan={lightPlan}
            />
          ))}

          {floor.layers.dims && (floor.dimensions ?? []).map((d) => (
            <DimMark
              key={d.id}
              dim={d}
              selected={selected?.kind === 'dim' && selected.id === d.id}
              accent={accent}
              zoom={zoom}
              units={units}
              dimFg={planColors.dimFg}
            />
          ))}

          {floor.layers.rooms !== false && (floor.rooms ?? []).map((r) => (
            <RoomLabel
              key={`rl-${r.id}`}
              room={r}
              poly={roomPolygon(r, floor.nodes, floor.walls)}
              selected={selected?.kind === 'room' && selected.id === r.id}
              zoom={zoom}
              units={units}
              lightPlan={lightPlan}
              dimBg={planColors.dimBg}
              dimFg={planColors.dimFg}
            />
          ))}

          {accessOpen && (floor.rooms ?? []).filter((r) => r.kind === 'bath').map((r) => {
            const poly = roomPolygon(r, floor.nodes, floor.walls);
            if (!poly) return null;
            const c = centroid(poly);
            const ok = circleFitsInPoly(poly, ADA.turnFt);
            return (
              <Circle
                key={`turn-${r.id}`}
                x={c.x}
                y={c.y}
                radius={ADA.turnFt}
                stroke={ok ? '#15803D' : '#E11D48'}
                strokeWidth={2 / zoom}
                dash={[0.45, 0.28]}
                listening={false}
              />
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

          {wallDraft && wallPreview && (
            <Line
              points={[wallDraft.x, wallDraft.y, wallPreview.x, wallPreview.y]}
              stroke={accent}
              strokeWidth={3 / zoom}
              dash={[0.4, 0.25]}
              listening={false}
            />
          )}
          {wallDraft && wallPreview && (
            <Text
              x={(wallDraft.x + wallPreview.x) / 2}
              y={(wallDraft.y + wallPreview.y) / 2 - 0.7}
              text={`${formatLength(dist(wallDraft, wallPreview), units)}${isDiagonal(wallDraft, wallPreview) ? ' · 45°' : ''}`}
              fontSize={Math.max(10, 12) / zoom}
              fill={planColors.dimFg}
              listening={false}
            />
          )}
          {clipHover && (
            <Circle
              x={clipHover.x}
              y={clipHover.y}
              radius={6 / zoom}
              stroke={accent}
              strokeWidth={2 / zoom}
              listening={false}
            />
          )}
          {clipGhost && (
            <Line
              points={[clipGhost.a.x, clipGhost.a.y, clipGhost.b.x, clipGhost.b.y]}
              stroke={accent}
              strokeWidth={3 / zoom}
              dash={[0.35, 0.2]}
              listening={false}
            />
          )}
          {wallDraft && (
            <Circle x={wallDraft.x} y={wallDraft.y} radius={4 / zoom} fill={accent} listening={false} />
          )}
          {dimDraft && dimPreview && (
            <DimMark
              dim={{ id: 'draft', ax: dimDraft.x, ay: dimDraft.y, bx: dimPreview.x, by: dimPreview.y }}
              selected
              accent={accent}
              zoom={zoom}
              units={units}
              dimFg={planColors.dimFg}
            />
          )}
        </Layer>
      </Stage>
      {showWallCta && (
        <div className="wall-cta" role="status">
          <div className="wall-cta-body">
            <strong>Let’s put a wall on the grid</strong>
            <span className="wall-cta-sub">Two clicks: start, then the other end. Then a door.</span>
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
      {showMenu && menuPos && (
        <ObjectMenu left={menuPos.left} top={menuPos.top} flip={menuFlip} />
      )}
      {skillRank(skillLevel) < 3 && (
      <div className="canvas-hint">
        {tool === 'wall'
          ? (wallMode === 'clip'
            ? (clipHover ? 'Click the corner to clip it at 45°' : 'Clip → click a sharp corner')
            : (wallDraft
            ? (skillRank(skillLevel) <= 1 ? 'Nice — now click where it ends' : 'Click where the wall ends')
            : (skillRank(skillLevel) <= 1 ? 'Click a corner to start, then the other end' : 'Wall → click start → click end')))
          : tool === 'door' || tool === 'window'
            ? (skillRank(skillLevel) <= 1 ? 'Click right on a wall. Then the little menu can change it.' : 'Click on a wall — or tap an existing door to edit')
            : tool === 'furniture'
              ? 'Click to place · or drag from the side list'
              : tool === 'room'
                ? 'Pick a type, then click inside walls that close'
              : tool === 'dim'
                ? (dimDraft ? 'Click the other end of the size' : 'Size → click start, then the other end')
              : tool === 'note'
                ? 'Click the plan, then type in the note box'
              : tool === 'plant'
                ? 'Tree, bed, or path — click to plant it'
              : tool === 'pan'
                ? 'Drag to look around · pinch to zoom'
                : (skillRank(skillLevel) <= 1 ? 'Drag empty grid to look around. Tap a wall to move it.' : 'Drag the grid to look around · tap to select')}
        {settings.snap ? ' · Snap ON' : ' · Snap OFF'}
        {settings.ortho !== false ? ' · 90°+45°' : ''}
        {' · '}{zoomLabel}
        {units === 'm' ? ' · m' : ' · ft'}
      </div>
      )}
      {skillRank(skillLevel) >= 3 && (
        <div className="canvas-hint canvas-hint-quiet">
          {settings.snap ? 'Snap ON' : 'Snap OFF'} · {zoomLabel}{units === 'm' ? ' · m' : ' · ft'}
        </div>
      )}
      <PlanCompass zoom={zoom} units={units} />
      <PlanLoadChip
        objectCount={objectCount}
        furniture={floor.furniture.length}
        measure={debugOpen}
        layerRef={layerRef}
      />
    </div>
  );
}

const FurnitureMark = memo(function FurnitureMark({
  item, selected, accent, furnStroke, showLabel, zoom,
}: {
  item: FurnitureItem;
  selected: boolean;
  accent: string;
  furnStroke: string;
  showLabel: boolean;
  zoom: number;
}) {
  const cat = FURN_BY_ID.get(item.catalogId);
  return (
    <Group
      x={item.x}
      y={item.y}
      rotation={(item.rot * 180) / Math.PI}
      listening={false}
      perfectDrawEnabled={false}
    >
      <Rect
        x={-item.w / 2}
        y={-item.h / 2}
        width={item.w}
        height={item.h}
        fill={cat?.color ?? '#445'}
        opacity={0.85}
        stroke={selected ? accent : furnStroke}
        strokeWidth={(selected ? 2.5 : 1) / zoom}
        cornerRadius={0.08}
        listening={false}
        perfectDrawEnabled={false}
      />
      {showLabel ? (
        <Text
          text={item.label}
          x={-item.w / 2}
          y={-0.2}
          width={item.w}
          align="center"
          fontSize={Math.max(0.45, Math.min(0.7, item.w / 6))}
          fill="#e8eef8"
          listening={false}
          perfectDrawEnabled={false}
        />
      ) : null}
    </Group>
  );
});

function DimMark({
  dim, selected, accent, zoom, units, dimFg,
}: {
  dim: DimItem;
  selected: boolean;
  accent: string;
  zoom: number;
  units: 'ft' | 'm';
  dimFg: string;
}) {
  const a = { x: dim.ax, y: dim.ay };
  const b = { x: dim.bx, y: dim.by };
  const len = dist(a, b);
  if (len < 0.05) return null;
  const ux = (b.x - a.x) / len;
  const uy = (b.y - a.y) / len;
  const off = 0.65;
  const px = -uy * off;
  const py = ux * off;
  const a2 = { x: a.x + px, y: a.y + py };
  const b2 = { x: b.x + px, y: b.y + py };
  const tick = 0.28;
  const stroke = selected ? accent : dimFg;
  return (
    <Group listening={false} perfectDrawEnabled={false}>
      <Line points={[a.x, a.y, a2.x, a2.y]} stroke={stroke} strokeWidth={1 / zoom} />
      <Line points={[b.x, b.y, b2.x, b2.y]} stroke={stroke} strokeWidth={1 / zoom} />
      <Line points={[a2.x, a2.y, b2.x, b2.y]} stroke={stroke} strokeWidth={1.4 / zoom} />
      <Line
        points={[a2.x - ux * tick, a2.y - uy * tick, a2.x + ux * tick, a2.y + uy * tick]}
        stroke={stroke}
        strokeWidth={1.4 / zoom}
      />
      <Line
        points={[b2.x - ux * tick, b2.y - uy * tick, b2.x + ux * tick, b2.y + uy * tick]}
        stroke={stroke}
        strokeWidth={1.4 / zoom}
      />
      <Text
        x={(a2.x + b2.x) / 2 - 1.4}
        y={(a2.y + b2.y) / 2 - 0.55}
        width={2.8}
        align="center"
        text={formatLength(len, units)}
        fontSize={11 / zoom}
        fill={dimFg}
      />
    </Group>
  );
}

function NoteMark({
  note, selected, accent, zoom, lightPlan,
}: {
  note: NoteItem;
  selected: boolean;
  accent: string;
  zoom: number;
  lightPlan: boolean;
}) {
  const w = Math.max(2.4, note.text.length * 0.32 + 0.6);
  return (
    <Group x={note.x} y={note.y} listening={false} perfectDrawEnabled={false}>
      <Rect
        x={-w / 2}
        y={-0.55}
        width={w}
        height={1.1}
        fill={lightPlan ? '#FFFBEB' : '#1f2937'}
        stroke={selected ? accent : '#D97706'}
        strokeWidth={(selected ? 2 : 1) / zoom}
        cornerRadius={0.12}
      />
      <Text
        text={note.text}
        x={-w / 2}
        y={-0.28}
        width={w}
        align="center"
        fontSize={0.55}
        fill={lightPlan ? '#92400E' : '#FDE68A'}
      />
    </Group>
  );
}

function PlantMark({
  item, selected, accent, zoom,
}: {
  item: LandscapeItem;
  selected: boolean;
  accent: string;
  zoom: number;
}) {
  const stroke = selected ? accent : '#2F5D3A';
  if (item.kind === 'tree') {
    const r = Math.max(item.w, item.h) / 2;
    return (
      <Group x={item.x} y={item.y} listening={false} perfectDrawEnabled={false}>
        <Circle radius={r} fill="#4C9A5C" opacity={0.55} stroke={stroke} strokeWidth={(selected ? 2 : 1) / zoom} />
        <Circle radius={r * 0.45} fill="#2F6B3A" />
      </Group>
    );
  }
  if (item.kind === 'path') {
    return (
      <Group x={item.x} y={item.y} rotation={(item.rot * 180) / Math.PI} listening={false} perfectDrawEnabled={false}>
        <Rect
          x={-item.w / 2}
          y={-item.h / 2}
          width={item.w}
          height={item.h}
          fill="#D4C4A8"
          stroke={stroke}
          strokeWidth={(selected ? 2 : 1) / zoom}
          cornerRadius={0.15}
        />
      </Group>
    );
  }
  return (
    <Group x={item.x} y={item.y} rotation={(item.rot * 180) / Math.PI} listening={false} perfectDrawEnabled={false}>
      <Rect
        x={-item.w / 2}
        y={-item.h / 2}
        width={item.w}
        height={item.h}
        fill="#7CB56A"
        opacity={0.7}
        stroke={stroke}
        strokeWidth={(selected ? 2 : 1) / zoom}
        cornerRadius={0.2}
      />
    </Group>
  );
}

function PlanCompass({ zoom, units }: { zoom: number; units: 'ft' | 'm' }) {
  const barFt = zoom >= 20 ? 10 : zoom >= 12 ? 20 : 40;
  const px = barFt * zoom;
  const label = units === 'm'
    ? `${Math.round(barFt * 0.3048 * 10) / 10} m`
    : `${barFt} ft`;
  return (
    <div className="plan-compass" aria-hidden="true">
      <div className="plan-north">
        <span className="plan-north-arrow">▲</span>
        <span>N</span>
      </div>
      <div className="plan-scale">
        <span className="plan-scale-bar" style={{ width: Math.max(36, Math.min(140, px)) }} />
        <span>{label}</span>
      </div>
    </div>
  );
}

function PlanLoadChip({
  objectCount,
  furniture,
  measure,
  layerRef,
}: {
  objectCount: number;
  furniture: number;
  measure: boolean;
  layerRef: RefObject<Konva.Layer | null>;
}) {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    if (!measure) return;
    let frames = 0;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      frames += 1;
      if (now - last >= 500) {
        setFps(Math.round((frames * 1000) / (now - last)));
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [measure]);

  useEffect(() => {
    if (!measure) return;
    const layer = layerRef.current;
    if (!layer) return;
    const anim = new Konva.Animation(() => {}, layer);
    anim.start();
    return () => { anim.stop(); };
  }, [measure, furniture, layerRef]);

  if (furniture < 20 && !measure) return null;

  const note = fps > 0 && fps < 28 ? 'busy' : fps > 0 && fps < 48 ? 'ok' : 'smooth';
  return (
    <div className={`plan-load-chip is-${note}`} role="status">
      {furniture} pieces · {objectCount} objects · {measure && fps ? `${fps} fps` : 'canvas 2D'}
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
    <Group listening={false} perfectDrawEnabled={false}>
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

  if (opening.type === 'door' && opening.symbolKind !== 'slidingDoor') {
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

  if (opening.type === 'door') {
    const leaf = opening.width * 0.48;
    const s1a = { x: a.x, y: a.y };
    const s1b = { x: a.x + ux * leaf, y: a.y + uy * leaf };
    const s2a = { x: b.x, y: b.y };
    const s2b = { x: b.x - ux * leaf, y: b.y - uy * leaf };
    const off1 = { x: nx * thick * 0.22, y: ny * thick * 0.22 };
    const off2 = { x: -nx * thick * 0.22, y: -ny * thick * 0.22 };
    return (
      <Group>
        <Line points={[a.x, a.y, b.x, b.y]} stroke="#0B1220" strokeWidth={thick + 0.08} listening={false} />
        <Line
          points={[s1a.x + off1.x, s1a.y + off1.y, s1b.x + off1.x, s1b.y + off1.y]}
          stroke={selected ? accent : '#e8eef8'}
          strokeWidth={2 / zoom}
        />
        <Line
          points={[s2a.x + off2.x, s2a.y + off2.y, s2b.x + off2.x, s2b.y + off2.y]}
          stroke={selected ? accent : '#e8eef8'}
          strokeWidth={2 / zoom}
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

function RoomFill({
  room, poly, selected, zoom, lightPlan,
}: {
  room: Room;
  poly: { x: number; y: number }[] | null;
  selected: boolean;
  zoom: number;
  lightPlan: boolean;
}) {
  if (!poly) return null;
  const cat = roomType(room.kind);
  return (
    <Line
      points={polyPoints(poly)}
      closed
      fill={cat.color}
      opacity={selected ? (lightPlan ? 0.42 : 0.38) : (lightPlan ? 0.28 : 0.22)}
      stroke={selected ? '#6E72F5' : 'transparent'}
      strokeWidth={2 / zoom}
      listening={false}
    />
  );
}

function RoomLabel({
  room, poly, selected, zoom, units, lightPlan, dimBg, dimFg,
}: {
  room: Room;
  poly: { x: number; y: number }[] | null;
  selected: boolean;
  zoom: number;
  units: 'ft' | 'm';
  lightPlan: boolean;
  dimBg: string;
  dimFg: string;
}) {
  const area = poly ? formatArea(polygonArea(poly), units) : null;
  const w = Math.max(3.6, room.name.length * 0.32 + 1.4);
  const h = area ? 1.15 : 0.7;
  const font = Math.max(0.38, 11 / zoom);
  return (
    <Group x={room.x} y={room.y} listening={false}>
      <Rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        fill={selected ? (lightPlan ? '#FFFFFF' : dimBg) : dimBg}
        stroke={selected ? '#6E72F5' : 'transparent'}
        strokeWidth={1.5 / zoom}
        cornerRadius={0.12}
        opacity={0.94}
      />
      <Text
        text={room.name}
        x={-w / 2}
        y={area ? -h / 2 + 0.12 : -font * 0.45}
        width={w}
        align="center"
        fontSize={font}
        fontStyle="bold"
        fill={dimFg}
      />
      {area && (
        <Text
          text={area}
          x={-w / 2}
          y={0.08}
          width={w}
          align="center"
          fontSize={font * 0.85}
          fill={lightPlan ? '#52525B' : '#a8b6cc'}
        />
      )}
    </Group>
  );
}
