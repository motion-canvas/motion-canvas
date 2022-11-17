/**
 * Create an array containing a range of numbers.
 *
 * @example
 * ```ts
 * const array = range(3); // [0, 1, 2]
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
 * const array = range(3, 7); // [3, 4, 5, 6]
 * ```
 *
 * @param from - The start of the range.
 * @param to - The end of the range. `to` itself is not included in the result.
 */
export function range(from: number, to: number): number[];
export function range(first: number, second?: number): number[] {
  let from = 0;
  let to = first;
  if (second !== undefined) {
    from = first;
    to = second;
  }

  const array = [];
  if (from > to) {
    for (let i = from; i > to; i--) {
      array.push(i);
    }
  } else {
    for (let i = from; i < to; i++) {
      array.push(i);
    }
  }

  return array;
}
