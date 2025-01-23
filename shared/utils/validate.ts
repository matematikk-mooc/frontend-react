import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import z, { ZodError } from 'zod';

extendZodWithOpenApi(z);

export default z;

export const parseErrorMessage = (errorInstance: ZodError) => {
    return errorInstance.issues
        ?.map(issue => {
            const { code = '', message, path = [] } = issue;

            let fieldPath = path.join('.');
            if (fieldPath === '') fieldPath = '.';

            return `Schema validation failed for "${fieldPath}" (type: ${code}; message: ${message}).`;
        })
        .join(' ');
};
