import { useCallback, useEffect, useRef, type MouseEvent } from 'react';
import {
  EDGE_POCKET_LONG_PRESS_MS,
  EDGE_POCKET_MOVE_PX,
  openToolsPocket,
} from '../lib/edgePocket';

/** Long-press (~500ms) and right-click on empty canvas open the Tools Edge Pocket. */
export function useCanvasToolsPocket() {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const opened = useRef(false);
  const origin = useRef<{ x: number; y: number } | null>(null);
  const lastEmpty = useRef(false);

  const cancel = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    origin.current = null;
  }, []);

  useEffect(() => () => cancel(), [cancel]);

  const consumeIfOpened = useCallback(() => {
    const hit = opened.current;
    opened.current = false;
    cancel();
    return hit;
  }, [cancel]);

  const armEmptyPress = useCallback((e: PointerEvent, empty: boolean) => {
    lastEmpty.current = empty;
    cancel();
    opened.current = false;
    if (!empty) return false;
    if (e.button === 2) {
      e.preventDefault();
      openToolsPocket();
      opened.current = true;
      return true;
    }
    if (e.button !== 0) return false;
    origin.current = { x: e.clientX, y: e.clientY };
    timer.current = setTimeout(() => {
      openToolsPocket();
      opened.current = true;
      timer.current = null;
    }, EDGE_POCKET_LONG_PRESS_MS);
    return false;
  }, [cancel]);

  const noteMove = useCallback((e: PointerEvent) => {
    if (!origin.current || !timer.current) return;
    const dx = e.clientX - origin.current.x;
    const dy = e.clientY - origin.current.y;
    if (Math.hypot(dx, dy) > EDGE_POCKET_MOVE_PX) cancel();
  }, [cancel]);

  const onContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault();
    if (lastEmpty.current) openToolsPocket();
  }, []);

  return { armEmptyPress, noteMove, consumeIfOpened, cancel, onContextMenu, opened };
}
