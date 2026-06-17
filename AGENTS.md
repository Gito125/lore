# AGENTS.md — Lore
> Agent constitution for the Lore codebase. Read this file completely before touching a single file.

---

## ⚠️ Critical: Next.js Version Warning

<!-- BEGIN:nextjs-agent-rules -->
This project runs **Next.js 15 with the App Router**. Your training data likely contains Next.js 13/14 patterns that will break here. Before writing any Next.js code:

1. Read `node_modules/next/dist/docs/` for the installed version's specifics
2. Assume nothing about caching behavior — it changed significantly in v15
3. `fetch()` is no longer cached by default in v15. Use `unstable_cache` or route segment config explicitly
4. `params` and `searchParams` in pages/layouts are now **async** — always `await` them
5. Heed all deprecation warnings in the terminal
<!-- END:nextjs-agent-rules -->

---

## 0. Agent Prime Directives

These override everything else:

1. **Check `docs/PROGRESS.md` first.** Always. Understand the current phase before doing anything.
2. **One task, one log.** Every meaningful change gets a log file in `docs/logs/`.
3. **Never guess the stack.** The stack is locked (see §3). Don't introduce alternatives.
4. **Partial done = not done.** Don't mark a PROGRESS.md task complete unless it fully works.
5. **If blocked, say so.** Add a `⚠️ BLOCKER:` entry to `docs/PROGRESS.md` and stop. Don't hack around it silently.
6. **Security is non-negotiable.** No secrets in code. No RLS bypasses. No unvalidated inputs reaching the DB.

---

## 1. Workflow & Logging

### Starting a Task
```
1. Read docs/PROGRESS.md — understand current phase + what's done
2. Read this file (AGENTS.md) fully
3. Read any relevant doc in docs/ for context (PRD, SRS, design system)
4. Plan before touching files
```

### Completing a Task
```
1. Verify the feature actually works (don't assume)
2. Check off the item in docs/PROGRESS.md
3. Update "Last Updated" field in docs/PROGRESS.md
4. Create a log file in docs/logs/
5. If a phase is now fully complete → promote Current Phase
```

### Log File Standard
**Location:** `docs/logs/`  
**Naming:** `DD-MM-YYYY-<feature-or-change>.md`  
**Example:** `17-06-2026-auth-setup.md`

```markdown
# [Feature/Change Name] — DD Month YYYY

## Objective
What was built, changed, or fixed and why.

## Files Changed
- `path/to/file.ts` — what changed
- `path/to/other.ts` — what changed

## Decisions
Any architectural choices, tradeoffs, or new dependencies introduced.
Explain *why*, not just *what*.

## Dependencies Added
- `package-name@version` — reason for adding

## Known Limitations
Anything that's intentionally incomplete or deferred.
```

---

## 2. Technology Stack (Locked — Do Not Deviate)

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 16 (App Router) | See §0 for v15 specifics |
| Language | TypeScript (strict mode) | `any` is banned |
| Styling | TailwindCSS + CSS Variables | No inline styles, no ad-hoc colors |
| ORM | Prisma | All DB access goes through Prisma client |
| Database | Local PostgreSQL | Never connect directly — always via Prisma |
| Auth | Auth.js v5 (NextAuth) + Prisma adapter | See §6 |
| IDs | UUID v7 via `uuidv7` npm | See §5 — no exceptions |
| Cache | Upstash Redis | All Wikipedia API responses cached here |
| Motion | Framer Motion + GSAP | See §8 for which to use when |
| Testing | Vitest (unit) + Playwright (E2E) | |
| Package Management | pnpm | No npm or yarn — pnpm only |

**If a library not listed here is needed:** Document the decision in your log file with justification. Do not just install it silently.

---

## 3. TypeScript Rules

### Strict Mode — Always On
```json
// tsconfig.json must have:
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true
  }
}
```

