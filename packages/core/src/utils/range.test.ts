import {describe, expect, test} from 'vitest';
import {range} from './range';

describe('range', () => {
  test.each([
    ['ascending', 4, [0, 1, 2, 3]],
    ['descending', -4, [0, -1, -2, -3]],
  ])(
    'generates an array of the provided length, starting at 0: %s',
    (_, length, expected) => {
      expect(range(length)).toEqual(expected);
    },
  );

  test.each([
    ['ascending', 3, 6, [3, 4, 5]],
    ['descending', 6, 3, [6, 5, 4]],
  ])(
    'generates an array from start to end (exclusive): %s',
    (_, from, to, expected) => {
      expect(range(from, to)).toEqual(expected);
    },
  );

  test.each([
    ['ascending', 3, 6, 0.5, [3, 3.5, 4, 4.5, 5, 5.5]],
    ['descending', 6, 3, -0.5, [6, 5.5, 5, 4.5, 4, 3.5]],
  ])(
    'generates an array from start to end (exclusive) with the provided step size: %s',
    (_, from, to, step, expected) => {
      expect(range(from, to, step)).toEqual(expected);
    },
  );

  test.each([
    ['ascending', 3, 6, -1],
    ['descending', 6, 3, 1],
  ])(
    'returns an empty array if the step size goes in the wrong direction: %s',
    (_, from, to, step) => {
      expect(range(from, to, step)).toEqual([]);
    },
  );
});
