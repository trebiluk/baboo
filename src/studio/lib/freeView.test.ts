import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { overlayInsets } from './freeView.ts';

const canvas = { left: 0, top: 100, right: 882, bottom: 411 };
describe('fit leaves room for the job card and tool rail (2.13.57)', () => {
  it('measures how far overlays reach into the canvas', () => {
    const r = overlayInsets(canvas, { top: { left: 64, top: 104, right: 874, bottom: 160 }, left: { left: 8, top: 104, right: 58, bottom: 330 } });
    assert.deepEqual(r, { top: 68, left: 66 });
  });
  it('ignores missing overlays and ones that cover half the view', () => {
    assert.deepEqual(overlayInsets(canvas, {}), { top: 0, left: 0 });
    assert.deepEqual(overlayInsets(canvas, { top: { left: 0, top: 100, right: 882, bottom: 380 } }), { top: 0, left: 0 });
  });
  it('ignores overlays outside the canvas', () => {
    assert.deepEqual(overlayInsets(canvas, { top: { left: 0, top: 0, right: 882, bottom: 90 } }), { top: 0, left: 0 });
  });
});
