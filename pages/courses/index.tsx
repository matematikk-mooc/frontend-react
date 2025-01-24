import { Alert } from '@navikt/ds-react';
import { GetStaticPropsContext } from 'next';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { i18n, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useEffect } from 'react';

import { getCourse, getCourses } from '@/integrations/bff/v1/course';
import { IKPASCourse, IKPASCourseCategory } from '@/integrations/kpas/v1/export';
import BaseLink from '@/shared/components/BaseLink';
import Default from '@/shared/layouts/Default';
import { getTemplateName, getTranslatedPath } from '@/shared/utils/language';

type ILabelProps = {
    category: IKPASCourseCategory;
};

function CourseLabel({ category }: ILabelProps) {
    return (
        <li className="flex items-center justify-center rounded-xl bg-udir-gray px-3 py-1 text-center text-sm">
            {category?.title}
        </li>
    );
}

type IItemProps = {
    course: IKPASCourse;
    locale: string;
};

function CourseItem({ course, locale }: IItemProps) {
    if (course === null) return null;
    const courseMainCategory = course.categories.find(category => category?.isPrimary);
    const courseImage = course.images?.[0];

    return (
        <li className="grid-item h-full">
            <BaseLink
                className="flex h-full flex-col overflow-hidden rounded border border-udir-gray no-underline shadow-md transition-all hover-focus:shadow-lg"
                href={getTranslatedPath('/courses/:courseID/', locale, {
                    courseID: course.id.toString(),
                })}
                locale={locale}
            >
                <div className="flex grow flex-col-reverse">
                    <div className="flex grow flex-col items-start justify-start px-5 py-4 pb-0">
                        <h2 className="!mb-2 text-xl">{course.title}</h2>

                        <p className="!mb-0 text-base">{course.description?.substring(0, 255)}</p>

                        <ul className="mt-5 flex list-none flex-wrap gap-2 !pb-0 !pl-0">
                            {course.categories.map(category => (
                                <CourseLabel key={category?.id} category={category} />
                            ))}
                        </ul>
                    </div>

                    <div
                        className="relative flex h-44 grow-0 items-center justify-center bg-udir-theme-gray"
                        style={{
                            backgroundColor: courseMainCategory?.color ?? '#eaeaf5',
                        }}
                    >
                        {courseImage && (
                            <Image
                                alt={courseImage.alt}
                                className="p-5 pr-9"
                                height={0}
                                src={courseImage.url}
                                style={{
                                    width: 'auto',
                                    height: '100%',
                                }}
                                width={0}
                            />
                        )}

                        {course.showNewBanner && (
                            <span className="absolute right-0 top-0 rounded-bl-lg bg-udir-black px-5 py-1.5 text-sm font-bold uppercase text-udir-white">
                                Ny
                            </span>
                        )}
                    </div>
                </div>

                <div className="m-5 mt-14 flex grow-0 items-start justify-start">
                    <span className="w-full rounded bg-udir-black p-2 px-5 text-center text-base text-udir-white">
                        Les mer
                    </span>
                </div>
            </BaseLink>
        </li>
    );
}

type IProps = {
    courses: IKPASCourse[];
};

function Courses(props: IProps) {
    const { courses } = props;

    const { t } = useTranslation(['common', 'courses']);
    const router = useRouter();

    const localeName = router?.locale ?? 'nb';
    const routerPath = router?.pathname;
    const templateName = getTemplateName(routerPath);

    useEffect(() => {
        if (courses.length <= 0) router.reload();
    }, [courses, router]);
    if (courses.length <= 0) return null;

    return (
        <>
            <Head>
                <title>{`${t('courses:page_title')} | ${t('common:site_title')} - Udir`}</title>
                <meta content={t('courses:page_description')} name="description" />
                {localeName !== 'nb' && (
                    <link
                        href={`https://kp.udir.no${getTranslatedPath(templateName, 'nb')}`}
                        rel="canonical"
                    />
                )}

                <meta content="nofollow,noindex" name="robots" />
            </Head>

            <Default className="content-layout-courses" template="courses">
                <div className="mx-5">
                    <div className="mx-auto mb-28 mt-10 flex max-w-7xl flex-col">
                        <h1>Oversikt over alle kompetansepakker</h1>

                        <Alert className="mb-5" variant="warning">
                            Denne siden er fortsatt under utvikling.
                        </Alert>

                        <ul className="grid list-none grid-cols-1 gap-6 gap-y-8 pl-0 md:grid-cols-2 lg:grid-cols-3">
                            {courses.map(course => (
                                <CourseItem key={course?.id} course={course} locale={localeName} />
                            ))}
                        </ul>
                    </div>
                </div>
            </Default>
        </>
    );
}

export const getStaticProps = async ({ locale }: GetStaticPropsContext) => {
    if (process.env.NODE_ENV !== 'production') await i18n?.reloadResources();

    let returnCourses: IKPASCourse[] = [];

    if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) {
        const coursesRes = await getCourses();
        const courseIDs = coursesRes.payload ?? [];

        const courseDetailsPromises = courseIDs.map(courseID =>
            getCourse(courseID).then(res => res.payload ?? null),
        );
        returnCourses = await Promise.all(courseDetailsPromises);
    }

    return {
        revalidate: returnCourses.length > 0 ? 60 : 1,
        props: {
            ...(await serverSideTranslations(locale ?? 'nb', ['common', 'courses'], null)),
            courses: returnCourses.reverse(),
        },
    };
};

export default Courses;
