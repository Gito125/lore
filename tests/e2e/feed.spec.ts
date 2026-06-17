import { test, expect } from '@playwright/test';

test.describe('Feed flow', () => {
  // Use a logged-in state. Since we can't easily persist the state with our custom test credential flow in setup,
  // we will just login at the start of each test or use beforeEach.
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    const testLoginBtn = page.getByTestId('test-login');
    await testLoginBtn.click();
    await page.waitForURL(/.*\/feed/);
  });

  test('loads feed, triggers pagination and renders articles with images', async ({ page }) => {
    // Feed should show articles
    const articleCards = page.locator('article');
    await expect(articleCards.first()).toBeVisible({ timeout: 10000 });
    
    // Count initial articles (should be around 10 based on our API)
    const initialCount = await articleCards.count();
    expect(initialCount).toBeGreaterThan(0);

    // Verify images are rendered (at least some articles should have images)
    const images = page.locator('article img');
    await expect(images.first()).toBeVisible();

    // Scroll to the bottom to trigger infinite scroll
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Wait for new articles to load
    await expect(async () => {
      const newCount = await articleCards.count();
      expect(newCount).toBeGreaterThan(initialCount);
    }).toPass({ timeout: 10000 });
  });
});
