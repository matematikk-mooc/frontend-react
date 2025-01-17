import { Accordion } from '@navikt/ds-react';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { i18n, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Article from '@/features/content/layouts/Article';
import { getTemplateName, getTranslatedPath } from '@/shared/utils/language';

const AccordionItem = Accordion.Item;
const AccordionHeader = Accordion.Header;
const AccordionContent = Accordion.Content;

function Contact() {
    const { t } = useTranslation(['common', 'contact']);
    const router = useRouter();

    const localeName = router?.locale ?? 'nb';
    const routerPath = router?.pathname;
    const templateName = getTemplateName(routerPath);

    return (
        <>
            <Head>
                <title>{`${t('contact:page_title')} | ${t('common:site_title')} - Udir`}</title>
                <meta content={t('contact:page_description')} name="description" />
                {localeName !== 'nb' && (
                    <link
                        href={`https://kp.udir.no${getTranslatedPath(templateName, 'nb')}`}
                        rel="canonical"
                    />
                )}

                <meta content="nofollow,noindex" name="robots" />
            </Head>

            <Article
                description="Velkommen til Kompetanseportalen - en plattform utviklet av Utdanningsdirektoratet i samarbeid med flere universiteter og høgskoler."
                locale="nb"
                template="contact"
                title="Kontakt"
            >
                <div>
                    <p>
                        Vi tilbyr gratis nettbaserte kompetansepakker for ansatte i barnehager,
                        skoler og fagopplæring, med mål om å støtte faglig utvikling og
                        praksisrefleksjon.
                    </p>

                    <p>
                        Plattformen vår er designet for å gi brukerne enkel tilgang til videre- og
                        etterutdanning, enten individuelt eller i grupper. Vi streber etter å tilby
                        den beste opplevelsen for brukerne våre og er her for å hjelpe deg.
                    </p>

                    <Accordion id="faq">
                        <AccordionItem>
                            <AccordionHeader>
                                Hvordan registrerer jeg meg på kompetanse.udir.no?
                            </AccordionHeader>

                            <AccordionContent>
                                <p>
                                    Du kan registrere deg på plattformen ved å bruke Feide-pålogging
                                    eller ved å registrere deg manuelt med navn og e-postadresse.
                                    For manuell registrering, meld deg på en kompetansepakke og følg
                                    instruksjonene for å opprette en brukerkonto.
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionHeader>
                                Jeg har registrert meg men får ikke logget inn. Hva gjør jeg?
                            </AccordionHeader>

                            <AccordionContent>
                                <p>
                                    For å logge inn her må du være påmeldt minst en kompetansepakke.
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionHeader>
                                Hvordan kan jeg få tilgang til kompetansepakkene?
                            </AccordionHeader>

                            <AccordionContent>
                                <p>
                                    Når du er registrert og innlogget på plattformen, kan du
                                    utforske og melde deg på de ulike kompetansepakkene fra
                                    hovedmenyen. Alle pakkene er gratis og tilgjengelige for alle
                                    registrerte brukere.
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionHeader>Hvordan kan jeg slette kontoen min?</AccordionHeader>

                            <AccordionContent>
                                <p>
                                    Du kan be om sletting av kontoen din ved å sende en e-post til
                                    vår brukerstøtte på{' '}
                                    <a href="mailto:kompetansesupport@udir.no">
                                        kompetansesupport@udir.no
                                    </a>
                                    . Merk at dette vil fjerne all tilknyttet informasjon og
                                    fremdrift på plattformen.
                                </p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <h2>Kontaktinformasjon</h2>
                    <p>
                        Hvis du ikke finner svar på spørsmålet ditt i FAQ-seksjonen, er vi her for å
                        hjelpe deg. For spørsmål om plattformen, registrering eller teknisk støtte,
                        vennligst kontakt oss på{' '}
                        <a href="mailto:kompetansesupport@udir.no">kompetansesupport@udir.no</a>.
                    </p>
                </div>
            </Article>
        </>
    );
}

export const getStaticProps = async ({ locale }: GetStaticPropsContext) => {
    if (process.env.NODE_ENV !== 'production') await i18n?.reloadResources();

    return {
        revalidate: 60,
        props: {
            ...(await serverSideTranslations(locale ?? 'nb', ['common', 'contact'], null)),
        },
    };
};

export default Contact;
