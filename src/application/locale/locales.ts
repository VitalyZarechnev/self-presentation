import { TLocale } from '@domain/locale/locale';

// Shared with public/locale-init.js, which runs before React and cannot import this file.
export const LOCALE_STORAGE_KEY = 'ui-lang';
export const LOCALE_QUERY_PARAM = 'lang';

export const LOCALE_LABELS: Record<TLocale, { short: string; switchTo: string }> = {
  ru: { short: 'RU', switchTo: 'Переключить на русский' },
  en: { short: 'EN', switchTo: 'Switch to English' },
};
