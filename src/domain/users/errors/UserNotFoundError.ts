import { ApplicationError } from '@errors/application/ApplicationError';

export class UserNotFoundError extends ApplicationError {
  public static code = 'UserNotFoundError';

  constructor(message = 'User Not Found') {
    super(message);
  }
}
