export const LOCALES = ['ru', 'en'] as const;

export type TLocale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: TLocale = 'ru';

export type TLocalized<T> = Record<TLocale, T>;

export function isLocale(value: string | null | undefined): value is TLocale {
  return value != null && (LOCALES as readonly string[]).includes(value);
}
