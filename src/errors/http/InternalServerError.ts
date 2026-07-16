import { ApplicationError } from '@errors/application/ApplicationError';

export class InternalServerError extends ApplicationError {
  public static code = 'InternalServerError';
  public static statusCode = 500;

  constructor(message = 'Internal Server Error') {
    super(message);
  }
}
