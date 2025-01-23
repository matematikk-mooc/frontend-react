import type { NextApiRequest, NextApiResponse } from 'next';

import { apiResponse, IResponse } from '@/integrations/apiFetch';

const handler = async (_req: NextApiRequest, res: NextApiResponse<IResponse<null>>) => {
    const notFoundRes = apiResponse<null>(null);
    notFoundRes.error = true;
    notFoundRes.statusCode = 404;
    notFoundRes.messages.push({
        id: 'LiX6dz',
        service: 'bff',
        title: 'Not Found',
        description: 'The requested resource was not found.',
        type: 'error',
        visibility: 'public',
        dateTime: new Date().toISOString(),
    });

    return res.status(notFoundRes.statusCode).json(notFoundRes);
};

export default handler;
