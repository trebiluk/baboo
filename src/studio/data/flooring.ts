/** Classroom floor finishes — procedural tiles, no photos. */

export type FloorFinishId =
  | 'oak'
  | 'walnut'
  | 'maple'
  | 'herringbone'
  | 'tile'
  | 'hex'
  | 'carpet'
  | 'denim'
  | 'lino'
  | 'concrete'
  | 'checker'
  | 'slate'
  | 'terracotta'
  | 'brick'
  | 'cork'
  | 'marble';

export type FloorGrain = 0 | 90;

export type FloorFinish = {
  id: FloorFinishId;
  name: string;
  blurb: string;
  /** Solid under the hatch (plan + 3D). */
  color: string;
  previewCss: string;
};

export const FLOOR_FINISHES: FloorFinish[] = [
  { id: 'oak', name: 'Oak', blurb: 'Hardwood planks — living and dining.', color: '#C4A574', previewCss: 'repeating-linear-gradient(90deg,#C4A574 0 10px,#A88858 10px 12px,#D4B888 12px 22px)' },
  { id: 'walnut', name: 'Walnut', blurb: 'Dark hardwood planks.', color: '#6B4A32', previewCss: 'repeating-linear-gradient(90deg,#6B4A32 0 10px,#4A3224 10px 12px,#8A6248 12px 22px)' },
  { id: 'maple', name: 'Maple', blurb: 'Lighter wood planks.', color: '#E0C8A0', previewCss: 'repeating-linear-gradient(90deg,#E8D4B0 0 10px,#C4A878 10px 12px,#F0E0C4 12px 22px)' },
  { id: 'herringbone', name: 'Herringbone', blurb: 'Chevrons of oak — formal rooms.', color: '#C8A878', previewCss: 'repeating-linear-gradient(45deg,#C8A878 0 8px,#A88858 8px 10px,#D4B888 10px 18px)' },
  { id: 'tile', name: 'Tile', blurb: 'Square ceramic — kitchen and bath.', color: '#E8E4DC', previewCss: 'repeating-linear-gradient(0deg,#E8E4DC 0 14px,#C8C4BC 14px 16px),repeating-linear-gradient(90deg,#E8E4DC 0 14px,#C8C4BC 14px 16px)' },
  { id: 'hex', name: 'Hex tile', blurb: 'Honeycomb tile — bath or entry.', color: '#D8DCE4', previewCss: 'radial-gradient(circle at 8px 8px,#D8DCE4 6px,#9AA4B0 7px,#9AA4B0 8px,transparent 8px),#C8D0D8' },
  { id: 'carpet', name: 'Carpet', blurb: 'Soft pile — bedrooms.', color: '#C9B89A', previewCss: 'repeating-radial-gradient(circle at 2px 2px,#C9B89A 0 2px,#B8A888 2px 3px)' },
  { id: 'denim', name: 'Blue carpet', blurb: 'Soft blue pile.', color: '#8AA4C4', previewCss: 'repeating-radial-gradient(circle at 2px 2px,#8AA4C4 0 2px,#6A88B0 2px 3px)' },
  { id: 'lino', name: 'Linoleum', blurb: 'Speckled sheet — kitchen or hall.', color: '#C8B090', previewCss: 'radial-gradient(circle at 20% 30%,#D4BC9C 0 2px,transparent 3px),#C8B090' },
  { id: 'concrete', name: 'Concrete', blurb: 'Utility gray slab.', color: '#A8B0B8', previewCss: 'linear-gradient(135deg,#B4BCC4,#9AA4AC)' },
  { id: 'checker', name: 'Checker', blurb: 'Black and white kitchen squares.', color: '#F4F0E8', previewCss: 'repeating-conic-gradient(#2A2A2A 0% 25%,#F4F0E8 0% 50%) 0 0 / 16px 16px' },
  { id: 'slate', name: 'Slate', blurb: 'Blue-gray stone — entry or bath.', color: '#6A7480', previewCss: 'repeating-linear-gradient(0deg,#6A7480 0 10px,#4A5460 10px 12px,#8A94A0 12px 22px)' },
  { id: 'terracotta', name: 'Terracotta', blurb: 'Warm clay tiles.', color: '#C47850', previewCss: 'repeating-linear-gradient(0deg,#C47850 0 14px,#A05838 14px 16px),repeating-linear-gradient(90deg,#C47850 0 14px,#A05838 14px 16px)' },
  { id: 'brick', name: 'Brick paver', blurb: 'Entry or porch pavers.', color: '#B07058', previewCss: 'repeating-linear-gradient(0deg,#B07058 0 8px,#8A5040 8px 10px)' },
  { id: 'cork', name: 'Cork', blurb: 'Warm speckled sheets — classroom quiet.', color: '#C4A068', previewCss: 'radial-gradient(circle at 20% 30%,#D4B078 0 3px,transparent 4px),radial-gradient(circle at 70% 60%,#A88848 0 2px,transparent 3px),#C4A068' },
  { id: 'marble', name: 'Marble', blurb: 'Soft veined stone — entry or bath.', color: '#E8E4DC', previewCss: 'linear-gradient(120deg,#F4F0E8 0 40%,#D0CCC4 42%,#F4F0E8 50%,#C8C4BC 70%,#E8E4DC 100%)' },
];

