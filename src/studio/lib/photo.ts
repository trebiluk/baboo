/**
 * Photo mode (2.13.60): hand a picture to the student. The phone's share sheet when there is one,
 * otherwise a download. Nothing leaves the device unless the student shares it.
 */
import { safeFileName } from './storage';

export type PhotoResult = 'shared' | 'downloaded' | 'cancelled' | 'failed';

export function photoFileName(title: string, when = new Date()): string {
  const stamp = when.toISOString().slice(0, 16).replace(/[:T]/g, '-');
  return `${safeFileName(title, 'baboo')} ${stamp}.png`;
}

function toBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'));
}

export async function handOverPhoto(canvas: HTMLCanvasElement, title: string): Promise<PhotoResult> {
  const blob = await toBlob(canvas);
  if (!blob) return 'failed';
  const name = photoFileName(title);
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  try {
    const file = new File([blob], name, { type: 'image/png' });
    if (nav.share && nav.canShare?.({ files: [file] })) {
      try {
        await nav.share({ files: [file], title });
        return 'shared';
      } catch (e) {
        if ((e as Error)?.name === 'AbortError') return 'cancelled';
        // fall through to a download
      }
    }
  } catch { /* File() missing: download instead */ }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.rel = 'noopener';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  return 'downloaded';
}
