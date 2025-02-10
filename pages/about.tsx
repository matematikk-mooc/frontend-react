import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { i18n, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import ContentArticleLayout from '@/features/content/layouts/Article';
import { getTemplateName, getTranslatedPath } from '@/shared/utils/language';

function About() {
    const { t } = useTranslation(['common', 'about']);
    const router = useRouter();

    const localeName = router?.locale ?? 'nb';
    const routerPath = router?.pathname;
    const templateName = getTemplateName(routerPath);

    return (
        <>
            <Head>
                <title>{`${t('about:page_title')} | ${t('common:site_title')} - Udir`}</title>
                <meta content={t('about:page_description')} name="description" />
                {localeName !== 'nb' && (
                    <link
                        href={`https://kp.udir.no${getTranslatedPath(templateName, 'nb')}`}
                        rel="canonical"
                    />
                )}

                <meta content="nofollow,noindex" name="robots" />
            </Head>

            <ContentArticleLayout
                description="Kompetanseportalen er en plattform som tilbyr gratis nettbaserte kompetansepakker."
                locale="nb"
                template="about"
                title="Om kompetanseportalen"
            >
                <div>
                    <p>
                        Disse pakkene er utviklet for å støtte kompetanseutvikling hos ansatte i
                        barnehage, skole og fagopplæring, både individuelt og kollektivt. Pakkene
                        varierer i lengde og tema, men har til felles at de bidrar til refleksjon og
                        utvikling av praksis.
                    </p>

                    <p>
                        Plattformen er utviklet i samarbeid med flere universiteter og høgskoler for
                        å tilby Norges største videreutdanninger for lærere:
                    </p>
                    <ul>
                        <li>
                            MatematikkMOOC - Universitetet i Tromsø (UiT) og Høgskolen i
                            Sør-Trøndelag (HiST)
                        </li>
                        <li>Matematikk 1-MOOC - Universitetet i Agder (UiA)</li>
                        <li>
                            PfDK-MOOC - Universitetet i Sørøst-Norge (USN) og Høgskolen på
                            Vestlandet (HVL)
                        </li>
                    </ul>

                    <h2>Åpne videreutdanninger</h2>
                    <p>
                        Alle etterutdanningsversjonene av disse videreutdanningene er åpent
                        tilgjengelige i plattformen. Ønsker du å ta videreutdanningene for
                        studiepoeng, kan du finne mer informasjon om opptak og gjennomføring hos de
                        respektive institusjonene som tilbyr kursene.
                    </p>

                    <h2>Åpen kildekode</h2>
                    <p>
                        Både plattformen og designet er utviklet som åpen kildekode og er
                        tilgjengelig for nedlasting. Dette betyr at utviklere kan bidra til
                        forbedring eller gjenbruke koden i andre prosjekter. Du finner kildekoden
                        her:{' '}
                        <a
                            href="https://github.com/matematikk-mooc/frontend"
                            rel="noreferrer noopener"
                            target="_blank"
                        >
                            GitHub-repositoriet for frontend.
                        </a>
                    </p>

                    <h2>Fagfornyelsen</h2>
                    <p>
                        I tillegg til videreutdanningene, er det også utviklet en egen
                        kompetansepakke knyttet til fagfornyelsen. Denne pakken er laget i samarbeid
                        med Høgskolen i Innlandet (HiNN). Vi har også hatt god støtte fra
                        Utdanningsetaten i Tromsø kommune i utforskingen av tekniske løsninger som
                        gjør det mulig å tildele ulike roller til skoleledere, lærere og eiere, samt
                        dele dem inn i grupper.
                    </p>

                    <h2>Ikoner og grafiske elementer</h2>
                    <p>
                        Noen av ikonene som brukes på plattformen er hentet fra Font Awesome, som
                        tilbyr gratis ikoner under åpen lisens.
                    </p>
                </div>
            </ContentArticleLayout>
        </>
    );
}

export const getStaticProps = async ({ locale }: GetStaticPropsContext) => {
    if (process.env.NODE_ENV !== 'production') await i18n?.reloadResources();
    const translations = await serverSideTranslations(locale ?? 'nb', ['common', 'about'], null);

    return { revalidate: 60, props: { ...translations } };
};

export default About;
