import { UnexpectedError } from '@errors/application/UnexpectedError';

export class NoTokenError extends UnexpectedError {
  public static code = 'no_token';

  constructor(message = 'No Token') {
    super(message);
  }
}
