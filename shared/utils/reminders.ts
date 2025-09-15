import ExcelJS from 'exceljs';

export interface Task {
    title: string;
    url?: string;
    expiration_date: string;
    days_left: number;
    [key: string]: unknown;
}

interface CacheEntry {
    data: Task[];
    timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 1 * 30 * 1000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const parseDate = (value: unknown): Date | null => {
    if (!value) return null;
    if (value instanceof Date) return value;

    if (typeof value === 'number') {
        const excelEpoch = new Date(1899, 11, 30);
        const msPerDay = 24 * 60 * 60 * 1000;
        return new Date(excelEpoch.getTime() + value * msPerDay);
    }

    if (typeof value === 'string') {
        if (value.includes('/')) {
            const [month, day, year] = value.split('/').map(Number);
            if (year && month && day) return new Date(year, month - 1, day);
        }
        return new Date(value);
    }

    return null;
};

export const fetchWithRetry = async (
    url: string,
    options: RequestInit,
    maxRetries = 3,
): Promise<Response> => {
    let lastError: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.ok || response.status === 302) {
                return response;
            }
            throw new Error(`HTTP ${response.status}`);
        } catch (error) {
            lastError = error instanceof Error ? error : new Error('Unknown error');
            if (i < maxRetries - 1) {
                await sleep(Math.pow(2, i) * 1000);
            }
        }
    }

    throw lastError || new Error('Failed after retries');
};

export const getFromCache = (key: string): Task[] | null => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }
    return null;
};

export const setCache = (key: string, data: Task[]): void => {
    cache.set(key, { data, timestamp: Date.now() });
};

export const authenticateSharePoint = async (
    fileUrl: string,
): Promise<{ url: string; cookie: string }> => {
    const domain = 'utdanningsdirektoratet-my.sharepoint.com';
    const url = `https://${domain}${fileUrl.startsWith('/') ? fileUrl : `/${fileUrl}`}`;

    const authResponse = await fetchWithRetry(url, {
        redirect: 'manual',
        headers: {
            'User-Agent': 'PostmanRuntime/7.43.3',
            Accept: '*/*',
            Host: domain,
        },
    });

    const redirectUrl = authResponse.headers.get('Location');
    const authCookie = authResponse.headers.get('Set-Cookie');

    if (!redirectUrl || !authCookie) {
        throw new Error('Authentication failed');
    }

    const cookieValue = authCookie.split(';')[0];
    if (!cookieValue) {
        throw new Error('Invalid cookie format');
    }

    return {
        url: redirectUrl.startsWith('http') ? redirectUrl : `https://${domain}${redirectUrl}`,
        cookie: cookieValue,
    };
};

export const downloadExcel = async (url: string, cookie: string): Promise<ArrayBuffer> => {
    const response = await fetchWithRetry(url, {
        headers: { Cookie: cookie } as HeadersInit,
    });

    if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
    }

    return response.arrayBuffer();
};

export const parseExcel = async (buffer: ArrayBuffer): Promise<unknown[][]> => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    const worksheet = workbook.worksheets[0];
    if (!worksheet) throw new Error('No sheets found');

    const data: unknown[][] = [];
    worksheet.eachRow({ includeEmpty: false }, (row) => {
        const rowData = row.values as unknown[];
        data.push(rowData.slice(1));
    });

    if (data.length < 2) throw new Error('No data found');
    return data;
};

export const transformToTasks = (data: unknown[][]): Task[] => {
    const headers = data[0] as string[];
    const rows = data.slice(1) as unknown[][];
    const today = new Date();

    return rows
        .map(row => {
            const task: Record<string, unknown> = Object.fromEntries(
                headers.map((h, i) => [h, row[i] ?? '']),
            );

            const expirationDate = parseDate(task.expiration_date);
            if (!expirationDate) return null;

            const urlString = typeof task.url === 'string' ? task.url : '';
            const taskId = urlString.match(/DIT-(\d+)/i)?.[0]?.toUpperCase();
            const title = typeof task.title === 'string' ? task.title : '';

            return {
                ...task,
                title: taskId ? `[${taskId}] ${title}` : title,
                expiration_date: expirationDate.toISOString().split('T')[0],
                days_left: Math.max(
                    0,
                    Math.ceil((expirationDate.getTime() - today.getTime()) / 86400000),
                ),
            } as Task;
        })
        .filter((task): task is Task => task !== null);
};
