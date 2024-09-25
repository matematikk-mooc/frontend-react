import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getTemplateName, getTranslatedPath } from '@/shared/utils/language';

export function middleware(req: NextRequest) {
    const { pathname, locale } = req.nextUrl;

    try {
        const templateName = getTemplateName(pathname);
        const translatedPath = getTranslatedPath(templateName, locale, {}, false, true);

        if (pathname !== translatedPath) {
            return NextResponse.redirect(new URL(translatedPath, req.url));
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Error in middleware: ${error?.message ?? 'Unknown error'}`);
        } else {
            throw new Error('Error in middleware: Unknown error');
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/about/', '/contact/', '/privacy/'],
};
