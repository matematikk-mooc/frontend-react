import { describe } from 'node:test';

import { test, expect } from '@playwright/test';

describe('Multilingual', () => {
    test('HTML tag has language attribute', async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('html')).toHaveAttribute('lang', 'nb');

        await page.goto('/sv');
        await expect(page.locator('html')).toHaveAttribute('lang', 'sv');
    });

    /*


    test('Direct template paths are redirected', async ({ page }) => {
        // TODO: Make sure /contact redirects to /kontakt
    });

    test('Locale is not in URL for default language', async ({ page }) => {
        // TODO: Make sure /nb redirects to /
        // TODO: Make sure /nb/kontakt redirects to /kontakt
    });
    */
});