const BY_ID = new Map(FLOOR_FINISHES.map((f) => [f.id, f]));

export function isFloorFinish(v: unknown): v is FloorFinishId {
  return typeof v === 'string' && BY_ID.has(v as FloorFinishId);
}

export function asFloorFinish(v: unknown): FloorFinishId {
  return isFloorFinish(v) ? v : 'oak';
}

export function asFloorGrain(v: unknown): FloorGrain {
  return Number(v) === 90 ? 90 : 0;
}

export function floorFinish(id: FloorFinishId | null | undefined): FloorFinish {
  return BY_ID.get(id ?? 'oak') ?? FLOOR_FINISHES[0];
}

export function defaultFloorForKind(kind: string): FloorFinishId | null {
  switch (kind) {
    case 'kitchen':
      return 'tile';
    case 'bath':
      return 'hex';
    case 'entry':
      return 'slate';
    case 'bedroom':
    case 'office':
      return 'carpet';
    case 'utility':
    case 'storage':
      return 'concrete';
    case 'dining':
      return 'herringbone';
    case 'outdoor':
      return null;
    default:
      return 'oak';
  }
}

const tileCache = new Map<string, HTMLCanvasElement>();

export function floorTileCanvas(id: FloorFinishId, grain: FloorGrain = 0): HTMLCanvasElement {
  const key = `${id}:${grain}`;
  const hit = tileCache.get(key);
  if (hit) return hit;
  const S = 64;
  const c = document.createElement('canvas');
  c.width = S;
  c.height = S;
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  if (grain === 90) {
    ctx.translate(S, 0);
    ctx.rotate(Math.PI / 2);
  }
  paintFloor(ctx, id, S);
  tileCache.set(key, c);
  return c;
}

