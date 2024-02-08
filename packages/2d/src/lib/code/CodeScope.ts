import {SignalValue, unwrap} from '@motion-canvas/core';
import {PossibleCodeFragment} from './CodeFragment';
import {isCodeMetrics} from './CodeMetrics';

export interface CodeScope {
  progress: SignalValue<number>;
  fragments: CodeTag[];
}

export type PossibleCodeScope = CodeScope | CodeTag[] | string;

export type CodeTag = SignalValue<PossibleCodeFragment | CodeScope | CodeTag[]>;

export function CODE(
  strings: TemplateStringsArray,
  ...tags: CodeTag[]
): CodeTag[] {
  const result: CodeTag[] = [];
  for (let i = 0; i < strings.length; i++) {
    result.push(strings[i]);
    const tag = tags[i];
    if (tag !== undefined) {
      if (Array.isArray(tag)) {
        result.push(...tag);
      } else {
        result.push(tag);
      }
    }
  }

  return result;
}

export function isCodeScope(value: any): value is CodeScope {
  return value?.fragments !== undefined;
}

export function parseCodeScope(value: PossibleCodeScope): CodeScope {
  if (typeof value === 'string') {
    return {
      progress: 0,
      fragments: [value],
    };
  }

  if (Array.isArray(value)) {
    return {
      progress: 0,
      fragments: value,
    };
  }

  return value;
}

type IsAfterPredicate = ((scope: CodeScope) => boolean) | boolean;

export function resolveScope(
  scope: CodeScope,
  isAfter: IsAfterPredicate,
): string {
  let code = '';
  const after = typeof isAfter === 'boolean' ? isAfter : isAfter(scope);
  for (const wrapped of scope.fragments) {
    code += resolveCodeTag(wrapped, after, isAfter);
  }

  return code;
}

export function resolveCodeTag(
  wrapped: CodeTag,
  after: boolean,
  isAfter: IsAfterPredicate = after,
) {
  const fragment = unwrap(wrapped);
  if (typeof fragment === 'string') {
    return fragment;
  } else if (isCodeScope(fragment)) {
    return resolveScope(fragment, isAfter);
  } else if (isCodeMetrics(fragment)) {
    return fragment.content;
  } else if (Array.isArray(fragment)) {
    return resolveScope(
      {
        progress: 0,
        fragments: fragment,
      },
      isAfter,
    );
  } else {
    return after
      ? typeof fragment.after === 'string'
        ? fragment.after
        : fragment.after.content
      : typeof fragment.before === 'string'
        ? fragment.before
        : fragment.before.content;
  }
}
