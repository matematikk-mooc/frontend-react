import { Head, Html, Main, NextScript } from 'next/document';

interface Props {
    __NEXT_DATA__: {
        locale?: string;
    };
}

function Document({ __NEXT_DATA__ }: Props) {
    const currentLocale = __NEXT_DATA__?.locale ?? 'nb';

    return (
        <Html dir="ltr" lang={currentLocale}>
            <Head />

            <body className="bg-udir-white text-base text-udir-black antialiased">
                <Main />

                <NextScript />
            </body>
        </Html>
    );
}

export default Document;
