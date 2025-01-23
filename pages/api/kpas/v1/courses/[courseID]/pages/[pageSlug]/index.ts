import type { NextApiRequest, NextApiResponse } from 'next';

import { apiResponse, IResponse, responseSchema } from '@/integrations/apiFetch';
import { resHandler } from '@/integrations/kpas/kpasFetch';
import {
    KPASCoursePageSchema,
    IKPASCoursePage,
    getCoursePage,
} from '@/integrations/kpas/v1/export';
import { captureException, handleSchemaValidation } from '@/shared/utils/sentry';
import z from '@/shared/utils/validate';

export const KPASCoursePageResSchema = responseSchema
    .extend({
        payload: KPASCoursePageSchema,
    })
    .openapi('KPASCoursePageRes');
export type IKPASCoursePageRes = z.infer<typeof KPASCoursePageResSchema>;

/**
 * @swagger
 * /kpas/v1/courses/{course_id}/pages/{page_slug}:
 *   get:
 *     summary: Course Page
 *     description: Retrieve course page.
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
 *       - name: page_slug
 *         in: path
 *         required: true
 *         description: Slug of the page
 *         schema:
 *           type: string
 *           default: nb-velkommen-til-kompetansepakken|se-gealbopahka-birra
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KPASCoursePageRes'
 */
const handler = async (
    req: NextApiRequest,
    res: NextApiResponse<IKPASCoursePageRes | IResponse<null>>,
) => {
    const coursePageRes = apiResponse<IKPASCoursePage | null>(null);

    try {
        const { courseID, pageSlug } = req.query;
        const courseIdNumber = Number(courseID);
        const pageSlugString = String(pageSlug);

        const courseIDValidation = await z.number().safeParseAsync(courseIdNumber);
        if (courseIDValidation.success === false) {
            coursePageRes.error = true;
            coursePageRes.statusCode = 400;
            coursePageRes.messages.push({
                id: 'nISxeW',
                service: 'bff',
                title: 'Invalid course ID',
                description: 'Course ID must be a number.',
                type: 'error',
                visibility: 'public',
                dateTime: new Date().toISOString(),
            });

            return res.status(coursePageRes.statusCode).json(coursePageRes);
        }

        const pageSlugValidation = await z.string().safeParseAsync(pageSlugString);
        if (pageSlugValidation.success === false) {
            coursePageRes.error = true;
            coursePageRes.statusCode = 400;
            coursePageRes.messages.push({
                id: 'zS7II9',
                service: 'bff',
                title: 'Invalid page slug',
                description: 'Page slug must be a string.',
                type: 'error',
                visibility: 'public',
                dateTime: new Date().toISOString(),
            });

            return res.status(coursePageRes.statusCode).json(coursePageRes);
        }

        const coursePage = await getCoursePage(courseIdNumber, pageSlugString);
        const kpasRes = resHandler<IKPASCoursePage | null>(coursePage);

        if (!kpasRes.error) {
            coursePageRes.payload = kpasRes.payload ?? null;
        } else {
            coursePageRes.error = kpasRes.error;
            coursePageRes.statusCode = kpasRes.statusCode;
            coursePageRes.messages = kpasRes.messages;
        }
    } catch (error) {
        coursePageRes.error = true;
        coursePageRes.statusCode = 500;
        coursePageRes.messages.push({
            id: 'IBcgOb',
            service: 'kpas',
            title: 'Integration Error',
            description: 'Failed to fetch course page from KPAS.',
            type: 'error',
            visibility: 'public',
            dateTime: new Date().toISOString(),
        });

        captureException('Rkmq1b', error, coursePageRes.messages, 'kpas');
    }

    const schemaValidation = await handleSchemaValidation(
        'WK1jPh',
        KPASCoursePageResSchema,
        coursePageRes,
    );
    if (schemaValidation.error) {
        coursePageRes.error = schemaValidation.error;
        coursePageRes.statusCode = schemaValidation.statusCode;
        coursePageRes.messages = schemaValidation.messages;
        coursePageRes.payload = null;

        captureException(
            'fuNVkq',
            new Error('Failed to validate KPAS course page response schema.'),
        );
    }

    return res.status(coursePageRes.statusCode).json(coursePageRes);
};

export default handler;
