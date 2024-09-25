import { MenuHamburgerIcon, XMarkIcon, EnterIcon } from '@navikt/aksel-icons';
import { Modal } from '@navikt/ds-react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';

import BaseLink from '@/shared/components/BaseLink';
import ExternalLink from '@/shared/components/ExternalLink';
import LanguageSelector from '@/shared/components/LanguageSelector';
import LinkSeperator from '@/shared/components/LinkSeperator';
import { DefaultProps } from '@/shared/interfaces/react';
import { getTranslatedPath } from '@/shared/utils/language';

const ModalBody = Modal.Body;

function LoginIcon() {
    return <EnterIcon fontSize="24px" />;
}

function MobileNavigation({ id, className }: DefaultProps) {
    const { t } = useTranslation();
    const [openState, setOpenState] = useState(false);

    const router = useRouter();
    const localeName = router?.locale ?? 'nb';

    return (
        <div className={clsx(className ?? false)} id={id}>
            <button
                aria-label={t('common:mobile_navigation_open')}
                className="flex flex-col items-center justify-center no-underline hover-focus:underline"
                type="button"
                onClick={() => setOpenState(true)}
            >
                <MenuHamburgerIcon fontSize="24px" />

                <span className="mt-1 text-xs uppercase">
                    {t('common:mobile_navigation_title')}
                </span>
            </button>

            <Modal
                className="navds-modal__hide-header absolute top-0 h-screen max-h-full w-screen max-w-full !animate-none rounded-none"
                header={{
                    heading: 'Mobilmeny',
                    size: 'small',
                }}
                open={openState}
                width="medium"
                onClose={() => setOpenState(false)}
            >
                <div className="flex shrink-0 items-center justify-end px-5 py-4">
                    <div className="flex flex-row-reverse justify-center">
                        <button
                            aria-label={t('common:mobile_navigation_close')}
                            className="flex flex-col items-center justify-center no-underline hover-focus:underline"
                            type="button"
                            onClick={() => setOpenState(false)}
                        >
                            <XMarkIcon fontSize="24px" />

                            <span className="mt-1 text-xs uppercase">
                                {t('common:mobile_navigation_close_title')}
                            </span>
                        </button>

                        <LinkSeperator size="medium" />

                        <LanguageSelector className="flex items-center justify-center" iconStack />

                        <LinkSeperator size="medium" />

                        <div className="flex items-center justify-center">
                            <ExternalLink
                                ariaLabel={t('common:top_navigation_login_label')}
                                BeforeIcon={LoginIcon}
                                className="flex-col items-center justify-center"
                                href="https://bibsys.instructure.com/courses"
                                hideUnderline
                            >
                                <span className="mt-1 flex text-xs uppercase">
                                    {t('common:top_navigation_login')}
                                </span>
                            </ExternalLink>
                        </div>
                    </div>
                </div>

                <span className="flex w-full border-b-2 border-udir-black" />

                <ModalBody className="mb-10 flex grow flex-col justify-start px-5 py-10 text-xl">
                    <nav aria-label={t('common:mobile_navigation_label')} className="flex flex-col">
                        <ul className="flex flex-col items-start justify-start gap-6">
                            <li>
                                <BaseLink
                                    href={`${getTranslatedPath('/contact/', localeName)}#faq`}
                                    locale={localeName}
                                    onClick={() => setOpenState(false)}
                                >
                                    {t('common:footer_links_faq')}
                                </BaseLink>
                            </li>

                            <li>
                                <BaseLink
                                    href={getTranslatedPath('/about/', localeName)}
                                    locale={localeName}
                                    onClick={() => setOpenState(false)}
                                >
                                    {t('common:footer_links_about')}
                                </BaseLink>
                            </li>

                            <li>
                                <BaseLink
                                    href={getTranslatedPath('/contact/', localeName)}
                                    locale={localeName}
                                    onClick={() => setOpenState(false)}
                                >
                                    {t('common:footer_links_contact')}
                                </BaseLink>
                            </li>
                        </ul>
                    </nav>
                </ModalBody>
            </Modal>
        </div>
    );
}

export default MobileNavigation;
