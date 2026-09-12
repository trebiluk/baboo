import { judgeDogHouse, ribbonLabel, type ContestCheck, type ContestHit } from '../lib/contest';
import { BABOO_LOGO } from '../logo';
import { useProjectStore } from '../store/useProjectStore';
import { Icon } from '../icons';

function mark(status: ContestCheck['status']) {
  if (status === 'pass') return 'Baboo says yes';
  if (status === 'warn') return 'Almost';
  if (status === 'fail') return 'Not yet';
  return 'Start here';
}

function selectHit(hit: ContestHit) {
  const kind = hit.kind;
  useProjectStore.setState({ selected: { kind, id: hit.id } });
}

export function ContestDrawer() {
  const open = useProjectStore((s) => s.contestOpen);
  const toggle = useProjectStore((s) => s.toggleContest);
  const floor = useProjectStore((s) => s.doc.floors[0]);
  const units = useProjectStore((s) => s.doc.settings.units);
  const roofStyleId = useProjectStore((s) => s.doc.settings.roofStyleId);
  const exportJson = useProjectStore((s) => s.exportJson);
  const styleId = useProjectStore((s) => s.doc.settings.styleId);

  if (!open) return null;

  let report;
  try {
    report = judgeDogHouse(floor, { roofStyleId, units });
  } catch {
    report = {
      checks: [], pass: 0, warn: 0, fail: 0, skip: 0,
      score: 0, max: 100, ribbon: 'keep' as const, quote: 'Draw a little more and ask me again.',
    };
  }

  const ribbon = ribbonLabel(report.ribbon);
  const contesting = styleId === 'dog-house';

  return (
    <>
      <button
        type="button"
        className="teaching-backdrop"
        aria-label="Dismiss contest"
        onClick={toggle}
      />
      <aside className="drawer contest-drawer" role="dialog" aria-label="Best Dog House Contest">
        <div className="drawer-head">
          <div className="drawer-head-title">
            <span className="sheet-handle" aria-hidden="true" />
            <h2>Contest</h2>
          </div>
          <button type="button" className="ghost-btn secondary-btn aw-pressable" onClick={toggle}>
            Close
          </button>
        </div>

        <div className={`contest-score contest-score-${report.ribbon}`}>
          <img className="contest-score-mascot" src={BABOO_LOGO} alt="" width={48} height={48} />
          <div>
            <span className="contest-kicker">Baboo judges</span>
            <strong>{ribbon}</strong>
            <p>{report.quote}</p>
            <p className="contest-points">{report.score} / {report.max} textbook points</p>
          </div>
        </div>

        <p className="muted teach-hello">
          {contesting
            ? 'Best Dog House Contest — I pick the den that follows the book.'
            : 'Any plan can be judged as a dog house. New → Dog House starts the assignment.'}
        </p>

        <ul className="access-list">
          {report.checks.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className={`access-row access-${c.status} aw-pressable`}
                onClick={() => { if (c.hit) selectHit(c.hit); }}
                disabled={!c.hit}
              >
                <span className="access-mark">{mark(c.status)} · {c.points}/{c.max}</span>
                <strong>{c.title}</strong>
                <span>{c.detail}</span>
                <em>{c.tip}</em>
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="primary-btn aw-pressable"
          style={{ marginTop: 12 }}
          onClick={exportJson}
        >
          <Icon name="save" /> Save file for the board
        </button>
        <p className="muted access-legal">
          Baboo scores a snug closed den, dog-sized offset door, pitched roof, turning room,
          and summer shade. Classroom check from textbook shelter rules — not a kennel license.
        </p>
      </aside>
    </>
  );
}
