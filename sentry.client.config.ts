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

    environment: publicRuntimeConfig.APP_ENV,
    release: publicRuntimeConfig.APP_VERSION,
    dsn: publicRuntimeConfig.APP_ENV !== 'local' ? publicRuntimeConfig.SENTRY_DSN : undefined,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1,
    tracesSampleRate: 1,
    beforeSendTransaction: eventItem => {
        const traceStatus = eventItem?.contexts?.trace?.status;
        const transactionName = eventItem?.transaction;

        const isTraceSuccess = traceStatus === 'ok';
        const isPingRequest = transactionName?.includes('/api/ping');
        const isSwaggerRequest = transactionName?.includes('/api/openapi');

        if (isTraceSuccess) if (isPingRequest || isSwaggerRequest) return null;

        return eventItem;
    },
});
