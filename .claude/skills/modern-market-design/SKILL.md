---
name: modern-market-design
description: Use this skill to generate well-branded interfaces and assets for Modern Market, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code (the live `ecommerce-web` Next.js app), you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation

Modern Market is a marketplace-style storefront in the family of large Southeast-Asian platforms (Shopee, Lazada, Tiki) — saturated orange `#ee4d2d` accent, dense product grids, sticky search-first header, stacked promotional surfaces.

**Always start by loading `colors_and_type.css`** in any HTML artifact — it provides every token used by every component. Reach for the existing class names (`button--primary`, `product-card`, `section`, `eyebrow`) before inventing new ones; if you cross-reference `ui_kits/web/kit.css`, you'll find most patterns are already named.

**Tone is transactional and incentive-led.** Imperative CTAs ("Shop now", "Place order"). Sentence case for everything *except* eyebrows (UPPERCASE tracked .12em) and auth submits (UPPERCASE). No emoji. No editorial flourishes.

**Visuals are flat fills + gradients + drop shadows.** No textures, no hand-drawn illustrations, no glassmorphism (except the auth promo tickets). Cards are bright white, 4px radius, single soft shadow.

**Icons:** Lucide via CDN, stroke 2px, inherits `currentColor`. If you need product imagery, use placeholders from `picsum.photos/seed/<slug>/1200/1200` to match the codebase's existing pattern.

Source of truth: https://github.com/QuocNam1998/ecommerce-web (frontend) and https://github.com/QuocNam1998/commerce-service (backend).
