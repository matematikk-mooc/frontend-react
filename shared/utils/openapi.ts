import z from '@/shared/utils/validate';

export const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            version: '1.0.0',
            title: 'BFF | KPAS',
            contact: {
                name: 'Support',
                email: 'kompetansesupport@udir.no',
                url: 'https://kp.udir.no/kontakt/',
            },
            license: {
                name: 'Apache 2.0',
                url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Local',
            },
            {
                url: 'https://app-kpas-stage-norwayeast-001.azurewebsites.net/api',
                description: 'Stage',
            },
            {
                url: 'https://kp.udir.no/api',
                description: 'Production',
            },
        ],
        security: [{ bearerAuth: [] }],
        tags: [{ name: 'KPAS' }, { name: 'Other' }],
        components: {
            securitySchemes: {
                bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
            },
            schemas: {},
        },
    },
    apis: ['**/api/**/*.ts'],
};

export const OpenAPIResSchema = z
    .strictObject({
        openapi: z.string().openapi({ example: '3.0.0' }),
        info: z.strictObject({
            version: z.string().openapi({ example: '1.0.0' }),
            title: z.string().openapi({ example: 'KPAS BFF API' }),
            contact: z.strictObject({
                name: z.string().openapi({ example: 'Support' }),
                email: z.string().openapi({ example: 'kompetansesupport@udir.no' }),
                url: z.string().openapi({ example: 'https://kp.udir.no/kontakt/' }),
            }),
            license: z.strictObject({
                name: z.string().openapi({ example: 'Apache 2.0' }),
                url: z
                    .string()
                    .openapi({ example: 'https://www.apache.org/licenses/LICENSE-2.0.html' }),
            }),
        }),
        servers: z.array(
            z.strictObject({
                url: z.string().openapi({ example: 'http://localhost:3000/api' }),
                description: z.string().openapi({ example: 'Local' }),
            }),
        ),
        security: z.array(
            z.strictObject({
                bearerAuth: z
                    .array(z.string().openapi({ example: 'Bearer <JWT>' }))
                    .openapi({ example: [] }),
            }),
        ),
        tags: z.array(
            z.strictObject({
                name: z.string().openapi({ example: 'OpenAPI' }),
            }),
        ),
        components: z.strictObject({
            securitySchemes: z.strictObject({
                bearerAuth: z.strictObject({
                    type: z.string().openapi({ example: 'http' }),
                    scheme: z.string().openapi({ example: 'bearer' }),
                    bearerFormat: z.string().openapi({ example: 'JWT' }),
                }),
            }),
            schemas: z.object({}),
        }),
        paths: z.object({
            '/openapi': z.object({
                get: z.object({
                    summary: z.string().openapi({ example: 'OpenAPI v3' }),
                    description: z
                        .string()
                        .openapi({ example: 'Retrieve OpenAPI v3 documentation' }),
                    tags: z.array(z.string().openapi({ example: 'OpenAPI' })),
                    responses: z.object({
                        200: z.object({
                            description: z.string().openapi({ example: 'OK' }),
                            content: z.object({
                                'application/json': z.object({
                                    schema: z.object({}),
                                }),
                            }),
                        }),
                    }),
                }),
            }),
        }),
    })
    .openapi('OpenAPIRes');

export type IOpenAPIRes = z.infer<typeof OpenAPIResSchema>;
