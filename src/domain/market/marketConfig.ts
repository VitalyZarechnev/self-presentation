export type TMarketConfig = {
  pair: string;
  symbol: string;
  tape: number;
  liveEnabled: boolean;
};

export const marketConfig: TMarketConfig = {
  pair: 'BTC / USDT',
  symbol: 'btcusdt',
  tape: 9,
  liveEnabled: false,
};
