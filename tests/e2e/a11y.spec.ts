import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('Login page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/login');
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Feed page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('test-login').click();
    await page.waitForURL('**/feed');
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Search page should not have any automatically detectable accessibility issues', async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('test-login').click();
    await page.waitForURL('**/feed');
    await page.goto('/search');
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
