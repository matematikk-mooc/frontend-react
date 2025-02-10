import { Accordion } from '@navikt/ds-react';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { i18n, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import ContentArticleLayout from '@/features/content/layouts/Article';
import ExternalLink from '@/shared/components/ExternalLink';
import { getTemplateName, getTranslatedPath } from '@/shared/utils/language';

const AccordionItem = Accordion.Item;
const AccordionHeader = Accordion.Header;
const AccordionContent = Accordion.Content;

function Privacy() {
    const { t } = useTranslation(['common', 'privacy']);
    const router = useRouter();

    const localeName = router?.locale ?? 'nb';
    const routerPath = router?.pathname;
    const templateName = getTemplateName(routerPath);

    return (
        <>
            <Head>
                <title>{`${t('privacy:page_title')} | ${t('common:site_title')} - Udir`}</title>
                <meta content={t('privacy:page_description')} name="description" />
                {localeName !== 'nb' && (
                    <link
                        href={`https://kp.udir.no${getTranslatedPath(templateName, 'nb')}`}
                        rel="canonical"
                    />
                )}

                <meta content="nofollow,noindex" name="robots" />
            </Head>

            <ContentArticleLayout
                description={t('privacy:page_description')}
                locale={localeName}
                template="privacy"
                title={t('privacy:page_title')}
            >
                <div>
                    <p>{t('privacy:content:001_p')}</p>

                    <h2>{t('privacy:content:002_h2')}</h2>
                    <Accordion id="faq">
                        <AccordionItem>
                            <AccordionHeader>
                                {t('privacy:content:003_faq:001:title')}
                            </AccordionHeader>

                            <AccordionContent>
                                <p>{t('privacy:content:003_faq:001:001_p')}</p>
                                <ul>
                                    <li>{t('privacy:content:003_faq:001:002_ul:001_p')}</li>
                                    <li>{t('privacy:content:003_faq:001:002_ul:002_p')}</li>
                                    <li>{t('privacy:content:003_faq:001:002_ul:003_p')}</li>
                                    <li>{t('privacy:content:003_faq:001:002_ul:004_p')}</li>
                                    <li>{t('privacy:content:003_faq:001:002_ul:005_p')}</li>
                                    <li>{t('privacy:content:003_faq:001:002_ul:006_p')}</li>
                                </ul>

                                <p>{t('privacy:content:003_faq:001:003_p')}</p>
                                <ul>
                                    <li>{t('privacy:content:003_faq:001:004_ul:001_p')}</li>
                                    <li>{t('privacy:content:003_faq:001:004_ul:002_p')}</li>
                                    <li>{t('privacy:content:003_faq:001:004_ul:003_p')}</li>
                                </ul>

                                <p>
                                    {t('privacy:content:003_faq:001:005_p')}{' '}
                                    <ExternalLink
                                        ariaLabel=""
                                        href="https://www.feide.no/personvern-og-samtykke"
                                    >
                                        {t('privacy:content:003_faq:001:006_a')}
                                    </ExternalLink>
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionHeader>
                                {t('privacy:content:003_faq:002:title')}
                            </AccordionHeader>

                            <AccordionContent>
                                <p>{t('privacy:content:003_faq:002:001_p')}</p>
                                <ul>
                                    <li>{t('privacy:content:003_faq:002:002_ul:001_p')}</li>
                                    <li>{t('privacy:content:003_faq:002:002_ul:002_p')}</li>
                                    <li>{t('privacy:content:003_faq:002:002_ul:003_p')}</li>
                                </ul>

                                <p>{t('privacy:content:003_faq:002:003_p')}</p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionHeader>
                                {t('privacy:content:003_faq:003:title')}
                            </AccordionHeader>

                            <AccordionContent>
                                <p>{t('privacy:content:003_faq:003:001_p')}</p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionHeader>
                                {t('privacy:content:003_faq:004:title')}
                            </AccordionHeader>

                            <AccordionContent>
                                <p>{t('privacy:content:003_faq:004:001_p')}</p>
                                <ul>
                                    <li>{t('privacy:content:003_faq:004:002_ul:001_p')}</li>
                                    <li>{t('privacy:content:003_faq:004:002_ul:002_p')}</li>
                                </ul>

                                <p>{t('privacy:content:003_faq:004:003_p')}</p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionHeader>
                                {t('privacy:content:003_faq:005:title')}
                            </AccordionHeader>

                            <AccordionContent>
                                <h3>{t('privacy:content:003_faq:005:001_h3')}</h3>
                                <p>{t('privacy:content:003_faq:005:002_p')}</p>

                                <h3>{t('privacy:content:003_faq:005:003_h3')}</h3>
                                <p>{t('privacy:content:003_faq:005:004_p')}</p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionHeader>
                                {t('privacy:content:003_faq:006:title')}
                            </AccordionHeader>

                            <AccordionContent>
                                <p>{t('privacy:content:003_faq:006:001_p')}</p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionHeader>
                                {t('privacy:content:003_faq:007:title')}
                            </AccordionHeader>

                            <AccordionContent>
                                <p>
                                    {t('privacy:content:003_faq:007:001_p')}{' '}
                                    <a href="mailto:kompetansesupport@udir.no">
                                        kompetansesupport@udir.no
                                    </a>
                                    .
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionHeader>
                                {t('privacy:content:003_faq:008:title')}
                            </AccordionHeader>

                            <AccordionContent>
                                <p>{t('privacy:content:003_faq:008:001_p')}</p>
                                <ul>
                                    <li>{t('privacy:content:003_faq:008:002_ul:001_p')}</li>
                                    <li>{t('privacy:content:003_faq:008:002_ul:002_p')}</li>
                                    <li>{t('privacy:content:003_faq:008:002_ul:003_p')}</li>
                                </ul>

                                <p>
                                    {t('privacy:content:003_faq:008:003_p')}{' '}
                                    <a href="mailto:kompetansesupport@udir.no">
                                        kompetansesupport@udir.no
                                    </a>
                                    .
                                </p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <h2>{t('privacy:content:004_h2')}</h2>
                    <p>
                        {t('privacy:content:005_p:001')}{' '}
                        <a href="mailto:personvernombud@udir.no">personvernombud@udir.no</a>{' '}
                        {t('privacy:content:005_p:002')}{' '}
                        <ExternalLink
                            ariaLabel=""
                            href="https://www.datatilsynet.no/om-datatilsynet/kontakt-oss/"
                        >
                            Datatilsynet
                        </ExternalLink>
                        .
                    </p>
                </div>
            </ContentArticleLayout>
        </>
    );
}

export const getStaticProps = async ({ locale }: GetStaticPropsContext) => {
    if (process.env.NODE_ENV !== 'production') await i18n?.reloadResources();
    const translations = await serverSideTranslations(locale ?? 'nb', ['common', 'privacy'], null);

    return { revalidate: 60, props: { ...translations } };
};

export default Privacy;
