import { ChevronRightIcon } from '@navikt/aksel-icons';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { TFunction, useTranslation } from 'next-i18next';

import BaseLink from '@/shared/components/BaseLink';
import ExternalLink from '@/shared/components/ExternalLink';
import { DefaultProps } from '@/shared/interfaces/react';
import { getRouterQuery, getTemplateName, getTranslatedPath } from '@/shared/utils/language';

interface Breadcrumb {
    id: number;
    name: string;
    url: string;
    external?: boolean;
}

const getBreadcrumbs = (
    locale: string,
    routerPath: string,
    routerQuery: Record<string, string>,
    t: TFunction,
    title?: string,
): Breadcrumb[] => {
    const templateName = getTemplateName(routerPath);
    const breadcrumbs: Breadcrumb[] = [
        {
            id: 1,
            name: t('common:breadcrumbs_home'),
            url: 'https://bibsys.instructure.com/search/all_courses?design=udir',
            external: true,
        },
    ];

    if (routerPath === '/500' || routerPath === '/_error') {
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
            url: getTranslatedPath(templateName, locale, routerQuery),
        });
    } else if (routerPath === '/privacy') {
        breadcrumbs.push({
            id: 2,
            name: t('common:breadcrumbs_privacy'),
            url: getTranslatedPath(templateName, locale, routerQuery),
        });
    } else if (routerPath === '/about') {
        breadcrumbs.push({
            id: 2,
            name: t('common:breadcrumbs_about'),
            url: getTranslatedPath(templateName, locale, routerQuery),
        });
    } else if (routerPath === '/courses') {
        breadcrumbs.push({
            id: 2,
            name: t('common:breadcrumbs_courses'),
            url: getTranslatedPath(templateName, locale, routerQuery),
        });
    } else if (routerPath === '/courses/[...courseID]') {
        breadcrumbs.push({
            id: 2,
            name: t('common:breadcrumbs_courses'),
            url: getTranslatedPath('/courses/', locale, routerQuery),
        });

        breadcrumbs.push({
            id: 3,
            name: title ?? 'Pakke',
            url: getTranslatedPath('/courses/:courseID/', locale, routerQuery),
        });
    }

    return breadcrumbs;
};

interface BreadcrumbItemProps {
    name: string;
    url: string;
    isExternal: boolean;
    isLast: boolean;
    locale: string;
}

function BreadcrumbItemLink({ name, url, isExternal, isLast, locale }: BreadcrumbItemProps) {
    if (isLast) return <span className="font-semibold">{name}</span>;
    if (isExternal)
        return (
            <ExternalLink ariaLabel="" className="text-udir-white" href={url}>
                {name}
            </ExternalLink>
        );

    return (
        <BaseLink className="text-udir-white" href={url} locale={locale}>
            {name}
        </BaseLink>
    );
}

function BreadcrumbItem({ name, url, isExternal, isLast, locale }: BreadcrumbItemProps) {
    return (
        <li className="flex items-center justify-center max-sm:mb-2">
            <BreadcrumbItemLink
                isExternal={isExternal}
                isLast={isLast}
                locale={locale}
                name={name}
                url={url}
            />

            {!isLast && (
                <span className="mx-1">
                    <ChevronRightIcon fontSize="14px" />
                </span>
            )}
        </li>
    );
}

interface BreadcrumbsProps extends DefaultProps {
    title?: string;
}

function Breadcrumbs({ id, className, title }: BreadcrumbsProps) {
    const { t } = useTranslation(['common']);

    const router = useRouter();
    const localeName = router?.locale ?? 'nb';
    const routerPath = router?.pathname;
    const routerQuery = getRouterQuery(router?.query);
    const breadcrumbsItems = getBreadcrumbs(localeName, routerPath, routerQuery, t, title);

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
                                locale={localeName}
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
