import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CHALLENGES, DOG_HOUSE_UNIT, REFLECTION_PROMPTS, UNIT_1 } from './teaching';
import { NOVICE_UNIT_STEPS } from './skill';
import { t } from './i18n';

/** The Teach panel shows lesson text through i18n keys; the English keys must say what teaching.ts says (2.13.53). */
describe('teach panel words match the lesson data', () => {
  it('challenges: title, prompt and every rubric line', () => {
    for (const c of CHALLENGES) {
      assert.equal(t('en', `ch.${c.id}.title`), c.title, c.id);
      assert.equal(t('en', `ch.${c.id}.prompt`), c.prompt, c.id);
      for (const r of c.rubric) assert.equal(t('en', `ch.${c.id}.${r.id}`), r.text, `${c.id} ${r.id}`);
    }
  });
  it('unit steps and reflections', () => {
    UNIT_1.steps.forEach((s, i) => assert.equal(t('en', `teach.u1.s${i + 1}`), s));
    DOG_HOUSE_UNIT.steps.forEach((s, i) => assert.equal(t('en', `teach.dog.s${i + 1}`), s));
    NOVICE_UNIT_STEPS.forEach((s, i) => assert.equal(t('en', `teach.nov.s${i + 1}`), s));
    assert.equal(t('en', 'teach.u1.done'), UNIT_1.doneLooksLike);
    assert.equal(t('en', 'teach.dog.done'), DOG_HOUSE_UNIT.doneLooksLike);
    for (const r of REFLECTION_PROMPTS) {
      assert.equal(t('en', `teach.ref.${r.id}.title`), r.title);
      assert.equal(t('en', `teach.ref.${r.id}.prompt`), r.prompt);
    }
  });
  it('every language has its own challenge text', () => {
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) {
      for (const c of CHALLENGES) {
        assert.notEqual(t(l, `ch.${c.id}.prompt`), c.prompt, `${l} ${c.id}`);
        for (const r of c.rubric) assert.notEqual(t(l, `ch.${c.id}.${r.id}`), r.text, `${l} ${c.id} ${r.id}`);
      }
    }
  });
});
