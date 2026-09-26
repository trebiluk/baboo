/** Baboo GUI chrome themes — Stark default: white + black + periwinkle flash. Dream = TechWorks only. */
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
  {
    id: 'blocky',
    name: 'Blocky',
    blurb: 'Chunky cubes · grass and dirt — Minecraft-inspired',
    colorScheme: 'light',
  },
];

/** Stark is Baboo GUI default. */
export const DEFAULT_GUI_THEME: GuiThemeId = 'stark';

/** Periwinkle flash — tool active, CTA, focus, selection. */
export const STARK_FLASH = '#6E72F5';
export const STARK_FLASH_SOFT = '#8B8DFF';

export function isGuiThemeId(v: unknown): v is GuiThemeId {
  return v === 'stark' || v === 'ink' || v === 'projector' || v === 'blocky';
}

export function themeColorScheme(id: GuiThemeId): 'light' | 'dark' {
  return id === 'ink' ? 'dark' : 'light';
}

/** Always set data-gui-theme. Null / dream / unknown → stark.
 * Device dark mode never wins. Only Ink, chosen from the gear, is dark. */
export function applyGuiTheme(theme: GuiThemeId | null | undefined): void {
  const id: GuiThemeId = isGuiThemeId(theme) ? theme : DEFAULT_GUI_THEME;
  const root = document.documentElement;
  const scheme = themeColorScheme(id) === 'dark' ? 'only dark' : 'only light';
  root.setAttribute('data-gui-theme', id);
  root.style.setProperty('color-scheme', scheme);
  const meta = document.querySelector('meta[name="color-scheme"]');
  if (meta) meta.setAttribute('content', scheme);
  const bar = document.querySelector('meta[name="theme-color"]');
  if (bar) bar.setAttribute('content', id === 'ink' ? '#05070d' : '#FFFFFF');
}
