---
description: Review recent code changes for quality, correctness, and Next.js best practices
---

# Code Review

Review the most recent code changes in this repository for quality, correctness, and adherence to project conventions.

## Steps

1. Run `git diff HEAD~1 HEAD` to see the last commit's changes (or `git diff --staged` if changes are staged but not yet committed)
2. Run `yarn lint` to surface any ESLint issues
3. Run `yarn test` to check for failing tests

## Evaluation Criteria

For each changed file assess:

- **Correctness**: does the logic do what it claims? Are edge cases handled?
- **Server/Client boundary**: are `"use client"` boundaries correct? No unnecessary client components?
- **TypeScript**: are types explicit and accurate? No `any` without justification?
- **Security**: is all external input validated? No XSS, injection, or data-leak risks?
- **Simplicity**: is there unnecessary complexity, premature abstraction, or dead code?
- **Conventions**: does the code follow existing naming and file structure patterns?

## Output Format

```
## Summary
[What changed and why]

## Issues
- [CRITICAL] description — file:line
- [WARNING] description — file:line
- [SUGGESTION] description — file:line

## Lint & Tests
[Pass / Fail — include errors if any]

## Verdict
[Approve | Needs Changes]
```

If there are no issues, say so clearly.
