import { useEffect, useRef, useState } from 'react';
import { DEFAULT_SKILL_LEVEL, currentJob, gradeBoxJob, nextCoach, skillRank } from '../data/skill';
import { BABOO_LOGO } from '../logo';
import { useProjectStore } from '../store/useProjectStore';
import { t, tt, tipLoc } from '../data/i18n';
import { APP_VERSION } from '../version';

const COACH_OFF = 'baboo-coach-off';
const JOB_LINE = 'Draw a 16 by 24 box. Put a door on the long wall.';
const JOB_START_EN = 'Start the job';
const RECORDED = 'baboo-job-16x24';

function coachIsOff() {
  try { return localStorage.getItem(COACH_OFF) === '1'; } catch { return false; }
}

type WhoRecord = (row: Record<string, unknown>) => unknown;

function whoRecord(): WhoRecord | null {
  const who = (window as unknown as { KulibertWho?: { record?: WhoRecord } }).KulibertWho;
  return who && typeof who.record === 'function' ? who.record : null;
}

export function JobChip() {
  const floor = useProjectStore((s) => s.doc.floors[0]);
  const skillLevel = useProjectStore((s) => s.doc.settings.skillLevel) ?? DEFAULT_SKILL_LEVEL;
  const locale = tipLoc(useProjectStore((s) => s.doc.settings));
  const viewMode = useProjectStore((s) => s.viewMode);
  const setTool = useProjectStore((s) => s.setTool);
  const setViewMode = useProjectStore((s) => s.setViewMode);
  const toggleHelp = useProjectStore((s) => s.toggleHelp);
  const showToast = useProjectStore((s) => s.showToast);
  const started = useRef(Date.now());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try { setSaved(sessionStorage.getItem(RECORDED) === '1'); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!floor || viewMode !== 'plan' || skillRank(skillLevel) > 1) return;
    let stop = false;
    const trySave = () => {
      if (stop) return;
      let already = false;
      try { already = sessionStorage.getItem(RECORDED) === '1'; } catch { /* ignore */ }
      if (already) { setSaved(true); return; }
      const grade = gradeBoxJob(floor);
      if (grade.score < 3) return;
      const record = whoRecord();
      if (!record) return;
      const row = record({
        app: 'baboo',
        version: `v${APP_VERSION}`,
        event: 'job',
        level: 'job-16x24',
        score: grade.score,
        max: 3,
        stars: grade.stars,
        xp: 10,
        skill: 'drafting',
        ms: Math.max(0, Date.now() - started.current),
      });
      if (!row) return;
      try { sessionStorage.setItem(RECORDED, '1'); } catch { /* ignore */ }
      setSaved(true);
      const bar = (window as unknown as { KulibertBar?: { toast?: (text: string) => void } }).KulibertBar;
      const savedLine = t(useProjectStore.getState().doc.settings.locale, 'job.saved');
      if (bar && typeof bar.toast === 'function') bar.toast(savedLine);
      else showToast(savedLine, 4000, 'ok');
    };
    trySave();
    const timer = window.setInterval(trySave, 700);
    window.addEventListener('message', trySave);
    return () => {
      stop = true;
      window.clearInterval(timer);
      window.removeEventListener('message', trySave);
    };
  }, [floor, skillLevel, viewMode, showToast]);

  if (viewMode !== 'plan' || skillRank(skillLevel) > 1) return null;

  return (
    <aside className="job-chip" role="status" aria-label="Job">
      <p>{saved ? t(locale, 'job.saved') : tt(locale, 'job.line', JOB_LINE)}</p>
      <button
        type="button"
        className="primary-btn aw-pressable job-start"
        onClick={() => { started.current = Date.now(); setViewMode('plan'); setTool('wall'); }}
      >
        {tt(locale, 'job.start', JOB_START_EN)}
      </button>
      <button
        type="button"
        id="baboo-help"
        className="ghost-btn aw-pressable job-help"
        aria-label="Show me"
        title="Show me"
        onClick={toggleHelp}
      >
        ?
      </button>
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
  if (skillRank(skillLevel) <= 1 && styleId !== 'dog-house') return null;
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
