import { ChevronRightIcon } from '@navikt/aksel-icons';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { TFunction, useTranslation } from 'next-i18next';

import BaseLink from '@/shared/components/BaseLink';
import ExternalLink from '@/shared/components/ExternalLink';
import { DefaultProps } from '@/shared/interfaces/react';
import { getTemplateName, getTranslatedPath } from '@/shared/utils/language';

interface Breadcrumb {
    id: number;
    name: string;
    url: string;
    external?: boolean;
}

const getBreadcrumbs = (locale: string, routerPath: string, t: TFunction): Breadcrumb[] => {
    const templateName = getTemplateName(routerPath);
    const breadcrumbs: Breadcrumb[] = [
        {
            id: 1,
            name: t('common:breadcrumbs_home'),
            url: 'https://bibsys.instructure.com/search/all_courses?design=udir',
            external: true,
        },
    ];

    if (routerPath === '/500') {
        breadcrumbs.push({
            id: 2,
            name: t('common:500_title'),
            url: '/500',
        });
    } else if (routerPath === '/404') {
        breadcrumbs.push({
            id: 2,
            name: t('common:404_title'),
            url: '/404',
        });
    } else if (routerPath === '/contact') {
        breadcrumbs.push({
            id: 2,
            name: t('common:breadcrumbs_contact'),
            url: getTranslatedPath(templateName, locale),
        });
    } else if (routerPath === '/privacy') {
        breadcrumbs.push({
            id: 2,
            name: t('common:breadcrumbs_privacy'),
            url: getTranslatedPath(templateName, locale),
        });
    } else if (routerPath === '/about') {
        breadcrumbs.push({
            id: 2,
            name: t('common:breadcrumbs_about'),
            url: getTranslatedPath(templateName, locale),
        });
    }

    return breadcrumbs;
};

interface BreadcrumbItemProps {
    name: string;
    url: string;
    isExternal: boolean;
    isLast: boolean;
}

function BreadcrumbItemLink({ name, url, isExternal, isLast }: BreadcrumbItemProps) {
    if (isLast) return <span className="font-semibold">{name}</span>;
    if (isExternal)
        return (
            <ExternalLink ariaLabel="" className="text-udir-white" href={url}>
                {name}
            </ExternalLink>
        );

    return <BaseLink href={url}>{name}</BaseLink>;
}

function BreadcrumbItem({ name, url, isExternal, isLast }: BreadcrumbItemProps) {
    return (
        <li className="flex items-center justify-center max-sm:mb-2">
            <BreadcrumbItemLink isExternal={isExternal} isLast={isLast} name={name} url={url} />

            {!isLast && (
                <span className="mx-1">
                    <ChevronRightIcon fontSize="14px" />
                </span>
            )}
        </li>
    );
}

function Breadcrumbs({ id, className }: DefaultProps) {
    const { t } = useTranslation(['common']);

    const router = useRouter();
    const localeName = router?.locale ?? 'nb';
    const routerPath = router?.pathname;
    const breadcrumbsItems = getBreadcrumbs(localeName, routerPath, t);

    return (
        <div
            className={clsx(
                'bg-udir-black px-5 text-sm text-udir-white lg:px-10',
                className ?? false,
            )}
            id={id}
        >
            <div
                className="mx-auto flex w-full max-w-7xl items-start justify-start py-2.5"
                id="breadcrumbs"
            >
                <span className="mr-3 flex shrink-0 grow-0 max-sm:mb-2">
                    {t('common:breadcrumbs_you_are_here')}
                </span>

                <nav aria-label="Brødsmulesti">
                    <ul className="flex flex-wrap">
                        {breadcrumbsItems?.map(item => (
                            <BreadcrumbItem
                                key={item.id}
                                isExternal={item.external ?? false}
                                isLast={item.id === breadcrumbsItems.length}
                                name={item.name}
                                url={item.url}
                            />
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default Breadcrumbs;
