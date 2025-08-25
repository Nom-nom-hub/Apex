// eslint.config.js
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
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