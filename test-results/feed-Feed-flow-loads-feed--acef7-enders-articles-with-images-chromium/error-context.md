# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: feed.spec.ts >> Feed flow >> loads feed, triggers pagination and renders articles with images
- Location: tests/e2e/feed.spec.ts:13:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('article').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('article').first()

```

```yaml
- img
- heading "This page couldn’t load" [level=1]
- paragraph: Reload to try again, or go back.
- button "Reload"
- button "Back"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Feed flow', () => {
  4  |   // Use a logged-in state. Since we can't easily persist the state with our custom test credential flow in setup,
  5  |   // we will just login at the start of each test or use beforeEach.
  6  |   test.beforeEach(async ({ page }) => {
  7  |     await page.goto('/login');
  8  |     const testLoginBtn = page.getByTestId('test-login');
  9  |     await testLoginBtn.click();
  10 |     await page.waitForURL(/.*\/feed/);
  11 |   });
  12 | 
  13 |   test('loads feed, triggers pagination and renders articles with images', async ({ page }) => {
  14 |     // Feed should show articles
  15 |     const articleCards = page.locator('article');
> 16 |     await expect(articleCards.first()).toBeVisible({ timeout: 10000 });
     |                                        ^ Error: expect(locator).toBeVisible() failed
  17 |     
  18 |     // Count initial articles (should be around 10 based on our API)
  19 |     const initialCount = await articleCards.count();
  20 |     expect(initialCount).toBeGreaterThan(0);
  21 | 
  22 |     // Verify images are rendered (at least some articles should have images)
  23 |     const images = page.locator('article img');
  24 |     await expect(images.first()).toBeVisible();
  25 | 
  26 |     // Scroll to the bottom to trigger infinite scroll
  27 |     await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  28 |     
  29 |     // Wait for new articles to load
  30 |     await expect(async () => {
  31 |       const newCount = await articleCards.count();
  32 |       expect(newCount).toBeGreaterThan(initialCount);
  33 |     }).toPass({ timeout: 10000 });
  34 |   });
  35 | });
  36 | 
```