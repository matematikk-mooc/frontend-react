import getConfig from 'next/config';

import apiFetch from '@/integrations/apiFetch';
import { IOpenAPIRes } from '@/shared/utils/openapi';
import z from '@/shared/utils/validate';

const { publicRuntimeConfig } = getConfig() || {};

export const getOpenAPI = async () => {
    const apiPath = `/openapi/`;
    return apiFetch<IOpenAPIRes>(publicRuntimeConfig.BFF_API_URL, apiPath);
};

export const PingSchema = z
    .strictObject({
        version: z.string().openapi({ example: '1.0.0' }),
        openapi: z.boolean().openapi({ example: true }),
        integrations: z.strictObject({
            kpas: z.boolean().openapi({ example: true }),
        }),
    })
    .openapi('Ping');
export type IPing = z.infer<typeof PingSchema>;

export const getPing = async () => {
    const apiPath = `/ping/`;
    return apiFetch<IPing>(publicRuntimeConfig.BFF_API_URL, apiPath);
};
