import { IWebSocketClient, TWebSocketListener } from '@data/network/websocket/IWebSocketClient';

import { WebSocketClosedError } from '@errors/websocket/WebSocketClosedError';
import { WebSocketConnectionError } from '@errors/websocket/WebSocketConnectionError';
import { WebSocketMessageError } from '@errors/websocket/WebSocketMessageError';

export type TWebSocketOptions = {
  openTimeout?: number;
  maxReconnects?: number;
  reconnectBaseDelay?: number;
  maxReconnectDelay?: number;
};

const DEFAULT_OPTIONS: Required<TWebSocketOptions> = {
  openTimeout: 4000,
  maxReconnects: 4,
  reconnectBaseDelay: 1000,
  maxReconnectDelay: 15000,
};

export class WebSocketClientImpl implements IWebSocketClient {
  private readonly _options: Required<TWebSocketOptions>;

  private _socket: WebSocket | null = null;
  private _listener: TWebSocketListener | null = null;
  private _openTimer: ReturnType<typeof setTimeout> | null = null;
  private _reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private _reconnects = 0;
  private _stopped = false;

  constructor(
    private readonly _url: string,
    options: TWebSocketOptions = {},
  ) {
    this._options = { ...DEFAULT_OPTIONS, ...options };
  }

  connect(listener: TWebSocketListener): void {
    this._listener = listener;
    this._stopped = false;
    this._reconnects = 0;
    this.open();
  }

  disconnect(): void {
    this._stopped = true;
    this.clearTimers();
    this._reconnects = 0;
    this.teardownSocket();
    this._listener = null;
  }

  private open(): void {
    if (this._stopped || !this._listener) return;

    let socket: WebSocket;
    try {
      socket = new WebSocket(this._url);
    } catch (error) {
      const message = error instanceof Error ? error.message : undefined;
      this._listener.onError?.(new WebSocketConnectionError(message));
      this.scheduleReconnect();
      return;
    }

    this._socket = socket;
    this._openTimer = setTimeout(() => {
      if (socket.readyState !== WebSocket.OPEN) socket.close();
    }, this._options.openTimeout);

    socket.onopen = () => {
      this.clearOpenTimer();
      this._reconnects = 0;
      this._listener?.onOpen?.();
    };

    socket.onmessage = (event) => {
      try {
        this._listener?.onMessage(JSON.parse(event.data as string));
      } catch {
        this._listener?.onError?.(new WebSocketMessageError());
      }
    };

    socket.onerror = () => socket.close();

    socket.onclose = () => {
      this.clearOpenTimer();
      this._socket = null;
      if (this._stopped) return;
      this._listener?.onClose?.();
      this.scheduleReconnect();
    };
  }

  private scheduleReconnect(): void {
    if (this._stopped || !this._listener) return;

    if (this._reconnects >= this._options.maxReconnects) {
      this._listener.onError?.(new WebSocketClosedError('Reconnect attempts exhausted'));
      return;
    }

    this._reconnects += 1;
    const delay = Math.min(this._options.reconnectBaseDelay * 2 ** this._reconnects, this._options.maxReconnectDelay);
    this._reconnectTimer = setTimeout(() => this.open(), delay);
  }

  private teardownSocket(): void {
    const socket = this._socket;
    if (!socket) return;
    socket.onopen = null;
    socket.onmessage = null;
    socket.onerror = null;
    socket.onclose = null;
    socket.close();
    this._socket = null;
  }

  private clearOpenTimer(): void {
    if (this._openTimer) clearTimeout(this._openTimer);
    this._openTimer = null;
  }

  private clearReconnectTimer(): void {
    if (this._reconnectTimer) clearTimeout(this._reconnectTimer);
    this._reconnectTimer = null;
  }

  private clearTimers(): void {
    this.clearOpenTimer();
    this.clearReconnectTimer();
  }
}
