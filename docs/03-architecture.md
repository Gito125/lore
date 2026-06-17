# System Architecture
## Lore — Wikipedia as a Social Experience

## 1. System Overview

### 1.1 Architecture Diagram
```
┌──────────────────────────────────────────────────────────┐
│                    CLIENT (Browser / PWA)                 │
│  Next.js 16 App Router · React · TailwindCSS             │
│  WebWorker: Algorithm scoring (off main thread)          │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼─────────────────────────────────┐
│                   NEXT.JS API ROUTES                      │
│  /api/articles     /api/recommendations                   │
│  /api/engage       /api/share/generate                    │
│  /api/user         /api/search                            │
└──────┬──────────────────────┬────────────────────────────┘
       │                      │
┌──────▼──────┐    ┌──────────▼──────────┐
│  UPSTASH    │    │  LOCAL POSTGRESQL   │
│  REDIS      │    │  (via Prisma ORM)   │
│  Article    │    │  Users              │
│  Cache      │    │  Bookmarks          │
│  Session    │    │  History            │
│  Rate Limit │    │  Interest Graph     │
└──────┬──────┘    └──────────┬──────────┘
       │                      │
┌──────▼──────────────────────▼──────────┐
│           WIKIPEDIA REST API            │
│   Summaries · Thumbnails · Categories  │
│   Search · Related · Random            │
└────────────────────────────────────────┘
```

### 1.2 Technology Stack
| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | Next.js 16 (App Router) | SSR/SSG, best DX, ecosystem |
| Language | TypeScript | Type safety across full stack |
| Styling | TailwindCSS + CSS Variables | Rapid + themeable |
| Auth | Auth.js v5 (NextAuth) | Email + OAuth, sessions in Prisma adapter |
| Database | Local PostgreSQL | Relational (Supabase planned for production migration later) |
| ORM | Prisma | All DB access goes through Prisma client |
| Cache | Upstash Redis | Serverless Redis, API caching |
| Hosting | Vercel | Zero-config Next.js deployment |
| OG Images | @vercel/og | Edge-rendered share cards |

### 1.3 Technical Constraints
1. **No Wikipedia dump required at launch** — Live API only.
2. **No ads, ever** — Freemium model.
3. **Sub-2s load time** — Preloaded article cards.
4. **Mobile-first** — 70% consumption mobile.
5. **Offline PWA** — Cached reading.

## 2. Algorithm Specification

### 2.1 Multi-Signal Engine Philosophy
Xikipedia relied heavily on randomness. Lore uses:
```
SCORE(article) = 
  (0.30 × CategoryInterestScore)      // User's topic affinity
  + (0.25 × ReadingVelocitySignal)    // Pace/depth today
  + (0.20 × SemanticSimilarityScore)  // Relation to recent
  + (0.15 × ArticleQualityScore)      // Wiki quality rating
  + (0.10 × SerendipityInjection)     // Anti-bubble random
```

### 2.2 Algorithm Implementations
- **Category Interest:** `Math.max(...weights)` of article's categories against user's interest graph.
- **Reading Velocity:** Adjusts length preference based on current session's avg time per article.
- **Semantic Similarity:** TF-IDF vector similarity between article and recent reads.
- **Quality Score:** Evaluates thumbnail, wordCount (>2000), references, and Featured/Good status.
- **Serendipity:** Injects topics outside the user's top 5 interests.
- **Decay:** Interest graph decays 5% daily (nightly cron).

## 3. Data Models (Prisma Schema)

### 3.1 Users
`User` model with email, username, theme, and relations to history/bookmarks/interests.

### 3.2 Interest Graph
`InterestGraph` model with userId, topic, weight (0.0-1.0), and isFollowed (boolean).

### 3.3 Reading History
`ReadingHistory` model logging userId, articleId, articleTitle, readDepth, timeSpent, etc.

### 3.4 Bookmarks
`Bookmark` model linking userId and articleId.

### 3.5 Engagement Events
`EngagementEvent` model tracking explicit actions (open, skip, bookmark, share).

## 4. API Contracts
- `GET /api/articles`: Returns batch of scored articles.
- `POST /api/engage`: Records engagement events.
- `GET /api/recommendations`: Related articles for sidebar.
- `POST /api/share/generate`: Generates social share URLs/cards.
- `GET /api/user/stats`: User's knowledge statistics.

## 5. Environment Variables
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/lore"
AUTH_SECRET="your-secret-key"
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
WIKIPEDIA_API_BASE=https://en.wikipedia.org/api/rest_v1
NEXT_PUBLIC_APP_URL=https://lore.app
NEXT_PUBLIC_APP_NAME=Lore
```
