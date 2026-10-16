import { TMarketStatus } from '@domain/market/datasources/IMarketDatasource';

const NO_PRICE = '—';

export function formatTime(ms: number): string {
  const date = new Date(ms);
  return [date.getHours(), date.getMinutes(), date.getSeconds()].map((n) => String(n).padStart(2, '0')).join(':');
}

export function formatChange(percent: number): string {
  return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
}

export function formatPrice(price: number): string {
  return price ? price.toFixed(1) : NO_PRICE;
}

export const MARKET_STATUS_LABEL: Record<TMarketStatus, string> = {
  connecting: 'подключение…',
  live: 'live · binance',
  demo: 'демо-поток',
};
