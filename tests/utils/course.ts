import { expect, FrameLocator, Locator, Page } from '@playwright/test';

import { getEnv, iframeHeadingElement } from '@/tests/utils/shared';

export const announcements = async (page: Page) => {
    const leftSideContainer = page.locator('#left-side #coursepage-left-side-view');
    const announcementsLink = leftSideContainer.locator('a.course-page-announcements-link');
    const announcementsTitle = announcementsLink.locator(
        'h3.course-page-announcements-title span:has-text("Kunngjøringer")',
    );

    await announcementsLink.waitFor({ state: 'visible' });
    await announcementsTitle.waitFor({ state: 'visible' });
    await announcementsLink.click();

    const announcementsContainer = page.locator('#content-wrapper #content');
    const announcementsContentLink = announcementsContainer.locator(
        'a.ic-item-row__content-link h3:has-text("Test kunngjøring")',
    );
    await announcementsContainer.waitFor({ state: 'visible' });
    expect(page.url()).toContain('/announcements');
    await announcementsContentLink.click();

    await page
        .locator(
            'span[data-testid="message_title"] span[aria-hidden="true"]:has-text("Test kunngjøring")',
        )
        .waitFor({
            state: 'visible',
        });
    expect(page.url()).toContain('/discussion_topics/');
};

export const modules = async (page: Page) => {
    const leftSideContainer = page.locator('#left-side #coursepage-left-side-view');
    const modulesContainer = leftSideContainer.locator(
        '.course-modules-container-with-progression',
    );
    const progressTitle = modulesContainer.locator('h5:has-text("Progresjon")');

    await modulesContainer.waitFor({ state: 'visible' });
    await progressTitle.waitFor({ state: 'visible' });

    const moduleToggle = leftSideContainer
        .locator('.module-package__title h4 span.title:has-text("1. Innhold")')
        .first();
    const moduleContent = moduleToggle
        .locator('xpath=ancestor::div[contains(@class, "courses__treeview__item")]')
        .locator('.module-package__child-nodes');

    await moduleContent.waitFor({ state: 'hidden' });
    await moduleToggle.click();
    await moduleContent.waitFor({ state: 'visible' });
};

export const openModuleItem = async (page: Page, moduleName: string, moduleItemName: string) => {
    const leftSideContainer = page.locator('#left-side #coursepage-left-side-view');
    const moduleToggle = leftSideContainer.locator(
        `.module-package__title h4 span.title:has-text("${moduleName}")`,
    );
    const moduleContent = moduleToggle
        .locator('xpath=ancestor::div[contains(@class, "courses__treeview__item")]')
        .locator('.module-package__child-nodes');

    const isContentVisable = await moduleContent.isVisible();
    if (!isContentVisable) {
        await moduleToggle.click();
        await moduleContent.waitFor({ state: 'visible' });
    }

    const moduleContentItem = moduleContent.locator(
        `.tree-node__label__text a:has-text("${moduleItemName}")`,
    );
    await moduleContentItem.click();

    const pageTitle = page.locator(`h1.page-title:has-text("${moduleItemName}")`);
    await pageTitle.waitFor({ state: 'visible', timeout: 30_000 });
};

export const revealToggle = async (page: Page) => {
    const revealContainer = page.locator('.custom-reveal-wrapper').first();
    const revealToggleButton = revealContainer.locator('a.custom-reveal-button');
    const revealContent = revealContainer.locator('.custom-reveal-content');
    await revealContainer.waitFor({ state: 'visible' });
    await revealToggleButton.waitFor({ state: 'visible' });

    await revealContent.waitFor({ state: 'hidden' });
    await revealToggleButton.click();
    await revealContent.waitFor({ state: 'visible' });
    await revealToggleButton.click();
    await revealContent.waitFor({ state: 'hidden' });
};

export const revealAccordion = async (page: Page) => {
    const revealContainer = page.locator('.custom-accordions').first();
    const revealAccordionButton = revealContainer.locator('button.custom-accordion').first();
    const revealContent = revealContainer.locator('.custom-accordion-panel').first();
    await revealContainer.waitFor({ state: 'visible' });
    await revealAccordionButton.waitFor({ state: 'visible' });

    await revealContent.waitFor({ state: 'hidden' });
    await revealAccordionButton.click();
    await revealContent.waitFor({ state: 'visible' });
    await revealAccordionButton.click();
    await revealContent.waitFor({ state: 'hidden' });
};

