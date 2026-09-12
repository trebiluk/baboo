import type { Floor, Opening, Tool } from '../types';
import { listInteriorFaces } from '../lib/rooms';

export type SkillLevel = 'novice' | 'beginner' | 'moderate' | 'expert';

export const SKILL_LEVELS: {
  id: SkillLevel;
  label: string;
  blurb: string;
  help: string;
}[] = [
  {
    id: 'novice',
    label: 'Novice',
    blurb: 'First time — we go slow',
    help: 'Extra tips. Sketch, walls, doors, and pan.',
  },
  {
    id: 'beginner',
    label: 'Beginner',
    blurb: 'Learning — extra hints',
    help: 'Adds windows, room names, and size labels, with a next-step coach.',
  },
  {
    id: 'moderate',
    label: 'Moderate',
    blurb: 'Rolling — full toolkit',
    help: 'Furniture and plants plus the usual tools. Tips stay quiet.',
  },
  {
    id: 'expert',
    label: 'Expert',
    blurb: 'Pro — quiet chrome',
    help: 'Interior walls, duplicate, rotate, layers. Chrome stays out of the way.',
  },
];

export const DEFAULT_SKILL_LEVEL: SkillLevel = 'beginner';
const SKILL_PREF_KEY = 'baboo-skill-level';

const RANK: Record<SkillLevel, number> = {
  novice: 0,
  beginner: 1,
  moderate: 2,
  expert: 3,
};

const TOOL_MIN_RANK: Record<Tool, number> = {
  select: 0,
  sketch: 0,
  wall: 0,
  door: 0,
  pan: 0,
  window: 1,
  room: 1,
  dim: 1,
  note: 1,
  furniture: 2,
  plant: 2,
};

export function isSkillLevel(v: unknown): v is SkillLevel {
  return v === 'novice' || v === 'beginner' || v === 'moderate' || v === 'expert';
}

export function skillRank(level: SkillLevel): number {
  return RANK[level] ?? 1;
}

export function skillInfo(level: SkillLevel) {
  return SKILL_LEVELS.find((s) => s.id === level) ?? SKILL_LEVELS[1];
}

export function toolsForLevel(level: SkillLevel): Tool[] {
  const rank = skillRank(level);
  const order: Tool[] = ['select', 'sketch', 'wall', 'door', 'window', 'furniture', 'room', 'dim', 'note', 'plant', 'pan'];
  return order.filter((t) => TOOL_MIN_RANK[t] <= rank);
}

/** Tools that unlock at the next skill step — shown locked so kids see what’s coming. */
export function upcomingTools(level: SkillLevel): Tool[] {
  const next = skillRank(level) + 1;
  if (next > 3) return [];
  const order: Tool[] = ['select', 'sketch', 'wall', 'door', 'window', 'furniture', 'room', 'dim', 'note', 'plant', 'pan'];
  return order.filter((t) => TOOL_MIN_RANK[t] === next);
}

export function isToolUnlocked(tool: Tool, level: SkillLevel): boolean {
  return TOOL_MIN_RANK[tool] <= skillRank(level);
}

export function levelRequiredFor(tool: Tool): SkillLevel {
  const need = TOOL_MIN_RANK[tool] ?? 0;
  return SKILL_LEVELS[need]?.id ?? 'beginner';
}

export function toastMs(level: SkillLevel, base = 2400): number {
  const rank = skillRank(level);
  if (rank <= 0) return base + 1400;
  if (rank === 1) return base + 600;
  if (rank >= 3) return Math.max(1400, base - 800);
  return base;
}

export function readSkillPref(): SkillLevel {
  try {
    const v = localStorage.getItem(SKILL_PREF_KEY);
    if (isSkillLevel(v)) return v;
  } catch { /* ignore */ }
  return DEFAULT_SKILL_LEVEL;
}

export function writeSkillPref(level: SkillLevel): void {
  try { localStorage.setItem(SKILL_PREF_KEY, level); } catch { /* ignore */ }
}

export type CoachStep = {
  id: string;
  title: string;
  body: string;
  tool?: Tool;
  panel?: 'contest' | 'teach';
};

