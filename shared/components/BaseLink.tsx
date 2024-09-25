import clsx from 'clsx';
import Link from 'next/link';

import { DefaultProps } from '@/shared/interfaces/react';

interface Props extends DefaultProps {
    href: string;
    locale?: string;
    children: React.ReactNode;
    onClick?: () => void;
}

const emptyFunction = () => {};

function BaseLink({ id, className, href, locale, children, onClick }: Props) {
    return (
        <Link
            className={clsx(
                'shared-component-base_link text-udir-black underline hover-focus:no-underline',
                className ?? false,
            )}
            href={href}
            id={id}
            locale={locale ?? false}
            onClick={onClick ?? emptyFunction}
        >
            {children}
        </Link>
    );
}

export default BaseLink;
