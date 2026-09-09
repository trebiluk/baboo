import { useEffect, useState } from 'react';
import { DEDICATION_LINE, COPYRIGHT_LINE } from './HelpModal';
import { BABOO_LOGO } from '../logo';

const KEY = 'baboo-hello-seen-v1';

/** Optional first-run only — never every launch (DEDICATION.md). */
export function DedicationOnce() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === '1') return;
      setOpen(true);
    } catch {
      /* private mode — skip */
    }
  }, []);

  const dismiss = () => {
    try { localStorage.setItem(KEY, '1'); } catch { /* ignore */ }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop dedication-once" onClick={dismiss}>
      <div
        className="panel-card dedication-card hello-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="dedication-title"
      >
        <img
          className="hello-logo"
          src={BABOO_LOGO}
          alt=""
          width={88}
          height={88}
          decoding="async"
        />
        <h2 id="dedication-title" className="dedication-card-title">Hi — I'm Baboo</h2>
        <p className="hello-lead">
          Draw a house for class. I'll cheer you on, then tuck out of the way so the grid stays big.
        </p>
        <p className="dedication-line">{DEDICATION_LINE}</p>
        <p className="dedication-meta">
          Quiet thank-you — you'll find this again under Help · About.
        </p>
        <p className="copyright-line">{COPYRIGHT_LINE}</p>
        <button type="button" className="primary-btn aw-pressable" onClick={dismiss}>
          Let's draw
        </button>
      </div>
    </div>
  );
}
