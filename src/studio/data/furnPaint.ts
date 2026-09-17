/** Classroom furniture paints — hex stored on the piece. */
export type FurnPaint = { id: string; hex: string | null; label: string };

export const FURN_PAINTS: FurnPaint[] = [
  { id: 'natural', hex: null, label: 'Natural' },
  { id: 'white', hex: '#F4F0E8', label: 'White' },
  { id: 'cream', hex: '#E8D4B0', label: 'Cream' },
  { id: 'navy', hex: '#3D4F6F', label: 'Navy' },
  { id: 'forest', hex: '#3A5234', label: 'Forest' },
  { id: 'blush', hex: '#E8B4B4', label: 'Blush' },
  { id: 'sun', hex: '#E8C04A', label: 'Sun' },
  { id: 'sky', hex: '#7EB3D4', label: 'Sky' },
  { id: 'charcoal', hex: '#3A3F46', label: 'Charcoal' },
  { id: 'terra', hex: '#C47850', label: 'Clay' },
  { id: 'mint', hex: '#8FBEB0', label: 'Mint' },
  { id: 'plum', hex: '#7A5A78', label: 'Plum' },
];

export function samePaint(a: string | null | undefined, b: string | null): boolean {
  if (!a && !b) return true;
  return (a ?? '').toLowerCase() === (b ?? '').toLowerCase();
}
