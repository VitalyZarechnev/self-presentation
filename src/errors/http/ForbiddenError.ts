import { ApplicationError } from '@errors/application/ApplicationError';

export class ForbiddenError extends ApplicationError {
  public static code = 'ForbiddenError';
  public static statusCode = 403;

  constructor(message = 'Forbidden Error') {
    super(message);
  }
}
