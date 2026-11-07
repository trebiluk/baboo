import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { looksLikeDesktopSiteOnPhone } from './usePhoneChrome.ts';
const win = (innerWidth: number, sw: number, sh: number, coarse: boolean) => ({ innerWidth, screen: { width: sw, height: sh }, matchMedia: (q: string) => ({ matches: coarse && /coarse|hover: none/.test(q) }) });
describe('desktop site on a phone (2.13.90)', () => {
  it('spots it, and nothing else', () => {
    assert.equal(looksLikeDesktopSiteOnPhone(win(980, 412, 915, true)), true);
    assert.equal(looksLikeDesktopSiteOnPhone(win(980, 915, 412, true)), true, 'landscape phone');
    assert.equal(looksLikeDesktopSiteOnPhone(win(412, 412, 915, true)), false, 'normal phone');
    assert.equal(looksLikeDesktopSiteOnPhone(win(1024, 1024, 1366, true)), false, 'tablet');
    assert.equal(looksLikeDesktopSiteOnPhone(win(1366, 1366, 768, false)), false, 'Chromebook');
  });
});
