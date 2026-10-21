export function formatMoney(rubles: number, intl = 'ru-RU'): string {
  return `${Math.round(rubles).toLocaleString(intl)} ₽`;
}

export function formatSigned(rubles: number, intl = 'ru-RU'): string {
  const rounded = Math.round(rubles);
  const sign = rounded > 0 ? '+' : rounded < 0 ? '−' : '';
  return `${sign}${Math.abs(rounded).toLocaleString(intl)} ₽`;
}

export function formatTxFull(timestamp: number, intl = 'ru-RU'): string {
  const date = new Date(timestamp);
  const day = date.toLocaleDateString(intl, { day: 'numeric', month: 'long', year: 'numeric' });
  const time = date.toLocaleTimeString(intl, { hour: '2-digit', minute: '2-digit' });
  return `${day}, ${time}`;
}

const DAY = 86400000;

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

type TDayWords = { intl: string; today: string; yesterday: string };

export function formatTxDate(timestamp: number, words: TDayWords): string {
  const date = new Date(timestamp);
  const time = date.toLocaleTimeString(words.intl, { hour: '2-digit', minute: '2-digit' });
  const dayDiff = Math.round((startOfDay(new Date()) - startOfDay(date)) / DAY);
  if (dayDiff <= 0) return `${words.today}, ${time}`;
  if (dayDiff === 1) return `${words.yesterday}, ${time}`;
  return date.toLocaleDateString(words.intl, { day: 'numeric', month: 'short' });
}
