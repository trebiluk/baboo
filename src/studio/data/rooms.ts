import type { RoomKind } from '../types';

export type RoomType = {
  id: RoomKind;
  name: string;
  blurb: string;
  /** Quiet wash on the plan — low chroma, stark-safe. */
  color: string;
};

/** Space-planning kinds (Matteson rooms / required-spaces). */
export const ROOM_CATALOG: RoomType[] = [
  { id: 'entry', name: 'Entry', blurb: 'Front door · first step in', color: '#D6D3D1' },
  { id: 'living', name: 'Living', blurb: 'Sit · gather · everyday', color: '#C5D4C1' },
  { id: 'kitchen', name: 'Kitchen', blurb: 'Sink · stove · fridge', color: '#E8D5B5' },
  { id: 'dining', name: 'Dining', blurb: 'Table · eat together', color: '#E2D4C4' },
  { id: 'bedroom', name: 'Bedroom', blurb: 'Sleep · quiet', color: '#C9D4E8' },
  { id: 'bath', name: 'Bath', blurb: 'Toilet · tub or shower', color: '#C5DDE0' },
  { id: 'office', name: 'Office', blurb: 'Desk · homework', color: '#D0D5E0' },
  { id: 'utility', name: 'Utility', blurb: 'Washer · water heater', color: '#D4D0C8' },
  { id: 'storage', name: 'Storage', blurb: 'Closet · shelves', color: '#D9D3C7' },
  { id: 'outdoor', name: 'Outdoor', blurb: 'Porch · yard', color: '#C5D4B8' },
  { id: 'other', name: 'Other', blurb: 'Name it yourself', color: '#D4D4D8' },
];

export function roomType(kind: RoomKind): RoomType {
  return ROOM_CATALOG.find((r) => r.id === kind) ?? ROOM_CATALOG[ROOM_CATALOG.length - 1];
}

export const DEFAULT_ROOM_KIND: RoomKind = 'living';
