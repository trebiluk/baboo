const KEY = 'archworks-debug';

export function isDebugEnabled(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    if (localStorage.getItem(KEY) === '1') return true;
    const q = new URLSearchParams(window.location.search);
    if (q.get('debug') === '1') {
      localStorage.setItem(KEY, '1');
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function setDebugEnabled(on: boolean): void {
  try {
    if (on) localStorage.setItem(KEY, '1');
    else localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
