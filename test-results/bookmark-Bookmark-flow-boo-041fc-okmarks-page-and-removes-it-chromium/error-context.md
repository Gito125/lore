# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bookmark.spec.ts >> Bookmark flow >> bookmarks an article, checks bookmarks page, and removes it
- Location: tests/e2e/bookmark.spec.ts:11:7

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
  3  | test.describe('Bookmark flow', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/login');
  6  |     const testLoginBtn = page.getByTestId('test-login');
  7  |     await testLoginBtn.click();
  8  |     await page.waitForURL(/.*\/feed/);
  9  |   });
  10 | 
  11 |   test('bookmarks an article, checks bookmarks page, and removes it', async ({ page }) => {
  12 |     // Wait for feed to load articles
  13 |     const articleCard = page.locator('article').first();
> 14 |     await expect(articleCard).toBeVisible({ timeout: 10000 });
     |                               ^ Error: expect(locator).toBeVisible() failed
  15 |     
  16 |     // Get the title to verify later
  17 |     const articleTitle = await articleCard.locator('h3').textContent();
  18 |     expect(articleTitle).toBeTruthy();
  19 | 
  20 |     // Find the bookmark button inside the article card
  21 |     // We assume it's a button with an aria-label or we can find it by looking for the Bookmark icon
  22 |     // Wait for a button that either has 'Bookmark' text, aria-label, or we select the right button
  23 |     const bookmarkBtn = articleCard.locator('button', { has: page.locator('svg') }).last();
  24 |     
  25 |     // Click to bookmark
  26 |     await bookmarkBtn.click();
  27 |     
  28 |     // Optional: wait for some feedback, e.g. a toast or state change
  29 |     await page.waitForTimeout(1000); // Wait for API response
  30 |     
  31 |     // Navigate to bookmarks
  32 |     await page.goto('/bookmarks');
  33 |     
  34 |     // Verify the article is there
  35 |     const bookmarkedCard = page.locator('article');
  36 |     await expect(bookmarkedCard.first()).toBeVisible({ timeout: 5000 });
  37 |     
  38 |     const bookmarkedTitle = await bookmarkedCard.first().locator('h3').textContent();
  39 |     expect(bookmarkedTitle).toBe(articleTitle);
  40 |     
  41 |     // Remove the bookmark
  42 |     const removeBtn = bookmarkedCard.first().locator('button', { has: page.locator('svg') }).last();
  43 |     await removeBtn.click();
  44 |     
  45 |     // Wait for API and UI update
  46 |     await page.waitForTimeout(1000);
  47 |     
  48 |     // Verify the article is gone
  49 |     await expect(page.locator('article')).toHaveCount(0);
  50 |   });
  51 | });
  52 | 
```