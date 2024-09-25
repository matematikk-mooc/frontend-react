import { ExternalLinkIcon } from '@navikt/aksel-icons';
import clsx from 'clsx';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import BaseLink from '@/shared/components/BaseLink';
import ExternalLink from '@/shared/components/ExternalLink';
import LinkSeperator from '@/shared/components/LinkSeperator';
import ScrollToTop from '@/shared/components/ScrollToTop';
import { DefaultProps } from '@/shared/interfaces/react';
import { getTranslatedPath } from '@/shared/utils/language';
import { addParamsToUrl, utmConfig } from '@/shared/utils/url';

function ExternalLinkIconComponent() {
    return <ExternalLinkIcon className="mb-1 ml-0.5" fontSize="16px" />;
}

function Footer({ id, className }: DefaultProps) {
    const { t } = useTranslation(['common']);

    const router = useRouter();
    const localeName = router?.locale ?? 'nb';

    return (
        <footer
            className={clsx(
                'shared-component-footer w-full bg-udir-black px-5 text-udir-white lg:px-10',
                className ?? false,
            )}
            id={id}
        >
            <div className="mx-auto flex max-w-7xl flex-col justify-between pb-6 pt-12 max-sm:pb-8 lg:flex-row">
                <div className="mb-5 flex flex-col items-center justify-center lg:mb-0 lg:mr-20 lg:items-start">
                    <a
                        aria-label={t('common:footer_udir_logo_label')}
                        className="mb-2 flex flex-col items-start justify-center text-udir-white lg:mb-0 lg:mr-20"
                        href={addParamsToUrl('https://udir.no/', utmConfig)}
                        rel="noreferrer noopener"
                        target="_blank"
                    >
                        <Image
                            alt="Utdanningsdirektoratet logo"
                            className="mb-2 lg:mb-5"
                            height={60}
                            loading="lazy"
                            src="/udir/udir-logo-white.png"
                            width={209}
                        />
                    </a>

                    <span className="max-sm:text-center">{t('common:footer_delivered_by')}</span>
                </div>

                <div className="flex flex-col-reverse items-center justify-center lg:flex-col lg:items-end lg:justify-between">
                    <ScrollToTop />

                    <nav
                        aria-label={t('common:footer_links_label')}
                        className="flex max-sm:flex-col"
                    >
                        <BaseLink
                            className="text-udir-white max-sm:mb-2 max-sm:text-center"
                            href={`${getTranslatedPath('/contact/', localeName)}#faq`}
                            locale={localeName}
                        >
                            {t('common:footer_links_faq')}
                        </BaseLink>

                        <LinkSeperator className="max-sm:hidden" size="medium" />

                        <BaseLink
                            className="text-udir-white max-sm:mb-2 max-sm:text-center"
                            href={getTranslatedPath('/about/', localeName)}
                            locale={localeName}
                        >
                            {t('common:footer_links_about')}
                        </BaseLink>

                        <LinkSeperator className="max-sm:hidden" size="medium" />

                        <BaseLink
                            className="text-udir-white max-sm:mb-2 max-sm:text-center"
                            href={getTranslatedPath('/contact/', localeName)}
                            locale={localeName}
                        >
                            {t('common:footer_links_contact')}
                        </BaseLink>
                    </nav>
                </div>
            </div>

            <div className="mx-auto max-w-7xl border-t border-gray-700">
                <nav
                    aria-label={t('common:footer_sub_links_label')}
                    className="mx-auto flex max-w-7xl justify-between py-5 text-center max-sm:flex-col max-sm:items-center"
                >
                    <BaseLink
                        className="mr-20 text-right text-udir-white max-sm:mb-6 max-sm:mr-0"
                        href={getTranslatedPath('/privacy/', localeName)}
                        locale={localeName}
                    >
                        {t('common:footer_sub_links_privacy')}
                    </BaseLink>

                    <div className="flex max-sm:flex-col">
                        <span className="mr-3 max-sm:mb-2 max-sm:mr-0">
                            {t('common:footer_sub_links_accessibility')}
                        </span>

                        <ExternalLink
                            AfterIcon={ExternalLinkIconComponent}
                            ariaLabel={t('common:footer_accessibility_nb_label')}
                            className="text-udir-white max-sm:mb-2"
                            href="https://uustatus.no/nb/erklaringer/publisert/2796ebc6-161f-4dc9-9429-70d7dd136431"
                        >
                            {t('common:footer_accessibility_nb')}
                        </ExternalLink>

                        <LinkSeperator size="small" />

                        <ExternalLink
                            AfterIcon={ExternalLinkIconComponent}
                            ariaLabel={t('common:footer_accessibility_nn_label')}
                            className="text-udir-white"
                            href="https://uustatus.no/nn/erklaringer/publisert/2796ebc6-161f-4dc9-9429-70d7dd136431"
                        >
                            {t('common:footer_accessibility_nn')}
                        </ExternalLink>
                    </div>
                </nav>
            </div>
        </footer>
    );
}

export default Footer;
