import clsx from 'clsx';

import { DefaultProps } from '@/shared/interfaces/react';

interface Props extends DefaultProps {
    size: 'small' | 'medium' | 'large';
}

function LinkSeperator({ id, className, size }: Props) {
    return (
        <div className="flex items-center justify-center">
            <span
                className={clsx(
                    'flex h-4/5 border-l border-udir-primary',
                    size === 'small' && 'mx-3',
                    size === 'medium' && 'mx-5',
                    size === 'large' && 'mx-7',
                    className ?? false,
                )}
                id={id}
            />
        </div>
    );
}

export default LinkSeperator;
