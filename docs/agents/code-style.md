# Code style

> How we name and declare TypeScript in every `*.{ts,tsx}` file — components, features, data, domain, utils, tests, and app routes.

## TL;DR

- Destructure the React import — never `React.ChangeEvent`; import `ChangeEvent` (or other types) directly from `'react'`.
- Props: **attributes first, operations second**; within each group, **required before optional**. Same order when declaring types and when passing props in JSX.
- **`function`** for components, custom hooks, `/src/utils` exports, and class methods; **arrow functions** for callbacks, closures, and helpers defined inside another function.
- **Hooks:** `export default function useXxx(params: TParams)`; camelCase `use` prefix; destructure `params` at the top of the body.
- Prop types prefixed with `T`; default export; `className` last on the root element via `clsx`; BEM-like SCSS class names.
- **Enums:** PascalCase enum name; `SCREAMING_SNAKE_CASE` members; runtime values in `snake_case` strings.
- **Constants:** `SCREAMING_SNAKE_CASE` for module-level `export const` values.
- **Domain models:** Zod schema as `EntityModel`; inferred type as `TEntity` via `z.infer<typeof EntityModel>`.

## Component template

```tsx
import { PropsWithChildren } from 'react';
import clsx from 'clsx';

import classes from './MyAtom.module.scss';

type TVariant = 'primary' | 'secondary';

type TProps = PropsWithChildren & {
  variant: TVariant;
  className?: string;
};

export default function MyAtom(props: TProps) {
  const { variant, className, children } = props;

  return <div className={clsx(classes.my_atom, classes[`my_atom_variant_${variant}`], className)}>{children}</div>;
}
```

Conventions in the template:

- Prop type prefixed with `T` (`TProps`, `TVariant`).
- Default export, name matches the file.
- `className` is always last; passed through to the root element via `clsx`.
- BEM-like SCSS class naming (`my_atom`, `my_atom_variant_primary`).

## React import destructuring

Always destructure named imports from `'react'`. Do not use the default `React` namespace for types or APIs.

```tsx
// ✅
import { ChangeEvent, PropsWithChildren } from 'react';

function onChange(event: ChangeEvent<HTMLInputElement>) { ... }

// ❌
import React from 'react';

function onChange(event: React.ChangeEvent<HTMLInputElement>) { ... }
```

## Props order

Attributes go first, operations go second. This applies to both prop type declarations and JSX prop passing.

Within each group, required props come before optional props.

```tsx
type TProps = {
  id: string; // required attribute
  label: string; // required attribute
  className?: string; // optional attribute
  onClick: () => void; // required operation
  onBlur?: () => void; // optional operation
};

<MyAtom id='x' label='Save' className={classes.root} onClick={handleClick} onBlur={handleBlur} />;
```

`className` stays last among attributes when present.

## Function usage

1. **`function` keyword** — React component declarations, custom hooks, global utilities in `/src/utils`, and class methods.
2. **Arrow functions** (`const myFunc = () => {}`) — local helpers, callbacks, and closures defined inside another component or function.

```tsx
// ✅ Component and util
export default function Button(props: TProps) { ... }

export function formatLabel(value: string) { ... }

// ✅ Local callback inside a component
export default function Form(props: TProps) {
  const handleSubmit = () => { ... };
  return <form onSubmit={handleSubmit}>...</form>;
}

// ❌ Arrow for a top-level component or util
const Button = (props: TProps) => { ... };
```

## File organization

### One component per file

- Exactly **one React component per file**; the file name matches the default-exported component.
- "One feature = one component" is a misconception — a feature (or a UI molecule) **may own several components**. Put each in **its own file** inside the feature/molecule folder; never stack multiple component definitions in one file.
- Sub-components used by a single parent live beside it in the same folder, one file each (e.g. `ui/molecules/tic-tac-toe/TicTacToeBoard.tsx` + `Mark.tsx`).

```tsx
// ❌ Two components + a helper crammed into one file
function Mark() { ... }
function winLinePath() { ... }
export default function Board() { ... }

// ✅ Board.tsx (component), Mark.tsx (component), boardGeometry.ts (helpers)
```

### Where non-component code goes

Pull pure helpers, constants, and geometry **out of component files**:

- **Reusable across the app** → `/src/utils` (see [architecture.md](./architecture.md)), exported with the `function` keyword.
- **Used by one feature/molecule only** → a co-located module (`features/<name>/utils.ts`, `ui/molecules/<name>/<something>.ts`).
- A component file keeps only the component and its local callbacks/closures.

## Hooks

Custom hooks live under `hooks/` next to the feature or util that owns them (e.g. `src/features/login/hooks/useLoginForm.tsx`).

- **Name:** camelCase with a `use` prefix (`useVoiceInput`). Must match the file name.
- **Declaration:** `export default function` — same `function` rule as components; never a top-level arrow.
- **Parameters:** a single object argument `params: TParams` when the hook accepts input; type named `TParams`. Hooks with no inputs omit the parameter.
- **Body:** destructure `params` immediately after the signature; follow [props order](#props-order) inside `TParams` (attributes before operations, required before optional).

```tsx
type TParams = {
  updateTextPrompt: (text: string) => void;
};

export default function useVoiceInput(params: TParams) {
  const { updateTextPrompt } = params;

  // hook logic

  return { ... };
}
```

```tsx
// ✅ Hook with no parameters
export default function useSession() {
  // ...
}

// ❌ Named export or arrow
export const useVoiceInput = (params: TParams) => { ... };

// ❌ Positional parameters instead of a params object
export default function useVoiceInput(updateTextPrompt: (text: string) => void) { ... }
```

## Naming

### Enums

- Enum **name**: PascalCase (`ToolName`).
- Enum **members**: `SCREAMING_SNAKE_CASE` (`MANAGE_USER_MEMORY`).
- Enum **values** (when strings): `snake_case` literals matching the member semantics (`'manage_user_memory'`).

```ts
export enum ToolName {
  MANAGE_USER_MEMORY = 'manage_user_memory',
}
```

### Global constants

Module-level immutable values use `SCREAMING_SNAKE_CASE`. Export with `export const`.

```ts
export const DEFAULT_DELAY = 1000;
```

### Domain models (`/src/domain/**`)

- Zod object schemas: PascalCase with a **`Model` suffix** (`PostModel`, `PostsListSchema` for non-entity collections).
- Inferred TypeScript types: **`T` prefix** + entity name (`TPost`, `TPostsList`), derived with `z.infer<typeof …>`.
- Colocate schema and type in the same file under `models/` or `schemas/` inside the domain slice.

```ts
import z from 'zod';

export const PostModel = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  body: z.string(),
});

export type TPost = z.infer<typeof PostModel>;
```

```ts
// ❌ Type name without T prefix
export type Post = z.infer<typeof PostModel>;

// ❌ Schema name without Model suffix (for entity objects)
export const Post = z.object({ ... });

// ❌ Duplicating fields by hand instead of inferring
export type TPost = { id: number; userId: number; title: string; body: string };
```

UI prop types (`TProps`, `TVariant`) follow the same **`T` prefix** rule; domain entity types use `T` + entity (`TPost`), not `T` + `Props`.

## See also

- [ui.md](./ui.md) — UI layer layout, tiers, and anti-patterns.
- [styling.md](./styling.md) — SCSS module conventions, `@assets/*` aliases.
- [architecture.md](./architecture.md) — where domain models and enums live in the layer map.
