import { ApplicationError } from '@errors/application/ApplicationError';

export class GatewayTimeoutError extends ApplicationError {
  public static code = 'GatewayTimeoutError';
  public static statusCode = 504;

  constructor(message = 'Gateway Timeout Error') {
    super(message);
  }
}
