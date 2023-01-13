/**
 * General utilities and helper functions.
 *
 * @packageDocumentation
 */

import {deprecate} from './deprecate';

export * from './capitalize';
export * from './deprecate';
export * from './DetailedError';
export * from './errorToLog';
export * from './getContext';
export * from './range';
export * from './useProject';
export * from './useRandom';
export * from './createRef';
export * from './useScene';
export * from './useThread';
export * from './useTime';
export * from './useContext';

import {createRef} from './createRef';
import {
  createSignal as createSignalNew,
  createComputed as createComputedNew,
} from '../signals';

/**
 * @internal
 * @deprecated Use {@link createRef} instead.
 */
const useRef = deprecate(
  createRef,
  'useRef() has been deprecated.',
  `Use <code>createRef()</code> instead:
  <pre>import {createRef} from '@motion-canvas/core/lib/utils';</pre>`,
);

/**
 * @internal
 * @deprecated Use {@link createSignal} instead.
 */
const createSignal = deprecate(
  createSignalNew,
  'createSignal() has been moved.',
  `Import <code>createSignal()</code> from here instead:
  <pre>import {createSignal} from '@motion-canvas/core/lib/signals';</pre>`,
);

/**
 * @internal
 * @deprecated Use {@link createComputed} instead.
 */
const createComputed = deprecate(
  createComputedNew,
  'createSignal() has been moved.',
  `Import <code>createComputed()</code> from here instead:
  <pre>import {createComputed} from '@motion-canvas/core/lib/signals';</pre>`,
);
export {useRef, createSignal, createComputed};
