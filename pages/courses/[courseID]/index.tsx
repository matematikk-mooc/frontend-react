import { Alert } from '@navikt/ds-react';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { i18n, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';

import CourseHomeLayout from '@/features/course/layouts/Home';
import { getCourse, getCourseModules, getCoursePage } from '@/integrations/bff/v1/course';
import {
    IEnrollmentState,
    IKPASCourse,
    IKPASCourseModule,
    IKPASCoursePage,
} from '@/integrations/kpas/v1/export';
import {
    getObjectTranslation,
    getRouterQuery,
    getTemplateName,
    getTranslatedPath,
} from '@/shared/utils/language';

type IProps = {
    course: IKPASCourse;
    modules: IKPASCourseModule[];
    frontpage: IKPASCoursePage | null;
};

function Course(props: IProps) {
    const { course, modules, frontpage } = props;
    const requirementsCount = modules.reduce((acc, module) => {
        const pages = module.items.filter(
            item => item.type !== 'subheader' && item.requirement != null,
        );
        return acc + pages.length;
    }, 0);

    const [enrollmentState, setEnrollmentState] = useState<IEnrollmentState>({
        enrolled: false,
        requirements: {
            completed: 0,
            total: requirementsCount,
        },
    });

    const { t } = useTranslation(['common', 'course']);
    const router = useRouter();
    const localeName = router?.locale ?? 'nb';
    const routerPath = router?.pathname;
    const routerQuery = getRouterQuery(router?.query);
    const templateName = getTemplateName(routerPath);

    const title = course?.title ?? '';
    const description = course?.description ?? '';
    const categories = course?.categories ?? [];
    const languages = course?.languages ?? [];
    const thumbnail = course?.images?.[0] ?? null;
    const frontpageContentHTML = getObjectTranslation(localeName, frontpage?.content) ?? '';

    return (
        <>
            <Head>
                <title>{`${title} | ${t('common:site_title')} - Udir`}</title>
                <meta content={description?.substring(0, 255)} name="description" />

                {localeName !== 'nb' && (
                    <link
                        href={`https://kp.udir.no${getTranslatedPath(templateName, 'nb', routerQuery)}`}
                        rel="canonical"
                    />
                )}

                <meta content="nofollow,noindex" name="robots" />
            </Head>

            <CourseHomeLayout
                categories={categories}
                courseID={course?.id ?? 0}
                description={description?.substring(0, 500)}
                enrollment={enrollmentState}
                languages={languages}
                locale="nb"
                modules={modules}
                template="course"
                thumbnail={thumbnail}
                title={title}
                updateEnrollment={() => {
                    setEnrollmentState(prevState => ({
                        ...prevState,
                        enrolled: !prevState.enrolled,
                    }));
                }}
            >
                <Alert className="mb-5" variant="warning">
                    Denne siden er fortsatt under utvikling.
                </Alert>

                <div
                    className="raw-html-content"
                    dangerouslySetInnerHTML={{ __html: frontpageContentHTML }}
                />
            </CourseHomeLayout>
        </>
    );
}

export const getServerSideProps = async ({
    locale,
    params,
}: GetServerSidePropsContext<{ courseID: string }>) => {
    if (process.env.NODE_ENV !== 'production') await i18n?.reloadResources();
    const translations = await serverSideTranslations(locale ?? 'nb', ['common', 'course'], null);

    const { courseID } = params ?? {};
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

    const coursePayload = courseRes.payload;
    const modulesRes = await getCourseModules(parsedID);
    const modulesPayload = modulesRes.payload ?? [];

    let frontpagePayload: IKPASCoursePage | null = null;
    if (coursePayload.frontpageSlugID !== null) {
        const frontpageRes = await getCoursePage(parsedID, coursePayload.frontpageSlugID);
        if (frontpageRes.payload !== null) frontpagePayload = frontpageRes.payload;
    }

    return {
        props: {
            ...translations,
            course: coursePayload,
            modules: modulesPayload,
            frontpage: frontpagePayload,
        },
    };
};

export default Course;
