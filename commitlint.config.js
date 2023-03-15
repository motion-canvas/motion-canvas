module.exports = {
  extends: ['@commitlint/config-conventional'],
  ignores: [commit => commit.includes('[skip ci]')],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        '2d',
        'cli',
        'core',
        'create',
        'docs',
        'e2e',
        'examples',
        'legacy',
        'player',
        'ui',
        'vite-plugin',
      ],
    ],
  },
};
