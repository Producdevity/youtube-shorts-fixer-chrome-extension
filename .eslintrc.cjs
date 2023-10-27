// import eslint from 'vite-plugin-eslint';
/** @type {import('eslint').Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:prettier/recommended'],
  rules: {
    'prefer-const': 'error',
    'prefer-template': 'error',
  },
}
