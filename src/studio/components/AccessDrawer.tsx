import { runAccessCheck, type AccessCheck, type AccessHit } from '../lib/access';
import { useProjectStore } from '../store/useProjectStore';
import { t, tipLoc } from '../data/i18n';
import { useEscape } from '../hooks/useEscape';

function mark(locale: Parameters<typeof t>[0], status: AccessCheck['status']) {
  return t(locale, `teach.read.${status}`);
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
  const locale = tipLoc(useProjectStore((s) => s.doc.settings));

  useEscape(open, () => toggle());
  if (!open) return null;

  let report;
  try {
    report = runAccessCheck(floor, units, locale);
  } catch {
    report = { checks: [], pass: 0, warn: 0, fail: 0, skip: 0 };
  }
  const headline = report.fail
    ? report.fail === 1 ? t(locale, 'acc.head.fail1') : t(locale, 'acc.head.fail', { n: String(report.fail) })
    : report.warn
      ? report.warn === 1 ? t(locale, 'acc.head.warn1') : t(locale, 'acc.head.warn', { n: String(report.warn) })
      : report.pass
        ? t(locale, 'acc.head.good')
        : t(locale, 'acc.head.more');

  return (
    <>
      <button
        type="button"
        className="teaching-backdrop"
        aria-label={t(locale, 'chrome.close')}
        onClick={toggle}
      />
      <aside className="drawer access-drawer" role="dialog" aria-label={t(locale, 'a11y.access')}>
        <div className="drawer-head">
          <div className="drawer-head-title">
            <span className="sheet-handle" aria-hidden="true" />
            <h2>{t(locale, 'chrome.access')}</h2>
          </div>
          <button type="button" className="ghost-btn secondary-btn aw-pressable" onClick={toggle}>
            {t(locale, 'chrome.close')}
          </button>
        </div>
        <p className="muted teach-hello">{headline}. {t(locale, 'acc.disclaimer')}</p>
        <ul className="access-list">
          {report.checks.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className={`access-row access-${c.status} aw-pressable`}
                onClick={() => { if (c.hit) selectHit(c.hit); }}
                disabled={!c.hit}
              >
                <span className="access-mark">{mark(locale, c.status)}</span>
                <strong>{c.title}</strong>
                <span>{c.detail}</span>
                <em>{c.tip}</em>
              </button>
            </li>
          ))}
        </ul>
        <p className="muted access-legal">{t(locale, 'acc.legal')}</p>
      </aside>
    </>
  );
}
