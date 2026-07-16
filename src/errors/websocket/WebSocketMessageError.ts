import { ApplicationError } from '@errors/application/ApplicationError';

export class WebSocketMessageError extends ApplicationError {
  public static code = 'WebSocketMessageError';

  constructor(message = 'Malformed WebSocket message') {
    super(message);
  }
}
