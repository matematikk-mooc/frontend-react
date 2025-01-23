import { Alert } from '@navikt/ds-react';
import clsx from 'clsx';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';

import {
    IEnrollmentState,
    IKPASCourseCategory,
    IKPASCourseImage,
} from '@/integrations/kpas/v1/export';
import { DefaultProps } from '@/shared/interfaces/react';

interface ILabelProps {
    category: IKPASCourseCategory;
}

function CourseLabel({ category }: ILabelProps) {
    return (
        <li className="tag rounded-lg bg-udir-white px-4 py-1.5 text-udir-black">
            {category?.title}
        </li>
    );
}

interface Props extends DefaultProps {
    title: string;
    description?: string;
    thumbnail: IKPASCourseImage;
    hasTranslation?: boolean;
    categories: IKPASCourseCategory[];
    enrollment: IEnrollmentState;
    updateEnrollment: () => void;
}

function Banner({
    id,
    className,
    title,
    description,
    thumbnail,
    hasTranslation,
    categories,
    enrollment,
    updateEnrollment,
}: Props) {
    const { t } = useTranslation(['common']);

    const mainCategory = categories.find(category => category?.isPrimary);

    return (
        <div
            className={clsx(
                'course-component-banner bg-udir-theme-gray px-5 py-10 lg:py-14',
                className ?? false,
            )}
            id={id}
            style={{ backgroundColor: mainCategory?.color ?? '#eaeaf5' }}
        >
            <div className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between lg:flex-row">
                <div className="lg:mr-10 lg:max-w-2xl">
                    {!hasTranslation && (
                        <Alert className="mb-5" variant="warning">
                            {t('common:language_not_available')}
                        </Alert>
                    )}

                    <div className="flex flex-col-reverse">
                        <h1 className="text-4xl">{title}</h1>

                        <ul className="tags mb-5 flex list-none flex-wrap gap-4 !pb-0 !pl-0 text-sm">
                            {categories.map(category => (
                                <CourseLabel key={category?.id} category={category} />
                            ))}
                        </ul>
                    </div>

                    <p className="text-base">{description ?? ''}</p>

                    <div className="mx-auto flex max-w-7xl items-center justify-start">
                        {!enrollment.enrolled && (
                            <button
                                className="mt-5 rounded-md bg-udir-black px-6 py-3 text-udir-white"
                                type="button"
                                onClick={updateEnrollment}
                            >
                                Meld deg på
                            </button>
                        )}

                        {enrollment.enrolled && (
                            <>
                                <button
                                    className="mr-5 mt-5 rounded-md bg-udir-black px-6 py-3 text-udir-white"
                                    type="button"
                                    onClick={() => {}}
                                >
                                    Bytt rolle og grupper
                                </button>

                                <button
                                    className="mt-5 rounded-md underline"
                                    type="button"
                                    onClick={updateEnrollment}
                                >
                                    Meld deg av
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="mb-20 hidden size-full max-w-sm items-center justify-center lg:mb-0 lg:flex lg:max-w-lg">
                    {thumbnail && (
                        <Image
                            alt={thumbnail.alt}
                            height={0}
                            src={thumbnail.url}
                            style={{ width: 'auto', height: '100%' }}
                            width={0}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Banner;
