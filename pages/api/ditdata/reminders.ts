import type { NextApiRequest, NextApiResponse } from 'next';

import {
    Task,
    authenticateSharePoint,
    downloadExcel,
    parseExcel,
    transformToTasks,
} from '@/shared/utils/reminders';

const handler = async (req: NextApiRequest, res: NextApiResponse<Task[] | { error: string }>) => {
    try {
        const file = req.query.file as string;
        const type = req.query.type as string;
        if (!file) throw new Error('File parameter is required');

        const auth = await authenticateSharePoint(file);
        const buffer = await downloadExcel(auth.url, auth.cookie);

        const data = await parseExcel(buffer);
        let tasks = transformToTasks(data);

        if (type === 'alert') {
            tasks = tasks.map(task => ({
                ...task,
                days_left: task.days_left === 0 ? 0 : Math.ceil(task.days_left / 7) * 7,
            }));
        }

        res.status(200).json(tasks);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to process file';
        console.error('Error:', message);
        res.status(500).json({ error: message });
    }
};

export default handler;
