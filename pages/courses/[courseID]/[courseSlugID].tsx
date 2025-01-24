/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import { Alert } from '@navikt/ds-react';
import { GetStaticPropsContext } from 'next';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { i18n, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Content from '@/features/course/layouts/Content';
import {
    getCourse,
    getCourseModules,
    getCoursePage,
    getCourses,
} from '@/integrations/bff/v1/course';
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

            <Content
                categories={categories}
                contentTitle={getObjectTranslation(localeName, page?.title) ?? ''}
                courseID={course?.id ?? 0}
                description={description?.substring(0, 255)}
                locale={localeName}
                modules={modules}
                template="course"
                title={title}
            >
                <div className="mx-auto w-full max-w-4xl p-10">
                    <Alert className="mb-5 w-full" variant="warning">
                        Denne siden er fortsatt under utvikling.
                    </Alert>
                </div>

                <div
                    className="raw-html-content mx-auto max-w-4xl p-10"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{
                        __html: getObjectTranslation(localeName, page?.content) ?? '',
                    }}
                />
            </Content>
        </>
    );
}

export const getStaticPaths = async () => {
    const coursesModulesPaths = [];

    if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) {
        const coursesRes = await getCourses();

        for (const courseID of coursesRes.payload) {
            const courseModulesRes = await getCourseModules(courseID);

            if (courseModulesRes.payload !== null) {
                for (const moduleItem of courseModulesRes.payload) {
                    for (const pageItem of moduleItem.items) {
                        if (pageItem.type === 'page') {
                            coursesModulesPaths.push({
                                params: {
                                    courseID: courseID.toString(),
                                    courseSlugID: pageItem.slugID,
                                },
                            });
                        }
                    }
                }
            }
        }
    }

    return {
        paths: coursesModulesPaths,
        fallback: 'blocking',
    };
};

export const getStaticProps = async ({
    locale,
    params,
}: GetStaticPropsContext<{ courseID: string; courseSlugID: string }>) => {
    if (process.env.NODE_ENV !== 'production') await i18n?.reloadResources();

    const { courseID, courseSlugID } = params ?? {};
    const parsedID = Number(courseID);
    const returnObject = {
        revalidate: 60,
        props: {
            ...(await serverSideTranslations(locale ?? 'nb', ['common', 'course'], null)),
        },
    };

    const courseRes = await getCourse(parsedID);
    if (courseRes.payload === null) return { ...returnObject, notFound: true, revalidate: 1 };

    const courseData = courseRes.payload;
    const modulesRes = await getCourseModules(parsedID);
    let pagePayload: IKPASCoursePage | null = null;

    const pageRes = await getCoursePage(parsedID, courseSlugID ?? '');
    if (pageRes.payload !== null) pagePayload = pageRes.payload;

    return {
        ...returnObject,
        props: {
            ...returnObject.props,
            course: courseData,
            modules: modulesRes.payload,
            page: pagePayload,
        },
    };
};

export default Course;
