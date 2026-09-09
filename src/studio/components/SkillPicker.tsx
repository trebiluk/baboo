import { SKILL_LEVELS, type SkillLevel } from '../data/skill';

export function SkillPicker({
  value,
  onChange,
  legend = 'Your level',
}: {
  value: SkillLevel;
  onChange: (level: SkillLevel) => void;
  legend?: string;
}) {
  return (
    <fieldset className="skill-picker">
      <legend>{legend}</legend>
      <p className="muted skill-picker-lead">
        Lower levels get extra help. Higher levels unlock more tools. You can change this any time.
      </p>
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
            <strong>{s.label}</strong>
            <span>{s.blurb}</span>
          </button>
        ))}
      </div>
    </fieldset>
  );
}
