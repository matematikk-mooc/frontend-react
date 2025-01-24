// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig() || {};

Sentry.init({
    debug: false,
    environment: publicRuntimeConfig.APP_ENV,
    dsn: publicRuntimeConfig.APP_ENV !== 'local' ? publicRuntimeConfig.SENTRY_DSN : undefined,
    tracesSampleRate: 1,
});
