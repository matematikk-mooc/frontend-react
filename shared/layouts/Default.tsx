import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import { ReactNode } from 'react';

import Footer from '@/shared/components/Footer';
import Header from '@/shared/components/Header';
import SkipLink from '@/shared/components/SkipLink';
import { DefaultProps } from '@/shared/interfaces/react';

export interface Props extends DefaultProps {
    template: string;
    mainClassName?: string;
    children: ReactNode;
    title?: string;
}

function Default({ id, className, children, template, mainClassName, title }: Props) {
    const { t } = useTranslation(['common']);

    return (
        <div
            className={clsx(
                'shared-layout-default',
                template && `page-template-${template}`,
                className ?? false,
            )}
            id={id}
        >
            <SkipLink href="#main-content" title={t('common:skip_links_main')} />
            <SkipLink href="#footer" title={t('common:skip_links_footer')} />

            <div className="relative flex size-full min-h-screen flex-col">
                <Header id="main-header" title={title} />

                <main
                    className={clsx('flex w-full grow flex-col', mainClassName ?? false)}
                    id="main-content"
                >
                    {children}
                </main>
            </div>

            <Footer id="main-footer" />
        </div>
    );
}

export default Default;
