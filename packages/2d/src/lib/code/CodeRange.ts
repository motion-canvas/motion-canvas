export type CodePoint = [number, number];

function isCodePoint(value: unknown): value is CodePoint {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === 'number' &&
    typeof value[1] === 'number'
  );
}

export type CodeRange = [CodePoint, CodePoint];

export function isCodeRange(value: unknown): value is CodeRange {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    isCodePoint(value[0]) &&
    isCodePoint(value[1])
  );
}

/**
 * Create a code range that spans the given lines.
 *
 * @param from - The line from which the range starts.
 * @param to - The line at which the range ends. If omitted, the range will
 *             cover only one line.
 */
export function lines(from: number, to?: number): CodeRange {
  return [
    [from, 0],
    [to ?? from, Infinity],
  ];
}

/**
 * Create a code range that highlights the given word.
 *
 * @param line - The line at which the word appears.
 * @param from - The column at which the word starts.
 * @param length - The length of the word. If omitted, the range will cover the
 *                 rest of the line.
 */
export function word(line: number, from: number, length?: number): CodeRange {
  return [
    [line, from],
    [line, from + (length ?? Infinity)],
  ];
}

/**
 * Create a custom selection range.
 *
 * @param startLine - The line at which the selection starts.
 * @param startColumn - The column at which the selection starts.
 * @param endLine - The line at which the selection ends.
 * @param endColumn - The column at which the selection ends.
 */
export function pointToPoint(
  startLine: number,
  startColumn: number,
  endLine: number,
  endColumn: number,
): CodeRange {
  return [
    [startLine, startColumn],
    [endLine, endColumn],
  ];
}

export function isPointInCodeRange(point: CodePoint, range: CodeRange) {
  const [y, x] = point;
  const [[startLine, startColumn], [endLine, endColumn]] = range;
  return (
    ((y === startLine && x >= startColumn) || y > startLine) &&
    ((y === endLine && x < endColumn) || y < endLine)
  );
}

export function consolidateCodeRanges(ranges: CodeRange[]): CodeRange[] {
  // Sort by start position
  ranges.sort((a, b) => {
    const lines = b[0][0] - a[0][0];
    // Break ties on start column
    if (lines === 0) {
      return b[0][1] - a[0][1];
    }
    return lines;
  });

  const staged: CodeRange[] = [...ranges];
  const results = [];
  while (staged.length > 0) {
    let current = staged.pop();
    if (!current) {
      continue;
    }
    const [[initStartLine, initStartColumn], [initEndLine, initEndColumn]] =
      current;

    for (const targetRange of staged) {
      const [
        [targetStartLine, targetStartColumn],
        [targetEndLine, targetEndColumn],
      ] = targetRange;
      if (
        isPointInCodeRange(targetRange[0], current) ||
        isPointInCodeRange(targetRange[1], current)
      ) {
        staged.pop();

        let startColumn;
        if (initStartLine === targetStartLine) {
          startColumn = Math.min(initStartColumn, targetStartColumn);
        } else if (initStartLine < targetStartLine) {
          startColumn = initStartColumn;
        } else {
          startColumn = targetStartColumn;
        }

        let endColumn;
        if (initEndLine === targetEndLine) {
          endColumn = Math.max(initEndColumn, targetEndColumn);
        } else if (initEndLine > targetEndLine) {
          endColumn = initEndColumn;
        } else {
          endColumn = targetEndColumn;
        }
        // Update the current to the consolidated one and get rid of the
        // remaining instance of the unconsolidated target
        current = [
          [Math.min(initStartLine, targetStartLine), startColumn],
          [Math.max(initEndLine, targetEndLine), endColumn],
        ];
      }
    }
    results.push(current);
  }
  return results;
}

export function inverseCodeRange(ranges: CodeRange[]): CodeRange[] {
  if (ranges.length === 0) {
    return [
      [
        [0, 0],
        [Infinity, Infinity],
      ],
    ];
  }
  const firstRange = ranges[0];
  const result: CodeRange[] = [];
  for (let first = 0; first < ranges.length - 1; first++) {
    const range1 = ranges[first];
    const range2 = ranges[first + 1];
    result.push([range1[1], range2[0]]);
  }
  const lastRange = ranges.slice(-1)[0];
  return [
    [[0, 0], firstRange[0]],
    ...result,
    [lastRange[1], [Infinity, Infinity]],
  ];
}

/**
 * Find all code ranges that match the given pattern.
 *
 * @param code - The code to search in.
 * @param pattern - Either a string or a regular expression to search for.
 * @param limit - An optional limit on the number of ranges to find.
 */
export function findAllCodeRanges(
  code: string,
  pattern: string | RegExp,
  limit = Infinity,
): CodeRange[] {
  if (typeof pattern === 'string') {
    pattern = new RegExp(pattern, 'g');
  }

  const matches = code.matchAll(pattern);
  const ranges: CodeRange[] = [];
  let index = 0;
  let line = 0;
  let column = 0;

  for (const match of matches) {
    if (match.index === undefined || ranges.length >= limit) {
      continue;
    }

    let from: CodePoint = [line, column];
    while (index <= code.length) {
      if (index === match.index) {
        from = [line, column];
      }

      if (index === match.index + match[0].length) {
        ranges.push([from, [line, column]]);
        break;
      }

      if (code[index] === '\n') {
        line++;
        column = 0;
      } else {
        column++;
      }
      index++;
    }
  }

  return ranges;
}
