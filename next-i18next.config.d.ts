import { UserConfig } from 'next-i18next';

declare module './next-i18next.config.js' {
    const config: UserConfig;
    export = config;
}
