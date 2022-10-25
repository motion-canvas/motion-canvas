/**
 * Create an array of given length containing its own indices.
 *
 * @example
 * ```ts
 * const array = range(3); // [0, 1, 2]
 * ```
 *
 * @param length
 */
export function range(length: number): number[] {
  return [...Array(length).keys()];
}
