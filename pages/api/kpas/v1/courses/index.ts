import type { NextApiRequest, NextApiResponse } from 'next';

import { apiResponse, IResponse, responseSchema } from '@/integrations/apiFetch';
import { resHandler } from '@/integrations/kpas/kpasFetch';
import { getCoursesWithCache } from '@/integrations/kpas/v1/export';
import { captureException, handleSchemaValidation } from '@/shared/utils/sentry';
import z from '@/shared/utils/validate';

export const KPASCoursesResSchema = responseSchema
    .extend({
        payload: z
            .array(z.number().openapi({ example: 64 }))
            .openapi({ example: [32, 64, 128, 256, 512, 1024] }),
    })
    .openapi('KPASCoursesRes');

export type IKPASCoursesRes =
    | (z.infer<typeof KPASCoursesResSchema> & {
          payload: number[];
      })
    | IResponse<null>;

/**
 * @swagger
 * /kpas/v1/courses/:
 *   get:
 *     summary: Course IDs
 *     description: Retrieve a list of course IDs.
 *     tags:
 *       - KPAS
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KPASCoursesRes'
 */
const handler = async (_req: NextApiRequest, res: NextApiResponse<IKPASCoursesRes>) => {
    const coursesRes = apiResponse<number[]>([]);

    try {
        const courses = await getCoursesWithCache();
        const kpasRes = resHandler<number[]>(courses);

        if (!kpasRes.error) {
            coursesRes.payload = kpasRes.payload ?? [];
        } else {
            coursesRes.error = kpasRes.error;
            coursesRes.statusCode = kpasRes.statusCode;
            coursesRes.messages = kpasRes.messages;
        }
    } catch (error) {
        coursesRes.error = true;
        coursesRes.statusCode = 500;
        coursesRes.messages.push({
            id: 'zWLpEr',
            service: 'kpas',
            title: 'Integration Error',
            description: 'Failed to fetch courses from KPAS.',
            type: 'error',
            visibility: 'public',
            dateTime: new Date().toISOString(),
        });

        captureException('YoaNWE', error, coursesRes.messages, 'kpas');
    }

    const schemaValidation = await handleSchemaValidation(
        'VC5svu',
        KPASCoursesResSchema,
        coursesRes,
    );
    if (schemaValidation.error) {
        coursesRes.error = schemaValidation.error;
        coursesRes.statusCode = schemaValidation.statusCode;
        coursesRes.messages = schemaValidation.messages;
        coursesRes.payload = [];

        captureException('WiW0bA', new Error('Failed to validate KPAS courses response schema.'));
    }

    res.status(coursesRes.statusCode).json(coursesRes);
};

export default handler;
