# Handoff Brief: Order Confirmation + Order History

This brief is for Claude Code working in the `ecommerce-web` + `commerce-service` repos. It contains everything needed to implement the order-confirmation screen and the order-history page in the Modern Market design system, without inventing new design tokens.

## Goal

Add two screens to the storefront:

1. **`/checkout/success?orderId=<id>`** — shown after a successful order placement. Confirms the order, shows the item summary, the shipping ETA, and a "Continue shopping" CTA.
2. **`/account/orders`** — authenticated user's order history. Lists past orders newest-first, each expandable to show items and totals.

Plus the backend endpoints that feed them.

---

## Backend changes (`commerce-service`)

### 1. Prisma schema

Add to `prisma/schema.prisma`:

```prisma
model Order {
  id          String       @id @default(cuid())
  userId      String
  status      OrderStatus  @default(PENDING)
  subtotal    Int          // cents
  shipping    Int          // cents
  tax         Int          // cents
  total       Int          // cents
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  items       OrderItem[]

  @@index([userId, createdAt])
}

model OrderItem {
  id           String   @id @default(cuid())
  orderId      String
  productId    String
  productSlug  String   // denormalized for history rendering
  productName  String   // denormalized
  category     String   // denormalized
  unitPrice    Int      // cents, snapshot
  quantity     Int
  order        Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)

  @@index([orderId])
}

enum OrderStatus {
  PENDING
  PAID
  FULFILLED
  CANCELLED
}
```

Run `yarn prisma:generate && yarn db:push`.

### 2. New feature module: `src/modules/orders/`

Create the standard feature shape (matches `auth/` and `products/`):

```
src/modules/orders/
├── orders.routes.ts
├── orders.controller.ts
├── orders.service.ts
├── orders.repository.ts
├── orders.validation.ts
├── orders.types.ts
└── index.ts
```

### 3. Endpoints

| Method | Path | Auth | Body / Query | Returns |
|---|---|---|---|---|
| POST | `/api/orders` | session cookie | `{ items: [{productId, quantity}], shippingAddress? }` | `{ data: Order }` |
| GET  | `/api/orders` | session cookie | — | `{ data: Order[] }` (newest first, limit 50) |
| GET  | `/api/orders/:id` | session cookie | — | `{ data: Order }` |

**Validation (Zod)** — at minimum:
- `items` is non-empty array
- each `quantity` is integer ≥ 1, ≤ 99
- each `productId` is a known seed id

**Service behavior for POST**:
1. Validate input
2. Load products by id, fail if any missing
3. Compute subtotal from the **server's** known prices (never trust client prices)
4. shipping: `subtotal >= 15000` (cents) → 0, else `500`
5. tax: `Math.round(subtotal * 0.08)`
6. total: `subtotal + shipping + tax`
7. Create order + items in a single Prisma transaction
8. Return the order with items joined

**Wire it up in `src/app.ts`**:
```ts
import { ordersRouter } from "./modules/orders/index.js";
app.use(`${env.API_PREFIX}/orders`, ordersRouter);
```

---

## Frontend changes (`ecommerce-web`)

### 1. Feature module

Create `features/orders/`:

```
features/orders/
├── components/
│   ├── OrderSummaryCard.tsx
│   ├── OrderConfirmationContent.tsx
│   ├── OrderHistoryList.tsx
│   └── index.ts
├── services/
│   ├── ordersApi.ts
│   └── index.ts
├── types/
│   └── Order.ts
└── index.ts
```

### 2. Routes (App Router)

- `app/checkout/success/page.tsx` — Server Component, reads `?orderId=`, fetches order, renders `OrderConfirmationContent`. Use `notFound()` if order doesn't belong to current user.
- `app/account/orders/page.tsx` — Server Component, fetches `/api/orders`, renders `OrderHistoryList`. Redirect to `/login` if unauthenticated.

### 3. Update existing `CheckoutPageContent.tsx`

Currently the "Place order" button is disabled. Change it to:
1. POST cart to `/api/orders`
2. On success: clear cart, `router.push('/checkout/success?orderId=' + order.id)`
3. On failure: show error in a `.login-error` style banner above the button

---

## Visual / design language

**CRITICAL: do not invent new tokens, classes, or shadows.** Everything below is already in `styles/globals.css`. If you need something that isn't there, ask before adding.

### Order confirmation screen layout

Wrap in `<main className="page-shell page-shell--marketplace">`.

