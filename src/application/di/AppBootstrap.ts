import type { AppRegistry } from '@application/di/AppRegistry';

import { BankDatasourceImpl } from '@data/bank/datasources/BankDatasourceImpl';
import { MarketDatasourceImpl } from '@data/market/datasources/MarketDatasourceImpl';
import { HttpClientImpl } from '@data/network/http/HttpClientImpl';
import { WebSocketClientImpl } from '@data/network/websocket/WebSocketClientImpl';

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export class AppBootstrap {
  public run(registry: AppRegistry): void {
    this.registerDependencies(registry);
  }

  private registerDependencies(registry: AppRegistry): void {
    const apiUrl = requireEnv('NEXT_PUBLIC_BASE_URL', process.env.NEXT_PUBLIC_BASE_URL);
    const binanceUrl = requireEnv('NEXT_PUBLIC_BINANCE_API_URL', process.env.NEXT_PUBLIC_BINANCE_API_URL);

    const httpClient = new HttpClientImpl(apiUrl, {});

    registry.registerHttpClient(httpClient);
    registry.registerMarketDatasource(new MarketDatasourceImpl(new WebSocketClientImpl(binanceUrl)));
    registry.registerBankDatasource(new BankDatasourceImpl());
  }
}

export const clientBootstrap = new AppBootstrap();
export const serverBootstrap = new AppBootstrap();
