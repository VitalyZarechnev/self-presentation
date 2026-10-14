# Errors

> The error taxonomy in `/src/errors/**` (plus domain/data-local errors) — what each family means, how errors are thrown and mapped, and where they surface to the user.

## TL;DR

- Every error extends the abstract base **`ApplicationError`** (`extends Error`). Never `throw new Error(...)` or throw strings in app code.
- Three shared families live under `/src/errors/`: **`application/`** (semantic app failures), **`http/`** (status-code-tagged + `AbortError`), **`websocket/`** (transport failures).
- **Domain-/data-specific errors live in their slice, not in `/src/errors`**: `src/domain/<slice>/errors/`, `src/data/<slice>/errors/`. `/src/errors` is only for cross-cutting errors.
- Every error class carries a `public static code` string id; HTTP ones also carry `public static statusCode`. Identify errors via `instanceof`, and correlate with servers/logs via `code`.
- Errors are **raised in the Data layer** (`HttpClientImpl`, `WebSocketClientImpl`, `createModel`) and **surface** either through React Query state or the App Router boundary [`app/error.tsx`](../../app/error.tsx). UI/Views never construct these classes.

## Why

A typed error hierarchy lets any layer branch on failure without string-matching messages: `instanceof UnauthorizedError` is refactor-safe, `error.message === 'Unauthorized'` is not. A single abstract base (`ApplicationError`) gives one catch-all discriminator (`instanceof ApplicationError`) that separates _our_ thrown errors from unexpected runtime ones. Splitting by family keeps the catalogue navigable and mirrors the layer model in [architecture.md](./architecture.md): the Errors layer is importable everywhere **except Utils and UI**, so infrastructure and features share one vocabulary while dumb UI stays out of it.

Alternatives considered:

- **Plain `Error` + message strings** — rejected: not branchable, breaks on message edits/i18n.
- **A single flat `errors/` folder** — rejected: the http/application/websocket split signals _where_ a failure originated at a glance.
- **Error codes as an enum** — rejected: `static code` co-locates the id with the class and avoids a central enum that every new error must edit.

## Families & conventions

| Family                   | Location                      | Base                                   | Extra statics        | Examples                                                                                                                                                                                                                                                                                  |
| ------------------------ | ----------------------------- | -------------------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Application**          | `src/errors/application/`     | `ApplicationError`                     | `code`               | `HttpError`, `NetworkError`, `UnexpectedError`, `ClientValidationError`, `DependencyNotRegisteredError`                                                                                                                                                                                   |
| **HTTP**                 | `src/errors/http/`            | `ApplicationError`                     | `code`, `statusCode` | `BadRequestError` (400), `UnauthorizedError` (401), `ForbiddenError` (403), `NotFoundError` (404), `ConflictError` (409), `UnprocessableEntityError`/`ValidationError` (422), `InternalServerError` (500), `BadGatewayError` (502), `GatewayTimeoutError` (504), `AbortError` (no status) |
| **WebSocket**            | `src/errors/websocket/`       | `ApplicationError`                     | `code`               | `WebSocketConnectionError`, `WebSocketMessageError`, `WebSocketClosedError`                                                                                                                                                                                                               |
| **Domain/data-specific** | `src/<layer>/<slice>/errors/` | `ApplicationError` _or_ a shared error | `code`               | `UserNotFoundError` (`domain/users/errors`), `InvalidTokenError`/`NoTokenError`/`FailedToRefreshTokenError` (`data/auth/errors`, extend `UnexpectedError`)                                                                                                                                |

Naming (see also [code-style.md](./code-style.md)):

