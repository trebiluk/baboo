import { useProjectStore } from '../store/useProjectStore';
import { APP_VERSION, CHANGELOG_ENTRIES } from '../data/changelog';
import { t, tipLoc } from '../data/i18n';

/** What's new bullets that have a translated line. The bullet text must match the English exactly. */
const NEWS_KEYS = ['news.tools2d', 'news.look3d', 'news.furn', 'news.view3d', 'news.words', 'news.save', 'news.line', 'news.fit', 'news.menu', 'news.close', 'news.decoders', 'news.konva', 'news.modelviewer'];

export function ChangelogModal() {
  const open = useProjectStore((s) => s.changelogOpen);
  const toggle = useProjectStore((s) => s.toggleChangelog);
  const locale = tipLoc(useProjectStore((s) => s.doc.settings));
  if (!open) return null;
  const localBullet = (line: string) => {
    const key = NEWS_KEYS.find((k) => t('en', k) === line);
    return key ? t(locale, key) : line;
  };
  return (
    <div className="modal-backdrop" onClick={toggle}>
      <div
        className="panel-card changelog-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="changelog-title"
      >
        <div className="drawer-head">
          <h2 id="changelog-title">{t(locale, 'chrome.whatsNew')} · v{APP_VERSION}</h2>
          <button type="button" className="ghost-btn secondary-btn aw-pressable" onClick={toggle}>{t(locale, 'chrome.close')}</button>
        </div>
        <p className="muted">{t(locale, 'news.lead')}</p>
        {CHANGELOG_ENTRIES.map((n) => (
          <article key={n.version} className="change-block">
            <h3>{n.version} <span className="muted">{n.date}</span></h3>
            <ul>{n.bullets.map((i) => <li key={i}>{localBullet(i)}</li>)}</ul>
          </article>
        ))}
      </div>
    </div>
  );
}