# Folder Structure & Timeline
## Lore — Wikipedia as a Social Experience

## 1. Folder Structure (Next.js 16 App Router)

```
lore/
├── app/
│   ├── (auth)/                 # Authentication routes (login, signup)
│   ├── (main)/                 # Main application routes with sidebar shell
│   │   ├── feed/page.tsx
│   │   ├── article/[id]/page.tsx
│   │   ├── bookmarks/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── topics/page.tsx
│   │   └── search/page.tsx
│   ├── api/                    # Next.js API Routes
│   │   ├── articles/route.ts
│   │   ├── recommendations/route.ts
│   │   ├── engage/route.ts
│   │   ├── share/generate/route.ts
│   │   ├── search/route.ts
│   │   └── user/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── feed/                   # Feed related components (ArticleCard, FeedColumn)
│   ├── article/                # Reader components (ArticleReader, ReadingProgress)
│   ├── sharing/                # Social components (ShareModal)
│   ├── profile/                # User components (KnowledgeStats, TopicMap)
│   └── ui/                     # Shared UI components (ThemeSwitcher, Button)
├── lib/
│   ├── algorithm/              # Scoring engine and relevance logic
│   ├── wikipedia/              # Wikipedia API client and parser
│   ├── sharing/                # OG image generation
│   ├── db/                     # Prisma client
│   └── cache/                  # Redis client
├── workers/                    # WebWorkers (algorithm.worker.ts)
├── hooks/                      # Custom React hooks
├── types/                      # TypeScript definitions
├── public/                     # Static assets
└── tailwind.config.ts          # Styling configuration
```

## 2. Project Timeline

### Phase 1 — Foundation (Weeks 1–3)
- Next.js project scaffold + design system
- Wikipedia API integration + caching layer
- Database setup: Local PostgreSQL with Prisma ORM
- Feed UI + Article Card component
- Basic user auth: Auth.js v5 (NextAuth)

### Phase 2 — Algorithm (Weeks 4–6)
- Multi-signal scoring engine
- Interest graph with decay
- Reading behavior tracking (scroll depth, time-on-article)
- Serendipity injection layer

### Phase 3 — Social & Profile (Weeks 7–9)
- Bookmarks + history
- Knowledge stats + weekly digest
- Social sharing (X, WhatsApp, Instagram Story cards)
- OG image generation

### Phase 4 — Polish & Launch (Weeks 10–12)
- Full theme system
- PWA + offline support
- Performance tuning (Core Web Vitals)
- Beta launch
