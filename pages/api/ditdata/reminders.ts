/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next';
import * as XLSX from 'xlsx';

const parseExpirationDate = (value: any) => {
    if (!value) return null;

    if (
        typeof value === 'object' &&
        value !== null &&
        'y' in value &&
        'm' in value &&
        'd' in value
    ) {
        return new Date(value.y, value.m - 1, value.d, value.H || 0, value.M || 0, value.S || 0);
    }

    if (typeof value === 'number') {
        const dateInfo = XLSX.SSF.parse_date_code(value);
        return new Date(
            dateInfo.y,
            dateInfo.m - 1,
            dateInfo.d,
            dateInfo.H || 0,
            dateInfo.M || 0,
            dateInfo.S || 0,
        );
    }

    if (typeof value === 'string') {
        if (value.includes('/')) {
            const parts: any = value.split('/');
            if (parts.length === 3) {
                return new Date(
                    parseInt(parts[2], 10),
                    parseInt(parts[0], 10) - 1,
                    parseInt(parts[1], 10),
                );
            }
        }
        return new Date(value);
    }

    throw new Error(`Unsupported date format: ${typeof value} - ${value}`);
};

const extractTaskId = (url: any) => {
    if (!url || typeof url !== 'string') return null;

    const match = url.match(/DIT-(\d+)/i);
    return match ? match[0].toUpperCase() : null;
};

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

        const arrayBuffer = await finalResponse.arrayBuffer();
        if (!arrayBuffer || arrayBuffer.byteLength === 0)
            throw new Error('Excel content is empty or undefined');

        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) throw new Error('No sheets found in Excel file');

        const worksheet: any = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { header: 1 });

        if (!rawData || rawData.length === 0)
            throw new Error('Excel does not contain any valid data');
        const headers = rawData[0] as string[];
        if (!headers || headers.length === 0) throw new Error('Excel headers not found');

        const tasks: any[] = [];
        for (let i = 1; i < rawData.length; i++) {
            const row = rawData[i] as any[];

            const taskData: Record<string, any> = {};
            headers.forEach((header, index) => (taskData[header] = row[index] ?? ''));

            const expirationDateValue = taskData['expiration_date'];
            const expirationDate = parseExpirationDate(expirationDateValue);
            if (expirationDate === null) continue;

            const expirationDateStr = `${expirationDate.getFullYear()}-${String(
                expirationDate.getMonth() + 1,
            ).padStart(2, '0')}-${String(expirationDate.getDate()).padStart(2, '0')}`;

            const today = new Date();
            const diffMs = expirationDate.getTime() - today.getTime();
            const daysLeft = Math.ceil(diffMs / (1000 * 3600 * 24));

            let titleValue = taskData['title'];
            if (!titleValue || typeof titleValue !== 'string' || titleValue.trim() === '')
                throw new Error(`Title not found in row: ${JSON.stringify(row)}`);

            const urlValue = taskData['url'] ?? '';
            const taskId = extractTaskId(urlValue);
            if (taskId !== null) {
                titleValue = `[${taskId}] ${titleValue}`;
            }

            tasks.push({
                ...taskData,
                title: titleValue,
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
