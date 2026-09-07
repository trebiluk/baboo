/**
 * Chromebook-light wall wallpaper tiles for PlanCanvas.
 * Packs = tiny procedural canvases (64px); import = IDB blob → Image.
 * Solid-friendly — no blur / neon stacks.
 */
import { getTextureBlob } from './textureBlobs';

const PACK_TILE = 64;
const packCache = new Map<string, HTMLCanvasElement>();
const importCache = new Map<string, HTMLImageElement | HTMLCanvasElement>();

function makeCanvas(size = PACK_TILE): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  return c;
}

/** Procedural pack tile — ids match textures.ts. */
export function packTileCanvas(textureId: string): HTMLCanvasElement | null {
  if (!textureId.startsWith('pack:') || textureId === 'pack:plain') return null;
  const hit = packCache.get(textureId);
  if (hit) return hit;
  const c = makeCanvas();
  const ctx = c.getContext('2d');
  if (!ctx) return null;
  const S = PACK_TILE;

  switch (textureId) {
    case 'pack:christmas': {
      ctx.fillStyle = '#14532d';
      ctx.fillRect(0, 0, S, S);
      for (let i = -S; i < S * 2; i += 12) {
        ctx.strokeStyle = '#991b1b';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + S, S);
        ctx.stroke();
        ctx.strokeStyle = '#fef3c7';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(i + 6, 0);
        ctx.lineTo(i + 6 + S, S);
        ctx.stroke();
      }
      break;
    }
    case 'pack:confetti': {
      const g = ctx.createLinearGradient(0, 0, S, S);
      g.addColorStop(0, '#132a5c');
      g.addColorStop(1, '#0b1a40');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, S, S);
      const dots: [number, number, string, number][] = [
        [12, 18, '#22d3ee', 3.5],
        [44, 24, '#a855f7', 3.5],
        [26, 48, '#3b82f6', 2.5],
        [54, 50, '#f472b6', 2.5],
        [8, 52, '#fbbf24', 2],
        [36, 10, '#22d3ee', 2],
      ];
      for (const [x, y, color, r] of dots) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 'pack:brick-joke': {
      ctx.fillStyle = '#7f1d1d';
      ctx.fillRect(0, 0, S, S);
      ctx.strokeStyle = '#450a0a';
      ctx.lineWidth = 2;
      const rowH = 16;
      for (let row = 0; row < S / rowH; row++) {
        const y = row * rowH;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(S, y);
        ctx.stroke();
        const offset = row % 2 === 0 ? 0 : 16;
        for (let x = offset; x < S; x += 32) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + rowH);
          ctx.stroke();
        }
      }
      break;
    }
    case 'pack:starry': {
      const g = ctx.createLinearGradient(0, 0, 0, S);
      g.addColorStop(0, '#06122b');
      g.addColorStop(1, '#132a5c');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, S, S);
      const stars: [number, number, string, number][] = [
        [8, 12, '#f7f9ff', 1.2],
        [28, 40, '#22d3ee', 1.2],
        [48, 18, '#a855f7', 1.6],
        [56, 48, '#f7f9ff', 1],
        [18, 52, '#c4b5fd', 1],
        [40, 8, '#f7f9ff', 0.9],
      ];
      for (const [x, y, color, r] of stars) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 'pack:paw': {
      const g = ctx.createLinearGradient(0, 0, S, S);
      g.addColorStop(0, '#0b1a40');
      g.addColorStop(1, '#132a5c');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, S, S);
      const drawPaw = (ox: number, oy: number, s: number) => {
        ctx.fillStyle = '#e85820';
        ctx.beginPath();
        ctx.ellipse(ox, oy + 4 * s, 5 * s, 4 * s, 0, 0, Math.PI * 2);
        ctx.fill();
        const toes: [number, number][] = [
          [-6, -4],
          [-2, -7],
          [3, -7],
          [7, -3],
        ];
        for (const [tx, ty] of toes) {
          ctx.beginPath();
          ctx.arc(ox + tx * s, oy + ty * s, 2.2 * s, 0, Math.PI * 2);
          ctx.fill();
        }
      };
      drawPaw(22, 28, 1);
      drawPaw(48, 48, 0.7);
      break;
    }
    default:
      ctx.fillStyle = '#6366f1';
      ctx.fillRect(0, 0, S, S);
      break;
  }

  packCache.set(textureId, c);
  return c;
}

/** World-space tile size (feet) — readable on Chromebook plan zoom. */
export function patternWorldScale(textureId: string | null | undefined): number {
  if (!textureId || textureId === 'pack:plain') return 1;
  if (textureId === 'import:local') return 2.5 / 64;
  return 2.2 / PACK_TILE;
}

export function patternForPack(
  textureId: string | null | undefined,
): HTMLCanvasElement | null {
  if (!textureId || textureId === 'pack:plain' || textureId === 'import:local') return null;
  return packTileCanvas(textureId);
}

/** Load import blob into a cached image (or null if missing). */
export async function loadImportPattern(
  blobRef: string | null | undefined,
): Promise<HTMLImageElement | HTMLCanvasElement | null> {
  if (!blobRef) return null;
  const cached = importCache.get(blobRef);
  if (cached) return cached;
  const blob = await getTextureBlob(blobRef);
  if (!blob) return null;
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('blob decode failed'));
      el.src = url;
    });
    importCache.set(blobRef, img);
    return img;
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function forgetImportPattern(blobRef: string | null | undefined): void {
  if (!blobRef) return;
  importCache.delete(blobRef);
}

/** Fallback hatch stroke color when pattern image unavailable. */
export function textureStrokeFallback(textureId: string | null | undefined): string | null {
  switch (textureId) {
    case 'pack:christmas':
      return '#991b1b';
    case 'pack:confetti':
      return '#a855f7';
    case 'pack:brick-joke':
      return '#7f1d1d';
    case 'pack:starry':
      return '#22d3ee';
    case 'pack:paw':
      return '#e85820';
    case 'import:local':
      return '#6366f1';
    default:
      return null;
  }
}
