import { useRef } from 'react';
import { APP_VERSION } from '../version';
import { useProjectStore } from '../store/useProjectStore';
import { t, tipLoc } from '../data/i18n';

/** Tap = what's new. Hold = Teacher. Floating copy is the one kids can actually find on a phone. */
export function VersionChip({
  floating = false,
  row = false,
  onTeacher,
}: {
  floating?: boolean;
  /** Phone copy that sits in the save row, where nothing else lives (2.13.24). */
  row?: boolean;
  onTeacher?: () => void;
}) {
  const toggleChangelog = useProjectStore((s) => s.toggleChangelog);
  const toggleDebug = useProjectStore((s) => s.toggleDebug);
  const locale = tipLoc(useProjectStore((s) => s.doc.settings));
  const whats = t(locale, 'chrome.whatsNew');
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const onPointerDown = () => {
    clearPress();
    pressTimer.current = setTimeout(() => {
      try { localStorage.setItem('baboo-teacher', '1'); } catch { /* ignore */ }
      window.dispatchEvent(new Event('baboo-teacher'));
      onTeacher?.();
      toggleDebug();
    }, 700);
  };

  return (
    <button
      type="button"
      className={row ? 'ver-row aw-pressable' : `ver-chip aw-pressable${floating ? ' ver-float' : ' ver-chip-header'}`}
      onClick={toggleChangelog}
      onPointerDown={onPointerDown}
      onPointerUp={clearPress}
      onPointerLeave={clearPress}
      onPointerCancel={clearPress}
      title={`${whats} · ${t(locale, 'ver.holdTeacher')}`}
      aria-label={`Baboo v${APP_VERSION}. ${whats}`}
    >
      v{APP_VERSION} · {whats}
    </button>
  );
}
