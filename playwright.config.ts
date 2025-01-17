import fs from 'fs';
import path from 'path';

import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

const envPaths = [path.resolve(__dirname, '.env'), path.resolve(__dirname, '.env.test')];
envPaths.forEach(envPath => {
    if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath });
    }
});

const PORT = process.env.PORT ?? 3000;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
    outputDir: 'test-results/',
    fullyParallel: true,
    workers: 3,
    timeout: 90_000,
    retries: 3,

    testDir: path.join(__dirname, 'tests'),
    reporter: [['list'], ['json', { outputFile: './playwright-report/results.json' }]],
    use: {
        baseURL,
        trace: 'retain-on-failure',
        video: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },

        {
            name: 'canvas-chromium',
            use: { ...devices['Desktop Chrome'] },
            testDir: path.join(__dirname, 'tests/canvas'),
        },
        {
            name: 'canvas-firefox',
            use: { ...devices['Desktop Firefox'] },
            testDir: path.join(__dirname, 'tests/canvas'),
        },
        {
            name: 'canvas-webkit',
            use: { ...devices['Desktop Safari'] },
            testDir: path.join(__dirname, 'tests/canvas'),
        },

        {
            name: 'headless-chromium',
            use: { ...devices['Desktop Chrome'] },
            testDir: path.join(__dirname, 'tests/headless'),
        },
        {
            name: 'headless-firefox',
            use: { ...devices['Desktop Firefox'] },
            testDir: path.join(__dirname, 'tests/headless'),
        },
        {
            name: 'headless-webkit',
            use: { ...devices['Desktop Safari'] },
            testDir: path.join(__dirname, 'tests/headless'),
        },
    ],
});
