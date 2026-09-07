import { useEffect } from 'react';
import { UNIT_1, CHALLENGES, VOCAB, REFLECTION_PROMPTS, UTILITY_CHECKLIST } from '../data/teaching';
import { STYLE_TEMPLATES } from '../data/templates';
import { useProjectStore } from '../store/useProjectStore';
import { exteriorFloorAreaSqFt, roofStyleName } from '../lib/roof';
import { FURNITURE_CATALOG } from '../data/furniture';

export function TeachingDrawer() {
  const open = useProjectStore((s) => s.teachingOpen);
  const toggle = useProjectStore((s) => s.toggleTeaching);
  const doc = useProjectStore((s) => s.doc);
  const styleId = doc.settings.styleId;
  const style = STYLE_TEMPLATES.find((t) => t.id === styleId);
  const floor = doc.floors[0];
  const area = exteriorFloorAreaSqFt(floor.nodes, floor.walls);
  const roofName = (doc.settings.roofLabel?.trim() || roofStyleName(doc.settings.roofStyleId));

  const catalogIds = new Set(floor.furniture.map((f) => f.catalogId));
  const hasUtility = (ids: string[]) => ids.some((id) => catalogIds.has(id));

  // Body scroll lock only while Teaching sheet is open (phone overlay).
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.classList.add('aw-teaching-open');
    body.classList.add('aw-teaching-open');
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      html.classList.remove('aw-teaching-open');
      body.classList.remove('aw-teaching-open');
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, toggle]);

  if (!open) {
    return (
      <button type="button" className="teach-tab aw-pressable" onClick={toggle}>
        Teach
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        className="teaching-backdrop"
        aria-label="Dismiss teaching"
        onClick={toggle}
      />
      <aside className="drawer teaching-drawer" role="dialog" aria-modal="true" aria-label="Teaching">
        <div className="drawer-head">
          <div className="drawer-head-title">
            <span className="sheet-handle" aria-hidden="true" />
            <h2>Teaching</h2>
          </div>
          <button type="button" className="ghost-btn aw-pressable" onClick={toggle}>
            Close
          </button>
        </div>

        <div className="teaching-drawer-body">
          <section>
            <h3>Plan readout</h3>
            <p>
              Approx. floor area:{' '}
              <strong>{area != null ? `${area} sq ft` : '— (draw exterior walls)'}</strong>
            </p>
            <p>
              Roof on this plan: <strong>{roofName}</strong>
              {doc.settings.roofStyleId ? ' — can you name it without looking?' : ' — pick one in Settings'}
            </p>
          </section>

          <section>
            <h3>{UNIT_1.title}</h3>
            <p>{UNIT_1.goal}</p>
            <ol>
              {UNIT_1.steps.map((s) => <li key={s}>{s}</li>)}
            </ol>
            <p className="done-like"><strong>Done looks like:</strong> {UNIT_1.doneLooksLike}</p>
          </section>

          {style && style.id !== 'blank' && (
            <section className="style-term">
              <h3>Style term</h3>
              <p><strong>{style.name}</strong> — {style.blurb}</p>
              {style.badge && <p><em>{style.badge} assignment linked</em></p>}
            </section>
          )}

          <section>
            <h3>Build reflections</h3>
            {REFLECTION_PROMPTS.map((r) => (
              <article key={r.id} className="challenge-card">
                <h4>{r.title}</h4>
                <p className="teach-multiline">{r.prompt}</p>
              </article>
            ))}
          </section>

          <section>
            <h3>Utility + storage checklist</h3>
            <p className="muted">Every student project needs common-sense spaces.</p>
            <ul>
              {UTILITY_CHECKLIST.map((u) => {
                const ok =
                  u.id === 'water-heater' ? hasUtility(['water-heater', 'mech-closet'])
                    : u.id === 'washer' ? hasUtility(['washer', 'dryer'])
                      : hasUtility(['closet', 'storage-shelf']);
                return (
                  <li key={u.id}>
                    {ok ? '✓' : '○'} {u.label}
                    {!ok && <em className="muted"> — add from Furniture → {u.id === 'closet' ? 'Storage' : 'Utility'}</em>}
                  </li>
                );
              })}
            </ul>
            <p className="muted" style={{ fontSize: 12 }}>
              Catalog: {FURNITURE_CATALOG.filter((c) => c.category === 'Utility' || c.category === 'Storage').map((c) => c.name).join(' · ')}
            </p>
          </section>

          <section>
            <h3>Challenges</h3>
            {CHALLENGES.map((c) => (
              <article key={c.id} className="challenge-card">
                <h4>{c.title}</h4>
                <p className="teach-multiline">{c.prompt}</p>
                <ul>
                  {c.rubric.map((r) => (
                    <li key={r.id}>{r.text} <em>({r.points} pts)</em></li>
                  ))}
                </ul>
              </article>
            ))}
          </section>

          <section>
            <h3>Vocab</h3>
            <dl className="vocab-list">
              {VOCAB.map((v) => (
                <div key={v.term}>
                  <dt>{v.term}</dt>
                  <dd>{v.def}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </aside>
    </>
  );
}
