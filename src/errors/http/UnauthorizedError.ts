import { ApplicationError } from '@errors/application/ApplicationError';

export class UnauthorizedError extends ApplicationError {
  public static code = 'UnauthorizedError';
  public static statusCode = 401;

  constructor(message = 'Unauthorized Error') {
    super(message);
  }
}
