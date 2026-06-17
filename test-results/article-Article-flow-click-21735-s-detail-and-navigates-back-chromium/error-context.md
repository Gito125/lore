# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: article.spec.ts >> Article flow >> clicks ArticleCard, views detail, and navigates back
- Location: tests/e2e/article.spec.ts:11:7

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
  3  | test.describe('Article flow', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/login');
  6  |     const testLoginBtn = page.getByTestId('test-login');
  7  |     await testLoginBtn.click();
  8  |     await page.waitForURL(/.*\/feed/);
  9  |   });
  10 | 
  11 |   test('clicks ArticleCard, views detail, and navigates back', async ({ page }) => {
  12 |     // Wait for feed to load articles
  13 |     const articleCard = page.locator('article').first();
> 14 |     await expect(articleCard).toBeVisible({ timeout: 10000 });
     |                               ^ Error: expect(locator).toBeVisible() failed
  15 |     
  16 |     // Get the title of the article to verify later
  17 |     const articleTitle = await articleCard.locator('h3').textContent();
  18 |     expect(articleTitle).toBeTruthy();
  19 | 
  20 |     // Click the article link (it should be an anchor tag within the card or wrapping the card)
  21 |     await articleCard.locator('a').first().click();
  22 |     
  23 |     // Should navigate to /article/[id]
  24 |     await expect(page).toHaveURL(/.*\/article\/.+/);
  25 |     
  26 |     // Verify the detail page renders the correct title
  27 |     const detailTitle = page.locator('h1');
  28 |     await expect(detailTitle).toHaveText(articleTitle!);
  29 |     
  30 |     // Verify content is rendered
  31 |     await expect(page.locator('.prose p').first()).toBeVisible();
  32 | 
  33 |     // Navigate back to the feed
  34 |     await page.goBack();
  35 |     await expect(page).toHaveURL(/.*\/feed/);
  36 |   });
  37 | });
  38 | 
```