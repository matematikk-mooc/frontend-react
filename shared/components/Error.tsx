import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import BaseLink from '@/shared/components/BaseLink';
import ExternalLink from '@/shared/components/ExternalLink';
import { DefaultProps } from '@/shared/interfaces/react';
import { getTranslatedPath } from '@/shared/utils/language';

interface Props extends DefaultProps {
    title: string;
    description: string;
}

function Error({ title, description }: Props) {
    const { t } = useTranslation(['common']);

    const router = useRouter();
    const localeName = router?.locale ?? 'nb';

    return (
        <div className="mx-auto mb-20 max-w-2xl py-10 text-center">
            <h1>{title}</h1>

            <p className="mb-10">{description}</p>

            <p className="mb-3">{t('common:useful_links_title')}</p>

            <div className="mb-8 flex flex-col justify-center gap-3 md:flex-row md:gap-6">
                <ExternalLink
                    ariaLabel=""
                    href="https://bibsys.instructure.com/search/all_courses?design=udir"
                >
                    {t('common:useful_links_home')}
                </ExternalLink>

                <BaseLink
                    href={`${getTranslatedPath('/contact/', localeName)}#faq`}
                    locale={localeName}
                >
                    {t('common:useful_links_faq')}
                </BaseLink>

                <BaseLink href={getTranslatedPath('/contact/', localeName)} locale={localeName}>
                    {t('common:useful_links_contact')}
                </BaseLink>
            </div>
        </div>
    );
}

export default Error;
