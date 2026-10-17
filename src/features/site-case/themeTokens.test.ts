import { readThemeTokens, THEME_TOKENS } from './themeTokens';

describe('readThemeTokens', () => {
  test('reads every token and flags colour values', () => {
    const values: Record<string, string> = { '--surface': ' #0e2233 ', '--heading-transform': 'uppercase' };
    const rows = readThemeTokens({ getPropertyValue: (name: string) => values[name] ?? '' });

    expect(rows.map((row) => row.token)).toEqual([...THEME_TOKENS]);
    expect(rows[0]).toEqual({ token: '--surface', value: '#0e2233', isColor: true });
    expect(rows.find((row) => row.token === '--heading-transform')).toEqual({
      token: '--heading-transform',
      value: 'uppercase',
      isColor: false,
    });
  });
});
