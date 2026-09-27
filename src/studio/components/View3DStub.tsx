import { lazy, Suspense, useMemo, useRef } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { SITE_PALETTE, SKY_PALETTE, WALL_TINT, asShowFurniture3d, asSite, asSky, asTint } from '../data/scene3d';
import { asWallHeightFt } from '../lib/wallDraft';
import { asFloorFinish } from '../data/flooring';
import { t } from '../data/i18n';
import type { EngineHandle } from './EngineView';
import type { HouseLook } from '../lib/engine3d';

const EngineView = lazy(() => import('./EngineView').then((m) => ({ default: m.EngineView })));

export function View3DStub() {
  const viewMode = useProjectStore((s) => s.viewMode);
  const setViewMode = useProjectStore((s) => s.setViewMode);
  const settings = useProjectStore((s) => s.doc.settings);
  const floor = useProjectStore((s) => s.doc.floors[0]);
  const engineRef = useRef<EngineHandle>(null);

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
      <div className="solid-preview" aria-label="Solid 3D preview with site and sky">
        <Suspense fallback={null}>
          <EngineView ref={engineRef} floor={floor} look={look} sky={sky.zenith} walk={walk} />
        </Suspense>
        {!floor.walls.length ? (
          <p className="view3d-empty">{t(loc, '3d.empty')}</p>
        ) : null}
        <div className="view3d-hud">
          <p className="view3d-hint">{t(loc, walk ? '3d.drag.walk' : '3d.drag')}</p>
          <div className="view3d-hud-btns">
            {walk ? (
              <>
                <button type="button" className="ghost-btn aw-pressable" onClick={() => engineRef.current?.walkBy(2.2)}>{t(loc, '3d.walk.fwd')}</button>
                <button type="button" className="ghost-btn aw-pressable" onClick={() => engineRef.current?.walkBy(-2.2)}>{t(loc, '3d.walk.back')}</button>
              </>
            ) : null}
            <button type="button" className="ghost-btn aw-pressable" onClick={() => engineRef.current?.reset()}>{t(loc, '3d.reset')}</button>
            <button
              type="button"
              className="ghost-btn aw-pressable"
              onClick={() => setViewMode(walk ? 'solid3d' : 'walkthrough')}
            >
              {t(loc, walk ? '3d.preview' : '3d.tier.walk')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
