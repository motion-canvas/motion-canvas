import {CodeMetrics, isCodeMetrics, measureString} from './CodeMetrics';

export interface CodeFragment {
  before: CodeMetrics;
  after: CodeMetrics;
}
export interface RawCodeFragment {
  before: string;
  after: string;
}

export type PossibleCodeFragment =
  | CodeFragment
  | CodeMetrics
  | RawCodeFragment
  | string;

export function metricsToFragment(value: CodeMetrics): CodeFragment {
  return {
    before: value,
    after: value,
  };
}

export function parseCodeFragment(
  value: PossibleCodeFragment,
  context: CanvasRenderingContext2D,
  monoWidth: number,
): CodeFragment {
  let fragment: CodeFragment;
  if (typeof value === 'string') {
    fragment = metricsToFragment(measureString(context, monoWidth, value));
  } else if (isCodeMetrics(value)) {
    fragment = metricsToFragment(value);
  } else {
    fragment = {
      before:
        typeof value.before === 'string'
          ? measureString(context, monoWidth, value.before)
          : value.before,
      after:
        typeof value.after === 'string'
          ? measureString(context, monoWidth, value.after)
          : value.after,
    };
  }

  return fragment;
}

/**
 * Create a code fragment that represents an insertion of code.
 *
 * @remarks
 * Can be used in conjunction with {@link code.CodeSignalHelpers.edit}.
 *
 * @param code - The code to insert.
 */
export function insert(code: string): RawCodeFragment {
  return {
    before: '',
    after: code,
  };
}

/**
 * Create a code fragment that represents a change from one piece of code to
 * another.
 *
 * @remarks
 * Can be used in conjunction with {@link code.CodeSignalHelpers.edit}.
 *
 * @param before - The code to change from.
 * @param after - The code to change to.
 */
export function replace(before: string, after: string): RawCodeFragment {
  return {
    before,
    after,
  };
}

/**
 * Create a code fragment that represents a removal of code.
 *
 * @remarks
 * Can be used in conjunction with {@link code.CodeSignalHelpers.edit}.
 *
 * @param code - The code to remove.
 */
export function remove(code: string): RawCodeFragment {
  return {
    before: code,
    after: '',
  };
}
