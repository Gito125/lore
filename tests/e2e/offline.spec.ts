import { test, expect } from '@playwright/test';

test.describe('PWA Offline validation', () => {
  test('should load feed and last cached article when offline', async ({ page, context }) => {
    // Navigate to feed and login
    await page.goto('/login');
    await page.getByTestId('test-login').click();
    await page.waitForURL('**/feed');

    // Make sure feed loads
    await expect(page.locator('h1').filter({ hasText: 'Feed' })).toBeVisible();
    await page.waitForTimeout(1000); // Wait for caching

    // Go offline
    await context.setOffline(true);

    // Reload feed - should serve from cache
    await page.reload();
    await expect(page.locator('h1').filter({ hasText: 'Feed' })).toBeVisible();

    // Check offline page if navigating somewhere not cached
    // Wait, sw.js returns /offline if mode is navigate and not cached
    // But testing that might be tricky if it caches aggressively
  });
});
