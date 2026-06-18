# Phase 5 Fixes — 18 June 2026

## Objective
Implemented all highest priority fixes and architectural improvements identified in `till-phase-5-report.md`.

## Files Changed
- `lib/services/article-service.ts` — Created to centralize Wikipedia API calls with Zod validation and Next.js caching.
- `lib/wikipedia/api.ts` — Removed in favor of `article-service.ts`.
- `app/api/search/route.ts` — Refactored to use `article-service.ts` and added Arcjet rate limiting.
- `app/api/recommendations/route.ts` — Refactored to use `article-service.ts` and added Arcjet rate limiting.
- `app/(main)/article/[id]/page.tsx` — Removed `id.length > 3` logic, added SEO `generateMetadata`, updated to use `article-service.ts`.
- `app/(main)/article/[id]/loading.tsx` — Added skeleton loading state.
- `app/(main)/article/[id]/error.tsx` — Added React error boundary.
- `app/(main)/feed/error.tsx` — Added React error boundary.
- `tests/unit/article-service.test.ts` — Added unit tests for new service.
- `components/feed/FeedList.tsx`, `hooks/useAlgorithmWorker.ts`, `workers/algorithm.worker.ts`, `lib/algorithm/scorer.ts`, `lib/feed/generator.ts` — Updated imports to use new service layer.
- `docs/PROGRESS.md` — Updated Phase 6 progress (error boundaries and loading states checked).

## Decisions
- Used `Arcjet` instead of `Upstash Redis` for rate limiting per the updated note in the report to skip Redis for now.
- Consolidated duplicate `fetch` code into a single `fetchWithRetry` utility inside `article-service.ts`.
- Validated all Wikipedia REST API responses using `zod`.

## Dependencies Added
- `@arcjet/next@latest` — For rate limiting without needing a Redis backend.

## Known Limitations
- E2E Playwright tests were run but additional specific path coverage might be needed in subsequent Phase 6 work.
