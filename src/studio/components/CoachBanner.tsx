import { useState } from 'react';
import { DEFAULT_SKILL_LEVEL, nextCoach, skillRank } from '../data/skill';
import { BABOO_LOGO } from '../logo';
import { useProjectStore } from '../store/useProjectStore';
import { t, tt, tipLoc } from '../data/i18n';

export function CoachBanner() {
  const floor = useProjectStore((s) => s.doc.floors[0]);
  const skillLevel = useProjectStore((s) => s.doc.settings.skillLevel) ?? DEFAULT_SKILL_LEVEL;
  const styleId = useProjectStore((s) => s.doc.settings.styleId);
  const locale = tipLoc(useProjectStore((s) => s.doc.settings));
  const setTool = useProjectStore((s) => s.setTool);
  const setToolsPinned = useProjectStore((s) => s.setToolsPinned);
  const toggleTeaching = useProjectStore((s) => s.toggleTeaching);
  const toggleContest = useProjectStore((s) => s.toggleContest);
  const teachingOpen = useProjectStore((s) => s.teachingOpen);
  const contestOpen = useProjectStore((s) => s.contestOpen);
  const customizeOpen = useProjectStore((s) => s.customizeOpen);
  const helpOpen = useProjectStore((s) => s.helpOpen);
  const newProjectOpen = useProjectStore((s) => s.newProjectOpen);
  const selected = useProjectStore((s) => s.selected);
  const [dismissed, setDismissed] = useState<string | null>(null);

  const step = nextCoach(skillLevel, floor, styleId);

  if (skillRank(skillLevel) > 1 && styleId !== 'dog-house') return null;
  if (teachingOpen || contestOpen || customizeOpen || helpOpen || newProjectOpen) return null;
  if (selected) return null;
  if (!step || dismissed === step.id) return null;

  const prefix = styleId === 'dog-house' ? `coach.den.${step.id}` : `coach.${step.id}`;
  const title = tt(locale, `${prefix}.title`, step.title);
  const body = tt(locale, `${prefix}.body`, step.body);

  return (
    <aside className="coach-card" role="status" aria-label="Next step">
      <img
        className="coach-mascot"
        src={BABOO_LOGO}
        alt=""
        width={40}
        height={40}
        decoding="async"
      />
      <div className="coach-card-body">
        <span className="coach-kicker">{t(locale, 'coach.kicker')}</span>
        <strong>{title}</strong>
        <p>{body}</p>
        <div className="coach-card-actions">
          {step.tool ? (
            <button
              type="button"
              className="primary-btn aw-pressable"
              onClick={() => {
                setToolsPinned(true);
                setTool(step.tool!);
              }}
            >
              {t(locale, 'coach.showMe')}
            </button>
          ) : step.panel === 'contest' ? (
            <button
              type="button"
              className="primary-btn aw-pressable"
              onClick={toggleContest}
            >
              {t(locale, 'coach.askBaboo')}
            </button>
          ) : (
            <button
              type="button"
              className="ghost-btn aw-pressable"
              onClick={toggleTeaching}
            >
              {t(locale, 'coach.openTeach')}
            </button>
          )}
          <button
            type="button"
            className="ghost-btn secondary-btn aw-pressable"
            onClick={() => setDismissed(step.id)}
          >
            {t(locale, 'coach.notNow')}
          </button>
        </div>
      </div>
    </aside>
  );
}
