# Redis Client Enforcement — 17 June 2026

## Objective
Configure `lib/cache/redis.ts` with Upstash and strictly enforce environment variables. This completes the first step of Phase 5, making Phase 4's rate limiting real by preventing silent fallbacks to mock configurations.

## Files Changed
- `lib/cache/redis.ts` — Updated to strictly require `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` environment variables, removing the mock URL strings. If not provided, it now throws an explicit error.
- `docs/PROGRESS.md` — Checked off the "Redis client" step under Phase 5.

## Decisions
Removed the mock URLs in `redis.ts` to enforce correct Upstash Redis connection parameters. This is necessary before proceeding to Phase 6 hardening because real rate-limiting must be verifiable.

## Dependencies Added
- None (Upstash packages were already installed).

## Known Limitations
- The development environment must now supply correct `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in `.env.local` to start successfully.
