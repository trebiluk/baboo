import { useProjectStore } from '../store/useProjectStore';
import { nextTip } from './tips';
import type { TipId } from './tips';

/**
 * The one tip Baboo would show right now, or null.
 *
 * Shared so the tip card and the empty-plan CTA cannot both say "click start,
 * click end" at the same moment — the curriculum allows one tip on screen.
 */
export function useNextTip(): TipId | null {
  const floor = useProjectStore((s) => s.doc.floors[0]);
  const showTips = useProjectStore((s) => s.showTips);
  const tipsDone = useProjectStore((s) => s.tipsDone);
  const tipPending = useProjectStore((s) => s.tipPending);
  const savedFile = useProjectStore((s) => s.savedFile);
  const taAssist = useProjectStore((s) => s.taAssist);

  return nextTip({
    showTips,
    progress: {
      walls: floor.walls.length,
      doors: floor.openings.filter((o) => o.type === 'door').length,
      savedFile,
      drewSomething: floor.walls.length > 0 || (floor.sketches ?? []).length > 0,
    },
    done: tipsDone,
    pending: tipPending,
    taAssist,
  });
}
