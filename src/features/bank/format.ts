export function formatMoney(rubles: number): string {
  return `${Math.round(rubles).toLocaleString('ru-RU')} ₽`;
}

export function formatSigned(rubles: number): string {
  const rounded = Math.round(rubles);
  const sign = rounded > 0 ? '+' : rounded < 0 ? '−' : '';
  return `${sign}${Math.abs(rounded).toLocaleString('ru-RU')} ₽`;
}

export function formatTxFull(timestamp: number): string {
  const date = new Date(timestamp);
  const day = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  const time = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  return `${day}, ${time}`;
}

const DAY = 86400000;

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function formatTxDate(timestamp: number): string {
  const date = new Date(timestamp);
  const time = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const dayDiff = Math.round((startOfDay(new Date()) - startOfDay(date)) / DAY);
  if (dayDiff <= 0) return `Сегодня, ${time}`;
  if (dayDiff === 1) return `Вчера, ${time}`;
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}
