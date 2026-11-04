import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { SITE_PALETTE, SKY_PALETTE, WALL_TINT, asShowFurniture3d, asSite, asSky, asTint } from '../data/scene3d';
import { asWallHeightFt } from '../lib/wallDraft';
import { asFloorFinish } from '../data/flooring';
import { t } from '../data/i18n';
import type { EngineHandle } from './EngineView';
import type { HouseLook } from '../lib/engine3d';

const EngineView = lazy(() => import('./EngineView').then((m) => ({ default: m.EngineView })));

/**
 * Teacher-only speed readout for 3D: frames a second and which look is on. Turn Teacher on by holding the version chip
 * (or ?teacher=1), then open 3D on the school machine you want to test (2.13.35).
 */
function FpsBadge({ loc }: { loc: Parameters<typeof t>[0] }) {
  const [teacher, setTeacher] = useState(() => {
    try {
      return new URLSearchParams(location.search).get('teacher') === '1' || localStorage.getItem('baboo-teacher') === '1';
    } catch {
      return false;
    }
  });
  const [stat, setStat] = useState<{ fps: number; tier: string } | null>(null);
  useEffect(() => {
    const on = () => setTeacher(true);
    const fps = (e: Event) => setStat((e as CustomEvent<{ fps: number; tier: string }>).detail);
    window.addEventListener('baboo-teacher', on);
    window.addEventListener('baboo-fps', fps);
    return () => {
      window.removeEventListener('baboo-teacher', on);
      window.removeEventListener('baboo-fps', fps);
    };
  }, []);
  if (!teacher || !stat) return null;
  const slow = stat.fps < 20;
  return (
    <p className={`view3d-fps${slow ? ' is-slow' : ''}`} role="status">
      {t(loc, '3d.fps', { n: String(stat.fps) })} · {t(loc, stat.tier === 'rich' ? '3d.look.rich' : '3d.look.plain')}
    </p>
  );
}

export function View3DStub() {
  const viewMode = useProjectStore((s) => s.viewMode);
  const setViewMode = useProjectStore((s) => s.setViewMode);
  const settings = useProjectStore((s) => s.doc.settings);
  const floor = useProjectStore((s) => s.doc.floors[0]);
  const selected = useProjectStore((s) => s.selected);
  const engineRef = useRef<EngineHandle>(null);
  // What was picked in 2D, as a plan point: 3D opens aimed at it (2.13.21).
  const focus = useMemo(() => {
    if (!selected) return null;
    const byId = <T extends { id: string }>(list: T[] | undefined) => (list ?? []).find((x) => x.id === selected.id);
    if (selected.kind === 'furniture') { const f = byId(floor.furniture); return f ? { x: f.x, y: f.y } : null; }
    if (selected.kind === 'landscape') { const f = byId(floor.landscape); return f ? { x: f.x, y: f.y } : null; }
    if (selected.kind === 'room') { const r = byId(floor.rooms); return r ? { x: r.x, y: r.y } : null; }
    if (selected.kind === 'wall' || selected.kind === 'opening') {
      const wallId = selected.kind === 'wall' ? selected.id : byId(floor.openings)?.wallId;
      const w = floor.walls.find((x) => x.id === wallId);
      const a = w && floor.nodes.find((n) => n.id === w.a);
      const b = w && floor.nodes.find((n) => n.id === w.b);
      return a && b ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } : null;
    }
    return null;
    // only when 3D opens or the pick changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);
  const finePointer = typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  // The hint line steps aside once you have dragged the view: the buttons are all a phone needs after that (2.13.26).
  const [moved, setMoved] = useState(false);

  const skyId = asSky(settings.skyPreset);
  const siteId = asSite(settings.siteFinish);
  const tintId = asTint(settings.wallTintId);
  const walk = viewMode === 'walkthrough';
  const sky = SKY_PALETTE[skyId];
  const site = SITE_PALETTE[siteId];
  const blocky = settings.guiTheme === 'blocky';
  const loc = settings.locale;

  const look = useMemo<HouseLook>(() => ({
    wallH: asWallHeightFt(settings.wallHeight),
    tint: WALL_TINT[tintId].fill,
    ground: site.ground,
    showFurn: asShowFurniture3d(settings.showFurniture3d),
    ceiling: true,
    houseFinish: asFloorFinish(settings.floorFinishId),
  }), [settings.wallHeight, settings.showFurniture3d, settings.floorFinishId, tintId, site.ground]);

  if (viewMode === 'plan' || viewMode === 'dollhouse') return null;

  return (
    <div
      className={`view3d-stub${blocky ? ' is-blocky' : ''}`}
      data-aw3d-sky={skyId}
      data-aw3d-site={siteId}
      data-aw3d-wall={tintId}
      data-aw3d-tier={String(settings.renderTier ?? 1)}
      data-aw3d-walk={walk ? '1' : '0'}
      data-aw3d-engine="webgl"
    >
      <div
        className="solid-preview"
        aria-label={t(loc, '3d.preview')}
        onPointerDown={(e) => { if ((e.target as HTMLElement).tagName === 'CANVAS') setMoved(true); }}
      >
        <Suspense fallback={null}>
          <EngineView ref={engineRef} floor={floor} look={look} sky={sky.zenith} walk={walk} focus={focus} />
        </Suspense>
        {!floor.walls.length ? (
          <p className="view3d-empty">{t(loc, '3d.empty')}</p>
        ) : null}
        <FpsBadge loc={loc} />
        <div className={`view3d-hud${moved ? ' has-moved' : ''}`}>
          <p className="view3d-hint">
            {t(loc, finePointer ? (walk ? '3d.drag.walk' : '3d.drag') : (walk ? '3d.drag.walk.touch' : '3d.drag.touch'))}
            {finePointer ? <span className="view3d-keys"> · {t(loc, walk ? '3d.keys.walk' : '3d.keys.orbit')}</span> : null}
          </p>
          <div className="view3d-hud-btns">
            {walk ? (
              <>
                <button type="button" className="ghost-btn aw-pressable" aria-label={t(loc, '3d.turnL')} title={t(loc, '3d.turnL')} onClick={() => engineRef.current?.turn(-1)}>↺</button>
                <button type="button" className="ghost-btn aw-pressable" onClick={() => engineRef.current?.walkBy(2.2)}>{t(loc, '3d.walk.fwd')}</button>
                <button type="button" className="ghost-btn aw-pressable" onClick={() => engineRef.current?.walkBy(-2.2)}>{t(loc, '3d.walk.back')}</button>
                <button type="button" className="ghost-btn aw-pressable" aria-label={t(loc, '3d.turnR')} title={t(loc, '3d.turnR')} onClick={() => engineRef.current?.turn(1)}>↻</button>
              </>
            ) : (
              <>
                <button type="button" className="ghost-btn aw-pressable" onClick={() => engineRef.current?.preset('front')}>{t(loc, '3d.front')}</button>
                <button type="button" className="ghost-btn aw-pressable" onClick={() => engineRef.current?.preset('top')}>{t(loc, '3d.top')}</button>
              </>
            )}
            <button type="button" className="ghost-btn aw-pressable" onClick={() => engineRef.current?.reset()}>{t(loc, '3d.reset')}</button>
            <button
              type="button"
              className="ghost-btn aw-pressable"
              onClick={() => setViewMode(walk ? 'solid3d' : 'walkthrough')}
            >
              {t(loc, walk ? '3d.walk.exit' : '3d.tier.walk')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
