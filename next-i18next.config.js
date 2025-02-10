const ChainedBackend = require('i18next-chained-backend').default;
const HttpBackend = require('i18next-http-backend').default;
const LocalStorageBackend = require('i18next-localstorage-backend').default;

const appEnv = process.env.APP_ENV ?? 'development';
const isBrowser = typeof window !== 'undefined';
const isLocal = appEnv === 'local';

/** @type {import('next-i18next').UserConfig} */
const config = {
    backend: {
        backendOptions: [{ expirationTime: isLocal ? 0 : 60 * 60 * 1000 }, {}], // 1 hour
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
