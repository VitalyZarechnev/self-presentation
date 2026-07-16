import { clientBootstrap, serverBootstrap } from '@application/di/AppBootstrap';

import { IHttpClient } from '@data/network/http/IHttpClient';

import { IBankDatasource } from '@domain/bank/datasources/IBankDatasource';
import { IMarketDatasource } from '@domain/market/datasources/IMarketDatasource';

import { DependencyNotRegisteredError } from '@errors/application/DependencyNotRegisteredError';

import { isBrowser } from '@utils/environment/isBrowser';

export class AppRegistry {
  private static instance: AppRegistry;

  private _httpClient: IHttpClient | null = null;

  private _marketDatasource: IMarketDatasource | null = null;
  private _bankDatasource: IBankDatasource | null = null;

  private constructor() {}

  public static getInstance(): AppRegistry {
    if (!AppRegistry.instance) {
      AppRegistry.instance = new AppRegistry();
    }

    return AppRegistry.instance;
  }

  public get httpClient(): IHttpClient {
    if (!this._httpClient) throw new DependencyNotRegisteredError('HttpClient');
    return this._httpClient;
  }

  public get marketDatasource(): IMarketDatasource {
    if (!this._marketDatasource) throw new DependencyNotRegisteredError('MarketDatasource');
    return this._marketDatasource;
  }

  public get bankDatasource(): IBankDatasource {
    if (!this._bankDatasource) throw new DependencyNotRegisteredError('BankDatasource');
    return this._bankDatasource;
  }

  public registerHttpClient(httpClient: IHttpClient): void {
    this._httpClient = httpClient;
  }

  public registerMarketDatasource(marketDatasource: IMarketDatasource): void {
    this._marketDatasource = marketDatasource;
  }

  public registerBankDatasource(bankDatasource: IBankDatasource): void {
    this._bankDatasource = bankDatasource;
  }
}

export const registry = AppRegistry.getInstance();

if (isBrowser()) {
  clientBootstrap.run(registry);
} else {
  serverBootstrap.run(registry);
}
