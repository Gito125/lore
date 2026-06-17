# Phase 3 Social & Profile — 17 June 2026

## Objective
Implemented Phase 3 features for Lore, encompassing the user knowledge layer (bookmarks, history, and stats) along with a robust social sharing infrastructure using `next/og` and native Web Share API.

## Files Changed/Created
- `prisma/schema.prisma` — Added `explicitlyFollowed` boolean to `InterestGraph`.
- `app/api/bookmarks/route.ts` & `[articleId]/route.ts` — API endpoints for bookmark management.
- `components/feed/BookmarkButton.tsx` — Interactive client component with Framer Motion animations.
- `app/(main)/bookmarks/page.tsx` — Bookmarks list page.
- `app/api/history/route.ts` & `app/api/user/stats/route.ts` — User knowledge aggregation endpoints.
- `app/(main)/profile/page.tsx` — Profile dashboard showing history and stats.
- `app/api/topics/follow/route.ts` & `app/api/topics/unfollow/route.ts` — Explicit following capabilities.
- `lib/algorithm/interest-graph.ts` — Updated decay logic to respect `FOLLOW_FLOOR` for explicitly followed topics.
- `components/sharing/ShareModal.tsx` & `ShareButton.tsx` — Share integration utilizing native Web Share API with fallbacks.
- `app/api/share/generate/route.tsx` & `app/api/share/story/route.tsx` — Dynamic image generation via `next/og` for WhatsApp/X and Instagram Stories.
- `lib/sharing/twitter.ts` — Twitter thread intent construction logic.
- `lib/digest.ts` & `app/api/user/digest/route.ts` — Weekly digest business logic and API.

## Decisions
- Used `ImageResponse` from `next/og` for the Instagram Story generator rather than HTML canvas. It ensures perfect rendering consistency and doesn't require extra heavy client-side libraries.
- Twitter Thread generator logic is modeled deterministically by splitting sentences on the backend for predictability before handing it off to the Twitter intent URL.

## Dependencies Added
- `date-fns@4.4.0` — for precise and fast date formatting (e.g. `formatDistanceToNow`).

## Known Limitations
- The shadow database permission issue in the local environment prevented `prisma migrate dev` from executing successfully via automation. A `prisma generate` step was taken instead. The user/system should run the migration using a privileged PostgreSQL role.
- Twitter generator relies on sentence splitting rather than LLM text generation to conform with the current lack of a configured text-generation endpoint.
