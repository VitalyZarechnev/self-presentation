import { isBrowser } from '@utils/environment/isBrowser';

export type TCookieOptions = {
  path?: string;
  domain?: string;
  maxAge?: number;
  expires?: Date;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
};

function readRaw(name: string): string | null {
  if (!isBrowser()) return null;

  const target = `${encodeURIComponent(name)}=`;
  const parts = document.cookie ? document.cookie.split('; ') : [];

  for (const part of parts) {
    if (part.startsWith(target)) {
      return decodeURIComponent(part.slice(target.length));
    }
  }

  return null;
}

function serializeOptions(opts?: TCookieOptions): string {
  if (!opts) return '';

  const segments: string[] = [];

  if (opts.path) segments.push(`Path=${opts.path}`);
  if (opts.domain) segments.push(`Domain=${opts.domain}`);
  if (typeof opts.maxAge === 'number') segments.push(`Max-Age=${opts.maxAge}`);
  if (opts.expires) segments.push(`Expires=${opts.expires.toUTCString()}`);
  if (opts.secure) segments.push('Secure');
  if (opts.sameSite) segments.push(`SameSite=${opts.sameSite.charAt(0).toUpperCase()}${opts.sameSite.slice(1)}`);
  if (opts.httpOnly) segments.push('HttpOnly');

  return segments.length > 0 ? `; ${segments.join('; ')}` : '';
}

export const cookies = {
  get(name: string): string | null {
    const raw = readRaw(name);

    if (raw === null) return null;

    return raw;
  },

  set(name: string, value: unknown, opts?: TCookieOptions): void {
    if (!isBrowser()) return;

    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(serialized)}${serializeOptions(opts)}`;
  },

  remove(name: string, opts?: Pick<TCookieOptions, 'path' | 'domain'>): void {
    if (!isBrowser()) return;

    document.cookie = `${encodeURIComponent(name)}=${serializeOptions({
      ...opts,
      expires: new Date(0),
      maxAge: 0,
    })}`;
  },
};
