import clsx from 'clsx';
import { ReactNode } from 'react';

import { DefaultProps } from '@/shared/interfaces/react';

export interface Props extends DefaultProps {
    template: string;
    children: ReactNode;
}

function Empty({ id, className, children, template }: Props) {
    return (
        <div
            className={clsx(
                'shared-layout-empty',
                template && `page-template-${template}`,
                className ?? false,
            )}
            id={id}
        >
            {children}
        </div>
    );
}

export default Empty;
