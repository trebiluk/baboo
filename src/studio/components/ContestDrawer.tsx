import { judgeDogHouse, type ContestCheck, type ContestHit, type ContestRibbon } from '../lib/contest';
import { BABOO_LOGO } from '../logo';
import { useProjectStore } from '../store/useProjectStore';
import { Icon } from '../icons';
import { t, tt, asLocale } from '../data/i18n';
import type { Locale } from '../types';

function mark(status: ContestCheck['status'], locale: Locale) {
  return t(locale, `contest.mark.${status}`);
}

function contestQuote(ribbon: ContestRibbon, fail: number, locale: Locale) {
  if (ribbon === 'best') return t(locale, 'contest.quote.best');
  if (ribbon === 'blue') return t(locale, 'contest.quote.blue');
  if (ribbon === 'red') return t(locale, 'contest.quote.red');
  if (ribbon === 'honor' || fail > 0) return t(locale, 'contest.quote.honor');
  return t(locale, 'contest.quote.keep');
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
  const locale = asLocale(useProjectStore((s) => s.doc.settings.locale));

  if (!open) return null;

  let report;
  try {
    report = judgeDogHouse(floor, { roofStyleId, units });
  } catch {
    report = {
      checks: [], pass: 0, warn: 0, fail: 0, skip: 0,
      score: 0, max: 100, ribbon: 'keep' as const, quote: t(locale, 'contest.quote.keep'),
    };
  }

  const ribbon = t(locale, `contest.ribbon.${report.ribbon}`);
  const contesting = styleId === 'dog-house';

  return (
    <>
      <button
        type="button"
        className="teaching-backdrop"
        aria-label={t(locale, 'contest.dismiss')}
        onClick={toggle}
      />
      <aside className="drawer contest-drawer" role="dialog" aria-label={t(locale, 'contest.aria')}>
        <div className="drawer-head">
          <div className="drawer-head-title">
            <span className="sheet-handle" aria-hidden="true" />
            <h2>{t(locale, 'contest.title')}</h2>
          </div>
          <button type="button" className="ghost-btn secondary-btn aw-pressable" onClick={toggle}>
            {t(locale, 'chrome.close')}
          </button>
        </div>

        <div className={`contest-score contest-score-${report.ribbon}`}>
          <img className="contest-score-mascot" src={BABOO_LOGO} alt="" width={48} height={48} />
          <div>
            <span className="contest-kicker">{t(locale, 'contest.kicker')}</span>
            <strong>{ribbon}</strong>
            <p>{contestQuote(report.ribbon, report.fail, locale)}</p>
            <p className="contest-points">{t(locale, 'contest.points', { score: String(report.score), max: String(report.max) })}</p>
          </div>
        </div>

        <p className="muted teach-hello">
          {contesting ? t(locale, 'contest.hello') : t(locale, 'contest.helloAny')}
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
                <span className="access-mark">{mark(c.status, locale)} · {c.points}/{c.max}</span>
                <strong>{tt(locale, `contest.check.${c.id}.title`, c.title)}</strong>
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
          <Icon name="save" /> {t(locale, 'contest.save')}
        </button>
        <p className="muted access-legal">
          {t(locale, 'contest.legal')}
        </p>
      </aside>
    </>
  );
}
