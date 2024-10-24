// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

Sentry.init({
    integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
        }),

        Sentry.feedbackIntegration({
            enableScreenshot: true,
            showBranding: false,
            colorScheme: 'dark',

            isNameRequired: false,
            isEmailRequired: false,

            triggerLabel: 'Feedback',
        }),
    ],

    debug: false,
    dsn: publicRuntimeConfig.SENTRY_DSN,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1,
    tracesSampleRate: 1,
});
