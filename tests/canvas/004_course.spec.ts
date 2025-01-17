import { test } from '@playwright/test';

import { loginWithBasicAuth } from '@/tests/utils/auth';
import {
    announcements,
    openModuleItem,
    modules,
    revealToggle,
    getLtiModuleName,
    getLtiModuleIndex,
    revealAccordion,
    revealTabs,
    vimeoTranscripts,
    hint,
    multilingual,
    diploma,
} from '@/tests/utils/course';
import { routeToTestCourse } from '@/tests/utils/routes';
import { iframeHeadingElement, useDesktopViewport } from '@/tests/utils/shared';

test.describe('4. Course Content | Canvas', async () => {
    useDesktopViewport();

    test('4.1 Modules', async ({ page }, testInfo) => {
        await loginWithBasicAuth(page, testInfo.project.name);
        await routeToTestCourse(page);

        await modules(page);
    });

    test('4.2 Announcements', async ({ page }, testInfo) => {
        await loginWithBasicAuth(page, testInfo.project.name);
        await routeToTestCourse(page);

        await announcements(page);
    });

    test.describe('4.3 Reveal', async () => {
        test('4.3.1 Toggle', async ({ page }, testInfo) => {
            await loginWithBasicAuth(page, testInfo.project.name);
            await routeToTestCourse(page);

            await openModuleItem(page, '1. Innhold', '1.2 Reveal');
            await revealToggle(page);
        });

        test('4.3.2 Accordion', async ({ page }, testInfo) => {
            await loginWithBasicAuth(page, testInfo.project.name);
            await routeToTestCourse(page);

            await openModuleItem(page, '1. Innhold', '1.2 Reveal');
            await revealAccordion(page);
        });

        test('4.3.3 Tabs', async ({ page }, testInfo) => {
            await loginWithBasicAuth(page, testInfo.project.name);
            await routeToTestCourse(page);

            await openModuleItem(page, '1. Innhold', '1.2 Reveal');
            await revealTabs(page);
        });
    });

    test('4.4 Vimeo Transcript', async ({ page }, testInfo) => {
        const isFirefox =
            testInfo.project.name === 'firefox' || testInfo.project.name === 'canvas-firefox';
        const isWebKit =
            testInfo.project.name === 'webkit' || testInfo.project.name === 'canvas-webkit';
        if (isFirefox || isWebKit) test.skip(); // BUG: Works locally but not on CI, disable Firefox and WebKit for now

        await loginWithBasicAuth(page, testInfo.project.name);
        await routeToTestCourse(page);

        const revealContainer = page.locator('.show-content > p > .custom-reveal-wrapper');
        const revealContainerNb = revealContainer.nth(0);
        const revealContainerNbAndNn = revealContainer.nth(1);
        const revealContainerAll = revealContainer.nth(2);
        const revealContainerNone = revealContainer.nth(3);

        await openModuleItem(page, '1. Innhold', '1.4 Vimeo');

        await page.waitForTimeout(30_000);

        await vimeoTranscripts(revealContainerNb, ['Norsk bokmål']);
        await vimeoTranscripts(revealContainerNbAndNn, ['Norsk bokmål', 'Norsk nynorsk']);
        await vimeoTranscripts(revealContainerAll, [
            'Norsk bokmål',
            'Davvisámegiella',
            'Norsk nynorsk',
        ]);
        await vimeoTranscripts(revealContainerNone, []);
    });

    test('4.5 Hint', async ({ page }, testInfo) => {
        await loginWithBasicAuth(page, testInfo.project.name);
        await routeToTestCourse(page);

        await openModuleItem(page, '1. Innhold', '1.6 Hint');
        await hint(page);
    });

    // TODO: Update auth bypass for webkit, ref: https://blog.certa.dev/third-party-cookie-restrictions-for-iframes-in-safari
    test('4.6 Grafana', async ({ page }, testInfo) => {
        if (testInfo.project.name === 'webkit' || testInfo.project.name === 'canvas-webkit')
            test.skip();

        await loginWithBasicAuth(page, testInfo.project.name);
        await routeToTestCourse(page);

        await openModuleItem(page, '1. Innhold', '1.8 Grafana');

        const iframeElement = page.frameLocator('iframe[title="Grafana"]');
        await iframeHeadingElement(
            iframeElement,
            'h1',
            'Digital kompetanse for skoleeiere og skoleledere',
        );
    });

    test('4.7 Multilingual', async ({ page }, testInfo) => {
        await loginWithBasicAuth(page, testInfo.project.name);
        await routeToTestCourse(page);

        await openModuleItem(page, '1. Innhold', '1.9 Flerspråklig');
        await multilingual(page);
    });

    test('5.4 Forvaltning', async ({ page }, testInfo) => {
        await loginWithBasicAuth(page, testInfo.project.name);
        await routeToTestCourse(page);

        await openModuleItem(page, getLtiModuleName(), `${getLtiModuleIndex()}.2 Forvaltning`);

        const iframeElement = page.frameLocator('iframe[title="KPAS"]');
        await iframeHeadingElement(iframeElement, 'h2', 'Helsesjekk');
    });

    test('5.5 Diplom', async ({ page }, testInfo) => {
        await loginWithBasicAuth(page, testInfo.project.name);
        await routeToTestCourse(page);

        await openModuleItem(page, getLtiModuleName(), `${getLtiModuleIndex()}.3 Diplom`);

        const iframeElement = page.frameLocator('iframe[title="KPAS"]');
        await diploma(page, iframeElement);
    });

    test('5.6 License & Banner', async ({ page }, testInfo) => {
        await loginWithBasicAuth(page, testInfo.project.name);
        await routeToTestCourse(page);

        await page.locator('footer.footer .course-license-footer').waitFor({ state: 'visible' });
        await page
            .locator('.fixed-bottom .information-banner-content-text:has-text("test")')
            .waitFor({ state: 'visible' });
    });
});
