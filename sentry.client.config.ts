// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig() || {};

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

            triggerLabel: '',
            triggerAriaLabel: 'Gi tilbakemelding',
            submitButtonLabel: 'Send',
            cancelButtonLabel: 'Avbryt',
            confirmButtonLabel: 'Send',
            addScreenshotButtonLabel: 'Legg til skjermbilde',
            removeScreenshotButtonLabel: 'Fjern skjermbilde',

            formTitle: 'Tilbakemelding',
            nameLabel: 'Navn',
            namePlaceholder: 'Ditt navn',
            emailLabel: 'E-post',
            emailPlaceholder: 'Din e-post',
            isRequiredLabel: '(påkrevd)',
            messageLabel: 'Melding',
            messagePlaceholder: 'Skriv inn din tilbakemelding her',
            successMessageText: 'Takk for tilbakemeldingen!',

            themeLight: {
                background: '#ffffff',
            },
            themeDark: {
                background: '#303030',
            },
        }),
    ],

    debug: false,
    environment: publicRuntimeConfig.APP_ENV,
    dsn: publicRuntimeConfig.SENTRY_DSN,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1,
    tracesSampleRate: 1,
});
