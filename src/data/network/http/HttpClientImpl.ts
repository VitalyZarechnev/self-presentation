import { InvalidTokenError } from '@data/auth/errors/InvalidTokenError';
import { NoTokenError } from '@data/auth/errors/NoTokenError';
import { IHttpClient, TPayload, TRequestOptions } from '@data/network/http/IHttpClient';

import { ITokenManager } from '@domain/auth/storages/ITokenManager';

import { HttpError } from '@errors/application/HttpError';
import { NetworkError } from '@errors/application/NetworkError';
import { AbortError } from '@errors/http/AbortError';

import { APPLICATION_JSON_CONTENT_TYPE, EVENT_STREAM_CONTENT_TYPE } from '@utils/network/contentType';
import { createQueryString } from '@utils/queryParams/createQueryString';

type TQueuedRequest<T> = {
  execute: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
};

export class HttpClientImpl implements IHttpClient {
  private readonly _baseUrl: string;
  private readonly _baseHeaders: Record<string, string>;
  private readonly _tokenManager?: ITokenManager;

  private _refreshPromise: Promise<void> | null = null;
  private _requestQueue: TQueuedRequest<unknown>[] = [];

  constructor(
    baseUrl: string,
    baseHeaders?: Record<string, string>,
    tokenManager?: ITokenManager,
    private onRefreshFailed?: () => void,
  ) {
    this._baseUrl = baseUrl;
    this._baseHeaders = {
      'content-type': APPLICATION_JSON_CONTENT_TYPE,
      ...baseHeaders,
    };
    this._tokenManager = tokenManager;
  }

  async get<TResult>(options: TRequestOptions & { includeHeaders: true }): Promise<{ data: TResult; headers: Headers }>;
  async get<TResult>(options: TRequestOptions): Promise<TResult | { data: TResult; headers: Headers }> {
    let { resource } = options;
    const { params, headers, url, skipEncoding, skipParsingResponseAsJson, includeHeaders, signal } = options;

    const request = {
      method: 'GET',
      headers: { ...this._baseHeaders, ...headers },
    } as RequestInit;

    if (params) resource = `${resource}` + createQueryString(params);

    return await this.fetchWithTokenRetry(() =>
      this.fetch<TResult>(resource, request, url, skipEncoding, skipParsingResponseAsJson, includeHeaders, signal),
    );
  }

  async post<TResult>(options: TRequestOptions & { includeHeaders: true }): Promise<{ data: TResult; headers: Headers }>;
  async post<TResult>(options: TRequestOptions): Promise<TResult | { data: TResult; headers: Headers }> {
    const { resource, payload, headers, url, skipEncoding, skipParsingResponseAsJson, includeHeaders, signal } = options;

    const request = {
      method: 'POST',
      headers: { ...this.getBaseHeaders(payload ?? null), ...headers },
      body: this.getBody(payload ?? null),
    } as RequestInit;

    return await this.fetchWithTokenRetry(() =>
      this.fetch<TResult>(resource, request, url, skipEncoding, skipParsingResponseAsJson, includeHeaders, signal),
    );
  }

  async patch<TResult>(options: TRequestOptions & { includeHeaders: true }): Promise<{ data: TResult; headers: Headers }>;
  async patch<TResult>(options: TRequestOptions): Promise<TResult | { data: TResult; headers: Headers }> {
    const { resource, payload, headers, url, skipEncoding, skipParsingResponseAsJson, includeHeaders, signal } = options;

    const request = {
      method: 'PATCH',
      headers: { ...this.getBaseHeaders(payload ?? null), ...headers },
      body: this.getBody(payload ?? null),
    } as RequestInit;

    return await this.fetchWithTokenRetry(() =>
      this.fetch<TResult>(resource, request, url, skipEncoding, skipParsingResponseAsJson, includeHeaders, signal),
    );
  }

  async put<TResult>(options: TRequestOptions & { includeHeaders: true }): Promise<{ data: TResult; headers: Headers }>;
  async put<TResult>(options: TRequestOptions): Promise<TResult | { data: TResult; headers: Headers }> {
    const { resource, payload, headers, url, skipEncoding, skipParsingResponseAsJson, includeHeaders, signal } = options;

    const request = {
      method: 'PUT',
      headers: { ...this.getBaseHeaders(payload ?? null), ...headers },
      body: this.getBody(payload ?? null),
    } as RequestInit;

    return await this.fetchWithTokenRetry(() =>
      this.fetch<TResult>(resource, request, url, skipEncoding, skipParsingResponseAsJson, includeHeaders, signal),
    );
  }

