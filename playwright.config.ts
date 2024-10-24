import path from 'path';

import { defineConfig, devices } from '@playwright/test';

const PORT = process.env.PORT || 3000;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
    timeout: 30 * 1000,
    outputDir: 'test-results/',
    testDir: path.join(__dirname, 'tests'),

    use: {
        baseURL,
        trace: 'retry-with-trace',
    },
    projects: [
        {
            name: 'Desktop Chrome',
            use: {
                ...devices['Desktop Chrome'],
            },
        },
    ],
});
