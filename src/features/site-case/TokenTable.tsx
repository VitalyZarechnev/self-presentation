'use client';

import { CSSProperties, useEffect, useState } from 'react';

import { useTheme } from '@application/theme/ThemeProvider';
import { THEME_LABELS } from '@application/theme/themes';

import Label from '@ui/atoms/typography/Label';

import { readThemeTokens, TTokenValue } from './themeTokens';
import classes from './TokenTable.module.scss';

export default function TokenTable() {
  const { theme, selection, custom } = useTheme();
  const [rows, setRows] = useState<TTokenValue[]>([]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setRows(readThemeTokens(getComputedStyle(document.documentElement))));
    return () => cancelAnimationFrame(frame);
  }, [theme, selection, custom]);

  return (
    <figure className={classes.tokens}>
      <figcaption className={classes.tokens__caption}>
        <Label>:root · {selection === 'custom' ? `Своя (на основе ${THEME_LABELS[theme]})` : THEME_LABELS[theme]}</Label>
        <Label className={classes.tokens__hint}>переключите тему в шапке</Label>
      </figcaption>
      <table className={classes.tokens__table}>
        <tbody>
          {rows.map(({ token, value, isColor }) => (
            <tr key={token}>
              <th scope='row'>
                <Label>{token}</Label>
              </th>
              <td>
                <span className={classes.tokens__value}>
                  {isColor && <i className={classes.tokens__swatch} style={{ '--swatch': value } as CSSProperties} aria-hidden />}
                  <Label>{value}</Label>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
