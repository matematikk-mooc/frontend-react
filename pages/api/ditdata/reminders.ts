/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    try {
        const { file } = req.query;
        if (!file || typeof file !== 'string')
            throw new Error('file parameter is required and must be a string');

        const domain = 'utdanningsdirektoratet-my.sharepoint.com';
        const initialUrl = `https://${domain}${file.startsWith('/') ? file : `/${file}`}`;
        const initialResponse = await fetch(initialUrl, {
            redirect: 'manual',
            headers: {
                'User-Agent': 'PostmanRuntime/7.43.3',
                Accept: '*/*',
                'Cache-Control': 'no-cache',
                Host: domain,
                'Accept-Encoding': 'gzip, deflate, br',
                Connection: 'keep-alive',
            },
        });

        if (initialResponse.status !== 302)
            throw new Error(`Expected redirect, but got status: ${initialResponse.status}`);

        const redirectUrl = initialResponse.headers.get('Location');
        if (!redirectUrl) throw new Error('No redirect URL found in response');
        const newAuthCookie = initialResponse.headers.get('Set-Cookie');
        if (!newAuthCookie) throw new Error('No auth cookie found in response');

        const baseUrl = `https://${domain}`;
        const fullRedirectUrl = redirectUrl.startsWith('http')
            ? redirectUrl
            : `${baseUrl}${redirectUrl}`;
        const redirectHeaders: any = { Cookie: newAuthCookie.split(';')[0] };

        const finalResponse = await fetch(fullRedirectUrl, { headers: { ...redirectHeaders } });
        if (!finalResponse.ok) throw new Error(`HTTP error! Status: ${finalResponse.status}`);
        const csvText = await finalResponse.text();
        if (!csvText) throw new Error('CSV content is empty or undefined');
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) throw new Error('CSV does not contain any valid lines');
        const headerLine = lines[0];
        if (!headerLine) throw new Error('CSV header is undefined');
        const headers = headerLine.split(',').map(header => header.trim());
        if (headers.length === 0) throw new Error('CSV headers not found');

        const tasks: any[] = [];
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
                ...taskData,
                expiration_date: expirationDateStr,
                days_left: daysLeft,
            });
        }
        res.status(200).json(tasks);
    } catch (error: any) {
        console.error('Error fetching file:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch or process file data' });
    }
};

export default handler;
