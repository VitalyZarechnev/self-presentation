import { ApplicationError } from '@errors/application/ApplicationError';

export class WebSocketClosedError extends ApplicationError {
  public static code = 'WebSocketClosedError';

  constructor(message = 'WebSocket closed') {
    super(message);
  }
}
