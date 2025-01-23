import type { NextApiRequest, NextApiResponse } from 'next';

import { apiResponse, responseSchema } from '@/integrations/apiFetch';
import { resHandler } from '@/integrations/kpas/kpasFetch';
import {
    KPASCourseModuleSchema,
    IKPASCourseModule,
    getCourseModules,
} from '@/integrations/kpas/v1/export';
import { captureException, handleSchemaValidation } from '@/shared/utils/sentry';
import z from '@/shared/utils/validate';

export const KPASCourseModulesResSchema = responseSchema
    .extend({
        payload: z.array(KPASCourseModuleSchema),
    })
    .openapi('KPASCourseModulesRes');
export type IKPASCourseModulesRes = z.infer<typeof KPASCourseModulesResSchema>;

/**
 * @swagger
 * /kpas/v1/courses/{course_id}/modules:
 *   get:
 *     summary: Course Modules
 *     description: Retrieve course modules.
 *     tags:
 *       - KPAS
 *     parameters:
 *       - name: course_id
 *         in: path
 *         required: true
 *         description: ID of the course
 *         schema:
 *           type: integer
 *           default: 360
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KPASCourseModulesRes'
 */
const handler = async (req: NextApiRequest, res: NextApiResponse<IKPASCourseModulesRes>) => {
    const courseModulesRes = apiResponse<IKPASCourseModule[]>([]);

    try {
        const { courseID } = req.query;
        const courseIdNumber = Number(courseID);

        const courseIDValidation = await z.number().safeParseAsync(courseIdNumber);
        if (courseIDValidation.success === false) {
            courseModulesRes.error = true;
            courseModulesRes.statusCode = 400;
            courseModulesRes.messages.push({
                id: 'Gx7u4p',
                service: 'bff',
                title: 'Invalid course ID',
                description: 'Course ID must be a number.',
                type: 'error',
                visibility: 'public',
                dateTime: new Date().toISOString(),
            });

            return res.status(courseModulesRes.statusCode).json(courseModulesRes);
        }

        const courseModules = await getCourseModules(courseIdNumber);
        const kpasRes = resHandler<IKPASCourseModule[]>(courseModules);

        if (!kpasRes.error) {
            courseModulesRes.payload = kpasRes.payload ?? [];
        } else {
            courseModulesRes.error = kpasRes.error;
            courseModulesRes.statusCode = kpasRes.statusCode;
            courseModulesRes.messages = kpasRes.messages;
        }
    } catch (error) {
        courseModulesRes.error = true;
        courseModulesRes.statusCode = 500;
        courseModulesRes.messages.push({
            id: 'tgQAWI',
            service: 'kpas',
            title: 'Integration Error',
            description: 'Failed to fetch course modules from KPAS.',
            type: 'error',
            visibility: 'public',
            dateTime: new Date().toISOString(),
        });

        captureException('lZV2HM', error, courseModulesRes.messages, 'kpas');
    }

    const schemaValidation = await handleSchemaValidation(
        'zoU9Bh',
        KPASCourseModulesResSchema,
        courseModulesRes,
    );
    if (schemaValidation.error) {
        courseModulesRes.error = schemaValidation.error;
        courseModulesRes.statusCode = schemaValidation.statusCode;
        courseModulesRes.messages = schemaValidation.messages;
        courseModulesRes.payload = [];

        captureException(
            'ZmKbCJ',
            new Error('Failed to validate KPAS course modules response schema.'),
        );
    }

    return res.status(courseModulesRes.statusCode).json(courseModulesRes);
};

export default handler;
