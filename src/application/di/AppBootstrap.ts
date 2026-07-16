import type { AppRegistry } from '@application/di/AppRegistry';

import { BankDatasourceImpl } from '@data/bank/datasources/BankDatasourceImpl';
import { MarketDatasourceImpl } from '@data/market/datasources/MarketDatasourceImpl';
import { HttpClientImpl } from '@data/network/http/HttpClientImpl';
import { WebSocketClientImpl } from '@data/network/websocket/WebSocketClientImpl';

import { marketConfig } from '@domain/market/marketConfig';

const DEFAULT_BINANCE_WS_URL = `wss://stream.binance.com:9443/ws/${marketConfig.symbol}@trade`;

export class AppBootstrap {
  public run(registry: AppRegistry): void {
    this.registerDependencies(registry);
  }

  private registerDependencies(registry: AppRegistry): void {
    const apiUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
    const binanceUrl = process.env.NEXT_PUBLIC_BINANCE_API_URL || DEFAULT_BINANCE_WS_URL;

    registry.registerHttpClient(new HttpClientImpl(apiUrl, {}));
    registry.registerMarketDatasource(new MarketDatasourceImpl(new WebSocketClientImpl(binanceUrl)));
    registry.registerBankDatasource(new BankDatasourceImpl());
  }
}

export const clientBootstrap = new AppBootstrap();
export const serverBootstrap = new AppBootstrap();
