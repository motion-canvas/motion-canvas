/* eslint-disable @typescript-eslint/naming-convention */
import {HighlightStyle} from '@codemirror/language';
import {EditorView} from '@codemirror/view';
import {tags} from '@lezer/highlight';

export const SyntaxHighlightStyle = HighlightStyle.define([
  {tag: tags.comment, color: 'var(--hl-comment)'},
  {tag: tags.docComment, color: 'var(--hl-comment)'},
  {tag: tags.blockComment, color: 'var(--hl-comment)'},
  {tag: tags.keyword, color: 'var(--hl-keyword)'},
  {tag: tags.number, color: 'var(--hl-number)'},
  {tag: tags.inserted, color: 'var(--hl-number)'},
  {tag: tags.constant(tags.propertyName), color: 'var(--hl-constant)'},
  {tag: tags.attributeName, color: 'var(--hl-variable)'},
  {tag: tags.variableName, color: 'var(--hl-variable)'},
  {tag: tags.propertyName, color: 'var(--hl-variable)'},
  {tag: tags.deleted, color: 'var(--hl-string)'},
  {tag: tags.string, color: 'var(--hl-string)'},
  {tag: tags.attributeValue, color: 'var(--hl-string)'},
  {tag: tags.tagName, color: 'var(--hl-tag)'},
  {tag: tags.typeName, color: 'var(--hl-tag)'},
  {tag: tags.punctuation, color: 'var(--hl-punctuation)'},
  {tag: tags.operator, color: 'var(--hl-punctuation)'},
  {tag: tags.function(tags.variableName), color: 'var(--hl-function)'},
  {tag: tags.function(tags.propertyName), color: 'var(--hl-function)'},
  {tag: tags.className, color: 'var(--hl-class)'},
  {tag: tags.character, color: 'var(--hl-char)'},
]);

export const EditorTheme = EditorView.theme({
  '&': {
    fontSize: `var(--ifm-code-font-size)`,
    lineHeight: `21.04px`,
    fontFamily: 'var(--ifm-font-family-monospace)',
    color: 'var(--hl-color)',
    backgroundColor: 'var(--hl-background)',
  },
  '&.cm-focused .cm-cursor': {
    borderLeftColor: 'var(--hl-color)',
  },
  '&.cm-focused': {
    outline: 'none',
  },
  '.cm-gutters': {
    backgroundColor: 'var(--hl-background)',
    color: 'var(--ifm-color-secondary-darkest)',
    borderRight: '1px solid var(--ifm-background-color)',
  },
  '& .cm-lineNumbers .cm-gutterElement': {
    paddingLeft: 'var(--ifm-pre-padding)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'var(--ifm-code-active-color)',
  },
  '.cm-scroller': {
    fontFamily: 'var(--ifm-font-family-monospace)',
    lineHeight: 'var(--ifm-pre-line-height)',
    paddingTop: 'var(--ifm-pre-padding)',
    paddingBottom: 'var(--ifm-pre-padding)',
  },
  '.cm-content': {
    padding: '0',
  },
  '& .cm-line': {
    paddingRight: 'var(--ifm-pre-padding)',
  },
  '& .cm-selectionBackground, &.cm-focused .cm-selectionBackground, ::selection':
    {
      backgroundColor: 'var(--ifm-code-selection-color) !important',
    },
  '.cm-activeLine': {
    backgroundColor: 'var(--ifm-code-active-color)',
  },
  '.cm-selectionMatch': {
    backgroundColor: 'var(--ifm-code-selection-color)',
  },
  '.cm-foldPlaceholder': {
    backgroundColor: 'var(--ifm-code-selection-color)',
    borderColor: 'var(--ifm-color-emphasis-300)',
  },
  '.cm-tooltip': {
    backgroundColor: 'var(--ifm-background-surface-color)',
  },
});
