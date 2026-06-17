# Fix Wikipedia API Related Endpoint — 17 June 2026

## Objective
Fixed the feed not showing articles. The Wikipedia REST API `/page/related/{title}` endpoint was returning a 403 Forbidden because it is being decommissioned (T376297). This caused `getRelatedArticles` to return an empty array, resulting in an empty feed.

## Files Changed
- `lib/wikipedia/api.ts` — Updated `getRelatedArticles` to use the MediaWiki Action API (`action=query&generator=search&gsrsearch=...`) instead of the deprecated REST API endpoint. Defined `ActionApiPage` interface to fix `any` linting errors.
- `lib/auth.ts` — Fixed an ESLint error regarding `require()` style imports.

## Decisions
- Switched to the Wikipedia `action=query` API as a drop-in replacement for fetching related articles by searching the current topic.
- Stripped HTML tags from the Action API extract to populate the plain-text `extract` field while keeping `extract_html` intact.

## Dependencies Added
- `dotenv@17.4.2` — Added as a devDependency to fix type checking for `playwright.config.ts`.
