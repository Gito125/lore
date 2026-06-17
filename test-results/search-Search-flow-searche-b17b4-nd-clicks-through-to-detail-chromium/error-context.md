# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: search.spec.ts >> Search flow >> searches for a query, sees results, and clicks through to detail
- Location: tests/e2e/search.spec.ts:11:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByPlaceholder('Search the archive...')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - complementary [ref=e3]:
      - generic [ref=e4]:
        - img [ref=e5]
        - generic [ref=e7]: Lore
      - navigation [ref=e8]:
        - link "Feed" [ref=e9] [cursor=pointer]:
          - /url: /feed
          - img [ref=e10]
          - generic [ref=e13]: Feed
        - link "Search" [ref=e14] [cursor=pointer]:
          - /url: /search
          - img [ref=e15]
          - generic [ref=e18]: Search
        - link "Bookmarks" [ref=e19] [cursor=pointer]:
          - /url: /bookmarks
          - img [ref=e20]
          - generic [ref=e22]: Bookmarks
        - link "Notifications" [ref=e23] [cursor=pointer]:
          - /url: /notifications
          - img [ref=e24]
          - generic [ref=e27]: Notifications
        - link "Profile" [ref=e28] [cursor=pointer]:
          - /url: /profile
          - img [ref=e29]
          - generic [ref=e32]: Profile
      - link "Settings" [ref=e34] [cursor=pointer]:
        - /url: /settings
        - img [ref=e35]
        - generic [ref=e38]: Settings
    - main [ref=e40]:
      - generic [ref=e41]:
        - generic [ref=e42]:
          - heading "Explore" [level=1] [ref=e43]
          - paragraph [ref=e44]: SEARCH ACROSS THE KNOWLEDGE GRAPH
        - generic [ref=e45]:
          - generic:
            - img
          - textbox "Search topics, articles, or concepts..." [ref=e46]
        - generic [ref=e47]:
          - link "History" [ref=e48] [cursor=pointer]:
            - /url: /article/History
          - link "Science" [ref=e49] [cursor=pointer]:
            - /url: /article/Science
          - link "Philosophy" [ref=e50] [cursor=pointer]:
            - /url: /article/Philosophy
          - link "Art" [ref=e51] [cursor=pointer]:
            - /url: /article/Art
          - link "Technology" [ref=e52] [cursor=pointer]:
            - /url: /article/Technology
          - link "Mythology" [ref=e53] [cursor=pointer]:
            - /url: /article/Mythology
  - button "Open Next.js Dev Tools" [ref=e59] [cursor=pointer]:
    - img [ref=e60]
  - alert [ref=e63]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Search flow', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/login');
  6  |     const testLoginBtn = page.getByTestId('test-login');
  7  |     await testLoginBtn.click();
  8  |     await page.waitForURL(/.*\/feed/);
  9  |   });
  10 | 
  11 |   test('searches for a query, sees results, and clicks through to detail', async ({ page }) => {
  12 |     // Navigate to search page
  13 |     await page.goto('/search');
  14 |     
  15 |     // Type query
  16 |     const searchInput = page.getByPlaceholder('Search the archive...');
> 17 |     await searchInput.fill('Quantum computing');
     |                       ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  18 |     
  19 |     // Wait for debounce and API request (debounce is 300ms)
  20 |     // The skeleton should appear while loading
  21 |     // Results should appear
  22 |     const searchResult = page.locator('a:has(h3)');
  23 |     await expect(searchResult.first()).toBeVisible({ timeout: 10000 });
  24 |     
  25 |     const resultTitle = await searchResult.first().locator('h3').textContent();
  26 |     expect(resultTitle).toBeTruthy();
  27 | 
  28 |     // Click result
  29 |     await searchResult.first().click();
  30 |     
  31 |     // Should navigate to /article/[id]
  32 |     await expect(page).toHaveURL(/.*\/article\/.+/);
  33 |     
  34 |     // Verify the detail page renders
  35 |     const detailTitle = page.locator('h1');
  36 |     await expect(detailTitle).toBeVisible();
  37 |     
  38 |     // Titles might differ slightly due to redirect or formatting, but h1 should exist
  39 |     expect(await detailTitle.textContent()).toBeTruthy();
  40 |   });
  41 | });
  42 | 
```