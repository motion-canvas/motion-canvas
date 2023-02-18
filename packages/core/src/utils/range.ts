/**
 * Create an array containing a range of numbers.
 *
 * @example
 * ```ts
 * const array1 = range(3); // [0, 1, 2]
 * const array2 = range(-3); // [0, -1, -2]
 * ```
 *
 * @param length - The length of the array.
 */
export function range(length: number): number[];
/**
 * Create an array containing a range of numbers.
 *
 * @example
 * ```ts
 * const array1 = range(3, 7); // [3, 4, 5, 6]
 * const array2 = range(7, 3); // [7, 6, 5, 4]
 * ```
 *
 * @param from - The start of the range.
 * @param to - The end of the range. `to` itself is not included in the result.
 */
export function range(from: number, to: number): number[];
/**
 * Create an array containing a range of numbers.
 *
 * @example
 * ```ts
 * const array1 = range(1, 2, 0.25); // [1, 1.25, 1.5, 1.75]
 * const array2 = range(2, 1, -0.25); // [2, 1.75, 1.5, 1.25]
 * ```
 *
 * @param from - The start of the range.
 * @param to - The end of the range. `to` itself is not included in the result.
 * @param step - The value by which to increment or decrement.
 */
export function range(from: number, to: number, step: number): number[];
export function range(first: number, second?: number, step?: number): number[] {
  let from = 0;
  let to = first;
  if (second !== undefined) {
    from = first;
    to = second;
  }

  step = step === undefined ? (from < to ? 1 : -1) : step;

  const array = [];
  let length = Math.max(Math.ceil((to - from) / step), 0);
  let index = 0;

  while (length--) {
    array[index++] = from;
    from += step;
  }

  return array;
}
