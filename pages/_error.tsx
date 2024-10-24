import * as Sentry from '@sentry/nextjs';
import { NextPageContext } from 'next';
import NextError from 'next/error';
import Head from 'next/head';
import { i18n, useTranslation, withTranslation } from 'next-i18next';
import { useEffect } from 'react';

import ErrorComponent from '@/shared/components/Error';
import Default from '@/shared/layouts/Default';

function Error() {
    const { t, ready } = useTranslation(['common']);

    useEffect(() => {
        try {
            throw new DOMException('500: Internal Server Error');
        } catch (error) {
            const eventId = Sentry.captureException(error);
            Sentry.showReportDialog({ eventId });
        }

        return () => {
            Sentry.flush(2000);
        };
    }, []);

    if (!ready) return <div suppressHydrationWarning>Loading translations...</div>;

    return (
        <>
            <Head>
                <title>{`500 | ${t('common:site_title')} - Udir`}</title>
                <meta content="nofollow,noindex" name="robots" />
            </Head>

            <Default mainClassName="justify-center items-center" template="500">
                <div className="px-5">
                    <ErrorComponent
                        description={t('common:500_description')}
                        title={t('common:500_title')}
                    />
                </div>
            </Default>
        </>
    );
}

export const getInitialProps = async (contextData: NextPageContext) => {
    await Sentry.captureUnderscoreErrorException(contextData);
    if (process.env.NODE_ENV !== 'production') await i18n?.reloadResources();

    return {
        ...(await NextError.getInitialProps(contextData)),
    };
};

export default withTranslation(['common'], {})(Error);
