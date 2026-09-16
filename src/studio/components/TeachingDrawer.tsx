import { useEffect, useMemo, useState } from 'react';
import { UNIT_1, DOG_HOUSE_UNIT, CHALLENGES, VOCAB, REFLECTION_PROMPTS, UTILITY_CHECKLIST, ROOM_CHECKLIST, vocabGloss, ellVocabCard, ellPracticeEntries, vocabHomeWord } from '../data/teaching';
import { STYLE_TEMPLATES } from '../data/templates';
import { useProjectStore } from '../store/useProjectStore';
import { exteriorFloorAreaSqFt, roofStyleName } from '../lib/roof';
import { FURNITURE_CATALOG } from '../data/furniture';
import { DEFAULT_SKILL_LEVEL, NOVICE_UNIT_STEPS, skillRank } from '../data/skill';
import { t, localeOption, asLocale } from '../data/i18n';
import type { Locale, Floor, StyleId } from '../types';
import { runArchitectCheck, type ArchCheck, type ArchHit } from '../lib/architect';

export function TeachingDrawer() {
  const open = useProjectStore((s) => s.teachingOpen);
  const toggle = useProjectStore((s) => s.toggleTeaching);
  const toggleContest = useProjectStore((s) => s.toggleContest);
  const setSelected = useProjectStore((s) => s.setSelected);
  const doc = useProjectStore((s) => s.doc);
  const styleId = doc.settings.styleId;
  const style = STYLE_TEMPLATES.find((t) => t.id === styleId);
  const floor = doc.floors[0];
  const area = exteriorFloorAreaSqFt(floor.nodes, floor.walls);
  const roofName = (doc.settings.roofLabel?.trim() || roofStyleName(doc.settings.roofStyleId));

  const catalogIds = new Set(floor.furniture.map((f) => f.catalogId));
  const hasUtility = (ids: string[]) => ids.some((id) => catalogIds.has(id));
  const skillLevel = doc.settings.skillLevel ?? DEFAULT_SKILL_LEVEL;
  const locale = doc.settings.locale;
  const ellEnglish = doc.settings.ellEnglish !== false;
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
      <aside
        className="drawer teaching-drawer"
        role="dialog"
        aria-label={t(locale, 'teach.title')}
        lang={localeOption(locale).htmlLang}
        dir={localeOption(locale).dir}
      >
        <div className="drawer-head">
          <div className="drawer-head-title">
            <span className="sheet-handle" aria-hidden="true" />
            <h2>{t(locale, 'teach.title')}</h2>
          </div>
          <button type="button" className="ghost-btn aw-pressable" onClick={toggle}>
            {t(locale, 'chrome.close')}
          </button>
        </div>

        <div className="teaching-drawer-body">
          <p className="muted teach-hello">{t(locale, 'teach.hello')}</p>
          <section>
            <h3>{t(locale, 'teach.read.title')}</h3>
            <p className="muted dense-lead">{t(locale, 'teach.read.lead')}</p>
            <ArchitectReadout
              locale={locale}
              floor={floor}
              units={doc.settings.units}
              styleId={styleId}
              onHit={setSelected}
            />
          </section>
          <section>
            <h3>{t(locale, 'teach.readout')}</h3>
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
            <h3>{styleId === 'dog-house' ? t(locale, 'teach.dog.title') : t(locale, 'teach.unit1.title')}</h3>
            <p>{styleId === 'dog-house' ? t(locale, 'teach.dog.goal') : t(locale, 'teach.unit1.goal')}</p>
            <ol>
              {unitSteps.map((s) => <li key={s}>{s}</li>)}
            </ol>
            <p className="done-like"><strong>{t(locale, 'teach.done')}</strong> {unit.doneLooksLike}</p>
            {styleId === 'dog-house' && (
              <button type="button" className="primary-btn aw-pressable" style={{ marginTop: 10 }} onClick={toggleContest}>
                {t(locale, 'teach.judge')}
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
            <h3>{t(locale, 'teach.challenges')}</h3>
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
            <h3>{t(locale, 'teach.vocab')}</h3>
            {ellEnglish && asLocale(locale) !== 'en' ? (
              <p className="muted dense-lead">{t(locale, 'teach.ell.lead')}</p>
            ) : null}
            <dl className="vocab-list">
              {(styleId === 'dog-house'
                ? VOCAB.filter((v) =>
                    [
                      'Sketch', 'Trace', 'Wall', 'Door', 'Window', 'Scale', 'Floor plan', 'Dimension',
                      'Door swing', 'Opening', 'Grid', 'Snap', 'Gable', 'Shed',
                      'Flat', 'Ridge', 'Den', 'Offset door', 'Body heat', 'Floor area',
                    ].includes(v.term),
                  )
                : VOCAB
              ).map((v) => {
                if (ellEnglish) {
                  const card = ellVocabCard(locale, v);
                  return (
                    <div key={v.term} className="vocab-ell">
                      <dt>
                        <span className="vocab-ell-en" lang="en">{card.en}</span>
                        {card.home ? (
                          <span className="vocab-ell-home">
                            {' '}{t(locale, 'teach.ell.means')} {card.home}
                          </span>
                        ) : null}
                      </dt>
                      <dd>
                        <span className="vocab-ell-say" lang="en">{t(locale, 'teach.ell.say')}: {card.en}</span>
                        <span className="vocab-ell-def" lang="en">{card.defEn}</span>
                        {card.defHome ? <span className="vocab-ell-def-home">{card.defHome}</span> : null}
                      </dd>
                    </div>
                  );
                }
                const gloss = vocabGloss(locale, v);
                return (
                <div key={v.term}>
                  <dt>{gloss.term}</dt>
                  <dd>{gloss.def}</dd>
                </div>
                );
              })}
            </dl>
          </section>

          {ellEnglish && asLocale(locale) !== 'en' ? (
            <EllWordPractice locale={locale} dogHouse={styleId === 'dog-house'} />
          ) : null}
        </div>
      </aside>
    </>
  );
}

function architectMark(status: ArchCheck['status'], locale: Locale) {
  if (status === 'pass') return t(locale, 'teach.read.pass');
  if (status === 'warn') return t(locale, 'teach.read.warn');
  if (status === 'fail') return t(locale, 'teach.read.fail');
  return t(locale, 'teach.read.skip');
}

function selectArchHit(hit: ArchHit, onHit: (sel: { kind: ArchHit['kind']; id: string }) => void) {
  onHit({ kind: hit.kind, id: hit.id });
}

function ArchitectReadout({
  locale, floor, units, styleId, onHit,
}: {
  locale: Locale;
  floor: Floor;
  units: 'ft' | 'm';
  styleId: StyleId;
  onHit: (sel: { kind: ArchHit['kind']; id: string }) => void;
}) {
  let report;
  try {
    report = runArchitectCheck(floor, units, styleId);
  } catch {
    report = { checks: [] as ArchCheck[], pass: 0, warn: 0, fail: 0, skip: 0 };
  }
  return (
    <ul className="access-list">
      {report.checks.map((c) => (
        <li key={c.id}>
          <button
            type="button"
            className={`access-row access-${c.status} aw-pressable`}
            onClick={() => { if (c.hit) selectArchHit(c.hit, onHit); }}
            disabled={!c.hit}
          >
            <span className="access-mark">{architectMark(c.status, locale)}</span>
            <strong>{c.title}</strong>
            <span>{c.detail}</span>
            <em>{c.tip}</em>
          </button>
        </li>
      ))}
    </ul>
  );
}

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function EllWordPractice({ locale, dogHouse }: { locale: Locale; dogHouse: boolean }) {
  const entries = useMemo(() => ellPracticeEntries(dogHouse), [dogHouse]);
  const [nonce, setNonce] = useState(0);
  const enOrder = useMemo(() => shuffle(entries.map((e) => e.term)), [entries, nonce]);
  const homeOrder = useMemo(
    () => shuffle(entries.map((e) => ({ en: e.term, home: vocabHomeWord(locale, e) }))),
    [entries, locale, nonce],
  );
  const [pickedEn, setPickedEn] = useState<string | null>(null);
  const [pickedHome, setPickedHome] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(() => new Set());
  const [miss, setMiss] = useState(false);

  useEffect(() => {
    setPickedEn(null);
    setPickedHome(null);
    setMatched(new Set());
    setMiss(false);
  }, [locale, dogHouse, nonce]);

  const resolve = (nextEn: string | null, nextHome: string | null) => {
    if (!nextEn || !nextHome) return;
    if (nextEn === nextHome) {
      setMatched((prev) => new Set(prev).add(nextEn));
      setPickedEn(null);
      setPickedHome(null);
      setMiss(false);
      return;
    }
    setMiss(true);
    window.setTimeout(() => {
      setMiss(false);
      setPickedEn(null);
      setPickedHome(null);
    }, 450);
  };

  const done = matched.size === entries.length && entries.length > 0;

  return (
    <section className="ell-practice" aria-label={t(locale, 'teach.ell.title')}>
      <h3>{t(locale, 'teach.ell.title')}</h3>
      <p className="muted dense-lead">{t(locale, 'teach.ell.match')}</p>
      <p className="ell-practice-score">
        {t(locale, 'teach.ell.score', { n: String(matched.size), total: String(entries.length) })}
      </p>
      <div className={`ell-practice-grid${miss ? ' is-miss' : ''}`}>
        <div className="ell-practice-col" lang="en">
          {enOrder.map((en) => {
            const on = matched.has(en);
            return (
              <button
                key={en}
                type="button"
                className={`ell-chip aw-pressable${on ? ' is-matched' : ''}${pickedEn === en ? ' is-picked' : ''}`}
                disabled={on}
                aria-pressed={pickedEn === en}
                onClick={() => {
                  const next = en;
                  setPickedEn(next);
                  resolve(next, pickedHome);
                }}
              >
                {en}
              </button>
            );
          })}
        </div>
        <div className="ell-practice-col">
          {homeOrder.map((row) => {
            const on = matched.has(row.en);
            return (
              <button
                key={row.en}
                type="button"
                className={`ell-chip ell-chip-home aw-pressable${on ? ' is-matched' : ''}${pickedHome === row.en ? ' is-picked' : ''}`}
                disabled={on}
                aria-pressed={pickedHome === row.en}
                onClick={() => {
                  const next = row.en;
                  setPickedHome(next);
                  resolve(pickedEn, next);
                }}
              >
                {row.home}
              </button>
            );
          })}
        </div>
      </div>
      {done ? (
        <p className="ell-practice-done">{t(locale, 'teach.ell.done')}</p>
      ) : null}
      <button
        type="button"
        className="ghost-btn aw-pressable"
        onClick={() => setNonce((n) => n + 1)}
      >
        {t(locale, 'teach.ell.again')}
      </button>
    </section>
  );
}
