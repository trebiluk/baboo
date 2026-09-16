import { STYLE_TEMPLATES } from '../data/templates';
import { useProjectStore } from '../store/useProjectStore';
import type { StyleId } from '../types';
import { DEFAULT_SKILL_LEVEL } from '../data/skill';
import { SkillPicker } from './SkillPicker';
import { roofDefaultForStyle, roofStyleName } from '../lib/roof';
import { t } from '../data/i18n';

export function NewProjectModal() {
  const open = useProjectStore((s) => s.newProjectOpen);
  const close = useProjectStore((s) => s.openNewProject);
  const start = useProjectStore((s) => s.newFromTemplate);
  const skillLevel = useProjectStore((s) => s.doc.settings.skillLevel) ?? DEFAULT_SKILL_LEVEL;
  const locale = useProjectStore((s) => s.doc.settings.locale);
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
          <h2 id="new-plan-title">{t(locale, 'new.title')}</h2>
          <button type="button" className="ghost-btn secondary-btn aw-pressable" onClick={dismiss}>
            {t(locale, 'chrome.close')}
          </button>
        </div>
        <p className="muted">{t(locale, 'new.lead')}</p>
        <SkillPicker value={skillLevel} onChange={setSkillLevel} legend={t(locale, 'new.help')} />
        <div className="template-grid">
          {STYLE_TEMPLATES.map((tpl) => {
            const roof = roofDefaultForStyle(tpl.id);
            return (
              <button
                key={tpl.id}
                type="button"
                className="template-card aw-pressable"
                onClick={() => start(tpl.id as StyleId)}
              >
                <strong>
                  {tpl.name}
                  {tpl.badge ? <span className="template-badge">{tpl.badge}</span> : null}
                </strong>
                <span>{tpl.blurb}</span>
                <em className="template-roof">Roof: {roofStyleName(roof)}</em>
              </button>
            );
          })}
        </div>
        <button type="button" className="ghost-btn secondary-btn aw-pressable" onClick={dismiss}>
          {t(locale, 'new.cancel')}
        </button>
      </div>
    </div>
  );
}
