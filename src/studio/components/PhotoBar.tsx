import { useEffect } from 'react';
import { t, localeOption, type Locale } from '../data/i18n';
import { useProjectStore } from '../store/useProjectStore';
import { useEscape } from '../hooks/useEscape';
import { handOverPhoto } from '../lib/photo';
import { makePostcard } from '../lib/postcard';
import { APP_VERSION } from '../version';

/**
 * Photo mode bar (2.13.60–61): Snap · Postcard · Done. The view that opens it hands over a
 * `getPicture()` that draws its current picture sharp; this bar does the card and the sharing.
 */
export function PhotoBar({ open, onClose, loc, getPicture, title, note, byline = '' }: {
  open: boolean;
  onClose: () => void;
  loc: Locale;
  getPicture: () => HTMLCanvasElement | null;
  title: string;
  note: string;
  byline?: string;
}) {
  const showToast = useProjectStore((s) => s.showToast);
  useEscape(open, onClose);
  useEffect(() => {
    document.body.classList.toggle('aw-photo', open);
    return () => document.body.classList.remove('aw-photo');
  }, [open]);
  if (!open) return null;
  const go = async (postcard: boolean) => {
    const picture = getPicture();
    if (!picture) { showToast(t(loc, 'photo.fail')); return; }
    const out = postcard
      ? makePostcard(picture, { title, note, byline, footer: `${t(loc, 'photo.madeWith')} · v${APP_VERSION}`, rtl: localeOption(loc).dir === 'rtl' })
      : picture;
    const r = await handOverPhoto(out, title);
    if (r === 'downloaded') showToast(t(loc, postcard ? 'photo.cardSaved' : 'photo.saved'));
    else if (r === 'failed') showToast(t(loc, 'photo.fail'));
  };
  return (
    <div className="photo-bar" role="toolbar" aria-label={t(loc, 'photo.mode')}>
      <span className="photo-hint">{t(loc, 'photo.hint')}</span>
      <button type="button" className="primary-btn aw-pressable" onClick={() => { void go(false); }}>{t(loc, 'photo.snap')}</button>
      <button type="button" className="ghost-btn aw-pressable" onClick={() => { void go(true); }}>{t(loc, 'photo.card')}</button>
      <button type="button" className="ghost-btn aw-pressable" onClick={onClose}>{t(loc, 'photo.done')}</button>
    </div>
  );
}
