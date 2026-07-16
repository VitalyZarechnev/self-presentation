import { UnexpectedError } from '@errors/application/UnexpectedError';

export class FailedToRefreshTokenError extends UnexpectedError {
  public static code = 'failed_to_refresh_token';

  constructor(message = 'Failed To Refresh Token') {
    super(message);
  }
}
