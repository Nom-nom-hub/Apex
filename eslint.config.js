// eslint.config.js
const eslint = require('@eslint/js');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');

module.exports = [
  eslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        node: true,
        es6: true
      }
    },
    rules: {
      ...tseslint.configs.recommended.rules,
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
];