export const revealTabs = async (page: Page) => {
    const revealContainer = page.locator('.custom-segments').first();
    const revealFirstTabButton = revealContainer.locator('.custom-segments__segment a').nth(0);
    const revealFirstContent = revealContainer.locator('.custom-segments__pane').nth(0);
    const revealSecondTabButton = revealContainer.locator('.custom-segments__segment a').nth(1);
    const revealSecondContent = revealContainer.locator('.custom-segments__pane').nth(1);
    await revealContainer.waitFor({ state: 'visible' });
    await revealFirstTabButton.waitFor({ state: 'visible' });
    await revealSecondTabButton.waitFor({ state: 'visible' });

    await revealFirstContent.waitFor({ state: 'visible' });
    await revealSecondContent.waitFor({ state: 'hidden' });

    await revealSecondTabButton.click();
    await revealFirstContent.waitFor({ state: 'hidden' });
    await revealSecondContent.waitFor({ state: 'visible' });

    await revealFirstTabButton.click();
    await revealFirstContent.waitFor({ state: 'visible' });
    await revealSecondContent.waitFor({ state: 'hidden' });
};

export const vimeoTranscripts = async (revealContainer: Locator, languages: string[]) => {
    const revealToggleButton = revealContainer.locator('a.custom-reveal-button');
    const revealContent = revealContainer.locator('.custom-reveal-content').first();
    await revealContainer.waitFor({ state: 'visible' });
    await revealToggleButton.waitFor({ state: 'visible' });

    await revealContent.waitFor({ state: 'hidden' });
    await revealToggleButton.click(); // NOTE: Click does not work on the first time sometimes when running in CI
    const isRevealContentVisible = await revealContent.isVisible();
    if (!isRevealContentVisible) {
        await revealToggleButton.click();
    }
    await revealContent.waitFor({ state: 'visible' });

    const languagesHasLength = languages.length > 0;
    if (!languagesHasLength) {
        await revealContent
            .locator(
                'p:has-text("Videotranskript er dessverre ikke tilgjengelig for denne videoen.")',
            )
            .waitFor({ state: 'visible' });
    } else {
        const selectLanguage = await revealContainer
            .locator('select.custom-reveal-button option')
            .allTextContents();
        expect(selectLanguage.sort()).toEqual(languages.sort());
    }

    await revealToggleButton.click();
    await revealContent.waitFor({ state: 'hidden' });
};

export const hint = async (page: Page) => {
    const contentContainer = page.locator('#content');
    const hintButton = contentContainer.locator('span.tooltip').first();
    const hintContent = hintButton.locator('.tooltiptext-box').first();
    await hintButton.waitFor({ state: 'visible' });

    await hintContent.waitFor({ state: 'hidden' });
    await hintButton.hover();
    await hintContent.waitFor({ state: 'visible' });
    await page.mouse.move(0, 0);
    await hintContent.waitFor({ state: 'hidden' });
};

export const multilingual = async (page: Page) => {
    const languageContainer = page.locator('.course-page__banner__actions .dropdown');
    const languageButton = languageContainer.locator('button.btn--dropdown').first();
    const languageDropdown = languageContainer.locator('.dropdown__content').first();
    await languageButton.waitFor({ state: 'visible' });

    await languageDropdown.waitFor({ state: 'hidden' });
    await languageButton.click();
    await languageDropdown.waitFor({ state: 'visible' });
    await languageButton.click();
    await languageDropdown.waitFor({ state: 'hidden' });

    const selectNn = languageDropdown.locator('.dropdown__item:has-text("Nynorsk")');
    const selectSe = languageDropdown.locator('.dropdown__item:has-text("Sápmi")');
    const selectNb = languageDropdown.locator('.dropdown__item:has-text("Bokmål")');

    await languageButton.click();
    await selectNn.click();
    await page
        .locator('h1.page-title span[lang="nn"].language:has-text("1.9 Flerspråklig på NN")')
        .waitFor({ state: 'visible' });
    await page
        .locator('.udir-info__content-container h4:has-text("Modular:")')
        .waitFor({ state: 'visible' });
    expect(page.url()).toContain('lang=nn');

    await languageButton.click();
    await selectSe.click();
    await page
        .locator('h1.page-title span[lang="se"].language:has-text("1.9 Flerspråklig på SE")')
        .waitFor({ state: 'visible' });
    await page
        .locator('.udir-info__content-container h4:has-text("Modula:")')
        .waitFor({ state: 'visible' });
    expect(page.url()).toContain('lang=se');

    await languageButton.click();
    await selectNb.click();
    await page
        .locator('h1.page-title span[lang="nb"].language:has-text("1.9 Flerspråklig")')
        .waitFor({ state: 'visible' });
    await page
        .locator('.udir-info__content-container h4:has-text("Moduler:")')
        .waitFor({ state: 'visible' });
    expect(page.url()).toContain('lang=nb');
};

