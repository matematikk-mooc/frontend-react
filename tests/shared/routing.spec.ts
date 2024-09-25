import { describe } from 'node:test';

import { test, expect } from '@playwright/test';

describe('Routing', () => {
    test('404 template works', async ({ page }) => {
        await page.goto('/404');
        await expect(page.locator('h1')).toContainText('404 - Page Not Found');
    });

    test('Error template works', async ({ page }) => {
        await page.goto('/error');
        await expect(page.locator('h1')).toContainText('Error');
    });

    test('Index template works', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('h1')).toContainText('NextJS Homepage');
    });

    test('Contact template works', async ({ page }) => {
        await page.goto('/contact');
        await expect(page.locator('h1')).toContainText('Contact');
    });

    test('Sitemap template works', async ({ page }) => {
        await page.goto('/sitemap.xml');
        await expect(page.locator('h1')).toContainText('Sitemap');
    });
});
