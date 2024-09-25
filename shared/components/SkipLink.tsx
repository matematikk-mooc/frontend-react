import clsx from 'clsx';

import { DefaultProps } from '@/shared/interfaces/react';

interface Props extends DefaultProps {
    href: string;
    title: string;
}

function SkipLink({ id, className, href, title }: Props) {
    return (
        <a
            aria-label={title}
            className={clsx(
                'fixed bottom-0 left-0 flex w-full translate-y-full justify-center bg-udir-black p-4 text-udir-white transition-transform duration-300 focus:z-50 focus:translate-y-0',
                className ?? false,
            )}
            href={href}
            id={id}
        >
            <span className="rounded bg-udir-white px-4 py-2 text-udir-black focus:outline-none focus:ring-2 focus:ring-udir-white focus:ring-offset-2">
                {title}
            </span>
        </a>
    );
}

export default SkipLink;
