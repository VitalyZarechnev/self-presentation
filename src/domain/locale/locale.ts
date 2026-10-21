export const LOCALES = ['ru', 'en'] as const;

export type TLocale = (typeof LOCALES)[number];

// The static HTML is rendered in this locale; others are applied on the client.
export const DEFAULT_LOCALE: TLocale = 'ru';

export type TLocalized<T> = Record<TLocale, T>;

export function isLocale(value: string | null | undefined): value is TLocale {
  return value != null && (LOCALES as readonly string[]).includes(value);
}
