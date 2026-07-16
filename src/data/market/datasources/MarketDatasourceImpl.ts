import { IWebSocketClient } from '@data/network/websocket/IWebSocketClient';

import { IMarketDatasource, TMarketStatus, TMarketSubscriber } from '@domain/market/datasources/IMarketDatasource';
import { TTrade } from '@domain/market/models/Trade';
import { TradeMessageSchema } from '@domain/market/models/TradeMessage';

import { ApplicationError } from '@errors/application/ApplicationError';
import { UnexpectedError } from '@errors/application/UnexpectedError';

import { createModel } from '@utils/model';

const SIM_INTERVAL = 300;
const SIM_SEED_PRICE = 68000;
const SIM_SEED_RANGE = 4000;
const SIM_VOLATILITY = 0.0009;

export class MarketDatasourceImpl implements IMarketDatasource {
  private _simTimer: ReturnType<typeof setInterval> | null = null;
  private _simPrice = 0;
  private _status: TMarketStatus = 'connecting';

  constructor(private readonly _socket: IWebSocketClient) {}

  subscribe(subscriber: TMarketSubscriber): () => void {
    this._simPrice = SIM_SEED_PRICE + Math.random() * SIM_SEED_RANGE;
    this._status = 'connecting';
    subscriber.onStatus('connecting');

    this.startSimulator(subscriber);

    this._socket.connect({
      onMessage: (data) => this.handleMessage(data, subscriber),
      onClose: () => this.handleClose(subscriber),
      onError: (error) => this.handleError(error, subscriber),
    });

    return () => {
      this._socket.disconnect();
      this.stopSimulator();
      this._status = 'connecting';
    };
  }

  private handleMessage(data: unknown, subscriber: TMarketSubscriber): void {
    let trade: TTrade;
    try {
      const message = createModel(TradeMessageSchema, data);
      trade = {
        price: Number(message.p),
        qty: Number(message.q),
        buy: !message.m,
        time: message.T,
      };
    } catch {
      return;
    }

    if (this._status !== 'live') {
      this.setStatus(subscriber, 'live');
      this.stopSimulator();
    }
    subscriber.onTrade(trade);
  }

  private handleClose(subscriber: TMarketSubscriber): void {
    if (this._status === 'live') this.setStatus(subscriber, 'demo');
    this.startSimulator(subscriber);
  }

  private handleError(error: ApplicationError, subscriber: TMarketSubscriber): void {
    subscriber.onError?.(error instanceof ApplicationError ? error : new UnexpectedError());
    this.setStatus(subscriber, 'demo');
    this.startSimulator(subscriber);
  }

  private setStatus(subscriber: TMarketSubscriber, status: TMarketStatus): void {
    if (this._status === status) return;
    this._status = status;
    subscriber.onStatus(status);
  }

  private startSimulator(subscriber: TMarketSubscriber): void {
    if (this._simTimer) return;
    this._simTimer = setInterval(() => {
      this._simPrice *= 1 + (Math.random() - 0.5) * SIM_VOLATILITY;
      subscriber.onTrade({
        price: this._simPrice,
        qty: 0.05 + Math.random() * 1.5,
        buy: Math.random() > 0.5,
        time: Date.now(),
      });
    }, SIM_INTERVAL);
  }

  private stopSimulator(): void {
    if (this._simTimer) clearInterval(this._simTimer);
    this._simTimer = null;
  }
}
