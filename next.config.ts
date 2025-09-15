import path from 'path';
import { fileURLToPath } from 'url';

import bundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import { NextConfig } from 'next';
import nextPwa from 'next-pwa';

import { generateRewrites } from './locales.js';
import i18nConfig from './next-i18next.config.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withPWA: any = nextPwa({
    dest: 'public',
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
    disable: process.env.NODE_ENV !== 'production',
    register: true,
    skipWaiting: true,
    buildExcludes: [/dynamic-css-manifest\.json$/],
});

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const appEnv = process.env.APP_ENV ?? 'development';
const appVersion = process.env.APP_VERSION ?? '1.0.0-dev';
let sentryDSN = process.env.SENTRY_DSN ?? '';

if (appEnv !== 'local' && sentryDSN === '') {
    sentryDSN =
        'https://27fcdf875d9baf4718fb32987d327720@o4507468577701888.ingest.de.sentry.io/4508206265335888';
}

const nextConfig: NextConfig = {
    output: 'standalone',
    i18n: i18nConfig.i18n,
    productionBrowserSourceMaps: false,
    reactStrictMode: true,
    trailingSlash: true,
    publicRuntimeConfig: {
        APP_ENV: appEnv,
        APP_VERSION: process.env.APP_VERSION ?? '1.0.0-dev',
        BFF_API_URL:
            process.env.BFF_API_URL ??
            'https://app-kpas-stage-norwayeast-001.azurewebsites.net/api',
        KPAS_API_URL: process.env.KPAS_API_URL ?? 'https://kpas.staging.kompetanse.udir.no/api',
        SENTRY_DSN: sentryDSN,
    },
    experimental: {
        optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
        serverMinification: false,
        esmExternals: 'loose',
    },
    sassOptions: {
        includePaths: [path.join(dirname, 'styles')],
        silenceDeprecations: ['import', 'legacy-js-api'],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    async rewrites() {
        return [...generateRewrites()];
    },
};

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(
    withSentryConfig<NextConfig>(withPWA(nextConfig), {
        org: 'udir',
        project: 'kpas-frontend-react',
        tunnelRoute: '/logs/',

        silent: true,
        telemetry: false,
        widenClientFileUpload: false,
        hideSourceMaps: true,
        disableLogger: true,
        automaticVercelMonitors: false,
        reactComponentAnnotation: {
            enabled: true,
        },
        sourcemaps: {
            disable: true,
        },
        release: {
            name: appVersion,
            create: false,
            finalize: false,
        },
    }),
);
