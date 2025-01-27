import * as Sentry from '@sentry/nextjs';
import { createCache } from 'async-cache-dedupe';
import getConfig from 'next/config';

import { apiResponse, IResponse, IResponseMessage } from '@/integrations/apiFetch';
import z from '@/shared/utils/validate';

const { publicRuntimeConfig } = getConfig() || {};

export const kpasResponseSchema = z
    .strictObject({
        status: z.number().openapi({ example: 200 }),
        status_message: z.string().openapi({ example: 'Success' }),
        result: z.unknown().openapi({ example: null }),
    })
    .openapi('KPASResponse');
export type IKPASResponse<TBody = unknown> = z.infer<typeof kpasResponseSchema> & {
    result: TBody;
};

export const resHandler = <TBody>(res: IKPASResponse<TBody>): IResponse<TBody | null> => {
    const env = publicRuntimeConfig.APP_ENV;
    const returnRes = apiResponse<TBody | null>(null);

    returnRes.error = res.status_message !== 'Success';
    returnRes.statusCode = res.status;
    if (returnRes.error) {
        const notFoundResult =
            typeof res?.result === 'string' && res.result.toLowerCase().includes('not found');
        if (returnRes.statusCode === 404 || notFoundResult) {
            returnRes.statusCode = 404;
            returnRes.messages.push({
                id: 'dEl2UE',
                service: 'kpas',
                title: 'Not Found',
                description: 'The requested resource was not found',
                type: 'error',
                visibility: 'public',
                dateTime: new Date().toISOString(),
            });
        } else {
            returnRes.messages.push({
                id: 'qVFNur',
                service: 'kpas',
                title: 'Request Error',
                description: 'An error occurred',
                type: 'error',
                visibility: 'public',
                dateTime: new Date().toISOString(),
            });
        }

        const debugMessage: IResponseMessage = {
            id: '3S7Iyh',
            service: 'kpas',
            title: res.status_message ?? 'Request Error',
            description: typeof res?.result === 'string' ? res.result : 'An error occurred',
            type: 'error',
            visibility: 'debug',
            dateTime: new Date().toISOString(),
        };

        Sentry.addBreadcrumb({
            category: 'error.kpas.fetch',
            message: res.status_message,
            data: { messages: [...returnRes.messages, debugMessage] },
            level: 'debug',
        });

        if (env === 'local') returnRes.messages.push(debugMessage);

        return returnRes;
    }

    returnRes.payload = res.result ?? null;
    return returnRes;
};

export const cacheHandler = createCache({
    ttl: 1 * 60, // 1 minute
    stale: 60 * 60, // 60 minutes
    storage: { type: 'memory', options: { size: 2048 } },
});
