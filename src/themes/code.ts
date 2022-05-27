import {JSCodeTheme} from '../components/code';

const KEYWORD = '#ff6470';
const TEXT = '#ACB3BF';
const FUNCTION = '#ffc66d';
const STRING = '#99C47A';
const NUMBER = '#68ABDF';
const PROPERTY = '#AC7BB5';
const COMMENT = '#a9b7c6';

export const JS_CODE_THEME: JSCodeTheme = {
  boolean: KEYWORD,
  constant: KEYWORD,
  keyword: KEYWORD,
  'class-name': TEXT,
  operator: TEXT,
  punctuation: TEXT,
  function: FUNCTION,
  string: STRING,
  number: NUMBER,
  'literal-property': PROPERTY,
  comment: COMMENT,
  'function-variable': '#ff00ff',
  hashbang: '#ff00ff',
  parameter: '#ff00ff',
  regex: '#ff00ff',
  'string-property': '#ff00ff',
  'template-string': '#ff00ff',
  fallback: '#ff00ff',
};
