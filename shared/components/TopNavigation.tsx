import { EnterIcon } from '@navikt/aksel-icons';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';

import ExternalLink from '@/shared/components/ExternalLink';
import LanguageSelector from '@/shared/components/LanguageSelector';
import LinkSeperator from '@/shared/components/LinkSeperator';
import MobileNavigation from '@/shared/components/MobileNavigation';
import { DefaultProps } from '@/shared/interfaces/react';

interface TopNavigationProps extends DefaultProps {
    fixed: boolean;
}

function LoginIcon() {
    return <EnterIcon className="mr-2" fontSize="24px" />;
}

function TopNavigation({ id, className, fixed }: TopNavigationProps) {
    const { t } = useTranslation(['common']);

    return (
        <div
            className={clsx(
                'z-tooltip w-full px-5 lg:px-10',
                fixed ? 'fixed left-0 top-0 bg-white shadow-md' : 'relative',
                className ?? false,
            )}
            id={id}
        >
            <div
                className={clsx(
                    'mx-auto flex max-w-7xl items-center justify-between',
                    fixed ? 'py-3' : 'py-6 max-sm:py-4',
                )}
            >
                <div className="mr-20 max-sm:mr-8">
                    <ExternalLink
                        ariaLabel={t('common:top_navigation_frontpage_label')}
                        href="https://bibsys.instructure.com/search/all_courses?design=udir"
                        hideUnderline
                    >
                        <h1 className="relative !mb-0 flex">
                            <span className="mr-2 text-2xl font-semibold max-sm:text-lg">
                                {t('common:site_title')}
                            </span>

                            <span className="relative top-2 text-sm font-normal max-sm:right-1 max-sm:top-2 max-sm:text-xs">
                                v2
                            </span>
                        </h1>

                        <span className="text-sm">Utdanningsdirektoratet</span>
                    </ExternalLink>
                </div>

                <nav aria-label={t('common:top_navigation_label')} className="hidden sm:flex">
                    <ul className="flex items-center justify-center">
                        <li className="flex">
                            <ExternalLink
                                ariaLabel={t('common:top_navigation_login_label')}
                                BeforeIcon={LoginIcon}
                                href="https://bibsys.instructure.com/courses"
                                hideUnderline
                            >
                                <span>{t('common:top_navigation_login')}</span>
                            </ExternalLink>

                            <LinkSeperator size="small" />
                        </li>

                        <li>
                            <LanguageSelector />
                        </li>
                    </ul>
                </nav>

                <MobileNavigation className="flex sm:hidden" />
            </div>
        </div>
    );
}

export default TopNavigation;
