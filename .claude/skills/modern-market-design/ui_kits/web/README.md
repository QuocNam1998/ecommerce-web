# Modern Market — Web UI Kit

A click-thru recreation of the **Modern Market** storefront, faithful to the live codebase at [QuocNam1998/ecommerce-web](https://github.com/QuocNam1998/ecommerce-web).

Open **`index.html`** in the project preview pane.

## Screens covered
- **Home** — sticky header → orange hero → category strip → feature band → two product rails
- **Product detail** — image gallery + title + price panel + tags + "what's included" + CTAs
- **Checkout** — cart list + sticky summary card; empty-cart state
- **Login** — full-bleed orange stage with promo collage + login card on the right
- **Register** — same shell, longer form on the right

## Files

| File | Contents |
|---|---|
| `index.html` | Routing shell, screen switcher, cart state. Open this. |
| `kit.css` | Class rules lifted from `ecommerce-web/styles/globals.css` (tokens come from the system's `colors_and_type.css`). |
| `data.js` | Seed catalog of six products (mirrors `features/products/services/productData.ts`). |
| `Header.jsx` | Promo bar + main bar (logo, search, cart pill). |
| `Hero.jsx` | Orange-gradient hero banner + two side cards. |
| `CategoryStrip.jsx` | 8-chip horizontal navigation. |
| `FeatureBand.jsx` | 4-up value props. |
| `ProductCard.jsx`, `ProductGrid.jsx` | Catalog card + grid wrapper. |
| `ProductDetail.jsx` | PDP layout. |
| `Checkout.jsx` | Cart items list + summary card + empty state. |
| `Login.jsx`, `Register.jsx` | Auth shell + promo + form. |
| `Buttons.jsx`, `Field.jsx` | Reusable primitives. |

## What works as a prototype
- The "Cart" pill and "Add to cart" buttons increment a shared cart count.
- Clicking a product card opens the PDP. The PDP "Buy now" goes to checkout.
- Checkout supports quantity changes and item removal.
- Login / Register forms validate inline but don't submit anywhere (demo only).
- The header "Sign In" pill routes to the login screen.

## What's intentionally stubbed
- Product images are placeholders from `picsum.photos` (same as the codebase).
- Social auth buttons are disabled (same as the codebase).
- "Place order" doesn't go anywhere.
- No real backend; everything is client-side state.
