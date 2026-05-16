import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import globals from 'globals';
import reactRefresh from 'eslint-plugin-react-refresh';
import functional from 'eslint-plugin-functional/flat';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      '**/node_modules/**',
      'dist',
      'build',
      'eslint.config.mjs',
      'vite.config.js',
      'hexlet-login.js',
      'hexlet-login.css',
      'hexlet-login.html',
    ],
  },
  {
    files: ['**/*.{js,jsx}'],
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
    files: ['vite.config.js'],
    languageOptions: {
      globals: globals.node,
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
  eslintConfigPrettier,
];
