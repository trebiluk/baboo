import { useProjectStore } from '../store/useProjectStore';
import { APP_VERSION, CHANGELOG_ENTRIES } from '../data/changelog';

export function ChangelogModal() {
  const open = useProjectStore((s) => s.changelogOpen);
  const toggle = useProjectStore((s) => s.toggleChangelog);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={toggle}>
      <div
        className="panel-card changelog-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="changelog-title"
      >
        <div className="drawer-head">
          <h2 id="changelog-title">What's new · v{APP_VERSION}</h2>
          <button type="button" className="ghost-btn secondary-btn aw-pressable" onClick={toggle}>Close</button>
        </div>
        <p className="muted">Baboo keeps the grid big. Here's what changed.</p>
        {CHANGELOG_ENTRIES.map((n) => (
          <article key={n.version} className="change-block">
            <h3>{n.version} <span className="muted">{n.date}</span></h3>
            <ul>{n.bullets.map((i) => <li key={i}>{i}</li>)}</ul>
          </article>
        ))}
      </div>
    </div>
  );
}