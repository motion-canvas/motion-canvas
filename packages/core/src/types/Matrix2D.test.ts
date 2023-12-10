import {beforeEach, describe, expect, test} from 'vitest';
import {Matrix2D} from './Matrix2D';
import {PossibleVector2, Vector2} from './Vector';

type Matrix2DValues = [number, number, number, number, number, number];

describe('Matrix2D', () => {
  let a: Matrix2D;
  let b: Matrix2D;
  let c: Matrix2D;

  beforeEach(() => {
    a = new Matrix2D(1, 2, 3, 4, 5, 6);
    b = new Matrix2D(7, 8, 9, 10, 11, 12);
    c = new Matrix2D(1, 2, 1, 2, 1, 2);
  });

  describe('construction', () => {
    test('can be constructed from an existing matrix', () => {
      const matrix = new Matrix2D(a);
      expect(matrix.values).toEqual(a.values);
    });

    test('can be constructed from an array of three PossibleVector2', () => {
      const matrix = new Matrix2D([[1, 0], {x: 0, y: 1}, Vector2.zero]);
      expect(matrix.values).toEqual(new Float32Array([1, 0, 0, 1, 0, 0]));
    });

    test('can be constructed from individual numbers', () => {
      const matrix = new Matrix2D(1, 0, 0, 0, 1, 0);
      expect(matrix.values).toEqual(new Float32Array([1, 0, 0, 0, 1, 0]));
    });

    test('can be constructed from a three sets of two numbers', () => {
      const matrix = new Matrix2D([
        [1, 0],
        [0, 1],
        [0, 0],
      ]);
      expect(matrix.values).toEqual(new Float32Array([1, 0, 0, 1, 0, 0]));
    });

    test('can be constructed from array of six numbers', () => {
      const matrix = new Matrix2D([1, 0, 0, 0, 1, 0]);
      expect(matrix.values).toEqual(new Float32Array([1, 0, 0, 0, 1, 0]));
    });

    test.each([
      [
        '[number, number]',
        [
          [1, 0],
          [0, 0],
          [1, 0],
        ],
        [1, 0, 0, 0, 1, 0],
      ],
      [
        'SerializedVector2',
        [
          {x: 1, y: 1},
          {x: 0, y: 0},
          {x: 0, y: 1},
        ],
        [1, 1, 0, 0, 0, 1],
      ],
      [
        '{width: T, height: T}',
        [
          {width: 0, height: 1},
          {width: 1, height: 1},
          {width: 1, height: 1},
        ],
        [0, 1, 1, 1, 1, 1],
      ],
      [
        'Vector2',
        [new Vector2(0, 1), new Vector2(1, 1), new Vector2(10, 10)],
        [0, 1, 1, 1, 10, 10],
      ],
      ['number', [1, 0, 0], [1, 1, 0, 0, 0, 0]],
      ['undefined', [undefined, undefined, undefined], [0, 0, 0, 0, 0, 0]],
    ] as [
      string,
      [PossibleVector2, PossibleVector2, PossibleVector2],
      Matrix2DValues,
    ][])(
      'can be constructed from three PossibleVector2 %s',
      (_, [vec1, vec2, vec3], expected) => {
        const matrix = new Matrix2D(vec1, vec2, vec3);
        expect(matrix.values).toEqual(new Float32Array(expected));
      },
    );

    test('can be constructed from a rotation', () => {
      const matrix = Matrix2D.fromRotation(90);
      expect(matrix.equals(new Matrix2D(0, 1, -1, 0, 0, 0))).toBe(true);
    });

    test.each([
      ['non-uniform', [-100, 200], [1, 0, 0, 1, -100, 200]],
      ['uniform', 400, [1, 0, 0, 1, 400, 400]],
    ] as [string, PossibleVector2, Matrix2DValues][])(
      'can be constructed from a translation: %s',
      (_, translation, expected) => {
        const matrix = Matrix2D.fromTranslation(translation);
        expect(matrix.equals(new Matrix2D(...expected))).toBe(true);
      },
    );

    test.each([
      ['non-uniform', [2, 3], [2, 0, 0, 3, 0, 0]],
      ['uniform', 3, [3, 0, 0, 3, 0, 0]],
    ] as [string, PossibleVector2, Matrix2DValues][])(
      'can be constructed from a scaling: %s',
      (_, scaling, expected) => {
        const matrix = Matrix2D.fromScaling(scaling);
        expect(matrix).toEqual(new Matrix2D(...expected));
      },
    );
  });

  describe('getters and setters', () => {
    test('can access the x component vector', () => {
      expect(a.x).toEqual(new Vector2(1, 2));
    });

    test('can access the y component vector', () => {
      expect(a.y).toEqual(new Vector2(3, 4));
    });

    test('can access the horizontal scaling', () => {
      expect(a.scaleX).toEqual(1);
    });

    test('can set only the horizontal scaling', () => {
      const matrix = new Matrix2D();
      matrix.scaleX = 5;
      expect(matrix).toEqual(new Matrix2D(5, 0, 0, 1, 0, 0));
    });

    test('can access the vertical scaling', () => {
      expect(a.scaleY).toEqual(4);
    });

    test('can set only the vertical scaling', () => {
      const matrix = new Matrix2D();
      matrix.scaleY = 5;
      expect(matrix).toEqual(new Matrix2D(1, 0, 0, 5, 0, 0));
    });

    test('can get only the horizontal skewing', () => {
      expect(a.skewX).toEqual(2);
    });

    test('can set only the horizontal skewing', () => {
      const matrix = new Matrix2D();
      matrix.skewX = 5;
      expect(matrix).toEqual(new Matrix2D(1, 5, 0, 1, 0, 0));
    });

    test('can get only the vertical skewing', () => {
      expect(a.skewY).toEqual(3);
    });

    test('can set only the vertical skewing', () => {
      const matrix = new Matrix2D();
      matrix.skewY = 5;
      expect(matrix).toEqual(new Matrix2D(1, 0, 5, 1, 0, 0));
    });

    test('can set the scaling', () => {
      const matrix = new Matrix2D(1, 0, 0, 1, 0, 0);
      matrix.scaling = [2, 5];
      expect(matrix).toEqual(new Matrix2D(2, 0, 0, 5, 0, 0));
    });

    test('can access scaling', () => {
      expect(a.scaling).toEqual(new Vector2(1, 4));
    });

    test('can access the horizontal translation', () => {
      expect(a.translateX).toEqual(5);
    });

    test('can set only the horizontal translation', () => {
      a.translateX = -5;
      expect(a).toEqual(new Matrix2D(1, 2, 3, 4, -5, 6));
    });

    test('can access the vertical translation', () => {
      expect(a.translateY).toEqual(6);
    });

    test('can set only the vertical translation', () => {
      a.translateY = 20;
      expect(a).toEqual(new Matrix2D(1, 2, 3, 4, 5, 20));
    });

    test('can access the translation', () => {
      expect(a.translation).toEqual(new Vector2(5, 6));
    });

    test('can set the translation', () => {
      a.translation = [-5, 20];
      expect(a).toEqual(new Matrix2D(1, 2, 3, 4, -5, 20));
    });

    test('can set the rotation', () => {
      const matrix = new Matrix2D();
      matrix.rotation = 90;
      expect(matrix.equals(new Matrix2D(0, 1, -1, 0, 0, 0))).toBe(true);
    });

    test('can access the rotation', () => {
      const matrix = new Matrix2D(0, 1, -1, 0, 0, 0);
      expect(matrix.rotation).toBe(90);
    });
  });

  describe('matrix properties', () => {
    test('A + B = B + A', () => {
      expect(a.add(b).equals(b.add(a))).toBe(true);
    });

    test('A + (B + C) = (A + B) + A', () => {
      expect(a.add(b.add(c)).equals(a.add(b).add(c))).toBe(true);
    });

    test('A + 0 = A', () => {
      expect(a.add(Matrix2D.zero).equals(a)).toBe(true);
    });

    test('r(A + B) = rA + rB', () => {
      const result1 = a.add(b).mulScalar(2);
      const result2 = a.mulScalar(2).add(b.mulScalar(2));
      expect(result1).toEqual(result2);
    });

    test('(r + s)A = rA + sA', () => {
      const result1 = a.mulScalar(2 + 5);
      const result2 = a.mulScalar(2).add(a.mulScalar(5));
      expect(result1).toEqual(result2);
    });

    test('A(BC) = (AB)C', () => {
      const result1 = a.mul(b.mul(c));
      const result2 = a.mul(b).mul(c);
      expect(result1.equals(result2)).toBe(true);
    });

    test('(B + C)A = BA + CA', () => {
      const result1 = b.add(c).mul(a);
      const result2 = b.mul(a).add(c.mul(a));
      expect(result1).toEqual(result2);
    });

    test('IA = A = AI', () => {
      const result1 = Matrix2D.identity.mul(a);
      const result2 = a.mul(Matrix2D.identity);
      expect(result1).toEqual(a);
      expect(result2).toEqual(a);
    });

    test('AA^-1 = A^-1A = I', () => {
      const result1 = a.mul(a.inverse!);
      const result2 = a.inverse!.mul(a);
      expect(result1).toEqual(Matrix2D.identity);
      expect(result2).toEqual(Matrix2D.identity);
    });

    test('(AB)^-1 = B^-1 A^-1', () => {
      const result1 = a.mul(b).inverse!;
      const result2 = b.inverse!.mul(a.inverse!);
      // Using Matrix2D.equals here as JavaScript thinks 0 and -0 are different values...
      expect(result1.equals(result2));
    });

    test('I^-1 = I', () => {
      expect(Matrix2D.identity.inverse?.equals(Matrix2D.identity)).toBe(true);
    });

    test('(A^-1)^-1 = A', () => {
      expect(a.inverse?.inverse).toEqual(a);
    });
  });

  describe('access', () => {
    test('can access the component vectors by index', () => {
      expect(Matrix2D.identity.column(0)).toEqual(new Vector2(1, 0));
      expect(Matrix2D.identity.column(1)).toEqual(new Vector2(0, 1));
      expect(Matrix2D.identity.column(2)).toEqual(new Vector2(0, 0));
    });

    test('can access rows by index', () => {
      expect(Matrix2D.identity.row(0)).toEqual([1, 0, 0]);
      expect(Matrix2D.identity.row(1)).toEqual([0, 1, 0]);
    });
  });

  describe('equality', () => {
    test('equal when all values have exactly equal', () => {
      expect(Matrix2D.identity.equals(Matrix2D.identity)).toBe(true);
    });

    test('equal when all values are within threshold of each other', () => {
      const other = new Matrix2D(0.5, -0.5, 0.5, 0.5, 0.5, 0.5);
      expect(Matrix2D.identity.equals(other, 0.5)).toBe(true);
    });

    test('not equal when not all values are within EPSILON of each other', () => {
      const other = new Matrix2D(0.4, -0.4, 0.4, 0.4, 0.4, 0.4);
      expect(Matrix2D.identity.equals(other, 0.5)).toBe(false);
    });

    test('exactly equal when all values have exactly equal', () => {
      expect(Matrix2D.identity.exactlyEquals(Matrix2D.identity)).toBe(true);
    });

    test('not exactly equal when not all values are exactly equal', () => {
      // prettier-ignore
      const other = new Matrix2D(
        0.999999, -0.999999,
        0.999999, 0.999999,
        0.999999, -0.999999,
      );
      expect(Matrix2D.identity.exactlyEquals(other)).toBe(false);
    });
  });

  describe('operations', () => {
    test("can calculate the matrix' inverse", () => {
      expect(a.inverse).toEqual(new Matrix2D(-2, 1, 1.5, -0.5, 1, -2));
    });

    test('returns null if the matrix is not invertible', () => {
      expect(c.inverse).toBeNull();
    });

    test("can calculate the matrix' determinant", () => {
      expect(a.determinant).toBe(-2);
    });

    test('can multiply two Matrix2D', () => {
      expect(a.mul(b)).toEqual(new Matrix2D(31, 46, 39, 58, 52, 76));
    });

    test('can rotate a matrix by radians', () => {
      const result = a.rotate(Math.PI * 0.5, false);
      expect(result.equals(new Matrix2D(3, 4, -1, -2, 5, 6))).toBe(true);
    });

    test('can rotate a matrix by degrees', () => {
      const result = a.rotate(90);
      expect(result.equals(new Matrix2D(3, 4, -1, -2, 5, 6)));
    });

    test('can scale a matrix by a vector', () => {
      expect(a.scale([2, 3])).toEqual(new Matrix2D(2, 4, 9, 12, 5, 6));
    });

    test('can scale a matrix uniformly by a scalar', () => {
      expect(a.scale(2)).toEqual(new Matrix2D(2, 4, 6, 8, 5, 6));
    });

    test('can multiply with a scalar', () => {
      expect(a.mulScalar(2)).toEqual(new Matrix2D(2, 4, 6, 8, 10, 12));
    });

    test('can translate a matrix by a vector', () => {
      expect(a.translate([2, 3])).toEqual(new Matrix2D(1, 2, 3, 4, 16, 22));
    });

    test('can translate a matrix uniformly by a scalar', () => {
      expect(a.translate(2)).toEqual(new Matrix2D(1, 2, 3, 4, 13, 18));
    });

    test('can add matrixes', () => {
      expect(a.add(b)).toEqual(new Matrix2D(8, 10, 12, 14, 16, 18));
    });

    test('can subtract matrixes', () => {
      expect(a.sub(b)).toEqual(new Matrix2D(-6, -6, -6, -6, -6, -6));
    });

    test('can scale a rotated matrix while keeping the rotation', () => {
      const matrix = Matrix2D.fromRotation(45);
      matrix.scaling = 2;

      expect(matrix.rotation).toBe(45);
    });

    test('can set the rotation of a scaled matrix while keeping the scaling', () => {
      const matrix = Matrix2D.fromScaling(2).rotate(45);
      matrix.rotation = 90;

      expect(matrix.equals(new Matrix2D(0, 2, -2, 0, 0, 0))).toBe(true);
    });
  });

  test('defines identity matrix', () => {
    expect(Matrix2D.identity).toEqual(new Matrix2D(1, 0, 0, 1, 0, 0));
  });

  test('defines zero matrix', () => {
    expect(Matrix2D.zero).toEqual(new Matrix2D(0, 0, 0, 0, 0, 0));
  });
});
