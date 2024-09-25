import clsx from 'clsx';

import { DefaultProps } from '@/shared/interfaces/react';
import { addParamsToUrl, utmConfig } from '@/shared/utils/url';

interface Props extends DefaultProps {
    href: string;
    ariaLabel: string;
    children: React.ReactNode;
    openInNewTab?: boolean;
    hideUnderline?: boolean;
    BeforeIcon?: React.FC;
    AfterIcon?: React.FC;
}

function ExternalLink({
    id,
    className,
    children,
    href,
    ariaLabel,
    BeforeIcon,
    AfterIcon,
    openInNewTab = false,
    hideUnderline = false,
}: Props) {
    return (
        <a
            aria-label={ariaLabel}
            className={clsx(
                'shared-component-external_link inline-flex items-end justify-center text-udir-black',
                hideUnderline
                    ? 'no-underline hover-focus:underline'
                    : 'underline hover-focus:no-underline',
                className ?? false,
            )}
            href={addParamsToUrl(href, utmConfig)}
            id={id}
            rel={openInNewTab ? 'noreferrer noopener' : ''}
            target={openInNewTab ? '_blank' : '_self'}
        >
            {BeforeIcon && <BeforeIcon />}

            <span className="mr-0.5">{children}</span>

            {AfterIcon && <AfterIcon />}
        </a>
    );
}

export default ExternalLink;