### The `any` Ban
```typescript
// ❌ Never
const data: any = await fetch(...)
function process(input: any) {}

// ✅ Always
const data: unknown = await fetch(...)
function process(input: WikipediaArticle) {}

// ✅ If truly dynamic
function parse(input: unknown): WikipediaArticle {
  if (!isWikipediaArticle(input)) throw new Error('Invalid shape')
  return input
}
```

### Prisma Types — Don't Duplicate
```typescript
// ❌ Never hand-write DB model interfaces
interface User {
  id: string
  email: string
  // ...
}

// ✅ Import from Prisma
import type { User, Bookmark, ReadingHistory } from '@prisma/client'

// ✅ For extended shapes, use Prisma's utility types
import type { Prisma } from '@prisma/client'
type UserWithBookmarks = Prisma.UserGetPayload<{
  include: { bookmarks: true }
}>
```

### Null & Undefined
```typescript
// ❌ Never
const title = article.pages[0].title  // unsafe

// ✅ Always
const title = article.pages?.[0]?.title ?? 'Untitled'
```

### Component Props
```typescript
// ✅ Interface for object shapes
interface ArticleCardProps {
  article: Article
  onBookmark: (id: string) => void
  isBookmarked: boolean
}

export function ArticleCard({ article, onBookmark, isBookmarked }: ArticleCardProps) {}
```

---

## 4. Next.js App Router Rules

### Server vs Client — The Decision Rule
```
Default → Server Component
Need useState / useEffect / browser API / event listener → Client Component
Need both → Split: Server parent passes data to Client leaf
```

```typescript
// ✅ Server Component (data fetching, no 'use client')
// app/(main)/feed/page.tsx
export default async function FeedPage() {
  const articles = await getPersonalizedFeed()  // runs on server
  return <FeedColumn articles={articles} />
}

// ✅ Client Component (interactivity only)
// components/feed/BookmarkButton.tsx
'use client'
export function BookmarkButton({ articleId }: { articleId: string }) {
  const [saved, setSaved] = useState(false)
  // ...
}
```

### Data Fetching in v15
```typescript
// ❌ fetch() is NOT cached by default in Next.js 15
const res = await fetch('https://en.wikipedia.org/...')

// ✅ Explicit cache control
const res = await fetch('https://en.wikipedia.org/...', {
  next: { revalidate: 3600 }  // 1 hour
})

// ✅ Or use unstable_cache for complex queries
import { unstable_cache } from 'next/cache'

const getCachedArticle = unstable_cache(
  async (id: string) => fetchArticleFromWikipedia(id),
  ['wikipedia-article'],
  { revalidate: 3600 }
)
```

### Async Params in v15
```typescript
// ❌ v14 pattern — breaks in v15
export default function ArticlePage({ params }: { params: { id: string } }) {
  const { id } = params
}

// ✅ v15 pattern — params is a Promise
export default async function ArticlePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
}
```

### Route Handlers
```typescript
// All API routes must:
// 1. Validate auth on protected routes
// 2. Validate input with Zod
// 3. Return typed JSON responses
// 4. Handle errors with structured responses

// app/api/engage/route.ts
import { auth } from '@/lib/auth'
import { z } from 'zod'

const engageSchema = z.object({
  article_id: z.string().min(1),
  event_type: z.enum(['open', 'skip', 'bookmark', 'share', 'scroll_complete']),
  metadata: z.object({
    read_depth: z.number().min(0).max(1).optional(),
    time_spent: z.number().positive().optional(),
  }).optional()
})

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = engageSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  // ... handler logic
}
```

---

## 5. ID Strategy — UUID v7

**UUID v7 is used for every primary key across every model. No exceptions.**

```typescript
// lib/id.ts — the single source of truth for ID generation
import { uuidv7 } from 'uuidv7'

export const newId = (): string => uuidv7()
```

```typescript
// ✅ Every Prisma create call must pass id explicitly
import { newId } from '@/lib/id'

const user = await prisma.user.create({
  data: {
    id: newId(),
    email: input.email,
  }
})

const bookmark = await prisma.bookmark.create({
  data: {
    id: newId(),
    userId: session.user.id,
    articleId: input.article_id,
  }
})
```

