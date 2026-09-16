import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as REPointerEvent, type WheelEvent as REWheelEvent } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import type { RenderTier } from '../types';
import { roofStyleName } from '../lib/roof';
import {
  SKY_PALETTE,
  SITE_PALETTE,
  asSky,
  asSite,
  asTint,
  asShowFurniture3d,
} from '../data/scene3d';
import {
  type Cam3,
  buildMass,
  defaultCam,
  projectFaces,
  walkForward,
} from '../lib/mass3d';
import { t } from '../data/i18n';

const TIERS: { tier: RenderTier; id: 'plan' | 'solid3d' | 'materials' | 'lighting'; labelKey: string; blurbKey: string }[] = [
  { tier: 0, id: 'plan', labelKey: '3d.tier.plan', blurbKey: '3d.tier.plan.blurb' },
  { tier: 1, id: 'solid3d', labelKey: '3d.tier.solid', blurbKey: '3d.tier.solid.blurb' },
  { tier: 2, id: 'materials', labelKey: '3d.tier.mat', blurbKey: '3d.tier.mat.blurb' },
  { tier: 3, id: 'lighting', labelKey: '3d.tier.light', blurbKey: '3d.tier.light.blurb' },
];

export function View3DStub() {
  const viewMode = useProjectStore((s) => s.viewMode);
  const setViewMode = useProjectStore((s) => s.setViewMode);
  const setRenderTier = useProjectStore((s) => s.setRenderTier);
  const roofStyleId = useProjectStore((s) => s.doc.settings.roofStyleId);
  const roofLabel = useProjectStore((s) => s.doc.settings.roofLabel);
  const settings = useProjectStore((s) => s.doc.settings);
  const floor = useProjectStore((s) => s.doc.floors[0]);

  const skyId = asSky(settings.skyPreset);
  const siteId = asSite(settings.siteFinish);
  const tintId = asTint(settings.wallTintId);
  const showFurn = asShowFurniture3d(settings.showFurniture3d);
  const sky = SKY_PALETTE[skyId];
  const site = SITE_PALETTE[siteId];
  const blocky = settings.guiTheme === 'blocky';
  const walk = viewMode === 'walkthrough';
  const materials = viewMode === 'materials' || viewMode === 'lighting' || viewMode === 'walkthrough' || settings.renderTier >= 2;
  const lighting = viewMode === 'lighting' || viewMode === 'walkthrough' || settings.renderTier >= 3;

  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 880, h: 460 });
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: Math.max(320, el.clientWidth), h: Math.max(240, el.clientHeight) });
    });
    ro.observe(el);
    setSize({ w: Math.max(320, el.clientWidth), h: Math.max(240, el.clientHeight) });
    return () => ro.disconnect();
  }, []);

  const [cam, setCam] = useState<Cam3>(() => defaultCam(floor, walk));
  const camRef = useRef(cam);
  camRef.current = cam;

  useEffect(() => {
    setCam(defaultCam(floor, viewMode === 'walkthrough'));
  }, [viewMode]);

  const drag = useRef<{ x: number; y: number; cam: Cam3; pan: boolean } | null>(null);

  const onPointerDown = useCallback((e: REPointerEvent<SVGSVGElement>) => {
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    drag.current = {
      x: e.clientX,
      y: e.clientY,
      cam: camRef.current,
      pan: e.shiftKey || e.button === 1,
    };
  }, []);

  const onPointerMove = useCallback((e: REPointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    const next = { ...d.cam };
    if (d.pan && !d.cam.walk) {
      const k = next.dist * 0.0025;
      next.target = {
        x: d.cam.target.x - dx * k,
        y: d.cam.target.y - dy * k,
        z: d.cam.target.z,
      };
    } else {
      next.yaw = d.cam.yaw - dx * 0.007;
      next.pitch = Math.max(d.cam.walk ? -0.35 : 0.08, Math.min(d.cam.walk ? 0.55 : 1.15, d.cam.pitch + dy * 0.005));
    }
    setCam(next);
  }, []);

  const onPointerUp = useCallback(() => { drag.current = null; }, []);

  const onWheel = useCallback((e: REWheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const cur = camRef.current;
    if (cur.walk) {
      setCam(walkForward(cur, -Math.sign(e.deltaY) * 1.6));
      return;
    }
    const factor = e.deltaY > 0 ? 1.08 : 0.92;
    setCam({ ...cur, dist: Math.max(10, Math.min(140, cur.dist * factor)) });
  }, []);

  useEffect(() => {
    const el = wrapRef.current?.querySelector('svg');
    if (!el) return;
    const fn = (ev: WheelEvent) => {
      ev.preventDefault();
      onWheel(ev as unknown as REWheelEvent<SVGSVGElement>);
    };
    el.addEventListener('wheel', fn, { passive: false });
    return () => el.removeEventListener('wheel', fn);
  }, [onWheel, size.w]);

  const opts = useMemo(() => ({
    sky: skyId,
    site: siteId,
    tint: tintId,
    showFurn,
    materials,
    lighting,
    blocky,
  }), [skyId, siteId, tintId, showFurn, materials, lighting, blocky]);

  const mass = useMemo(() => buildMass(floor, opts), [floor, opts]);
  const painted = useMemo(
    () => projectFaces(mass, cam, size.w, size.h, opts),
    [mass, cam, size.w, size.h, opts],
  );

  if (viewMode === 'plan' || viewMode === 'dollhouse') return null;

  const skyGrad = `aw3d-sky-${skyId}`;
  const loc = settings.locale;
  const activeId = walk ? 'walkthrough' : viewMode === 'materials' ? 'materials' : viewMode === 'lighting' ? 'lighting' : 'solid3d';

  return (
    <div
      className={`view3d-stub${blocky ? ' is-blocky' : ''}`}
      data-aw3d-sky={skyId}
      data-aw3d-site={siteId}
      data-aw3d-wall={tintId}
      data-aw3d-tier={String(settings.renderTier ?? 1)}
      data-aw3d-walk={walk ? '1' : '0'}
    >
      <div className="view3d-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <strong>{t(loc, walk ? '3d.walk.title' : '3d.preview')}</strong>
          <span className="save-chip" style={{ color: 'var(--accent-hot)' }}>{t(loc, '3d.viewonly')}</span>
          {roofStyleId && (
            <span className="save-chip">Roof: {roofLabel?.trim() || roofStyleName(roofStyleId)}</span>
          )}
        </div>
        <span>{t(loc, '3d.banner')} <button type="button" className="linkish" onClick={() => { setRenderTier(0); setViewMode('plan'); }}>{t(loc, 'chrome.plan')}</button>.</span>
      </div>
      <div className="tier-ladder">
        {TIERS.map((row) => (
          <button
            key={row.id}
            type="button"
            className={`tier-card ${activeId === row.id ? 'active' : ''}`}
            onClick={() => {
              if (row.id === 'plan') { setRenderTier(0); setViewMode('plan'); }
              else { setRenderTier(row.tier); setViewMode(row.id); }
            }}
          >
            <strong>{t(loc, row.labelKey)}</strong>
            <span>{t(loc, row.blurbKey)}</span>
          </button>
        ))}
        <button
          type="button"
          className={`tier-card ${walk ? 'active' : ''}`}
          onClick={() => setViewMode('walkthrough')}
        >
          <strong>{t(loc, '3d.tier.walk')}</strong>
          <span>{t(loc, '3d.tier.walk.blurb')}</span>
        </button>
      </div>
      <div className="solid-preview" aria-label="Solid 3D preview with site and sky" ref={wrapRef}>
        <svg
          className="solid-preview-svg"
          viewBox={`0 0 ${size.w} ${size.h}`}
          width="100%"
          height="100%"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onWheel={onWheel}
          style={{ touchAction: 'none', cursor: walk ? 'ew-resize' : 'grab' }}
        >
          <defs>
            <linearGradient id={skyGrad} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={sky.zenith} />
              <stop offset="55%" stopColor={sky.mid} />
              <stop offset="100%" stopColor={sky.horizon} />
            </linearGradient>
            {materials ? (
              <pattern id="aw3d-grass" width="10" height="10" patternUnits="userSpaceOnUse">
                <rect width="10" height="10" fill={site.ground} />
                <path d="M1 9 L3 2 M5 10 L7 3 M8 9 L10 4" stroke={site.edge} strokeWidth="0.8" fill="none" />
              </pattern>
            ) : null}
            {materials ? (
              <pattern id="aw3d-shingle" width="12" height="8" patternUnits="userSpaceOnUse">
                <rect width="12" height="8" fill="#5C6B82" />
                <path d="M0 4 H12 M4 0 V4 M8 4 V8" stroke="#8A9BB0" strokeWidth="0.6" opacity="0.55" />
              </pattern>
            ) : null}
          </defs>
          <rect width={size.w} height={size.h} fill={`url(#${skyGrad})`} />
          {lighting && skyId === 'dusk' ? (
            <circle cx={size.w * 0.78} cy={size.h * 0.18} r="22" fill="#E8B07A" opacity="0.85" />
          ) : lighting && skyId === 'day' ? (
            <circle cx={size.w * 0.82} cy={size.h * 0.12} r="16" fill="#FFF4C8" opacity="0.9" />
          ) : null}
          <rect x="0" y={size.h * 0.52} width={size.w} height={size.h * 0.16} fill={sky.fog} opacity="0.28" />
          {painted.map((p, i) => (
            <path
              key={i}
              d={p.d}
              fill={p.kind === 'yard' && materials ? 'url(#aw3d-grass)' : p.kind === 'roof' && materials && roofStyleId !== 'grass' && roofStyleId !== 'conical' ? 'url(#aw3d-shingle)' : p.fill}
              stroke={p.stroke}
              strokeWidth={p.sw}
              opacity={p.kind === 'glass' ? 0.92 : 1}
            />
          ))}
          {!floor.walls.length && (
            <text x={size.w / 2} y={size.h / 2} textAnchor="middle" fill={site.deep} fontSize="16" fontWeight="500">
              {t(loc, '3d.empty')}
            </text>
          )}
        </svg>
        <div className="view3d-hud">
          <p className="muted center view3d-hint">{t(loc, walk ? '3d.drag.walk' : '3d.drag')}</p>
          <div className="view3d-hud-btns">
            {walk ? (
              <>
                <button type="button" className="ghost-btn aw-pressable" onClick={() => setCam((c) => walkForward(c, 2.2))}>{t(loc, '3d.walk.fwd')}</button>
                <button type="button" className="ghost-btn aw-pressable" onClick={() => setCam((c) => walkForward(c, -2.2))}>{t(loc, '3d.walk.back')}</button>
              </>
            ) : null}
            <button type="button" className="ghost-btn aw-pressable" onClick={() => setCam(defaultCam(floor, walk))}>{t(loc, '3d.reset')}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
