module.exports = {
  extends: [
    'airbnb-typescript/base',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/recommended-type-checked',
  ],
  plugins: ['@typescript-eslint'],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  rules: {
    '@typescript-eslint/semi': ['error'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-unsafe-call': ['error'],
    '@typescript-eslint/no-unsafe-argument': ['error'],
    '@typescript-eslint/no-unsafe-member-access': ['error'],
    '@typescript-eslint/no-unsafe-assignment': ['error'],
    'no-case-declarations': 'off',
    'import/extensions': ['error', 'always', { ts: 'never' }],
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.test.ts'] },
    ],
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
