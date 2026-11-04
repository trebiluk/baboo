import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { safeFileName } from './storage';
import { DEFAULT_PLAN_TITLE, isUnnamedPlan, planTitle } from '../data/i18n';

describe('plan names in every language (2.13.55)', () => {
  it('keeps letters from any script in file names', () => {
    assert.equal(safeFileName('Maya’s Ranch #2!'), 'Mayas Ranch 2');
    assert.equal(safeFileName('بيتي الجميل'), 'بيتي الجميل');
    assert.equal(safeFileName('Мой дом'), 'Мой дом');
    assert.equal(safeFileName('ገዛይ'), 'ገዛይ');
    assert.equal(safeFileName('خانهٔ من'), 'خانهٔ من');
    assert.equal(safeFileName('a/b\\c:d*?'), 'abcd');
    assert.equal(safeFileName('   '), 'project');
    assert.equal(safeFileName('x'.repeat(200)).length, 80);
  });
  it('shows an unnamed plan in the student\'s language', () => {
    assert.ok(isUnnamedPlan(DEFAULT_PLAN_TITLE) && isUnnamedPlan('') && isUnnamedPlan('  ') && !isUnnamedPlan('Ranch'));
    assert.equal(planTitle(DEFAULT_PLAN_TITLE, 'en'), 'Untitled plan');
    assert.equal(planTitle('', 'es'), 'Plano sin nombre');
    assert.equal(planTitle('Ranch', 'ar'), 'Ranch');
    for (const l of ['es', 'uk', 'ru', 'ar', 'fa-AF', 'rw', 'ti'] as const) assert.notEqual(planTitle('', l), 'Untitled plan', l);
  });
});

describe('photo file names (2.13.60)', () => {
  it('uses the plan name and a time stamp, in any language', async () => {
    const { photoFileName } = await import('./photo');
    const when = new Date('2026-11-04T11:29:00Z');
    assert.equal(photoFileName('Cape Cod Plan', when), 'Cape Cod Plan 2026-11-04-11-29.png');
    assert.equal(photoFileName('بيتي', when), 'بيتي 2026-11-04-11-29.png');
    assert.equal(photoFileName('', when), 'baboo 2026-11-04-11-29.png');
  });
});