  async delete<TResult>(options: TRequestOptions & { includeHeaders: true }): Promise<{ data: TResult; headers: Headers }>;
  async delete<TResult>(options: TRequestOptions): Promise<TResult | { data: TResult; headers: Headers }> {
    let { resource } = options;
    const { params, payload, headers, url, skipEncoding, skipParsingResponseAsJson, includeHeaders, signal } = options;

    const request = {
      method: 'DELETE',
      headers: { ...this._baseHeaders, ...headers },
      body: this.getBody(payload ?? null),
    } as RequestInit;

    if (params) resource = `${resource}` + createQueryString(params);

    return await this.fetchWithTokenRetry(() =>
      this.fetch<TResult>(resource, request, url, skipEncoding, skipParsingResponseAsJson, includeHeaders, signal),
    );
  }

  private async fetchWithTokenRetry<T>(originalRequest: () => Promise<T>): Promise<T> {
    try {
      return await originalRequest();
    } catch (error) {
      if (this.isTokenExpiredError(error) && this._tokenManager) {
        return await this.handleTokenExpiredRequest(originalRequest);
      }
      throw error;
    }
  }

  private async handleTokenExpiredRequest<T>(originalRequest: () => Promise<T>): Promise<T> {
    if (this._refreshPromise) {
      await this._refreshPromise;

      return await originalRequest();
    }

    return await this.queueRequest(originalRequest);
  }

  private async queueRequest<T>(originalRequest: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const queuedRequest: TQueuedRequest<T> = {
        execute: originalRequest,
        resolve,
        reject,
      };

      this._requestQueue.push(queuedRequest as TQueuedRequest<unknown>);

      setTimeout(() => this.processQueue(), 0);
    });
  }

  private async processQueue(): Promise<void> {
    if (this._refreshPromise) {
      return;
    }

    if (this._requestQueue.length === 0) {
      return;
    }

    this._refreshPromise = this.handleTokenRefresh();

    try {
      await this._refreshPromise;

      const requests = [...this._requestQueue];
      this._requestQueue = [];

      await Promise.allSettled(
        requests.map(async (req) => {
          try {
            const result = await req.execute();
            req.resolve(result);
            return result;
          } catch (error) {
            req.reject(error);
            throw error;
          }
        }),
      );
    } catch (error) {
      const requests = [...this._requestQueue];
      this._requestQueue = [];
      requests.forEach((req) => req.reject(error));
    } finally {
      this._refreshPromise = null;
    }
  }

  private async handleTokenRefresh(): Promise<void> {
    try {
      const newAccessToken = await this._tokenManager!.refreshToken();
      this._tokenManager!.setAccessToken(newAccessToken);
    } catch (error) {
      this._tokenManager!.clearTokens();
      this.onRefreshFailed?.();
      throw error;
    }
  }

  private isTokenExpiredError(error: unknown): boolean {
    return error instanceof InvalidTokenError;
  }

  private async fetch<T>(
    resource: string,
    options: RequestInit,
    url?: string,
    skipEncoding?: boolean,
    skipParsingResponseAsJson?: boolean,
    includeHeaders?: boolean,
    signal?: AbortController,
  ): Promise<T | { data: T; headers: Headers }> {
    const headers = new Headers(options.headers);

    if (this._tokenManager) {
      const accessToken = this._tokenManager.getAccessToken();
      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }
    }

    let response;
    const resourceUrl = this.getResourceUrl(resource, url, skipEncoding);

    try {
      response = await fetch(resourceUrl, {
        ...options,
        headers,
        signal: signal?.signal,
      });
    } catch (e) {
      if (e instanceof Error && e.name === AbortError.code) {
        throw new AbortError();
      }

      throw new NetworkError();
    }

    const isEventStream = response.headers.get('content-type')?.includes(EVENT_STREAM_CONTENT_TYPE);

    if (response.ok) {
      let data: T;

      if (skipParsingResponseAsJson || isEventStream || [204, 304].includes(response.status)) {
        data = response as T;
      } else {
        data = await response.json();
      }

      if (includeHeaders) {
        return { data, headers: response.headers };
      }

      return data;
    }

    const json = (await response.json().catch(() => ({}))) as { detail?: unknown };
    const detail = typeof json.detail === 'string' ? json.detail : undefined;

    if (detail !== undefined && [InvalidTokenError.code, NoTokenError.code].includes(detail)) {
      throw new InvalidTokenError();
    }

    throw new HttpError(response.statusText, JSON.stringify(json), response.status);
  }

  private getResourceUrl(resource: string, baseUrl?: string, skipEncoding?: boolean): string {
    const [path, searchParamsFromResource] = resource.split('?');

    const encodedPath = skipEncoding ? path : encodeURI(path);
    const searchParams = searchParamsFromResource ? `?${searchParamsFromResource}` : '';
    const finalBaseUrl = baseUrl ?? this._baseUrl;

    return `${finalBaseUrl}/${encodedPath}${searchParams}`;
  }

  private getBaseHeaders(payload: TPayload) {
    const baseHeaders = { ...this._baseHeaders };

    if (payload instanceof FormData) {
      delete baseHeaders['content-type'];
    }

    return baseHeaders;
  }

  private getBody(payload: TPayload): BodyInit | null {
    if (!payload || payload instanceof FormData) return payload;
    return JSON.stringify(payload);
  }
}
