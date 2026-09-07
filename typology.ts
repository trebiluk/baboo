import type { TypologyInventoryItem, TypologySettings, TypologyShell } from '../types';

/** Stable inventory ids — SCHEMA.md / Curriculum checklists. */
export const TINY_HOME_INVENTORY_IDS = [
  'wet-bath',
  'kitchenette',
  'sleep-loft',
  'utility',
  'storage',
  'hitch-wheels',
  'container-corners',
] as const;

const CORE: Omit<TypologyInventoryItem, 'present'>[] = [
  { id: 'wet-bath', label: 'Wet bath', required: true },
  { id: 'kitchenette', label: 'Kitchenette', required: true },
  { id: 'sleep-loft', label: 'Sleep loft', required: false },
  { id: 'utility', label: 'Utility', required: true },
  { id: 'storage', label: 'Storage', required: true },
];

function item(
  id: string,
  label: string,
  required: boolean,
  present: boolean,
): TypologyInventoryItem {
  return { id, label, required, present };
}

/** Default checklist for a Tiny Home shell (trailer vs shipping-container). */
export function defaultInventoryForShell(shell: TypologyShell): TypologyInventoryItem[] {
  const core = CORE.map((c) =>
    item(c.id, c.label, c.required, c.id === 'sleep-loft' ? false : true),
  );
  if (shell === 'shipping-container') {
    return [
      ...core,
      item('container-corners', 'Container corners', false, true),
      // hitch-wheels absent for container typology
    ];
  }
  if (shell === 'other') {
    return [
      ...core,
      item('hitch-wheels', 'Hitch / wheels', false, false),
      item('container-corners', 'Container corners', false, false),
    ];
  }
  // trailer (default)
  return [
    ...core,
    item('hitch-wheels', 'Hitch / wheels', false, true),
  ];
}

export function defaultTinyHomeTypology(shell: TypologyShell = 'trailer'): TypologySettings {
  return {
    kind: 'tiny-home',
    shell,
    inventory: defaultInventoryForShell(shell),
  };
}

export function shellDisplayName(shell: TypologyShell | undefined): string {
  if (shell === 'shipping-container') return 'Shipping container';
  if (shell === 'other') return 'Other';
  if (shell === 'trailer') return 'Trailer';
  return '';
}

/**
 * Switch shell while preserving `present` for shared inventory ids.
 * Trailer ↔ container swaps hitch-wheels ↔ container-corners.
 */
export function typologyWithShell(
  current: TypologySettings | undefined,
  shell: TypologyShell,
): TypologySettings {
  const next = defaultTinyHomeTypology(shell);
  if (!current?.inventory?.length) return next;
  const presentById = new Map(current.inventory.map((i) => [i.id, i.present]));
  // SCHEMA: trailer hitch-wheels ↔ container-corners swap present bit
  const hitch = presentById.get('hitch-wheels');
  const corners = presentById.get('container-corners');
  if (shell === 'shipping-container' && hitch !== undefined && !presentById.has('container-corners')) {
    presentById.set('container-corners', hitch);
  }
  if (shell === 'trailer' && corners !== undefined && !presentById.has('hitch-wheels')) {
    presentById.set('hitch-wheels', corners);
  }
  return {
    ...next,
    inventory: next.inventory.map((i) => ({
      ...i,
      present: presentById.has(i.id) ? Boolean(presentById.get(i.id)) : i.present,
    })),
  };
}

export function typologyTogglePresent(
  typology: TypologySettings,
  id: string,
  present: boolean,
): TypologySettings {
  return {
    ...typology,
    inventory: typology.inventory.map((i) => (i.id === id ? { ...i, present } : i)),
  };
}
