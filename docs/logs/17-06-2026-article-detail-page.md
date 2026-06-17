# Article Detail Page — 17 June 2026

## Objective
Implement the Article Detail Page (`/article/[id]`) to render full Wikipedia articles instead of 404s. This resolves the biggest UX blocker in the app.

## Files Changed
- `lib/wikipedia/api.ts` — Added `getWikipediaArticleFull` to fetch the full HTML of a Wikipedia article using `action=parse`.
- `lib/wikipedia/parser.ts` — Enhanced `parseWikipediaContent` to strip `.mw-editsection`, empty paragraphs, and style infoboxes/images using Tailwind CSS tokens.
- `app/(main)/article/[id]/page.tsx` — Updated to use `getWikipediaArticleFull`, render the hero thumbnail, and display the article content using `dangerouslySetInnerHTML`.
- `app/globals.css` — Added `@plugin "@tailwindcss/typography"` for better `prose` styling.
- `app/(main)/feed/page.tsx` — Updated the mock IDs to real Wikipedia article titles (`Voynich_manuscript`, `Dyatlov_Pass_incident`, `Late_Bronze_Age_collapse`) to allow immediate testing from the feed.

## Decisions
- Used `https://en.wikipedia.org/w/api.php?action=parse` to fetch full HTML instead of `/page/mobile-sections/` as it successfully returned the formatted document without authentication or blocking issues.
- Installed `@tailwindcss/typography` to handle the heavy lifting of styling Wikipedia's generated HTML. Added some minimal regex cleaning to format infoboxes using Lore's design tokens.

## Dependencies Added
- `@tailwindcss/typography@0.5.20` — to cleanly render dynamic HTML using `prose` classes.

## Known Limitations
- The Article Images feature is partially complete. We are rendering thumbnails on the Detail Page, but `ArticleCard` still relies on mock data for its `imageUrl` until we complete the Feed Data Wiring step.
