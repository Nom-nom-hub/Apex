// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        node: true,
        es6: true
      }
    },
    rules: {
      'no-console': 'warn'
    }
  },
  {
    ignores: [
      'node_modules/',
      'dist/',
      '.apex/'
    ]
  }
);