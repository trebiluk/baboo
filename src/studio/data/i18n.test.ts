import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { LOCALES, STR, asLocale, ellToolParts, homePhrase, isLocale, t, tt } from './i18n.ts';
import { VOCAB, VOCAB_PACKS, ellPracticeEntries, ellVocabCard, vocabGloss } from './teaching.ts';

describe('i18n', () => {
  it('asLocale falls back to en', () => {
    assert.equal(asLocale('es'), 'es');
    assert.equal(asLocale('en'), 'en');
    assert.equal(asLocale('uk'), 'uk');
    assert.equal(asLocale('fa'), 'fa');
    assert.equal(asLocale('ti'), 'ti');
    assert.equal(asLocale('cu'), 'cu');
    assert.equal(asLocale('fr'), 'en');
    assert.equal(asLocale(null), 'en');
    assert.equal(isLocale('es'), true);
    assert.equal(isLocale('ti'), true);
    assert.equal(isLocale('de'), false);
  });

  it('Spanish keeps English CAD terms in parentheses', () => {
    assert.equal(t('es', 'tool.wall'), 'Muro (Wall)');
    assert.equal(t('es', 'tool.door'), 'Puerta (Door)');
    assert.equal(t('en', 'tool.wall'), 'Wall');
  });

  it('new packs keep English CAD terms in parentheses', () => {
    for (const loc of LOCALES.filter((l) => l !== 'en')) {
      assert.match(t(loc, 'tool.wall'), /\(Wall\)/, loc);
      assert.match(t(loc, 'tool.door'), /\(Door\)/, loc);
      assert.match(t(loc, 'tool.window'), /\(Window\)/, loc);
      assert.match(t(loc, 'tool.sketch'), /\(Sketch\)/, loc);
      assert.match(t(loc, 'tool.room'), /\(Room\)/, loc);
    }
  });

  it('Cuban uses pared not muro', () => {
    assert.equal(t('cu', 'tool.wall'), 'Pared (Wall)');
    assert.notEqual(t('cu', 'tool.wall'), t('es', 'tool.wall'));
  });

  it('Ukrainian and Russian stay distinct', () => {
    assert.equal(t('uk', 'tool.wall'), 'Стіна (Wall)');
    assert.equal(t('ru', 'tool.wall'), 'Стена (Wall)');
    assert.notEqual(t('uk', 'chrome.settings'), t('ru', 'chrome.settings'));
  });

  it('Tigrigna and Farsi use native script', () => {
    assert.match(t('ti', 'tool.wall'), /መንደቕ/);
    assert.match(t('fa', 'tool.wall'), /دیوار/);
    assert.match(t('fa', 'chrome.settings'), /تنظیمات/);
  });

  it('interpolates vars and falls back missing keys', () => {
    assert.equal(t('es', 'toast.helpAs', { level: 'Novato' }), 'Te ayudo como Novato');
    assert.equal(t('fa', 'toast.helpAs', { level: 'مبتدی' }), 'کمکت می‌کنم مثل مبتدی');
    assert.equal(t('en', 'no.such.key'), 'no.such.key');
    assert.equal(tt('es', 'no.such.key', 'fallback'), 'fallback');
    assert.equal(tt('es', 'chrome.close', 'nope'), 'Cerrar');
  });

  it('fills every locale for every chrome key', () => {
    const missing: string[] = [];
    for (const [key, row] of Object.entries(STR)) {
      for (const loc of LOCALES) {
        if (!row[loc]) missing.push(`${loc}:${key}`);
      }
    }
    assert.equal(missing.length, 0, missing.slice(0, 24).join(', '));
  });
});

describe('vocab packs', () => {
  it('every Teach term has a gloss in every pack', () => {
    const missing: string[] = [];
    for (const entry of VOCAB) {
      for (const loc of Object.keys(VOCAB_PACKS) as (keyof typeof VOCAB_PACKS)[]) {
        if (!VOCAB_PACKS[loc][entry.term]) missing.push(`${loc}:${entry.term}`);
      }
    }
    assert.equal(missing.length, 0, missing.join(', '));
  });

  it('gloss helper falls back to English', () => {
    const sketch = VOCAB.find((v) => v.term === 'Sketch')!;
    assert.equal(vocabGloss('en', sketch).term, 'Sketch');
    assert.match(vocabGloss('uk', sketch).term, /Ескіз \(Sketch\)/);
    assert.match(vocabGloss('fa', sketch).term, /طرح \(Sketch\)/);
    assert.match(vocabGloss('ti', sketch).term, /ስእሊ \(Sketch\)/);
    assert.match(vocabGloss('cu', sketch).term, /Boceto \(Sketch\)/);
  });

  it('English-first cards keep a home-language bridge', () => {
    const wall = VOCAB.find((v) => v.term === 'Wall')!;
    const uk = ellVocabCard('uk', wall);
    assert.equal(uk.en, 'Wall');
    assert.equal(uk.home, 'Стіна');
    assert.match(uk.defEn, /room/i);
    assert.ok(uk.defHome && uk.defHome !== uk.defEn);
    const en = ellVocabCard('en', wall);
    assert.equal(en.home, null);
  });

  it('practice set includes Wall Door Window', () => {
    const terms = ellPracticeEntries(false).map((e) => e.term);
    assert.deepEqual(terms.sort(), ['Dimension', 'Door', 'Grid', 'Room', 'Scale', 'Sketch', 'Wall', 'Window'].sort());
  });
});

describe('ELL English-first labels', () => {
  it('homePhrase strips CAD parens', () => {
    assert.equal(homePhrase('Стіна (Wall)', 'Wall'), 'Стіна');
    assert.equal(homePhrase('Pared (Wall)', 'Wall'), 'Pared');
    assert.equal(homePhrase('دیوار (Wall)', 'Wall'), 'دیوار');
    assert.equal(homePhrase('Mueble', 'Furn.'), 'Mueble');
  });

  it('ellToolParts puts English first', () => {
    assert.deepEqual(ellToolParts('uk', 'tool.wall'), { en: 'Wall', home: 'Стіна' });
    assert.deepEqual(ellToolParts('cu', 'tool.wall'), { en: 'Wall', home: 'Pared' });
    assert.deepEqual(ellToolParts('en', 'tool.wall'), { en: 'Wall', home: null });
  });
});
