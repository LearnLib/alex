module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'no-console': 'off',
    'max-len': ['error', {'code': 140, 'tabWidth': 2}],
    'no-plusplus': 'off',
    'comma-dangle': 'off',
    'dot-notation': 'off',
    'no-shadow': 'off',
    'implicit-arrow-linebreak': 'off',
    'no-throw-literal': 'off',
    'import/prefer-default-export': 'off',
    'max-classes-per-file': 'off',
    'no-await-in-loop': 'off',
    'no-restricted-syntax': 'off',
    "no-unused-vars": "off",
    '@typescript-eslint/no-unused-vars': ["error"],
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
  },
};
