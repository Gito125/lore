# Algorithm Phase 5 Improvements — 18 June 2026

## Objective
Implemented the algorithm review recommendations from `docs/reports/algorithm-phase-5.md` to significantly improve the intelligence, personalization, and efficiency of Lore's recommendation engine without requiring complex infrastructure like Redis or embeddings.

## Files Changed
- `lib/algorithm/interest-graph.ts` — Added topic normalization (`normalizeTopic`), replaced linear weights with dwell-time and completion factor scaling, and batched all updates using `prisma.$transaction`.
- `lib/algorithm/scorer.ts` — Made scoring weights adaptive based on the user's reading history length (Power user vs New user). Added a `novelty` signal (`1 - semanticSimilarity`). Added diversity penalty constraint when re-ranking the top 20 articles to prevent topic monopolization. Enhanced velocity assumption by incorporating personalized user reading speed.
- `lib/algorithm/semantic.ts` — Replaced pure TF similarity with a hybrid semantic layer. Integrated `natural` for Porter stemming, generated bigram tokens alongside unigrams, and blended TF-Similarity with Keyword Overlap to capture true semantic meaning rather than just token collisions.
- `lib/algorithm/serendipity.ts` — Added `lastHit` to `TopicWeight` interface.
- `lib/feed/generator.ts` — Passed `lastHit` into scoring context to enable recency boosts.
- `lib/wikipedia/api.ts` — Augmented the `WikipediaArticle` interface with Wikipedia quality signals (`featured`, `goodArticle`, `citations`, `references`, `sectionCount`) so the scorer can utilize them if available.
- `app/api/engage/route.ts` — Passed `metadata` from engagement requests to the interest graph so time and completion metrics impact topic weights.

## Decisions
- Used `natural` for stemming and bigram generation. It integrates easily and operates efficiently in Node.js without the overhead of heavy NLP models or embeddings.
- Incorporated `NOVELTY` directly into the article score breakdown and dynamic weighting scheme, rewarding users for exploring outside their recently read topics.
- Replaced multiple sequential Prisma calls in the interest graph with a single `$transaction`, eliminating the N+1 query problem during bulk topic updates.

## Dependencies Added
- `natural@^8.1.1` — Needed for text token stemming (Porter) to improve local semantic similarity matching.
