/**
 * Postcard (2.13.61): the picture on a cream card with a white border and a caption band.
 * Always 1200×900 so a class board of them lines up. Pure canvas work, nothing leaves the device.
 */
export const POSTCARD_W = 1200;
export const POSTCARD_H = 900;

export type PostcardText = {
  /** Big caption: the plan's name. */
  title: string;
  /** Small caption: date · style · roof, already in the student's language. */
  note: string;
  /** 2.13.80: under the title — school · class · nickname (empty = none). */
  byline?: string;
  /** Tiny footer: "Made with Baboo · v…". */
  footer: string;
  /** Right-to-left language: title on the right, note on the left. */
  rtl: boolean;
};

/** 2.13.80: the second caption line — school · class or period · the kid's chosen nickname. Never a real name. */
export function classLine(settings: { schoolName?: string | null; className?: string | null; alias?: string | null }): string {
  return [settings.schoolName, settings.className, settings.alias].map((s) => (s ?? '').trim()).filter(Boolean).join(' · ');
}

export function postcardLayout(w = POSTCARD_W, h = POSTCARD_H) {
  const border = Math.round(w * 0.04);
  const band = Math.round(w * 0.085);
  const foot = Math.round(w * 0.028);
  const pic = { x: border, y: border, w: w - border * 2, h: h - border * 2 - band - foot };
  return { border, band, foot, pic };
}

/** Draw `picture` to cover `pic` (crop the long side, keep the middle). */
function cover(ctx: CanvasRenderingContext2D, picture: HTMLCanvasElement, pic: { x: number; y: number; w: number; h: number }) {
  const scale = Math.max(pic.w / picture.width, pic.h / picture.height);
  const sw = pic.w / scale;
  const sh = pic.h / scale;
  const sx = (picture.width - sw) / 2;
  const sy = (picture.height - sh) / 2;
  ctx.drawImage(picture, sx, sy, sw, sh, pic.x, pic.y, pic.w, pic.h);
}

function fitText(ctx: CanvasRenderingContext2D, text: string, maxW: number): string {
  if (ctx.measureText(text).width <= maxW) return text;
  let s = text;
  while (s.length > 1 && ctx.measureText(`${s}…`).width > maxW) s = s.slice(0, -1);
  return `${s.trimEnd()}…`;
}

export function makePostcard(picture: HTMLCanvasElement, text: PostcardText, w = POSTCARD_W, h = POSTCARD_H): HTMLCanvasElement {
  const { border, band, foot, pic } = postcardLayout(w, h);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  ctx.fillStyle = '#f6efe0';
  ctx.fillRect(0, 0, w, h);
  // white mat with a soft inner edge
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(pic.x - border * 0.35, pic.y - border * 0.35, pic.w + border * 0.7, pic.h + border * 0.7);
  cover(ctx, picture, pic);
  ctx.strokeStyle = '#00000018';
  ctx.lineWidth = 1;
  ctx.strokeRect(pic.x + 0.5, pic.y + 0.5, pic.w - 1, pic.h - 1);

  const y = pic.y + pic.h + band / 2 + border * 0.1;
  const left = pic.x;
  const right = pic.x + pic.w;
  ctx.textBaseline = 'middle';
  ctx.direction = text.rtl ? 'rtl' : 'ltr';
  // title
  ctx.fillStyle = '#1b1612';
  ctx.font = `700 ${Math.round(band * 0.42)}px Outfit, "Segoe UI", system-ui, sans-serif`;
  ctx.textAlign = text.rtl ? 'right' : 'left';
  // Title gets what the note leaves: measure the note first so neither is cut without need.
  ctx.font = `500 ${Math.round(band * 0.26)}px Outfit, "Segoe UI", system-ui, sans-serif`;
  const noteW = Math.min(ctx.measureText(text.note).width, pic.w * 0.6);
  const titleMax = pic.w - noteW - band * 0.6;
  ctx.font = `700 ${Math.round(band * 0.42)}px Outfit, "Segoe UI", system-ui, sans-serif`;
  const byline = (text.byline ?? '').trim();
  ctx.fillText(fitText(ctx, text.title, titleMax), text.rtl ? right : left, byline ? y - band * 0.17 : y);
  if (byline) {
    ctx.fillStyle = '#6b625a';
    ctx.font = `500 ${Math.round(band * 0.24)}px Outfit, "Segoe UI", system-ui, sans-serif`;
    ctx.fillText(fitText(ctx, byline, titleMax), text.rtl ? right : left, y + band * 0.24);
  }
  // note
  ctx.fillStyle = '#6b625a';
  ctx.font = `500 ${Math.round(band * 0.26)}px Outfit, "Segoe UI", system-ui, sans-serif`;
  ctx.textAlign = text.rtl ? 'left' : 'right';
  ctx.fillText(fitText(ctx, text.note, pic.w * 0.6), text.rtl ? left : right, y);
  // footer
  ctx.fillStyle = '#9a9188';
  ctx.font = `500 ${Math.round(foot * 0.55)}px Outfit, "Segoe UI", system-ui, sans-serif`;
  ctx.textAlign = 'center';
  ctx.direction = 'ltr';
  ctx.fillText(text.footer, w / 2, h - foot / 2 - border * 0.15);
  return c;
}
