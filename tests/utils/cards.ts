import { expect, Locator, Page } from '@playwright/test';

import { loginPopupBasicAuth, modalClose, loginPopupFeideAuth } from '@/tests/utils/shared';

export const cardNewTag = async (cardContainer: Locator) => {
    const newTag = cardContainer.locator('.new-flag-text:has-text("Ny")');
    await newTag.first().waitFor({ state: 'visible' });
};

export const cardLoginPopup = async (page: Page, cardElement: Locator, authType: string) => {
    const enrollButton = cardElement.locator('button.btn:has-text("Meld deg på")');
    const modalPopup = cardElement.locator('.modal-box');

    await enrollButton.waitFor({ state: 'visible' });
    await enrollButton.click();
    await modalClose(modalPopup);

    await enrollButton.click();
    if (authType === 'feide') {
        await loginPopupFeideAuth(page, modalPopup);
    } else {
        await loginPopupBasicAuth(page, modalPopup);
    }
};

export const cardReadMore = async (page: Page, cardElement: Locator, authType: string) => {
    const readMoreButton = cardElement.locator('button.btn:has-text("Les mer")');
    const modalPopup = page.locator('.modal-box');

    await readMoreButton.click();
    await modalClose(modalPopup);

    await readMoreButton.click();
    await modalPopup.waitFor({ state: 'visible' });
    await modalPopup.locator('.modules-list ul li').first().waitFor({ state: 'visible' });
    const itemCount = await modalPopup.locator('.modules-list ul li').count();
    expect(itemCount).toBeGreaterThan(0);

    await cardLoginPopup(page, modalPopup, authType);
};

export const cardReadMorePreview = async (page: Page, cardElement: Locator) => {
    const readMoreButton = cardElement.locator('button.btn:has-text("Les mer")');
    const modalPopup = page.locator('.modal-box');

    const urlPattern =
        /https?:\/\/.*\.instructure\.com\/search\/all_courses\?(?:[^&]*&)*course_preview_id=\d+(?:&|$)/;

    await readMoreButton.click();
    await modalPopup.waitFor({ state: 'visible' });
    expect(page.url()).toMatch(urlPattern);

    await page.reload();
    await modalPopup.waitFor({ state: 'visible' });
    expect(page.url()).toMatch(urlPattern);

    await modalClose(modalPopup);
    await modalPopup.waitFor({ state: 'hidden' });
    expect(page.url()).not.toMatch(urlPattern);
};

export const cardCount = async (cardContainer: Locator) => {
    const cardsCount = await cardContainer.locator('.card-instance').count();
    return cardsCount;
};

export const randomCardTitleFromList = async (cardContainer: Locator) => {
    const cardsCount = await cardCount(cardContainer);
    expect(cardsCount).toBeGreaterThan(0);
    const randomCardIndex = Math.floor(Math.random() * cardsCount);
    const randomCard = cardContainer.locator('.card-instance').nth(randomCardIndex);

    return (await randomCard.locator('.card-box-title h2').textContent()) ?? '';
};

export const selectCardFilters = async (page: Page, filters: string[]) => {
    for (const filterItem of filters) {
        await page.locator('.filter-container ul li label').filter({ hasText: filterItem }).click();
    }
};

export const resetCardFilters = async (page: Page) => {
    await page.locator('.filter-container button:has-text("Tilbakestill filter")').click();
};

export const enrolledCard = async (page: Page, cardInstances: Locator) => {
    const cardCountTotal = await cardInstances.count();
    expect(cardCountTotal).toBeGreaterThan(0);

    const randomNumber = cardCountTotal > 1 ? Math.floor(Math.random() * cardCountTotal) : 0;
    const randomCard = cardInstances.nth(randomNumber);

    await randomCard.locator('.circular-progress-bar').waitFor({ state: 'visible' });
    await randomCard.locator('button.btn:has-text("Gå til kompetansepakke")').click();

    await page
        .locator('.course-page__banner__actions button:has-text("Meld deg av")')
        .waitFor({ state: 'visible' });
    expect(page.url()).toContain('/courses/');
};

