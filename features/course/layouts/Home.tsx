import {
    PlayFillIcon,
    TasklistIcon,
    CheckmarkIcon,
    XMarkIcon,
    MinusIcon,
} from '@navikt/aksel-icons';
import clsx from 'clsx';
import { useRouter } from 'next/router';

import Banner from '@/features/course/components/Banner';
import {
    IEnrollmentState,
    IKPASCourseCategory,
    IKPASCourseImage,
    IKPASCourseModule,
    IKPASCourseModuleItem,
} from '@/integrations/kpas/v1/export';
import BaseLink from '@/shared/components/BaseLink';
import Default, { Props } from '@/shared/layouts/Default';
import { getObjectTranslation, getTranslatedPath } from '@/shared/utils/language';

interface IModuleItemProps {
    courseID: number;
    moduleItem: IKPASCourseModuleItem;
    locale: string;
    isLast: boolean;
}

function ModuleItem({ courseID, moduleItem, locale, isLast }: IModuleItemProps) {
    return (
        <li
            key={moduleItem.id}
            className={clsx(
                'flex items-center justify-between px-5 py-3',
                !isLast && 'border-b-2 border-udir-gray',
            )}
        >
            <BaseLink
                className="mr-5 flex items-start justify-start"
                href={getTranslatedPath('/courses/:courseID/:courseSlugID/', locale, {
                    courseID: courseID.toString(),
                    courseSlugID: encodeURIComponent(moduleItem.slugID ?? 'missing-slug-id'),
                })}
                locale={locale}
            >
                <span className="mr-2 text-udir-black">
                    <TasklistIcon fontSize="24px" />
                </span>

                <div className="flex flex-col">
                    <h4 className="!mb-1 text-base">
                        {getObjectTranslation(locale, moduleItem.title)}
                    </h4>

                    <p className="!mb-0 text-sm">{moduleItem.type}</p>
                </div>
            </BaseLink>

            {moduleItem.requirement != null && moduleItem.type === 'page' && (
                <span className="rounded-full bg-udir-success p-1 text-udir-white">
                    <CheckmarkIcon fontSize="20px" />
                </span>
            )}

            {moduleItem.requirement != null && moduleItem.type !== 'page' && (
                <span className="rounded-full bg-udir-error p-1 text-udir-white">
                    <XMarkIcon fontSize="20px" />
                </span>
            )}

            {moduleItem.requirement == null && (
                <span className="rounded-full bg-udir-gray p-1 text-udir-black">
                    <MinusIcon fontSize="20px" />
                </span>
            )}
        </li>
    );
}

interface IModuleItemHeaderProps {
    title: string | null;
}

function ModuleItemHeader({ title }: IModuleItemHeaderProps) {
    return (
        <li className="flex items-center justify-between border-y-2 border-udir-gray bg-udir-gray px-5 py-2">
            <h4 className="!mb-0 text-sm">{title}</h4>
        </li>
    );
}

interface IModuleProps {
    courseID: number;
    module: IKPASCourseModule;
    locale: string;
}

function Module({ courseID, module, locale }: IModuleProps) {
    return (
        <div className="mb-5 rounded-md border-2 border-udir-gray">
            <div className="flex w-full items-center justify-between bg-udir-gray px-5 py-4 text-udir-black">
                <h3 className="!mb-0 mr-5 text-lg">{getObjectTranslation(locale, module.title)}</h3>

                <p className="!mb-0 text-sm">3 av 5 leksjoner</p>
            </div>

            <ul className="list-none !pb-0 !pl-0">
                {module.items.map(moduleItem => {
                    const isLast = module.items.indexOf(moduleItem) === module.items.length - 1;
                    const isHeader = moduleItem.type === 'subheader';

                    if (isHeader) {
                        return (
                            <ModuleItemHeader
                                key={moduleItem.id}
                                title={getObjectTranslation(locale, moduleItem.title)}
                            />
                        );
                    }

                    return (
                        <ModuleItem
                            key={moduleItem.id}
                            courseID={courseID}
                            isLast={isLast}
                            locale={locale}
                            moduleItem={moduleItem}
                        />
                    );
                })}
            </ul>
        </div>
    );
}

interface HomeProps extends Props {
    locale: string;
    courseID: number;
    title: string;
    description?: string;
    thumbnail: IKPASCourseImage;
    categories: IKPASCourseCategory[];
    modules: IKPASCourseModule[];
    enrollment: IEnrollmentState;
    updateEnrollment: () => void;
}

function Home({
    id,
    className,
    children,
    locale,
    template,
    mainClassName,
    courseID,
    title,
    description,
    thumbnail,
    categories,
    modules,
    enrollment,
    updateEnrollment,
}: HomeProps) {
    const router = useRouter();

    const localeName = router.locale ?? 'nb';
    const hasTranslation = localeName === locale;

    const { enrolled, requirements } = enrollment;
    const { completed, total } = requirements;

    return (
        <Default
            className={clsx('course-layout-home', className ?? false)}
            id={id}
            mainClassName={mainClassName}
            template={template}
            title={title}
        >
            <Banner
                categories={categories}
                description={description}
                enrollment={enrollment}
                hasTranslation={hasTranslation}
                thumbnail={thumbnail}
                title={title}
                updateEnrollment={updateEnrollment}
            />

            <div className="mx-5 flex flex-col">
                <div className="mx-auto mb-28 mt-10 flex w-full flex-col xl:max-w-7xl xl:flex-row-reverse">
                    <div className="flex grow flex-col pb-5 xl:max-w-2xl">
                        {enrolled && (
                            <a
                                className="mb-8 flex w-full items-center justify-between rounded-md border-2 border-udir-white bg-udir-black px-5 py-4 text-udir-white no-underline"
                                href="/"
                            >
                                <div className="mr-5">
                                    <p className="!mb-0.5 text-base font-bold">
                                        Forsett med &quot;2.1 Råd om kunstig intelligens i
                                        skolen&quot;
                                    </p>

                                    <p className="!mb-0 text-sm">
                                        {completed} av {total} leksjoner gjennomført
                                    </p>
                                </div>

                                <span className="rounded-full bg-udir-white p-1.5 text-udir-black">
                                    <PlayFillIcon fontSize="24px" />
                                </span>
                            </a>
                        )}

                        <div className="w-full">{children}</div>
                    </div>

                    <div className="flex grow flex-col xl:mr-10 xl:max-w-xl">
                        <h2 className="!mb-5 hidden">Moduler</h2>

                        <div className="w-full rounded-md">
                            {modules.map(module => (
                                <Module
                                    key={module.id}
                                    courseID={courseID}
                                    locale={localeName}
                                    module={module}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Default>
    );
}

export default Home;
