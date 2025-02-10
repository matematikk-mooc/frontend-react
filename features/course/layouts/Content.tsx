import { ArrowLeftIcon } from '@navikt/aksel-icons';
import clsx from 'clsx';

import { Module } from '@/features/course/layouts/Home';
import { IKPASCourseCategory, IKPASCourseModule } from '@/integrations/kpas/v1/export';
import BaseLink from '@/shared/components/BaseLink';
import EmptyLayout, { Props } from '@/shared/layouts/Empty';
import { getTranslatedPath } from '@/shared/utils/language';

interface ContentProps extends Props {
    courseID: number;
    title: string;
    description?: string;
    contentTitle: string;
    categories: IKPASCourseCategory[];
    modules: IKPASCourseModule[];
    locale: string;
}

function Content({
    id,
    className,
    template,
    courseID,
    title,
    description,
    contentTitle,
    categories,
    modules,
    locale,
    children,
}: ContentProps) {
    const mainCategory = categories.find(category => category?.isPrimary);

    return (
        <EmptyLayout
            className={clsx('course-layout-content', className ?? false)}
            id={id}
            template={template}
        >
            <div className="flex flex-row-reverse items-start justify-start">
                <div className="flex h-screen w-full max-w-lg shrink-0 grow-0">
                    <div className="fixed right-0 top-0 h-screen w-full max-w-lg shrink-0 grow-0 bg-udir-black text-udir-gray">
                        <div className="h-full">
                            <div className="px-5 py-8">
                                <div className="flex flex-col-reverse items-start justify-start">
                                    <div>
                                        <h1 className="text-2xl">{title}</h1>

                                        <p className="!mb-0 text-sm">{description}</p>
                                    </div>

                                    <div>
                                        <p className="!mb-2 text-sm font-normal">
                                            Kompetanseportalen v2 | Utdanningsdirektoratet
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <span className="flex w-full border border-udir-gray" />
                            </div>

                            <div className="flex h-full flex-col bg-udir-black text-udir-white">
                                <h2 className="!mb-0 hidden px-5 pb-5 text-base font-semibold">
                                    Moduler
                                </h2>

                                <div className="flex w-full flex-col overflow-auto pb-64">
                                    {modules.map(module => (
                                        <Module
                                            key={module.id}
                                            courseID={courseID}
                                            locale={locale}
                                            module={module}
                                            darkMode
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex w-full grow bg-udir-white text-udir-black">
                    <div className="flex w-full flex-col items-start justify-center">
                        <div
                            className="flex h-56 w-full items-center justify-center bg-udir-theme-gray"
                            style={{ backgroundColor: mainCategory?.color ?? '#eaeaf5' }}
                        >
                            <div className="flex w-full max-w-4xl flex-col-reverse items-start justify-center p-10">
                                <h1 className="text-3xl">{contentTitle}</h1>

                                <div className="mb-5 flex w-full flex-row items-center justify-start">
                                    <BaseLink
                                        className="mt-5 flex items-center justify-center rounded-md bg-udir-black px-3 py-2 text-udir-white no-underline"
                                        href={getTranslatedPath('/courses/:courseID/', locale, {
                                            courseID: courseID.toString(),
                                        })}
                                        locale={locale}
                                    >
                                        <span className="mr-1.5">
                                            <ArrowLeftIcon fontSize="18px" />
                                        </span>

                                        <p className="mb-0 text-xs">Tilbake til hovedoversikten</p>
                                    </BaseLink>
                                </div>
                            </div>
                        </div>

                        <div className="flex w-full flex-col">{children}</div>
                    </div>
                </div>
            </div>
        </EmptyLayout>
    );
}

export default Content;