export const getLtiModuleName = () => {
    const env = getEnv();
    if (env === 'production') return '3. LTI (production)';
    return '2. LTI (stage)';
};

export const getLtiModuleIndex = () => {
    const env = getEnv();
    if (env === 'production') return 3;
    return 2;
};

export const isLeaderContentVisible = async (page: Page) => {
    const leftSideContainer = page.locator('#left-side #coursepage-left-side-view');
    const moduleToggle = leftSideContainer.locator(
        `.module-package__title h4 span.title:has-text("1. Innhold")`,
    );
    const moduleContent = moduleToggle
        .locator('xpath=ancestor::div[contains(@class, "courses__treeview__item")]')
        .locator('.module-package__child-nodes');

    const isContentVisable = await moduleContent.isVisible();
    if (!isContentVisable) {
        await moduleToggle.click();
        await moduleContent.waitFor({ state: 'visible' });
    }

    return moduleContent
        .locator(`.tree-node__label__text a:has-text("1.10 Lederstøtte")`)
        .isVisible();
};

export const roleAndGroups = async (
    page: Page,
    iframeElement: FrameLocator,
    leaderRole: boolean,
    faculty: string,
    state: string,
    county: string,
    institution: string,
) => {
    const iframeElementScroll = page.locator('iframe[title="KPAS"]');
    await iframeHeadingElement(iframeElement, 'h2', '1. Velg rolle');
    await iframeElementScroll.scrollIntoViewIfNeeded();

    const roleRadio = iframeElement.locator(
        `.group-role-selector input[type="radio"]${leaderRole ? '#radioSkoleleder' : '#deltager'}`,
    );
    await roleRadio.check();

    const facultyMathUpper = iframeElement.locator(`.faculty-selector input[value="${faculty}"]`);
    await facultyMathUpper.check();

    const stateSelect = iframeElement.locator('.select-county .vs__dropdown-toggle');
    const stateOptions = iframeElement.locator('.select-county ul.vs__dropdown-menu');
    const stateOption = stateOptions.locator(`li.vs__dropdown-option:has-text("${state}")`);
    await stateSelect.scrollIntoViewIfNeeded();
    await stateSelect.click();
    await stateOptions.scrollIntoViewIfNeeded();
    await stateOptions.waitFor({ state: 'visible' });
    await stateOption.click();

    const countySelect = iframeElement.locator('.select-community .vs__dropdown-toggle');
    const countyOptions = iframeElement.locator('.select-community ul.vs__dropdown-menu');
    const countyOption = countyOptions.locator(`li.vs__dropdown-option:has-text("${county}")`);
    await countySelect.scrollIntoViewIfNeeded();
    await countySelect.click();
    await countyOptions.scrollIntoViewIfNeeded();
    await countyOptions.waitFor({ state: 'visible' });
    await countyOption.click();

    const institutionSelect = iframeElement.locator('.select-school .vs__dropdown-toggle');
    const institutionOptions = iframeElement.locator('.select-school ul.vs__dropdown-menu');
    const institutionOption = institutionOptions.locator(
        `li.vs__dropdown-option:has-text("${institution}")`,
    );
    await institutionSelect.scrollIntoViewIfNeeded();
    await institutionSelect.click();
    await institutionOptions.waitFor({ state: 'visible' });
    await institutionOptions.scrollIntoViewIfNeeded();
    await institutionOption.click();

    const submitButton = iframeElement.locator('.update-button button.btn');
    const successMessage = iframeElement.locator(
        '.update-button .message--success span:has-text("Oppdateringen var vellykket!")',
    );
    await submitButton.click();
    await successMessage.waitFor({ state: 'visible', timeout: 60_000 });

    await page.reload();
    await iframeHeadingElement(iframeElement, 'h2', '1. Velg rolle');
    await iframeElementScroll.scrollIntoViewIfNeeded();

    const isRoleChecked = await roleRadio.isChecked();
    const selectedFaculty = await facultyMathUpper.isChecked();
    expect(isRoleChecked).toBe(true);
    expect(selectedFaculty).toBe(true);
    await iframeElement
        .locator(`.select-county .vs__selected:has-text("${state}")`)
        .waitFor({ state: 'visible' });
    await iframeElement
        .locator(`.select-community .vs__selected:has-text("${county}")`)
        .waitFor({ state: 'visible' });
    await iframeElement
        .locator(`.select-school .vs__selected:has-text("${institution}")`)
        .waitFor({ state: 'visible' });

    const leaderContentIsVisible = await isLeaderContentVisible(page);
    expect(leaderContentIsVisible).toBe(leaderRole);
};

