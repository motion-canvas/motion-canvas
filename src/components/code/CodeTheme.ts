export type CodeTokens = Record<string, string>;

export type CodeTheme<T extends CodeTokens = CodeTokens> = {
  [Key: string]: T;
  default: T;
};

export type JSCodeTokens = CodeTokens & {
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
};
