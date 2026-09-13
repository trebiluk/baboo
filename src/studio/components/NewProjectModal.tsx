import { STYLE_TEMPLATES } from '../data/templates';
import { useProjectStore } from '../store/useProjectStore';
import type { StyleId } from '../types';
import { DEFAULT_SKILL_LEVEL } from '../data/skill';
import { SkillPicker } from './SkillPicker';
import { roofDefaultForStyle, roofStyleName } from '../lib/roof';

export function NewProjectModal() {
  const open = useProjectStore((s) => s.newProjectOpen);
  const close = useProjectStore((s) => s.openNewProject);
  const start = useProjectStore((s) => s.newFromTemplate);
  const skillLevel = useProjectStore((s) => s.doc.settings.skillLevel) ?? DEFAULT_SKILL_LEVEL;
  const setSkillLevel = useProjectStore((s) => s.setSkillLevel);
  if (!open) return null;

  const dismiss = () => close(false);

  return (
    <div className="modal-backdrop" onClick={dismiss}>
      <div
        className="panel-card new-project-modal"
        role="dialog"
        aria-labelledby="new-plan-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-head">
          <h2 id="new-plan-title">Let's start a plan</h2>
          <button type="button" className="ghost-btn secondary-btn aw-pressable" onClick={dismiss}>
            Close
          </button>
        </div>
        <p className="muted">Pick a house to start from, or a blank grid. You can always start over.</p>
        <SkillPicker value={skillLevel} onChange={setSkillLevel} legend="How should I help?" />
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
                  {t.badge ? <span className="template-badge">{t.badge}</span> : null}
                </strong>
                <span>{t.blurb}</span>
                <em className="template-roof">Roof: {roofStyleName(roof)}</em>
              </button>
            );
          })}
        </div>
        <button type="button" className="ghost-btn secondary-btn aw-pressable" onClick={dismiss}>
          Cancel
        </button>
      </div>
    </div>
  );
}
