import getConfig from 'next/config';

import apiFetch, { IResponse } from '@/integrations/apiFetch';
import { IKPASCourse, IKPASCourseModule, IKPASCoursePage } from '@/integrations/kpas/v1/export';

const { publicRuntimeConfig } = getConfig() || {};

export const getCourses = async () => {
    const apiPath = `/kpas/v1/courses`;
    return apiFetch<IResponse<number[]>>(publicRuntimeConfig.BFF_API_URL, apiPath);
};

export const getCourse = async (courseID: number) => {
    const apiPath = `/kpas/v1/courses/${courseID}`;
    return apiFetch<IResponse<IKPASCourse | null>>(publicRuntimeConfig.BFF_API_URL, apiPath);
};

export const getCourseModules = async (courseID: number) => {
    const apiPath = `/kpas/v1/courses/${courseID}/modules`;
    return apiFetch<IResponse<IKPASCourseModule[]>>(publicRuntimeConfig.BFF_API_URL, apiPath);
};

export const getCoursePage = async (courseID: number, pageSlug: string) => {
    const apiPath = `/kpas/v1/courses/${courseID}/pages/${pageSlug}`;
    return apiFetch<IResponse<IKPASCoursePage | null>>(publicRuntimeConfig.BFF_API_URL, apiPath);
};
