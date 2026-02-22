// @ts-check

import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended, {
    languageOptions: {
        parserOptions: {
            parser: '@typescript-eslint/parser',
            ecmaVersion: 2020,
            sourceType: 'module',
        },
    },
    rules: {
        '@typescript-eslint/ban-ts-comment': 'error',
        '@typescript-eslint/consistent-type-imports': 'error',
        'no-console': [
            'warn',
            {
                allow: ['error', 'warn'],
            },
        ],
        'max-len': 'off',
        semi: 'off',
    },
    settings: {
        'import/resolver': {
            typescript: {},
        },
    },
})
