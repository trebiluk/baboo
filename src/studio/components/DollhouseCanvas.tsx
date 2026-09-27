import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Stage, Layer, Line, Rect, Text } from 'react-konva';
import type Konva from 'konva';
import { useProjectStore } from '../store/useProjectStore';
import { wallEnds } from '../lib/geometry';
import {
  project,
  unproject,
  projectPoints,
  cameraDepth,
  nextYaw,
  yawToFace,
  shouldCutawayWall,
  isCameraFacingSide,
  type DollProj,
  type ProjSpec,
  type YawDeg,
} from '../lib/iso';
import { asWallHeightFt } from '../lib/wallDraft';
import { packTileCanvas, textureStrokeFallback } from '../lib/texturePattern';
import { furnitureParts, furnTone, partWorldCorners, partWorldRing } from '../lib/furnShape';
import { footprintPad, wallCutFaces } from '../lib/dollWalls';
import { FURN_CAP, furnitureLod } from '../lib/perf';
import { asFloorFinish, asFloorGrain, floorFinish, floorTileCanvas } from '../data/flooring';
import { bloomSpots } from '../data/landscape';
import { listInteriorFloors, roomPolygon } from '../lib/rooms';
import { DEFAULT_GUI_THEME } from '../data/themes';
import { t } from '../data/i18n';
import type { LandscapeItem } from '../types';
import { useCanvasToolsPocket } from '../hooks/useCanvasToolsPocket';

type SceneFace = {
  key: string;
  pts: number[];
  fill?: string;
  pattern?: HTMLCanvasElement;
  stroke: string;
  sw: number;
  depth: number;
  name?: string;
  pick?: () => void;
};

