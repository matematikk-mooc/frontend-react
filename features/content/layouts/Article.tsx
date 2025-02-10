import { Alert } from '@navikt/ds-react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import DefaultLayout, { Props } from '@/shared/layouts/Default';

interface ArticleProps extends Props {
    title: string;
    description?: string;
    locale: string;
}

function Article({
    id,
    className,
    children,
    template,
    mainClassName,
    title,
    description,
    locale,
}: ArticleProps) {
    const { t } = useTranslation(['common']);
    const router = useRouter();

    const localeName = router.locale ?? 'nb';
    const hasTranslation = localeName === locale;

    return (
        <DefaultLayout
            className={clsx('content-layout-article', className ?? false)}
            id={id}
            mainClassName={mainClassName}
            template={template}
        >
            <div className="mx-5">
                <div className="mx-auto mb-28 mt-10 flex max-w-2xl flex-col">
                    {!hasTranslation && (
                        <Alert className="mb-5" variant="warning">
                            {t('common:language_not_available')}
                        </Alert>
                    )}

                    <div className="flex flex-col" lang={!hasTranslation ? locale : undefined}>
                        <div className="mb-8 border-b border-udir-black">
                            <h1>{title}</h1>

                            {description && <p className="text-lg sm:text-xl">{description}</p>}
                        </div>

                        {children}
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}

export default Article;
