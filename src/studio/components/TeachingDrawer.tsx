import { useEffect } from 'react';
import { UNIT_1, DOG_HOUSE_UNIT, CHALLENGES, VOCAB, REFLECTION_PROMPTS, UTILITY_CHECKLIST, ROOM_CHECKLIST } from '../data/teaching';
import { STYLE_TEMPLATES } from '../data/templates';
import { useProjectStore } from '../store/useProjectStore';
import { exteriorFloorAreaSqFt, roofStyleName } from '../lib/roof';
import { FURNITURE_CATALOG } from '../data/furniture';
import { DEFAULT_SKILL_LEVEL, NOVICE_UNIT_STEPS, skillRank } from '../data/skill';

export function TeachingDrawer() {
  const open = useProjectStore((s) => s.teachingOpen);
  const toggle = useProjectStore((s) => s.toggleTeaching);
  const toggleContest = useProjectStore((s) => s.toggleContest);
  const doc = useProjectStore((s) => s.doc);
  const styleId = doc.settings.styleId;
  const style = STYLE_TEMPLATES.find((t) => t.id === styleId);
  const floor = doc.floors[0];
  const area = exteriorFloorAreaSqFt(floor.nodes, floor.walls);
  const roofName = (doc.settings.roofLabel?.trim() || roofStyleName(doc.settings.roofStyleId));

  const catalogIds = new Set(floor.furniture.map((f) => f.catalogId));
  const hasUtility = (ids: string[]) => ids.some((id) => catalogIds.has(id));
  const skillLevel = doc.settings.skillLevel ?? DEFAULT_SKILL_LEVEL;
  const rank = skillRank(skillLevel);
  const unit = styleId === 'dog-house' ? DOG_HOUSE_UNIT : UNIT_1;
  const unitSteps = styleId === 'dog-house'
    ? DOG_HOUSE_UNIT.steps
    : (rank === 0 ? NOVICE_UNIT_STEPS : UNIT_1.steps);
  const challenges = CHALLENGES.filter((c) => {
    if (styleId === 'dog-house') {
      return c.id === 'C-DOG-HOUSE-CONTEST' || c.id === 'C-ROOF-NAME';
    }
    if (rank === 0) return c.id === 'ch-scale-room';
    if (rank === 1) return c.id !== 'C-TINY-HOME-CONTEST';
    return true;
  });

  // Body scroll lock only while Teaching sheet is open (phone overlay).
  useEffect(() => {
    if (!open) return;
    const phone = typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches;
    if (!phone) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.classList.add('aw-teaching-open');
    body.classList.add('aw-teaching-open');
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      html.classList.remove('aw-teaching-open');
      body.classList.remove('aw-teaching-open');
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <button
        type="button"
        className="teaching-backdrop"
        aria-label="Dismiss teaching"
        onClick={toggle}
      />
      <aside className="drawer teaching-drawer" role="dialog" aria-label="Teaching">
        <div className="drawer-head">
          <div className="drawer-head-title">
            <span className="sheet-handle" aria-hidden="true" />
            <h2>Teach</h2>
          </div>
          <button type="button" className="ghost-btn aw-pressable" onClick={toggle}>
            Close
          </button>
        </div>

        <div className="teaching-drawer-body">
          <p className="muted teach-hello">One step at a time. Hide this whenever you want the whole grid.</p>
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
            <h3>{unit.title}</h3>
            <p>{unit.goal}</p>
            <ol>
              {unitSteps.map((s) => <li key={s}>{s}</li>)}
            </ol>
            <p className="done-like"><strong>Done looks like:</strong> {unit.doneLooksLike}</p>
            {styleId === 'dog-house' && (
              <button type="button" className="primary-btn aw-pressable" style={{ marginTop: 10 }} onClick={toggleContest}>
                Ask Baboo to judge
              </button>
            )}
          </section>

          {style && style.id !== 'blank' && (
            <section className="style-term">
              <h3>Style term</h3>
              <p><strong>{style.name}</strong> — {style.blurb}</p>
              {style.badge && <p><em>{style.badge} assignment linked</em></p>}
            </section>
          )}

          {styleId !== 'dog-house' && (
          <section>
            <h3>Build reflections</h3>
            {REFLECTION_PROMPTS.map((r) => (
              <article key={r.id} className="challenge-card">
                <h4>{r.title}</h4>
                <p className="teach-multiline">{r.prompt}</p>
              </article>
            ))}
          </section>
          )}

          {rank >= 1 && styleId !== 'dog-house' && (
          <section>
            <h3>Named rooms</h3>
            <p className="muted">Room tool → pick a type → click inside closed walls.</p>
            <ul>
              {ROOM_CHECKLIST.map((item) => {
                const ok = (doc.floors[0].rooms ?? []).some((r) => item.kinds.includes(r.kind));
                return (
                  <li key={item.id}>
                    {ok ? '✓' : '○'} {item.label}
                    {!ok && <em className="muted"> — add with Room</em>}
                  </li>
                );
              })}
            </ul>
          </section>
          )}

          {rank >= 2 && styleId !== 'dog-house' && (
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
          )}

          <section>
            <h3>Challenges</h3>
            {challenges.map((c) => (
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
              {(styleId === 'dog-house'
                ? VOCAB.filter((v) =>
                    [
                      'Sketch', 'Trace', 'Scale', 'Floor plan', 'Dimension',
                      'Door swing', 'Opening', 'Grid', 'Snap', 'Gable', 'Shed',
                      'Flat', 'Ridge', 'Den', 'Offset door', 'Body heat', 'Floor area',
                    ].includes(v.term),
                  )
                : VOCAB
              ).map((v) => (
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
