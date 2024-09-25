export const utmConfig = [
    { key: 'utm_source', value: 'https://kp.udir.no/' },
    { key: 'utm_medium', value: 'referral' },
];

export const addParamsToUrl = (url: string, params: { key: string; value: string }[]): string => {
    const hasQuery = url.includes('?');
    const queryString = params
        .map(param => `${encodeURIComponent(param.key)}=${encodeURIComponent(param.value)}`)
        .join('&');

    return hasQuery ? `${url}&${queryString}` : `${url}?${queryString}`;
};
