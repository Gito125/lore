# Phase 4 Polish & Launch — 17 June 2026

## Objective
Implemented Phase 4 to prepare Lore for beta launch. This includes performance improvements, offline PWA support, rate limiting, reverting authentication strategy, adding Google OAuth, and GSAP animations for key moments.

## Files Changed
- `lib/auth.ts` — Reverted session strategy to database, replaced Credentials provider with GoogleProvider.
- `app/(auth)/login/page.tsx` & `app/(auth)/signup/page.tsx` — Replaced email/password UI with single Google OAuth button.
- `proxy.ts` — Updated Next.js middleware `matcher` and added Upstash-backed rate limiting (100 req/min) for `/api/*` routes.
- `public/manifest.json` & `public/sw.js` — Added PWA manifest and service worker to dynamically cache files.
- `components/ServiceWorkerRegistration.tsx` & `app/layout.tsx` — Added client registration for the service worker and included manifest metadata.
- `app/(auth)/onboarding/page.tsx` — Implemented GSAP timeline for a cinematic hero reveal per Sovereign Archive guidelines.
- `app/(main)/profile/page.tsx` & `components/profile/KnowledgeGraph.tsx` — Replaced the text-based top interests with an interactive GSAP Knowledge Graph visualization.
- `lib/cache/redis.ts` & `lib/cache/rate-limit.ts` — Initialized Upstash Redis & Ratelimit instances.
- `docs/PROGRESS.md` — Marked Phase 4 as completed.

## Decisions
- Switched auth flow fully to Google OAuth as per Phase 4 reqs. Removed Credentials provider completely to simplify UX.
- Implemented primitive caching in SW for any GET requests. Used fallback to offline for navigate events.
- Used `gsap.context` within `useEffect` for the onboarding cinematic reveal and knowledge graph to prevent memory leaks in React.
- Used Upstash Redis for global rate-limiting across API routes. 

## Dependencies Added
- `@upstash/redis` — To interface with Upstash for remote caching/rate-limiting.
- `@upstash/ratelimit` — Sliding window rate limiter built on Redis.
