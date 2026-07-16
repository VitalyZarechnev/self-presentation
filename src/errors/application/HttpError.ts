import { ApplicationError } from '@errors/application/ApplicationError';

export class HttpError extends ApplicationError {
  statusCode: number | undefined;
  body: string;
  code: string | undefined;

  constructor(message = 'Network error', body: string, statusCode?: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.body = body;
    this.code = code;
  }
}
