import { expect, Page } from '@playwright/test';

import { routeToBasicAuth } from '@/tests/utils/routes';

export const loginWithBasicAuth = async (page: Page, projectName: string) => {
    let username = '';
    let password = '';

    if (projectName === 'firefox' || projectName === 'canvas-firefox') {
        username = process.env?.TEST_CANVAS_FIREFOX_USERNAME || '';
        password = process.env?.TEST_CANVAS_FIREFOX_PASSWORD || '';
    } else if (projectName === 'webkit' || projectName === 'canvas-webkit') {
        username = process.env?.TEST_CANVAS_WEBKIT_USERNAME || '';
        password = process.env?.TEST_CANVAS_WEBKIT_PASSWORD || '';
    } else {
        username = process.env?.TEST_CANVAS_CHROMIUM_USERNAME || '';
        password = process.env?.TEST_CANVAS_CHROMIUM_PASSWORD || '';
    }

    expect(username).not.toBe('');
    expect(password).not.toBe('');

    await routeToBasicAuth(page);

    const loginButton = page.locator('.header__link', { hasText: 'Logg inn' });
    const logoutButton = page.locator('.header__link', { hasText: 'Logg ut' });
    await loginButton.waitFor({ state: 'visible' });
    await logoutButton.waitFor({ state: 'hidden' });

    await page.locator('#pseudonym_session_unique_id').fill(username);
    await page.locator('#pseudonym_session_password').fill(password);
    await page.locator('input.Button--login').click();

    await loginButton.waitFor({ state: 'hidden', timeout: 30_000 });
    await logoutButton.waitFor({ state: 'visible', timeout: 30_000 });
};

export const logout = async (page: Page) => {
    await page.locator('.header__link', { hasText: 'Logg ut' }).waitFor({ state: 'visible' });
    await page.locator('.header__content a.header__link', { hasText: 'Logg ut' }).click();

    await page.locator('h1.ic-Login__title', { hasText: 'Logg ut' }).waitFor({ state: 'visible' });
    await page.locator('.ic-Login button', { hasText: 'Logg ut' }).click();
    await page.locator('.header__link', { hasText: 'Logg ut' }).waitFor({ state: 'hidden' });
};
