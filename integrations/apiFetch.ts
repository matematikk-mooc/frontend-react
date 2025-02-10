import z from '@/shared/utils/validate';

export const responseMessageSchema = z
    .strictObject({
        id: z.string().openapi({ example: 'CWTgwp' }), // https://shortunique.id/
        service: z.string().openapi({ example: 'bff' }),
        title: z.string().openapi({ example: 'Error' }),
        description: z.string().openapi({ example: 'An error occurred' }),
        type: z.enum(['info', 'warning', 'error']).openapi({ example: 'error' }),
        visibility: z.enum(['public', 'private', 'debug']).openapi({ example: 'public' }),
        dateTime: z.string().openapi({ example: '2021-09-01T12:00:00Z' }),
    })
    .openapi('ResponseMessage');
export type IResponseMessage = z.infer<typeof responseMessageSchema>;

const responseRedirectSchema = z
    .strictObject({
        url: z.string().openapi({ example: 'https://example.com/redirect_path' }),
        requestUrl: z.string().openapi({ example: 'https://example.com' }),
        statusCode: z.number().openapi({ example: 302 }),
    })
    .openapi('ResponseRedirect');
export type IResponseRedirect = z.infer<typeof responseRedirectSchema>;

export const responseSchema = z
    .strictObject({
        error: z.boolean().openapi({ example: false }),
        statusCode: z.number().openapi({ example: 200 }),
        redirect: responseRedirectSchema.nullable().openapi({ example: null }),
        messages: z.array(responseMessageSchema).openapi({ example: [] }),
        payload: z.unknown().openapi({ example: null }),
    })
    .openapi('Response');
export type IResponse<TBody> = z.infer<typeof responseSchema> & { payload: TBody };

export type IFetchOptions<TBody> = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: Record<string, TBody>;
    params?: Record<string, string>;
};

export const apiResponse = <TBody>(payload: TBody): IResponse<TBody> => ({
    error: false,
    statusCode: 200,
    redirect: null,
    messages: [],
    payload,
});

const apiFetch = async <TRes, TBody = unknown>(
    baseURL: string,
    endpoint: string,
    options: IFetchOptions<TBody> = {},
): Promise<TRes> => {
    const { method = 'GET', headers = {}, body, params } = options;
    const url = new URL(`${baseURL}${endpoint}`);
    const defaultHeaders: Record<string, string> = { 'Content-Type': 'application/json' };

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
    }

    const res = await fetch(url.toString(), {
        method,
        headers: { ...defaultHeaders, ...headers },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
    return (await res.json()) as TRes;
};

export default apiFetch;