function paintFloor(ctx: CanvasRenderingContext2D, id: FloorFinishId, S: number) {
  switch (id) {
    case 'oak':
    case 'maple':
    case 'walnut': {
      const pal =
        id === 'maple' ? ['#E8D4B0', '#F0E0C4', '#D4BC90', '#C4A878']
          : id === 'walnut' ? ['#6B4A32', '#8A6248', '#4A3224', '#5C3A28']
            : ['#C4A574', '#D4B888', '#A88858', '#8A6A40'];
      ctx.fillStyle = pal[0];
      ctx.fillRect(0, 0, S, S);
      const plank = 16;
      for (let x = 0; x < S; x += plank) {
        ctx.fillStyle = pal[(x / plank) % 2 ? 1 : 2];
        ctx.fillRect(x, 0, plank - 2, S);
        ctx.strokeStyle = pal[3];
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + plank - 1, 0);
        ctx.lineTo(x + plank - 1, S);
        ctx.stroke();
        for (let y = ((x / plank) % 2) * 20; y < S; y += 32) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + plank - 2, y);
          ctx.stroke();
        }
      }
      break;
    }
    case 'herringbone': {
      ctx.fillStyle = '#C8A878';
      ctx.fillRect(0, 0, S, S);
      ctx.strokeStyle = '#8A6A40';
      ctx.lineWidth = 1;
      const t = 10;
      for (let y = -S; y < S * 2; y += t) {
        for (let x = -S; x < S * 2; x += t * 2) {
          const flip = Math.floor(y / t) % 2;
          ctx.fillStyle = flip ? '#D4B888' : '#B09068';
          ctx.beginPath();
          if (flip) {
            ctx.moveTo(x, y);
            ctx.lineTo(x + t, y + t);
            ctx.lineTo(x, y + t);
          } else {
            ctx.moveTo(x + t, y);
            ctx.lineTo(x + t * 2, y + t);
            ctx.lineTo(x + t, y + t);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      }
      break;
    }
    case 'tile':
    case 'terracotta': {
      const grout = id === 'terracotta' ? '#A05838' : '#C0BBB0';
      const body = id === 'terracotta' ? '#C47850' : '#E8E4DC';
      const alt = id === 'terracotta' ? '#D48860' : '#F0ECE4';
      ctx.fillStyle = grout;
      ctx.fillRect(0, 0, S, S);
      const t = 16;
      for (let y = 0; y < S; y += t) {
        for (let x = 0; x < S; x += t) {
          ctx.fillStyle = ((x / t) + (y / t)) % 2 === 0 ? body : alt;
          ctx.fillRect(x + 1, y + 1, t - 2, t - 2);
        }
      }
      break;
    }
    case 'hex': {
      ctx.fillStyle = '#C8D0D8';
      ctx.fillRect(0, 0, S, S);
      ctx.strokeStyle = '#8A94A0';
      ctx.fillStyle = '#D8DCE4';
      ctx.lineWidth = 1.2;
      const r = 8;
      const dx = r * 1.75;
      const dy = r * 1.52;
      for (let row = -1; row < 8; row++) {
        for (let col = -1; col < 8; col++) {
          const x = col * dx + (row % 2 ? dx / 2 : 0);
          const y = row * dy;
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const a = (Math.PI / 3) * i;
            const px = x + Math.cos(a) * r;
            const py = y + Math.sin(a) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      }
      break;
    }
    case 'carpet':
    case 'denim': {
      ctx.fillStyle = id === 'denim' ? '#8AA4C4' : '#C9B89A';
      ctx.fillRect(0, 0, S, S);
      const dots = id === 'denim' ? '#6A88B0' : '#B8A888';
      ctx.fillStyle = dots;
      for (let i = 0; i < 80; i++) {
        const x = (i * 17) % S;
        const y = (i * 29) % S;
        ctx.fillRect(x, y, 2, 2);
      }
      break;
    }
    case 'lino': {
      ctx.fillStyle = '#C8B090';
      ctx.fillRect(0, 0, S, S);
      const specks = ['#D4BC9C', '#A89070', '#E0C8A8', '#B8A080'];
      for (let i = 0; i < 60; i++) {
        ctx.fillStyle = specks[i % specks.length];
        ctx.beginPath();
        ctx.arc((i * 13) % S, (i * 23) % S, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 'concrete': {
      const g = ctx.createLinearGradient(0, 0, S, S);
      g.addColorStop(0, '#B4BCC4');
      g.addColorStop(1, '#9AA4AC');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, S, S);
      ctx.strokeStyle = '#8A949C';
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(8, 4);
      ctx.lineTo(40, 60);
      ctx.moveTo(50, 8);
      ctx.lineTo(20, 58);
      ctx.stroke();
      break;
    }
    case 'checker': {
      const t = 16;
      for (let y = 0; y < S; y += t) {
        for (let x = 0; x < S; x += t) {
          ctx.fillStyle = ((x / t) + (y / t)) % 2 === 0 ? '#F4F0E8' : '#2A2A2A';
          ctx.fillRect(x, y, t, t);
        }
      }
      break;
    }
    case 'slate': {
      ctx.fillStyle = '#5A646E';
      ctx.fillRect(0, 0, S, S);
      const t = 20;
      for (let y = 0; y < S; y += t) {
        for (let x = 0; x < S; x += t) {
          ctx.fillStyle = ((x / t) + (y / t)) % 2 === 0 ? '#6A7480' : '#4A5460';
          ctx.fillRect(x + 1, y + 1, t - 3, t - 3);
        }
      }
      break;
    }
    case 'brick': {
      ctx.fillStyle = '#8A5040';
      ctx.fillRect(0, 0, S, S);
      const rowH = 16;
      for (let row = 0; row < S / rowH; row++) {
        const y = row * rowH;
        const off = row % 2 ? 16 : 0;
        ctx.fillStyle = row % 2 ? '#B07058' : '#C08060';
        for (let x = -16; x < S; x += 32) {
          ctx.fillRect(x + off + 1, y + 1, 30, rowH - 2);
        }
      }
      break;
    }
    case 'cork': {
      ctx.fillStyle = '#C4A068';
      ctx.fillRect(0, 0, S, S);
      const dots = ['#D4B078', '#A88848', '#E0C490', '#8A6A38'];
      for (let i = 0; i < 90; i++) {
        ctx.fillStyle = dots[i % dots.length];
        ctx.beginPath();
        ctx.arc((i * 11) % S, (i * 19) % S, 1.6 + (i % 3) * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case 'marble': {
      ctx.fillStyle = '#E8E4DC';
      ctx.fillRect(0, 0, S, S);
      ctx.strokeStyle = '#C8C4BC';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(2, 10);
      ctx.bezierCurveTo(18, 4, 28, 22, 60, 14);
      ctx.moveTo(4, 40);
      ctx.bezierCurveTo(22, 28, 36, 52, 62, 44);
      ctx.moveTo(0, 56);
      ctx.bezierCurveTo(16, 48, 40, 62, 64, 54);
      ctx.stroke();
      ctx.strokeStyle = '#D8D4CC';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(8, 20);
      ctx.bezierCurveTo(24, 16, 40, 30, 58, 22);
      ctx.stroke();
      break;
    }
  }
}
