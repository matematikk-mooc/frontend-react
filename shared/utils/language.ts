// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import localesConfig from '../../locales.mjs';

interface PathTranslations {
    [key: string]: {
        [locale: string]: string;
    };
}

export const pathTranslations: PathTranslations = localesConfig.routes;

export const getTemplateName = (pathname: string): string => {
    const sortedKeys = Object.keys(pathTranslations).sort((a, b) => b.length - a.length);
    const normalizedPathname = pathname.endsWith('/') ? pathname : `${pathname}/`;
    if (normalizedPathname === '/404/' || normalizedPathname === '/500/') return '/';

    const templateKey = sortedKeys.find(key => {
        const normalizedKey = key.endsWith('/') ? key : `${key}/`;
        return normalizedPathname.startsWith(normalizedKey);
    });

    if (!templateKey)
        throw new Error(`Template name not found for pathname: ${normalizedPathname}`);
    return templateKey;
};

export const getTranslatedPath = (
    path: string,
    locale: string,
    params?: Record<string, string>,
    removeTrailingSlash: boolean = false,
    includeLocale: boolean = false, // New parameter to control whether the locale is included in the path
): string => {
    const translatedPath = pathTranslations[path]?.[locale];
    if (!translatedPath)
        throw new Error(`Path translation for path "${path}" not found for locale "${locale}"`);

    let pathWithParams = translatedPath;
    if (params) {
        Object.keys(params).forEach(paramKey => {
            const paramValue = params[paramKey];
            pathWithParams = pathWithParams.replace(`[${paramKey}]`, paramValue || '');
        });
    }

    if (removeTrailingSlash)
        pathWithParams = pathWithParams.endsWith('/')
            ? pathWithParams.slice(0, -1)
            : pathWithParams;

    // Prepend the locale to the translated path unless it's 'nb' or includeLocale is false
    if (includeLocale && locale !== 'nb') {
        return `/${locale}${pathWithParams}`;
    }

    return pathWithParams.endsWith('/') ? pathWithParams : `${pathWithParams}/`;
};
