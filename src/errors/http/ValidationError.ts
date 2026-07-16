import { ApplicationError } from '@errors/application/ApplicationError';

export class ValidationError extends ApplicationError {
  public static code = 'ValidationError';
  public static statusCode = 422;

  constructor(message = 'Validation Error') {
    super(message);
  }
}
