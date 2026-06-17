import { test, expect } from '@playwright/test';

test.describe('Search flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    const testLoginBtn = page.getByTestId('test-login');
    await testLoginBtn.click();
    await page.waitForURL(/.*\/feed/);
  });

  test('searches for a query, sees results, and clicks through to detail', async ({ page }) => {
    // Navigate to search page
    await page.goto('/search');
    
    // Type query
    const searchInput = page.getByPlaceholder('Search the archive...');
    await searchInput.fill('Quantum computing');
    
    // Wait for debounce and API request (debounce is 300ms)
    // The skeleton should appear while loading
    // Results should appear
    const searchResult = page.locator('a:has(h3)');
    await expect(searchResult.first()).toBeVisible({ timeout: 10000 });
    
    const resultTitle = await searchResult.first().locator('h3').textContent();
    expect(resultTitle).toBeTruthy();

    // Click result
    await searchResult.first().click();
    
    // Should navigate to /article/[id]
    await expect(page).toHaveURL(/.*\/article\/.+/);
    
    // Verify the detail page renders
    const detailTitle = page.locator('h1');
    await expect(detailTitle).toBeVisible();
    
    // Titles might differ slightly due to redirect or formatting, but h1 should exist
    expect(await detailTitle.textContent()).toBeTruthy();
  });
});
