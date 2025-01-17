import { Page } from '@playwright/test';

import { getCanvasBaseUrl } from '@/tests/utils/shared';

export const routeToFrontpage = async (page: Page, loggedIn: boolean) => {
    const canvasBaseUrl = getCanvasBaseUrl();

    await page.goto(`${canvasBaseUrl}/search/all_courses?design=udir`);
    await page
        .locator(
            !loggedIn
                ? '#notLoggedInPage h1:has-text("Velkommen til Utdanningsdirektoratets kompetanseportal!")'
                : '#loggedInLandingPage h1:has-text("Alle tilgjengelige kompetansepakker")',
        )
        .waitFor({ state: 'visible' });
};

export const routeToMyCourses = async (page: Page) => {
    const canvasBaseUrl = getCanvasBaseUrl();
    await page.goto(`${canvasBaseUrl}/courses`);
    await page.locator('h1:has-text("Mine kompetansepakker")').waitFor({ state: 'visible' });
};

export const routeToTestCourse = async (page: Page) => {
    const canvasBaseUrl = getCanvasBaseUrl();
    await page.goto(`${canvasBaseUrl}/courses/851?lang=nb`);
    await page
        .locator('.course-page__banner h1:has-text("Test kompetansepakke")')
        .waitFor({ state: 'visible' });
};

export const routeToBasicAuth = async (page: Page) => {
    const canvasBaseUrl = getCanvasBaseUrl();
    await page.goto(`${canvasBaseUrl}/login/canvas?normalLogin=1`);
    await page.locator('#login_form').waitFor({ state: 'visible' });
};
