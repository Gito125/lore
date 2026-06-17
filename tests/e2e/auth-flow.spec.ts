import { test, expect } from '@playwright/test';

test.describe('Auth flows', () => {
  test('login flow', async ({ page }) => {
    await page.goto('/login');
    
    // Test login button should be visible in test mode
    const testLoginBtn = page.getByTestId('test-login');
    await expect(testLoginBtn).toBeVisible();
    
    await testLoginBtn.click();
    
    // Should redirect to feed after successful login
    await expect(page).toHaveURL(/.*\/feed/);
    
    // Should have user navigation or feed loaded
    await expect(page.locator('h1').filter({ hasText: 'Feed' })).toBeVisible();
  });
});
