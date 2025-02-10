import dsTailwind from '@navikt/ds-tailwind';
import { type Config } from 'tailwindcss';

const hoverFocusPlugin = ({ addVariant }: Config) => {
    addVariant('hover-focus', ['&:hover', '&:focus']);
};

const config = {
    mode: 'jit',
    presets: [dsTailwind],
    content: ['./features/**/*.{ts,tsx}', './pages/**/*.{ts,tsx}', './shared/**/*.{ts,tsx}'],
    theme: {
        extend: {
            screens: {
                xs: '500px',
                sm: '700px',
                md: '850px',
                lg: '1100px',
                xl: '1300px',
                '2xl': '1500px',
                '3xl': '1800px',
                '4xl': '2200px',
            },
            colors: {
                'udir-primary': '#7dbf9d',
                'udir-black': '#303030',
                'udir-white': '#ffffff',
                'udir-gray': '#eaeaea',

                'udir-success': '#3b7858',
                'udir-error': '#db0001',

                'udir-theme-gray': '#eaeaf5',
            },
        },
    },
    plugins: [hoverFocusPlugin],
};

export default config;
