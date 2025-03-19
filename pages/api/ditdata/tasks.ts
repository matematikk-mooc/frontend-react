/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';

interface Task {
    title: string;
    description: string;
    expiration_date: string;
    days_left: number;
}

const BASE_CSV_URL =
    'https://gist.githubusercontent.com/ajxudir/6b5a99331a719980bdbc83cdbb65042d/raw/';

const handler = async (req: NextApiRequest, res: NextApiResponse<Task[] | { error: string }>) => {
    try {
        const fileParam = req.query.file;
        const fileName = Array.isArray(fileParam) ? fileParam[0] : fileParam;
        if (!fileName) {
            throw new Error('File parameter is required');
        }
        const csvUrl = BASE_CSV_URL + fileName;
        const response = await fetch(csvUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch CSV, received status: ${response.status}`);
        }
        const csvText = await response.text();
        if (!csvText) {
            throw new Error('CSV content is empty or undefined');
        }
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) {
            throw new Error('CSV does not contain any valid lines');
        }
        const headerLine = lines[0];
        if (!headerLine) {
            throw new Error('CSV header is undefined');
        }
        const headers = headerLine.split(',').map(header => header.trim());
        if (headers.length === 0) {
            throw new Error('CSV headers not found');
        }
        const tasks: Task[] = [];
        for (let i = 1; i < lines.length; i++) {
            const row = lines[i]?.split(',').map(value => value.trim());
            if (!row || row.length < headers.length) {
                continue;
            }
            const taskData: Record<string, string> = {};
            headers.forEach((header, index) => {
                taskData[header] = row[index] ?? '';
            });
            const expirationDateStr = taskData['expiration_date'];
            if (!expirationDateStr) {
                continue;
            }
            const expirationDate = new Date(expirationDateStr);
            if (isNaN(expirationDate.getTime())) {
                continue;
            }
            const today = new Date();
            const diffMs = expirationDate.getTime() - today.getTime();
            const daysLeft = Math.ceil(diffMs / (1000 * 3600 * 24));
            tasks.push({
                title: taskData['title'] || 'Untitled',
                description: taskData['description'] || '',
                expiration_date: expirationDateStr,
                days_left: daysLeft,
            });
        }
        res.status(200).json(tasks);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch or process CSV data' });
    }
};

export default handler;
