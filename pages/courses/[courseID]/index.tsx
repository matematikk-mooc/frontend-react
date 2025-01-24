/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { Alert } from '@navikt/ds-react';
import { GetStaticPropsContext } from 'next';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { i18n, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';

import CourseHome from '@/features/course/layouts/Home';
import {
    getCourse,
    getCourseModules,
    getCoursePage,
    getCourses,
} from '@/integrations/bff/v1/course';
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
            completed: 24,
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

            <CourseHome
                categories={categories}
                courseID={course?.id ?? 0}
                description={description?.substring(0, 500)}
                enrollment={enrollmentState}
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
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: frontpageContentHTML }}
                />
            </CourseHome>
        </>
    );
}

export const getStaticPaths = async () => {
    const coursesPaths = [];

    if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) {
        const coursesRes = await getCourses();

        for (const courseID of coursesRes.payload) {
            const courseRes = await getCourse(courseID);
            if (courseRes.payload !== null) {
                coursesPaths.push({
                    params: {
                        courseID: courseRes.payload.id.toString(),
                    },
                });
            }
        }
    }

    return {
        paths: coursesPaths,
        fallback: 'blocking',
    };
};

export const getStaticProps = async ({
    locale,
    params,
}: GetStaticPropsContext<{ courseID: string }>) => {
    if (process.env.NODE_ENV !== 'production') await i18n?.reloadResources();

    const returnObject = {
        props: {
            ...(await serverSideTranslations(locale ?? 'nb', ['common', 'course'], null)),
        },
    };

    const { courseID } = params ?? {};
    const parsedID = Number(courseID);
    let frontpagePayload: IKPASCoursePage | null = null;

    const courseRes = await getCourse(parsedID);
    if (courseRes.payload === null) return { ...returnObject, notFound: true };

    const coursePayload = courseRes.payload;
    const modulesRes = await getCourseModules(parsedID);
    const modulesPayload = modulesRes.payload ?? [];

    if (coursePayload.frontpageSlugID !== null) {
        const frontpageRes = await getCoursePage(parsedID, coursePayload.frontpageSlugID);
        if (frontpageRes.payload !== null) frontpagePayload = frontpageRes.payload;
    }

    return {
        ...returnObject,
        revalidate: 60,
        props: {
            ...returnObject.props,
            course: coursePayload,
            modules: modulesPayload,
            frontpage: frontpagePayload,
        },
    };
};

export default Course;
