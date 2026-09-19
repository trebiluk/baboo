/**
 * Tip pack — CURRICULUM-TIP-PACK-EN-ES.md + CURRICULUM-ONBOARD-UDL-ELL-NEURO.md.
 *
 * Tips are the chrome coach marks. Show/hide is product: on for the first run,
 * the teacher can turn them off in Settings or Help.
 *
 * Curriculum law for this copy: kid-plain, short, concrete, one step, one tip on
 * screen at a time. The Teaching panel and the Matteson spine are a separate
 * surface and stay English — nothing here reaches into them.
 *
 * Tip ids are locked by Curriculum. Do not rename them.
 */

export type TipId =
  | 'tip-welcome'
  | 'tip-wall'
  | 'tip-door'
  | 'tip-save'
  | 'tip-roof'
  | 'tip-3d'
  | 'tip-teach'
  | 'tip-class-card';

export const TIP_IDS: readonly TipId[] = [
  'tip-welcome',
  'tip-wall',
  'tip-door',
  'tip-save',
  'tip-roof',
  'tip-3d',
  'tip-teach',
  'tip-class-card',
];

/**
 * Three wins, then stop coaching: draw one wall, place one door, save the file.
 * A student who is significantly low gets these three and nothing else.
 */
export const WIN_TIPS: readonly TipId[] = ['tip-wall', 'tip-door', 'tip-save'];

/**
 * Roof name, 3D, Teach and Class card wait until the three wins are in — or
 * until a TA unlocks them. Nobody has to hear "typology" on day one.
 */
export const LATER_TIPS: readonly TipId[] = ['tip-roof', 'tip-3d', 'tip-teach', 'tip-class-card'];

/** Only the first-run four carry a TA whisper. */
export const TA_WHISPER_TIPS: readonly TipId[] = ['tip-welcome', 'tip-wall', 'tip-door', 'tip-save'];

export function isTipId(v: unknown): v is TipId {
  return typeof v === 'string' && (TIP_IDS as readonly string[]).includes(v);
}

export function isLaterTip(id: TipId): boolean {
  return LATER_TIPS.includes(id);
}

export function hasTaWhisper(id: TipId): boolean {
  return TA_WHISPER_TIPS.includes(id);
}

/**
 * i18n key stem. The locked id keeps its `tip-` prefix as an identifier; the
 * string table drops it so keys read `tip.welcome.title`.
 */
export function tipKey(id: TipId): string {
  return `tip.${id.slice('tip-'.length)}`;
}

/** What the student has actually done, read off the plan and local prefs. */
export type TipProgress = {
  walls: number;
  doors: number;
  /** A plan has been downloaded at least once — the turn-in. */
  savedFile: boolean;
  /** Anything on the page yet: a wall or a pencil sketch. */
  drewSomething: boolean;
};

export function winsDone(p: TipProgress): boolean {
  return p.walls > 0 && p.doors > 0 && p.savedFile;
}

export type TipCtx = {
  showTips: boolean;
  progress: TipProgress;
  /** Tips the student has already said Got it to. */
  done: readonly TipId[];
  /** A later tip asked for by something the student just opened. */
  pending: TipId | null;
  taAssist: boolean;
};

/**
 * The one tip to show, or null for none. Order is fixed so every period runs the
 * same way — a student who needs the same shape each time gets it.
 *
 * An empty plan stops after the wall tip: there is nothing honest to say about
 * doors or saving yet.
 */
export function nextTip(ctx: TipCtx): TipId | null {
  if (!ctx.showTips) return null;
  const done = new Set(ctx.done);
  const p = ctx.progress;

  if (ctx.pending && !done.has(ctx.pending) && (winsDone(p) || ctx.taAssist)) {
    return ctx.pending;
  }

  if (!p.drewSomething) return done.has('tip-welcome') ? null : 'tip-welcome';
  if (p.walls === 0) return done.has('tip-wall') ? null : 'tip-wall';
  if (p.doors === 0) return done.has('tip-door') ? null : 'tip-door';
  if (!p.savedFile) return done.has('tip-save') ? null : 'tip-save';
  return null;
}

/* ---- local prefs (device, not the plan file) ---- */

const SHOW_KEY = 'baboo-show-tips';
const DONE_KEY = 'baboo-tips-done';
const SAVED_KEY = 'baboo-saved-file';
const TA_KEY = 'baboo-ta-assist';

/** Tips show on the first run. */
export function readShowTipsPref(): boolean {
  try {
    return localStorage.getItem(SHOW_KEY) !== '0';
  } catch {
    return true;
  }
}

export function writeShowTipsPref(on: boolean): void {
  try {
    localStorage.setItem(SHOW_KEY, on ? '1' : '0');
  } catch { /* ignore */ }
}

export function readTipsDonePref(): TipId[] {
  try {
    const raw = localStorage.getItem(DONE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isTipId) : [];
  } catch {
    return [];
  }
}

export function writeTipsDonePref(ids: readonly TipId[]): void {
  try {
    localStorage.setItem(DONE_KEY, JSON.stringify([...ids]));
  } catch { /* ignore */ }
}

export function readSavedFilePref(): boolean {
  try {
    return localStorage.getItem(SAVED_KEY) === '1';
  } catch {
    return false;
  }
}

export function writeSavedFilePref(on: boolean): void {
  try {
    localStorage.setItem(SAVED_KEY, on ? '1' : '0');
  } catch { /* ignore */ }
}

/**
 * TA assist: a 1:1 aide is driving. Teacher toggle, or `?ta=1` on the URL for a
 * cart of Chromebooks set up before class.
 */
export function readTaAssistPref(): boolean {
  try {
    const q = new URLSearchParams(window.location.search).get('ta');
    if (q === '1') {
      localStorage.setItem(TA_KEY, '1');
      return true;
    }
    if (q === '0') {
      localStorage.setItem(TA_KEY, '0');
      return false;
    }
    return localStorage.getItem(TA_KEY) === '1';
  } catch {
    return false;
  }
}

export function writeTaAssistPref(on: boolean): void {
  try {
    localStorage.setItem(TA_KEY, on ? '1' : '0');
  } catch { /* ignore */ }
}
