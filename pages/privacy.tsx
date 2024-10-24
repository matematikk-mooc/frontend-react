import { Accordion } from '@navikt/ds-react';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { i18n, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Article from '@/features/content/layouts/Article';
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

            <Article
                description="Her finner du informasjon om hvordan personopplysningene dine behandles når du bruker Kompetanseportalen."
                locale="nb"
                template="privacy"
                title="Personvernerklæring"
            >
                <div>
                    <p>
                        Kompetanseportalen bruker informasjonskapsler for å forbedre
                        brukeropplevelsen, blant annet ved å huske språket du har valgt. De fleste
                        nettlesere aksepterer automatisk informasjonskapsler, men du kan selv endre
                        innstillingene for å blokkere eller tillate dem.
                    </p>

                    <h2>Vanlige spørsmål om behandling av personopplysninger</h2>
                    <Accordion id="faq">
                        <AccordionItem>
                            <AccordionHeader>
                                Hvordan registrerer jeg meg, og hvilke opplysninger behandles?
                            </AccordionHeader>

                            <AccordionContent>
                                <p>
                                    Du kan registrere deg ved å bruke Feide-pålogging eller ved å
                                    oppgi navn og e-post. Ved bruk av Feide kan følgende
                                    personopplysninger bli behandlet:
                                </p>
                                <ul>
                                    <li>Fult navn</li>
                                    <li>Navn og ID for vertsorganisasjon</li>
                                    <li>Organisasjonsnummer</li>
                                    <li>E-postadresse og mobilnummer</li>
                                    <li>Foretrukket språk</li>
                                    <li>Sted</li>
                                </ul>

                                <p>
                                    Hvis du registrerer deg med navn og e-post, vil følgende
                                    opplysninger bli behandlet:
                                </p>
                                <ul>
                                    <li>Fullt navn</li>
                                    <li>E-postadresse</li>
                                    <li>
                                        Domenenavnet knyttet til e-posten (f.eks. arbeidsgivers
                                        domene)
                                    </li>
                                </ul>

                                <p>
                                    Dette er nødvendig for å sikre sikker innlogging til
                                    plattformen. Les mer:{' '}
                                    <ExternalLink
                                        ariaLabel=""
                                        href="https://www.feide.no/personvern-og-samtykke"
                                    >
                                        Feides personvernerklæring
                                    </ExternalLink>
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionHeader>
                                Hvilke personopplysninger behandles når jeg bruker kompetansepakker?
                            </AccordionHeader>

                            <AccordionContent>
                                <p>
                                    Formålet med å behandle personopplysninger i Kompetanseportalen
                                    er å sørge for at du kan gjennomføre pakkene og få den
                                    kompetanseheving de gir. Følgende opplysninger kan bli lagret:
                                </p>
                                <ul>
                                    <li>Svar på oppgaver og aktiviteter</li>
                                    <li>
                                        Status for gjennomføring (fullført, delvis fullført eller
                                        ikke påbegynt)
                                    </li>
                                    <li>Tidsbruk og innloggingsdetaljer</li>
                                </ul>

                                <p>
                                    Informasjonen er kun tilgjengelig for deg og
                                    Utdanningsdirektoratet eller deres leverandører. I enkelte
                                    tilfeller kan du dele svarene dine med andre, f.eks. gjennom
                                    «hverandrevurdering» eller tilbakemelding fra fagansvarlige.
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionHeader>
                                Hvordan fungerer diskusjonsforumene på plattformen?
                            </AccordionHeader>

                            <AccordionContent>
                                <p>
                                    Kompetanseportalen inneholder diskusjonsforum hvor brukere kan
                                    kommunisere med hverandre. Disse forumene er åpne for alle
                                    registrerte brukere.
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionHeader>
                                Hva slags statistikk lages om bruken av kompetansepakkene?
                            </AccordionHeader>

                            <AccordionContent>
                                <p>Utdanningsdirektoratet samler anonym statistikk om:</p>
                                <ul>
                                    <li>Antall brukere som har besøkt en kompetansepakke</li>
                                    <li>
                                        Hvor mange som har registrert seg i kompetansepakken, samt i
                                        roller og grupper
                                    </li>
                                </ul>

                                <p>
                                    Denne statistikken er offentlig, men er anonymisert for å hindre
                                    at enkeltpersoner kan gjenkjennes. Utdanningsdirektoratet kan
                                    også bruke e-post for å kontakte registrerte brukere med
                                    oppdateringer eller forespørsler om evalueringer av
                                    kompetansepakkene.
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionHeader>
                                Hva er det rettslige grunnlaget for behandlingen av
                                personopplysninger?
                            </AccordionHeader>

                            <AccordionContent>
                                <h3>Registrering og innlogging</h3>
                                <p>
                                    Behandlingen av personopplysninger i forbindelse med
                                    registrering og innlogging er basert på personvernforordningen
                                    artikkel 6 nr. 1 bokstav f. Dette gir Utdanningsdirektoratet
                                    rett til å behandle opplysninger for å sikre plattformens
                                    sikkerhet.
                                </p>

                                <h3>Bruk av kompetansepakker</h3>
                                <p>
                                    Personopplysninger som behandles når du bruker
                                    kompetansepakkene, er basert på personvernforordningen artikkel
                                    6 nr. 1 bokstav e, der oppdragsbrev fra Kunnskapsdepartementet
                                    fungerer som rettslig grunnlag.
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionHeader>Hvem er behandlingsansvarlig?</AccordionHeader>

                            <AccordionContent>
                                <p>
                                    Utdanningsdirektoratet er behandlingsansvarlig for alle
                                    personopplysninger knyttet til Kompetanseportalen, bortsett fra
                                    Feide-data, hvor vertsorganisasjonen har ansvaret.
                                    Utdanningsdirektoratet har også en databehandleravtale med UNIT,
                                    som drifter plattformen teknisk.
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionHeader>
                                Hvor lenge lagres personopplysningene mine?
                            </AccordionHeader>

                            <AccordionContent>
                                <p>
                                    Personopplysningene dine slettes hvis du ikke har logget inn på
                                    plattformen på tre år. Du kan når som helst be om å få slettet
                                    brukerkontoen din og innholdet du har lastet opp ved å kontakte{' '}
                                    <a href="mailto:kompetansesupport@udir.no">
                                        kompetansesupport@udir.no
                                    </a>
                                    .
                                </p>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionHeader>
                                Hvilke rettigheter har jeg som en bruker?
                            </AccordionHeader>

                            <AccordionContent>
                                <p>Som bruker har du rett til:</p>
                                <ul>
                                    <li>Innsyn i hvilke opplysninger som er lagret om deg</li>
                                    <li>Retting av feilaktige opplysninger</li>
                                    <li>Sletting av personopplysninger, der dette er mulig</li>
                                </ul>

                                <p>
                                    Du kan utøve disse rettighetene ved å kontakte{' '}
                                    <a href="mailto:kompetansesupport@udir.no">
                                        kompetansesupport@udir.no
                                    </a>
                                    .
                                </p>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <h2>Klage</h2>
                    <p>
                        Hvis du mener at vi behandler personopplysninger i strid med lovgivningen,
                        kan du kontakte vårt personvernombud på personvernombud@udir.no eller klage
                        til Datatilsynet. Du finner kontaktinformasjon her:
                        https://www.datatilsynet.no/om-datatilsynet/kontakt-oss/
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
            ...(await serverSideTranslations(locale ?? 'nb', ['common', 'privacy'], null)),
        },
    };
};

export default Privacy;
