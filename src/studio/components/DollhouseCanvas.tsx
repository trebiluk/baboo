import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Stage, Layer, Line, Rect, Text, Circle } from 'react-konva';
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
  DOLL_PROJS,
  shouldCutawayWall,
  isCameraFacingSide,
  type DollProj,
  type ProjSpec,
  type YawDeg,
} from '../lib/iso';
import { asWallHeightFt } from '../lib/wallDraft';
import { packTileCanvas, textureStrokeFallback } from '../lib/texturePattern';
import { furnitureParts, partWorldCorners, partWorldRing } from '../lib/furnShape';
import { FURN_CAP, furnitureLod } from '../lib/perf';
import { asFloorFinish, asFloorGrain, floorFinish, floorTileCanvas } from '../data/flooring';
import { listInteriorFloors, roomPolygon } from '../lib/rooms';
import { DEFAULT_GUI_THEME } from '../data/themes';
import { t } from '../data/i18n';
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
  const furnLod = furnitureLod({ count: floor.furniture.length, zoom: zoom * 16 });
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
    for (const n of floor.nodes) pts.push(project(n.x, n.y, 0, spec), project(n.x, n.y, wallH, spec));
    for (const f of floor.furniture) pts.push(project(f.x, f.y, 0, spec));
    for (const L of floor.landscape ?? []) pts.push(project(L.x, L.y, 0, spec));
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

  const lidPoly = useMemo(() => {
    const outline = floor.roof?.outline;
    if (outline && outline.length >= 3) return projectPoints(outline.map((p) => ({ x: p.x, y: p.y, z: wallH })), spec);
    return [];
  }, [floor.roof, spec.kind, spec.yaw, spec.top, wallH]);

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
    const cutAway = new Set<string>();
    const ink = blocky ? '#1a1208' : (light ? '#2a2a32' : '#c5d0ea');
    const furnInk = blocky ? '#1a1208' : '#3f3f46';
    const swWall = (sel: boolean) => (sel ? 3 : (blocky ? 2.5 : 1.25)) / zoom;
    const swFurn = (sel: boolean) => (sel ? 2 : (blocky ? 2 : 1)) / zoom;

    for (const w of floor.walls) {
      const e = wallEnds(w, floor.nodes);
      if (!e) continue;
      const mx = (e.a.x + e.b.x) / 2;
      const my = (e.a.y + e.b.y) / 2;
      if (shouldCutawayWall(mx, my, ox, oy, spec)) {
        cutAway.add(w.id);
        continue;
      }
      const texId = w.finishId || houseTex;
      const useTex = texId && texId !== 'pack:plain' ? texId : null;
      const sel = selected?.kind === 'wall' && selected.id === w.id;
      const fill = textureStrokeFallback(useTex) ?? (w.kind === 'exterior'
        ? (light ? '#d8dce8' : '#3a4560')
        : (light ? '#ece4d4' : '#4a4034'));
      const tile = useTex ? tiles.get(useTex) : undefined;
      faces.push({
        key: `w-${w.id}`,
        pts: projectPoints([
          { x: e.a.x, y: e.a.y, z: 0 },
          { x: e.b.x, y: e.b.y, z: 0 },
          { x: e.b.x, y: e.b.y, z: wallH },
          { x: e.a.x, y: e.a.y, z: wallH },
        ], spec),
        fill,
        pattern: tile,
        stroke: sel ? '#6e72f5' : ink,
        sw: swWall(sel),
        depth: cameraDepth(mx, my, spec),
        pick: () => setSelected({ kind: 'wall', id: w.id }),
      });
    }

    for (const o of floor.openings) {
      const wall = floor.walls.find((w) => w.id === o.wallId);
      if (!wall || cutAway.has(wall.id)) continue;
      const e = wallEnds(wall, floor.nodes);
      if (!e) continue;
      const dx = e.b.x - e.a.x;
      const dy = e.b.y - e.a.y;
      const len = Math.max(0.01, Math.hypot(dx, dy));
      const t0 = o.t - o.width / (2 * len);
      const t1 = o.t + o.width / (2 * len);
      const z0 = o.type === 'door' ? 0 : 3;
      const z1 = o.type === 'door' ? 7 : 6.5;
      const a = { x: e.a.x + dx * t0, y: e.a.y + dy * t0 };
      const b = { x: e.a.x + dx * t1, y: e.a.y + dy * t1 };
      const sel = selected?.kind === 'opening' && selected.id === o.id;
      faces.push({
        key: `o-${o.id}`,
        pts: projectPoints([
          { x: a.x, y: a.y, z: z0 },
          { x: b.x, y: b.y, z: z0 },
          { x: b.x, y: b.y, z: z1 },
          { x: a.x, y: a.y, z: z1 },
        ], spec),
        fill: o.type === 'door' ? (light ? '#8b5a2b' : '#6b4220') : (light ? '#b9d7ee' : '#3d6a88'),
        stroke: sel ? '#6e72f5' : '#1a1a1a',
        sw: (sel ? 2.5 : 1) / zoom,
        depth: cameraDepth((a.x + b.x) / 2, (a.y + b.y) / 2, spec) + 0.08,
        pick: () => setSelected({ kind: 'opening', id: o.id }),
      });
    }

    const lod = furnLod;
    for (const f of floor.furniture.slice(0, FURN_CAP[lod])) {
      const sel = selected?.kind === 'furniture' && selected.id === f.id;
      const parts = furnitureParts(f, lod);
      let fi = 0;
      const pick = () => setSelected({ kind: 'furniture', id: f.id });
      for (const part of parts) {
        const ring = lod === 'simple' ? partWorldCorners(f, part) : partWorldRing(f, part);
        if (ring.length < 3) continue;
        const cx = ring.reduce((s, p) => s + p.x, 0) / ring.length;
        const cy = ring.reduce((s, p) => s + p.y, 0) / ring.length;
        faces.push({
          key: `f-${f.id}-${fi++}`,
          pts: projectPoints(ring.map((c) => ({ x: c.x, y: c.y, z: part.z1 })), spec),
          fill: sel ? '#c5c7ff' : part.fill,
          stroke: sel ? '#6e72f5' : furnInk,
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
            fill: sel ? '#c5c7ff' : part.fill,
            stroke: sel ? '#6e72f5' : furnInk,
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
    const onEmpty = ev.target === ev.currentTarget || name === 'doll-floor' || name === 'doll-bg';
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
          {interiorFloors.length
            ? interiorFloors.map((rf, i) => (
              <Line
                key={`if-${i}`}
                name="doll-floor"
                points={rf.pts}
                closed
                fill={floorFinish(rf.finish).color}
                fillPatternImage={furnLod === 'full' ? floorTileCanvas(rf.finish, asFloorGrain(settings.floorGrain)) as CanvasImageSource as HTMLImageElement : undefined}
                fillPatternRepeat="repeat"
                fillPriority={furnLod === 'full' ? 'pattern' : 'color'}
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
              fillPatternImage={furnLod === 'full' ? floorTileCanvas(asFloorFinish(settings.floorFinishId), asFloorGrain(settings.floorGrain)) as CanvasImageSource as HTMLImageElement : undefined}
              fillPatternRepeat="repeat"
              fillPriority={furnLod === 'full' ? 'pattern' : 'color'}
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
                fillPatternImage={furnLod === 'full' ? floorTileCanvas(fid, grain) as CanvasImageSource as HTMLImageElement : undefined}
                fillPatternRepeat="repeat"
                fillPriority={furnLod === 'full' ? 'pattern' : 'color'}
                fillPatternScaleX={0.04}
                fillPatternScaleY={0.04}
                listening={false}
              />
            );
          })}
          {lidPoly.length >= 6 && !spec.top && (
            <Line
              points={lidPoly}
              closed
              dash={[6 / zoom, 5 / zoom]}
              stroke={light ? '#8b8dff' : '#c5c7ff'}
              strokeWidth={1.25 / zoom}
              opacity={0.55}
              listening={false}
            />
          )}
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
          {(floor.landscape ?? []).filter((L) => L.kind === 'tree').map((L) => {
            const crown = project(L.x + L.w / 2, L.y + L.h / 2, 10, spec);
            const sel = selected?.kind === 'landscape' && selected.id === L.id;
            return (
              <Circle
                key={L.id}
                name="doll-plant"
                x={crown.x}
                y={crown.y}
                radius={18}
                fill={light ? '#5f8f52' : '#3d6a38'}
                stroke={sel ? '#6e72f5' : '#2f4a28'}
                strokeWidth={(sel ? 2.5 : 1) / zoom}
                onClick={(evt) => {
                  evt.cancelBubble = true;
                  setSelected({ kind: 'landscape', id: L.id });
                }}
                onTap={(evt) => {
                  evt.cancelBubble = true;
                  setSelected({ kind: 'landscape', id: L.id });
                }}
              />
            );
          })}
          {floor.rooms.map((r) => {
            const p = project(r.x, r.y, 0.2, spec);
            return (
              <Text
                key={r.id}
                x={p.x - 24}
                y={p.y}
                width={48}
                align="center"
                text={r.name}
                fontSize={11 / Math.max(0.6, zoom)}
                fill={light ? '#1a1a1a' : '#f4f4f5'}
                listening={false}
              />
            );
          })}
        </Layer>
      </Stage>
      <div className="doll-proj" role="toolbar" aria-label={t(settings.locale, 'doll.proj')}>
        <div className="doll-proj-row">
          {DOLL_PROJS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`doll-chip${spec.kind === p.id ? ' active' : ''} aw-pressable`}
              onClick={() => setSettings({ dollProj: p.id, dollTop: false })}
            >
              {t(settings.locale, `doll.proj.${p.id}`)}
            </button>
          ))}
        </div>
        <div className="doll-proj-row">
          <button
            type="button"
            className="doll-chip aw-pressable"
            aria-label={t(settings.locale, 'doll.turn.left')}
            onClick={() => setSettings({ dollYaw: nextYaw(spec.yaw, -1), dollTop: false })}
          >
            ◀
          </button>
          {(['front', 'right', 'rear', 'left'] as const).map((id) => (
            <button
              key={id}
              type="button"
              className={`doll-chip${face === id ? ' active' : ''} aw-pressable`}
              onClick={() => setSettings({
                dollYaw: id === 'right' ? 90 : id === 'rear' ? 180 : id === 'left' ? 270 : 0,
                dollTop: false,
              })}
            >
              {t(settings.locale, `doll.face.${id}`)}
            </button>
          ))}
          {spec.kind === 'ortho' ? (
            <button
              type="button"
              className={`doll-chip${spec.top ? ' active' : ''} aw-pressable`}
              onClick={() => setSettings({ dollProj: 'ortho', dollTop: true })}
            >
              {t(settings.locale, 'doll.face.top')}
            </button>
          ) : null}
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
        <p className="doll-proj-lesson">
          {t(settings.locale, spec.top ? 'doll.lesson.ortho.top' : `doll.lesson.${spec.kind}`)}
        </p>
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
