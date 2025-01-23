import path from 'path';
import { fileURLToPath } from 'url';

import bundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import nextPwa from 'next-pwa';

import { generateRewrites } from './locales.mjs';
// eslint-disable-next-line import/extensions
import i18nConfig from './next-i18next.config.js';

const withPWA = nextPwa({
    dest: 'public',
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    disable: process.env.NODE_ENV !== 'production',
    register: true,
    skipWaiting: true,
});

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    i18n: i18nConfig.i18n,
    productionBrowserSourceMaps: false,
    reactStrictMode: true,
    trailingSlash: true,
    swcMinify: true,
    publicRuntimeConfig: {
        APP_ENV: process.env.APP_ENV ?? 'development',
        APP_VERSION: process.env.APP_VERSION ?? '1.0.0-dev',
        BFF_API_URL:
            process.env.BFF_API_URL ??
            'https://app-kpas-stage-norwayeast-001.azurewebsites.net/api',
        KPAS_API_URL: process.env.KPAS_API_URL ?? 'https://kpas.staging.kompetanse.udir.no/api',
        SENTRY_DSN:
            process.env.SENTRY_DSN ??
            'https://27fcdf875d9baf4718fb32987d327720@o4507468577701888.ingest.de.sentry.io/4508206265335888',
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

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(
    withSentryConfig(withPWA(nextConfig), {
        org: 'udir',
        project: 'kpas-frontend-react',
        tunnelRoute: '/logs/',

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
    }),
);
