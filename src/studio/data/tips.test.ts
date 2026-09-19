import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  LATER_TIPS, TIP_IDS, WIN_TIPS, hasTaWhisper, isLaterTip, isTipId, nextTip, tipKey, winsDone,
} from './tips.ts';
import type { TipCtx, TipId, TipProgress } from './tips.ts';
import { LOCALES, STR, t } from './i18n.ts';

const EMPTY: TipProgress = { walls: 0, doors: 0, savedFile: false, drewSomething: false };

function ctx(over: Partial<TipCtx> = {}): TipCtx {
  return {
    showTips: true,
    progress: EMPTY,
    done: [],
    pending: null,
    taAssist: false,
    ...over,
  };
}

function at(over: Partial<TipProgress>): TipProgress {
  return { ...EMPTY, ...over };
}

describe('tip pack ids', () => {
  it('keeps the eight Curriculum ids, unrenamed', () => {
    assert.deepEqual([...TIP_IDS], [
      'tip-welcome', 'tip-wall', 'tip-door', 'tip-save',
      'tip-roof', 'tip-3d', 'tip-teach', 'tip-class-card',
    ]);
    assert.equal(isTipId('tip-wall'), true);
    assert.equal(isTipId('wall'), false);
    assert.equal(isTipId(7), false);
  });

  it('splits the three wins from the later tips', () => {
    assert.deepEqual([...WIN_TIPS], ['tip-wall', 'tip-door', 'tip-save']);
    for (const id of LATER_TIPS) assert.equal(isLaterTip(id), true);
    for (const id of WIN_TIPS) assert.equal(isLaterTip(id), false);
  });

  it('only the first-run four carry a TA whisper', () => {
    assert.equal(hasTaWhisper('tip-welcome'), true);
    assert.equal(hasTaWhisper('tip-save'), true);
    assert.equal(hasTaWhisper('tip-roof'), false);
    assert.equal(hasTaWhisper('tip-class-card'), false);
  });

  it('maps a locked id to a string-table key', () => {
    assert.equal(tipKey('tip-welcome'), 'tip.welcome');
    assert.equal(tipKey('tip-class-card'), 'tip.class-card');
    assert.equal(tipKey('tip-3d'), 'tip.3d');
  });
});

describe('three wins', () => {
  it('needs a wall, a door and a saved file', () => {
    assert.equal(winsDone(EMPTY), false);
    assert.equal(winsDone(at({ walls: 1 })), false);
    assert.equal(winsDone(at({ walls: 4, doors: 1 })), false);
    assert.equal(winsDone(at({ walls: 4, doors: 1, savedFile: true })), true);
  });

  it('runs welcome, wall, door, save in that order every time', () => {
    assert.equal(nextTip(ctx()), 'tip-welcome');
    const drew = { drewSomething: true };
    assert.equal(nextTip(ctx({ progress: at(drew) })), 'tip-wall');
    assert.equal(nextTip(ctx({ progress: at({ ...drew, walls: 4 }) })), 'tip-door');
    assert.equal(nextTip(ctx({ progress: at({ ...drew, walls: 4, doors: 1 }) })), 'tip-save');
  });

  it('stops coaching once the three wins are in', () => {
    const done = at({ drewSomething: true, walls: 4, doors: 1, savedFile: true });
    assert.equal(nextTip(ctx({ progress: done })), null);
  });

  it('says nothing about doors or saving on an empty plan', () => {
    const acked: TipId[] = ['tip-welcome', 'tip-wall'];
    assert.equal(nextTip(ctx({ done: acked })), null);
    assert.equal(nextTip(ctx({ done: acked, progress: at({ drewSomething: true }) })), null);
  });

  it('Got it retires one tip and moves to the next', () => {
    assert.equal(nextTip(ctx({ done: ['tip-welcome'] })), 'tip-wall');
    assert.equal(nextTip(ctx({ done: ['tip-welcome', 'tip-wall'] })), null);
  });

  it('skips the welcome for a student already sketching', () => {
    assert.equal(nextTip(ctx({ progress: at({ drewSomething: true }) })), 'tip-wall');
  });

  it('shows nothing at all when tips are off', () => {
    assert.equal(nextTip(ctx({ showTips: false })), null);
    assert.equal(nextTip(ctx({ showTips: false, pending: 'tip-3d', taAssist: true })), null);
  });
});

