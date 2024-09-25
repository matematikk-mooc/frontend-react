import path from 'path';
import { fileURLToPath } from 'url';

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

export default withPWA(nextConfig);
