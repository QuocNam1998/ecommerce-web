---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
---

# Testing Rules

## Test Runner

Uses Node.js built-in test runner (no Jest). Run with:

```bash
yarn test
# node --test --experimental-strip-types "features/**/*.test.ts"
```

## Conventions

- Test files live next to their implementation: `features/[name]/[name].test.ts`
- Use Node's built-in APIs: `import { describe, it, before, after } from "node:test"` and `import assert from "node:assert"`
- Test the public API of a feature (via `index.ts`), not implementation internals
- Prefer real data shapes over mocks — integration over unit where practical

## What to Test

- Server Action success paths and expected error paths
- Data transformation and business logic in features
- Validation logic at system boundaries (form data, URL params, external API responses)

## What NOT to Test

- Next.js framework behavior (routing, rendering)
- Component rendering output (unless there is logic to verify)
- Trivial getters, setters, or pure pass-through functions

## Assertions

- Use `assert.strictEqual` for primitives, `assert.deepStrictEqual` for objects
- Write descriptive `it()` descriptions: "returns null when product is out of stock" not "works"
- One logical assertion per test — multiple asserts are fine if they verify one behavior
