import { runAccessCheck, type AccessCheck, type AccessHit } from '../lib/access';
import { useProjectStore } from '../store/useProjectStore';

function mark(status: AccessCheck['status']) {
  if (status === 'pass') return 'Looks good';
  if (status === 'warn') return 'Take a look';
  if (status === 'fail') return 'Needs a fix';
  return 'Not yet';
}

function selectHit(hit: AccessHit) {
  const kind =
    hit.kind === 'opening' ? 'opening'
      : hit.kind === 'room' ? 'room'
        : hit.kind === 'furniture' ? 'furniture'
          : 'wall';
  useProjectStore.setState({ selected: { kind, id: hit.id } });
}

export function AccessDrawer() {
  const open = useProjectStore((s) => s.accessOpen);
  const toggle = useProjectStore((s) => s.toggleAccess);
  const floor = useProjectStore((s) => s.doc.floors[0]);
  const units = useProjectStore((s) => s.doc.settings.units);

  if (!open) return null;

  let report;
  try {
    report = runAccessCheck(floor, units);
  } catch {
    report = { checks: [], pass: 0, warn: 0, fail: 0, skip: 0 };
  }
  const headline = report.fail
    ? `${report.fail} thing${report.fail === 1 ? '' : 's'} to fix`
    : report.warn
      ? `${report.warn} thing${report.warn === 1 ? '' : 's'} to look at`
      : report.pass
        ? 'This plan is being kind to more people'
        : 'Draw a little more and we’ll check again';

  return (
    <>
      <button
        type="button"
        className="teaching-backdrop"
        aria-label="Dismiss access check"
        onClick={toggle}
      />
      <aside className="drawer access-drawer" role="dialog" aria-label="Access check">
        <div className="drawer-head">
          <div className="drawer-head-title">
            <span className="sheet-handle" aria-hidden="true" />
            <h2>Access</h2>
          </div>
          <button type="button" className="ghost-btn secondary-btn aw-pressable" onClick={toggle}>
            Close
          </button>
        </div>
        <p className="muted teach-hello">{headline}. Classroom check — not a legal stamp.</p>
        <ul className="access-list">
          {report.checks.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className={`access-row access-${c.status} aw-pressable`}
                onClick={() => { if (c.hit) selectHit(c.hit); }}
                disabled={!c.hit}
              >
                <span className="access-mark">{mark(c.status)}</span>
                <strong>{c.title}</strong>
                <span>{c.detail}</span>
                <em>{c.tip}</em>
              </button>
            </li>
          ))}
        </ul>
        <p className="muted access-legal">
          Baboo checks door width (32"), halls (36"), bath turning circles (5'), kitchen aisles (40"),
          and whether furniture sits in a door swing. Real ADA is bigger than this list — talk with
          your teacher.
        </p>
      </aside>
    </>
  );
}
