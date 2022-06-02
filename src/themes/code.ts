import {CodeTheme, JSCodeTokens} from '../components/code';

const KEYWORD = '#ff6470';
const TEXT = '#ACB3BF';
const FUNCTION = '#ffc66d';
const STRING = '#99C47A';
const NUMBER = '#68ABDF';
const PROPERTY = '#AC7BB5';
const COMMENT = '#5c5e60';

export const JS_CODE_THEME: CodeTheme<JSCodeTokens> = {
  default: {
    boolean: KEYWORD,
    constant: KEYWORD,
    keyword: KEYWORD,
    'class-name': NUMBER,
    operator: TEXT,
    punctuation: TEXT,
    'script-punctuation': TEXT,
    function: FUNCTION,
    string: STRING,
    number: NUMBER,
    'literal-property': PROPERTY,
    comment: COMMENT,
    'function-variable': FUNCTION,
  },
  parameter: {
    'literal-property': TEXT,
    operator: TEXT,
    punctuation: NUMBER,
  },
  'attr-name': {
    punctuation: FUNCTION,
  },
};
