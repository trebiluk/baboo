import type { CatalogItem } from '../types';

export const FURNITURE_CATALOG: CatalogItem[] = [
  { id: 'bed-twin', name: 'Twin Bed', category: 'Bedroom', w: 3.25, h: 6.25, color: '#3d5a80' },
  { id: 'bed-queen', name: 'Queen Bed', category: 'Bedroom', w: 5, h: 6.5, color: '#3d5a80' },
  { id: 'nightstand', name: 'Nightstand', category: 'Bedroom', w: 1.5, h: 1.5, color: '#5c4a3a' },
  { id: 'dresser', name: 'Dresser', category: 'Bedroom', w: 5, h: 1.75, color: '#5c4a3a' },
  { id: 'closet', name: 'Closet', category: 'Storage', w: 4, h: 2, color: '#6a5a4a' },
  { id: 'storage-shelf', name: 'Storage Shelf', category: 'Storage', w: 3, h: 1.5, color: '#7a6a55' },
  { id: 'sofa', name: 'Sofa', category: 'Living', w: 7, h: 3, color: '#4a6741' },
  { id: 'chair', name: 'Armchair', category: 'Living', w: 2.5, h: 2.5, color: '#4a6741' },
  { id: 'coffee-table', name: 'Coffee Table', category: 'Living', w: 4, h: 2, color: '#6b5344' },
  { id: 'dining-table', name: 'Dining Table', category: 'Kitchen', w: 5, h: 3, color: '#6b5344' },
  { id: 'dining-chair', name: 'Dining Chair', category: 'Kitchen', w: 1.5, h: 1.5, color: '#7a6548' },
  { id: 'fridge', name: 'Refrigerator', category: 'Kitchen', w: 3, h: 2.5, color: '#6a7a8a' },
  { id: 'stove', name: 'Stove', category: 'Kitchen', w: 2.5, h: 2.5, color: '#555555' },
  { id: 'sink', name: 'Kitchen Sink', category: 'Kitchen', w: 3, h: 2, color: '#8a9aaa' },
  { id: 'toilet', name: 'Toilet', category: 'Bath', w: 1.5, h: 2.5, color: '#9aa8b5' },
  { id: 'bathtub', name: 'Bathtub', category: 'Bath', w: 5, h: 2.5, color: '#8a9aaa' },
  { id: 'desk', name: 'Desk', category: 'Office', w: 4, h: 2, color: '#5c4a3a' },
  /* Utility — Diego: common-sense spaces */
  { id: 'water-heater', name: 'Water Heater', category: 'Utility', w: 2, h: 2, color: '#708090' },
  { id: 'mech-closet', name: 'Mech Closet', category: 'Utility', w: 3, h: 3, color: '#5a6670' },
  { id: 'washer', name: 'Washer', category: 'Utility', w: 2.5, h: 2.5, color: '#6a7888' },
  { id: 'dryer', name: 'Dryer', category: 'Utility', w: 2.5, h: 2.5, color: '#6a7888' },
];
