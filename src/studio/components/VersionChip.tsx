import { useRef } from 'react';
import { APP_VERSION } from '../version';
import { useProjectStore } from '../store/useProjectStore';

/** Tap = what's new. Hold = Teacher. Floating copy is the one kids can actually find on a phone. */
export function VersionChip({
  floating = false,
  onTeacher,
}: {
  floating?: boolean;
  onTeacher?: () => void;
}) {
  const toggleChangelog = useProjectStore((s) => s.toggleChangelog);
  const toggleDebug = useProjectStore((s) => s.toggleDebug);
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
      className={`ver-chip aw-pressable${floating ? ' ver-float' : ' ver-chip-header'}`}
      onClick={toggleChangelog}
      onPointerDown={onPointerDown}
      onPointerUp={clearPress}
      onPointerLeave={clearPress}
      onPointerCancel={clearPress}
      title="What's new · long-press for Teacher"
      aria-label={`Baboo version ${APP_VERSION}. Tap for what's new.`}
    >
      v{APP_VERSION}
    </button>
  );
}
