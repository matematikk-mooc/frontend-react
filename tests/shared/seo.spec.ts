import { test, expect } from '@playwright/test';

test('Basic SEO tags are set', async ({ page }) => {
    await page.goto('/');

    const title = await page.title();
    const metaDescription = page.locator('meta[name="description"]');
    const metaCharset = page.locator('meta[charset="UTF-8"]');
    const metaViewport = page.locator('meta[name="viewport"]');
    const metaRobots = page.locator('meta[name="robots"]');

    await expect(title).not.toBe('');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
    await expect(metaCharset).toBeTruthy();
    await expect(metaViewport).toHaveAttribute('content', 'width=device-width, initial-scale=1');
    await expect(metaRobots).toHaveAttribute('content', 'index, follow');

    const linkCanonical = page.locator('link[rel="canonical"]');
    const linkIcon = page.locator('link[rel="icon"]');
    const linkSitemap = page.locator('link[rel="sitemap"]');

    await expect(linkCanonical).toHaveAttribute('href', 'http://localhost:3000/');
    await expect(linkIcon).toHaveAttribute('href', '/favicon.ico');
    await expect(linkSitemap).toHaveAttribute('href', 'http://localhost:3000/sitemap.xml');
});

test('Open Graph tags are set', async ({ page }) => {
    await page.goto('/');

    const metaOgTitle = page.locator('meta[property="og:title"]');
    const metaOgDescription = page.locator('meta[property="og:description"]');
    const metaOgImage = page.locator('meta[property="og:image"]');
    const metaOgUrl = page.locator('meta[property="og:url"]');
    const metaOgType = page.locator('meta[property="og:type"]');
    const metaOgSiteName = page.locator('meta[property="og:site_name"]');

    await expect(metaOgTitle).toHaveAttribute('content', /.+/);
    await expect(metaOgDescription).toHaveAttribute('content', /.+/);
    await expect(metaOgImage).toHaveAttribute('content', /.+/);
    await expect(metaOgUrl).toHaveAttribute('content', 'http://localhost:3000/');
    await expect(metaOgType).toHaveAttribute('content', 'website');
    await expect(metaOgSiteName).toHaveAttribute('content', /.+/);
});

test('Twitter tags are set', async ({ page }) => {
    await page.goto('/');

    const metaTwitterCard = page.locator('meta[name="twitter:card"]');
    const metaTwitterSite = page.locator('meta[name="twitter:site"]');
    const metaTwitterTitle = page.locator('meta[name="twitter:title"]');
    const metaTwitterDescription = page.locator('meta[name="twitter:description"]');
    const metaTwitterImage = page.locator('meta[name="twitter:image"]');
    const metaTwitterUrl = page.locator('meta[name="twitter:url"]');

    await expect(metaTwitterCard).toHaveAttribute('content', 'summary');
    await expect(metaTwitterSite).toHaveAttribute('content', '@site');
    await expect(metaTwitterTitle).toHaveAttribute('content', /.+/);
    await expect(metaTwitterDescription).toHaveAttribute('content', /.+/);
    await expect(metaTwitterImage).toHaveAttribute('content', /.+/);
    await expect(metaTwitterUrl).toHaveAttribute('content', 'http://localhost:3000/');
});
