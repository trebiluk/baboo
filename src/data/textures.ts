/**
 * Silly texture packs — StyleBot look only (ids + CSS/SVG previews).
 * Debugzy applies to plan/3D; DataBot owns imageBlobRef blobs (never inline in JSON).
 * See SILLY-TEXTURES.md · SCHEMA.md reserved finish.textureId / imageBlobRef.
 */

export type TexturePackId =
  | 'pack:plain'
  | 'pack:christmas'
  | 'pack:confetti'
  | 'pack:brick-joke'
  | 'pack:starry'
  | 'pack:paw'
  | 'import:local';

export type TextureDef = {
  id: TexturePackId;
  name: string;
  blurb: string;
  /** CSS background for chip preview — Chromebook-light, no blur. */
  previewCss: string;
  /** Optional tiny SVG data-uri (≤2KB) for chip art. */
  previewUri?: string;
};

/** First-party packs — procedural / CSS; no huge images. */
export const TEXTURE_PACKS: TextureDef[] = [
  {
    id: 'pack:plain',
    name: 'Plain paint',
    blurb: 'Solid accent — revert / no wallpaper.',
    previewCss: 'linear-gradient(135deg, #c4b5fd 0%, #93c5fd 100%)',
  },
  {
    id: 'pack:christmas',
    name: 'Christmas',
    blurb: 'Soft red–green stripe wallpaper.',
    previewCss:
      'repeating-linear-gradient(45deg, #14532d 0 6px, #991b1b 6px 12px, #fef3c7 12px 14px)',
  },
  {
    id: 'pack:confetti',
    name: 'Confetti',
    blurb: 'Birthday dots on dream indigo.',
    previewCss:
      'radial-gradient(circle at 20% 30%, #22d3ee 0 3px, transparent 4px),' +
      'radial-gradient(circle at 70% 40%, #a855f7 0 3px, transparent 4px),' +
      'radial-gradient(circle at 40% 75%, #3b82f6 0 2px, transparent 3px),' +
      'radial-gradient(circle at 85% 80%, #f472b6 0 2px, transparent 3px),' +
      'linear-gradient(160deg, #132a5c, #0b1a40)',
  },
  {
    id: 'pack:brick-joke',
    name: 'Brick joke',
    blurb: 'Cheeky mini-bricks — not CAD brick.',
    previewCss:
      'repeating-linear-gradient(0deg, #7f1d1d 0 8px, #450a0a 8px 10px),' +
      'repeating-linear-gradient(90deg, transparent 0 14px, #450a0a 14px 16px)',
  },
  {
    id: 'pack:starry',
    name: 'Starry',
    blurb: 'Night sky sprinkle on deep navy.',
    previewCss:
      'radial-gradient(1px 1px at 10% 20%, #f7f9ff 0, transparent 100%),' +
      'radial-gradient(1px 1px at 40% 60%, #22d3ee 0, transparent 100%),' +
      'radial-gradient(1.5px 1.5px at 70% 30%, #a855f7 0, transparent 100%),' +
      'radial-gradient(1px 1px at 85% 75%, #f7f9ff 0, transparent 100%),' +
      'linear-gradient(180deg, #06122b, #132a5c)',
  },
  {
    id: 'pack:paw',
    name: 'Paw print',
    blurb: 'Soft paw dots — seasonal Bearcat wink.',
    previewCss:
      'radial-gradient(circle at 35% 40%, #e85820 0 4px, transparent 5px),' +
      'radial-gradient(circle at 48% 28%, #e85820 0 2.5px, transparent 3.5px),' +
      'radial-gradient(circle at 58% 28%, #e85820 0 2.5px, transparent 3.5px),' +
      'radial-gradient(circle at 52% 22%, #e85820 0 2px, transparent 3px),' +
      'linear-gradient(135deg, #0b1a40, #132a5c)',
  },
];

export function textureName(id: string | null | undefined): string {
  if (!id) return 'None';
  if (id === 'import:local') return 'Imported image';
  return TEXTURE_PACKS.find((p) => p.id === id)?.name ?? id;
}

export function textureDef(id: string | null | undefined): TextureDef | undefined {
  if (!id) return undefined;
  return TEXTURE_PACKS.find((p) => p.id === id);
}
