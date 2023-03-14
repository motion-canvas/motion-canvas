const codeTheme = require('prism-react-renderer/themes/github');

module.exports = {
  plain: {
    color: 'var(--hl-color)',
    backgroundColor: 'var(--hl-background)',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: 'var(--hl-comment)',
        fontStyle: 'var(--hl-comment-style)',
      },
    },
    {
      types: ['builtin', 'changed', 'keyword', 'interpolation-punctuation'],
      style: {
        color: 'var(--hl-keyword)',
      },
    },
    {
      types: ['number', 'inserted'],
      style: {
        color: 'var(--hl-number)',
      },
    },
    {
      types: ['constant'],
      style: {
        color: 'var(--hl-constant)',
      },
    },
    {
      types: ['attr-name', 'variable'],
      style: {
        color: 'var(--hl-variable)',
      },
    },
    {
      types: ['deleted', 'string', 'attr-value', 'template-punctuation'],
      style: {
        color: 'var(--hl-string)',
      },
    },
    {
      types: ['selector'],
      style: {
        color: 'var(--hl-selector)',
      },
    },
    {
      types: ['tag'],
      style: {
        color: 'var(--hl-tag)',
      },
    },
    {
      types: ['punctuation', 'operator'],
      style: {
        color: 'var(--hl-punctuation)',
      },
    },
    {
      types: ['function'],
      style: {
        color: 'var(--hl-function)',
      },
    },
    {
      types: ['class-name'],
      style: {
        color: 'var(--hl-class)',
      },
    },
    {
      types: ['char'],
      style: {
        color: 'var(--hl-char)',
      },
    },
  ],
};
