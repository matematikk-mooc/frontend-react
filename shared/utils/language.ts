import { ParsedUrlQuery } from 'querystring';

import { localesConfig } from '../../locales.js';

interface PathTranslations {
    [key: string]: {
        [locale: string]: string;
    };
}

export const pathTranslations: PathTranslations = localesConfig.routes;

export const getTemplateName = (pathname: string): string => {
    const sortedKeys = Object.keys(pathTranslations).sort((a, b) => b.length - a.length);
    let normalizedPathname = pathname.endsWith('/') ? pathname : `${pathname}/`;
    normalizedPathname = normalizedPathname.replace(/\[([a-zA-Z]+)\]/g, ':$1');
    if (normalizedPathname === '/404/' || normalizedPathname === '/500/') return '/';

    const templateKey = sortedKeys.find(key => {
        const normalizedKey = key.endsWith('/') ? key : `${key}/`;
        return normalizedPathname.startsWith(normalizedKey);
    });

    if (!templateKey)
        throw new Error(`Template name not found for pathname: ${normalizedPathname}`);
    return templateKey;
};

export const getRouterQuery = (query: ParsedUrlQuery): Record<string, string> => {
    const routerQuery = query as Record<string, string>;
    return Object.keys(routerQuery).reduce((acc, key) => {
        const value = routerQuery[key];
        return { ...acc, [key]: Array.isArray(value) ? value[0] : value };
    }, {});
};

export const getTranslatedPath = (
    path: string,
    locale: string,
    params?: Record<string, string>,
    removeTrailingSlash: boolean = false,
    includeLocale: boolean = false,
): string => {
    const translatedPath = pathTranslations[path]?.[locale];
    if (!translatedPath)
        throw new Error(`Path translation for path "${path}" not found for locale "${locale}"`);

    let pathWithParams = translatedPath;
    if (params) {
        Object.keys(params).forEach(paramKey => {
            const paramValue = params[paramKey] ?? '';
            pathWithParams = pathWithParams.replace(`/:${paramKey}/`, `/${paramValue}/`);
        });
    }

    if (removeTrailingSlash)
        pathWithParams = pathWithParams.endsWith('/')
            ? pathWithParams.slice(0, -1)
            : pathWithParams;

    if (includeLocale && locale !== 'nb') return `/${locale}${pathWithParams}`;
    return pathWithParams.endsWith('/') ? pathWithParams : `${pathWithParams}/`;
};

export const getObjectTranslation = (locale: string, dataObject = {}, fallbackLocale = 'nb') => {
    const object = dataObject as Record<string, string>;
    return object[locale] || object[fallbackLocale] || null;
};
