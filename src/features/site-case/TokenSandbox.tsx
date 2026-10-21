'use client';

import { CSSProperties, useEffect, useState } from 'react';

import { useLocale } from '@application/locale/LocaleProvider';
import {
  ACCENT_SHAPE,
  buildCustomVars,
  clearOfStatus,
  CUSTOM_VAR_NAMES,
  DEFAULT_ACCENT_HUE,
  DEFAULT_SURFACE_HUE,
  defaultCustomTheme,
  isDarkTheme,
  resolveAccent,
  resolveNeutrals,
  STATUS_LABELS,
  statusHueBands,
  SURFACE_PREVIEW,
  toDesignTokens,
  TStatus,
} from '@application/theme/customTheme';
import { useTheme } from '@application/theme/ThemeProvider';

import Label from '@ui/atoms/typography/Label';

import HuePicker from './HuePicker';
import classes from './TokenSandbox.module.scss';

const COPY_RESET_MS = 2400;
const MESSAGES = {
  ru: {
    untouched: 'как в теме · сдвиньте, чтобы выбрать свой',
    asTheme: 'как в теме',
    bandsNote: 'Притушенные участки заняты цветами роста и падения: акцент их перепрыгивает',
    avoids: (status: string) => ` · обходит цвет «${status}»`,
    title: 'Песочница цветов',
    hint: 'правки сразу применяются ко всему сайту как тема «Своя»',
    surface: 'Фон и текст',
    accent: 'Акцент',
    hue: 'оттенок',
    text: 'текст',
    muted: 'вторичный',
    contrast: 'контраст',
    adjusted: ' · светлота подстроена',
    copy: 'Скопировать токены (JSON)',
    reset: 'Вернуть как было',
    copied: 'Скопировано в буфер',
    failed: 'Не удалось скопировать — JSON ниже',
  },
  en: {
    untouched: 'as in the theme · drag to pick your own',
    asTheme: 'as in the theme',
    bandsNote: 'Dimmed stretches belong to the rise and fall colours: the accent jumps over them',
    avoids: (status: string) => ` · steers clear of “${status}”`,
    title: 'Colour sandbox',
    hint: 'changes apply to the whole site at once as the “Custom” theme',
    surface: 'Background and text',
    accent: 'Accent',
    hue: 'hue',
    text: 'text',
    muted: 'secondary',
    contrast: 'contrast',
    adjusted: ' · lightness adjusted',
    copy: 'Copy tokens (JSON)',
    reset: 'Reset',
    copied: 'Copied to clipboard',
    failed: 'Could not copy — the JSON is below',
  },
} as const;

type TCopyState = 'idle' | 'copied' | 'failed';

const ratio = (value: number): string => `${value.toFixed(1)}:1`;

export default function TokenSandbox() {
  const { theme, selection, custom, updateCustom, resetCustom } = useTheme();
  const { locale } = useLocale();
  const t = MESSAGES[locale];
  const [baseSurface, setBaseSurface] = useState('');
  const [copy, setCopy] = useState<TCopyState>('idle');
  const [exported, setExported] = useState('');
  const [avoided, setAvoided] = useState<TStatus | null>(null);

  const active = selection === 'custom' && custom ? custom : defaultCustomTheme(theme);
  const dark = isDarkTheme(active.base);
  const surfaceHue = active.surfaceHue ?? DEFAULT_SURFACE_HUE[active.base];
  const accentHue = active.accentHue ?? DEFAULT_ACCENT_HUE[active.base];

  const neutrals = active.surfaceHue === null ? null : resolveNeutrals({ hue: surfaceHue, dark });
  const surface = neutrals?.surface ?? baseSurface;
  const accent = active.accentHue === null || !surface ? null : resolveAccent({ hue: accentHue, surface, dark });
  const avoidedNote = accent && avoided ? t.avoids(STATUS_LABELS[locale][avoided]) : '';

  const handleAccent = (hue: number): void => {
    const cleared = clearOfStatus(hue, active.base);
    setAvoided(cleared.avoided);
    updateCustom({ accentHue: cleared.hue });
  };

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
    <section className={classes.sandbox} aria-label={t.title}>
      <div className={classes.sandbox__head}>
        <Label className={classes.sandbox__title}>{t.title}</Label>
        <Label className={classes.sandbox__hint}>{t.hint}</Label>
      </div>

      <HuePicker
        label={t.surface}
        hue={surfaceHue}
        track={SURFACE_PREVIEW}
        valueText={neutrals ? `${t.hue} ${Math.round(surfaceHue)}°, ${t.text} ${ratio(neutrals.inkContrast)}` : t.asTheme}
        readout={
          neutrals ? (
            <>
              <i className={classes.sandbox__swatch} style={{ '--swatch': neutrals.surface } as CSSProperties} aria-hidden />
              <Label>
                {t.text} {ratio(neutrals.inkContrast)} · {t.muted} {ratio(neutrals.mutedContrast)}
              </Label>
            </>
          ) : (
            <Label>{t.untouched}</Label>
          )
        }
        onChange={(hue) => updateCustom({ surfaceHue: hue })}
      />

      <HuePicker
        label={t.accent}
        hue={accentHue}
        track={ACCENT_SHAPE[dark ? 'dark' : 'light']}
        valueText={accent ? `${t.hue} ${Math.round(accentHue)}°, ${t.contrast} ${ratio(accent.contrast)}${avoidedNote}` : t.asTheme}
        bands={statusHueBands(active.base)}
        note={t.bandsNote}
        readout={
          accent ? (
            <>
              <i className={classes.sandbox__swatch} style={{ '--swatch': accent.hex } as CSSProperties} aria-hidden />
              <Label>
                {accent.hex} · {ratio(accent.contrast)}
                {accent.adjusted ? t.adjusted : ''}
                {avoidedNote}
              </Label>
            </>
          ) : (
            <Label>{t.untouched}</Label>
          )
        }
        onChange={handleAccent}
      />

      <div className={classes.sandbox__actions}>
        <button type='button' className={classes.sandbox__button} onClick={handleCopy}>
          {t.copy}
        </button>
        <button type='button' className={classes.sandbox__button} disabled={!custom} onClick={resetCustom}>
          {t.reset}
        </button>
        <span role='status' aria-live='polite' className={classes.sandbox__status}>
          {copy === 'copied' && <Label>{t.copied}</Label>}
          {copy === 'failed' && <Label>{t.failed}</Label>}
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
