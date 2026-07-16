import { ApplicationError } from '@errors/application/ApplicationError';

export class BadRequestError extends ApplicationError {
  public static code = 'BadRequestError';
  public static statusCode = 400;

  constructor(message = 'Not Found Error') {
    super(message);
  }
}
