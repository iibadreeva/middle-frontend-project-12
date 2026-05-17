import process from 'node:process'
import { FlatCompat } from '@eslint/eslintrc'
import stylistic from '@stylistic/eslint-plugin'
import js from '@eslint/js'
import globals from 'globals'
import reactRefresh from 'eslint-plugin-react-refresh'
import functional from 'eslint-plugin-functional/flat'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

const baseDirectory = process.cwd()
const isStrictLint = process.env.ESLINT_STRICT === 'true'

const compat = new FlatCompat({
  baseDirectory,
  resolvePluginsRelativeTo: baseDirectory,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: [
      '**/node_modules/**',
      'dist',
      'build',
      'hexlet-login.js',
      'hexlet-login.css',
      'hexlet-login.html',
    ],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },
  ...compat.extends(
    '@feature-sliced/eslint-config/rules/public-api',
    '@feature-sliced/eslint-config/rules/layers-slices',
    '@feature-sliced/eslint-config/rules/import-order',
  ),
  ...compat.extends('airbnb', 'plugin:react/recommended', 'plugin:react-hooks/recommended'),
  functional.configs.recommended,
  functional.configs.disableTypeChecked,
  {
    files: ['vite.config.js', 'eslint.config.mjs'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'import/no-extraneous-dependencies': 'off',
      'import/no-unresolved': 'off',
      'indent': 'off',
      'quote-props': 'off',
    },
  },
  reactRefresh.configs.vite,
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      'import/extensions': 'off',
      'import/no-unresolved': 'off',
      'react/prop-types': 'off',
      'no-console': 'off',
      'react/react-in-jsx-scope': 'off',
      'functional/no-conditional-statements': 'off',
      'functional/no-expression-statements': 'off',
      'functional/immutable-data': 'off',
      'functional/functional-parameters': 'off',
      'functional/no-try-statements': 'off',
      'functional/no-throw-statements': 'off',
      'functional/no-return-void': 'off',
      'no-underscore-dangle': ['error', { allow: ['__filename', '__dirname'] }],
      'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
      'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
    },
  },
  {
    files: ['src/**/index.js'],
    rules: {
      'import/prefer-default-export': 'off',
    },
  },
  ...(isStrictLint
    ? [
        {
          files: ['*.{js,jsx,mjs}', '**/*.{js,jsx,mjs}'],
          plugins: {
            '@stylistic': stylistic,
          },
          rules: {
            'arrow-parens': 'off',
            'block-spacing': 'off',
            'brace-style': 'off',
            'comma-spacing': 'off',
            'jsx-quotes': 'off',
            'key-spacing': 'off',
            'keyword-spacing': 'off',
            'max-statements-per-line': 'off',
            'function-paren-newline': 'off',
            'implicit-arrow-linebreak': 'off',
            'no-confusing-arrow': 'off',
            'max-len': 'off',
            'object-curly-spacing': 'off',
            'operator-linebreak': 'off',
            'quotes': 'off',
            'semi': 'off',
            'semi-spacing': 'off',
            'space-before-blocks': 'off',
            'space-before-function-paren': 'off',
            'space-infix-ops': 'off',
            '@stylistic/arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
            '@stylistic/arrow-spacing': 'error',
            '@stylistic/block-spacing': 'error',
            '@stylistic/brace-style': ['error', '1tbs'],
            '@stylistic/comma-spacing': 'error',
            '@stylistic/jsx-wrap-multilines': [
              'error',
              {
                declaration: 'parens-new-line',
                assignment: 'parens-new-line',
                return: 'parens-new-line',
                arrow: 'parens-new-line',
                condition: 'parens-new-line',
                logical: 'parens-new-line',
                prop: 'parens-new-line',
              },
            ],
            '@stylistic/key-spacing': 'error',
            '@stylistic/keyword-spacing': 'error',
            '@stylistic/max-statements-per-line': ['error', { max: 1 }],
            '@stylistic/object-curly-spacing': ['error', 'always'],
            '@stylistic/operator-linebreak': ['error', 'before'],
            '@stylistic/quotes': ['error', 'single'],
            '@stylistic/semi': ['error', 'never'],
            '@stylistic/semi-spacing': 'error',
            '@stylistic/space-before-blocks': 'error',
            '@stylistic/space-before-function-paren': [
              'error',
              {
                anonymous: 'always',
                named: 'never',
                asyncArrow: 'always',
              },
            ],
            '@stylistic/space-infix-ops': 'error',
          },
        },
      ]
    : [eslintConfigPrettier]),
]
