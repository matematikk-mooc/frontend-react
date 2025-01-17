// ?NOTE: Update middleware.ts config.matcher if you add or remove paths, not able to dynamically generate that list
const localesConfig = {
    routes: {
        '/contact/': {
            nb: '/kontakt/',
            nn: '/kontakt/',
        },
        '/privacy/': {
            nb: '/personvern/',
            nn: '/personvern/',
        },
        '/about/': {
            nb: '/om-kompetanseportalen/',
            nn: '/om-kompetanseportalen/',
        },
        '/': {
            nb: '/',
            nn: '/',
        },
    },
};

export default localesConfig;

export const generateRewrites = () => {
    const rewrites = [];

    Object.keys(localesConfig.routes).forEach(defaultPath => {
        const localePaths = localesConfig.routes[defaultPath];

        if (defaultPath !== '/' && localePaths) {
            Object.keys(localePaths).forEach(locale => {
                const translatedPath = localePaths[locale];

                if (translatedPath) {
                    rewrites.push({
                        source: `/${locale}${translatedPath}`,
                        destination: defaultPath,
                        locale: false,
                    });
                }
            });
        }
    });

    return rewrites;
};
