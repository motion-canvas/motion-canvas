module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      ['core', 'create', 'docs', 'ui', 'vite-plugin'],
    ],
  },
};
