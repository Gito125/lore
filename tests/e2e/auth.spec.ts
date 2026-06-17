import { test, expect } from '@playwright/test';

test('redirects unauthenticated users to login from protected routes', async ({ page }) => {
  // Try to visit the feed page directly
  await page.goto('/feed');
  
  // Should redirect to login
  await expect(page).toHaveURL(/.*\/login/);
  
  // Verify login page renders
  await expect(page.locator('h1')).toContainText('Welcome back');
});

test('redirects unauthenticated users to login from bookmarks route', async ({ page }) => {
  // Try to visit the bookmarks page directly
  await page.goto('/bookmarks');
  
  // Should redirect to login
  await expect(page).toHaveURL(/.*\/login/);
});
