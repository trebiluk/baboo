import { SKILL_LEVELS, type SkillLevel } from '../data/skill';
import { t } from '../data/i18n';
import { useProjectStore } from '../store/useProjectStore';

export function SkillPicker({
  value,
  onChange,
  legend = 'Your level',
}: {
  value: SkillLevel;
  onChange: (level: SkillLevel) => void;
  legend?: string;
}) {
  const locale = useProjectStore((s) => s.doc.settings.locale);
  return (
    <fieldset className="skill-picker">
      <legend>{legend}</legend>
      <p className="muted skill-picker-lead">{t(locale, 'skill.lead')}</p>
      <div className="skill-grid" role="radiogroup" aria-label={legend}>
        {SKILL_LEVELS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={value === s.id}
            className={`skill-chip aw-pressable${value === s.id ? ' active' : ''}`}
            onClick={() => onChange(s.id)}
            title={s.help}
          >
            <strong>{t(locale, `skill.${s.id}`)}</strong>
            <span>{t(locale, `skill.${s.id}.blurb`)}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
