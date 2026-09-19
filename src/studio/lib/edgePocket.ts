import { useProjectStore } from '../store/useProjectStore';

/** Right-click / long-press delay that opens the same Tools Edge Pocket. */
export const EDGE_POCKET_LONG_PRESS_MS = 500;
export const EDGE_POCKET_MOVE_PX = 10;

export function openToolsPocket() {
  useProjectStore.getState().setToolsPinned(true);
}
