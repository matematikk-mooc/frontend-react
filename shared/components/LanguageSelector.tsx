import { LanguageIcon } from '@navikt/aksel-icons';
import { Popover } from '@navikt/ds-react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useRef, useState } from 'react';

import BaseLink from '@/shared/components/BaseLink';
import { DefaultProps } from '@/shared/interfaces/react';
import { getRouterQuery, getTemplateName, getTranslatedPath } from '@/shared/utils/language';

const PopoverContent = Popover.Content;

interface ItemProps {
    href: string;
    title: string;
    locale: string;
    selectedLocale: string;
    onClick: () => void;
}

function LanguageItem({ href, title, locale, selectedLocale, onClick }: ItemProps) {
    const isActive = locale === selectedLocale;
    if (isActive) return <span className="font-semibold">{title}</span>;

    return (
        <BaseLink
            className="underline hover-focus:no-underline"
            href={href}
            locale={locale}
            onClick={onClick}
        >
            {title}
        </BaseLink>
    );
}

interface Props extends DefaultProps {
    iconStack?: boolean;
}

function LanguageSelector({ id, className, iconStack }: Props) {
    const { t } = useTranslation(['common']);
    const [openState, setOpenState] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const router = useRouter();
    const localeName = router?.locale ?? 'nb';
    const routerPath = router?.pathname;
    const routerQuery = getRouterQuery(router?.query);
    const templateName = getTemplateName(routerPath);

    return (
        <div className={clsx(className ?? false)} id={id}>
            <button
                ref={buttonRef}
                aria-expanded={openState}
                aria-label={t('common:language_selector_label')}
                className={clsx(
                    'flex items-center justify-center no-underline hover-focus:underline',
                    iconStack ? 'flex-col' : 'flex-row',
                )}
                type="button"
                onClick={() => setOpenState(!openState)}
            >
                <LanguageIcon className={clsx(iconStack ? 'mb-1' : 'mr-1')} fontSize="24px" />

                <span className={clsx('uppercase', iconStack && 'text-xs')}>{localeName}</span>
            </button>

            <Popover
                anchorEl={buttonRef.current}
                open={openState}
                placement="bottom-end"
                onClose={() => setOpenState(false)}
            >
                <PopoverContent className="px-8 py-3">
                    <ul className="flex flex-col items-center justify-start">
                        <li className="mb-2">
                            <LanguageItem
                                href={getTranslatedPath(templateName, 'nb', routerQuery)}
                                locale="nb"
                                selectedLocale={localeName}
                                title="NB"
                                onClick={() => setOpenState(false)}
                            />
                        </li>

                        <li>
                            <LanguageItem
                                href={getTranslatedPath(templateName, 'nn', routerQuery)}
                                locale="nn"
                                selectedLocale={localeName}
                                title="NN"
                                onClick={() => setOpenState(false)}
                            />
                        </li>
                    </ul>
                </PopoverContent>
            </Popover>
        </div>
    );
}

export default LanguageSelector;
