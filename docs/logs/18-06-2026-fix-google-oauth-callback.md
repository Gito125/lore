# Fix Google OAuth Callback — 18 June 2026

## Problem
Google sign-in failed on the OAuth callback with `CallbackRouteError` / `TypeError: fetch failed` (`ETIMEDOUT`), then redirected to `/api/auth/error?error=Configuration`.

## Root Cause
1. `proxy.ts` matched all routes including `/api/auth/*`, so Auth.js middleware ran during the OAuth callback and interfered with the token exchange.
2. `AUTH_URL` was not set for the non-default dev port (`3005`), leaving host/trust configuration implicit.
3. Google OAuth requests could be routed through a local HTTP proxy when `HTTP_PROXY`/`HTTPS_PROXY` are set, causing intermittent outbound timeouts.

## Changes
- `proxy.ts` — Exclude `api` from the matcher (Auth.js recommended pattern).
- `lib/auth.ts` — Set `trustHost: true`, route auth errors to `/login`, remove mock Google credential fallbacks.
- `.env` / `.env.local` — Add `AUTH_URL=http://localhost:3005`.
- `package.json` — Extend dev `NO_PROXY` for Google domains alongside existing IPv4-first DNS ordering.
- `app/(auth)/login/page.tsx` — Show a readable message when redirected back with an auth error.

## Verify
1. Restart the dev server (`pnpm dev`) so env changes load.
2. Confirm Google Cloud OAuth redirect URI includes `http://localhost:3005/api/auth/callback/google`.
3. Sign in with Google from `/login` and confirm redirect to `/feed`.