export const survey = async (iframeElement: FrameLocator) => {
    const appContainer = iframeElement.locator('#app');
    await appContainer.waitFor({ state: 'visible' });

    const surveyForm = appContainer.locator('form.survey-form');
    const surveyFormIsVisible = await appContainer.locator('form.survey-form').isVisible();
    if (!surveyFormIsVisible) {
        await iframeHeadingElement(iframeElement, 'h2', 'Takk for din tilbakemelding!');
        const resetButton = iframeElement.locator('button.btn:has-text("Fjern svar")');
        await resetButton.click();
    }
    await surveyForm.waitFor({ state: 'visible' });

    const firstQuestion = iframeElement.locator('.survey-form > .survey-question').nth(0);
    const firstRadio = firstQuestion.locator('input[type="radio"][value="likert_scale_5pt_1"]');
    await firstRadio.click();

    const secondQuestion = iframeElement.locator('.survey-form > .survey-question').nth(1);
    const secondRadio = secondQuestion.locator('input[type="radio"][value="likert_scale_5pt_2"]');
    await secondRadio.click();

    const thirdQuestion = iframeElement.locator('.survey-form > .survey-question').nth(2);
    const thirdRadio = thirdQuestion.locator('input[type="radio"][value="likert_scale_5pt_3"]');
    await thirdRadio.click();

    const fourthQuestion = iframeElement.locator('.survey-form > .survey-question').nth(3);
    const fourthText = fourthQuestion.locator('input[type="radio"][value="likert_scale_5pt_4"]');
    await fourthText.click();

    const commentQuestion = iframeElement.locator('.survey-form > .survey-question').nth(4);
    const commentText = commentQuestion.locator('textarea.form-control');
    await commentText.fill('Test');

    const submitButton = iframeElement.locator('.survey-form button.btn:has-text("Send inn")');
    await submitButton.click();

    await iframeHeadingElement(iframeElement, 'h2', 'Takk for din tilbakemelding!');
};

export const diploma = async (page: Page, iframeElement: FrameLocator) => {
    const appContainer = iframeElement.locator('#app');
    await appContainer.waitFor({ state: 'visible', timeout: 30_000 });

    const diplomaBorder = appContainer.locator('.diplomaBorder');
    const diplomaBorderIsVisible = await diplomaBorder.isVisible();
    if (diplomaBorderIsVisible) {
        await openModuleItem(page, '1. Innhold', '1.1 Infobokser');
        await page.locator('button.custom-mark-as-done-checkbox').waitFor({ state: 'visible' });
        await page.locator('button#mark-as-done-checkbox').click();
        await page.locator('button[completed="false"]').waitFor({ state: 'visible' });

        await openModuleItem(page, getLtiModuleName(), `${getLtiModuleIndex()}.3 Diplom`);
    }

    await iframeHeadingElement(iframeElement, 'h2', 'Diplomstatus: Ikke fullført');
    await iframeElement
        .locator('.item-checkmark span:has-text("X")')
        .first()
        .waitFor({ state: 'visible' });

    await openModuleItem(page, '1. Innhold', '1.1 Infobokser');
    await page.locator('button.custom-mark-as-done-checkbox').waitFor({ state: 'visible' });
    await page.locator('button#mark-as-done-checkbox').click();
    await page.locator('button[completed="true"]').waitFor({ state: 'visible' });

    await openModuleItem(page, getLtiModuleName(), `${getLtiModuleIndex()}.3 Diplom`);
    await diplomaBorder.waitFor({ state: 'visible', timeout: 30_000 });
};
