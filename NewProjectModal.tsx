import { STYLE_TEMPLATES } from '../data/templates';
import { useProjectStore } from '../store/useProjectStore';
import type { StyleId } from '../types';
import { roofDefaultForStyle, roofStyleName } from '../lib/roof';

export function NewProjectModal() {
  const open = useProjectStore((s) => s.newProjectOpen);
  const close = useProjectStore((s) => s.openNewProject);
  const start = useProjectStore((s) => s.newFromTemplate);
  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="panel-card new-project-modal" role="dialog" aria-label="New project">
        <h2>New project</h2>
        <p className="muted">Pick a style starter or blank. Roofs auto-generate from the style — you still name them.</p>
        <div className="template-grid">
          {STYLE_TEMPLATES.map((t) => {
            const roof = roofDefaultForStyle(t.id);
            return (
              <button
                key={t.id}
                type="button"
                className="template-card aw-pressable"
                onClick={() => start(t.id as StyleId)}
              >
                <strong>
                  {t.name}
                  {t.badge ? <span className="save-chip" style={{ marginLeft: 6, fontSize: 11 }}>{t.badge}</span> : null}
                </strong>
                <span>{t.blurb}</span>
                <em className="muted" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
                  Roof: {roofStyleName(roof)}
                </em>
              </button>
            );
          })}
        </div>
        <button type="button" className="ghost-btn secondary-btn aw-pressable" onClick={() => close(false)}>Cancel</button>
      </div>
    </div>
  );
}
