import { ApplicationError } from '@errors/application/ApplicationError';

export class UnprocessableEntityError extends ApplicationError {
  public static code = 'UnprocessableEntityError';
  public static statusCode = 422;

  constructor(message = 'Unprocessable Entity Error') {
    super(message);
  }
}
