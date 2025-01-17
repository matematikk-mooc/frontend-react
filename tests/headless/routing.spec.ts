import { describe } from 'node:test';

import { test, expect } from '@playwright/test';

describe('Routing', () => {
    test('404 template works', async ({ page }) => {
        await page.goto('/404/');
        await expect(page.locator('main h1')).toContainText('404 - Siden finnes ikke');
    });

    test('About template works', async ({ page }) => {
        await page.goto('/om-kompetanseportalen/');
        await expect(page.locator('main h1')).toContainText('Om kompetanseportalen');
    });

    test('Contact template works', async ({ page }) => {
        await page.goto('/kontakt/');
        await expect(page.locator('main h1')).toContainText('Kontakt');
    });

    test('Privacy template works', async ({ page }) => {
        await page.goto('/personvern/');
        await expect(page.locator('main h1')).toContainText('Personvernerklæring');
    });
});
