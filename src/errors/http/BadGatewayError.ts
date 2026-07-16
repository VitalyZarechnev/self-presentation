import { ApplicationError } from '@errors/application/ApplicationError';

export class BadGatewayError extends ApplicationError {
  public static code = 'BadGatewayError';
  public static statusCode = 502;

  constructor(message = 'Bad Gateway Error') {
    super(message);
  }
}
