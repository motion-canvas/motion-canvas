import {describe, expect, test} from 'vitest';
import {createSignal} from '../signals';
import {PossibleVector2, Vector2} from '../types';

describe('Vector2', () => {
  test('Correctly parses values', () => {
    const fromUndefined = new Vector2();
    const fromScalar = new Vector2(3);
    const fromProperties = new Vector2(2, 4);
    const fromArray = new Vector2([2, -1]);
    const fromVector = new Vector2(Vector2.up);
    const fromObject = new Vector2({x: -1, y: 3});

    expect(fromUndefined).toMatchObject({x: 0, y: 0});
    expect(fromScalar).toMatchObject({x: 3, y: 3});
    expect(fromProperties).toMatchObject({x: 2, y: 4});
    expect(fromArray).toMatchObject({x: 2, y: -1});
    expect(fromVector).toMatchObject({x: 0, y: 1});
    expect(fromObject).toMatchObject({x: -1, y: 3});
  });

  test('Interpolates between vectors', () => {
    const a = new Vector2(10, 24);
    const b = new Vector2(-10, 12);

    const result = Vector2.lerp(a, b, 0.5);

    expect(result).toMatchObject({x: 0, y: 18});
  });

  test('Creates a compound signal', () => {
    const x = createSignal(1);
    const vector = Vector2.createSignal(() => [x(), 2]);

    expect(vector()).toMatchObject({x: 1, y: 2});
    expect(vector.x()).toBe(1);
    expect(vector.y()).toBe(2);

    x(3);
    expect(vector()).toMatchObject({x: 3, y: 2});
    expect(vector.x()).toBe(3);
  });

  test.each([
    [[0, 0], 0],
    [[1, 1], 45],
    [[0, 1], 90],
    [[-1, 1], 135],
    [[-1, 0], 180],
    [[-1, -1], -135],
    [[0, -1], -90],
    [[1, -1], -45],
  ])(
    'Computes angle of vector with positive x-axis in degrees: (%s, %s)',
    (points, expected) => {
      const vector = new Vector2(points[0], points[1]);

      expect(vector.degrees).toBe(expected);
      expect(Vector2.degrees(points[0], points[1])).toBe(expected);
    },
  );

  describe('equality', () => {
    test('equal if all components are exactly equal', () => {
      const a = new Vector2(2.5, 2.5);
      const b = new Vector2(2.5, 2.5);

      expect(a.equals(b)).toBe(true);
      expect(b.equals(a)).toBe(true);
    });

    test('equal if all components are within epsilon of each other', () => {
      const a = new Vector2(2.5, 2.5);
      const b = new Vector2(2.499, 2.499);

      expect(a.equals(b, 0.001)).toBe(true);
      expect(b.equals(a, 0.001)).toBe(true);
    });

    test('not equal if not all components are within epsilon of each other', () => {
      const a = new Vector2(2.5, 2.5);
      const b = new Vector2(2.498, 2.498);

      expect(a.equals(b, 0.001)).toBe(false);
      expect(b.equals(a, 0.001)).toBe(false);
    });

    test('exactly equal if all components are exactly equal', () => {
      const a = new Vector2(2.5, 2.5);
      const b = new Vector2(2.5, 2.5);

      expect(a.exactlyEquals(b)).toBe(true);
      expect(b.exactlyEquals(a)).toBe(true);
    });

    test('not exactly equal if not all components are exactly equal', () => {
      const a = new Vector2(2.5, 2.5);
      const b = new Vector2(2.49, 2.49);

      expect(a.exactlyEquals(b)).toBe(false);
      expect(b.exactlyEquals(a)).toBe(false);
    });
  });

  test.each([
    [[0, 0], 0],
    [[1, 0], 1],
    [[0, 1], 1],
    [[2, 1], 5],
    [[-1, 3], 10],
  ])(
    'Computes the squared magnitude of the vector: (%s, %s)',
    (points, expected) => {
      const vector = new Vector2(points[0], points[1]);

      expect(vector.squaredMagnitude).toBe(expected);
      expect(Vector2.squaredMagnitude(points[0], points[1])).toBe(expected);
    },
  );

  test.each([
    [0, [1, 0]],
    [30, [Math.sqrt(3) / 2, 0.5]],
    [60, [0.5, Math.sqrt(3) / 2]],
    [90, [0, 1]],
    [180, [-1, 0]],
    [270, [0, -1]],
    [360, [1, 0]],
    [-90, [0, -1]],
    [-180, [-1, 0]],
    [-270, [0, 1]],
  ])('Creates a Vector from an angle in degrees: (%s°)', (angle, expected) => {
    const vector = Vector2.fromDegrees(angle);
    expect(vector.equals(new Vector2(expected as PossibleVector2))).toBe(true);
  });

  test.each([
    [0, [5, 10]],
    [30, [-0.669872981, 11.1602540378]],
    [45, [-3.535533905, 10.6066017178]],
    [60, [-6.160254037, 9.3301270189]],
    [90, [-10, 5]],
    [180, [-5, -10]],
    [270, [10, -5]],
    [360, [5, 10]],
    [-90, [10, -5]],
    [-180, [-5, -10]],
    [-270, [-10, 5]],
  ])('Rotates a vector around the origin: (%s°)', (angle, expected) => {
    const vector = new Vector2(5, 10);
    const result = vector.rotate(angle);
    expect(result.equals(new Vector2(expected as PossibleVector2))).toBe(true);
  });

  test.each([
    [[1, 0], 90, [1, -1]],
    [[1, 0], -90, [1, 1]],
    [[-1, 0], 90, [-1, 1]],
    [[-1, 0], -90, [-1, -1]],
    [[0, 1], 90, [1, 1]],
    [[0, 1], -90, [-1, 1]],
    [[0, -1], 90, [-1, -1]],
    [[0, -1], -90, [1, -1]],
  ])(
    'Rotates a vector around an arbitrary point: (%s, %s°)',
    (center, angle, expected) => {
      const vector = Vector2.zero;
      const result = vector.rotate(angle, center as PossibleVector2);
      expect(result).toEqual(new Vector2(expected as PossibleVector2));
    },
  );
});
