import path from 'path';
import { fileURLToPath } from 'url';

import { withSentryConfig } from '@sentry/nextjs';
import nextPwa from 'next-pwa';

import { generateRewrites } from './locales.mjs';
// eslint-disable-next-line import/extensions
import i18nConfig from './next-i18next.config.js';

const withPWA = nextPwa({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
});

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    i18n: i18nConfig.i18n,
    productionBrowserSourceMaps: false,
    reactStrictMode: true,
    trailingSlash: true,
    swcMinify: true,
    publicRuntimeConfig: {
        APP_ENV: process.env.APP_ENV,
        SENTRY_DSN: process.env.SENTRY_DSN,
    },
    experimental: {
        optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
        esmExternals: 'loose',
    },
    sassOptions: {
        includePaths: [path.join(dirname, 'styles')],
    },
    async rewrites() {
        return [...generateRewrites()];
    },
};

export default withSentryConfig(withPWA(nextConfig), {
    org: 'udir',
    project: 'kpas-frontend-react',
    tunnelRoute: '/logs/',
    authToken: process.env.SENTRY_AUTH_TOKEN,

    silent: false,
    telemetry: false,
    widenClientFileUpload: true,
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: false,
    disableServerWebpackPlugin: !process.env.CI,
    disableClientWebpackPlugin: !process.env.CI,
    reactComponentAnnotation: {
        enabled: true,
    },
});
