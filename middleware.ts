import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getTemplateName, getTranslatedPath } from '@/shared/utils/language';
import { captureException } from '@/shared/utils/sentry';

export function middleware(req: NextRequest) {
    const { pathname, locale } = req.nextUrl;

    try {
        const templateName = getTemplateName(pathname);
        const translatedPath = getTranslatedPath(templateName, locale, {}, false, true);

        if (pathname !== translatedPath) {
            return NextResponse.redirect(new URL(translatedPath, req.url));
        }
    } catch (error) {
        captureException('VLV54d', error);
        throw error;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/about/',
        '/contact/',
        '/privacy/',
        '/courses/',
        // TODO: Review how to handle dynamic routes redirection
        // '/courses/:courseID/',
        // '/courses/:courseID/:courseSlugID/',
    ],
};
