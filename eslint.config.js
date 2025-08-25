// eslint.config.js
const eslint = require('@eslint/js');

module.exports = [
  eslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        node: true,
        es6: true
      }
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin')
    },
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn'
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