import { test } from '@playwright/test';

import { loginWithBasicAuth } from '@/tests/utils/auth';
import { enrolledCard } from '@/tests/utils/cards';
import { routeToMyCourses } from '@/tests/utils/routes';
import { useDesktopViewport } from '@/tests/utils/shared';

test.describe('3. My Courses | Canvas', async () => {
    useDesktopViewport();

    test('3.1 Invite card', async ({ page }, testInfo) => {
        await loginWithBasicAuth(page, testInfo.project.name);
        await routeToMyCourses(page);

        const inviteContainer = page.locator('.my-courses-invites');
        const inviteItem = inviteContainer.locator('.course-invite').first();
        const acceptButton = inviteItem.locator('button:has-text("Godta invitasjonen")');
        const declineButton = inviteItem.locator('button:has-text("Avslå invitasjonen")');

        await acceptButton.waitFor({ state: 'visible' });
        await declineButton.waitFor({ state: 'visible' });
    });

    test('3.2 Enrolled card', async ({ page }, testInfo) => {
        await loginWithBasicAuth(page, testInfo.project.name);
        await routeToMyCourses(page);

        const cardInstances = page
            .locator('.my-courses-page--layout .card-container')
            .locator(`.card-instance button p:has-text("Gå til kompetansepakke")`)
            .locator('xpath=ancestor::div[contains(@class, "card-instance")]');
        await enrolledCard(page, cardInstances);
    });
});