export function DollhouseCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  const [pan, setPan] = useState({ x: 80, y: 80 });
  const [zoom, setZoom] = useState(1);
  const panning = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ dist: number; zoom: number; pan: { x: number; y: number }; mid: { x: number; y: number } } | null>(null);
  const pendingTap = useRef<{ x: number; y: number } | null>(null);
  const dragging = useRef(false);
  const toolsPocket = useCanvasToolsPocket();

  const floor = useProjectStore((s) => s.doc.floors[0]);
  const settings = useProjectStore((s) => s.doc.settings);
  const setSettings = useProjectStore((s) => s.setSettings);
  const selected = useProjectStore((s) => s.selected);
  const setSelected = useProjectStore((s) => s.setSelected);
  const clearSelection = useProjectStore((s) => s.clearSelection);
  const tool = useProjectStore((s) => s.tool);
  const placeFurniture = useProjectStore((s) => s.placeFurniture);
  const placePlant = useProjectStore((s) => s.placePlant);
  const moveSelected = useProjectStore((s) => s.moveSelected);
  const endMove = useProjectStore((s) => s.endMove);
  const fitNonce = useProjectStore((s) => s.fitNonce);
  const light = (settings.guiTheme ?? DEFAULT_GUI_THEME) !== 'ink';
  const blocky = settings.guiTheme === 'blocky';
  const furnLod = furnitureLod({ count: floor.furniture.length });
  const spec: ProjSpec = {
    kind: (settings.dollProj ?? 'iso') as DollProj,
    yaw: (settings.dollYaw ?? 0) as YawDeg,
    top: settings.dollProj === 'ortho' && settings.dollTop === true,
  };
  const wallH = asWallHeightFt(settings.wallHeight);
  const face = yawToFace(spec.yaw, spec.top);

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
    const block = (e: TouchEvent) => e.preventDefault();
    el.addEventListener('touchmove', block, { passive: false });
    return () => {
      ro.disconnect();
      el.removeEventListener('touchmove', block);
    };
  }, []);

  const fit = useCallback(() => {
    const pts: { x: number; y: number }[] = [];
    const house = floor.nodes;
    let cx = 0;
    let cy = 0;
    for (const n of house) { cx += n.x; cy += n.y; }
    if (house.length) { cx /= house.length; cy /= house.length; }
    const anchors = house.length ? house : (floor.landscape ?? []).map((L) => ({ x: L.x, y: L.y }));
    for (const n of anchors) pts.push(project(n.x, n.y, 0, spec), project(n.x, n.y, wallH, spec));
    const pad = footprintPad(house);
    if (pad) for (const n of pad) pts.push(project(n.x, n.y, 0, spec));
    let span = 24;
    if (house.length) {
      let minX = house[0].x;
      let maxX = minX;
      let minY = house[0].y;
      let maxY = minY;
      for (const n of house) {
        if (n.x < minX) minX = n.x;
        if (n.x > maxX) maxX = n.x;
        if (n.y < minY) minY = n.y;
        if (n.y > maxY) maxY = n.y;
      }
      span = Math.max(maxX - minX, maxY - minY, 12);
    }
    const reach = Math.max(22, span * 0.9);
    for (const f of floor.furniture) {
      if (!house.length || Math.hypot(f.x - cx, f.y - cy) < 40) pts.push(project(f.x, f.y, 0, spec));
    }
    for (const L of floor.landscape ?? []) {
      if (!house.length || Math.hypot(L.x - cx, L.y - cy) < reach) pts.push(project(L.x, L.y, 0, spec));
    }
    if (!pts.length) {
      setPan({ x: size.w / 2, y: size.h / 3 });
      setZoom(1);
      return;
    }
    let minX = pts[0].x, maxX = pts[0].x, minY = pts[0].y, maxY = pts[0].y;
    for (const p of pts) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    }
    const bw = Math.max(80, maxX - minX + 80);
    const bh = Math.max(80, maxY - minY + 80);
    const z = Math.min(2.2, Math.max(0.35, 0.82 * Math.min(size.w / bw, size.h / bh)));
    setZoom(z);
    setPan({
      x: size.w / 2 - ((minX + maxX) / 2) * z,
      y: size.h / 2 - ((minY + maxY) / 2) * z,
    });
  }, [floor.nodes, floor.furniture, floor.landscape, size.w, size.h, spec.kind, spec.yaw, spec.top, wallH]);

  useEffect(() => { fit(); }, [fit, fitNonce]);

  const houseTex = settings.textureId ?? null;
  const tiles = useMemo(() => {
    const ids = new Set<string>();
    if (houseTex) ids.add(houseTex);
    for (const w of floor.walls) if (w.finishId) ids.add(w.finishId);
    const map = new Map<string, HTMLCanvasElement>();
    for (const id of ids) {
      const c = packTileCanvas(id);
      if (c) map.set(id, c);
    }
    return map;
  }, [floor.walls, houseTex]);

  const floorPoly = useMemo(() => {
    const outline = floor.roof?.outline;
    if (outline && outline.length >= 3) return projectPoints(outline.map((p) => ({ x: p.x, y: p.y, z: 0 })), spec);
    if (floor.nodes.length < 3) return [];
    return projectPoints(floor.nodes.map((n) => ({ x: n.x, y: n.y, z: 0 })), spec);
  }, [floor.roof, floor.nodes, spec.kind, spec.yaw, spec.top]);

  const interiorFloors = useMemo(() => {
    const house = asFloorFinish(settings.floorFinishId);
    return listInteriorFloors(floor.nodes, floor.walls, floor.rooms, house).map((rf) => ({
      ...rf,
      pts: projectPoints(rf.poly.map((p) => ({ x: p.x, y: p.y, z: 0.04 })), spec),
    }));
  }, [floor.nodes, floor.walls, floor.rooms, settings.floorFinishId, spec.kind, spec.yaw, spec.top]);

  const padPoly = useMemo(() => {
    const pad = footprintPad(floor.nodes);
    if (!pad) return [];
    return projectPoints(pad.map((p) => ({ x: p.x, y: p.y, z: -0.12 })), spec);
  }, [floor.nodes, spec.kind, spec.yaw, spec.top]);

  const shadowPoly = useMemo(() => {
    const pad = footprintPad(floor.nodes);
    if (!pad) return [];
    return projectPoints(pad.map((p) => ({ x: p.x + 1.1, y: p.y + 1.1, z: -0.4 })), spec);
  }, [floor.nodes, spec.kind, spec.yaw, spec.top]);

  const sceneFaces = useMemo(() => {
    const originPts = floor.roof?.outline && floor.roof.outline.length >= 3
      ? floor.roof.outline
      : floor.nodes;
    let ox = 0;
    let oy = 0;
    if (originPts.length) {
      for (const p of originPts) {
        ox += p.x;
        oy += p.y;
      }
      ox /= originPts.length;
      oy /= originPts.length;
    }

    const faces: SceneFace[] = [];
    const ink = blocky ? '#1a1208' : (light ? '#3a342c' : '#c5d0ea');
    const swWall = (sel: boolean) => (sel ? 2.5 : (blocky ? 2.5 : 1.05)) / zoom;
    const swFurn = (sel: boolean) => (sel ? 1.6 : (blocky ? 1.4 : 0.35)) / zoom;

    for (const w of floor.walls) {
      const e = wallEnds(w, floor.nodes);
      if (!e) continue;
      const mx = (e.a.x + e.b.x) / 2;
      const my = (e.a.y + e.b.y) / 2;
      if (shouldCutawayWall(mx, my, ox, oy, spec)) continue;
      const texId = w.finishId || houseTex;
      const useTex = texId && texId !== 'pack:plain' ? texId : null;
      const sel = selected?.kind === 'wall' && selected.id === w.id;
      const brick = w.drawStyle === 'brick' && w.kind === 'exterior';
      const fill = textureStrokeFallback(useTex) ?? (brick
        ? '#A15A48'
        : w.kind === 'exterior'
          ? (light ? '#d8dce8' : '#3a4560')
          : (light ? '#ece4d4' : '#4a4034'));
      const tile = useTex ? tiles.get(useTex) : undefined;
      const thick = Math.max(0.42, w.thickness || 0.5);
      const cuts = wallCutFaces(
        e.a,
        e.b,
        thick,
        wallH,
        floor.openings
          .filter((o) => o.wallId === w.id)
          .map((o) => ({ t: o.t, width: o.width, kind: o.type, swing: o.swing })),
      );
      const shades = brick
        ? ['#C47860', '#A15A48', '#B56A55', '#8E4E3E', '#D08970']
        : light
          ? ['#f4f0e8', '#e3dcd0', '#ebe4d8', '#e7dfd2', '#faf7f2']
          : ['#3a4560', '#2a3348', '#33405a', '#303a52', '#4a5670'];
      cuts.walls.forEach((ring, i) => {
        const mx = ring.reduce((s, p) => s + p.x, 0) / ring.length;
        const my = ring.reduce((s, p) => s + p.y, 0) / ring.length;
        const top = ring.every((p) => p.z > wallH - 0.05);
        faces.push({
          key: `w-${w.id}-${i}`,
          pts: projectPoints(ring, spec),
          fill: blocky ? (top ? '#c4a574' : '#d8c4a0') : (useTex && !top ? fill : shades[i % shades.length]),
          pattern: useTex && !top ? tile : undefined,
          stroke: sel ? '#6e72f5' : ink,
          sw: swWall(sel),
          depth: cameraDepth(mx, my, spec) + (top ? 0.2 : 0),
          pick: () => setSelected({ kind: 'wall', id: w.id }),
        });
      });
      cuts.holes.forEach((hole, i) => {
        const opening = floor.openings.filter((o) => o.wallId === w.id)[i];
        const mx = hole.ring.reduce((s, p) => s + p.x, 0) / hole.ring.length;
        const my = hole.ring.reduce((s, p) => s + p.y, 0) / hole.ring.length;
        const picked = opening && selected?.kind === 'opening' && selected.id === opening.id;
        faces.push({
          key: `o-${w.id}-${i}`,
          pts: projectPoints(hole.ring, spec),
          fill: hole.kind === 'door'
            ? (light ? '#8b5a2b' : '#6b4220')
            : (light ? '#b9d7ee' : '#3d6a88'),
          stroke: picked ? '#6e72f5' : ink,
          sw: (picked ? 2.5 : 1) / zoom,
          depth: cameraDepth(mx, my, spec) + 0.35,
          pick: opening ? () => setSelected({ kind: 'opening', id: opening.id }) : undefined,
        });
      });
    }

    const lod = furnLod;
    for (const f of floor.furniture.slice(0, FURN_CAP[lod])) {
      const sel = selected?.kind === 'furniture' && selected.id === f.id;
      const parts = furnitureParts(f, lod);
      let fi = 0;
      const pick = () => setSelected({ kind: 'furniture', id: f.id });
      const shade = partWorldRing(f, {
        lx: 0, ly: 0, lw: f.w * 0.9, lh: f.h * 0.9, z0: 0, z1: 0.02, fill: '#1a2018', shape: 'oval',
      });
      if (shade.length >= 3) {
        const scx = shade.reduce((s, p) => s + p.x, 0) / shade.length;
        const scy = shade.reduce((s, p) => s + p.y, 0) / shade.length;
        faces.push({
          key: `f-${f.id}-shade`,
          pts: projectPoints(shade.map((c) => ({ x: c.x, y: c.y, z: 0.03 })), spec),
          fill: 'rgba(26,32,24,0.28)',
          stroke: 'transparent',
          sw: 0,
          depth: cameraDepth(scx, scy, spec) - 0.4,
          name: 'doll-furn',
          pick,
        });
      }
      for (const part of parts) {
        const ring = lod === 'simple' ? partWorldCorners(f, part) : partWorldRing(f, part);
        if (ring.length < 3) continue;
        const cx = ring.reduce((s, p) => s + p.x, 0) / ring.length;
        const cy = ring.reduce((s, p) => s + p.y, 0) / ring.length;
        const edge = sel ? '#6e72f5' : (blocky ? '#1a1208' : furnTone(part.fill, 0.55));
        faces.push({
          key: `f-${f.id}-${fi++}`,
          pts: projectPoints(ring.map((c) => ({ x: c.x, y: c.y, z: part.z1 })), spec),
          fill: sel ? '#c5c7ff' : furnTone(part.fill, 1.14),
          stroke: edge,
          sw: swFurn(sel),
          depth: cameraDepth(cx, cy, spec) + part.z1 * 0.04,
          name: 'doll-furn',
          pick,
        });
        if (lod === 'simple' || part.z1 - part.z0 < 0.1) continue;
        for (let i = 0; i < ring.length; i++) {
          const j = (i + 1) % ring.length;
          const a = ring[i];
          const b = ring[j];
          if (!isCameraFacingSide(a.x, a.y, b.x, b.y, cx, cy, spec)) continue;
          faces.push({
            key: `f-${f.id}-${fi++}`,
            pts: projectPoints([
              { x: a.x, y: a.y, z: part.z0 },
              { x: b.x, y: b.y, z: part.z0 },
              { x: b.x, y: b.y, z: part.z1 },
              { x: a.x, y: a.y, z: part.z1 },
            ], spec),
            fill: sel ? '#c5c7ff' : furnTone(part.fill, i % 2 ? 0.62 : 0.78),
            stroke: edge,
            sw: swFurn(sel),
            depth: cameraDepth((a.x + b.x) / 2, (a.y + b.y) / 2, spec) + (part.z0 + part.z1) * 0.02,
            name: 'doll-furn',
            pick,
          });
        }
      }
    }

    faces.sort((a, b) => a.depth - b.depth);
    return faces;
  }, [
    floor.walls, floor.nodes, floor.openings, floor.furniture, floor.roof,
    houseTex, tiles, spec.kind, spec.yaw, spec.top, selected, light, blocky, zoom, furnLod, setSelected, wallH,
  ]);

  const screenToWorld = (sx: number, sy: number) => {
    const ix = (sx - pan.x) / zoom;
    const iy = (sy - pan.y) / zoom;
    return unproject(ix, iy, spec);
  };

  const pointerInWrap = (ev: { clientX: number; clientY: number }) => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
  };

  const onPointerDown = (ev: Konva.KonvaEventObject<PointerEvent>) => {
    const pos = pointerInWrap(ev.evt);
    pointers.current.set(ev.evt.pointerId, pos);
    try { (ev.evt.target as Element | null)?.setPointerCapture?.(ev.evt.pointerId); } catch { /* ignore */ }

    if (pointers.current.size >= 2) {
      toolsPocket.cancel();
      pendingTap.current = null;
      dragging.current = false;
      const pts = [...pointers.current.values()];
      const a = pts[0];
      const b = pts[1];
      pinch.current = {
        dist: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)),
        zoom,
        pan: { ...pan },
        mid: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 },
      };
      panning.current = false;
      return;
    }

    const name = typeof (ev.target as { name?: () => string }).name === 'function'
      ? (ev.target as { name: () => string }).name()
      : '';
    const onEmpty = ev.target === ev.currentTarget || name === 'doll-floor' || name === 'doll-bg' || name === 'doll-pad';
    if (ev.evt.button === 2) {
      toolsPocket.armEmptyPress(ev.evt, onEmpty);
      return;
    }
    if (onEmpty && (tool === 'select' || tool === 'pan')) {
      toolsPocket.armEmptyPress(ev.evt, true);
    }

    if (tool === 'pan' || ev.evt.button === 1 || ev.evt.shiftKey) {
      panning.current = true;
      last.current = pos;
      return;
    }

    if (onEmpty) {
      pendingTap.current = pos;
      return;
    }
    if (tool === 'select' && (name === 'doll-furn' || name === 'doll-plant')) {
      dragging.current = true;
      last.current = pos;
    }
  };

  const onPointerMove = (ev: Konva.KonvaEventObject<PointerEvent>) => {
    const pos = pointerInWrap(ev.evt);
    pointers.current.set(ev.evt.pointerId, pos);
    toolsPocket.noteMove(ev.evt);

    if (pinch.current && pointers.current.size >= 2) {
      const pts = [...pointers.current.values()];
      const a = pts[0];
      const b = pts[1];
      const distNow = Math.max(1, Math.hypot(a.x - b.x, a.y - b.y));
      const next = Math.min(3, Math.max(0.3, pinch.current.zoom * (distNow / pinch.current.dist)));
      const k = next / pinch.current.zoom;
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      setZoom(next);
      setPan({
        x: mx - (pinch.current.mid.x - pinch.current.pan.x) * k,
        y: my - (pinch.current.mid.y - pinch.current.pan.y) * k,
      });
      return;
    }

    if (pendingTap.current) {
      const dx = pos.x - pendingTap.current.x;
      const dy = pos.y - pendingTap.current.y;
      if (Math.hypot(dx, dy) > 10) {
        panning.current = true;
        last.current = pendingTap.current;
        pendingTap.current = null;
      } else {
        return;
      }
    }

    if (panning.current && last.current) {
      const dx = pos.x - last.current.x;
      const dy = pos.y - last.current.y;
      last.current = pos;
      setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
      return;
    }

    if (dragging.current && last.current && tool === 'select') {
      const a = screenToWorld(last.current.x, last.current.y);
      const b = screenToWorld(pos.x, pos.y);
      last.current = pos;
      moveSelected(b.x - a.x, b.y - a.y);
    }
  };

  const onPointerUp = (ev?: Konva.KonvaEventObject<PointerEvent>) => {
    if (ev?.evt?.pointerId != null) pointers.current.delete(ev.evt.pointerId);
    else pointers.current.clear();

    if (pinch.current) {
      if (pointers.current.size < 2) pinch.current = null;
      return;
    }

    if (toolsPocket.consumeIfOpened()) {
      pendingTap.current = null;
      panning.current = false;
      last.current = null;
      return;
    }

    if (pendingTap.current) {
      const world = screenToWorld(pendingTap.current.x, pendingTap.current.y);
      pendingTap.current = null;
      if (tool === 'furniture') placeFurniture(world);
      else if (tool === 'plant') placePlant(world);
      else clearSelection();
    }

    if (dragging.current) {
      dragging.current = false;
      endMove();
    }
    panning.current = false;
    last.current = null;
  };

  return (
    <div
      ref={wrapRef}
      className="plan-canvas dollhouse-canvas"
      style={{ touchAction: 'none' }}
      onContextMenu={toolsPocket.onContextMenu}
    >
      <Stage
        width={size.w}
        height={size.h}
        x={pan.x}
        y={pan.y}
        scaleX={zoom}
        scaleY={zoom}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={(e) => {
          e.evt.preventDefault();
          const rect = wrapRef.current?.getBoundingClientRect();
          if (!rect) return;
          const mx = e.evt.clientX - rect.left;
          const my = e.evt.clientY - rect.top;
          const factor = e.evt.deltaY < 0 ? 1.08 : 1 / 1.08;
          const next = Math.min(3, Math.max(0.3, zoom * factor));
          const k = next / zoom;
          setZoom(next);
          setPan({ x: mx - (mx - pan.x) * k, y: my - (my - pan.y) * k });
        }}
      >
        <Layer perfectDrawEnabled={false}>
          <Rect
            name="doll-bg"
            x={-4000}
            y={-4000}
            width={8000}
            height={8000}
            fill={light ? '#e8edf2' : '#121820'}
          />
          {shadowPoly.length >= 8 && (
            <Line
              points={shadowPoly}
              closed
              fill={light ? '#9aab98' : '#0c1410'}
              opacity={0.28}
              listening={false}
            />
          )}
          {padPoly.length >= 8 && (
            <Line
              name="doll-pad"
              points={padPoly}
              closed
              fill={light ? '#d5e3cc' : '#1e3328'}
              stroke={light ? '#b7c9ae' : '#3d5a48'}
              strokeWidth={1 / zoom}
              listening={false}
            />
          )}
          {interiorFloors.length
            ? interiorFloors.map((rf, i) => (
              <Line
                key={`if-${i}`}
                name="doll-floor"
                points={rf.pts}
                closed
                fill={floorFinish(rf.finish).color}
                fillPatternImage={!blocky ? floorTileCanvas(rf.finish, asFloorGrain(settings.floorGrain)) as CanvasImageSource as HTMLImageElement : undefined}
                fillPatternRepeat="repeat"
                fillPriority={!blocky ? 'pattern' : 'color'}
                fillPatternScaleX={0.04}
                fillPatternScaleY={0.04}
                stroke={blocky ? '#1a1208' : (light ? '#9aa890' : '#6d7a62')}
                strokeWidth={(blocky ? 3 : 1.5) / zoom}
              />
            ))
            : floorPoly.length >= 6 && (
            <Line
              name="doll-floor"
              points={floorPoly}
              closed
              fill={floorFinish(asFloorFinish(settings.floorFinishId)).color}
              fillPatternImage={!blocky ? floorTileCanvas(asFloorFinish(settings.floorFinishId), asFloorGrain(settings.floorGrain)) as CanvasImageSource as HTMLImageElement : undefined}
              fillPatternRepeat="repeat"
              fillPriority={!blocky ? 'pattern' : 'color'}
              fillPatternScaleX={0.04}
              fillPatternScaleY={0.04}
              stroke={blocky ? '#1a1208' : (light ? '#9aa890' : '#6d7a62')}
              strokeWidth={(blocky ? 3 : 1.5) / zoom}
            />
          )}
          {!interiorFloors.length && (floor.rooms ?? []).map((r) => {
            if (r.kind === 'outdoor') return null;
            const poly = roomPolygon(r, floor.nodes, floor.walls);
            if (!poly || poly.length < 3) return null;
            const fid = r.floorFinishId ?? asFloorFinish(settings.floorFinishId);
            if (!fid) return null;
            const pts = projectPoints(poly.map((p) => ({ x: p.x, y: p.y, z: 0.04 })), spec);
            const grain = asFloorGrain(settings.floorGrain);
            return (
              <Line
                key={`df-${r.id}`}
                points={pts}
                closed
                fill={floorFinish(fid).color}
                fillPatternImage={!blocky ? floorTileCanvas(fid, grain) as CanvasImageSource as HTMLImageElement : undefined}
                fillPatternRepeat="repeat"
                fillPriority={!blocky ? 'pattern' : 'color'}
                fillPatternScaleX={0.04}
                fillPatternScaleY={0.04}
                listening={false}
              />
            );
          })}
          {sceneFaces.map((face) => {
            const tile = face.pattern;
            return (
              <Line
                key={face.key}
                name={face.name}
                points={face.pts}
                closed
                fill={face.fill}
                fillPatternImage={tile as CanvasImageSource as HTMLImageElement}
                fillPatternRepeat="repeat"
                fillPriority={tile ? 'pattern' : 'color'}
                fillPatternScaleX={tile ? 0.22 : 1}
                fillPatternScaleY={tile ? 0.22 : 1}
                stroke={face.stroke}
                strokeWidth={face.sw}
                onClick={(evt) => {
                  if (!face.pick) return;
                  evt.cancelBubble = true;
                  face.pick();
                }}
                onTap={(evt) => {
                  if (!face.pick) return;
                  evt.cancelBubble = true;
                  face.pick();
                }}
              />
            );
          })}
          {(floor.landscape ?? []).map((L) => (
            <DollPlant
              key={L.id}
              item={L}
              spec={spec}
              selected={selected?.kind === 'landscape' && selected.id === L.id}
              light={light}
              zoom={zoom}
              onPick={() => setSelected({ kind: 'landscape', id: L.id })}
            />
          ))}
          {floor.rooms.map((r) => {
            const p = project(r.x, r.y, 0.2, spec);
            const pick = (evt: { cancelBubble: boolean }) => {
              evt.cancelBubble = true;
              setSelected({ kind: 'room', id: r.id });
            };
            return (
              <Text
                key={r.id}
                x={p.x - 28}
                y={p.y}
                width={56}
                align="center"
                text={r.name}
                fontSize={11 / Math.max(0.6, zoom)}
                fill={selected?.kind === 'room' && selected.id === r.id ? '#6e72f5' : (light ? '#1a1a1a' : '#f4f4f5')}
                fontStyle="bold"
                onClick={pick}
                onTap={pick}
              />
            );
          })}
        </Layer>
      </Stage>
      <div className="doll-proj aw-ribbon" role="toolbar" aria-label={t(settings.locale, 'doll.turn.left')}>
        <button
          type="button"
          className="doll-chip aw-pressable"
          aria-label={t(settings.locale, 'doll.turn.left')}
          onClick={() => setSettings({ dollYaw: nextYaw(spec.yaw, -1), dollTop: false })}
        >
          ◀
        </button>
        <span className="doll-face">{t(settings.locale, `doll.face.${face === 'top' ? 'front' : face}`)}</span>
        <button
          type="button"
          className="doll-chip aw-pressable"
          aria-label={t(settings.locale, 'doll.turn.right')}
          onClick={() => setSettings({ dollYaw: nextYaw(spec.yaw, 1), dollTop: false })}
        >
          ▶
        </button>
        <AxisGizmo spec={spec} light={light} />
      </div>
      <div className="canvas-hint">
        {floor.walls.length === 0
          ? t(settings.locale, 'hint.doll.empty')
          : tool === 'furniture'
            ? t(settings.locale, 'hint.doll.furn')
            : tool === 'plant'
              ? t(settings.locale, 'hint.doll.plant')
              : t(settings.locale, 'hint.doll.paper')}
      </div>
    </div>
  );
}

