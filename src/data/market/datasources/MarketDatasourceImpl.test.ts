import { IWebSocketClient } from '@data/network/websocket/IWebSocketClient';

import { TTrade } from '@domain/market/models/Trade';

import { MarketDatasourceImpl } from './MarketDatasourceImpl';

const SIM_INTERVAL = 300;
const MAX_TICK_MOVE = 0.0005;

const socket: IWebSocketClient = { connect: vi.fn(), disconnect: vi.fn() };

function collect(datasource: MarketDatasourceImpl, trades: TTrade[]): () => void {
  return datasource.subscribe({ onTrade: (trade) => trades.push(trade), onStatus: () => {} });
}

describe('MarketDatasourceImpl demo stream', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  test('continues from the last price after resubscribing instead of jumping', () => {
    const datasource = new MarketDatasourceImpl(socket);
    const first: TTrade[] = [];
    const unsubscribe = collect(datasource, first);
    vi.advanceTimersByTime(SIM_INTERVAL * 5);
    unsubscribe();

    const second: TTrade[] = [];
    collect(datasource, second);
    vi.advanceTimersByTime(SIM_INTERVAL);

    const last = first[first.length - 1].price;
    const next = second[0].price;
    expect(Math.abs(next / last - 1)).toBeLessThan(MAX_TICK_MOVE);
  });
});
