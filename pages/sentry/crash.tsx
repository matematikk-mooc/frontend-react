function TestSentryCrash() {
    return null;
}

export const getServerSideProps = async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/404');
    if (!res.ok) throw new Error(`SSR: Failed to fetch data - ${res.statusText}`);

    return {
        props: {},
    };
};

export default TestSentryCrash;
