---
paths:
  - "app/**"
  - "features/**"
  - "shared/**"
  - "lib/**"
---

# Next.js Rules

## Server vs Client Components

- **Default: Server Component** — never add `"use client"` unless the file genuinely needs it
- Add `"use client"` only for: `useState`, `useEffect`, other React hooks, DOM APIs, browser storage, event handlers, or third-party browser-only libraries
- Keep client components small — move data fetching and heavy composition to server components
- Pass only serializable data across the server/client boundary (no functions, class instances, etc.)

## Data Fetching

- Fetch data on the server, close to the component that needs it
- Use explicit async function names: `fetchProducts`, `getProductBySlug`, `loadCartItems`
- Handle empty states and errors deliberately — no silent failures
- Never duplicate fetches across parent and child components

## Server Actions vs Route Handlers

- **Server Actions** (`"use server"`) for mutations tightly coupled to UI forms
- **Route Handlers** (`app/api/`) only when an HTTP endpoint is explicitly needed by an external consumer
- Never create a Route Handler just to call it from the same server-rendered app

## Feature Module Structure

```
features/[name]/
  index.ts         # public barrel exports only
  types.ts         # TypeScript interfaces
  actions.ts       # Server Actions ("use server")
  components/      # Feature-specific UI
```

- Import from a feature's `index.ts`, never from internal paths (`features/cart/actions`)
- No direct cross-feature imports — always go through `index.ts`

## Routing

- Use `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` as Next.js entry points
- Dynamic routes use `[param]` — catch-all routes `[...param]` only when needed
- Route groups `(group)` only when they meaningfully improve folder organization

## Validation

- Validate all external input (form data, route params, search params, API responses) at the boundary
- Use TypeScript types to enforce shape — but don't rely solely on TypeScript; validate at runtime too
