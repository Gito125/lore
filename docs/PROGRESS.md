# PROGRESS.md — Lore
> Wikipedia as a Social Experience · Build Log & Agent Compass

---

## ◉ Current Status

| Field | Value |
|-------|-------|
| **Phase** | Phase 6 — Hardening & Test Coverage |
| **Status** | 🚧 In Progress |
| **Stack Locked** | Next.js 16 · Local PostgreSQL · Prisma · Auth.js v5 · UUID v7 · Upstash Redis |
| **Design Locked** | Dark Editorial · EB Garamond + Inter + JetBrains Mono · Dark Navy & Gold |
| **Motion Locked** | Sovereign Archive · Framer Motion (UI fabric) + GSAP (signature moments) |
| **Last Updated** | June 18, 2026 |

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

- [x] Bookmarks system — save, list, delete (`app/api/bookmarks` · `app/(main)/bookmarks`)
- [x] Reading history — log, view, search, clear (`app/(main)/profile`)
- [x] Knowledge stats aggregation (`app/api/user/stats/route.ts`)
- [x] Weekly digest generation logic
- [x] Topic following — explicit follow/unfollow with weight floor
- [x] X/Twitter thread auto-generator
- [x] WhatsApp OG share card (`@vercel/og` · 1200×630)
- [x] Instagram Story card generator (1080×1920 PNG download)
- [x] Web Share API + clipboard fallback (`components/sharing/ShareModal.tsx`)
- [x] Dynamic OG image route (`app/api/share/generate/route.ts`)

---

## Phase 4 — Polish
**Goal:** Motion audit, performance, PWA, and public beta.

- [x] Full theme system QA (all 5 themes across every component)
- [x] Framer Motion audit — every transition intentional per Sovereign Archive rules
- [x] GSAP onboarding sequence (cinematic hero reveal)
- [x] GSAP Knowledge Graph visualization
- [x] PWA manifest + Service Worker (`public/manifest.json`)
- [x] Offline support — last 20 articles + bookmarks cached
- [x] Core Web Vitals pass (LCP < 2.5s · FCP < 1.2s · all green)
- [x] Lighthouse score ≥ 90 all categories
- [x] Rate limiting on all API routes (100 req/min per IP)
- [x] Row Level Security audit (post-migration)
- [x] Replace mock local Credentials auth with real Google OAuth
- [x] Revert Auth.js session strategy back to `database` (from `jwt`)
- [x] Beta launch

## Phase 5 — Core Loop Completion
**Goal:** Transform the app from scaffolded demo into a working product a real user can sign up, read, and explore without hitting a dead end.

> **Completion gate:** A new user can sign up → see a real Wikipedia feed with images → click an article → read the full content → search for a topic → get real results. All without a single 404 or mock response.

### Dependency Order (do not resequence)

- [x] **Article Detail Page** — Implement `/article/[id]` using the existing Wikipedia parser (`lib/wikipedia/parser.ts`). Render title, lead section, sections, infobox, and internal links. This is the single biggest UX blocker — every ArticleCard click currently 404s.
- [x] **Feed Data Wiring** — Refactor `app/(main)/feed/page.tsx` to fetch from `/api/recommendations`. Replace the 3-item static mock entirely. Feed must paginate (infinite scroll with load-more).
- [x] **Article Images** — Pull `thumbnail` and `originalimage` from the Wikipedia REST API response. Render in both `ArticleCard` (feed) and the Article Detail Page header. Handle missing images gracefully with a fallback.
- [x] **Search Functionality** — Wire `app/(main)/search/page.tsx` to the Wikipedia search API (`/api/search/page` endpoint). Debounce input (300ms), display results with title + excerpt + thumbnail.
- [x] **Settings Management** — Connect the Settings UI to user preferences in the DB. At minimum: theme selection, notification preferences, topic weights. Persist via `/api/user/settings`.
- [x] **Re-QA: Knowledge Graph** — Validate the GSAP Knowledge Graph visualisation with real engagement data flowing from the live feed. Mark complete only after real sessions confirm accurate node/edge generation.
- [x] **Re-QA: Weekly Digest** — Validate digest generation logic against a real reading history (not seeded mock data). Confirm the digest email/view reflects actual user behaviour.

---

## Phase 6 — Hardening & Test Coverage
**Goal:** Make the app reliable under real-world conditions — API failures, slow networks, edge cases — and cover all critical paths with automated tests.

> **Completion gate:** Every route has an error state. Every async fetch has a loading state. CI passes before any merge. Playwright covers the full user journey end-to-end.

