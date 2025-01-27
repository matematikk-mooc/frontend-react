import SwaggerUI from 'swagger-ui-react';

import { getOpenAPI } from '@/integrations/bff/v1/other';
import { IOpenAPIRes } from '@/shared/utils/openapi';

import 'swagger-ui-react/swagger-ui.css';

interface IProps {
    openAPISpec: IOpenAPIRes | null;
}

function Swagger(props: IProps) {
    const { openAPISpec } = props;
    return <SwaggerUI spec={openAPISpec ?? {}} />;
}

export const getServerSideProps = async () => {
    const openAPISpec = await getOpenAPI();

    return {
        props: {
            openAPISpec,
        },
    };
};

export default Swagger;