```prisma
// ✅ Prisma schema — no @default() on id fields
model User {
  id        String   @id   // UUID v7, generated at app layer
  email     String   @unique
  // ...
}

// ❌ Never do this
model User {
  id  String  @id @default(uuid())   // This generates UUID v4
  id  String  @id @default(cuid())   // Wrong ID strategy
}
```

---

## 6. Authentication — Auth.js v5

```typescript
// lib/auth.ts
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/db/prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'database' },
  providers: [/* ... */],
})
```

### Auth Rules
- **Never bypass auth on protected routes.** Use the `auth()` helper at the top of every protected Server Component and Route Handler.
- **Sessions live in PostgreSQL.** Auth.js writes to the `Session` table via Prisma adapter. Do not store session data in Redis.
- **User IDs from Auth.js are UUID v7.** The adapter will use the `id` you pass. Always pass `newId()` on user creation.
- **Never expose `session.user.id` to the client** unless explicitly needed and scoped.

```typescript
// ✅ Protecting a Server Component
export default async function BookmarksPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')
  // ...
}

// ✅ Protecting an API route
export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
```

---

## 7. Database & Prisma Rules

### Client Instantiation — Singleton
```typescript
// lib/db/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Query Rules
```typescript
// ❌ Never select * implicitly — always specify fields you need
const user = await prisma.user.findUnique({ where: { id } })

// ✅ Select only what you need
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, email: true, theme: true }
})

// ✅ Always use transactions for multi-step writes
await prisma.$transaction([
  prisma.readingHistory.create({ data: { id: newId(), ...historyData } }),
  prisma.engagementEvent.create({ data: { id: newId(), ...eventData } }),
])
```

### Migrations
- Never edit the database directly. Always `prisma migrate dev`.
- Never use `prisma db push` in any environment that has real data.
- Migration files go in `prisma/migrations/` — commit them.

---

## 8. UI & Styling Rules
**MUST DO**
-  When working with UI components, read all UI related skills e.g impeccable, etc. first then proceed.
-  Run the playwright tests after every UI change to ensure nothing is broken.

### CSS Variables — Never Hardcode Colors
```typescript
// ❌ Never
<div className="bg-[#0A0A0F] text-[#F0F0F5]">

// ✅ Always use theme tokens
<div className="bg-bg-primary text-text-primary">
```

### Theme Tokens (defined in globals.css)
```css
:root[data-theme="midnight"] {
  --bg-primary: #0A0A0F;
  --bg-secondary: #12121A;
  --bg-card: #1A1A2E;
  --text-primary: #F0F0F5;
  --text-secondary: #A0A0B0;
  --text-muted: #606070;
  --accent: #6C63FF;
  --accent-hover: #8B85FF;
  --border: rgba(255,255,255,0.06);
}
```

### Typography
```
Headings (h1–h3):   font-family: 'EB Garamond', serif
Body / long-form:   font-family: 'Inter', sans-serif
Code / mono:        font-family: 'JetBrains Mono', monospace
```

### Component Standards
- Cards: `border-radius: 12px` · `box-shadow: 0 8px 32px rgba(0,0,0,0.4)`
- Buttons: `border-radius: 8px`
- Minimum touch target: `44×44px`
- Minimum text contrast: 4.5:1 against background

---

## 10. Motion & Animation

### The Prime Rule
> Animation communicates meaning. If it doesn't mean something, cut it.

### Which Library for What
| Use Case | Library |
|----------|---------|
| Feed card enter/exit | Framer Motion |
| Article card → full page expand | Framer Motion (`layoutId`) |
| Sidebar recommendations stagger | Framer Motion |
| Share modal open/close | Framer Motion |
| Page transitions | Framer Motion |
| Micro-interactions (hover, press) | Framer Motion |
| Onboarding hero sequence | GSAP |
| Knowledge graph visualization | GSAP |
| Share card reveal | GSAP |
| Scroll-driven storytelling | GSAP ScrollTrigger |
| Theme switch | CSS transition only |
| Color changes, simple hovers | CSS transition only |

### Framer Motion Config Constants
```typescript
// lib/motion/springs.ts
export const springs = {
  default: { type: 'spring', stiffness: 300, damping: 30 },
  gentle:  { type: 'spring', stiffness: 200, damping: 25 },
  snappy:  { type: 'spring', stiffness: 400, damping: 35 },
} as const

