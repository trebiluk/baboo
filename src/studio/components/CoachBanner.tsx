import { useState } from 'react';
import { DEFAULT_SKILL_LEVEL, nextCoach, skillRank } from '../data/skill';
import { BABOO_LOGO } from '../logo';
import { useProjectStore } from '../store/useProjectStore';

export function CoachBanner() {
  const floor = useProjectStore((s) => s.doc.floors[0]);
  const skillLevel = useProjectStore((s) => s.doc.settings.skillLevel) ?? DEFAULT_SKILL_LEVEL;
  const styleId = useProjectStore((s) => s.doc.settings.styleId);
  const setTool = useProjectStore((s) => s.setTool);
  const setToolsPinned = useProjectStore((s) => s.setToolsPinned);
  const toggleTeaching = useProjectStore((s) => s.toggleTeaching);
  const toggleContest = useProjectStore((s) => s.toggleContest);
  const teachingOpen = useProjectStore((s) => s.teachingOpen);
  const contestOpen = useProjectStore((s) => s.contestOpen);
  const customizeOpen = useProjectStore((s) => s.customizeOpen);
  const helpOpen = useProjectStore((s) => s.helpOpen);
  const newProjectOpen = useProjectStore((s) => s.newProjectOpen);
  const [dismissed, setDismissed] = useState<string | null>(null);

  const step = nextCoach(skillLevel, floor, styleId);

  if (skillRank(skillLevel) > 1 && styleId !== 'dog-house') return null;
  if (teachingOpen || contestOpen || customizeOpen || helpOpen || newProjectOpen) return null;
  if (!step || dismissed === step.id) return null;

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
        <span className="coach-kicker">Baboo</span>
        <strong>{step.title}</strong>
        <p>{step.body}</p>
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
              Show me
            </button>
          ) : step.panel === 'contest' ? (
            <button
              type="button"
              className="primary-btn aw-pressable"
              onClick={toggleContest}
            >
              Ask Baboo
            </button>
          ) : (
            <button
              type="button"
              className="ghost-btn aw-pressable"
              onClick={toggleTeaching}
            >
              Open Teach
            </button>
          )}
          <button
            type="button"
            className="ghost-btn secondary-btn aw-pressable"
            onClick={() => setDismissed(step.id)}
          >
            Not now
          </button>
        </div>
      </div>
    </aside>
  );
}
