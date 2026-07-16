import { ApplicationError } from '@errors/application/ApplicationError';

export class WebSocketConnectionError extends ApplicationError {
  public static code = 'WebSocketConnectionError';

  constructor(message = 'WebSocket connection error') {
    super(message);
  }
}
