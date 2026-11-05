import { STYLE_TEMPLATES } from '../data/templates';
import { roofStyleName } from './roof';
import { localeOption, roofShown, type Locale } from '../data/i18n';
import type { ProjectSettings } from '../types';

/** The small postcard caption: date · house style · roof, in the student's language (2.13.61). */
export function photoNote(settings: Pick<ProjectSettings, 'styleId' | 'roofStyleId' | 'roofLabel'>, loc: Locale, when = new Date()): string {
  const date = when.toLocaleDateString(localeOption(loc).htmlLang, { year: 'numeric', month: 'long', day: 'numeric' });
  const style = STYLE_TEMPLATES.find((s) => s.id === settings.styleId);
  const roof = settings.roofStyleId ? roofShown(settings, loc, roofStyleName) : (settings.roofLabel ?? '').trim();
  return [date, style && style.id !== 'blank' ? style.name : '', roof].filter(Boolean).join(' · ');
}
