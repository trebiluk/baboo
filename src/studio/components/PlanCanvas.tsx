import { useCallback, useEffect, useMemo, useRef, useState, memo, type DragEvent, type KeyboardEvent as ReactKeyEvent, type RefObject } from 'react';
import { Stage, Layer, Line, Rect, Text, Arc, Group, Circle, Shape } from 'react-konva';
import Konva from 'konva';
import { useProjectStore } from '../store/useProjectStore';
import { useDebugStore } from '../store/useDebugStore';
import { formatLength, nearestWall, parseFeet, pointOnWall, readableAngle, screenToWorld, wallAngle, wallEnds, wallLength, dist, hitWallGrip, wallGripPoints } from '../lib/geometry';
import { boxCorners } from '../lib/boxWalls';
import {
  headingDeg,
  polarPoint,
  resolveDrawPoint,
  wallSegs,
  type AlignGuide,
  type OsnapKind,
  type Resolved,
} from '../lib/osnap';
import { centroid, findEnclosedFace, formatArea, polygonArea, polyPoints, roomPolygon } from '../lib/rooms';
import { wallFootprintFlat } from '../lib/wallJoin';
import { chamferPreview, nearestChamferable } from '../lib/chamfer';
import { ADA, circleFitsInPoly } from '../lib/access';
import { kitchenTriangle } from '../lib/architect';
import { exteriorBounds, ROOF_STYLE_OPTIONS, roofStyleName } from '../lib/roof';
import { roomType } from '../data/rooms';
import type { FurnitureItem, Opening, Wall, Node, Room, DimItem, NoteItem, LandscapeItem, Locale } from '../types';
import { t, tipLoc } from '../data/i18n';
import {
  loadImportPattern,
  patternForPack,
  patternWorldScale,
  textureStrokeFallback,
} from '../lib/texturePattern';
import { FurnitureSymbol } from './FurnitureSymbol';
import { asFloorFinish, asFloorGrain, floorFinish, floorTileCanvas } from '../data/flooring';
import { DEFAULT_GUI_THEME } from '../data/themes';
import { DEFAULT_SKILL_LEVEL, skillRank } from '../data/skill';
import { furnitureLod } from '../lib/perf';
import { useCanvasToolsPocket } from '../hooks/useCanvasToolsPocket';

function zoomPlan(dir: 1 | -1) {
  const s = useProjectStore.getState();
  const old = s.zoom;
  const z = Math.min(80, Math.max(8, dir > 0 ? old * 1.25 : old / 1.25));
  const cx = s.viewport.w / 2;
  const cy = s.viewport.h / 2;
  const world = screenToWorld(cx, cy, s.panX, s.panY, old, 0, 0);
  s.setPanZoom(cx - world.x * z, cy - world.y * z, z);
}

