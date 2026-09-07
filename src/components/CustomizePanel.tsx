import { useRef, useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { ROOF_STYLE_OPTIONS, roofStyleName } from '../lib/roof';
import { TEXTURE_PACKS, textureName } from '../data/textures';
import type { GuiThemeId, RoofStyleId, TypologyShell } from '../types';
import { THEME_OPTIONS } from '../data/themes';
import { GalleryCardPreview } from './GalleryCardPreview';

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
  const [showGallery, setShowGallery] = useState(false);
  const [importBusy, setImportBusy] = useState(false);

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
    <div className="modal-backdrop" onClick={toggle}>
      <div
        className="panel-card customize-panel aw-sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="customize-title"
      >
        <div className="drawer-head">
          <h2 id="customize-title">Settings</h2>
          <button type="button" className="ghost-btn secondary-btn aw-pressable" onClick={toggle}>
            Close
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
            {THEME_OPTIONS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} — {t.blurb}
              </option>
            ))}
          </select>
        </label>

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

        <label className="field">
          <span>Accent color</span>
          <input
            type="color"
            value={settings.accent}
            onChange={(e) => setSettings({ accent: e.target.value })}
          />
        </label>

        <div className="aw-gallery-preview-block">
          <button
            type="button"
            className="ghost-btn aw-pressable"
            aria-expanded={showGallery}
            onClick={() => setShowGallery((v) => !v)}
          >
            {showGallery ? 'Hide gallery preview' : 'Gallery preview'}
          </button>
          {showGallery ? <GalleryCardPreview compact /> : null}
        </div>

        <p className="muted">Few settings on purpose. Grid stays visible; snap is easy to toggle.</p>
      </div>
    </div>
  );
}
