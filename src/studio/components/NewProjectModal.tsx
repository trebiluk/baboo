import { STYLE_TEMPLATES } from '../data/templates';
import { useProjectStore } from '../store/useProjectStore';
import type { StyleId } from '../types';
import { DEFAULT_SKILL_LEVEL } from '../data/skill';
import { SkillPicker } from './SkillPicker';
import { roofDefaultForStyle } from '../lib/roof';
import { t, roofWord } from '../data/i18n';
import { usePhoneChrome } from '../hooks/usePhoneChrome';
import { useEscape } from '../hooks/useEscape';

export function NewProjectModal() {
  const open = useProjectStore((s) => s.newProjectOpen);
  const close = useProjectStore((s) => s.openNewProject);
  const start = useProjectStore((s) => s.newFromTemplate);
  const skillLevel = useProjectStore((s) => s.doc.settings.skillLevel) ?? DEFAULT_SKILL_LEVEL;
  const locale = useProjectStore((s) => s.doc.settings.locale);
  const setSkillLevel = useProjectStore((s) => s.setSkillLevel);
  const phone = usePhoneChrome();
  useEscape(open, () => close(false));
  if (!open) return null;

  const dismiss = () => close(false);
  const card = (tpl: (typeof STYLE_TEMPLATES)[number]) => {
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
        <span>{t(locale, `tpl.${tpl.id}`)}</span>
        <em className="template-roof">{t(locale, 'chip.roof')}: {roof ? roofWord(roof, locale) : t(locale, 'chip.roofNone')}</em>
      </button>
    );
  };

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
        {/* On a phone the houses come first; the help level folds into one line you can open (2.13.45). */}
        {phone ? (
          <details className="new-skill-fold">
            <summary>{t(locale, 'new.help')} · <strong>{t(locale, `skill.${skillLevel}`)}</strong></summary>
            <SkillPicker value={skillLevel} onChange={setSkillLevel} legend={t(locale, 'new.help')} />
          </details>
        ) : (
          <SkillPicker value={skillLevel} onChange={setSkillLevel} legend={t(locale, 'new.help')} />
        )}
        {/* 2.13.83: houses first; contests and the Mansion get their own section below, in one scroll. */}
        <div className="template-scroll">
          <div className="template-grid">{STYLE_TEMPLATES.filter((tpl) => !tpl.group).map(card)}</div>
          <h3 className="template-section-head" id="new-more-head">{t(locale, 'new.moreHead')}</h3>
          <div className="template-grid" role="group" aria-labelledby="new-more-head">
            {STYLE_TEMPLATES.filter((tpl) => tpl.group === 'more').map(card)}
          </div>
        </div>
        <button type="button" className="ghost-btn secondary-btn aw-pressable" onClick={dismiss}>
          {t(locale, 'new.cancel')}
        </button>
      </div>
    </div>
  );
}
