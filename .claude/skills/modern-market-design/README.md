# Modern Market — Design System

A design system reverse-engineered from the **Modern Market** storefront, a Next.js 16 / React 19 e-commerce learning project built by [@QuocNam1998](https://github.com/QuocNam1998). The visual language is in the family of large Southeast-Asian marketplaces (Shopee, Lazada, Tiki) — saturated orange, dense product grids, stacked promotional surfaces, and a sticky search-first header.

> **Note on lineage.** The source codebase is openly inspired by Shopee — same `#ee4d2d` accent, same gradient header pattern, same "MEGA SALE / VOUCHERS" promo language, and CSS that references a proprietary `Shopee 2021` font family. This system documents what's *in the code* under the project's own brand name (`Modern Market`, from `package.json` → `"name": "modern-market"` and `<Metadata title>`). The proprietary font has been substituted with **Inter** as a close, freely-licensed metrics match. Where Shopee-specific strings ("ShopeeVIP", "Sign up", agreement copy) appear in the codebase's i18n, this system replaces them with brand-neutral equivalents so the design system is reusable independently.

---

## Sources

| Source | Path |
|---|---|
| Frontend (Next.js 16) | https://github.com/QuocNam1998/ecommerce-web |
| Backend (Express + Prisma) | https://github.com/QuocNam1998/commerce-service |
| Primary stylesheet | `ecommerce-web/styles/globals.css` |
| Component library | `ecommerce-web/features/` |
| Page routes | `ecommerce-web/app/` |
| Copy / strings (en + vi) | `ecommerce-web/lib/i18n/messages.ts` |

Both repos are referenced by commit `28fc8a7` (`ecommerce-web`) and `1f940b9` (`commerce-service`) at the time this system was authored.

---

## Index — what's in this folder

```
.
├── README.md                ← this file
├── SKILL.md                 ← agent skill manifest (download to use in Claude Code)
├── colors_and_type.css      ← all design tokens as CSS custom properties
├── assets/
│   ├── logo-wordmark.svg        ← horizontal logo for white backgrounds
│   ├── logo-wordmark-white.svg  ← horizontal logo for orange backgrounds
│   └── logo-mark.svg            ← square mark only (favicon, app icon)
├── preview/                 ← Design System tab cards (do not import directly)
└── ui_kits/
    └── web/                 ← marketplace web storefront
        ├── README.md
        ├── index.html             ← click-thru prototype across all screens
        ├── components.jsx         ← header, hero, product grid, cart, etc.
        └── …
```

---

## 1. Brand & product context

**Modern Market** is a marketplace-style e-commerce storefront — a homepage with a flash-sale banner, category chips, two stacked product rails (Flash sale + New arrivals), product detail pages, checkout, and email/phone authentication. It is **one product, one surface**: a public web storefront. There is no admin panel, no seller dashboard, no mobile app in the codebase yet.

**Domain.** General merchandise. The seed catalog skews home/lifestyle goods (a lamp, a Bluetooth speaker, a desk mat, a throw blanket, a mug set, a notebook kit), priced US$36–148. Categories surfaced on the homepage are `Electronics / Home Living / Fashion / Beauty / Sports / Vouchers / Groceries / Gaming` — broad like a marketplace, not a single-category boutique.

**Tech stack.** Next.js 16 App Router · React 19 · TypeScript · feature-folder architecture (`features/auth`, `features/cart`, `features/checkout`, `features/products`) · Express/Prisma backend · i18n in **English and Vietnamese** (Vietnamese is the default locale, hinting at primary market).

---

## 2. Content fundamentals

### Tone
**Transactional and incentive-led.** Copy emphasizes *deals*, *vouchers*, *free shipping*, *flash sales*, and *daily drops*. It's not editorial or aspirational — it tells you what's on sale and how much you'll save. Confident but not boastful; never poetic.

### Voice
- Speaks to the reader directly ("Your cart is empty.", "Browse the marketplace and add a few deals to continue.")
- Avoids "we" / "our brand" language — the site is a venue, not a personality
- Imperative for actions ("Shop now", "View cart", "Return to shop", "Place order")
- Bilingual-friendly: phrases are short and translate cleanly to Vietnamese

### Casing
- **Sentence case** for almost everything: hero headlines, section headings, body, links
- **UPPERCASE** for primary CTAs inside auth flows (`LOG IN`, `SIGN UP`, `PROCESSING...`) — a marketplace convention; load-bearing
- **UPPERCASE + tracked** for eyebrows (`Mega campaign`, `Flash sale`, `Recommended for you`) with `letter-spacing: 0.12em`
- **UPPERCASE + tracked** for promo tickets (`FREESHIP`, `FAST | AFFORDABLE`)
- **Title Case** is rare — mostly only for category chips (`Home Living`, `Flash Sale`)

### Specific examples from the codebase
| Surface | Copy |
|---|---|
| Hero eyebrow | `Mega campaign` |
| Hero headline | `Mid-year deals with free shipping and daily flash prices.` |
| Hero body | `Shop an orange-marketplace style storefront with stacked promos, fast checkout, and curated best sellers for your home setup.` |
| Primary CTA | `Shop now` |
| Secondary CTA | `View cart` |
| Section eyebrow | `Flash sale` |
| Section headline | `Trending deals shoppers are checking out right now.` |
| Product badge | `Mall` |
| Product meta | `4.9 rating · Sold 1.2k+ · Free shipping` |
| Empty cart | `Your cart is empty.` / `Browse the marketplace and add a few deals to continue.` |
| Order CTA | `Place order` |
| Demo notice | `Demo checkout only. Connect payment and shipping providers when you are ready.` |
| Form hint | `Use your phone number or email address.` |
| Form error | `Enter a valid phone number or email address.` |

### Numbers & currency
- Currency formatted via `formatCurrency()` — locale-aware. Prices in the seed data are integer USD (`$96`, `$148`).
- Quantity / sold counts are abbreviated colloquially (`1.2k sold`, `1,000 winning chances`)
- Discount values appear in the promo cards as raw numbers (`25%`, `$0`) with a small subtitle below (`new vouchers every day`)

### Emoji & punctuation
- **No emoji.** None appear in copy, components, or i18n strings.
- Em-dashes and curly quotes are rare; the codebase uses straight quotes and hyphens.
- Promo separators use pipes: `FAST | AFFORDABLE`.

---

## 3. Visual foundations

### Palette philosophy
A single, **dominant brand orange** (`#ee4d2d`) used aggressively on:
- The sticky header (full-width gradient `#f96f3a → #ee4d2d`)
- Primary CTAs, prices, category labels, links inside cards
- The entire login page background (`#f53d2d` flat + a layered radial gradient)
- The hero banner (gradient `#ff8a3c → #ff5d2c → #ffb35e`)

Neutrals are warm — `#f5f5f5` page background, `#fff4ee` warm surface, `#fff1eb` accent-soft tint for the price panel. Borders are tight low-contrast hairlines (`#ebebeb`, `#d9d9d9`). Body text is `#222222` on white; secondary text is `#6b6f76`.

**Semantic colors** beyond the brand: one green (`#26aa99` — "Free shipping", success states) and one red (`#d73211` — same as `--accent-dark`, doubles as error). No blue, no purple, no extended brand palette.

### Typography
- **Family.** Sans-serif throughout. The codebase declares `"Shopee 2021"` then falls back to `-apple-system`, `Helvetica Neue`, `Roboto`, `Arial`. This system uses **Inter** as the public substitute — similar metrics, similar humanist character, free on Google Fonts.
- **No serifs anywhere.** No script faces. No mono outside developer tooling.
- **Weight system.** Regular (400) for body and submit buttons; Semibold/Bold (600/700) for headings; Extrabold/Black (800/900) for big promo numbers and hero headlines.
- **Display sizes lean huge.** Login promo numbers go to `clamp(6rem, 10vw, 9.6rem)` with a chunky text-shadow. Hero h1 is `clamp(2.5rem, 5vw, 4rem)`.

### Spacing & layout
- **Container width** is `min(calc(100% - 2rem), 1200px)` everywhere — every section centers on the same 1200px max.
- **Header grid** is `220px 1fr 140px` (logo / search / actions).
- **Product grid** is `repeat(4, minmax(0, 1fr))` desktop, collapsing to 2 columns at 1080px, 1 column at 720px.
- **Hero** is `2fr 1fr` (banner + stacked side cards).
- **Checkout** is `1.4fr 0.6fr` (cart list + sticky summary card).
- **PDP** is `0.95fr 1.05fr` (gallery + content) — content slightly wider than the image.

### Cards & elevation
Cards are **bright white with a single soft shadow** — `0 2px 10px rgba(0, 0, 0, 0.08)`. No borders by default; the shadow does the lifting. The login card uses a stronger shadow (`0 3px 10px rgba(0, 0, 0, 0.14)`). Hero promo cards inside the orange stage use heavy, warm-tinted drop shadows (`0 22px 40px rgba(130, 28, 5, 0.25)`).

### Corner radii
A pragmatic, slightly-eclectic set:
- `2px` form inputs, login submit button (very crisp, marketplace-feel)
- `4px` default buttons, product cards, checkout cards
- `12–14px` category chips, feature-band cards
- `18px` market hero banner, large rounded surfaces
- `22px` promo tickets in the login stage
- `28px` the central promo voucher card
- `999px` cart pills, tags, chips, eye-toggle focus ring

### Backgrounds
- **No imagery in the chrome.** No hero photo, no fashion banner, no editorial photography in any of the sections. The hero is a pure orange gradient.
- **Product photos** come from `picsum.photos` with a seed per slug — placeholders. Aspect ratio is `1 / 1` on grid cards, `minHeight: 540px` on the PDP image.
- **Login page is fully orange** with two stacked radial gradients (a warm yellow puddle top-left + a darker orange puddle center-right) over a flat `linear-gradient(#ee4d2d → #e53d20)`. Decorative "spark" dots and translucent backdrops layer in front.
- **No textures, no grain, no hand-drawn illustrations, no repeating patterns.** It's flat fills + gradients + drop shadows.

### Borders
Hairline `1px solid var(--line)` (`#ebebeb`) for separators between cart items, beneath the category strip, and around info cards. Form inputs use a slightly darker `#d6d6d6` and grow to a `3px` translucent orange ring on focus (`box-shadow: 0 0 0 3px rgba(238, 77, 45, 0.12)`). No double borders, no neumorphism.

### Buttons
Four documented variants:
- **`button--primary`** — orange fill, white text, 2.85rem min-height. Hovers to `--accent-dark` and lifts `translateY(-1px)`.
- **`button--light`** — white fill, orange text. For CTAs on orange backgrounds (hero).
- **`button--ghost-light`** — translucent white over an orange background.
- **`button--ghost`** — white fill, grey border, grey text. Secondary, lower-stakes.
Plus `button--full` for stretched-width forms.

### Hover / press / focus
- **Hover.** Buttons lift `-1px` with a `160ms ease` transition. Primary buttons darken to `--accent-dark`. Subtle, never flashy.
- **Press.** No explicit press state defined — the platform default is fine.
- **Focus.** Form inputs get a 3px translucent orange glow (`rgba(238, 77, 45, 0.12)`) plus the border itself shifts to a stronger orange. Icon buttons (eye toggle) get a 2px ring + rounded outline.
- **Disabled.** `opacity: 0.45–0.68`, `cursor: not-allowed`, no transform.

### Animation
- **Transitions only**, no keyframes. `160ms ease` on background/transform/border-color.
- **No bounces, springs, or parallax.** The codebase has zero `@keyframes` rules.
- **No loading skeletons** — there's a single `loading.tsx` page-level fallback.

### Transparency & blur
- The promo tickets on the login stage use `backdrop-filter: blur(6px)` over a translucent white gradient — the only blur in the system.
- Translucent whites (`rgba(255,255,255,0.08…0.24)`) appear on the orange header for the cart pill, the auth promo pill, and the ghost button.

### Layout rules
- One sticky element: the site header (`position: sticky; top: 0; z-index: 30`).
- One floating element: the checkout summary card (`position: sticky; top: 1rem` on its column).
- Everything else is normal document flow.

### Image color vibe
Product photos are currently generic placeholders. **If real photos replace them**, the warm-orange chrome will favor: warm-cast lifestyle photography on neutral backgrounds (cream, light grey, soft beige), avoiding cool blues or moody darks that would clash with the persimmon accent.

---

## 4. Iconography

### Current state
**The codebase has essentially no icon system.** What's there:
- **Two inline SVGs.** A single eye / eye-off icon pair (`PasswordVisibilityButton.tsx`) drawn manually with stroke paths. That's it.
- **Letterforms as logos.** Facebook social button uses `f` in Georgia serif on a blue circle. Google uses `G` colored Google-red. These aren't real brand marks.
- **No icon font, no Lucide/Heroicons, no Font Awesome, no `@radix-ui/react-icons`.**
- **No emoji** in any UI string.
- **No unicode glyphs used as decorative icons.**

The header makes do without icons — the search button is a text label that says `Search`, the cart link is a text pill that reads `Cart (3)`, account/login is a text pill.

### Recommendation for this system
Adopt **Lucide** ([lucide.dev](https://lucide.dev)) as the icon kit going forward — open-source, MIT-licensed, available via CDN, stroke-based, matches the codebase's clean sans-serif feel and `2.5px` stroke aesthetic from the existing eye icon.

```html
<script src="https://unpkg.com/lucide@latest"></script>
<i data-lucide="search"></i>
<i data-lucide="shopping-bag"></i>
<i data-lucide="user"></i>
<i data-lucide="bell"></i>
```

**Default rendering rules** to keep them consistent with the codebase voice:
- Stroke width `2px` (Lucide default)
- Size `1.1rem` (≈17.6px) for inline-with-text, `1.4rem` for icon-only buttons
- Color inherits from the parent (`currentColor`) — defaults to white on the orange header, `var(--muted)` in body, `var(--accent)` for active/pressed states.
- **Never combine icons with emoji.** Pick one.

The login social buttons should be migrated to real Facebook/Google brand marks (their official SVGs) — the current Georgia `f` and red `G` work for a wireframe but aren't shippable.

### Logos
Three logo files live in `assets/`:
- `logo-wordmark.svg` (320×64) — for white/light backgrounds. Mark in brand orange + "Modern" in `#222` + "Market" in `#ee4d2d`.
- `logo-wordmark-white.svg` (320×64) — for orange/dark backgrounds. Mark in white, wordmark in white/gold.
- `logo-mark.svg` (64×64) — square brand mark only. Use for favicon, app icon, social avatars.

The mark is a simplified bag silhouette that echoes the codebase's existing `.login-brand__mark` element (an orange rounded rectangle with a chunky white emoji-style cart inside).

---

## 5. Components inventory

Documented in detail inside `ui_kits/web/` (open `ui_kits/web/index.html` for the click-thru). At a glance:

| Component | Source file |
|---|---|
| Site header (promo bar + main bar + search) | `app/components/SiteHeader.tsx` |
| Category strip | `app/page.tsx` |
| Market hero (banner + 2 side cards) | `app/page.tsx` |
| Feature band (4-up value props) | `features/products/components/FeatureBand.tsx` |
| Product card | `features/products/components/ProductCard.tsx` |
| Product detail (gallery + content) | `app/products/[slug]/page.tsx` |
| Cart item / summary card | `features/checkout/components/CheckoutPageContent.tsx` |
| Auth shell + promo stage | `features/auth/components/{AuthPageShell,AuthPromo}.tsx` |
| Login form / Register form | `features/auth/components/{LoginForm,RegisterForm}.tsx` |
| Password visibility toggle | `features/auth/components/PasswordVisibilityButton.tsx` |
| Cart pill (header) | inline in `SiteHeader.tsx` |
| Tag, Eyebrow, Empty state | inline in various pages |

---

## 6. How to use this system

**For prototyping a new feature for Modern Market:**
1. Load `colors_and_type.css` to get all tokens.
2. Copy components from `ui_kits/web/components.jsx`.
3. Reach for the existing class names (`button--primary`, `product-card`, `section`) before inventing new ones — the codebase already names them.

**For a brand-new screen** (e.g. an order-history page that doesn't exist yet):
1. Borrow the **page shell** (`.page-shell--marketplace` — 1200px centered, 1.5rem top, 3rem bottom).
2. Use a **section header** (`.section__heading` with `.eyebrow` + `h2`).
3. Stack **cards** with `0 2px 10px rgba(0,0,0,0.08)` shadow and `4px` radius.
4. Lean on the existing **summary card** pattern (sticky right column at 320px min) for any totals/sidebar.

---

*Authored from the codebase. If anything here drifts from the live app, the codebase wins — re-derive.*
