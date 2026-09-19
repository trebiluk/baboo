import { useRef, useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { ROOF_STYLE_OPTIONS, roofStyleName } from '../lib/roof';
import { TEXTURE_PACKS, textureName } from '../data/textures';
import { FLOOR_FINISHES, asFloorFinish, asFloorGrain } from '../data/flooring';
import type { GuiThemeId, Locale, RoofStyleId, SiteFinish, SkyPreset, TypologyShell, WallTintId } from '../types';
import { DEFAULT_SKILL_LEVEL, skillRank } from '../data/skill';
import { SkillPicker } from './SkillPicker';
import { THEME_OPTIONS } from '../data/themes';
import { LOCALE_OPTIONS, asLocale, t, tipLoc } from '../data/i18n';
import {
  SKY_OPTIONS,
  SITE_OPTIONS,
  WALL_TINT,
  WALL_TINT_OPTIONS,
  asShowFurniture3d,
  asSite,
  asSky,
  asTint,
} from '../data/scene3d';

export function CustomizePanel() {
  const open = useProjectStore((s) => s.customizeOpen);
  const toggle = useProjectStore((s) => s.toggleCustomize);
  const settings = useProjectStore((s) => s.doc.settings);
  const setSettings = useProjectStore((s) => s.setSettings);
  const setRoofStyle = useProjectStore((s) => s.setRoofStyle);
  const setRoofLabel = useProjectStore((s) => s.setRoofLabel);
  const setTexture = useProjectStore((s) => s.setTexture);
  const clearTexture = useProjectStore((s) => s.clearTexture);
  const importTextureFile = useProjectStore((s) => s.importTextureFile);
  const setTypologyShell = useProjectStore((s) => s.setTypologyShell);
  const setInventoryPresent = useProjectStore((s) => s.setInventoryPresent);
  const fileRef = useRef<HTMLInputElement>(null);
  const [importBusy, setImportBusy] = useState(false);
  const skillLevel = settings.skillLevel ?? DEFAULT_SKILL_LEVEL;
  const setSkillLevel = useProjectStore((s) => s.setSkillLevel);
  const floor = useProjectStore((s) => s.doc.floors[0]);
  const setFloorLayer = useProjectStore((s) => s.setFloorLayer);
  const patchRoom = useProjectStore((s) => s.patchRoom);

  if (!open) return null;

  const activeTex = settings.textureId ?? null;
  const isTinyHome = settings.styleId === 'tiny-home';
  const typology = settings.typology;
  const shell: TypologyShell = typology?.shell ?? 'trailer';

  const onImport = async (file: File | undefined) => {
    if (!file) return;
    setImportBusy(true);
    try {
      await importTextureFile(file);
    } finally {
      setImportBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <>
      <button
        type="button"
        className="teaching-backdrop"
        aria-label={t(settings.locale, 'chrome.close')}
        onClick={toggle}
      />
      <aside
        className="drawer customize-drawer"
        role="dialog"
        aria-labelledby="customize-title"
      >
        <div className="drawer-head">
          <div className="drawer-head-title">
            <span className="sheet-handle" aria-hidden="true" />
            <h2 id="customize-title">{t(settings.locale, 'chrome.settings')}</h2>
          </div>
          <button type="button" className="ghost-btn secondary-btn aw-pressable" onClick={toggle}>
            {t(settings.locale, 'chrome.close')}
          </button>
        </div>

        <label className="field">
          <span>Grid size ({settings.units === 'm' ? 'ft world' : 'ft'})</span>
          <input
            type="number"
            min={0.5}
            max={4}
            step={0.5}
            value={settings.gridSize}
            onChange={(e) => setSettings({ gridSize: Number(e.target.value) || 1 })}
          />
        </label>
        <label className="field check">
          <input
            type="checkbox"
            checked={settings.snap}
            onChange={(e) => setSettings({ snap: e.target.checked })}
          />
          <span>Snap to grid <em>(optional — turn off for free drag)</em></span>
        </label>
        <label className="field check">
          <input
            type="checkbox"
            checked={settings.ortho !== false}
            onChange={(e) => setSettings({ ortho: e.target.checked })}
          />
          <span>Straight walls (90° and 45° corners) <em>hold Shift for 90° only</em></span>
        </label>
        <label className="field">
          <span>Units (dimension labels)</span>
          <select
            value={settings.units}
            onChange={(e) => setSettings({ units: e.target.value as 'ft' | 'm' })}
          >
            <option value="ft">Feet</option>
            <option value="m">Meters</option>
          </select>
        </label>

        <label className="field">
          <span>Theme</span>
          <select
            value={settings.guiTheme ?? 'stark'}
            onChange={(e) => {
              setSettings({ guiTheme: e.target.value as GuiThemeId });
            }}
          >
            {THEME_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.name} — {opt.blurb}
              </option>
            ))}
          </select>
        </label>

        <section className="aw-scene3d" aria-labelledby="lang-title">
          <h3 id="lang-title">{t(settings.locale, 'lang.title')}</h3>
          <p className="muted dense-lead">{t(settings.locale, 'lang.lead')}</p>
          <h4 className="help-lang-label">{t(tipLoc(settings), 'lang.tips')}</h4>
          <div className="aw-shell-toggle aw-lang-toggle" role="group" aria-label={t(tipLoc(settings), 'lang.tips')}>
            {LOCALE_OPTIONS.map((opt) => {
              const on = asLocale(settings.tipsLocale ?? settings.locale) === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  lang={opt.htmlLang}
                  dir={opt.dir}
                  title={opt.blurb}
                  className={`aw-shell-chip aw-pressable${on ? ' active' : ''}`}
                  aria-pressed={on}
                  onClick={() => setSettings({ tipsLocale: opt.id as Locale })}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="aw-scene3d" aria-labelledby="udl-title">
          <h3 id="udl-title">{t(settings.locale, 'udl.title')}</h3>
          <p className="muted dense-lead">{t(settings.locale, 'udl.lead')}</p>
          <label className="field check">
            <input
              type="checkbox"
              checked={!!settings.udlFat}
              onChange={(e) => setSettings({ udlFat: e.target.checked })}
            />
            <span>{t(settings.locale, 'udl.fat')}</span>
          </label>
          <label className="field check">
            <input
              type="checkbox"
              checked={!!settings.udlType}
              onChange={(e) => setSettings({ udlType: e.target.checked })}
            />
            <span>{t(settings.locale, 'udl.type')}</span>
          </label>
          <label className="field check">
            <input
              type="checkbox"
              checked={!!settings.udlContrast}
              onChange={(e) => setSettings({ udlContrast: e.target.checked })}
            />
            <span>{t(settings.locale, 'udl.contrastOn')}</span>
          </label>
          <label className="field check">
            <input
              type="checkbox"
              checked={settings.ellEnglish !== false}
              onChange={(e) => setSettings({ ellEnglish: e.target.checked })}
            />
            <span>{t(settings.locale, 'udl.english')}</span>
          </label>
          <p className="muted dense-lead">{t(settings.locale, 'udl.english.lead')}</p>
          <p className="muted dense-lead">{t(settings.locale, 'udl.contrast')}</p>
        </section>

        <SkillPicker value={skillLevel} onChange={setSkillLevel} legend={t(settings.locale, 'skill.legend')} />

        {skillRank(skillLevel) >= 3 && (
          <section className="skill-layers" aria-label="Plan layers">
            <h3>Layers</h3>
            <p className="muted">Hide plan overlays while you draft.</p>
            {([
              ['structure', 'Walls'],
              ['openings', 'Doors & windows'],
              ['furniture', 'Furniture'],
              ['rooms', 'Room names'],
              ['dims', 'Size labels'],
              ['landscape', 'Plants'],
              ['sketch', 'Sketches'],
              ['roof', 'Roof lines'],
            ] as const).map(([key, label]) => (
              <label key={key} className="field check">
                <input
                  type="checkbox"
                  checked={floor.layers[key] !== false}
                  onChange={(e) => setFloorLayer(key, e.target.checked)}
                />
                <span>{label}</span>
              </label>
            ))}
          </section>
        )}

        <label className="field">
          <span>Roof style (learn the names)</span>
          <select
            value={settings.roofStyleId ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              setRoofStyle(v === '' ? null : (v as RoofStyleId));
            }}
          >
            <option value="">None (no auto roof)</option>
            {ROOF_STYLE_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
        </label>
        <label className="field check">
          <input
            type="checkbox"
            checked={settings.showRoof !== false}
            onChange={(e) => setSettings({ showRoof: e.target.checked })}
          />
          <span>Show roof overlay on plan</span>
        </label>
        <label className="field">
          <span>Roof name (student)</span>
          <input
            type="text"
            value={settings.roofLabel ?? ''}
            placeholder={roofStyleName(settings.roofStyleId)}
            onChange={(e) => setRoofLabel(e.target.value)}
            disabled={!settings.roofStyleId}
          />
        </label>
        <p className="muted">
          Current roof:{' '}
          <strong>{settings.roofLabel?.trim() || roofStyleName(settings.roofStyleId)}</strong>.
          Changing the style regenerates dashed plan lines + 3D massing from exterior walls.
          Blank starts with no roof until you pick one. Hobbit defaults to <strong>grass/sod</strong>;
          Yurt to <strong>conical</strong>.
        </p>

        {isTinyHome ? (
          <section className="aw-typology" aria-labelledby="typology-title">
            <h3 id="typology-title">Tiny Home · shell &amp; inventory</h3>
            <p className="muted">
              Tiny home type is always on (trailer or shipping container). Contest is separate.
            </p>
            <div className="aw-shell-toggle" role="group" aria-label="Tiny Home shell">
              <button
                type="button"
                className={`aw-shell-chip aw-pressable${shell === 'trailer' ? ' active' : ''}`}
                aria-pressed={shell === 'trailer'}
                onClick={() => setTypologyShell('trailer')}
              >
                Trailer
              </button>
              <button
                type="button"
                className={`aw-shell-chip aw-pressable${shell === 'shipping-container' ? ' active' : ''}`}
                aria-pressed={shell === 'shipping-container'}
                onClick={() => setTypologyShell('shipping-container')}
              >
                Container
              </button>
            </div>
            <ul className="aw-inventory-list">
              {(typology?.inventory ?? []).map((item) => {
                const missing = item.required && !item.present;
                return (
                  <li
                    key={item.id}
                    className={`aw-inv-item${item.required ? ' aw-inv-item--required' : ''}${missing ? ' aw-inv-item--missing' : ''}${item.present ? ' aw-inv-item--present' : ''}`}
                  >
                    <label className="field check">
                      <input
                        type="checkbox"
                        checked={item.present}
                        onChange={(e) => setInventoryPresent(item.id, e.target.checked)}
                      />
                      <span>
                        {item.label}
                        {item.required ? (
                          <em className="aw-inv-req">{missing ? ' required · missing' : ' required'}</em>
                        ) : (
                          <em className="aw-inv-opt"> optional</em>
                        )}
                      </span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {/* Materials / silly textures — StyleBot UI; Debugzy applies */}
        <section className="aw-materials" aria-labelledby="materials-title">
          <h3 id="materials-title">Materials · wallpaper</h3>
          <p className="muted">
            Silly packs + import for plan walls (tile hatch). School-appropriate images only.
            Imports stay local (≤512px) — not saved inside the JSON file.
          </p>
          <div className="aw-tex-grid" role="listbox" aria-label="Texture packs">
            {TEXTURE_PACKS.map((pack) => {
              const selected = activeTex === pack.id || (pack.id === 'pack:plain' && !activeTex);
              return (
                <button
                  key={pack.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`aw-tex-chip aw-pressable${selected ? ' active' : ''}`}
                  title={pack.blurb}
                  onClick={() => {
                    if (pack.id === 'pack:plain') clearTexture();
                    else setTexture(pack.id, pack.name);
                  }}
                >
                  <span
                    className="aw-tex-chip__swatch"
                    style={{ background: pack.previewCss }}
                    aria-hidden="true"
                  />
                  <span className="aw-tex-chip__label">{pack.name}</span>
                </button>
              );
            })}
          </div>
          <div className="aw-tex-actions">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="aw-tex-file"
              aria-label="Import wallpaper image"
              onChange={(e) => onImport(e.target.files?.[0])}
            />
            <button
              type="button"
              className="ghost-btn aw-pressable"
              onClick={() => fileRef.current?.click()}
              disabled={importBusy}
            >
              {importBusy ? 'Importing…' : 'Import image…'}
            </button>
            <button
              type="button"
              className="ghost-btn secondary-btn aw-pressable aw-tex-clear"
              onClick={() => clearTexture()}
              disabled={!activeTex}
              title="One-tap revert to plain paint"
            >
              Clear texture
            </button>
          </div>
          <p className="muted">
            Current:{' '}
            <strong>
              {activeTex
                ? (settings.textureLabel?.trim() || textureName(activeTex))
                : 'Plain paint'}
            </strong>
            {activeTex === 'import:local'
              ? (settings.imageBlobRef
                ? ' (local import · IDB ref only)'
                : ' (import — blob missing, re-import)')
              : null}
          </p>
        </section>

        <section className="aw-materials" aria-labelledby="floor-title">
          <h3 id="floor-title">{t(settings.locale, 'floor.title')}</h3>
          <p className="muted dense-lead">{t(settings.locale, 'floor.lead')}</p>
          <div className="aw-tex-grid" role="listbox" aria-label={t(settings.locale, 'floor.title')}>
            {FLOOR_FINISHES.map((pack) => {
              const selected = asFloorFinish(settings.floorFinishId) === pack.id;
              return (
                <button
                  key={pack.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`aw-tex-chip aw-pressable${selected ? ' active' : ''}`}
                  title={pack.blurb}
                  onClick={() => setSettings({ floorFinishId: pack.id })}
                >
                  <span
                    className="aw-tex-chip__swatch"
                    style={{ background: pack.previewCss }}
                    aria-hidden="true"
                  />
                  <span className="aw-tex-chip__label">{t(settings.locale, `floor.${pack.id}`)}</span>
                </button>
              );
            })}
          </div>
          <p className="muted dense-lead">{t(settings.locale, 'floor.grain')}</p>
          <div className="aw-shell-toggle" role="group" aria-label={t(settings.locale, 'floor.grain')}>
            <button
              type="button"
              className={`aw-shell-chip aw-pressable${asFloorGrain(settings.floorGrain) === 0 ? ' active' : ''}`}
              aria-pressed={asFloorGrain(settings.floorGrain) === 0}
              onClick={() => setSettings({ floorGrain: 0 })}
            >
              {t(settings.locale, 'floor.grain.across')}
            </button>
            <button
              type="button"
              className={`aw-shell-chip aw-pressable${asFloorGrain(settings.floorGrain) === 90 ? ' active' : ''}`}
              aria-pressed={asFloorGrain(settings.floorGrain) === 90}
              onClick={() => setSettings({ floorGrain: 90 })}
            >
              {t(settings.locale, 'floor.grain.along')}
            </button>
          </div>
          <button
            type="button"
            className="ghost-btn aw-pressable aw-tex-clear"
            style={{ marginTop: 8 }}
            onClick={() => {
              for (const r of floor.rooms ?? []) {
                if (r.kind !== 'outdoor') patchRoom(r.id, { floorFinishId: null });
              }
            }}
          >
            {t(settings.locale, 'floor.applyAll')}
          </button>
        </section>

        <label className="field">
          <span>Accent color</span>
          <input
            type="color"
            value={settings.accent}
            onChange={(e) => setSettings({ accent: e.target.value })}
          />
        </label>

        <section className="aw-scene3d" aria-labelledby="scene3d-title">
          <h3 id="scene3d-title">{t(settings.locale, 'scene.title')}</h3>
          <p className="muted dense-lead">{t(settings.locale, 'scene.lead')}</p>
          <div className="field field--dense">
            <span>{t(settings.locale, 'scene.sky')}</span>
            <div className="aw-shell-toggle" role="group" aria-label={t(settings.locale, 'scene.sky')}>
              {SKY_OPTIONS.map((opt) => {
                const on = asSky(settings.skyPreset) === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`aw-shell-chip aw-pressable${on ? ' active' : ''}`}
                    aria-pressed={on}
                    onClick={() => setSettings({ skyPreset: opt.id as SkyPreset })}
                  >
                    {t(settings.locale, `scene.sky.${opt.id}`)}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="field field--dense">
            <span>{t(settings.locale, 'scene.yard')}</span>
            <div className="aw-shell-toggle" role="group" aria-label={t(settings.locale, 'scene.yard')}>
              {SITE_OPTIONS.map((opt) => {
                const on = asSite(settings.siteFinish) === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`aw-shell-chip aw-pressable${on ? ' active' : ''}`}
                    aria-pressed={on}
                    onClick={() => setSettings({ siteFinish: opt.id as SiteFinish })}
                  >
                    {t(settings.locale, `scene.site.${opt.id}`)}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="field field--dense">
            <span>{t(settings.locale, 'scene.wall')}</span>
            <div className="aw-tint-grid" role="group" aria-label={t(settings.locale, 'scene.wall')}>
              {WALL_TINT_OPTIONS.map((opt) => {
                const on = asTint(settings.wallTintId) === opt.id;
                const sw = WALL_TINT[opt.id];
                return (
                  <button
                    key={opt.id}
                    type="button"
                    className={`aw-tint-chip aw-pressable${on ? ' active' : ''}`}
                    aria-pressed={on}
                    title={t(settings.locale, `scene.tint.${opt.id}`)}
                    onClick={() => setSettings({ wallTintId: opt.id as WallTintId })}
                  >
                    <span className="aw-tint-chip__swatch" style={{ background: sw.fill }} aria-hidden="true" />
                    <span>{t(settings.locale, `scene.tint.${opt.id}`)}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <label className="field check field--dense">
            <input
              type="checkbox"
              checked={asShowFurniture3d(settings.showFurniture3d)}
              onChange={(e) => setSettings({ showFurniture3d: e.target.checked })}
            />
            <span>{t(settings.locale, 'scene.furn')}</span>
          </label>
        </section>

        <p className="muted">Few settings on purpose. Grid stays visible; snap is easy to toggle.</p>
      </aside>
    </>
  );
}