describe('later tips', () => {
  const wins = at({ drewSomething: true, walls: 4, doors: 1, savedFile: true });

  it('holds roof, 3D, Teach and Class card behind the three wins', () => {
    for (const id of LATER_TIPS) {
      assert.equal(nextTip(ctx({ pending: id })), 'tip-welcome', id);
      assert.equal(nextTip(ctx({ pending: id, progress: wins })), id, id);
    }
  });

  it('lets a TA unlock a later tip without finishing the wins', () => {
    const acked: TipId[] = ['tip-welcome', 'tip-wall'];
    assert.equal(nextTip(ctx({ pending: 'tip-roof', done: acked, taAssist: true })), 'tip-roof');
    assert.equal(nextTip(ctx({ pending: 'tip-roof', done: acked })), null);
  });

  it('never preempts the first-run path, even for a TA', () => {
    assert.equal(nextTip(ctx({ pending: 'tip-roof', taAssist: true })), 'tip-welcome');
  });

  it('does not repeat a later tip that was acknowledged', () => {
    assert.equal(nextTip(ctx({ pending: 'tip-3d', progress: wins, done: ['tip-3d'] })), null);
  });

  it('a pending later tip never jumps the queue mid-path', () => {
    const midway = at({ drewSomething: true, walls: 4 });
    assert.equal(nextTip(ctx({ pending: 'tip-roof', progress: midway })), 'tip-door');
  });
});

describe('tip copy', () => {
  it('has a title and a body in all seven classroom languages', () => {
    const missing: string[] = [];
    for (const id of TIP_IDS) {
      for (const part of ['title', 'body']) {
        const key = `${tipKey(id)}.${part}`;
        if (!STR[key]) { missing.push(key); continue; }
        for (const loc of LOCALES) if (!STR[key][loc]) missing.push(`${loc}:${key}`);
      }
    }
    assert.deepEqual(missing, []);
  });

  it('pastes the locked EN and ES strings', () => {
    assert.equal(t('en', 'tip.welcome.title'), 'Sketch the house first');
    assert.equal(t('es', 'tip.welcome.title'), 'Primero dibuja la casa');
    assert.equal(t('en', 'tip.wall.body'), 'Click where it starts. Click where it ends.');
    assert.equal(t('es', 'tip.wall.body'), 'Clic donde empieza. Clic donde termina.');
    assert.equal(t('en', 'tip.door.body'), 'Click close to a wall.');
    assert.equal(t('es', 'tip.door.body'), 'Haz clic cerca de un muro.');
    assert.equal(t('en', 'tip.gotIt'), 'Got it');
    assert.equal(t('es', 'tip.gotIt'), 'Entendido');
    assert.equal(t('en', 'tip.show'), 'Show tips');
    assert.equal(t('es', 'tip.show'), 'Mostrar tips');
  });

  it('keeps roof shop words in English everywhere', () => {
    for (const loc of LOCALES) {
      assert.match(t(loc, 'tip.roof.body'), /gable/, loc);
      assert.match(t(loc, 'tip.roof.body'), /hip/, loc);
      assert.match(t(loc, 'tip.roof.body'), /grass/, loc);
    }
  });

  it('keeps the class card on alias, never a last name', () => {
    for (const loc of LOCALES) {
      assert.match(t(loc, 'tip.class-card.body'), /alias/i, loc);
    }
  });

  it('has a TA whisper in every language for the first-run four', () => {
    for (const id of TIP_IDS) {
      if (!hasTaWhisper(id)) continue;
      const key = `tip.whisper.${id.slice('tip-'.length)}`;
      assert.ok(STR[key], key);
      for (const loc of LOCALES) assert.ok(STR[key][loc], `${loc}:${key}`);
    }
    assert.equal(t('en', 'tip.whisper.wall'), 'Hand-over-hand OK. Two clicks only.');
  });

  it('never puts FERPA, IEP or 504 on student chrome', () => {
    for (const [key, row] of Object.entries(STR)) {
      for (const loc of LOCALES) {
        assert.doesNotMatch(row[loc] ?? '', /FERPA|\bIEP\b|\b504\b/, `${loc}:${key}`);
      }
    }
  });
});
