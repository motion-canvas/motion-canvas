import {CodeScope, CodeTag, resolveScope} from './CodeScope';
import {CodeTokenizer} from './CodeTokenizer';
import {patienceDiff} from './diff';

/**
 * A function that compares two code snippets and returns a list of
 * {@link CodeTag}s describing a transition between them.
 */
export type CodeDiffer = (
  /**
   * The original code scope.
   */
  from: CodeScope,
  /**
   * The new code scope.
   */
  to: CodeScope,
  /**
   * The inherited tokenizer to use.
   */
  tokenize: CodeTokenizer,
) => CodeTag[];

/**
 * Default diffing function utilizing {@link code.patienceDiff}.
 *
 * @param from - The original code scope.
 * @param to - The new code scope.
 * @param tokenize - The inherited tokenizer to use.
 */
export function defaultDiffer(
  from: CodeScope,
  to: CodeScope,
  tokenize: CodeTokenizer,
) {
  const fromString = resolveScope(from, false);
  const toString = resolveScope(to, true);

  const diff = patienceDiff(tokenize(fromString), tokenize(toString));

  const fragments: CodeTag[] = [];
  let before = '';
  let after = '';
  let lastAdded = false;
  const flush = () => {
    if (before !== '' || after !== '') {
      fragments.push({
        before,
        after,
      });
      before = '';
      after = '';
    }
  };

  for (const line of diff.lines) {
    if (line.aIndex === -1) {
      if (after !== '' && !lastAdded) {
        flush();
      }
      lastAdded = true;
      after += line.line;
    } else if (line.bIndex === -1) {
      if (before !== '' && lastAdded) {
        flush();
      }
      lastAdded = false;
      before += line.line;
    } else {
      flush();
      fragments.push(line.line);
    }
  }
  flush();

  return fragments;
}
