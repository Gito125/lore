import { test, expect } from '@playwright/test';

test.describe('Article flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    const testLoginBtn = page.getByTestId('test-login');
    await testLoginBtn.click();
    await page.waitForURL(/.*\/feed/);
  });

  test('clicks ArticleCard, views detail, and navigates back', async ({ page }) => {
    // Wait for feed to load articles
    const articleCard = page.locator('article').first();
    await expect(articleCard).toBeVisible({ timeout: 10000 });
    
    // Get the title of the article to verify later
    const articleTitle = await articleCard.locator('h3').textContent();
    expect(articleTitle).toBeTruthy();

    // Click the article link (it should be an anchor tag within the card or wrapping the card)
    await articleCard.locator('a').first().click();
    
    // Should navigate to /article/[id]
    await expect(page).toHaveURL(/.*\/article\/.+/);
    
    // Verify the detail page renders the correct title
    const detailTitle = page.locator('h1');
    await expect(detailTitle).toHaveText(articleTitle!);
    
    // Verify content is rendered
    await expect(page.locator('.prose p').first()).toBeVisible();

    // Navigate back to the feed
    await page.goBack();
    await expect(page).toHaveURL(/.*\/feed/);
  });
});
