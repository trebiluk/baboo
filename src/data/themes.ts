/** Baboo GUI chrome themes — Diego GO: stark default; ink + projector optional. Dream = TechWorks Board only. */
import type { GuiThemeId } from '../types';

export interface ThemeOption {
  id: GuiThemeId;
  name: string;
  blurb: string;
  colorScheme: 'light' | 'dark';
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'stark',
    name: 'Stark',
    blurb: 'Default — white + black · periwinkle flash',
    colorScheme: 'light',
  },
  {
    id: 'ink',
    name: 'Ink',
    blurb: 'Velvet dark · electric blue',
    colorScheme: 'dark',
  },
  {
    id: 'projector',
    name: 'Projector',
    blurb: 'Stage-bright · hard contrast',
    colorScheme: 'light',
  },
];

/** Stark is Baboo GUI default. */
export const DEFAULT_GUI_THEME: GuiThemeId = 'stark';

/** Periwinkle flash — tool active, CTA, focus, selection. */
export const STARK_FLASH = '#6E72F5';
export const STARK_FLASH_SOFT = '#8B8DFF';

export function isGuiThemeId(v: unknown): v is GuiThemeId {
  return v === 'stark' || v === 'ink' || v === 'projector';
}

export function themeColorScheme(id: GuiThemeId): 'light' | 'dark' {
  return id === 'ink' ? 'dark' : 'light';
}

/** Always set data-gui-theme. Null / dream / unknown → stark. */
export function applyGuiTheme(theme: GuiThemeId | null | undefined): void {
  const id: GuiThemeId = isGuiThemeId(theme) ? theme : DEFAULT_GUI_THEME;
  const root = document.documentElement;
  root.setAttribute('data-gui-theme', id);
  root.style.colorScheme = themeColorScheme(id);
}
