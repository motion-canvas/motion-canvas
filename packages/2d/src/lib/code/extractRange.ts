import {CodeRange} from './CodeRange';
import {CodeTag, resolveCodeTag} from './CodeScope';

/**
 * Transform the fragments to isolate the given range into its own fragment.
 *
 * @remarks
 * This function will try to preserve the original fragments, resolving them
 * only if they overlap with the range.
 *
 * @param range - The range to extract.
 * @param fragments - The fragments to transform.
 *
 * @returns A tuple containing the transformed fragments and the index of the
 *          isolated fragment within.
 */
export function extractRange(
  range: CodeRange,
  fragments: CodeTag[],
): [CodeTag[], number] {
  const [from, to] = range;
  let [fromRow, fromColumn] = from;
  let [toRow, toColumn] = to;
  if (fromRow > toRow || (fromRow === toRow && fromColumn > toColumn)) {
    [fromRow, fromColumn] = to;
    [toRow, toColumn] = from;
  }

  let currentRow = 0;
  let currentColumn = 0;
  const newFragments: CodeTag[] = [];
  let index = -1;
  let found = false;
  let extracted = '';

  for (const fragment of fragments) {
    if (found) {
      newFragments.push(fragment);
      continue;
    }

    const resolved = resolveCodeTag(fragment, false);
    const lines = resolved.split('\n');
    const newRows = lines.length - 1;
    const lastColumn = lines[newRows].length;
    const nextColumn = newRows > 0 ? lastColumn : currentColumn + lastColumn;

    if (
      fromRow > currentRow + newRows ||
      (fromRow === currentRow + newRows && fromColumn > nextColumn)
    ) {
      currentRow += newRows;
      currentColumn = nextColumn;
      newFragments.push(fragment);
      continue;
    }

    for (let i = 0; i < resolved.length; i++) {
      const char = resolved.charAt(i);
      if (fromRow === currentRow && fromColumn >= currentColumn) {
        if (fromColumn === currentColumn) {
          index = newFragments.length + 1;
          newFragments.push(resolved.slice(0, i), '');
        } else if (char === '\n') {
          index = newFragments.length + 1;
          newFragments.push(
            resolved.slice(0, i) + ' '.repeat(fromColumn - currentColumn),
            '',
          );
        }
      }

      if (index !== -1 && toRow === currentRow && toColumn >= currentColumn) {
        if (toColumn === currentColumn) {
          newFragments.push(resolved.slice(i));
          found = true;
          break;
        }

        if (char === '\n') {
          if (currentColumn < toColumn) {
            extracted += '\n';
            if (i + 1 < resolved.length) {
              newFragments.push(resolved.slice(i + 1));
            }
          } else {
            newFragments.push(resolved.slice(i));
          }
          found = true;
          break;
        }
      }

      if (index !== -1) {
        extracted += char;
      }

      if (char === '\n') {
        currentRow++;
        currentColumn = 0;
      } else {
        currentColumn++;
      }
    }

    if (index === -1) {
      newFragments.push(fragment);
    }
  }

  if (index === -1) {
    index = newFragments.length + 1;
    const missingRows = fromRow - currentRow;
    const missingColumns =
      missingRows > 0 ? fromColumn : fromColumn - currentColumn;
    newFragments.push(
      '\n'.repeat(missingRows) + ' '.repeat(missingColumns),
      '',
    );
  }

  newFragments[index] = extracted;

  return [newFragments, index];
}
