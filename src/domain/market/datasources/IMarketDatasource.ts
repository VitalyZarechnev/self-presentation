import { TTrade } from '@domain/market/models/Trade';

import { ApplicationError } from '@errors/application/ApplicationError';

export type TMarketStatus = 'connecting' | 'live' | 'demo';

export type TMarketSubscriber = {
  onTrade: (trade: TTrade) => void;
  onStatus: (status: TMarketStatus) => void;
  onError?: (error: ApplicationError) => void;
};

export interface IMarketDatasource {
  subscribe(subscriber: TMarketSubscriber): () => void;
}