export const unenrolledCardEnroll = async (
    page: Page,
    cardInstance: Locator,
    alreadyEnrolled: boolean = false,
) => {
    if (!alreadyEnrolled) {
        await cardInstance.locator('button.btn:has-text("Meld deg på")').click();
        const registerButton = page.locator(
            '.ic-Self-enrollment-footer button:has-text("Registrere deg i emnet")',
        );
        await page.waitForLoadState('networkidle');
        await registerButton.waitFor({ state: 'visible' });
        expect(page.url()).toContain('/enroll/');

        const goToCourseButton = page.locator(
            '.ic-Self-enrollment-footer a:has-text("Gå til emnet")',
        );
        await registerButton.click();
        await goToCourseButton.waitFor({ state: 'visible' });
        await goToCourseButton.click();
    }

    const unenrollButton = page.locator('#actions_self_unenrollment:has-text("Meld deg av")');
    await unenrollButton.waitFor({ state: 'visible' });
    expect(page.url()).toContain('/courses/');
    await unenrollButton.click();

    await page.waitForTimeout(5_000);

    const modalPopup = page.locator('.modal-box');
    modalClose(modalPopup);

    await page.waitForTimeout(5_000);

    const confirmUnenrollmentButton = modalPopup.locator('button:has-text("Meld deg av emnet")');
    await unenrollButton.click();
    await modalPopup.waitFor({ state: 'visible' });
    await confirmUnenrollmentButton.click();

    await page.waitForTimeout(5_000);

    await page
        .locator('h1:has-text("Alle tilgjengelige kompetansepakker")')
        .waitFor({ state: 'visible', timeout: 30_000 });
    expect(page.url()).toContain('/search/all_courses');
};

export const unenrolledCardReadMore = async (page: Page, cardInstances: Locator) => {
    const cardCountTotal = await cardInstances.count();
    expect(cardCountTotal).toBeGreaterThan(0);

    const randomNumber = cardCountTotal > 1 ? Math.floor(Math.random() * cardCountTotal) : 0;
    const randomCard = cardInstances.nth(randomNumber);

    const readMoreButton = randomCard.locator('button.btn:has-text("Les mer")');
    const modalPopup = page.locator('.modal-box');
    await readMoreButton.click();
    await modalClose(modalPopup);

    await readMoreButton.click();
    await modalPopup.waitFor({ state: 'visible' });
    await modalPopup.locator('.modules-list ul li').first().waitFor({ state: 'visible' });
    const itemCount = await modalPopup.locator('.modules-list ul li').count();
    expect(itemCount).toBeGreaterThan(0);

    const enrollButton = modalPopup.locator('button.btn:has-text("Meld deg på")');
    await enrollButton.click();
    await page.locator('button:has-text("Registrere deg i emnet")').waitFor({ state: 'visible' });
    expect(page.url()).toContain('/enroll/');
};

export const invitedCard = async (cardInstances: Locator) => {
    const cardCountTotal = await cardInstances.count();
    expect(cardCountTotal).toBeGreaterThan(0);

    const randomNumber = cardCountTotal > 1 ? Math.floor(Math.random() * cardCountTotal) : 0;
    const randomCard = cardInstances.nth(randomNumber);

    await randomCard
        .locator('button.btn:has-text("Gå til kompetansepakke")')
        .waitFor({ state: 'hidden' });
    await randomCard.locator('button.btn:has-text("Meld deg på")').waitFor({ state: 'hidden' });
    await randomCard.locator('button.btn:has-text("Les mer")').waitFor({ state: 'hidden' });
};

export const cardRequiredTags = async (cardContainer: Locator, requiredTags: string[]) => {
    const cardInstances = await cardContainer.locator('.card-instance').all();
    expect(cardInstances.length).toBeGreaterThan(0);

    await Promise.all(
        cardInstances.map(async card => {
            const tagList = card.locator('.card-content-tags li');
            const tags = await tagList.allInnerTexts();
            requiredTags.forEach(requiredTag => {
                expect(tags).toContain(requiredTag);
            });
        }),
    );
};
