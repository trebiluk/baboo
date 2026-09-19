import { useProjectStore, type ToastPlate } from '../store/useProjectStore';
import { tipLoc, t } from '../data/i18n';

const MARK: Record<ToastPlate['tone'], string> = {
  ok: 'toast.mark.ok',
  miss: 'toast.mark.miss',
  cap: 'toast.mark.cap',
  info: 'toast.mark.info',
};

export function Toast() {
  const toast = useProjectStore((s) => s.toast);
  const clearToast = useProjectStore((s) => s.clearToast);
  const locale = tipLoc(useProjectStore((s) => s.doc.settings));
  if (!toast) return null;
  return (
    <button
      type="button"
      className={`toast toast-${toast.tone}${toast.cap ? ' toast-cap' : ''}`}
      role="status"
      onClick={clearToast}
    >
      <span className="toast-mark" aria-hidden="true">{t(locale, MARK[toast.tone])}</span>
      <span className="toast-copy">
        <strong>{toast.title}</strong>
        {toast.body ? <span className="toast-body">{toast.body}</span> : null}
      </span>
    </button>
  );
}