- Class name ends in `Error`; file name matches the class.
- `public static code` — a stable string id. **PascalCase** matching the class name for our generic errors (`'NetworkError'`); **snake_case** when it must match a server contract (auth codes are `'invalid_token'`, `'no_token'` — these are compared against the API's `detail` field).
- HTTP errors add `public static statusCode = <number>`.
- Constructors default the `message`, so `new NotFoundError()` is valid; pass a message only to add context.

> **Note on the HTTP family:** today `HttpClientImpl` throws a generic `HttpError` carrying `statusCode`, `body`, and `code` — it does **not** yet map each status to its dedicated class. The per-status classes (`ForbiddenError`, `ConflictError`, …) are the catalogue to (a) `throw` explicitly from a use-case/datasource when you know the case, and (b) map to as status→class routing is added. Don't assume `catch (e) { if (e instanceof ForbiddenError) }` fires from a raw fetch until that mapping exists — branch on `error instanceof HttpError && error.statusCode === 403` for now.

## Pattern — declaring an error

```ts
// src/errors/application/NetworkError.ts — cross-cutting → lives in /src/errors
import { ApplicationError } from '@errors/application/ApplicationError';

export class NetworkError extends ApplicationError {
  public static code = 'NetworkError';

  constructor(message = 'Network Error') {
    super(message);
  }
}
```

```ts
// src/domain/users/errors/UserNotFoundError.ts — domain-specific → lives in the slice
import { ApplicationError } from '@errors/application/ApplicationError';

export class UserNotFoundError extends ApplicationError {
  public static code = 'UserNotFoundError';

  constructor(message = 'User Not Found') {
    super(message);
  }
}
```

## Pattern — where errors are raised (Data layer)

`HttpClientImpl` translates transport/HTTP outcomes into typed errors; features never see a raw `fetch` rejection:

```ts
// src/data/network/http/HttpClientImpl.ts (abridged)
try {
  response = await fetch(resourceUrl, { ...options, headers, signal: signal?.signal });
} catch (e) {
  if (e instanceof Error && e.name === AbortError.code) throw new AbortError();
  throw new NetworkError();
}

if (!response.ok) {
  const json = (await response.json().catch(() => ({}))) as { detail?: unknown };
  const detail = typeof json.detail === 'string' ? json.detail : undefined;

  // Server contract: token problems come back in `detail` → typed auth error drives refresh/retry
  if (detail !== undefined && [InvalidTokenError.code, NoTokenError.code].includes(detail)) {
    throw new InvalidTokenError();
  }
  throw new HttpError(response.statusText, JSON.stringify(json), response.status);
}
```

Schema validation failures become a `ValidationError` (422) via `createModel` — so any datasource mapping a payload through a Zod model raises a typed error automatically:

```ts
// src/utils/model.ts (abridged)
export function createModel<T extends z.Schema>(model: T, data: unknown): z.infer<T> {
  try {
    return model.parse(data);
  } catch (error) {
    // ...collect ZodError issues...
    throw new ValidationError('Validation error' + ...);
  }
}
```

WebSocket failures are **delivered to the listener** (`onError`), not thrown, because there is no call stack to catch them — `WebSocketClientImpl` reports `WebSocketConnectionError` (open failed), `WebSocketMessageError` (malformed frame), and `WebSocketClosedError` (reconnect attempts exhausted). See [data-fetching.md](./data-fetching.md) for the streaming pattern.

## Pattern — where errors surface (App boundary)

Uncaught render/data errors bubble to the App Router error boundary:

```tsx
// app/error.tsx — 'use client'
export default function Error(props: { error: Error; reset: () => void }) {
  const { error, reset } = props;
  useEffect(() => console.error(error), [error]); // log detailed context
  // ...user-friendly copy + reset() button...
}
```

Query/mutation errors surface through React Query state (`error` / `isError`) at the call site — branch on the typed class there rather than at the boundary when you can recover in place.

## Anti-patterns

```ts
// ❌ Untyped throw — not branchable, breaks on message/i18n edits
throw new Error('Unauthorized');
// ✅ throw new UnauthorizedError();

// ❌ Cross-cutting error dumped into a feature/slice, or a domain error put in /src/errors
// UserNotFoundError belongs in src/domain/users/errors, NOT src/errors/*

// ❌ Constructing/handling infra errors in UI or Views (Errors layer is off-limits there)
// src/ui/atoms/... or src/views/...
if (error instanceof HttpError) { ... } // move to a feature/data layer

// ❌ Message string-matching instead of instanceof / code
if (error.message.includes('token')) refresh(); // use `error instanceof InvalidTokenError`

// ❌ Swallowing errors silently (violates common/coding-style error-handling rule)
try { await save(); } catch { /* nothing */ }

// ❌ Assuming per-status classes are thrown by the raw client today
try { await http.get(...); } catch (e) { if (e instanceof ForbiddenError) ... } // won't fire
// ✅ if (e instanceof HttpError && e.statusCode === 403) ...
```

## See also

- [architecture.md](./architecture.md) — the Errors layer and its dependency rule (accessible everywhere except Utils and UI).
- [data-fetching.md](./data-fetching.md) — where `HttpClientImpl` / `WebSocketClientImpl` sit and how failures reach components.
- [code-style.md](./code-style.md) — class/`static code` naming conventions.
- Source: `src/errors/**`, `src/data/network/http/HttpClientImpl.ts`, `src/data/network/websocket/WebSocketClientImpl.ts`, `src/utils/model.ts`, `app/error.tsx`.
