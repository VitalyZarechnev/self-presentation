'use client';

import { CSSProperties, useEffect, useState } from 'react';

import {
  ACCENT_SHAPE,
  buildCustomVars,
  CUSTOM_VAR_NAMES,
  DEFAULT_ACCENT_HUE,
  DEFAULT_SURFACE_HUE,
  defaultCustomTheme,
  isDarkTheme,
  resolveAccent,
  resolveNeutrals,
  SURFACE_PREVIEW,
  toDesignTokens,
} from '@application/theme/customTheme';
import { useTheme } from '@application/theme/ThemeProvider';

import Label from '@ui/atoms/typography/Label';

import HuePicker from './HuePicker';
import classes from './TokenSandbox.module.scss';

const COPY_RESET_MS = 2400;
const UNTOUCHED = 'как в теме · сдвиньте, чтобы выбрать свой';

type TCopyState = 'idle' | 'copied' | 'failed';

const ratio = (value: number): string => `${value.toFixed(1)}:1`;

export default function TokenSandbox() {
  const { theme, selection, custom, updateCustom, resetCustom } = useTheme();
  const [baseSurface, setBaseSurface] = useState('');
  const [copy, setCopy] = useState<TCopyState>('idle');
  const [exported, setExported] = useState('');

  const active = selection === 'custom' && custom ? custom : defaultCustomTheme(theme);
  const dark = isDarkTheme(active.base);
  const surfaceHue = active.surfaceHue ?? DEFAULT_SURFACE_HUE[active.base];
  const accentHue = active.accentHue ?? DEFAULT_ACCENT_HUE[active.base];

  const neutrals = active.surfaceHue === null ? null : resolveNeutrals({ hue: surfaceHue, dark });
  const surface = neutrals?.surface ?? baseSurface;
  const accent = active.accentHue === null || !surface ? null : resolveAccent({ hue: accentHue, surface, dark });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (active.surfaceHue === null) setBaseSurface(getComputedStyle(document.documentElement).getPropertyValue('--surface').trim());
    });
    return () => cancelAnimationFrame(frame);
  }, [theme, active.surfaceHue]);

  useEffect(() => {
    if (copy === 'idle') return undefined;
    const timer = setTimeout(() => setCopy('idle'), COPY_RESET_MS);
    return () => clearTimeout(timer);
  }, [copy]);

  const handleCopy = async (): Promise<void> => {
    const style = getComputedStyle(document.documentElement);
    const current = Object.fromEntries(CUSTOM_VAR_NAMES.map((name) => [name, style.getPropertyValue(name).trim()]));
    const json = JSON.stringify(toDesignTokens({ ...current, ...buildCustomVars(active, baseSurface) }), null, 2);
    setExported(json);
    try {
      await navigator.clipboard.writeText(json);
      setCopy('copied');
    } catch {
      setCopy('failed');
    }
  };

  return (
    <section className={classes.sandbox} aria-label='Песочница цветов'>
      <div className={classes.sandbox__head}>
        <Label className={classes.sandbox__title}>Песочница цветов</Label>
        <Label className={classes.sandbox__hint}>правки сразу применяются ко всему сайту как тема «Своя»</Label>
      </div>

      <HuePicker
        label='Фон и текст'
        hue={surfaceHue}
        track={SURFACE_PREVIEW}
        valueText={neutrals ? `оттенок ${Math.round(surfaceHue)}°, текст ${ratio(neutrals.inkContrast)}` : 'как в теме'}
        readout={
          neutrals ? (
            <>
              <i className={classes.sandbox__swatch} style={{ '--swatch': neutrals.surface } as CSSProperties} aria-hidden />
              <Label>
                текст {ratio(neutrals.inkContrast)} · вторичный {ratio(neutrals.mutedContrast)}
              </Label>
            </>
          ) : (
            <Label>{UNTOUCHED}</Label>
          )
        }
        onChange={(hue) => updateCustom({ surfaceHue: hue })}
      />

      <HuePicker
        label='Акцент'
        hue={accentHue}
        track={ACCENT_SHAPE[dark ? 'dark' : 'light']}
        valueText={accent ? `оттенок ${Math.round(accentHue)}°, контраст ${ratio(accent.contrast)}` : 'как в теме'}
        readout={
          accent ? (
            <>
              <i className={classes.sandbox__swatch} style={{ '--swatch': accent.hex } as CSSProperties} aria-hidden />
              <Label>
                {accent.hex} · {ratio(accent.contrast)}
                {accent.adjusted ? ' · светлота подстроена' : ''}
              </Label>
            </>
          ) : (
            <Label>{UNTOUCHED}</Label>
          )
        }
        onChange={(hue) => updateCustom({ accentHue: hue })}
      />

      <div className={classes.sandbox__actions}>
        <button type='button' className={classes.sandbox__button} onClick={handleCopy}>
          Скопировать токены (JSON)
        </button>
        <button type='button' className={classes.sandbox__button} disabled={!custom} onClick={resetCustom}>
          Вернуть как было
        </button>
        <span role='status' aria-live='polite' className={classes.sandbox__status}>
          {copy === 'copied' && <Label>Скопировано в буфер</Label>}
          {copy === 'failed' && <Label>Не удалось скопировать — JSON ниже</Label>}
        </span>
      </div>

      {copy === 'failed' && exported && (
        <pre className={classes.sandbox__json}>
          <code>{exported}</code>
        </pre>
      )}
    </section>
  );
}
