# Feed Randomization & Onboarding Improvements — 18 June 2026

## Objective
Revamped the feed algorithm to introduce serendipity and randomization, filtering out previously interacted articles. Enhanced the onboarding and settings UI to support custom topic searching and multiple selections. Introduced a private "Like" mechanism.

## Files Changed
- `app/api/recommendations/route.ts` — Updated to use the new randomized feed generator.
- `lib/feed/generator.ts` — Centralized feed generation logic with shuffling and interaction filtering.
- `app/(auth)/onboarding/page.tsx` — Added search and custom topic functionality with GSAP animations.
- `components/feed/FeedList.tsx` — Added "Refresh Feed" button and functionality.
- `components/feed/ArticleCard.tsx` — Added `LikeButton` and fixed `sizes` warning on `Image`.
- `prisma/schema.prisma` — Added `Like` model for tracking implicit interests.
- `app/(main)/settings/interests/page.tsx` & `actions.ts` & `InterestsClient.tsx` — Created a dedicated settings page for managing topics.

## Decisions
- Used `title` instead of numerical `pageid` for Wikipedia API routing to prevent `AbortError` and 404s.
- `Like` interactions are kept completely private and are strictly used to tune the recommendation engine without social pressure.
- Kept un-interacted feed impressions available for rediscovery (they are not permanently excluded).
