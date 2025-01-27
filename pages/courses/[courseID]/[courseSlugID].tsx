import { Alert } from '@navikt/ds-react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { i18n, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import CourseContentLayout from '@/features/course/layouts/Content';
import { getCourse, getCourseModules, getCoursePage } from '@/integrations/bff/v1/course';
import { IKPASCourse, IKPASCourseModule, IKPASCoursePage } from '@/integrations/kpas/v1/export';
import {
    getObjectTranslation,
    getRouterQuery,
    getTemplateName,
    getTranslatedPath,
} from '@/shared/utils/language';

type IProps = {
    course: IKPASCourse;
    modules: IKPASCourseModule[];
    page: IKPASCoursePage | null;
};

function Course(props: IProps) {
    const { course, modules, page } = props;

    const { t } = useTranslation(['common', 'course']);
    const router = useRouter();

    const localeName = router?.locale ?? 'nb';
    const routerPath = router?.pathname;
    const routerQuery = getRouterQuery(router?.query);
    const templateName = getTemplateName(routerPath);

    const title = course?.title ?? '';
    const description = course?.description ?? '';
    const categories = course?.categories ?? [];

    return (
        <>
            <Head>
                <title>{`Course | ${t('common:site_title')} - Udir`}</title>
                <meta content="Course description" name="description" />
                {localeName !== 'nb' && (
                    <link
                        href={`https://kp.udir.no${getTranslatedPath(templateName, 'nb', routerQuery)}`}
                        rel="canonical"
                    />
                )}

                <meta content="nofollow,noindex" name="robots" />
            </Head>

            <CourseContentLayout
                categories={categories}
                contentTitle={getObjectTranslation(localeName, page?.title) ?? ''}
                courseID={course?.id ?? 0}
                description={description?.substring(0, 255)}
                locale={localeName}
                modules={modules}
                template="course"
                title={title}
            >
                <div className="mx-auto mt-5 w-full max-w-4xl px-10">
                    <Alert className="w-full" variant="warning">
                        Denne siden er fortsatt under utvikling.
                    </Alert>
                </div>

                <div
                    className="raw-html-content mx-auto max-w-4xl p-10"
                    dangerouslySetInnerHTML={{
                        __html: getObjectTranslation(localeName, page?.content) ?? '',
                    }}
                />
            </CourseContentLayout>
        </>
    );
}

export const getServerSideProps = async ({
    locale,
    params,
}: GetServerSidePropsContext<{ courseID: string; courseSlugID: string }>) => {
    if (process.env.NODE_ENV !== 'production') await i18n?.reloadResources();
    const translations = await serverSideTranslations(locale ?? 'nb', ['common', 'course'], null);

    const { courseID, courseSlugID } = params ?? {};
    const parsedID = Number(courseID);
    if (Number.isNaN(parsedID)) return { notFound: true, props: { ...translations } };

    const courseRes = await getCourse(parsedID)
        .then(res => res)
        .catch(err => {
            if (err instanceof Error && err.message.includes('status 404'))
                return { payload: null };

            throw err;
        });
    if (courseRes.payload === null) return { notFound: true, props: { ...translations } };

    const pageRes = await getCoursePage(parsedID, courseSlugID ?? '')
        .then(res => res)
        .catch(err => {
            if (err instanceof Error && err.message.includes('status 404'))
                return { payload: null };

            throw err;
        });

    if (pageRes.payload === null) return { notFound: true, props: { ...translations } };

    const modulesRes = await getCourseModules(parsedID);

    return {
        props: {
            ...translations,
            course: courseRes.payload,
            modules: modulesRes.payload,
            page: pageRes.payload,
        },
    };
};

export default Course;
