import { test, expect } from '@playwright/test';

test.describe('Bookmark flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    const testLoginBtn = page.getByTestId('test-login');
    await testLoginBtn.click();
    await page.waitForURL(/.*\/feed/);
  });

  test('bookmarks an article, checks bookmarks page, and removes it', async ({ page }) => {
    // Wait for feed to load articles
    const articleCard = page.locator('article').first();
    await expect(articleCard).toBeVisible({ timeout: 10000 });
    
    // Get the title to verify later
    const articleTitle = await articleCard.locator('h3').textContent();
    expect(articleTitle).toBeTruthy();

    // Find the bookmark button inside the article card
    // We assume it's a button with an aria-label or we can find it by looking for the Bookmark icon
    // Wait for a button that either has 'Bookmark' text, aria-label, or we select the right button
    const bookmarkBtn = articleCard.locator('button', { has: page.locator('svg') }).last();
    
    // Click to bookmark
    await bookmarkBtn.click();
    
    // Optional: wait for some feedback, e.g. a toast or state change
    await page.waitForTimeout(1000); // Wait for API response
    
    // Navigate to bookmarks
    await page.goto('/bookmarks');
    
    // Verify the article is there
    const bookmarkedCard = page.locator('article');
    await expect(bookmarkedCard.first()).toBeVisible({ timeout: 5000 });
    
    const bookmarkedTitle = await bookmarkedCard.first().locator('h3').textContent();
    expect(bookmarkedTitle).toBe(articleTitle);
    
    // Remove the bookmark
    const removeBtn = bookmarkedCard.first().locator('button', { has: page.locator('svg') }).last();
    await removeBtn.click();
    
    // Wait for API and UI update
    await page.waitForTimeout(1000);
    
    // Verify the article is gone
    await expect(page.locator('article')).toHaveCount(0);
  });
});