function nextDogHouseCoach(floor: Floor, level: SkillLevel): CoachStep | null {
  const walls = floor.walls.length;
  const doors = floor.openings.filter((o: Opening) => o.type === 'door');
  const sketches = (floor.sketches ?? []).length;
  const closed = walls > 2 && listInteriorFaces(floor.nodes, floor.walls).length > 0;
  const trees = (floor.landscape ?? []).filter((x) => x.kind === 'tree').length;
  const dims = (floor.dimensions ?? []).length;

  if (walls === 0 && sketches === 0) {
    return {
      id: 'sketch',
      title: 'Sketch Baboo a den',
      body: 'Tools → Sketch. Drag a small box — a dog house is not a people bedroom.',
      tool: 'sketch',
    };
  }
  if (walls === 0) {
    return {
      id: 'trace',
      title: 'Hard-line the den',
      body: 'Tap the sketch → Trace, or pick Wall and click along it.',
      tool: 'wall',
    };
  }
  if (!closed) {
    return {
      id: 'close',
      title: 'Close the den',
      body: 'Walls have to meet. Rain stays out only when it’s a box.',
      tool: 'wall',
    };
  }
  if (doors.length === 0) {
    return {
      id: 'door',
      title: 'A way in — dog-sized',
      body: 'Pick Door, click a wall, then tap it and pick 12" or 18".',
      tool: 'door',
    };
  }
  if (doors[0].width > 1.75) {
    return {
      id: 'dog-door',
      title: 'Shrink that door',
      body: 'That’s a people door. Tap it → 12" or 18". Heat pours out of a 3-foot opening.',
      tool: 'select',
    };
  }
  if (Math.abs(doors[0].t - 0.5) < 0.12) {
    return {
      id: 'offset',
      title: 'Slide it off-center',
      body: 'A door in the middle lets wind hit the bed. Drag it toward a corner.',
      tool: 'select',
    };
  }
  if (dims === 0 && isToolUnlocked('dim', level)) {
    return {
      id: 'dim',
      title: 'Label the size',
      body: 'Size tool → two clicks on a wall. The book wants numbers you can read.',
      tool: 'dim',
    };
  }
  if (trees === 0 && isToolUnlocked('plant', level)) {
    return {
      id: 'shade',
      title: 'Shade for summer',
      body: 'Plant a tree beside the den. Textbook: shade in July.',
      tool: 'plant',
    };
  }
  return {
    id: 'judge',
    title: 'Ask Baboo to judge',
    body: 'Open Contest. She scores this den against the textbook list.',
    panel: 'contest',
  };
}

/** Next help step from what is missing on the plan — quieter as skill goes up. */
export function nextCoach(level: SkillLevel, floor: Floor, styleId?: string): CoachStep | null {
  const rank = skillRank(level);
  if (rank >= 3) return null;
  if (styleId === 'dog-house') return nextDogHouseCoach(floor, level);

  const walls = floor.walls.length;
  const doors = floor.openings.filter((o: Opening) => o.type === 'door').length;
  const windows = floor.openings.filter((o: Opening) => o.type === 'window').length;
  const rooms = (floor.rooms ?? []).length;
  const sketches = (floor.sketches ?? []).length;
  const closed = walls > 2 && listInteriorFaces(floor.nodes, floor.walls).length > 0;

  if (rank === 2) {
    if (walls === 0) {
      return {
        id: 'wall',
        title: 'Let’s draw a wall',
        body: 'Tools → Wall. Two clicks: start corner, then the end.',
        tool: 'wall',
      };
    }
    return null;
  }

  if (walls === 0 && sketches === 0) {
    return {
      id: 'sketch',
      title: 'Sketch the house first',
      body: 'Open Tools, pick Sketch. Drag like a pencil. Architecture starts on paper.',
      tool: 'sketch',
    };
  }
  if (walls === 0) {
    return {
      id: 'trace',
      title: 'Now hard-line a wall',
      body: 'Tap the sketch → Trace, or pick Wall and click along it.',
      tool: 'wall',
    };
  }
  if (!closed) {
    return {
      id: 'close',
      title: 'Close the box',
      body: 'Keep going until the walls meet. That’s when it becomes a room.',
      tool: 'wall',
    };
  }
  if (doors === 0) {
    return {
      id: 'door',
      title: 'Add a door so we can walk in',
      body: 'Pick Door, then click right on a wall.',
      tool: 'door',
    };
  }
  if (rank >= 1 && windows === 0) {
    return {
      id: 'window',
      title: 'Let some light in',
      body: 'Pick Window, then click a wall across from the door.',
      tool: 'window',
    };
  }
  if (rank >= 1 && rooms === 0) {
    return {
      id: 'room',
      title: 'Give the room a name',
      body: 'Room tool → Living or Kitchen → click inside the walls.',
      tool: 'room',
    };
  }
  if (rank >= 1) {
    return {
      id: 'done',
      title: 'You did it',
      body: 'A closed room with a door. Open Teach for a challenge, or raise your level in Settings.',
    };
  }
  return {
    id: 'novice-done',
    title: 'You have a plan',
    body: 'Walk the walls. Open Teach for the next step, or switch to Beginner in Settings for windows and names.',
  };
}

export const NOVICE_UNIT_STEPS = [
  'Open Tools on the left. Pick Sketch — draw the rooms like a pencil.',
  'Tap the sketch → Trace, or pick Wall and hard-line over it.',
  'Pick Door. Click on one wall so we can walk in.',
  'Read the size labels. Do they feel like a real room?',
];
