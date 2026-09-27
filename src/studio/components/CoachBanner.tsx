import { useState } from 'react';
import { DEFAULT_SKILL_LEVEL, currentJob, nextCoach, skillRank } from '../data/skill';
import { BABOO_LOGO } from '../logo';
import { useProjectStore } from '../store/useProjectStore';
import { t, tt, tipLoc } from '../data/i18n';

const COACH_OFF = 'baboo-coach-off';

function coachIsOff() {
  try { return localStorage.getItem(COACH_OFF) === '1'; } catch { return false; }
}

export function JobChip() {
  const floor = useProjectStore((s) => s.doc.floors[0]);
  const skillLevel = useProjectStore((s) => s.doc.settings.skillLevel) ?? DEFAULT_SKILL_LEVEL;
  const roofNamed = !!useProjectStore((s) => s.doc.settings.roofStyleId);
  const viewMode = useProjectStore((s) => s.viewMode);
  const demoRectangle = useProjectStore((s) => s.demoRectangle);
  const job = currentJob(skillLevel, floor, roofNamed);
  if (viewMode !== 'plan' || !job) return null;
  const showDemo = floor.walls.length < 3;
  return (
    <aside className="job-chip" role="status">
      <strong>Job</strong>
      <span>{job}</span>
      {showDemo ? (
        <button type="button" className="primary-btn aw-pressable" onClick={() => demoRectangle()}>
          Show me
        </button>
      ) : null}
    </aside>
  );
}

export function CoachBanner() {
  const floor = useProjectStore((s) => s.doc.floors[0]);
  const skillLevel = useProjectStore((s) => s.doc.settings.skillLevel) ?? DEFAULT_SKILL_LEVEL;
  const styleId = useProjectStore((s) => s.doc.settings.styleId);
  const roofNamed = !!useProjectStore((s) => s.doc.settings.roofStyleId);
  const locale = tipLoc(useProjectStore((s) => s.doc.settings));
  const setTool = useProjectStore((s) => s.setTool);
  const traceSketch = useProjectStore((s) => s.traceSketch);
  const setToolsPinned = useProjectStore((s) => s.setToolsPinned);
  const toggleTeaching = useProjectStore((s) => s.toggleTeaching);
  const toggleContest = useProjectStore((s) => s.toggleContest);
  const teachingOpen = useProjectStore((s) => s.teachingOpen);
  const contestOpen = useProjectStore((s) => s.contestOpen);
  const customizeOpen = useProjectStore((s) => s.customizeOpen);
  const helpOpen = useProjectStore((s) => s.helpOpen);
  const newProjectOpen = useProjectStore((s) => s.newProjectOpen);
  const selected = useProjectStore((s) => s.selected);
  const viewMode = useProjectStore((s) => s.viewMode);
  const [off, setOff] = useState(coachIsOff);

  const step = nextCoach(skillLevel, floor, styleId);
  const job = currentJob(skillLevel, floor, roofNamed);

  if (off) return null;
  if (viewMode !== 'plan') return null;
  if (job) return null;
  if (skillRank(skillLevel) > 1 && styleId !== 'dog-house') return null;
  if (teachingOpen || contestOpen || customizeOpen || helpOpen || newProjectOpen) return null;
  if (selected && selected.kind !== 'sketch') return null;
  if (!step) return null;

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
          {step.action === 'trace' ? (
            <button
              type="button"
              className="primary-btn aw-pressable"
              onClick={() => traceSketch()}
            >
              {t(locale, 'tool.trace')}
            </button>
          ) : step.tool ? (
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
            onClick={() => {
              try { localStorage.setItem(COACH_OFF, '1'); } catch { /* ignore */ }
              setOff(true);
            }}
          >
            {t(locale, 'coach.notNow')}
          </button>
        </div>
      </div>
    </aside>
  );
}
