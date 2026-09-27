module.exports = {
  root: true,
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
        pathGroups: [{ pattern: '@/**', group: 'internal' }],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
      },
    ],
  },
  ignorePatterns: ['node_modules/', 'ios/', 'android/', '.expo/', 'dist/'],
};