Structure:
```
[eyebrow:    "Order confirmed"     ← class="eyebrow", color: var(--accent)]
[h1:         "Thanks for your order, <Name>."]
[paragraph:  "Order #<id-short> is being prepared. We'll email a receipt to <email>."]

[Two-column grid, same gap as checkout-layout--marketplace]

LEFT COLUMN (.checkout-card, padding: 1rem):
  ┌─ eyebrow: "Items"
  ├─ for each OrderItem render a <article className="cart-item cart-item--marketplace">
  │    (reuse the existing cart-item structure from CheckoutPageContent)
  └─ remove the qty/select and remove buttons — read-only

RIGHT COLUMN (.summary-card, sticky):
  ┌─ eyebrow: "Order summary"
  ├─ .summary-row × 4 (Subtotal, Shipping, Tax, Total)
  ├─ A NEW small block:
  │    "Estimated delivery"  bold
  │    "Mar 28 – Apr 2"      muted
  ├─ NEW: "Order status" pill — use .tag styling, but green background
  │    when status is PAID/FULFILLED, default grey for PENDING
  └─ <Link href="/" className="button button--primary button--full">
       Continue shopping
     </Link>
```

### Order history screen layout

Wrap in `<main className="page-shell page-shell--marketplace">`.

```
[eyebrow:  "Your account"]
[h1:       "Order history"]

[Empty state (when no orders) — reuse <div className="empty-state empty-state--marketplace">
  <h2>You haven't placed an order yet.</h2>
  <p>Browse the marketplace and start your first order.</p>
  <Link className="button button--primary" href="/">Shop now</Link>
]

[Otherwise, a list of order cards (single column, stacked):
  Each card = <article className="checkout-card"> (the existing class), padding 1rem
  
  Card structure:
    HEADER row (flex, justify-between, baseline):
      LEFT:  eyebrow="Order #<id-short>"  +  h3=<formatted date>
      RIGHT: status pill (same as confirmation screen)
    
    Then a thin row showing first 3 item thumbnails + "+N more" if any
      (use the picsum.photos URL from the snapshot)
    
    Then a summary-row–style total line at the bottom:
      "<itemCount> items"        on left
      <total formatted currency> on right, in var(--accent)
    
    Whole card is a <Link href={`/checkout/success?orderId=${order.id}`}>
]
```

### Tokens to use (already exist in `colors_and_type.css`)

| Need | Token |
|---|---|
| Page background | `var(--background)` |
| Card background | `var(--surface)` |
| Card shadow | `var(--shadow)` |
| Card radius | `4px` (matches checkout-card) |
| Primary text | `var(--foreground)` |
| Secondary text | `var(--muted)` |
| Price / accent | `var(--accent)` |
| Status PAID / FULFILLED | `var(--success)` (`#26aa99`) |
| Status PENDING | `var(--muted)` |
| Status CANCELLED | `var(--danger)` |
| Eyebrow | class `eyebrow` |
| Buttons | class `button button--primary` (full-width: also `button--full`) |
| Spacing between major blocks | `1rem` and `1.5rem` — match existing checkout layout |

### Copy

| Surface | Copy |
|---|---|
| Confirmation eyebrow | `Order confirmed` |
| Confirmation H1 | `Thanks for your order, <Name>.` (fallback: `Thanks for your order.`) |
| Confirmation body | `Order #<shortId> is being prepared. We'll email a receipt to <email>.` |
| Continue CTA | `Continue shopping` |
| History eyebrow | `Your account` |
| History H1 | `Order history` |
| Empty state H2 | `You haven't placed an order yet.` |
| Empty state body | `Browse the marketplace and start your first order.` |
| Empty CTA | `Shop now` |
| Status PAID | `Paid` |
| Status PENDING | `Pending` |
| Status FULFILLED | `Fulfilled` |
| Status CANCELLED | `Cancelled` |

All sentence-case. No emoji. Match the existing voice in `lib/i18n/messages.ts`.

---

## Testing checklist

- [ ] `POST /api/orders` rejects unauthenticated requests with 401
- [ ] `POST /api/orders` recomputes totals server-side and ignores client prices
- [ ] `GET /api/orders/:id` rejects orders that don't belong to the requesting user with 404 (not 403 — don't leak existence)
- [ ] After "Place order" succeeds, cart is cleared
- [ ] Refreshing `/checkout/success?orderId=...` still shows the order
- [ ] `/account/orders` shows empty state when there are zero orders
- [ ] Status pill background color matches the spec

---

## What NOT to do

- Don't add a new CSS file. Extend `styles/globals.css` only if a genuinely new class is needed.
- Don't introduce new colors or radii — `var(--success)` and `4px` already cover everything here.
- Don't add a date library; format dates with `Intl.DateTimeFormat`.
- Don't add a state library; React's built-in `useState` + Server Components fetch is enough.
- Don't add Tailwind, CSS-in-JS, or any styling abstraction. The project is plain CSS classes.
- Don't change `formatCurrency` — extend it only if you need cents-aware parsing.
- Don't mock the auth; reuse `features/auth`'s `fetchCurrentUser`.

---

## Out of scope (do not implement)

- Stripe payment integration — that's the next milestone.
- Order cancellation / refund flow.
- Admin views.
- Email sending.
- Shipping address collection (for now, store a placeholder).
