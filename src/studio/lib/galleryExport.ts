import type { ProjectDocument, TypologyShell } from '../types';
import { APP_VERSION } from '../version';
import { STYLE_TEMPLATES } from '../data/templates';
import { roofStyleName } from './roof';
import { judgeDogHouse, ribbonLabel } from './contest';

/** SCHEMA.md — gallery export (FERPA alias-only; Chromebook lean — no blob bytes). */
export const GALLERY_CARD_FORMAT = 'archworks-gallery-card' as const;

export const DEFAULT_GALLERY_ALIAS = 'Nova';

export type GalleryCardDocument = {
  format: typeof GALLERY_CARD_FORMAT;
  meta: {
    appVersion: string;
    alias: string;
    title: string;
    styleName: string;
    roofLabel: string;
    /** Tiny Home shell only; null for regular houses. */
    shell: TypologyShell | null;
    /** Best Dog House ribbon when judged; omit for other styles. */
    contestRibbon?: string | null;
    areaSqFt: number | null;
    reflection: string;
    createdAt: string;
    /** Pack / import id only — never image bytes. */
    textureId: string | null;
  };
  assets: {
    /** Reserved for Debugzy plan raster — omit bytes in MVP. */
    planPng: string | null;
    view3dPng: string | null;
  };
};

export type GalleryCardOptions = {
  /** Public share alias — never legal name / email. */
  alias?: string;
  reflection?: string;
};

function sanitizeAlias(raw: string | undefined): string {
  const trimmed = (raw ?? '').trim();
  if (!trimmed) return DEFAULT_GALLERY_ALIAS;
  // Strip anything that looks like an email or multi-token legal last+first dump
  if (trimmed.includes('@')) return DEFAULT_GALLERY_ALIAS;
  return trimmed.slice(0, 40);
}

function styleDisplayName(doc: ProjectDocument): string {
  const id = doc.settings.styleId ?? doc.meta.styleId;
  return STYLE_TEMPLATES.find((t) => t.id === id)?.name ?? id;
}

function roofDisplayLabel(doc: ProjectDocument): string {
  const label = doc.settings.roofLabel?.trim();
  if (label) return label;
  const id = doc.settings.roofStyleId;
  return id ? roofStyleName(id) : 'None';
}

function tinyHomeShell(doc: ProjectDocument): TypologyShell | null {
  const isTiny =
    doc.settings.styleId === 'tiny-home' || doc.settings.typology?.kind === 'tiny-home';
  if (!isTiny) return null;
  return doc.settings.typology?.shell ?? 'trailer';
}

/** Build lean `archworks-gallery-card` payload (SHARE-GALLERY.md · SCHEMA.md). */
export function buildGalleryCard(
  doc: ProjectDocument,
  opts: GalleryCardOptions = {},
): GalleryCardDocument {
  return {
    format: GALLERY_CARD_FORMAT,
    meta: {
      appVersion: APP_VERSION,
      alias: sanitizeAlias(opts.alias),
      title: (doc.meta.title || 'Untitled plan').trim() || 'Untitled plan',
      styleName: styleDisplayName(doc),
      roofLabel: roofDisplayLabel(doc),
      shell: tinyHomeShell(doc),
      contestRibbon: doc.settings.styleId === 'dog-house'
        ? ribbonLabel(judgeDogHouse(doc.floors[0], { roofStyleId: doc.settings.roofStyleId }).ribbon)
        : null,
      areaSqFt: null,
      reflection: (opts.reflection ?? '').trim().slice(0, 500),
      createdAt: new Date().toISOString(),
      textureId: doc.settings.textureId ?? null,
    },
    assets: {
      planPng: null,
      view3dPng: null,
    },
  };
}

function safeFilenamePart(s: string): string {
  return s.replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-') || 'card';
}

/** Download gallery card JSON — no PNG/blob bytes. */
export function downloadGalleryCard(card: GalleryCardDocument): void {
  const blob = new Blob([JSON.stringify(card, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const aliasPart = safeFilenamePart(card.meta.alias);
  const titlePart = safeFilenamePart(card.meta.title);
  a.download = `${aliasPart}-${titlePart}-gallery-card.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportGalleryCardFile(
  doc: ProjectDocument,
  opts: GalleryCardOptions = {},
): GalleryCardDocument {
  const card = buildGalleryCard(doc, opts);
  downloadGalleryCard(card);
  return card;
}
