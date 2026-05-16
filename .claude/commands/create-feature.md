---
description: Scaffold a new feature module in the features/ directory
argument-hint: [feature-name]
---

# Create Feature

Scaffold a new ecommerce feature module at `features/$ARGUMENTS/` following the project's domain-driven structure.

## Steps

1. Create `features/$ARGUMENTS/types.ts` — TypeScript interfaces and types for this feature
2. Create `features/$ARGUMENTS/actions.ts` — Next.js Server Actions with `"use server"` directive
3. Create `features/$ARGUMENTS/components/` directory with a placeholder `.gitkeep`
4. Create `features/$ARGUMENTS/index.ts` — public barrel export for the feature

## File Templates

### types.ts
- Define the primary data model interface (e.g. `Product`, `CartItem`)
- Define any form/input types used by actions

### actions.ts
- Start with `"use server"` directive
- One async function per mutation, named descriptively (e.g. `addToCart`, `updateQuantity`)
- Validate all inputs before use
- Return typed results, never `any`

### index.ts
- Re-export only the public API: types, actions, and components the rest of the app needs

## Rules

- Server Actions only in `actions.ts` — never inline `"use server"` in components
- Components in `features/$ARGUMENTS/components/` are Server Components by default
- Add `"use client"` to a component only when it needs hooks, state, or DOM APIs
- No direct cross-feature imports — use `index.ts` barrel exports

## Output

List the files created and give a one-sentence description of what belongs in each file.
