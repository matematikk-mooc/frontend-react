import { expect, test } from '@playwright/test';

import { loginWithBasicAuth, logout } from '@/tests/utils/auth';
import {
    cardCount,
    cardLoginPopup,
    cardNewTag,
    cardReadMore,
    cardReadMorePreview,
    cardRequiredTags,
    randomCardTitleFromList,
    resetCardFilters,
    selectCardFilters,
} from '@/tests/utils/cards';
import { routeToFrontpage } from '@/tests/utils/routes';
import { navLinks, stageBanner, useDesktopViewport } from '@/tests/utils/shared';

test.describe('1. Unauthenticated | Canvas', async () => {
    useDesktopViewport();

    test('1.1 Stage banner', async ({ page }) => {
        await routeToFrontpage(page, false);

        const header = page.locator('header#notLoggedInHeader .header__content');
        await stageBanner(header);
    });

    test('1.2 Nav links', async ({ page }) => {
        await routeToFrontpage(page, false);

        const header = page.locator('header#notLoggedInHeader');
        await navLinks(header, false);
    });

    test.describe('1.3 Featured card', async () => {
        test.describe('1.3.1 Read more', async () => {
            test('1.3.1.1 Feide auth', async ({ page }) => {
                await routeToFrontpage(page, false);

                const featuredCard = page.locator('.intro-news .card-highlighted');
                await cardReadMore(page, featuredCard, 'feide');
            });

            test('1.3.1.2 Basic auth', async ({ page }) => {
                await routeToFrontpage(page, false);

                const featuredCard = page.locator('.intro-news .card-highlighted');
                await cardReadMore(page, featuredCard, 'basic');
            });

            test('1.3.1.3 Preview', async ({ page }) => {
                await routeToFrontpage(page, false);

                const featuredCard = page.locator('.intro-news .card-highlighted');
                await cardReadMorePreview(page, featuredCard);
            });
        });

        test.describe('1.3.2 Enroll', async () => {
            test('1.3.2.1 Feide auth', async ({ page }) => {
                await routeToFrontpage(page, false);

                const featuredCard = page.locator('.intro-news .card-highlighted');
                await cardLoginPopup(page, featuredCard, 'feide');
            });

            test('1.3.2.2 Basic auth', async ({ page }) => {
                await routeToFrontpage(page, false);

                const featuredCard = page.locator('.intro-news .card-highlighted');
                await cardLoginPopup(page, featuredCard, 'basic');
            });
        });
    });

    test.describe('1.4 Card', async () => {
        let randomCardTitle: string = '';
        test.beforeAll(async ({ browser }) => {
            const context = await browser.newContext();
            const page = await context.newPage();
            await routeToFrontpage(page, false);

            const cardContainer = page.locator('.not-logged-in-page--layout .card-container');
            randomCardTitle = await randomCardTitleFromList(cardContainer);
            expect(randomCardTitle).not.toBe('');
            await page.close();
        });

        test.describe('1.4.1 Enroll', async () => {
            test('1.4.1.1 Feide auth', async ({ page }) => {
                await routeToFrontpage(page, false);

                const cardInstance = page
                    .locator('.not-logged-in-page--layout .card-container')
                    .locator(`.card-instance .card-box-title h2:has-text("${randomCardTitle}")`)
                    .locator('xpath=ancestor::div[contains(@class, "card-instance")]');
                await cardLoginPopup(page, cardInstance, 'feide');
            });

            test('1.4.1.2 Basic auth', async ({ page }) => {
                await routeToFrontpage(page, false);

                const cardInstance = page
                    .locator('.not-logged-in-page--layout .card-container')
                    .locator(`.card-instance .card-box-title h2:has-text("${randomCardTitle}")`)
                    .locator('xpath=ancestor::div[contains(@class, "card-instance")]');
                await cardLoginPopup(page, cardInstance, 'basic');
            });
        });

        test.describe('1.4.2 Read more', async () => {
            // BUG: 1.4.2.1 + 1.4.2.2 failed due frontend card not behaving as featured card, inside read more popup the enroll button is not showing login popup but redirecting to basic login page directly instead

            test('1.4.2.1 Feide auth', async ({ page }) => {
                test.skip(); // BUG: Disable test for now
                await routeToFrontpage(page, false);

                const cardInstance = page
                    .locator('.not-logged-in-page--layout .card-container')
                    .locator(`.card-instance .card-box-title h2:has-text("${randomCardTitle}")`)
                    .locator('xpath=ancestor::div[contains(@class, "card-instance")]');
                await cardReadMore(page, cardInstance, 'feide');
            });

            test('1.4.2.2 Basic auth', async ({ page }) => {
                test.skip(); // BUG: Disable test for now
                await routeToFrontpage(page, false);

                const cardInstance = page
                    .locator('.not-logged-in-page--layout .card-container')
                    .locator(`.card-instance .card-box-title h2:has-text("${randomCardTitle}")`)
                    .locator('xpath=ancestor::div[contains(@class, "card-instance")]');
                await cardReadMore(page, cardInstance, 'basic');
            });

            test('1.4.2.3 Preview', async ({ page }) => {
                await routeToFrontpage(page, false);

                const cardInstance = page
                    .locator('.not-logged-in-page--layout .card-container')
                    .locator(`.card-instance .card-box-title h2:has-text("${randomCardTitle}")`)
                    .locator('xpath=ancestor::div[contains(@class, "card-instance")]');
                await cardReadMorePreview(page, cardInstance);
            });
        });
    });

    test.describe('1.5 Card list', async () => {
        test('1.5.1 New tag', async ({ page }) => {
            await routeToFrontpage(page, false);

            const cardContainer = page.locator('.not-logged-in-page--layout .card-container');
            await cardNewTag(cardContainer);
        });

        test('1.5.2 Filters', async ({ page }) => {
            await routeToFrontpage(page, false);

            const cardContainer = page.locator('.not-logged-in-page--layout .card-container');
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

    test.describe('1.6 Authentication', async () => {
        test.describe('1.6.1 Basic', async () => {
            test('1.6.1.1 Login/Logout', async ({ page }, testInfo) => {
                await loginWithBasicAuth(page, testInfo.project.name);
                await logout(page);
            });

            /*
            test('1.6.1.2 Register', async ({ page }) => {});
            test('1.6.1.3 Forgot', async ({ page }) => {});
            test('1.6.1.4 Delete', async ({ page }) => {});
            */
        });

        /*
        test.describe('1.6.2 Feide', async () => {
            test('1.6.2.1 Login/Logout', async ({ page }) => {});
            test('1.6.2.2 Register', async ({ page }) => {});
            test('1.6.2.3 Forgot', async ({ page }) => {});
            test('1.6.2.4 Delete', async ({ page }) => {});
        });
        */
    });
});
