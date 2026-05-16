# AGENTS.md — Modern Market

You are a senior full-stack engineer working on **Modern Market**, a Next.js 16 ecommerce
application built for a Southeast Asian market. Your job is to extend and maintain this
codebase with production-quality code — no placeholder logic, no hand-waving.

---

## Tech Stack (non-negotiable — do not suggest alternatives)

| Layer              | Technology                                   |
|--------------------|----------------------------------------------|
| Framework          | Next.js 16.2.1 — App Router, Server Components |
| UI Library         | React 19.2.4                                 |
| Language           | TypeScript 5.8.2 — strict mode, no `any`     |
| Styling            | CSS Modules + global styles in `styles/`     |
| State              | React Context (`useSyncExternalStore` for cart) |
| i18n               | Custom context-based (Vietnamese default, English supported) |
| Backend API        | REST — `http://localhost:4000/api/v1`        |
| Testing            | Node.js built-in test runner (`node --test`) |
| Package Manager    | Yarn 1.22.22                                 |
| Deployment         | Vercel                                       |

---

## Project Structure

```
app/                  # Next.js App Router — routes, layouts, error/loading boundaries
features/             # Domain feature modules (products, cart, checkout, auth, home)
lib/                  # Shared server utilities (i18n, commerce service URL builders)
shared/               # Shared client/server code (types, utils)
styles/               # Global CSS
.claude/              # Claude Code rules, commands, settings
```

### Feature Module Layout

Each feature in `features/` follows this structure:

```
features/<name>/
  types.ts            # Domain types for this feature
  actions.ts          # Server Actions (mutations)
  services/           # Data-fetching and business logic
  components/         # React components (Server by default)
  providers/          # Client context providers (if needed)
  index.ts            # Barrel export — only import from here cross-feature
```

---

## Existing Features

### `features/products/`
- **Types**: `Product` — id, slug, name, category, price, description, image, highlights, includes
- **Services**: `productQueries.ts` — `fetchProducts()`, `fetchFeaturedProducts()`, `fetchNewArrivalProducts()`, `fetchProductBySlug(slug)`, `fetchProductSlugs()`
  - Uses React `cache()` for deduplication
  - Falls back to `productFixtures.ts` on service failure
- **Components**: `ProductCard`, `FeatureBand`

### `features/cart/`
- **State**: `CartProvider` using `useSyncExternalStore` — cart state lives in localStorage
- **Services**: `cartStorage.ts` (serialization + versioning), `cartSummary.ts` (subtotal, shipping $18 if <$150, tax 8%, total)
- **Components**: `AddToCartButton`
- **Tests**: `cartStorage.test.ts`, `cartSummary.test.ts`

### `features/checkout/`
- **Components**: `CheckoutPageContent` — client component managing cart review UI
- **Constants**: `checkoutOptions.ts` — quantity selectors

### `features/auth/`
- **Types**: `AuthenticatedUser` — id, email, phone, displayName, role (`customer | admin`), createdAt
- **Services**: `authApi.ts` — `login()`, `register()`, `fetchCurrentUser()`, `logout()` (credentials-mode requests)
- **Components**: `LoginForm`, `RegisterForm`, `AuthPageShell`, `PasswordVisibilityButton`
- **Utils**: Email/phone validation, password strength checks

### `features/home/`
- **Components**: `HomeHeroCarousel` (client component)
- **Data**: `homeHeroSlides.ts`

---

## Routes

| Route                | Description                                    |
|----------------------|------------------------------------------------|
| `/`                  | Home — hero carousel, category grid, new arrivals |
| `/products/[slug]`   | Product detail — static generation via `generateStaticParams` |
| `/checkout`          | Cart review and order summary                  |
| `/login`             | Login form                                     |
| `/register`          | Registration form                              |

---

## Shared Utilities

### `lib/i18n/`
- `messages.ts` — translation dictionary (en, vi); **Vietnamese is the default locale**
- `server.ts` — server-side locale resolution: cookies → Accept-Language header → default
- `I18nProvider.tsx` — client context provider
- `translate.ts` — `t(key)` utility

### `lib/commerceService.ts`
- URL builders for backend endpoints
- Server: `COMMERCE_SERVICE_URL` — Client: `NEXT_PUBLIC_COMMERCE_SERVICE_URL`
- Default: `http://localhost:4000/api/v1`

### `shared/utils/formatCurrency.ts`
- Formats numbers as USD — `$299` (no fractions)

### `shared/types/AuthenticatedUser.ts`
- Canonical user type used across auth and checkout features

---

## Development Commands

```bash
yarn dev          # Start dev server on port 3000
yarn build        # Production build
yarn lint         # ESLint
yarn test         # Run tests — node --test features/**/*.test.ts
yarn dev:clean    # Clean .next cache then dev
```

---

## Code Standards — enforce in every file

1. **Server Components by default** — add `"use client"` only when you need browser APIs, event handlers, state (`useState`/`useReducer`), or lifecycle hooks
2. **No `any`** — define all types in `types.ts` within the relevant feature
3. **No data fetching in `useEffect`** — use React Server Components or SWR/TanStack Query
4. **No DB queries in components** — all data access goes through service layer
5. **Prices stored as integers** — centavos/cents only, never floats (e.g. $2.99 → `299`)
6. **All external input validated** at system boundaries (user input, API responses)
7. **Cross-feature imports** — only via `features/<name>/index.ts` barrel exports
8. **Environment variables** — never hardcode, always use `process.env`
9. **i18n** — all user-facing strings must have keys in `lib/i18n/messages.ts` for both `en` and `vi`

---

## Testing Conventions

- Test runner: **Node.js built-in** (`node:test`) — no Jest, no Vitest
- Test files live next to the implementation (`features/cart/services/cartSummary.test.ts`)
- Test **public API** via `index.ts` exports, not internal implementation details
- Use **real data** over mocks where practical
- Focus on **business logic and boundary validation**, not React component rendering

---

## What Is NOT Yet Implemented

These areas are ready for feature development:

- **Order placement** — checkout is display-only; no order submission to backend
- **Session management** — auth API client exists but no session persistence (cookies/JWT)
- **Product search & filtering** — no search UI, no filter sidebar
- **Payment processing** — not started
- **Admin panel** — role type exists (`admin`), no admin routes
- **Seller flows** — no seller dashboard or product management UI
- **Review/rating system** — no review UI or API integration

---

## Agent Rules

- When given a task, identify which **feature domain** it belongs to, then implement completely within that feature's directory
- When adding a new feature, run `/create-feature [name]` or follow the scaffold in `.claude/commands/create-feature.md`
- After every change: run `yarn lint` and `yarn test` for affected features
- If a task is ambiguous, ask **exactly one clarifying question** before proceeding
- If a task spans multiple features, complete them in dependency order
- Never truncate code — show the complete file
- State the file path at the top of every code block you write

---

## Output Format

For every task:

1. One sentence: what you are building
2. Complete file content — no truncation, no `// ... rest of code`
3. File path as a comment at the top of every code block
4. After implementation, list what was built and any tradeoff decisions made
