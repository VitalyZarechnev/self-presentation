import { ApplicationError } from '@errors/application/ApplicationError';

export class NotFoundError extends ApplicationError {
  public static code = 'NotFoundError';
  public static statusCode = 404;

  constructor(message = 'Not Found Error') {
    super(message);
  }
}
