module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
    'prettier',
  ],
  globals: {
    React: true,
    JSX: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'no-relative-import-paths'],
  reportUnusedDisableDirectives: true,
  root: true,
};
