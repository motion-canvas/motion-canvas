export type CodeTheme = Record<string, string> & {fallback: string};

export interface JSCodeTheme {
  boolean?: string;
  'class-name'?: string;
  comment?: string;
  constant?: string;
  function?: string;
  'function-variable'?: string;
  hashbang?: string;
  keyword?: string;
  'literal-property'?: string;
  number?: string;
  operator?: string;
  parameter?: string;
  punctuation?: string;
  regex?: string;
  string?: string;
  'string-property'?: string;
  'template-string'?: string;
  fallback: string;
}
