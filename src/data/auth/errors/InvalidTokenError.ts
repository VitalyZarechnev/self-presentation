import { UnexpectedError } from '@errors/application/UnexpectedError';

export class InvalidTokenError extends UnexpectedError {
  public static code = 'invalid_token';

  constructor(message = 'Invalid Token') {
    super(message);
  }
}