function dollPts(pts: { x: number; y: number }[]) {
  const out: number[] = [];
  for (const p of pts) out.push(p.x, p.y);
  return out;
}

function DollPlant({
  item, spec, selected, light, zoom, onPick,
}: {
  item: LandscapeItem;
  spec: ProjSpec;
  selected: boolean;
  light: boolean;
  zoom: number;
  onPick: () => void;
}) {
  const sw = (selected ? 2.5 : 1) / zoom;
  const stroke = selected ? '#6e72f5' : '#2f4a28';
  const pick = (evt: { cancelBubble: boolean }) => {
    evt.cancelBubble = true;
    onPick();
  };
  if (item.kind === 'tree') {
    const r = Math.max(item.w, item.h) / 2 * 0.82;
    const trunk = Math.min(0.35, r * 0.14);
    const z1 = 2.3;
    const corners = [
      [item.x - trunk, item.y - trunk],
      [item.x + trunk, item.y - trunk],
      [item.x + trunk, item.y + trunk],
      [item.x - trunk, item.y + trunk],
    ] as const;
    const trunkFaces = corners.map((a, i) => {
      const b = corners[(i + 1) % 4];
      return dollPts([
        project(a[0], a[1], 0, spec),
        project(b[0], b[1], 0, spec),
        project(b[0], b[1], z1, spec),
        project(a[0], a[1], z1, spec),
      ]);
    });
    const dome = (zBase: number, radius: number, peakZ: number, aFill: string, bFill: string) => {
      const peak = project(item.x, item.y, peakZ, spec);
      const ring = 8;
      return Array.from({ length: ring }, (_, i) => {
        const a0 = (Math.PI * 2 * i) / ring;
        const a1 = (Math.PI * 2 * (i + 1)) / ring;
        return {
          pts: dollPts([
            project(item.x + Math.cos(a0) * radius, item.y + Math.sin(a0) * radius, zBase, spec),
            project(item.x + Math.cos(a1) * radius, item.y + Math.sin(a1) * radius, zBase, spec),
            peak,
          ]),
          fill: i % 2 ? bFill : aFill,
        };
      });
    };
    const lower = dome(2.15, r, 3.7, '#2F6B3A', '#3D7A4A');
    const upper = dome(3.15, r * 0.58, 4.85, light ? '#3D8A4E' : '#2A5A34', light ? '#67B56A' : '#3D7A4A');
    return (
      <>
        {trunkFaces.map((pts, i) => (
          <Line key={`${item.id}-t${i}`} name="doll-plant" points={pts} closed fill="#6B5344" stroke={stroke} strokeWidth={sw} onClick={pick} onTap={pick} />
        ))}
        {lower.map((face, i) => (
          <Line key={`${item.id}-l${i}`} name="doll-plant" points={face.pts} closed fill={face.fill} stroke={stroke} strokeWidth={sw} onClick={pick} onTap={pick} />
        ))}
        {upper.map((face, i) => (
          <Line key={`${item.id}-u${i}`} name="doll-plant" points={face.pts} closed fill={face.fill} stroke={stroke} strokeWidth={sw} onClick={pick} onTap={pick} />
        ))}
      </>
    );
  }
  if (item.kind === 'hedge') {
    const x0 = item.x - item.w / 2;
    const y0 = item.y - item.h / 2;
    const x1 = item.x + item.w / 2;
    const y1 = item.y + item.h / 2;
    const face = (ax: number, ay: number, bx: number, by: number, z0: number, z1: number) => dollPts([
      project(ax, ay, z0, spec), project(bx, by, z0, spec), project(bx, by, z1, spec), project(ax, ay, z1, spec),
    ]);
    const top = dollPts([
      project(x0, y0, 3.2, spec), project(x1, y0, 3.2, spec), project(x1, y1, 3.2, spec), project(x0, y1, 3.2, spec),
    ]);
    return (
      <>
        <Line name="doll-plant" points={face(x0, y0, x1, y0, 0, 3.2)} closed fill="#1E4A28" stroke={stroke} strokeWidth={sw} onClick={pick} onTap={pick} />
        <Line name="doll-plant" points={face(x1, y0, x1, y1, 0, 3.2)} closed fill="#245C34" stroke={stroke} strokeWidth={sw} onClick={pick} onTap={pick} />
        <Line name="doll-plant" points={top} closed fill="#3D8A4E" stroke={stroke} strokeWidth={sw} onClick={pick} onTap={pick} />
      </>
    );
  }
  if (item.kind === 'lamp') {
    const post = dollPts([
      project(item.x - 0.08, item.y, 0.2, spec),
      project(item.x + 0.08, item.y, 0.2, spec),
      project(item.x + 0.08, item.y, 6.2, spec),
      project(item.x - 0.08, item.y, 6.2, spec),
    ]);
    const base = dollPts([
      project(item.x - 0.32, item.y - 0.32, 0.22, spec),
      project(item.x + 0.32, item.y - 0.32, 0.22, spec),
      project(item.x + 0.32, item.y + 0.32, 0.22, spec),
      project(item.x - 0.32, item.y + 0.32, 0.22, spec),
    ]);
    const globe = dollPts([
      project(item.x - 0.42, item.y - 0.42, 6.15, spec),
      project(item.x + 0.42, item.y - 0.42, 6.15, spec),
      project(item.x + 0.42, item.y + 0.42, 7.15, spec),
      project(item.x - 0.42, item.y + 0.42, 7.15, spec),
    ]);
    return (
      <>
        <Line name="doll-plant" points={base} closed fill="#2A2A2E" stroke={stroke} strokeWidth={sw} onClick={pick} onTap={pick} />
        <Line name="doll-plant" points={post} closed fill="#3A3A40" stroke={stroke} strokeWidth={sw} onClick={pick} onTap={pick} />
        <Line name="doll-plant" points={globe} closed fill="#F3E2A8" stroke="#C4A35A" strokeWidth={sw} onClick={pick} onTap={pick} />
      </>
    );
  }
  const hw = item.w / 2;
  const hh = item.h / 2;
  const c = Math.cos(item.rot);
  const s = Math.sin(item.rot);
  const corner = (x: number, y: number, z: number) => {
    const rx = x * c - y * s;
    const ry = x * s + y * c;
    return project(item.x + rx, item.y + ry, z, spec);
  };
  if (item.kind === 'path') {
    const top = dollPts([corner(-hw, -hh, 0.22), corner(hw, -hh, 0.22), corner(hw, hh, 0.22), corner(-hw, hh, 0.22)]);
    const side = (x0: number, y0: number, x1: number, y1: number) => dollPts([
      corner(x0, y0, 0.02), corner(x1, y1, 0.02), corner(x1, y1, 0.22), corner(x0, y0, 0.22),
    ]);
    return (
      <>
        <Line name="doll-plant" points={side(-hw, -hh, hw, -hh)} closed fill="#A89070" stroke={stroke} strokeWidth={sw} onClick={pick} onTap={pick} />
        <Line name="doll-plant" points={side(hw, -hh, hw, hh)} closed fill="#8C7356" stroke={stroke} strokeWidth={sw} onClick={pick} onTap={pick} />
        <Line name="doll-plant" points={side(hw, hh, -hw, hh)} closed fill="#A89070" stroke={stroke} strokeWidth={sw} onClick={pick} onTap={pick} />
        <Line name="doll-plant" points={side(-hw, hh, -hw, -hh)} closed fill="#8C7356" stroke={stroke} strokeWidth={sw} onClick={pick} onTap={pick} />
        <Line name="doll-plant" points={top} closed fill="#E7D3B0" stroke="#8C7356" strokeWidth={sw} onClick={pick} onTap={pick} />
      </>
    );
  }
  const blooms = bloomSpots(item.id, 7, item.w, item.h);
  const bed = dollPts([corner(-hw, -hh, 0.16), corner(hw, -hh, 0.16), corner(hw, hh, 0.16), corner(-hw, hh, 0.16)]);
  return (
    <>
      <Line name="doll-plant" points={bed} closed fill="#3E6B3A" stroke={stroke} strokeWidth={sw} onClick={pick} onTap={pick} />
      {blooms.map((b, i) => (
        <Line
          key={`${item.id}-b${i}`}
          name="doll-plant"
          points={dollPts([
            corner(b.x - 0.22, b.y, 0.2),
            corner(b.x + 0.22, b.y, 0.2),
            corner(b.x + 0.12, b.y, 0.85),
            corner(b.x - 0.12, b.y, 0.85),
          ])}
          closed
          fill={b.color}
          stroke={stroke}
          strokeWidth={sw * 0.6}
          onClick={pick}
          onTap={pick}
        />
      ))}
    </>
  );
}

