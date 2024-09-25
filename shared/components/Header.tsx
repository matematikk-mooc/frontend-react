import clsx from 'clsx';
import { useEffect, useState } from 'react';

import Breadcrumbs from '@/shared/components/Breadcrumbs';
import TopNavigation from '@/shared/components/TopNavigation';
import { DefaultProps } from '@/shared/interfaces/react';

function Header({ id, className }: DefaultProps) {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header
            className={clsx(
                'shared-component-header',
                className ?? false,
                isScrolled && 'mt-2 pt-20',
            )}
            id={id}
        >
            <TopNavigation fixed={isScrolled} id="top-navigation" />

            <span className="flex w-full border-b-2 border-udir-black" />

            <Breadcrumbs className="max-sm:hidden" />
        </header>
    );
}

export default Header;
