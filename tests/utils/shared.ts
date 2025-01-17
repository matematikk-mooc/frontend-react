import { test, Page, Locator, expect, FrameLocator } from '@playwright/test';

export const useDesktopViewport = () => {
    test.use({
        viewport: {
            height: 1080,
            width: 1920,
        },
    });
};

export const getEnv = () => {
    let env = process.env.APP_ENV ?? 'development';
    expect(env).toBeDefined();

    const validEnvironments = ['stage', 'production'];
    if (env === 'development') env = 'stage';
    expect(validEnvironments).toContain(env);

    return env;
};

export const getAppVersion = () => {
    const version = process.env.APP_VERSION;
    expect(version).toBeDefined();

    return version;
};

export const getCanvasBaseUrl = () => {
    return getEnv() === 'stage'
        ? 'https://bibsys.test.instructure.com'
        : 'https://bibsys.instructure.com';
};

export const rgbToHex = (rgb: string) => {
    const result = rgb.match(/\d+/g)?.map(Number);
    return `#${result?.map(x => x.toString(16).padStart(2, '0')).join('')}`;
};

export const checkElementsWithText = async (parentLocator: Locator, expectedTexts: string[]) => {
    const elements = await parentLocator.all();
    for (const expectedText of expectedTexts) {
        const matchingElements = await Promise.all(
            elements.map(async element => {
                const text = await element.textContent();
                return text?.trim() === expectedText ? element : null;
            }),
        );
        const matchingElement = matchingElements.find(item => item !== null) as Locator;

        expect(matchingElement, `Element with text "${expectedText}" was not found`).toBeTruthy();
        await expect(matchingElement).toBeVisible();
    }
};

export const stageBanner = async (header: Locator) => {
    const env = getEnv();
    await header.waitFor({ state: 'visible' });

    const hasStageClass = await header.evaluate(element => {
        return element.classList.contains('stage');
    });
    const hasStageBanner = await header.locator('.stage-banner:has-text("stage")').isVisible();
    const bgColor = await header.evaluate(element => getComputedStyle(element).backgroundColor);

    expect(hasStageClass).toBe(env === 'stage');
    expect(hasStageBanner).toBe(env === 'stage');
    expect(rgbToHex(bgColor)).toBe(env === 'stage' ? '#bed5e8' : '#ffffff');
};

export const navLinks = async (header: Locator, isLoggedIn: boolean) => {
    const links = header.locator('.header__link-list > .header__list-item a.header__link');
    const subNavBar = header.locator('.nav-bar-container');

    if (!isLoggedIn) {
        await expect(links).toHaveCount(1);
        const linkText = await links.first().textContent();
        expect(linkText).toContain('Logg inn');

        await expect(subNavBar).not.toBeVisible();
    } else {
        const linkCount = await links.count();
        expect(linkCount).toBeGreaterThanOrEqual(2);

        const expectedTitles = ['Innstillinger', 'Logg ut'];
        await checkElementsWithText(links, expectedTitles);

        await expect(subNavBar).toBeVisible();
        const subLinks = subNavBar.locator('.nav-bar__link');
        const subLinkCount = await subLinks.count();
        expect(subLinkCount).toEqual(2);

        const expectedSubTitles = ['Mine kompetansepakker', 'Alle tilgjengelige kompetansepakker'];
        await checkElementsWithText(subLinks, expectedSubTitles);
    }
};

export const modalClose = async (modalElement: Locator) => {
    await modalElement.waitFor({ state: 'visible' });

    const closeButton = modalElement.locator('button.icon-button');

    await closeButton.click();
    await modalElement.waitFor({ state: 'hidden' });
};

export const loginPopupFeideAuth = async (page: Page, loginPopupElement: Locator) => {
    await loginPopupElement.waitFor({ state: 'visible' });
    const loginWithFeideButton = loginPopupElement.locator(
        'button.btn:has-text("LOGG INN MED FEIDE")',
    );
    await loginWithFeideButton.click();

    await page.locator('#wrapper h1:has-text("Log in with Feide")').waitFor({ state: 'visible' });
    expect(page.url()).toContain('https://idp.feide.no/simplesaml/module.php/feide/selectorg');

    await page.waitForTimeout(10_000); // NOTE: Issue with feide login popup not loading properly, can be recreated with 3G network and click on input field when it loads in and no popup is shown
    const orgSelector = page.locator('#wrapper input#org_selector_filter');
    await orgSelector.click();

    await page.locator('#wrapper #orglist_wrapper ul#orglist').waitFor({ state: 'visible' });
    const selectAgderKommune = page.locator('#wrapper ul#orglist li[org_id="agderfk.no"]');
    await selectAgderKommune.click();

    const continueButton = page.locator('#wrapper button:has-text("Continue")');
    await continueButton.click();
    await page.locator('#wrapper input#microsoft-signin-button').waitFor({ state: 'visible' });
};

export const loginPopupBasicAuth = async (page: Page, loginPopupElement: Locator) => {
    await loginPopupElement.waitFor({ state: 'visible' });
    const loginWithBasicButton = loginPopupElement.locator(
        'button.btn:has-text("LOGG INN UTEN FEIDE")',
    );
    await loginWithBasicButton.click();

    const enrollForm = page.locator('#content-wrapper #enroll_form');
    await enrollForm.waitFor({ state: 'visible' });
    expect(page.url()).toContain('.instructure.com/enroll/');

    const emailInput = enrollForm.locator('input#student_email');
    await emailInput.fill('test@email.com');

    const newUserRadio = enrollForm.locator('label[for="selfEnrollmentAuthRegCreate"]');
    const nameInput = enrollForm.locator('input#student_name');
    const agreeTermsCheckbox = enrollForm.locator(
        'label[for="selfEnrollmentAuthRegLoginAgreeTerms"]',
    );
    const registerButton = enrollForm.locator('button:has-text("Registrere deg i emnet")');

    await page.waitForLoadState('networkidle');
    await newUserRadio.click();
    await nameInput.fill('Test User');
    await agreeTermsCheckbox.click();
    await registerButton.waitFor({ state: 'visible' });

    const existingUserRadio = enrollForm.locator('label[for="selfEnrollmentAuthRegLogin"]');
    await existingUserRadio.click();
    await registerButton.waitFor({ state: 'visible' });

    const forgotPasswordLink = enrollForm.locator('button#selfEnrollmentForgotPassword');
    await forgotPasswordLink.waitFor({ state: 'visible' });
    await forgotPasswordLink.click();
    await page.locator('.ic-Login-footer').waitFor({ state: 'visible' });
    await page.waitForLoadState('networkidle');

    const loginForm = page.locator('#login_form');
    const loginFormIsVisible = await loginForm.isVisible();
    if (loginFormIsVisible) await loginForm.locator('a#login_forgot_password').click();

    const forgotForm = page.locator('#forgot_password_form');
    const forgotSubmitButton = forgotForm.locator('button.Button:has-text("Be om passord")');
    await forgotForm.waitFor({ state: 'visible' });
    expect(page.url()).toContain('/login/canvas');
    await forgotSubmitButton.waitFor({ state: 'visible' });
};

export const iframeHeadingElement = async (
    iframeElement: FrameLocator,
    headingElement: string,
    pageTitle: string,
) => {
    await iframeElement
        .locator(`${headingElement}:has-text("${pageTitle}")`)
        .first()
        .waitFor({ state: 'visible', timeout: 60_000 });
};
