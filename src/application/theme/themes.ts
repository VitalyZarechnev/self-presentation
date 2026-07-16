export const THEMES = ['barely-there', 'blueprint'] as const;

export type TTheme = (typeof THEMES)[number];

export const DEFAULT_THEME: TTheme = 'blueprint';

export const THEME_COOKIE = 'ui-theme';

export const THEME_LABELS: Record<TTheme, string> = {
  'barely-there': 'Barely-There',
  blueprint: 'Blueprint',
};

export function isTheme(value: string | null | undefined): value is TTheme {
  return value != null && (THEMES as readonly string[]).includes(value);
}
