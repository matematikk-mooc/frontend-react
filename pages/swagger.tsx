'use client';

import { PHASE_PRODUCTION_BUILD } from 'next/constants';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';

import { getOpenAPI } from '@/integrations/bff/v1/other';
import { IOpenAPIRes } from '@/shared/utils/openapi';

import 'swagger-ui-react/swagger-ui.css';

interface IProps {
    openAPISpec: IOpenAPIRes | null;
}

function Swagger(props: IProps) {
    const { openAPISpec } = props;
    const router = useRouter();

    useEffect(() => {
        if (openAPISpec == null) router.reload();
    }, [openAPISpec, router]);
    if (openAPISpec == null) return null;

    return <SwaggerUI spec={openAPISpec ?? {}} />;
}

export const getStaticProps = async () => {
    let openAPISpec: IOpenAPIRes | null = null;

    if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) openAPISpec = await getOpenAPI();

    return {
        revalidate: openAPISpec != null ? 60 : 1,
        props: {
            openAPISpec,
        },
    };
};

export default Swagger;
