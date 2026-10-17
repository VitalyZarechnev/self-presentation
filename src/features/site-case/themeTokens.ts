export const THEME_TOKENS = [
  '--surface',
  '--ink',
  '--ink-muted',
  '--accent',
  '--line',
  '--surface-grid-cell',
  '--section-gap',
  '--heading-transform',
] as const;

export type TThemeToken = (typeof THEME_TOKENS)[number];

export type TTokenValue = { token: TThemeToken; value: string; isColor: boolean };

const COLOR_PATTERN = /^(#|rgb|hsl|oklch)/i;

export function readThemeTokens(style: Pick<CSSStyleDeclaration, 'getPropertyValue'>): TTokenValue[] {
  return THEME_TOKENS.map((token) => {
    const value = style.getPropertyValue(token).trim();
    return { token, value, isColor: COLOR_PATTERN.test(value) };
  });
}
