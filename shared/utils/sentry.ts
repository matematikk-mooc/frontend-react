import * as Sentry from '@sentry/nextjs';
import getConfig from 'next/config';
import { ZodSchema } from 'zod';

import { apiResponse, IResponse, IResponseMessage } from '@/integrations/apiFetch';

import { parseErrorMessage } from './validate';

const { publicRuntimeConfig } = getConfig() || {};

export const captureException = (
    errorId: string,
    error: unknown,
    messages: IResponseMessage[] = [],
    // showReportDialog = false,
    errorService = 'bff',
): IResponseMessage[] => {
    const env = publicRuntimeConfig.APP_ENV;

    if (error instanceof Error) {
        const debugMessage: IResponseMessage = {
            id: errorId,
            service: errorService,
            title: error.name,
            description: error.message,
            type: 'error',
            visibility: 'debug',
            dateTime: new Date().toISOString(),
        };

        Sentry.addBreadcrumb({
            category: 'error.catch',
            message: error.message,
            data: { messages: [...messages, debugMessage] },
            level: 'debug',
        });

        if (env === 'development') messages.push(debugMessage);
    }

    // const eventId = Sentry.captureException(error);
    // if (showReportDialog) Sentry.showReportDialog({ eventId });

    return messages;
};

export const handleSchemaValidation = async <TSchema, TBody>(
    errorId: string,
    schema: ZodSchema<TSchema>,
    res: TBody,
    errorService: string = 'bff',
): Promise<IResponse<null>> => {
    const env = publicRuntimeConfig.APP_ENV;
    const response = apiResponse(null);

    const schemaValidation = await schema.safeParseAsync(res);
    if (schemaValidation.error) {
        response.error = true;
        response.statusCode = 500;
        response.messages.push({
            id: errorId,
            service: errorService,
            title: 'Schema validation error',
            description: 'Failed to validate the response schema.',
            type: 'error',
            visibility: 'public',
            dateTime: new Date().toISOString(),
        });

        const debugMessage: IResponseMessage = {
            id: 'KAQVqH',
            service: errorService,
            title: 'Schema validation error',
            description: parseErrorMessage(schemaValidation.error),
            type: 'error',
            visibility: 'debug',
            dateTime: new Date().toISOString(),
        };

        Sentry.addBreadcrumb({
            category: 'error.schema',
            message: 'Schema validation error',
            data: { messages: [...response.messages, debugMessage] },
            level: 'error',
        });

        if (env === 'development') response.messages.push(debugMessage);
    }

    return response;
};
