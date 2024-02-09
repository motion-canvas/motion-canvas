export type CodeTokenizer = (input: string) => string[];

/**
 * Default tokenizer function used by ownerless code signals.
 *
 * @param input - The code to tokenize.
 */
export function defaultTokenize(input: string): string[] {
  const tokens: string[] = [];
  let currentToken = '';
  let whitespace = false;

  for (const char of input) {
    switch (char) {
      case ' ':
      case '\t':
      case '\n':
        if (!whitespace && currentToken !== '') {
          tokens.push(currentToken);
          currentToken = '';
        }
        whitespace = true;
        currentToken += char;
        break;
      case '(':
      case ')':
      case '{':
      case '}':
      case '[':
      case ']':
        if (currentToken !== '') {
          tokens.push(currentToken);
          currentToken = '';
        }
        whitespace = false;
        tokens.push(char);
        break;
      default:
        if (whitespace && currentToken !== '') {
          tokens.push(currentToken);
          currentToken = '';
        }
        whitespace = false;
        currentToken += char;
        break;
    }
  }

  if (currentToken !== '') {
    tokens.push(currentToken);
  }

  return tokens;
}
