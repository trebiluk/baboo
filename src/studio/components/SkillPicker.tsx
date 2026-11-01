import { SKILL_LEVELS, toolsForLevel, upcomingTools, type SkillLevel } from '../data/skill';
import type { Tool } from '../types';
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
            title={t(locale, `skill.help.${s.id}`)}
          >
            <strong>{t(locale, `skill.${s.id}`)}</strong>
            <span>{t(locale, `skill.${s.id}.blurb`)}</span>
          </button>
        ))}
      </div>
      {/* What this level gives, in words a kid can see on a Chromebook (the old help was a hover tooltip) (2.13.21). */}
      <div className="skill-what" aria-live="polite">
        <p className="skill-help">{t(locale, `skill.help.${value}`)}</p>
        <p className="muted"><strong>{t(locale, 'skill.uses')}:</strong> {toolsForLevel(value).map((x) => toolName(locale, x)).join(' · ')}</p>
        <p className="muted">
          {upcomingTools(value).length
            ? <><strong>{t(locale, 'skill.next')}:</strong> {upcomingTools(value).map((x) => toolName(locale, x)).join(' · ')}</>
            : nextLevel(value)
              ? <><strong>{t(locale, 'skill.next')}:</strong> {t(locale, `skill.help.${nextLevel(value)}`)}</>
              : t(locale, 'skill.all')}
        </p>
      </div>
    </fieldset>
  );
}

function toolName(locale: Parameters<typeof t>[0], tool: Tool): string {
  // tool keys carry an English gloss in brackets for class words; the list reads cleaner without it
  const key = tool === 'furniture' ? 'furn.title' : `tool.${tool}`;
  return t(locale, key).replace(/\s*\([^)]*\)\s*$/, '');
}

function nextLevel(level: SkillLevel): SkillLevel | null {
  const i = SKILL_LEVELS.findIndex((x) => x.id === level);
  return i >= 0 && i < SKILL_LEVELS.length - 1 ? SKILL_LEVELS[i + 1].id : null;
}
