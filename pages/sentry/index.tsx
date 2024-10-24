import * as Sentry from '@sentry/nextjs';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { i18n } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState, useEffect } from 'react';

import Article from '@/features/content/layouts/Article';

interface ApiResponse {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
}

interface TestTraceProps {
    serverData: ApiResponse | null;
    serverError: string | null;
}

function TestSentry({ serverData, serverError }: TestTraceProps) {
    const [loading, setLoading] = useState(false);
    const [responseData, setResponseData] = useState<ApiResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
                if (!res.ok) throw new Error(`CSR: Failed to fetch data - ${res.statusText}`);
                const data: ApiResponse = await res.json();

                setResponseData(data);
            } catch (catchError: unknown) {
                const err =
                    catchError instanceof Error ? catchError.message : 'An unknown error occurred';
                setError(err);
                Sentry.captureException(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [error]);

    return (
        <>
            <Head>
                <title>Trace | Test</title>
                <meta content="" name="description" />
                <meta content="nofollow,noindex" name="robots" />
            </Head>

            <Article description="" locale="en" template="trace" title="Trace">
                <div>
                    <h2>Client-Side Request (CSR):</h2>
                    {loading && <p>Loading...</p>}
                    {!loading && responseData && <p>CSR Data: {JSON.stringify(responseData)}</p>}
                    {!loading && error && <p>CSR Error: {error}</p>}

                    <h2>Server-Side Request (SSR):</h2>
                    {serverData && <p>SSR Data: {JSON.stringify(serverData)}</p>}
                    {serverError && <p>SSR Error: {serverError}</p>}

                    <h2>CSR Error:</h2>
                    <button
                        className="rounded-md bg-udir-black px-4 py-2 text-udir-white"
                        type="button"
                        onClick={async () => {
                            await Sentry.startSpan(
                                {
                                    name: 'Example Frontend Span',
                                    op: 'test',
                                },
                                async () => {
                                    const res = await fetch('/api/sentry-example-api');
                                    if (!res.ok) {
                                        throw new Error('Sentry Example Frontend Error');
                                    }
                                },
                            );
                        }}
                    >
                        Throw error!
                    </button>
                </div>
            </Article>
        </>
    );
}

export const getServerSideProps = async ({ locale }: GetServerSidePropsContext) => {
    if (process.env.NODE_ENV !== 'production') await i18n?.reloadResources();

    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/todos/2');
        if (!res.ok) throw new Error(`SSR: Failed to fetch data - ${res.statusText}`);
        const data: ApiResponse = await res.json();

        return {
            props: {
                ...(await serverSideTranslations(locale ?? 'nb', ['common', 'about'], null)),
                serverData: data,
                serverError: null,
            },
        };
    } catch (error: unknown) {
        const err = error instanceof Error ? error.message : 'An unknown error occurred';
        Sentry.captureException(error);
        return { props: { serverData: null, serverError: err } };
    }
};

export default TestSentry;