export const easings = {
  standard: [0.25, 0.46, 0.45, 0.94],
  enter:    [0.0, 0.0, 0.2, 1.0],
  exit:     [0.4, 0.0, 1.0, 1.0],
} as const

export const durations = {
  fast:    0.15,
  normal:  0.3,
  slow:    0.5,
} as const
```

```typescript
// ✅ Feed card enter — use this pattern everywhere
<motion.div
  initial={{ opacity: 0, y: 16, scale: 0.96 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: -8, scale: 0.98 }}
  transition={{ duration: durations.normal, ease: easings.standard }}
/>

// ✅ Stagger children — max 0.06s between items
<AnimatePresence>
  {articles.map((article, i) => (
    <motion.div
      key={article.id}
      transition={{ delay: i * 0.06 }}
    />
  ))}
</AnimatePresence>

// ✅ Article expand — shared layout animation
// Card has layoutId="article-{id}", full view has same layoutId
<motion.div layoutId={`article-${article.id}`} />
```

### Never Do
```
❌ Bounce easing on any content (cheap, not editorial)
❌ Rotation animations
❌ Infinite loops (except loading spinners)
❌ Animating text the user is actively reading
❌ Multiple animations competing simultaneously
❌ Scale > 1.03 on hover
❌ Transition duration > 500ms for UI interactions
```

---

## 11. Error Handling

### API Routes — Structured Errors
```typescript
// Every API route returns consistent error shape
type ApiError = {
  error: string
  code?: string
  details?: unknown
}

// Status codes:
// 400 → Bad input (Zod validation failed)
// 401 → Not authenticated
// 403 → Authenticated but not authorized
// 404 → Resource not found
// 429 → Rate limited
// 500 → Server error (log it, don't expose internals)
```

### Client Error Boundaries
- Every major page section needs an `error.tsx` boundary in App Router
- Loading states need a `loading.tsx` — never show blank screens

### Wikipedia API Failures
```typescript
// lib/wikipedia/api.ts
// Always fall back gracefully:
// 1. Try Upstash cache first
// 2. Try Wikipedia API
// 3. If both fail → return null, never throw to the feed
```

---

## 12. Security Rules

- **No secrets in source code.** All credentials live in `.env.local` (local) and environment variables (production). `.env.local` is gitignored — verify before every commit.
- **Validate all inputs.** Use Zod schemas on every API route. Never trust `request.json()` directly.
- **Rate limiting.** Every public API route must check rate limits via Redis before processing.
- **No direct SQL.** Prisma only. If you need a raw query, `prisma.$queryRaw` with parameterized values — never string concatenation.
- **Row Level Security.** Will be enforced post-migration to Supabase. Write queries now as if RLS is already active — always scope to `session.user.id`.

---

## 13. Performance Rules

- **Lazy load below-the-fold images.** Use Next.js `<Image>` with `loading="lazy"`.
- **Prefetch article content.** When a card enters the viewport, prefetch its full content.
- **Algorithm runs in a WebWorker.** Never block the main thread with scoring calculations.
- **Bundle budget.** Monitor with `@next/bundle-analyzer`. No single route chunk > 200kb gzipped.
- **Wikipedia responses cached.** TTL minimum 1 hour. No live Wikipedia call should happen twice for the same content.

---

*AGENTS.md is a living document. Update it when the team makes new architectural decisions — don't let it drift from reality.*