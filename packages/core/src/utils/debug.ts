import {LogPayload} from '../app';
import {useLogger} from './useScene';

function stringify(value: any): string {
  switch (typeof value) {
    case 'string':
      // Prevent strings from getting quoted again
      return value;
    case 'undefined':
      // Prevent `undefined` from being turned into `null`
      return 'undefined';
    default:
      // Prevent `NaN` from being turned into `null`
      if (Number.isNaN(value)) {
        return 'NaN';
      }
      return JSON.stringify(value);
  }
}

/**
 * Logs a debug message with an arbitrary payload.
 *
 * @remarks
 * This method is a shortcut for calling `useLogger().debug()` which allows
 * you to more easily log non-string values as well.
 *
 * @example
 * ```ts
 * export default makeScene2D(function* (view) {
 *   const circle = createRef<Circle>();
 *
 *   view.add(
 *     <Circle ref={circle} width={320} height={320} fill={'lightseagreen'} />,
 *   );
 *
 *   debug(circle().position());
 * });
 * ```
 *
 * @param payload - The payload to log
 */
export function debug(payload: any) {
  const result: LogPayload = {message: stringify(payload)};

  if (payload && typeof payload === 'object') {
    result.object = payload;
  }

  useLogger().debug(result);
}
