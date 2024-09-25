import { ChevronUpIcon } from '@navikt/aksel-icons';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';

import { DefaultProps } from '@/shared/interfaces/react';

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });

    if (window.location.hash) {
        window.history.pushState(
            '',
            document.title,
            window.location.pathname + window.location.search,
        );
    }
};

function ScrollToTop({ id, className }: DefaultProps) {
    const { t } = useTranslation(['common']);

    return (
        <button
            aria-label={t('common:scroll_to_top_label')}
            className={clsx(
                'mt-10 flex items-center justify-center rounded-medium border border-udir-white bg-udir-white py-1 pl-2 pr-3 text-sm text-udir-black transition-all hover-focus:bg-udir-black hover-focus:text-udir-white lg:mb-5 lg:mt-0',
                className ?? false,
            )}
            id={id}
            type="button"
            onClick={scrollToTop}
        >
            <ChevronUpIcon className="mr-1" fontSize="20px" />

            <span>{t('common:scroll_to_top')}</span>
        </button>
    );
}

export default ScrollToTop;
