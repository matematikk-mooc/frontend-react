import { Page, test } from '@playwright/test';

import { loginWithBasicAuth } from '@/tests/utils/auth';
import {
    getLtiModuleIndex,
    getLtiModuleName,
    openModuleItem,
    roleAndGroups,
    survey,
} from '@/tests/utils/course';
import { routeToTestCourse } from '@/tests/utils/routes';
import { getEnv, iframeHeadingElement, useDesktopViewport } from '@/tests/utils/shared';

test.describe('5. Course Role LTI | Canvas', async () => {
    test.describe.configure({ mode: 'serial' });
    useDesktopViewport();

    let page: Page;

    test.beforeEach(async ({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();
    });

    test.afterEach(async () => {
        if (page) {
            await page.close();
        }
    });

    // eslint-disable-next-line no-empty-pattern
    test('5.1 Rolle og grupper', async ({}, testInfo) => {
        if (getEnv() === 'stage') test.skip(); // BUG: Disable test for now, ref: https://udir.sentry.io/issues/17338611

        await loginWithBasicAuth(page, testInfo.project.name);
        await routeToTestCourse(page);
        await openModuleItem(
            page,
            getLtiModuleName(),
            `${getLtiModuleIndex()}.1.1 Rolle og grupper`,
        );

        const iframeElement = page.frameLocator('iframe[title="KPAS"]');
        await roleAndGroups(
            page,
            iframeElement,
            true,
            'Naturfag 1-7',
            'Akershus',
            'Asker',
            'Asker videregående skole',
        );
        await roleAndGroups(
            page,
            iframeElement,
            false,
            'Matematikk 8-10',
            'Oslo',
            'Oslo',
            'Bjerke videregående skole',
        );
    });

    // eslint-disable-next-line no-empty-pattern
    test('5.2 Undersøkelse', async ({}, testInfo) => {
        if (getEnv() === 'stage') test.skip(); // BUG: Disable test for now, ref: https://udir.sentry.io/issues/17338611

        // NOTE: KPAS LTI with alert dialog is not supported in webkit browser, fix frontend before enabling this test
        if (testInfo.project.name === 'webkit' || testInfo.project.name === 'canvas-webkit')
            test.skip();

        await loginWithBasicAuth(page, testInfo.project.name);
        await routeToTestCourse(page);
        await openModuleItem(page, getLtiModuleName(), `${getLtiModuleIndex()}.1.2 Undersøkelse`);

        page.on('dialog', async dialog => {
            await dialog.accept();
        });

        const iframeElement = page.frameLocator('iframe[title="KPAS"]');
        await survey(iframeElement);
    });

    // eslint-disable-next-line no-empty-pattern
    test('5.3 Dashboard', async ({}, testInfo) => {
        if (getEnv() === 'stage') test.skip(); // BUG: Disable test for now, ref: https://udir.sentry.io/issues/17338611

        await loginWithBasicAuth(page, testInfo.project.name);
        await routeToTestCourse(page);
        await openModuleItem(page, getLtiModuleName(), `${getLtiModuleIndex()}.1.3 Dashboard`);

        const iframeElement = page.frameLocator('iframe[title="KPAS"]');
        await iframeHeadingElement(iframeElement, 'h3', 'Resultater fra gruppe:');
    });
});