- [x] **Error boundaries** — Add React error boundaries to `Feed`, `ArticleDetail`, `Search`, and `Profile`. Wikipedia API going down must show a graceful fallback, not a crash.
- [x] **Loading & skeleton states** — All async data fetches (feed, article, search, stats) must have skeleton screens. No layout shift on load. Audit against existing `FeedSkeleton` pattern.
- [x] **Wikipedia API resilience** — Implement exponential backoff + retry (max 3 attempts) on the Wikipedia wrapper (`lib/wikipedia/api.ts`). Handle 429, 503, and network timeouts explicitly.
- [ ] **Playwright E2E — Auth flows** — Sign up, log in, log out. Google OAuth flow with mock provider in test env.
- [ ] **Playwright E2E — Feed flow** — Load feed, scroll to trigger pagination, verify real articles render with images.
- [ ] **Playwright E2E — Article flow** — Click ArticleCard → Article Detail renders → back navigation works.
- [ ] **Playwright E2E — Search flow** — Type query → debounce fires → real results appear → click result → Article Detail renders.
- [ ] **Playwright E2E — Bookmark flow** — Bookmark an article → appears in `/bookmarks` → delete → gone.
- [ ] **PWA offline validation** — Disconnect network in browser devtools. Confirm last 20 articles + bookmarks load from service worker cache. Confirm no uncaught errors.
- [ ] **Accessibility audit** — Run axe-core on Feed, Article, Search, Auth pages. Fix all critical and serious violations. Target WCAG 2.1 AA.
- [ ] **Proper Error Feedback** — All API errors surfaced to the user with clear messaging. For example, if Wikipedia API fails, show: "We're having trouble loading articles right now. Please try again later." These should be user-friendly, not raw error dumps. 

---
## Phase 7 — UI/UX Polish, Performance, motions and transitions.
**Goal:** Refine the user experience with intentional motion, optimize performance for real-world conditions, and ensure the design system shines in every interaction.
- [ ] **Amazing GSAP onboarding sequence** — Create a cinematic hero reveal on first visit. Animate the logo, headline, and feed cards with a signature sequence that sets the tone for the app.
- [ ] **Framer Motion audit and addition where needed** — Review every animation and transition in the app. Ensure it follows the Sovereign Archive principles: purposeful, enhances clarity, and delights without distracting. Refine spring configs and easing curves for maximum polish.
- [ ] **Performance optimization** — Analyze bundle size with Webpack Bundle Analyzer. Implement code-splitting and dynamic imports for heavy components (e.g., Knowledge Graph). Optimize image loading with Next.js `Image` component and proper sizing.
- [ ] **Design system consistency** — Audit all components against the design tokens. Ensure color, typography, and spacing are consistent across the app. Refine any components that feel off-brand or inconsistent with the Dark Editorial aesthetic.
- [ ] **Dark mode polish** — Ensure all components look great in dark mode. Pay special attention to contrast ratios, shadow usage, and how images render against the dark background. Adjust design tokens as needed for optimal dark mode experience.
- [ ] **Micro-interactions** — Add subtle micro-interactions to key UI elements: button presses, card hovers, bookmark toggles. These should be delightful but not overdone, enhancing the tactile feel of the app.
- [ ] **Page transitions** — Implement smooth page transitions with Framer Motion. For example, when navigating from the feed to an article, have the article card expand into the detail view. When going back, reverse the animation.


## Phase 8 — Production Infrastructure & Public Launch
**Goal:** Move from localhost to a live, monitored, production-grade deployment that can handle real users.

> **Completion gate:** App is live on a real domain, CI/CD is automated, errors are tracked, database is hosted, and the beta gate is removed.

### Infrastructure

- [ ] **Hosted PostgreSQL** — Migrate from local Postgres to Neon (recommended: native Prisma integration, serverless-friendly, free tier). Run `prisma migrate deploy` against production DB. Add `DATABASE_URL` to production env.
- [ ] **Environment config** — Define `.env.local`, `.env.staging`, `.env.production`. Document all required vars in `docs/ENV.md`. Never commit secrets.
- [ ] **Vercel deployment** — Connect GitHub repo to Vercel. Configure build settings for Next.js 16 App Router. Set all production env vars in Vercel dashboard.
- [ ] **Custom domain + SSL** — Point domain to Vercel. Confirm SSL certificate provisioned. Set up `www` redirect.
- [ ] **CI/CD pipeline** — GitHub Actions workflow: lint → typecheck → unit tests → Playwright E2E → deploy to Vercel on merge to `main`. Block merge if any step fails.

### Observability

- [ ] **Error monitoring** — Integrate Sentry (`@sentry/nextjs`). Capture server-side and client-side errors. Set up Slack/email alerts for P0 errors.
- [ ] **Analytics** — Integrate PostHog (recommended: self-hostable, GDPR-friendly, event-based). Track: article opens, search queries, bookmarks, session length, topic follows.
- [ ] **Uptime monitoring** — Configure Vercel status checks or Better Uptime on `/api/health` endpoint (create this route: returns 200 + DB ping).

### Launch

- [ ] **Rate limit audit** — Confirm Redis-backed rate limiting is active on all API routes in production. Test with k6 or Artillery.
- [ ] **Row Level Security — production DB** — Re-run RLS audit against Neon (not local Postgres). Confirm policies apply at DB layer, not just app layer.
- [ ] **Remove beta gate** — Delete any `BETA_MODE` flags, invite-only guards, or WIP banners. Confirm public signup is open.
- [ ] **Soft public launch** — Share with first real users (not just testers). Monitor Sentry + PostHog for the first 48 hours. Keep a rollback plan ready.

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

None at the moment.