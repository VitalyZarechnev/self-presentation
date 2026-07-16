import { ApplicationError } from '@errors/application/ApplicationError';

export class ConflictError extends ApplicationError {
  public static code = 'ConflictError';
  public static statusCode = 409;

  constructor(message = 'Conflict Error') {
    super(message);
  }
}
