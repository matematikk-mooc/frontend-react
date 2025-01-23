import type { NextApiRequest, NextApiResponse } from 'next';

import { apiResponse, IResponse, responseSchema } from '@/integrations/apiFetch';
import { resHandler } from '@/integrations/kpas/kpasFetch';
import { getCourses } from '@/integrations/kpas/v1/export';
import packageConfig from '@/package.json';
import { captureException, handleSchemaValidation } from '@/shared/utils/sentry';
import z from '@/shared/utils/validate';

export const PingSchema = z
    .strictObject({
        version: z.string().openapi({ example: '1.0.0' }),
        integrations: z.strictObject({
            kpas: z.boolean().openapi({ example: true }),
        }),
    })
    .openapi('Ping');
export type IPing = z.infer<typeof PingSchema>;

export const PingResSchema = responseSchema
    .extend({
        payload: PingSchema,
    })
    .openapi('PingRes');
export type IPingRes =
    | (z.infer<typeof PingResSchema> & {
          payload: IPing;
      })
    | IResponse<null>;

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Status
 *     description: Check the status of the server and integrations.
 *     tags:
 *       - Other
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PingRes'
 */
const handler = async (_req: NextApiRequest, res: NextApiResponse<IPingRes>) => {
    const pingRes = apiResponse<IPing>({
        version: packageConfig?.version ?? '0.0.0',
        integrations: {
            kpas: false,
        },
    });

    try {
        const courses = await getCourses();
        const kpasRes = resHandler<number[]>(courses);
        if (!kpasRes.error) pingRes.payload.integrations.kpas = true;
    } catch (error) {
        pingRes.error = true;
        pingRes.statusCode = 500;
        pingRes.messages.push({
            id: 'kgV65z',
            service: 'kpas',
            title: 'Integration Error',
            description: 'Failed to connect with KPAS service.',
            type: 'error',
            visibility: 'public',
            dateTime: new Date().toISOString(),
        });

        captureException('g4OJFH', error, pingRes.messages, 'kpas');
    }

    const schemaValidation = await handleSchemaValidation('O5PbkY', PingResSchema, pingRes);
    if (schemaValidation.error) {
        pingRes.error = schemaValidation.error;
        pingRes.statusCode = schemaValidation.statusCode;
        pingRes.messages = schemaValidation.messages;

        captureException('EeHZfJ', new Error('Failed to validate ping response schema.'));
    }

    return res.status(pingRes.statusCode).json(pingRes);
};

export default handler;
