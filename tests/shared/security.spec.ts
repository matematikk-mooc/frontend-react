import { test, expect } from '@playwright/test';

test('X-Content-Type-Options', async ({ page }) => {
    await page.goto('/');

    const metaContentTypeOptions = page.locator('meta[http-equiv="X-Content-Type-Options"]');
    await expect(metaContentTypeOptions).toHaveAttribute('content', 'nosniff');
});

test('Content Security Policy (CSP)', async ({ page }) => {
    await page.goto('/');

    const metaCSP = page.locator('meta[http-equiv="Content-Security-Policy"]');
    await expect(metaCSP).toHaveAttribute(
        'content',
        "default-src 'self'; script-src 'self' https://apis.example.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://cdn.example.com; object-src 'none';",
    );
});

test('Strict-Transport-Security (HSTS)', async ({ page }) => {
    await page.goto('/');

    const metaHSTS = page.locator('meta[http-equiv="Strict-Transport-Security"]');
    await expect(metaHSTS).toHaveAttribute(
        'content',
        'max-age=31536000; includeSubDomains; preload',
    );
});

test('Referrer Policy', async ({ page }) => {
    await page.goto('/');

    const metaReferrer = page.locator('meta[name="referrer"]');
    await expect(metaReferrer).toHaveAttribute('content', 'no-referrer');
});

test('Permissions Policy', async ({ page }) => {
    await page.goto('/');

    const metaPermissionsPolicy = page.locator('meta[http-equiv="Permissions-Policy"]');
    await expect(metaPermissionsPolicy).toHaveAttribute(
        'content',
        'geolocation=(self), microphone=()',
    );
});

test('Cross-Origin Resource Policy (CORP)', async ({ page }) => {
    await page.goto('/');

    const metaCORP = page.locator('meta[http-equiv="Cross-Origin-Resource-Policy"]');
    await expect(metaCORP).toHaveAttribute('content', 'same-origin');
});
