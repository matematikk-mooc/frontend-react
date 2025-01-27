import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import type { NextApiRequest, NextApiResponse } from 'next';
import getConfig from 'next/config';
import { createSwaggerSpec } from 'next-swagger-doc';

import { apiResponse, IResponse } from '@/integrations/apiFetch';
import { KPASCoursesResSchema } from '@/pages/api/kpas/v1/courses';
import { KPASCourseResSchema } from '@/pages/api/kpas/v1/courses/[courseID]';
import { KPASCourseModulesResSchema } from '@/pages/api/kpas/v1/courses/[courseID]/modules';
import { KPASCoursePageResSchema } from '@/pages/api/kpas/v1/courses/[courseID]/pages/[pageSlug]';
import { PingResSchema } from '@/pages/api/ping';
import { IOpenAPIRes, OpenAPIResSchema, openAPIDefinition } from '@/shared/utils/openapi';
import { captureException, handleSchemaValidation } from '@/shared/utils/sentry';

const { publicRuntimeConfig } = getConfig() || {};

/**
 * @swagger
 * /openapi/:
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const openApiRes = apiResponse<any>(null);

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const specificationRes: any = createSwaggerSpec({
            apiFolder: 'pages/api',
            definition: openAPIDefinition,
        });
        const openAPIGenerator = new OpenApiGeneratorV3([
            OpenAPIResSchema,
            PingResSchema,

            KPASCoursesResSchema,
            KPASCourseResSchema,

            KPASCourseModulesResSchema,
            KPASCoursePageResSchema,
        ]);

        specificationRes.components.schemas = {
            ...specificationRes.components.schemas,
            ...openAPIGenerator.generateComponents().components?.schemas,
        };

        if (publicRuntimeConfig.APP_ENV === 'local') {
            const PORT = process.env.PORT ?? 3000;

            specificationRes.servers.unshift({
                url: `http://localhost:${PORT}/api`,
                description: 'Local',
            });
        } else if (publicRuntimeConfig.APP_ENV === 'production') {
            specificationRes.servers.reverse();
        }

        openApiRes.payload = specificationRes;
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
