import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import { i18n, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import ErrorComponent from '@/shared/components/Error';
import Default from '@/shared/layouts/Default';

function NotFound() {
    const { t } = useTranslation(['common']);

    return (
        <>
            <Head>
                <title>{`404 | ${t('common:site_title')} - Udir`}</title>
                <meta content="nofollow,noindex" name="robots" />
            </Head>

            <Default mainClassName="justify-center items-center" template="404">
                <div className="px-5">
                    <ErrorComponent
                        description={t('common:404_description')}
                        title={t('common:404_title')}
                    />
                </div>
            </Default>
        </>
    );
}

export const getStaticProps = async ({ locale }: GetStaticPropsContext) => {
    if (process.env.NODE_ENV !== 'production') await i18n?.reloadResources();

    return {
        revalidate: 60,
        props: {
            ...(await serverSideTranslations(locale ?? 'nb', ['common'], null)),
        },
    };
};

export default NotFound;
