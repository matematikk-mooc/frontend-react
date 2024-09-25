import clsx from 'clsx';

import { DefaultProps } from '@/shared/interfaces/react';

interface Props extends DefaultProps {
    children: React.ReactNode;
}

function Accordion({ id, className, children }: Props) {
    return (
        <div className={clsx('content-component-accordion', className ?? false)} id={id}>
            {children}
        </div>
    );
}

export default Accordion;
