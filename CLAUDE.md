# CLAUDE.md

## Project: Modern Market

Next.js 16 ecommerce app using the App Router, React 19, TypeScript 5.8, and Yarn. Deployed on Vercel.

## Tech Stack

| Tool            | Version             |
| --------------- | ------------------- |
| Next.js         | 16.2.1 (App Router) |
| React           | 19.2.4              |
| TypeScript      | 5.8.2               |
| Package Manager | Yarn 1.22.22        |
| Deployment      | Vercel              |

## Project Structure

```
app/          # Next.js App Router routes
features/     # Domain-specific logic (products, cart, checkout…)
lib/          # Shared server utilities
shared/       # Shared client/server code
styles/       # Global styles
```

## Development Commands

```bash
yarn dev          # Start dev server (port 3000)
yarn build        # Production build
yarn lint         # ESLint
yarn test         # Run tests (features/**/*.test.ts)
yarn dev:clean    # Clean .next cache then dev
```

## Core Rules

- **Server Components by default** — `"use client"` only for browser APIs, event handlers, state, or hooks
- **Server Actions** for mutations coupled to UI; Route Handlers in `app/api/` only when HTTP endpoints are actually needed
- **Validate all external input** at system boundaries (never trust user input or external API responses)
- Don't refactor beyond what the task explicitly requires
- Follow existing file and naming conventions

## Claude Code Workflow

- Start complex tasks in **plan mode** — break into vertical slices, not horizontal phases
- Run `/compact` around 50% context usage
- Keep subtasks small enough to finish in under 50% context
- After each change: `yarn lint` to verify, `yarn test` for affected features
- See `.claude/rules/nextjs.md` for Next.js patterns (auto-loaded when touching `app/` or `features/`)
- See `.claude/rules/testing.md` for test conventions (auto-loaded when touching `*.test.ts`)

## Useful Slash Commands

- `/create-feature [name]` — scaffold a new feature module in `features/`
- `/review` — review recent code changes for quality and correctness

## Important Rules

- Following TDD (Test-Driven Development) and SOLID principles during implementation