function AxisGizmo({ spec, light }: { spec: ProjSpec; light: boolean }) {
  const o = project(0, 0, 0, spec);
  const axes = [
    { id: 'X', p: project(3, 0, 0, spec), stroke: '#c45c4a' },
    { id: 'Y', p: project(0, 3, 0, spec), stroke: '#3d8a5a' },
    { id: 'Z', p: project(0, 0, 3, spec), stroke: '#4a6ec8' },
  ];
  let max = 1;
  for (const a of axes) max = Math.max(max, Math.hypot(a.p.x - o.x, a.p.y - o.y));
  const k = 22 / max;
  const ox = 28;
  const oy = 30;
  return (
    <svg className="doll-gizmo" width="56" height="44" viewBox="0 0 56 44" aria-hidden="true">
      {axes.map((a) => {
        const x = ox + (a.p.x - o.x) * k;
        const y = oy + (a.p.y - o.y) * k;
        return (
          <g key={a.id}>
            <line x1={ox} y1={oy} x2={x} y2={y} stroke={a.stroke} strokeWidth="2" />
            <text x={x} y={y - 2} fill={light ? '#1a1a1a' : '#f4f4f5'} fontSize="9" fontWeight="700">{a.id}</text>
          </g>
        );
      })}
    </svg>
  );
}
