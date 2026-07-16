import { TMarketStatus } from '@domain/market/datasources/IMarketDatasource';
import { TTrade } from '@domain/market/models/Trade';

export type TTapeEntry = { id: number; trade: TTrade };

export type TMarketSnapshot = {
  status: TMarketStatus;
  last: number;
  prev: number;
  changePercent: number | null;
  tape: readonly TTapeEntry[];
  history: readonly number[];
};

const INITIAL_SNAPSHOT: TMarketSnapshot = {
  status: 'connecting',
  last: 0,
  prev: 0,
  changePercent: null,
  tape: [],
  history: [],
};

export class MarketFeed {
  private _status: TMarketStatus = 'connecting';
  private _last = 0;
  private _prev = 0;
  private _ref = 0;
  private _tape: TTapeEntry[] = [];
  private _history: number[] = [];
  private _nextId = 0;
  private _snapshot: TMarketSnapshot = INITIAL_SNAPSHOT;
  private readonly _listeners = new Set<() => void>();

  constructor(
    private readonly _tapeSize: number,
    private readonly _historySize: number,
  ) {}

  readonly subscribe = (listener: () => void): (() => void) => {
    this._listeners.add(listener);
    return () => {
      this._listeners.delete(listener);
    };
  };

  readonly getSnapshot = (): TMarketSnapshot => this._snapshot;

  readonly getServerSnapshot = (): TMarketSnapshot => INITIAL_SNAPSHOT;

  pushTrade(trade: TTrade): void {
    this._prev = this._last || trade.price;
    this._last = trade.price;
    if (!this._ref) this._ref = trade.price;

    const id = this._nextId;
    this._nextId += 1;
    this._tape = [{ id, trade }, ...this._tape].slice(0, this._tapeSize);
    this._history = [...this._history, trade.price].slice(-this._historySize);

    this.commit();
  }

  setStatus(status: TMarketStatus): void {
    if (status === 'live') {
      this._ref = 0;
      this._history = [];
    }
    this._status = status;
    this.commit();
  }

  private commit(): void {
    this._snapshot = {
      status: this._status,
      last: this._last,
      prev: this._prev,
      changePercent: this._ref ? (this._last / this._ref - 1) * 100 : null,
      tape: this._tape,
      history: this._history,
    };
    this._listeners.forEach((listener) => listener());
  }
}
