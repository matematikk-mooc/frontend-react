import { expect, test } from '@playwright/test';

import { loginWithBasicAuth } from '@/tests/utils/auth';
import {
    cardCount,
    cardNewTag,
    cardRequiredTags,
    enrolledCard,
    invitedCard,
    randomCardTitleFromList,
    resetCardFilters,
    selectCardFilters,
    unenrolledCardEnroll,
    unenrolledCardReadMore,
} from '@/tests/utils/cards';
import { routeToFrontpage } from '@/tests/utils/routes';
import { getEnv, navLinks, stageBanner, useDesktopViewport } from '@/tests/utils/shared';

test.describe('2. Frontpage | Canvas', async () => {
    useDesktopViewport();

    test('2.1 Stage banner', async ({ page }, testInfo) => {
        await loginWithBasicAuth(page, testInfo.project.name);

        const header = page.locator('header#loggedInHeader .header__content');
        await stageBanner(header);
    });

    test('2.2 Nav links', async ({ page }, testInfo) => {
        await loginWithBasicAuth(page, testInfo.project.name);

        const header = page.locator('header#loggedInHeader');
        await navLinks(header, true);
    });

    test('2.3 Enrolled Card', async ({ page }, testInfo) => {
        await loginWithBasicAuth(page, testInfo.project.name);
        await routeToFrontpage(page, true);

        const cardInstances = page
            .locator('.landing-page .card-container')
            .locator(`.card-instance h2:has-text("Kunstig intelligens i skolen")`)
            .locator('xpath=ancestor::div[contains(@class, "card-instance")]');
        await enrolledCard(page, cardInstances);
    });

    test.describe('2.4 Unenrolled Card', async () => {
        test('2.4.1 Read more', async ({ page }, testInfo) => {
            if (getEnv() === 'production') test.skip(); // Bug: Modules list for preview is not working in production, skip for now
            await loginWithBasicAuth(page, testInfo.project.name);
            await routeToFrontpage(page, true);

            const cardInstances = page
                .locator('.landing-page .card-container')
                .locator(`.card-instance h2:has-text("Programmering og algoritmisk tenkning")`)
                .locator('xpath=ancestor::div[contains(@class, "card-instance")]');
            await unenrolledCardReadMore(page, cardInstances);
        });

        test('2.4.2 Enroll + Unenroll', async ({ page }, testInfo) => {
            const isFirefox =
                testInfo.project.name === 'firefox' || testInfo.project.name === 'canvas-firefox';
            if (isFirefox) test.skip(); // BUG: Works locally but not on CI, disable Firefox for now

            await loginWithBasicAuth(page, testInfo.project.name);
            await routeToFrontpage(page, true);

            let randomCardTitle: string = '';
            while (randomCardTitle === '') {
                const cardContainer = page.locator('#loggedInLandingPage .card-container');
                randomCardTitle = await randomCardTitleFromList(cardContainer);
                const reservedTitles = [
                    'Inkludering og universell utforming i digital praksis', // Reserved for 2.5 Invited Card
                    'Kunstig intelligens i skolen', // Reserved for 2.3 Enrolled Card
                    'Programmering og algoritmisk tenkning', // Reserved for 2.4.1 Read more
                ];

                if (reservedTitles.includes(randomCardTitle)) randomCardTitle = '';
            }

            expect(randomCardTitle).toBeTruthy();

            const cardInstance = page
                .locator('#loggedInLandingPage .card-container')
                .locator(`.card-instance .card-box-title h2:has-text("Trygt og godt skolemiljø")`)
                .locator('xpath=ancestor::div[contains(@class, "card-instance")]');
            const isAlreadyEnrolled = await cardInstance
                .locator('button:has-text("Gå til kompetansepakke")')
                .count();

            if (isAlreadyEnrolled >= 1) {
                await enrolledCard(page, cardInstance);
                await unenrolledCardEnroll(page, cardInstance, true);
            }

            await unenrolledCardEnroll(page, cardInstance);
        });
    });

    test('2.5 Invited Card', async ({ page }, testInfo) => {
        await loginWithBasicAuth(page, testInfo.project.name);
        await routeToFrontpage(page, true);

        const cardInstance = page
            .locator('.landing-page .card-container')
            .locator(
                `.card-instance .card-box-title h2:has-text("Inkludering og universell utforming i digital praksis")`,
            )
            .locator('xpath=ancestor::div[contains(@class, "card-instance")]');
        await invitedCard(cardInstance);
    });

    test.describe('2.6 Card list', async () => {
        test('2.6.1 New tag', async ({ page }, testInfo) => {
            await loginWithBasicAuth(page, testInfo.project.name);
            await routeToFrontpage(page, true);

            const cardContainer = page.locator('.landing-page--layout .card-container');
            await cardNewTag(cardContainer);
        });

        test('2.6.2 Filters', async ({ page }, testInfo) => {
            await loginWithBasicAuth(page, testInfo.project.name);
            await routeToFrontpage(page, true);

            const cardContainer = page.locator('.landing-page--layout .card-container');
            const cardCountTotal = await cardCount(cardContainer);

            await selectCardFilters(page, [
                'Videregående opplæring',
                'Arbeid med rammeplan og læreplan',
            ]);
            const cardCountFilteredTotal = await cardCount(cardContainer);
            expect(cardCountFilteredTotal).toBeLessThanOrEqual(cardCountTotal);
            await cardRequiredTags(cardContainer, [
                'Videregående opplæring',
                'Arbeid med rammeplan og læreplan',
            ]);

            await selectCardFilters(page, [
                'Videregående opplæring',
                'Arbeid med rammeplan og læreplan',

                'PPT',
                'Arbeid med regelverk',
            ]);
            const cardCountNoResultTotal = await cardCount(cardContainer);
            expect(cardCountNoResultTotal).toBe(0);

            await resetCardFilters(page);
            const cardCountResetTotal = await cardCount(cardContainer);
            expect(cardCountResetTotal).toBe(cardCountTotal);
        });
    });
});
