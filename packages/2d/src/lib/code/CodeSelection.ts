import {
  CodePoint,
  CodeRange,
  isCodeRange,
  isPointInCodeRange,
} from './CodeRange';

export type CodeSelection = CodeRange[];
export type PossibleCodeSelection = CodeRange | CodeRange[];

export function parseCodeSelection(
  value: PossibleCodeSelection,
): CodeSelection {
  return isCodeRange(value) ? [value] : value;
}

export function isPointInCodeSelection(
  point: CodePoint,
  selection: CodeSelection,
) {
  for (const range of selection) {
    if (isPointInCodeRange(point, range)) {
      return true;
    }
  }

  return false;
}
