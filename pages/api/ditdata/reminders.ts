// pages/api/ditdata/reminders.ts
import type { NextApiRequest, NextApiResponse } from 'next';

import {
    Task,
    getFromCache,
    setCache,
    authenticateSharePoint,
    downloadExcel,
    parseExcel,
    transformToTasks,
} from '@/shared/utils/reminders';

const handler = async (req: NextApiRequest, res: NextApiResponse<Task[] | { error: string }>) => {
    try {
        const file = req.query.file as string;
        if (!file) throw new Error('File parameter is required');

        const cached = getFromCache(file);
        if (cached) {
            return res.status(200).json(cached);
        }

        const auth = await authenticateSharePoint(file);
        const buffer = await downloadExcel(auth.url, auth.cookie);

        const data = parseExcel(buffer);
        const tasks = transformToTasks(data);

        setCache(file, tasks);
        res.status(200).json(tasks);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to process file';
        console.error('Error:', message);
        res.status(500).json({ error: message });
    }
};

export default handler;
