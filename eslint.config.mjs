import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import tsdoc from 'eslint-plugin-tsdoc';
import globals from 'globals';

export default [
  {
    name: 'motion-canvas/global-ignores',
    ignores: [
      '**/*.js',
      '**/*.d.ts',
      'packages/template/**',
      'packages/create/template-*/**',
    ],
  },
  js.configs.recommended,
  ...tsPlugin.configs['flat/recommended'],
  {
    name: 'motion-canvas/typescript',
    files: ['**/*.ts', '**/*.tsx', '**/*.mts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      tsdoc,
    },
    rules: {
      'require-yield': 'off',
      'grouped-accessor-pairs': ['error', 'getBeforeSet'],
      eqeqeq: ['error', 'always', {null: 'ignore'}],
      curly: ['error', 'multi-line'],
      '@typescript-eslint/explicit-member-accessibility': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-namespace': 'off',
      'tsdoc/syntax': 'error',
      // The codebase relies on bare signal reads (`signal.value;`) to
      // subscribe to reactive dependencies, on `cond && action()` and on
      // exhausting generators (`[...task];`). None of these were flagged
      // by the v8 config, so the rule stays off.
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
          // The codebase marks intentionally ignored catch params with
          // `catch (_)`. This restores the pre-v9 default.
          caughtErrors: 'none',
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'forbid',
          trailingUnderscore: 'forbid',
          filter: {
            regex: '^(__html)$',
            match: false,
          },
        },
        {
          selector: ['variable', 'import'],
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'variable',
          modifiers: ['global'],
          format: ['PascalCase', 'UPPER_CASE'],
        },
        {
          selector: 'variable',
          modifiers: ['exported'],
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'variable',
          modifiers: ['exported', 'global'],
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        },
        {
          selector: ['parameter', 'variable'],
          modifiers: ['unused'],
          format: ['camelCase'],
          leadingUnderscore: 'require',
        },
        {
          selector: 'function',
          modifiers: ['global'],
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: ['typeLike', 'enumMember'],
          format: ['PascalCase'],
        },
        {
          selector: 'typeParameter',
          format: ['PascalCase'],
          prefix: ['T'],
        },
      ],
    },
  },
];
