# PROGRESS.md — Lore
> Wikipedia as a Social Experience · Build Log & Agent Compass

---

## ◉ Current Status

| Field | Value |
|-------|-------|
| **Phase** | Phase 3 — Social & Profile |
| **Status** | 🔄 In Progress |
| **Stack Locked** | Next.js 16 · Local PostgreSQL · Prisma · Auth.js v5 · UUID v7 · Upstash Redis |
| **Design Locked** | Dark Editorial · EB Garamond + Inter + JetBrains Mono · Dark Navy & Gold |
| **Motion Locked** | Sovereign Archive · Framer Motion (UI fabric) + GSAP (signature moments) |
| **Last Updated** | June 2026 |

---

## Agent Instructions

> **Read this file first. Always. No exceptions.**

1. Check this file at the start of every task to understand current state.
2. Work only within the current phase unless explicitly told otherwise.
3. On task completion, check off the bullet and update **Last Updated** above.
4. When a full phase is complete, promote **Current Phase** to the next phase.
5. If a task reveals a blocker, add it under the relevant phase with a `⚠️` prefix.
6. Never mark a task complete if it's partially done. Partial = unchecked.

---

## Phase 1 — Foundation
**Goal:** Core infrastructure, design system, database, and authentication.

### Documentation & Config
- [x] PRD formalized (`docs/PRD.md`)
- [x] SRS formalized (`docs/SRS.md`)
- [x] Vision, architecture, design, folder structure docs (`docs/01` → `docs/05`)
- [x] Agent rules configured (`AGENTS.md`)
- [x] Dark Editorial UI/UX philosophy documented
- [x] Sovereign Archive motion philosophy documented
- [x] Stitch MCP connected (`.vscode/mcp.json` · `~/.gemini/antigravity-cli/mcp.json`)

### Project Scaffold
- [x] Next.js 16 App Router initialized (`/app` directory structure per SRS §8)
- [x] TailwindCSS configured with design token CSS variables
- [x] Font stack loaded: EB Garamond · Inter · JetBrains Mono
- [x] Theme system scaffolded (5 themes via CSS custom properties — Midnight default)
- [x] Framer Motion installed + spring config constants (`lib/motion/springs.ts`)
- [x] GSAP installed + easing config constants (`lib/motion/easings.ts`)

### Data Layer
- [x] Local PostgreSQL instance running
- [x] Prisma initialized (`prisma/schema.prisma`)
- [x] All models defined: User · Account · Session · InterestGraph · ReadingHistory · Bookmarks · EngagementEvents
- [x] UUID v7 utility created (`lib/id.ts` → `import { uuidv7 } from 'uuidv7'`)
- [x] Prisma migrations run (`prisma migrate dev`)
- [ ] Upstash Redis client configured (`lib/cache/redis.ts`)

### Core Features
- [x] Wikipedia REST API wrapper (`lib/wikipedia/api.ts`)
- [x] Wikipedia content parser (`lib/wikipedia/parser.ts`)
- [x] Feed UI shell (`app/(main)/feed/page.tsx`)
- [x] ArticleCard component (`components/feed/ArticleCard.tsx`) with Framer Motion enter
- [x] FeedSkeleton loading state (`components/feed/FeedSkeleton.tsx`)
- [x] Auth.js v5 configured with Prisma adapter
- [x] Login + Signup pages (`app/(auth)/login` · `app/(auth)/signup`)
- [x] Authenticated route middleware/proxy (`proxy.ts`)

---

## Phase 2 — Algorithm
**Goal:** Multi-signal scoring engine, interest graph, and behavioral tracking.

- [x] Scoring engine (`lib/algorithm/scorer.ts`) — all 5 signals per SRS §5
- [x] Interest graph with temporal decay (`lib/algorithm/interest-graph.ts`)
- [x] Serendipity injection layer (`lib/algorithm/serendipity.ts`)
- [x] TF-IDF semantic similarity (`lib/algorithm/semantic.ts`)
- [x] Engagement tracking API route (`app/api/engage/route.ts`)
- [x] Scroll depth + time-on-article tracking hooks (`hooks/useEngagement.ts`)
- [x] Algorithm WebWorker (`workers/algorithm.worker.ts`)
- [x] Topic onboarding flow (min. 3 topics on signup)
- [x] `/api/recommendations` route returning sidebar articles

---

## Phase 3 — Social & Profile
**Goal:** User knowledge layer and full social sharing infrastructure.

- [ ] Bookmarks system — save, list, delete (`app/api/bookmarks` · `app/(main)/bookmarks`)
- [ ] Reading history — log, view, search, clear (`app/(main)/profile`)
- [ ] Knowledge stats aggregation (`app/api/user/stats/route.ts`)
- [ ] Weekly digest generation logic
- [ ] Topic following — explicit follow/unfollow with weight floor
- [ ] X/Twitter thread auto-generator
- [ ] WhatsApp OG share card (`@vercel/og` · 1200×630)
- [ ] Instagram Story card generator (1080×1920 PNG download)
- [ ] Web Share API + clipboard fallback (`components/sharing/ShareModal.tsx`)
- [ ] Dynamic OG image route (`app/api/share/generate/route.ts`)

---

## Phase 4 — Polish & Launch
**Goal:** Motion audit, performance, PWA, and public beta.

- [ ] Full theme system QA (all 5 themes across every component)
- [ ] Framer Motion audit — every transition intentional per Sovereign Archive rules
- [ ] GSAP onboarding sequence (cinematic hero reveal)
- [ ] GSAP Knowledge Graph visualization
- [ ] PWA manifest + Service Worker (`public/manifest.json`)
- [ ] Offline support — last 20 articles + bookmarks cached
- [ ] Core Web Vitals pass (LCP < 2.5s · FCP < 1.2s · all green)
- [ ] Lighthouse score ≥ 90 all categories
- [ ] Rate limiting on all API routes (100 req/min per IP)
- [ ] Row Level Security audit (post-migration)
- [ ] Beta launch

---

## Decisions Log
> Append new decisions here. Never delete old ones.

| Date | Decision | Rationale |
|------|----------|-----------|
| Jun 2026 | Name → **Lore** | Short, culturally native, editorial weight |
| Jun 2026 | DB → Local PostgreSQL (migrate later) | Zero ops overhead during build |
| Jun 2026 | ORM → Prisma | Type-safe, schema-first, best Next.js p6iring |
| Jun 2026 | IDs → UUID v7 via `uuidv7` npm | Time-sorted, RFC standard, no Postgres extension needed |
| Jun 2026 | Auth → Auth.js v5 + Prisma adapter | Battle-tested, ships fast, sessions in own DB |
| Jun 2026 | Motion → Framer Motion + GSAP | FM for UI fabric, GSAP for signature cinematic moments |
| Jun 2026 | Design MCP → Google Stitch | Design tokens flow directly into VS Code via MCP |

---

## Blockers
> Active blockers only. Remove when resolved.

_None currently._