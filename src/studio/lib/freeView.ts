/**
 * The part of the plan you can see (2.13.57): the canvas minus what floats over it — the job card
 * along the top and the tool rail on the left. Fit uses it so a plan is not tucked under them,
 * which mattered most on a phone turned sideways.
 */
export type Insets = { top: number; left: number };

type Box = { left: number; top: number; right: number; bottom: number };

/** Pure: how far overlays reach into the canvas. Overlays that cover too much are ignored. */
export function overlayInsets(canvas: Box, overlays: { top?: Box | null; left?: Box | null }): Insets {
  const h = canvas.bottom - canvas.top;
  const w = canvas.right - canvas.left;
  let top = 0;
  let left = 0;
  const t = overlays.top;
  if (t && t.bottom > canvas.top && t.top < canvas.bottom) top = Math.max(0, t.bottom - canvas.top + 8);
  const l = overlays.left;
  if (l && l.right > canvas.left && l.left < canvas.right) left = Math.max(0, l.right - canvas.left + 8);
  // Never let overlays eat more than half the view; then they are panels, not chrome.
  if (top > h * 0.5) top = 0;
  if (left > w * 0.5) left = 0;
  return { top, left };
}

export function readInsets(): Insets {
  if (typeof document === 'undefined') return { top: 0, left: 0 };
  const canvas = document.querySelector('.plan-canvas')?.getBoundingClientRect();
  if (!canvas) return { top: 0, left: 0 };
  const job = document.querySelector('.job-chip')?.getBoundingClientRect() ?? null;
  const rail = document.querySelector('.tool-rail')?.getBoundingClientRect() ?? null;
  return overlayInsets(canvas, { top: job, left: rail });
}
