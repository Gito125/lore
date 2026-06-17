# Mini SRS (Software Requirements Specification)
## Lore — Wikipedia as a Social Experience

## 1. Feature Set Priority Matrix (MoSCoW)

### MUST HAVE — v1.0 (MVP)
| # | Feature | Description |
|---|---------|-------------|
| M1 | Intelligent Feed | Multi-signal algorithm surfacing Wikipedia articles |
| M2 | Article Cards | Rich preview: title, summary, thumbnail, category tags |
| M3 | Full Article View | Clean Wikipedia content reader, distraction-free |
| M4 | User Accounts | Email auth, persistent profile |
| M5 | Reading History | Track what you've read, build your knowledge graph |
| M6 | Topic Following | Follow topics/categories (e.g., Physics, African History) |
| M7 | Bookmarks | Save articles for later |
| M8 | Dark Editorial UI | Premium dark theme, newspaper-grade typography |
| M9 | PWA | Installable, works offline for cached articles |

### SHOULD HAVE — v1.1
| # | Feature | Description |
|---|---------|-------------|
| S1 | Sidebar Recommendations | Right-panel: "You might also like" based on current read |
| S2 | Social Sharing | Share to X, WhatsApp, Instagram with auto-generated cards |
| S3 | Knowledge Stats | Weekly digest: topics read, categories explored, streak |
| S4 | Themes | Multiple curated editorial themes (dark, sepia, ink, neon) |
| S5 | Semantic Search | Search Wikipedia with intent, not just keywords |
| S6 | Serendipity Mode | Anti-filter-bubble: forces you outside your comfort topics |

### COULD HAVE — v2.0
| # | Feature | Description |
|---|---------|-------------|
| C1 | Knowledge Graph Visualization | Interactive web of your reading history |
| C2 | Collections | Curated topic bundles (e.g., "Cold War in 30 articles") |
| C3 | Reading Challenges | Weekly knowledge quests and streaks |
| C4 | Social Following | Follow users, see what they're reading |
| C5 | AI Summaries | Claude-powered 3-sentence summaries of long articles |
| C6 | Multiple Languages | Expand beyond English Wikipedia |

### WON'T HAVE — v1.0
- Comments or replies (adds moderation burden, reduces focus)
- User-generated content (Wikipedia is the source of truth)
- Ads (never — this is a premium product)
- Gamification that degrades quality (badges ≠ knowledge)

## 2. Functional Requirements

### 2.1 Feed System
- **FR-01 Personalized Article Feed:** Infinite-scrolling feed of Wikipedia Article Cards, ranked by the multi-signal algorithm. New articles fetched in batches of 10 when 80% scroll depth is reached. First-time users receive a seed feed.
- **FR-02 Article Card Component:** Each card displays thumbnail, title (truncated), excerpt, tags, read time, bookmark and share buttons.
- **FR-03 Feed Interaction States:** Skip (negative), Open (positive), Bookmark (strong positive), Share (strongest positive), Full read (strong positive).

### 2.2 Article Reader
- **FR-04 Full Article View:** Renders full Wikipedia article content inside the app, fetching from `/page/mobile-sections/{title}`. External links open related articles inside Lore.
- **FR-05 Sidebar Recommendations:** Desktop displays 5 semantically related articles.
- **FR-06 Reading Progress:** Progress bar indicates scroll position. >70% marks as "read".

### 2.3 User Authentication
- **FR-07 Account Creation:** Email + password signup, OAuth supported (Google, GitHub v1.1).
- **FR-08 Session Management:** Sessions persist across closes. Unauthenticated users get "demo mode" (no personalization).

### 2.4 Interest Graph & Personalization
- **FR-09 Topic Onboarding:** New users select ≥3 topic categories to seed weights.
- **FR-10 Interest Graph:** `{topic: weight}` ranging 0.0-1.0. Increases with positive engagement, decays 5% per inactive day.
- **FR-11 Topic Following:** Following a topic sets a weight floor of 0.6.

### 2.5 Reading History & Knowledge Stats
- **FR-12 Reading History:** Logs article_id, title, timestamp, read_depth, time_spent. Reverse-chronological view.
- **FR-13 Knowledge Statistics:** Computes total read, streak, top topics, avg read depth, total reading time, knowledge breadth score.

### 2.6 Bookmarks
- **FR-14 Bookmark Management:** Save/delete bookmarks indefinitely. Available offline (PWA).

### 2.7 Search
- **FR-19 Article Search:** Wikipedia search via `action=query&list=search`. History persisted.

## 3. Non-Functional Requirements
- **Performance:** FCP < 1.2s, LCP < 2.5s, TTI < 3.0s. Lighthouse ≥ 90.
- **Scalability:** Handles 10,000 concurrent users. WebWorker for scoring. Redis caching.
- **Reliability:** 99.5% uptime target. Fallback to localStorage/Redis if Wikipedia is down.
- **Security:** Local PostgreSQL (Supabase planned), Rate limiting (100 req/min), no third-party analytics.
- **Accessibility:** WCAG 2.1 AA.
- **Offline / PWA:** App shell cached via Service Worker. Last 20 articles and bookmarks offline.
