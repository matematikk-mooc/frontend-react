/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable import/no-unresolved */
const ChainedBackend = require('i18next-chained-backend').default;
const HttpBackend = require('i18next-http-backend/cjs');
const LocalStorageBackend = require('i18next-localstorage-backend').default;

const isBrowser = typeof window !== 'undefined';
const isDev = process.env.NODE_ENV === 'development';

/** @type {import('next-i18next').UserConfig} */
const config = {
    backend: {
        backendOptions: [{ expirationTime: isDev ? 0 : 60 * 60 * 1000 }, {}], // 1 hour
        backends: isBrowser ? [LocalStorageBackend, HttpBackend] : [],
    },
    partialBundledLanguages: isBrowser && true,
    i18n: {
        locales: ['nb', 'nn'],
        defaultLocale: 'nb',
    },
    serializeConfig: false,
    use: isBrowser ? [ChainedBackend] : [],
};

module.exports = config;
