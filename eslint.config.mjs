import path from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';
import pluginImport from 'eslint-plugin-import';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginTailwindcss from 'eslint-plugin-tailwindcss';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const project = path.resolve(__dirname, 'tsconfig.json');
const compat = new FlatCompat({
    baseDirectory: path.resolve(__dirname),
});

const config = [
    ...compat.extends(
        'next/core-web-vitals',
        'next/typescript',
        'plugin:prettier/recommended',
        'plugin:tailwindcss/recommended',
        'plugin:jsx-a11y/recommended',
    ),

    {
        ignores: ['public/sw.js', 'public/workbox-*.js', '.next/**'],
    },

    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parserOptions: {
                project: project,
                sourceType: 'module',
            },
        },

        plugins: {
            prettier: pluginPrettier,
            import: pluginImport,
            'jsx-a11y': pluginJsxA11y,
            tailwindcss: pluginTailwindcss,
        },

        settings: {
            react: {
                version: 'detect',
            },
            'import/resolver': {
                node: {
                    extensions: ['.ts', '.tsx'],
                },
            },
        },

        rules: {
            '@typescript-eslint/no-throw-literal': 'off',

            'tailwindcss/classnames-order': 'warn',
            'tailwindcss/enforces-shorthand': 'warn',
            'tailwindcss/no-custom-classname': 'off',

            'prettier/prettier': 'error',
            'react/react-in-jsx-scope': 'off',
            'react/require-default-props': 'off',

            '@typescript-eslint/no-unused-vars': [
                'error',
                { varsIgnorePattern: 'Schema$', argsIgnorePattern: '^_' },
            ],

            'import/no-extraneous-dependencies': [
                'error',
                {
                    devDependencies: ['**/*.ts', '**/*.tsx', 'playwright.config.ts'],
                },
            ],

            'import/order': [
                'warn',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                        'object',
                    ],
                    'newlines-between': 'always',
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                },
            ],

            'react/jsx-sort-props': [
                'warn',
                {
                    ignoreCase: true,
                    callbacksLast: true,
                    shorthandFirst: false,
                    shorthandLast: true,
                    noSortAlphabetically: false,
                    reservedFirst: true,
                },
            ],
        },
    },

    {
        files: ['**/*.js'],
        rules: {
            '@typescript-eslint/no-require-imports': 'off',
        },
    },

    {
        files: ['tests/**/*.ts'],
        rules: {
            'no-restricted-syntax': 'off',
            'no-await-in-loop': 'off',
        },
    },
];

export default config;