export function PlanCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const roofRef = useRef<HTMLDivElement>(null);
  const [roofOpen, setRoofOpen] = useState(false);
  useEffect(() => {
    if (!roofOpen) return;
    const onDown = (e: PointerEvent) => {
      if (e.target instanceof Element && roofRef.current && !roofRef.current.contains(e.target)) setRoofOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setRoofOpen(false);
    };
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [roofOpen]);
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
  const teachingOpen = useProjectStore((s) => s.teachingOpen);
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
  const sketching = useRef(false);
  const liveStrokeRef = useRef<number[] | null>(null);
  const [liveStroke, setLiveStroke] = useState<number[] | null>(null);
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
  const gripDrag = useRef<{ wallId: string; end: 'a' | 'b' } | null>(null);
  const debugOpen = useProjectStore((s) => s.debugOpen);
  const toolsPocket = useCanvasToolsPocket();

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
    if (tool !== 'sketch') {
      sketching.current = false;
      liveStrokeRef.current = null;
      setLiveStroke(null);
    }
  }, [tool]);

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
  const tips = tipLoc(settings);
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

  /* Object snap pull radius, in screen pixels — feels the same at any zoom. */
  const PULL_PX = 16;
  const useOrtho = settings.ortho !== false;
  const useOsnap = settings.osnap !== false;
  const segs = useMemo(() => wallSegs(floor.walls, floor.nodes), [floor.walls, floor.nodes]);
  const anchors = useMemo(
    () => floor.nodes.map((n) => ({ x: n.x, y: n.y })),
    [floor.nodes],
  );

  /** One place decides where a click lands, for both the ghost and the commit. */
  const resolveAt = (
    cursor: { x: number; y: number },
    from: { x: number; y: number } | null,
    forceOrtho: boolean,
  ): Resolved => resolveDrawPoint(cursor, {
    segs,
    nodes: anchors,
    tol: PULL_PX / liveZoom.current,
    osnap: useOsnap,
    from,
    ortho: useOrtho,
    forceOrtho,
    snap: !!settings.snap,
    gridSize: settings.gridSize || 1,
  });

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
      toolsPocket.cancel();
      pendingTap.current = null;
      sketching.current = false;
      liveStrokeRef.current = null;
      setLiveStroke(null);
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

    const store = useProjectStore.getState();
    const empty = !store.hitAt(world);
    if (e.evt.button === 2) {
      toolsPocket.armEmptyPress(e.evt, empty);
      return;
    }
    if (empty && (tool === 'select' || tool === 'pan')) {
      toolsPocket.armEmptyPress(e.evt, true);
    }

    if (tool === 'pan' || e.evt.button === 1 || e.evt.altKey) {
      panning.current = true;
      lastRef.current = { x: pos.x, y: pos.y };
      return;
    }
    const shift = e.evt.shiftKey;
    if (tool === 'sketch') {
      sketching.current = true;
      const pts = [world.x, world.y];
      liveStrokeRef.current = pts;
      setLiveStroke(pts);
      return;
    }
    if (tool === 'wall') {
      if (store.wallMode === 'clip') {
        store.chamferAt(world);
        return;
      }
      if (!store.wallDraft) store.beginWall(resolveAt(world, null, shift).p, true);
      else store.finishWall(resolveAt(world, store.wallDraft, shift).p, shift, true);
      return;
    }
    if (tool === 'box') {
      if (!store.wallDraft) store.beginWall(resolveAt(world, null, shift).p, true);
      else store.commitBox(resolveAt(world, store.wallDraft, shift).p, true);
      return;
    }
    if (tool === 'dim') {
      if (!store.dimDraft) store.beginDim(resolveAt(world, null, shift).p, true);
      else store.finishDim(resolveAt(world, store.dimDraft, shift).p, shift, true);
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
    const floorNow = store.floor();
    const gripThr = Math.max(0.55, 16 / liveZoom.current);
    const wallForGrip = hit?.kind === 'wall'
      ? floorNow.walls.find((w) => w.id === hit.id)
      : sel?.kind === 'wall'
        ? floorNow.walls.find((w) => w.id === sel.id)
        : undefined;
    if (tool === 'select' && wallForGrip) {
      const g = hitWallGrip(wallForGrip, floorNow.nodes, world, gripThr);
      if (g === 'a' || g === 'b') {
        store.setSelected({ kind: 'wall', id: wallForGrip.id });
        gripDrag.current = { wallId: wallForGrip.id, end: g };
        setDragging(true);
        lastRef.current = world;
        pendingTap.current = null;
        return;
      }
      if (g === 'mid') {
        /* The middle handle slides the whole wall; the ends stretch it. */
        store.setSelected({ kind: 'wall', id: wallForGrip.id });
        setDragging(true);
        lastRef.current = world;
        pendingTap.current = null;
        return;
      }
    }
    const same = !!(hit && sel && hit.kind === sel.kind && hit.id === sel.id);
    const movable = same && (hit?.kind === 'furniture' || hit?.kind === 'landscape' || hit?.kind === 'note' || hit?.kind === 'dim' || hit?.kind === 'opening' || hit?.kind === 'sketch' || hit?.kind === 'wall');

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
    toolsPocket.noteMove(e.evt);

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
    if (sketching.current && liveStrokeRef.current) {
      const pts = liveStrokeRef.current;
      const lx = pts[pts.length - 2];
      const ly = pts[pts.length - 1];
      if (Math.hypot(world.x - lx, world.y - ly) >= 0.12) {
        pts.push(world.x, world.y);
        setLiveStroke(pts.slice());
      }
      return;
    }
    if (tool === 'select' || tool === 'wall' || tool === 'door' || tool === 'window' || tool === 'room' || tool === 'dim') {
      setHover(world);
    }

    if (gripDrag.current) {
      useProjectStore.getState().moveWallEnd(
        gripDrag.current.wallId,
        gripDrag.current.end,
        world,
        e.evt.shiftKey,
      );
      return;
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
    if (toolsPocket.consumeIfOpened()) {
      pendingTap.current = null;
      panning.current = false;
      lastRef.current = null;
      return;
    }
    if (sketching.current) {
      sketching.current = false;
      const pts = liveStrokeRef.current;
      liveStrokeRef.current = null;
      setLiveStroke(null);
      if (pts) useProjectStore.getState().addSketch(pts);
      lastRef.current = null;
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
      gripDrag.current = null;
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

  /* Ghost and marker both read the same resolve the click will use. */
  const aim: Resolved | null = hover && (tool === 'wall' || tool === 'box' || tool === 'dim')
    ? resolveAt(hover, tool === 'dim' ? dimDraft : wallDraft, shiftHeld)
    : null;
  const drawAim = tool === 'wall' && wallMode === 'clip' ? null : aim;
  const wallPreview = wallDraft && drawAim ? drawAim.p : null;
  const dimPreview = dimDraft && drawAim ? drawAim.p : null;
  const clipHover = tool === 'wall' && wallMode === 'clip' && hover
    ? nearestChamferable(floor.nodes, floor.walls, hover, 1.8)
    : null;
  const clipGhost = clipHover
    ? chamferPreview(floor.nodes, floor.walls, clipHover.id, Math.max(1, settings.gridSize || 1) * 2)
    : null;

  const selectedWall = selected?.kind === 'wall'
    ? floor.walls.find((w) => w.id === selected.id) ?? null
    : null;
  const gripThr = Math.max(0.55, 16 / zoom);
  const hoverGrip = selectedWall && hover
    ? hitWallGrip(selectedWall, floor.nodes, hover, gripThr)
    : null;
  const selectedGrips = selectedWall ? wallGripPoints(selectedWall, floor.nodes) : null;

  const skillLevel = settings.skillLevel ?? DEFAULT_SKILL_LEVEL;
  const coachLeads = skillRank(skillLevel) <= 1 && floor.walls.length === 0;
  const showWallCta = !coachLeads && skillRank(skillLevel) <= 2 && floor.walls.length === 0 && !wallCtaDismissed && !wallDraft;
  const objectCount =
    floor.nodes.length +
    floor.walls.length +
    floor.openings.length +
    floor.furniture.length +
    (floor.rooms ?? []).length +
    (floor.dimensions ?? []).length +
    (floor.notes ?? []).length +
    (floor.sketches ?? []).length;
  const packed = floor.furniture.length >= 80 || objectCount >= 280;
  const furnLod = furnitureLod({ count: floor.furniture.length, zoom });
  const simpleFurn = furnLod === 'simple' || packed;
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
      onContextMenu={toolsPocket.onContextMenu}
      style={{ touchAction: 'none', cursor: hoverGrip ? (dragging ? 'grabbing' : 'grab') : undefined }}
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
              houseFloor={asFloorFinish(settings.floorFinishId)}
              floorGrain={asFloorGrain(settings.floorGrain)}
              simple={simpleFurn}
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

          {floor.layers.sketch !== false && (floor.sketches ?? []).map((sk) => {
            const on = selected?.kind === 'sketch' && selected.id === sk.id;
            return (
              <Line
                key={sk.id}
                points={sk.points}
                stroke={on ? accent : (lightPlan ? '#4B5563' : '#C5D0EA')}
                strokeWidth={(on ? 3.2 : 2.2) / zoom}
                opacity={on ? 0.95 : 0.72}
                lineCap="round"
                lineJoin="round"
                tension={0.32}
                listening={false}
              />
            );
          })}
          {liveStroke && liveStroke.length >= 4 && (
            <Line
              points={liveStroke}
              stroke={accent}
              strokeWidth={2.6 / zoom}
              opacity={0.9}
              lineCap="round"
              lineJoin="round"
              tension={0.32}
              listening={false}
            />
          )}

          {floor.layers.structure && floor.walls.map((w) => (
            <WallShape
              key={w.id}
              wall={w}
              walls={floor.walls}
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
          {selectedGrips && (
            <WallGrips
              grips={selectedGrips}
              hover={hoverGrip}
              accent={accent}
              zoom={zoom}
            />
          )}

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
              lightPlan={lightPlan}
              simple={simpleFurn}
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

          {showDims && (() => {
            const box = exteriorBounds(floor.nodes, floor.walls);
            return box ? (
              <OverallDims bounds={box} zoom={zoom} units={units} dimFg={planColors.dimFg} />
            ) : null;
          })()}

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

          {(teachingOpen || accessOpen) && (() => {
            const tri = kitchenTriangle(floor.furniture);
            if (!tri) return null;
            return (
              <Group listening={false} perfectDrawEnabled={false}>
                <Line
                  points={[tri.sink.x, tri.sink.y, tri.stove.x, tri.stove.y, tri.fridge.x, tri.fridge.y, tri.sink.x, tri.sink.y]}
                  stroke="#CA8A04"
                  strokeWidth={2 / zoom}
                  dash={[0.35, 0.2]}
                />
                {([
                  [tri.sink, 'S'],
                  [tri.stove, 'T'],
                  [tri.fridge, 'F'],
                ] as const).map(([p, label]) => (
                  <Group key={label} x={p.x} y={p.y}>
                    <Circle radius={0.35} fill="#CA8A04" opacity={0.9} />
                    <Text
                      text={label}
                      x={-0.22}
                      y={-0.22}
                      fontSize={0.42}
                      fill="#111"
                      fontStyle="bold"
                    />
                  </Group>
                ))}
              </Group>
            );
          })()}

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

          {tool !== 'box' && wallDraft && wallPreview && (
            <Line
              points={[wallDraft.x, wallDraft.y, wallPreview.x, wallPreview.y]}
              stroke={accent}
              strokeWidth={3 / zoom}
              dash={[0.4, 0.25]}
              listening={false}
            />
          )}
          {tool === 'box' && wallDraft && wallPreview && (
            <Rect
              x={Math.min(wallDraft.x, wallPreview.x)}
              y={Math.min(wallDraft.y, wallPreview.y)}
              width={Math.abs(wallPreview.x - wallDraft.x)}
              height={Math.abs(wallPreview.y - wallDraft.y)}
              stroke={accent}
              strokeWidth={3 / zoom}
              dash={[0.45, 0.28]}
              listening={false}
            />
          )}
          {wallDraft && wallPreview && (
            <Text
              x={(wallDraft.x + wallPreview.x) / 2}
              y={(wallDraft.y + wallPreview.y) / 2 - 0.7}
              text={tool === 'box'
                ? (() => {
                  const c = boxCorners(wallDraft, wallPreview);
                  if (!c) return '';
                  return `${formatLength(c[1].x - c[0].x, units)} × ${formatLength(c[2].y - c[1].y, units)}`;
                })()
                : `${formatLength(dist(wallDraft, wallPreview), units)} · ${Math.round(headingDeg(wallDraft, wallPreview))}°`}
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
          {drawAim?.guides.map((g) => (
            <AlignGuideMark
              key={`${g.axis}-${g.at}`}
              guide={g}
              to={drawAim.p}
              zoom={zoom}
              accent={accent}
            />
          ))}
          {drawAim?.osnap && (
            <SnapMark
              kind={drawAim.osnap.kind}
              at={drawAim.osnap.p}
              zoom={zoom}
              accent={accent}
              fg={planColors.dimFg}
              bg={planColors.dimBg}
              label={t(tips, `osnap.${drawAim.osnap.kind}`)}
              big={settings.udlType === true}
            />
          )}
        </Layer>
      </Stage>
      {tool === 'wall' && wallMode !== 'clip' && wallDraft && (
        <DynInput
          from={wallDraft}
          to={wallPreview ?? wallDraft}
          zoom={zoom}
          panX={panX}
          panY={panY}
          units={units}
          tips={tips}
          onCommit={(p) => useProjectStore.getState().finishWall(p, false, true)}
          onCancel={() => useProjectStore.getState().cancelWallDraft()}
        />
      )}
      {showWallCta && (
        <div className="wall-cta" role="status">
          <div className="wall-cta-body">
            <strong>{t(tips, 'cta.wall.title')}</strong>
            <span className="wall-cta-sub">{t(tips, 'cta.wall.sub')}</span>
          </div>
          <button
            type="button"
            className="wall-cta-x aw-pressable"
            aria-label={t(tips, 'cta.dismiss')}
            onClick={dismissWallCta}
          >
            ×
          </button>
        </div>
      )}
      <div className="plan-taps aw-ribbon" role="toolbar" aria-label="Plan taps">
        <button
          type="button"
          className="plan-tap aw-pressable"
          aria-pressed={!!settings.snap}
          onClick={() => useProjectStore.getState().setSettings({ snap: !settings.snap })}
        >
          {settings.snap ? t(tips, 'hint.snapOn') : t(tips, 'hint.snapOff')}
        </button>
        <button
          type="button"
          className="plan-tap aw-pressable"
          aria-pressed={settings.ortho !== false}
          onClick={() => useProjectStore.getState().setSettings({ ortho: settings.ortho === false })}
        >
          {settings.ortho !== false ? t(tips, 'chip.straight') : t(tips, 'chip.free')}
        </button>
        <button
          type="button"
          className="plan-tap aw-pressable"
          aria-pressed={settings.osnap !== false}
          onClick={() => useProjectStore.getState().setSettings({ osnap: settings.osnap === false })}
        >
          {settings.osnap !== false ? t(tips, 'hint.osnapOn') : t(tips, 'chip.wallsOff')}
        </button>
        <div className="plan-roof" ref={roofRef}>
          <button
            type="button"
            className="plan-tap aw-pressable"
            aria-expanded={roofOpen}
            aria-pressed={!!settings.roofStyleId}
            onClick={() => setRoofOpen((v) => !v)}
          >
            {settings.roofStyleId ? roofStyleName(settings.roofStyleId) : t(tips, 'chip.roof')}
          </button>
          {roofOpen && (
            <div className="plan-roof-menu" role="listbox" aria-label={t(tips, 'chip.roof')}>
              <button
                type="button"
                role="option"
                className="plan-tap aw-pressable"
                aria-selected={!settings.roofStyleId}
                onClick={() => {
                  useProjectStore.getState().setRoofStyle(null);
                  setRoofOpen(false);
                }}
              >
                {t(tips, 'chip.roofNone')}
              </button>
              {ROOF_STYLE_OPTIONS.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  role="option"
                  className="plan-tap aw-pressable"
                  aria-selected={settings.roofStyleId === o.id}
                  onClick={() => {
                    useProjectStore.getState().setRoofStyle(o.id);
                    setRoofOpen(false);
                  }}
                >
                  {o.name}
                </button>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          className="plan-tap aw-pressable"
          onClick={() => useProjectStore.getState().fitPlan()}
        >
          {t(tips, 'chrome.fit')}
        </button>
        <button
          type="button"
          className="plan-tap plan-tap-zoom aw-pressable"
          aria-label={t(tips, 'chip.zoomOut')}
          onClick={() => zoomPlan(-1)}
        >
          −
        </button>
        <button
          type="button"
          className="plan-tap plan-tap-zoom aw-pressable"
          aria-label={t(tips, 'chip.zoomIn')}
          onClick={() => zoomPlan(1)}
        >
          +
        </button>
        <button
          type="button"
          className="plan-tap aw-pressable"
          aria-pressed={units === 'm'}
          onClick={() => useProjectStore.getState().setSettings({ units: units === 'm' ? 'ft' : 'm' })}
        >
          {units === 'm' ? 'm' : 'ft'}
        </button>
      </div>
      {skillRank(skillLevel) < 3 && (
      <div className="canvas-hint">
        {tool === 'box'
          ? (wallDraft ? t(tips, 'hint.box.end') : t(tips, 'hint.box'))
          : tool === 'wall'
          ? (wallMode === 'clip'
            ? (clipHover ? t(tips, 'hint.clip.hot') : t(tips, 'hint.clip'))
            : (wallDraft
            ? t(tips, skillRank(skillLevel) <= 1 ? 'hint.wall.end' : 'hint.wall.end.short')
            : t(tips, skillRank(skillLevel) <= 1 ? 'hint.wall.start' : 'hint.wall.start.short')))
          : tool === 'sketch'
            ? (liveStroke
              ? t(tips, 'hint.sketch.drag')
              : t(tips, skillRank(skillLevel) <= 1 ? 'hint.sketch' : 'hint.sketch.short'))
          : tool === 'door' || tool === 'window'
            ? t(tips, skillRank(skillLevel) <= 1 ? 'hint.door' : 'hint.door.short')
            : tool === 'furniture'
              ? t(tips, 'hint.furn')
              : tool === 'room'
                ? t(tips, 'hint.room')
              : tool === 'dim'
                ? t(tips, dimDraft ? 'hint.dim.end' : 'hint.dim')
              : tool === 'note'
                ? t(tips, 'hint.note')
              : tool === 'plant'
                ? t(tips, 'hint.plant')
              : tool === 'pan'
                ? t(tips, 'hint.pan')
                : t(tips, selected?.kind === 'wall'
                  ? 'hint.select.wall'
                  : skillRank(skillLevel) <= 1 ? 'hint.select' : 'hint.select.short')}
        {settings.snap ? ` · ${t(tips, 'hint.snapOn')}` : ` · ${t(tips, 'hint.snapOff')}`}
        {useOsnap ? ` · ${t(tips, 'hint.osnapOn')}` : ''}
        {settings.ortho !== false ? ' · 90°+45°' : ''}
        {' · '}{zoomLabel}
        {units === 'm' ? ' · m' : ' · ft'}
      </div>
      )}
      {skillRank(skillLevel) >= 3 && (
        <div className="canvas-hint canvas-hint-quiet">
          {settings.snap ? t(tips, 'hint.snapOn') : t(tips, 'hint.snapOff')}
          {useOsnap ? ` · ${t(tips, 'hint.osnapOn')}` : ''} · {zoomLabel}{units === 'm' ? ' · m' : ' · ft'}
          {hover && (
            <span className="canvas-readout">
              {` · x ${formatLength(hover.x, units)}  y ${formatLength(hover.y, units)}`}
            </span>
          )}
        </div>
      )}
      <PlanCompass zoom={zoom} units={units} locale={tips} />
      <PlanSheet
        title={doc.meta.title}
        units={units}
        gridSize={gridSize}
        locale={tips}
        updatedAt={doc.meta.updatedAt}
        roof={(settings.roofLabel ?? '').trim() || (settings.roofStyleId ? roofStyleName(settings.roofStyleId) : '')}
      />
      <PlanLoadChip
        objectCount={objectCount}
        furniture={floor.furniture.length}
        measure={debugOpen}
        layerRef={layerRef}
      />
    </div>
  );
}

/**
 * The snap badge. Each kind gets its own outline so the snap reads without
 * relying on colour, and the word spells it out for anyone still learning.
 */
const SnapMark = memo(function SnapMark({
  kind, at, zoom, accent, fg, bg, label, big,
}: {
  kind: OsnapKind;
  at: { x: number; y: number };
  zoom: number;
  accent: string;
  fg: string;
  bg: string;
  label: string;
  big: boolean;
}) {
  const r = (big ? 11 : 8) / zoom;
  const font = (big ? 14 : 12) / zoom;
  const pad = 4 / zoom;
  const boxW = label.length * font * 0.6 + pad * 2;
  const boxH = font * 1.55;
  const boxX = at.x + r * 1.5;
  const boxY = at.y - r - boxH;
  return (
    <Group listening={false}>
      <Shape
        listening={false}
        sceneFunc={(ctx) => {
          ctx.beginPath();
          if (kind === 'endpoint') {
            ctx.rect(at.x - r, at.y - r, r * 2, r * 2);
          } else if (kind === 'midpoint') {
            ctx.moveTo(at.x, at.y - r);
            ctx.lineTo(at.x + r, at.y + r);
            ctx.lineTo(at.x - r, at.y + r);
            ctx.closePath();
          } else if (kind === 'cross') {
            ctx.moveTo(at.x - r, at.y - r);
            ctx.lineTo(at.x + r, at.y + r);
            ctx.moveTo(at.x + r, at.y - r);
            ctx.lineTo(at.x - r, at.y + r);
          } else if (kind === 'perp') {
            ctx.moveTo(at.x - r, at.y + r);
            ctx.lineTo(at.x + r, at.y + r);
            ctx.moveTo(at.x, at.y - r);
            ctx.lineTo(at.x, at.y + r);
          } else {
            ctx.moveTo(at.x, at.y - r);
            ctx.lineTo(at.x + r, at.y);
            ctx.lineTo(at.x, at.y + r);
            ctx.lineTo(at.x - r, at.y);
            ctx.closePath();
          }
          ctx.strokeStyle = accent;
          ctx.lineWidth = (big ? 3 : 2.5) / zoom;
          ctx.stroke();
        }}
      />
      <Rect
        x={boxX}
        y={boxY}
        width={boxW}
        height={boxH}
        fill={bg}
        stroke={accent}
        strokeWidth={1 / zoom}
        cornerRadius={3 / zoom}
        listening={false}
      />
      <Text
        x={boxX + pad}
        y={boxY + font * 0.26}
        text={label}
        fontSize={font}
        fontStyle="bold"
        fill={fg}
        listening={false}
      />
    </Group>
  );
});

/** Dashed line back to the corner the cursor is lining up with. */
const AlignGuideMark = memo(function AlignGuideMark({
  guide, to, zoom, accent,
}: {
  guide: AlignGuide;
  to: { x: number; y: number };
  zoom: number;
  accent: string;
}) {
  const pts = guide.axis === 'x'
    ? [guide.anchor.x, guide.anchor.y, guide.at, to.y]
    : [guide.anchor.x, guide.anchor.y, to.x, guide.at];
  return (
    <Group listening={false}>
      <Line
        points={pts}
        stroke={accent}
        strokeWidth={1 / zoom}
        dash={[0.5, 0.35]}
        opacity={0.75}
        listening={false}
      />
      <Circle
        x={guide.anchor.x}
        y={guide.anchor.y}
        radius={3 / zoom}
        stroke={accent}
        strokeWidth={1.5 / zoom}
        listening={false}
      />
    </Group>
  );
});

/**
 * Exact entry while a wall is in progress. The boxes track the cursor until you
 * type in one, then they hold what you typed — the way a drafting program does.
 * They are real inputs, so a tap works as well as a keystroke.
 */
function DynInput({
  from, to, zoom, panX, panY, units, tips, onCommit, onCancel,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  zoom: number;
  panX: number;
  panY: number;
  units: 'ft' | 'm';
  tips: Locale;
  onCommit: (p: { x: number; y: number }) => void;
  onCancel: () => void;
}) {
  const lenRef = useRef<HTMLInputElement>(null);
  const [len, setLen] = useState<string | null>(null);
  const [ang, setAng] = useState<string | null>(null);
  const liveLen = dist(from, to);
  const liveAng = headingDeg(from, to);

  useEffect(() => {
    setLen(null);
    setAng(null);
  }, [from.x, from.y]);

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      const tag = (ev.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (!/^[0-9]$/.test(ev.key)) return;
      /* Beat the app-wide shortcuts: `0` would otherwise zoom to fit. */
      ev.preventDefault();
      ev.stopImmediatePropagation();
      setLen(ev.key);
      lenRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const commit = () => {
    const length = len == null ? liveLen : parseFeet(len, units);
    const typedAng = ang == null ? liveAng : Number(ang);
    if (length == null || !Number.isFinite(length) || length < 0.5) return;
    const deg = Number.isFinite(typedAng) ? typedAng : liveAng;
    onCommit(polarPoint(from, length, deg));
  };

  const onFieldKey = (ev: ReactKeyEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      commit();
    } else if (ev.key === 'Escape') {
      ev.preventDefault();
      onCancel();
    }
  };

  const lenText = len ?? (units === 'm'
    ? (liveLen * 0.3048).toFixed(2)
    : (Math.round(liveLen * 12) / 12).toFixed(2).replace(/\.?0+$/, ''));

  return (
    <div
      className="dyn-input"
      style={{ left: to.x * zoom + panX + 16, top: to.y * zoom + panY + 16 }}
    >
      <label className="dyn-field">
        <span>{t(tips, 'dyn.len')}</span>
        <input
          ref={lenRef}
          type="text"
          inputMode="decimal"
          value={lenText}
          aria-label={t(tips, 'dyn.len')}
          onChange={(ev) => setLen(ev.target.value)}
          onFocus={(ev) => ev.target.select()}
          onKeyDown={onFieldKey}
        />
      </label>
      <label className="dyn-field dyn-field-ang">
        <span>{t(tips, 'dyn.ang')}</span>
        <input
          type="text"
          inputMode="decimal"
          value={ang ?? String(Math.round(liveAng))}
          aria-label={t(tips, 'dyn.ang')}
          onChange={(ev) => setAng(ev.target.value)}
          onFocus={(ev) => ev.target.select()}
          onKeyDown={onFieldKey}
        />
      </label>
      <button type="button" className="dyn-go aw-pressable" onClick={commit}>
        {t(tips, 'dyn.go')}
      </button>
    </div>
  );
}

const FurnitureMark = memo(function FurnitureMark({
  item, selected, accent, furnStroke, showLabel, zoom, lightPlan, simple,
}: {
  item: FurnitureItem;
  selected: boolean;
  accent: string;
  furnStroke: string;
  showLabel: boolean;
  zoom: number;
  lightPlan: boolean;
  simple?: boolean;
}) {
  return (
    <Group
      x={item.x}
      y={item.y}
      rotation={(item.rot * 180) / Math.PI}
      listening={false}
      perfectDrawEnabled={false}
    >
      <FurnitureSymbol
        item={item}
        selected={selected}
        accent={accent}
        stroke={furnStroke}
        zoom={zoom}
        light={lightPlan}
        simple={simple}
      />
      {showLabel ? (
        <Text
          text={item.label}
          x={-item.w / 2}
          y={item.h / 2 + 0.08}
          width={item.w}
          align="center"
          fontSize={Math.max(0.4, Math.min(0.62, item.w / 6))}
          fill={lightPlan ? '#1a1a1a' : '#e8eef8'}
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
  const sw = (selected ? 2 : 1.25) / zoom;
  const stroke = selected ? accent : '#2F5D3A';
  if (item.kind === 'tree') {
    const r = Math.min(item.w, item.h) / 2;
    return (
      <Group
        x={item.x}
        y={item.y}
        listening={false}
        perfectDrawEnabled={false}
        clipFunc={(ctx) => {
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
        }}
      >
        <Circle radius={r * 0.9} stroke={stroke} strokeWidth={sw} fill="rgba(61,122,74,0.16)" />
        <Line points={[-r * 0.5, 0, r * 0.5, 0]} stroke={stroke} strokeWidth={sw} />
        <Line points={[0, -r * 0.5, 0, r * 0.5]} stroke={stroke} strokeWidth={sw} />
        <Circle radius={Math.max(0.18, r * 0.12)} fill="#6B5344" />
      </Group>
    );
  }
  if (item.kind === 'path') {
    const hw = item.w / 2;
    const hh = item.h / 2;
    return (
      <Group
        x={item.x}
        y={item.y}
        rotation={(item.rot * 180) / Math.PI}
        listening={false}
        perfectDrawEnabled={false}
        clipFunc={(ctx) => {
          ctx.beginPath();
          ctx.rect(-hw, -hh, item.w, item.h);
        }}
      >
        <Rect
          x={-hw}
          y={-hh}
          width={item.w}
          height={item.h}
          fill="#E7D7B8"
          stroke={stroke}
          strokeWidth={sw}
        />
        <Line points={[-hw * 0.7, 0, hw * 0.7, 0]} stroke="#A09078" strokeWidth={sw} dash={[0.35, 0.25]} />
      </Group>
    );
  }
  const hw = item.w / 2;
  const hh = item.h / 2;
  return (
    <Group
      x={item.x}
      y={item.y}
      rotation={(item.rot * 180) / Math.PI}
      listening={false}
      perfectDrawEnabled={false}
      clipFunc={(ctx) => {
        ctx.beginPath();
        ctx.rect(-hw, -hh, item.w, item.h);
      }}
    >
      <Rect x={-hw} y={-hh} width={item.w} height={item.h} stroke={stroke} strokeWidth={sw} fill="rgba(124,181,106,0.28)" />
      <Circle x={-hw * 0.35} radius={Math.min(hw, hh) * 0.22} fill="#3D7A4A" />
      <Circle x={hw * 0.28} y={-hh * 0.15} radius={Math.min(hw, hh) * 0.18} fill="#5A8F4A" />
      <Circle x={hw * 0.05} y={hh * 0.2} radius={Math.min(hw, hh) * 0.16} fill="#2F6B3A" />
    </Group>
  );
}

function PlanCompass({ zoom, units, locale }: { zoom: number; units: 'ft' | 'm'; locale: Locale }) {
  const barFt = zoom >= 20 ? 10 : zoom >= 12 ? 20 : 40;
  const px = barFt * zoom;
  const half = barFt / 2;
  const label = units === 'm'
    ? `${Math.round(barFt * 0.3048 * 10) / 10} m`
    : `${barFt} ft`;
  const halfLabel = units === 'm'
    ? `${Math.round(half * 0.3048 * 10) / 10}`
    : `${half}`;
  return (
    <div className="plan-compass" aria-hidden="true">
      <div className="plan-north">
        <span className="plan-north-arrow">▲</span>
        <span>{t(locale, 'sheet.north')}</span>
      </div>
      <div className="plan-scale">
        <span
          className="plan-scale-track"
          style={{ width: Math.max(48, Math.min(160, px)) }}
        >
          <i /><i /><i />
        </span>
        <span className="plan-scale-ticks">0 · {halfLabel} · {label}</span>
      </div>
    </div>
  );
}

function PlanSheet({
  title, units, gridSize, locale, updatedAt, roof,
}: {
  title: string;
  units: 'ft' | 'm';
  gridSize: number;
  locale: Locale;
  updatedAt: string;
  roof: string;
}) {
  const square = units === 'm'
    ? `${Math.round(gridSize * 0.3048 * 100) / 100} m`
    : gridSize === 1 ? "1'-0\"" : formatLength(gridSize, 'ft');
  let date = '';
  try {
    date = new Date(updatedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    date = '';
  }
  return (
    <div className="plan-sheet" aria-hidden="true">
      <strong className="plan-sheet-title">{title || 'Untitled Plan'}</strong>
      <span>{roof ? `${t(locale, 'sheet.roof')} · ${roof}` : t(locale, 'sheet.roofNone')}</span>
      <span>{t(locale, 'sheet.scale')} · {t(locale, 'sheet.grid', { n: square })}</span>
      {date ? <span>{date}</span> : null}
    </div>
  );
}

function OverallDims({
  bounds, zoom, units, dimFg,
}: {
  bounds: { minX: number; minY: number; maxX: number; maxY: number; w: number; h: number };
  zoom: number;
  units: 'ft' | 'm';
  dimFg: string;
}) {
  const pad = 1.8;
  return (
    <Group listening={false} perfectDrawEnabled={false}>
      <DimMark
        dim={{ id: 'overall-x', ax: bounds.minX, ay: bounds.maxY + pad, bx: bounds.maxX, by: bounds.maxY + pad }}
        selected={false}
        accent={dimFg}
        zoom={zoom}
        units={units}
        dimFg={dimFg}
      />
      <DimMark
        dim={{ id: 'overall-y', ax: bounds.minX - pad, ay: bounds.minY, bx: bounds.minX - pad, by: bounds.maxY }}
        selected={false}
        accent={dimFg}
        zoom={zoom}
        units={units}
        dimFg={dimFg}
      />
    </Group>
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

function WallGrips({
  grips, hover, accent, zoom,
}: {
  grips: { a: { x: number; y: number }; b: { x: number; y: number }; mid: { x: number; y: number } };
  hover: 'a' | 'b' | 'mid' | null;
  accent: string;
  zoom: number;
}) {
  const end = 10 / zoom;
  const mid = 8 / zoom;
  const sw = 1.6 / zoom;
  const square = (
    p: { x: number; y: number },
    size: number,
    hot: boolean,
    diamond = false,
  ) => (
    <Rect
      x={p.x}
      y={p.y}
      width={size}
      height={size}
      offsetX={size / 2}
      offsetY={size / 2}
      rotation={diamond ? 45 : 0}
      fill={hot ? accent : '#fff'}
      stroke={accent}
      strokeWidth={sw}
      listening={false}
    />
  );
  return (
    <Group listening={false} perfectDrawEnabled={false}>
      {square(grips.mid, mid, hover === 'mid', true)}
      {square(grips.a, end, hover === 'a')}
      {square(grips.b, end, hover === 'b')}
    </Group>
  );
}

let brickTile: HTMLCanvasElement | null = null;
function brickTileCanvas(): HTMLCanvasElement | null {
  if (brickTile) return brickTile;
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = 24;
  c.height = 14;
  const g = c.getContext('2d');
  if (!g) return null;
  g.fillStyle = '#c4a484';
  g.fillRect(0, 0, 24, 14);
  g.strokeStyle = '#6a5040';
  g.strokeRect(0.5, 0.5, 23, 13);
  g.beginPath();
  g.moveTo(12, 0);
  g.lineTo(12, 14);
  g.stroke();
  brickTile = c;
  return c;
}

function WallShape({
  wall, walls, nodes, selected, accent, zoom, showDim, units, textureId, texturePattern,
  wallExt, wallInt, dimFg,
}: {
  wall: Wall; walls: Wall[]; nodes: Node[]; selected: boolean; accent: string; zoom: number; showDim: boolean; units: 'ft' | 'm';
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
  const foot = wallFootprintFlat(wall, nodes, walls);
  const style = wall.drawStyle || 'outline';
  const brickImg = style === 'brick' && !textured ? brickTileCanvas() : null;
  const fill = textured ? (texturePattern ? paint : (fallback ?? paint)) : paint;
  const usePattern = Boolean((textured && texturePattern) || brickImg);
  const patternImg = (textured && texturePattern ? texturePattern : brickImg) as HTMLImageElement | HTMLCanvasElement | null;
  const patternScale = brickImg ? 1 / Math.max(8, zoom) : scale;

  return (
    <Group listening={false} perfectDrawEnabled={false}>
      {foot ? (
        <Line
          points={foot}
          closed
          fill={fill}
          fillPriority={usePattern ? 'pattern' : 'color'}
          fillPatternImage={usePattern && patternImg ? patternImg as unknown as HTMLImageElement : undefined}
          fillPatternRepeat="repeat"
          fillPatternScaleX={patternScale}
          fillPatternScaleY={patternScale}
          fillPatternRotation={(ang * 180) / Math.PI}
          opacity={style === 'cavity' ? 0.45 : wall.kind === 'exterior' ? 0.98 : 0.88}
          stroke={selected ? accent : 'transparent'}
          strokeWidth={selected ? 2 / zoom : 0}
          lineJoin="miter"
          miterLimit={8}
          listening={false}
        />
      ) : (
        <Line
          points={[e.a.x, e.a.y, e.b.x, e.b.y]}
          stroke={fill}
          strokeWidth={thick}
          lineCap="butt"
          lineJoin="miter"
          listening={false}
        />
      )}
      {showDim && len > 0.8 && (() => {
        /* Mirroring the offset with the flip keeps the label outside the room. */
        const read = readableAngle((ang * 180) / Math.PI);
        const off = (read.flipped ? -18 : 18) / zoom;
        return (
          <Text
            x={mx}
            y={my}
            text={formatLength(len, units)}
            offsetX={off}
            offsetY={off}
            fontSize={11 / zoom}
            fill={dimFg}
            rotation={read.deg}
            listening={false}
          />
        );
      })()}
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
  room, poly, selected, zoom, lightPlan, houseFloor, floorGrain, simple,
}: {
  room: Room;
  poly: { x: number; y: number }[] | null;
  selected: boolean;
  zoom: number;
  lightPlan: boolean;
  houseFloor: ReturnType<typeof asFloorFinish>;
  floorGrain: ReturnType<typeof asFloorGrain>;
  simple?: boolean;
}) {
  if (!poly) return null;
  const cat = roomType(room.kind);
  const finishId = room.kind === 'outdoor'
    ? null
    : (room.floorFinishId ?? houseFloor);
  const tile = !simple && finishId ? floorTileCanvas(finishId, floorGrain) : null;
  const fill = finishId ? floorFinish(finishId).color : cat.color;
  const scale = 2 / 64;
  return (
    <Line
      points={polyPoints(poly)}
      closed
      fill={fill}
      fillPatternImage={tile ? tile as CanvasImageSource as HTMLImageElement : undefined}
      fillPatternRepeat="repeat"
      fillPriority={tile ? 'pattern' : 'color'}
      fillPatternScaleX={scale}
      fillPatternScaleY={scale}
      opacity={selected ? (lightPlan ? 0.92 : 0.88) : (lightPlan ? 0.78 : 0.72)}
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
