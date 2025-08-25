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
        es6: true,
        browser: true,
        process: true,
        console: true,
        require: true,
        module: true,
        exports: true,
        __dirname: true,
        setTimeout: true,
        Request: true
      }
    },
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin')
    },
    rules: {
      'no-console': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-useless-escape': 'off'
    }
  },
  {
    ignores: [
      'node_modules/',
      'dist/',
      '.apex/',
      'eslint.config.js',
      'packages/*/dist/',
      'packages/*/bin/'
    ]
  }
];