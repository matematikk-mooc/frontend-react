import type { NextApiRequest, NextApiResponse } from 'next';

import { apiResponse, IResponse, responseSchema } from '@/integrations/apiFetch';
import { resHandler } from '@/integrations/kpas/kpasFetch';
import { getCourse, KPASCourseSchema, IKPASCourse } from '@/integrations/kpas/v1/export';
import { captureException, handleSchemaValidation } from '@/shared/utils/sentry';
import z from '@/shared/utils/validate';

export const KPASCourseResSchema = responseSchema
    .extend({
        payload: KPASCourseSchema,
    })
    .openapi('KPASCourseRes');
export type IKPASCourseRes = z.infer<typeof KPASCourseResSchema> | IResponse<null>;

/**
 * @swagger
 * /kpas/v1/courses/{course_id}:
 *   get:
 *     summary: Course
 *     description: Retrieve a course by ID.
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
 *               $ref: '#/components/schemas/KPASCourseRes'
 */
const handler = async (req: NextApiRequest, res: NextApiResponse<IKPASCourseRes>) => {
    const courseRes = apiResponse<IKPASCourse | null>(null);

    try {
        const { courseID } = req.query;
        const courseIdNumber = Number(courseID);

        const courseIDValidation = await z.number().safeParseAsync(courseIdNumber);
        if (courseIDValidation.success === false) {
            courseRes.error = true;
            courseRes.statusCode = 400;
            courseRes.messages.push({
                id: '31bAMS',
                service: 'bff',
                title: 'Invalid course ID',
                description: 'Course ID must be a number.',
                type: 'error',
                visibility: 'public',
                dateTime: new Date().toISOString(),
            });

            return res.status(courseRes.statusCode).json(courseRes);
        }

        const course = await getCourse(courseIdNumber);
        const kpasRes = resHandler<IKPASCourse>(course);

        if (!kpasRes.error) {
            courseRes.payload = kpasRes.payload ?? null;
        } else {
            courseRes.error = kpasRes.error;
            courseRes.statusCode = kpasRes.statusCode;
            courseRes.messages = kpasRes.messages;
        }
    } catch (error) {
        courseRes.error = true;
        courseRes.statusCode = 500;
        courseRes.messages.push({
            id: 'oQmEWg',
            service: 'kpas',
            title: 'Integration Error',
            description: 'Failed to fetch course from KPAS.',
            type: 'error',
            visibility: 'public',
            dateTime: new Date().toISOString(),
        });

        captureException('NuaNmw', error, courseRes.messages, 'kpas');
    }

    const schemaValidation = await handleSchemaValidation('KpSIHp', KPASCourseResSchema, courseRes);
    if (schemaValidation.error) {
        courseRes.error = schemaValidation.error;
        courseRes.statusCode = schemaValidation.statusCode;
        courseRes.messages = schemaValidation.messages;
        courseRes.payload = null;

        captureException('FQn8nR', new Error('Failed to validate KPAS course response schema.'));
    }

    return res.status(courseRes.statusCode).json(courseRes);
};

export default handler;
