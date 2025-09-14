// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig() || {};

Sentry.init({
    debug: false,
    environment: publicRuntimeConfig.APP_ENV,
    release: publicRuntimeConfig.APP_VERSION,
    dsn: publicRuntimeConfig.APP_ENV !== 'local' ? publicRuntimeConfig.SENTRY_DSN : undefined,
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
