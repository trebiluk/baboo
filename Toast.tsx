import { useProjectStore } from '../store/useProjectStore';

export function Toast() {
  const toast = useProjectStore((s) => s.toast);
  if (!toast) return null;
  return <div className="toast" role="status">{toast}</div>;
}
