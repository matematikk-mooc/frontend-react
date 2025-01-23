/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unreachable-loop */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import type { NextApiRequest, NextApiResponse } from 'next';
import swaggerJSDoc from 'swagger-jsdoc';

import { apiResponse, IResponse } from '@/integrations/apiFetch';
import { KPASCoursesResSchema } from '@/pages/api/kpas/v1/courses';
import { KPASCourseResSchema } from '@/pages/api/kpas/v1/courses/[courseID]';
import { PingResSchema } from '@/pages/api/ping';
import { IOpenAPIRes, OpenAPIResSchema, swaggerOptions } from '@/shared/utils/openapi';
import { captureException, handleSchemaValidation } from '@/shared/utils/sentry';

import { KPASCourseModulesResSchema } from './kpas/v1/courses/[courseID]/modules';
import { KPASCoursePageResSchema } from './kpas/v1/courses/[courseID]/pages/[pageSlug]';

/**
 * @swagger
 * /openapi:
 *   get:
 *     summary: OpenAPI v3
 *     description: Retrieve OpenAPI v3 specification.
 *     tags:
 *       - Other
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OpenAPIRes'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Response'
 */
const handler = async (
    _req: NextApiRequest,
    res: NextApiResponse<IOpenAPIRes | IResponse<null>>,
) => {
    const openApiRes = apiResponse<any>(null);

    try {
        const openAPIGenerator = new OpenApiGeneratorV3([
            OpenAPIResSchema,
            PingResSchema,

            KPASCoursesResSchema,
            KPASCourseResSchema,

            KPASCourseModulesResSchema,
            KPASCoursePageResSchema,
        ]);

        swaggerOptions.swaggerDefinition.components.schemas = {
            ...swaggerOptions.swaggerDefinition.components.schemas,
            ...openAPIGenerator.generateComponents().components?.schemas,
        };

        const openAPIDoc: any = swaggerJSDoc(swaggerOptions);
        openApiRes.payload = openAPIDoc;
    } catch (error) {
        openApiRes.error = true;
        openApiRes.statusCode = 500;
        openApiRes.messages.push({
            id: 'IrY7qV',
            service: 'bff',
            title: 'OpenAPI Generation Error',
            description: 'Failed to generate OpenAPI v3 specification.',
            type: 'error',
            visibility: 'public',
            dateTime: new Date().toISOString(),
        });

        captureException('mfGF5j', error, openApiRes.messages);
    }

    const schemaValidation = await handleSchemaValidation(
        'M4BdLt',
        OpenAPIResSchema,
        openApiRes.payload,
    );
    if (schemaValidation.error) {
        openApiRes.error = schemaValidation.error;
        openApiRes.statusCode = schemaValidation.statusCode;
        openApiRes.messages = schemaValidation.messages;
        openApiRes.payload = null;

        captureException('xQrElE', new Error('Failed to validate OpenAPI response schema.'));
    }

    if (openApiRes.error) return res.status(openApiRes.statusCode).json(openApiRes);
    return res.status(openApiRes.statusCode).json(openApiRes.payload);
};

export default handler;
