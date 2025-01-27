import { Rewrite } from 'next/dist/lib/load-custom-routes';

interface LocalesConfigRouteItem {
    [locale: string]: string;
}

interface LocalesConfig {
    routes: {
        [defaultPath: string]: LocalesConfigRouteItem;
    };
}

declare module './locales.js' {
    const localesConfig: UserConfig;
    const generateRewrites: () => Rewrite[];

    export { localesConfig, generateRewrites };
}
