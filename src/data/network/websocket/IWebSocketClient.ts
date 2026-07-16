import { ApplicationError } from '@errors/application/ApplicationError';

export type TWebSocketListener = {
  onMessage: (data: unknown) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: ApplicationError) => void;
};

export interface IWebSocketClient {
  connect(listener: TWebSocketListener): void;
  disconnect(): void;
}
