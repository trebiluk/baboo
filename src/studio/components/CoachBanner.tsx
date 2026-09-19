import { useState } from 'react';
import { DEFAULT_SKILL_LEVEL, nextCoach, skillRank } from '../data/skill';
import { BABOO_LOGO } from '../logo';
import { useProjectStore } from '../store/useProjectStore';
import { t, tt, tipLoc } from '../data/i18n';
import { hasTaWhisper, nextTip, tipKey } from '../data/tips';
import type { Tool } from '../types';
import type { TipId } from '../data/tips';

/** Tips that put a tool in the student's hand. Everything else is read-and-go. */
const TIP_TOOL: Partial<Record<TipId, Tool>> = {
  'tip-welcome': 'wall',
  'tip-wall': 'wall',
  'tip-door': 'door',
};

/**
 * The tip card — chrome coach marks from CURRICULUM-TIP-PACK-EN-ES.md.
 *
 * One tip on screen, never a stack. The three wins (wall, door, Save file) run
 * in the same order every period; roof, 3D, Teach and Class card wait behind
 * them unless a TA is driving. The dog-house contest keeps its own ladder.
 */
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
  const showTips = useProjectStore((s) => s.showTips);
  const tipsDone = useProjectStore((s) => s.tipsDone);
  const tipPending = useProjectStore((s) => s.tipPending);
  const savedFile = useProjectStore((s) => s.savedFile);
  const taAssist = useProjectStore((s) => s.taAssist);
  const markTipDone = useProjectStore((s) => s.markTipDone);
  const [denDone, setDenDone] = useState<string | null>(null);

  const den = styleId === 'dog-house';
  const denStep = den ? nextCoach(skillLevel, floor, styleId) : null;
  const tipId = den
    ? null
    : nextTip({
      showTips,
      progress: {
        walls: floor.walls.length,
        doors: floor.openings.filter((o) => o.type === 'door').length,
        savedFile,
        drewSomething: floor.walls.length > 0 || (floor.sketches ?? []).length > 0,
      },
      done: tipsDone,
      pending: tipPending,
      taAssist,
    });

  if (!showTips) return null;
  if (skillRank(skillLevel) > 1 && !den && !taAssist) return null;
  if (teachingOpen || contestOpen || customizeOpen || helpOpen || newProjectOpen) return null;
  if (selected) return null;
  if (den && (!denStep || denDone === denStep.id)) return null;
  if (!den && !tipId) return null;

  const key = tipId ? tipKey(tipId) : '';
  const title = denStep
    ? tt(locale, `coach.den.${denStep.id}.title`, denStep.title)
    : t(locale, `${key}.title`);
  const body = denStep
    ? tt(locale, `coach.den.${denStep.id}.body`, denStep.body)
    : t(locale, `${key}.body`);
  const tool = denStep ? denStep.tool : tipId ? TIP_TOOL[tipId] : undefined;
  const onContest = denStep?.panel === 'contest' ? toggleContest : undefined;
  const onTeach = tipId === 'tip-teach' ? toggleTeaching : undefined;
  const whisper = tipId && taAssist && hasTaWhisper(tipId)
    ? t(locale, `tip.whisper.${tipId.slice('tip-'.length)}`)
    : null;
  const dismiss = denStep
    ? () => setDenDone(denStep.id)
    : () => markTipDone(tipId!);

  return (
    <aside className="coach-card" role="status" aria-label={t(locale, 'coach.kicker')}>
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
        {whisper ? (
          <p className="coach-whisper">
            <span className="coach-whisper-kicker">{t(locale, 'tip.whisper.kicker')}</span>
            {whisper}
          </p>
        ) : null}
        <div className="coach-card-actions">
          {tool ? (
            <button
              type="button"
              className="primary-btn aw-pressable"
              onClick={() => {
                setToolsPinned(true);
                setTool(tool);
              }}
            >
              {t(locale, 'coach.showMe')}
            </button>
          ) : onContest ? (
            <button type="button" className="primary-btn aw-pressable" onClick={onContest}>
              {t(locale, 'coach.askBaboo')}
            </button>
          ) : onTeach ? (
            <button type="button" className="ghost-btn aw-pressable" onClick={onTeach}>
              {t(locale, 'coach.openTeach')}
            </button>
          ) : null}
          <button
            type="button"
            className="ghost-btn secondary-btn aw-pressable"
            onClick={dismiss}
          >
            {t(locale, taAssist ? 'tip.next' : 'tip.gotIt')}
          </button>
        </div>
        {taAssist ? <p className="coach-ta-label">{t(locale, 'tip.ta.label')}</p> : null}
      </div>
    </aside>
  );
}
