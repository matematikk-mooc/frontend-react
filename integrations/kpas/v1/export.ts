import getConfig from 'next/config';

import apiFetch from '@/integrations/apiFetch';
import { IKPASResponse } from '@/integrations/kpas/kpasFetch';
import z from '@/shared/utils/validate';

const { publicRuntimeConfig } = getConfig() || {};

export type IEnrollmentState = {
    enrolled: boolean;
    requirements: {
        completed: number;
        total: number;
    };
};

export const getCourses = async () => {
    const apiPath = `/export/courses`;
    return apiFetch<IKPASResponse<number[]>>(publicRuntimeConfig.KPAS_API_URL, apiPath);
};

export const KPASCourseCategorySchema = z
    .strictObject({
        id: z.number().openapi({ example: 99 }),
        order: z.number().openapi({ example: 1 }),
        title: z.string().openapi({ example: 'Category name' }),
        slug: z.string().openapi({ example: 'category-name' }),
        type: z.string().openapi({ example: 'group' }),
        isPrimary: z.boolean().openapi({ example: false }),
        color: z.string().openapi({ example: '#000000' }).nullable(),
    })
    .nullable()
    .openapi('KPASCourseCategory');
export type IKPASCourseCategory = z.infer<typeof KPASCourseCategorySchema>;

export const KPASCourseImageSchema = z
    .strictObject({
        type: z.string().openapi({ example: 'illustration' }),
        url: z.string().openapi({ example: 'https://example.com/image.jpg' }),
        alt: z.string().openapi({ example: 'Image alt text' }),
    })
    .nullable()
    .openapi('KPASCourseImage');
export type IKPASCourseImage = z.infer<typeof KPASCourseImageSchema>;

export const KPASCourseSchema = z
    .strictObject({
        id: z.number().openapi({ example: 360 }),
        title: z.string().openapi({ example: 'Course name' }),
        slug: z.string().openapi({ example: 'course-name' }),
        description: z.string().openapi({ example: 'Course description' }),
        createdAt: z.string().openapi({ example: '2021-09-01T00:00:00.000Z' }),
        isFeatured: z.boolean().openapi({ example: false }),
        showNewBanner: z.boolean().openapi({ example: false }),
        showMoocLicense: z.boolean().openapi({ example: false }),
        hideIndentedContentForLeaders: z.boolean().openapi({ example: false }),
        unmaintainedSince: z.string().nullable().openapi({ example: '2021-09-01T00:00:00.000Z' }),
        frontpageSlugID: z.string().nullable().openapi({ example: 'frontpage-slug' }),
        fallbackLanguage: z.string().openapi({ example: 'nb' }),
        languages: z.array(z.string()).openapi({ example: ['nb', 'se'] }),
        banner: z
            .strictObject({
                type: z.string().openapi({ example: 'info' }),
                message: z.string().openapi({ example: 'Banner message' }),
            })
            .nullable(),
        images: z.array(KPASCourseImageSchema),
        categories: z.array(KPASCourseCategorySchema),
    })
    .nullable()
    .openapi('KPASCourse');
export type IKPASCourse = z.infer<typeof KPASCourseSchema>;

export const getCourse = async (courseID: number) => {
    const apiPath = `/export/courses/${courseID}`;
    return apiFetch<IKPASResponse<IKPASCourse>>(publicRuntimeConfig.KPAS_API_URL, apiPath);
};

export const KPASCourseModuleItemSchema = z
    .strictObject({
        id: z.number().openapi({ example: 52000 }),
        slugID: z.string().openapi({ example: 'module-item-title' }).nullable(),
        order: z.number().openapi({ example: 1 }),
        indent: z.number().openapi({ example: 0 }),
        title: z.object({
            nb: z.string().openapi({ example: 'Module item title' }),
        }),
        slug: z.object({
            nb: z.string().openapi({ example: 'module-item-title' }),
        }),
        type: z.string().openapi({ example: 'page' }),
        requirement: z.string().openapi({ example: 'mark' }).nullable(),
    })
    .openapi('KPASCourseModuleItem');
export type IKPASCourseModuleItem = z.infer<typeof KPASCourseModuleItemSchema>;

export const KPASCourseModuleSchema = z
    .strictObject({
        id: z.number().openapi({ example: 4500 }),
        order: z.number().openapi({ example: 1 }),
        title: z.object({
            nb: z.string().openapi({ example: 'Module title' }),
        }),
        slug: z.object({
            nb: z.string().openapi({ example: 'module-title' }),
        }),
        items: z.array(KPASCourseModuleItemSchema),
    })
    .openapi('KPASCourseModule');
export type IKPASCourseModule = z.infer<typeof KPASCourseModuleSchema>;

export const getCourseModules = async (courseID: number) => {
    const apiPath = `/export/courses/${courseID}/modules`;
    return apiFetch<IKPASResponse<IKPASCourseModule[]>>(publicRuntimeConfig.KPAS_API_URL, apiPath);
};

export const KPASCoursePageSchema = z
    .strictObject({
        id: z.number().openapi({ example: 25000 }),
        title: z.object({
            nb: z.string().openapi({ example: 'Page title' }),
        }),
        slug: z.object({
            nb: z.string().openapi({ example: 'page-title' }),
        }),
        isFrontpage: z.boolean().openapi({ example: false }),
        createdAt: z.string().openapi({ example: '2021-09-01T00:00:00.000Z' }),
        updatedAt: z.string().openapi({ example: '2021-09-01T00:00:00.000Z' }),
        content: z.object({
            nb: z.string().openapi({ example: '<p>Page content</p>' }),
        }),
    })
    .nullable()
    .openapi('KPASCoursePage');
export type IKPASCoursePage = z.infer<typeof KPASCoursePageSchema>;

export const getCoursePage = async (courseID: number, pageSlug: string) => {
    const apiPath = `/export/courses/${courseID}/pages/${pageSlug}`;
    return apiFetch<IKPASResponse<IKPASCoursePage | null>>(
        publicRuntimeConfig.KPAS_API_URL,
        apiPath,
    );
};
