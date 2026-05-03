import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
    js.configs.recommended,
    {
        files: ['**/*.{js,jsx}'],
        plugins: {
            react,
            'react-hooks': reactHooks,
        },
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly',
                fetch: 'readonly',
                localStorage: 'readonly',
                alert: 'readonly',
                confirm: 'readonly',
                console: 'readonly',
                FormData: 'readonly',
                Image: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
            },
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/jsx-key': 'warn',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'no-unused-vars': ['warn', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }],
            'no-console': 'off',
            'no-undef': 'error',
            'semi': ['warn', 'always'],
            'quotes': ['warn', 'single'],
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'build/**',
            'vite.config.js',
        ],
    },
];