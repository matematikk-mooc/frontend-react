import '@/styles/globals.scss';

import type { AppProps } from 'next/app';
import Head from 'next/head';
import { appWithTranslation } from 'next-i18next';

// eslint-disable-next-line import/extensions, @typescript-eslint/ban-ts-comment
// @ts-expect-error
// eslint-disable-next-line import/extensions
import nextI18NextConfig from '../next-i18next.config.js';

function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <meta
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                    name="viewport"
                />

                <link href="/apple-touch-icon.png?v=1.0.0" rel="apple-touch-icon" sizes="180x180" />
                <link href="/favicon-32x32.png?v=1.0.0" rel="icon" sizes="32x32" type="image/png" />
                <link href="/favicon-16x16.png?v=1.0.0" rel="icon" sizes="16x16" type="image/png" />

                <link href="/site.webmanifest?v=1.0.0" rel="manifest" />
                <link href="/favicon.ico?v=1.0.0" rel="shortcut icon" />
                <meta content="#ffffff" name="msapplication-TileColor" />
                <meta content="#ffffff" name="theme-color" />
            </Head>

            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Component {...pageProps} />
        </>
    );
}

export default appWithTranslation(App, nextI18NextConfig);
