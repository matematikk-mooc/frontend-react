import clsx from 'clsx';

import { DefaultProps } from '@/shared/interfaces/react';

interface Props extends DefaultProps {
    ariaLabel: string;
    onClick: () => void;
    children: React.ReactNode;
}

function BaseButton({ id, className, ariaLabel, onClick, children }: Props) {
    return (
        <button
            aria-label={ariaLabel}
            className={clsx('shared-component-base_button', className ?? false)}
            id={id}
            type="button"
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default BaseButton;
