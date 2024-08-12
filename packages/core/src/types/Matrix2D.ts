import {DEG2RAD} from '../utils';
import {EPSILON, Type, WebGLConvertible} from './Type';
import {PossibleVector2, Vector2} from './Vector';

export type PossibleMatrix2D =
  | Matrix2D
  | DOMMatrix
  | [number, number, number, number, number, number]
  | [PossibleVector2, PossibleVector2, PossibleVector2]
  | undefined;

/**
 * A specialized 2x3 Matrix representing a 2D transformation.
 *
 * A Matrix2D contains six elements defined as
 * [a, b,
 *  c, d,
 *  tx, ty]
 *
 * This is a shortcut for a 3x3 matrix of the form
 * [a, b, 0,
 *  c, d, 0
 *  tx, ty, 1]
 *
 * Note that because a Matrix2D ignores the z-values of each component vectors,
 * it does not satisfy all properties of a "real" 3x3 matrix.
 *
 *   - A Matrix2D has no transpose
 *   - A(B + C) = AB + AC does not hold for a Matrix2D
 *   - (rA)^-1 = r^-1 A^-1, r != 0 does not hold for a Matrix2D
 *   - r(AB) = (rA)B = A(rB) does not hold for a Matrix2D
 */
export class Matrix2D implements Type, WebGLConvertible {
  public static readonly symbol = Symbol.for(
    '@motion-canvas/core/types/Matrix2D',
  );

  public readonly values: Float32Array = new Float32Array(6);
  public static readonly identity: Matrix2D = new Matrix2D(1, 0, 0, 1, 0, 0);
  public static readonly zero: Matrix2D = new Matrix2D(0, 0, 0, 0, 0, 0);

  public static fromRotation(angle: number): Matrix2D {
    return Matrix2D.identity.rotate(angle);
  }

  public static fromTranslation(translation: PossibleVector2): Matrix2D {
    return Matrix2D.identity.translate(new Vector2(translation));
  }

  public static fromScaling(scale: PossibleVector2): Matrix2D {
    return Matrix2D.identity.scale(new Vector2(scale));
  }

  public get x(): Vector2 {
    return new Vector2(this.values[0], this.values[1]);
  }

  public get y(): Vector2 {
    return new Vector2(this.values[2], this.values[3]);
  }

  public get scaleX(): number {
    return this.values[0];
  }

  public set scaleX(value: number) {
    this.values[0] = this.x.normalized.scale(value).x;
  }

  public get skewX(): number {
    return this.values[1];
  }

  public set skewX(value: number) {
    this.values[1] = value;
  }

  public get scaleY(): number {
    return this.values[3];
  }

  public set scaleY(value: number) {
    this.values[3] = this.y.normalized.scale(value).y;
  }

  public get skewY(): number {
    return this.values[2];
  }

  public set skewY(value: number) {
    this.values[2] = value;
  }

  public get translateX(): number {
    return this.values[4];
  }

  public set translateX(value: number) {
    this.values[4] = value;
  }

  public get translateY(): number {
    return this.values[5];
  }

  public set translateY(value: number) {
    this.values[5] = value;
  }

  public get rotation(): number {
    return Vector2.degrees(this.values[0], this.values[1]);
  }

  public set rotation(angle: number) {
    const result = this.rotate(angle - this.rotation);

    this.values[0] = result.values[0];
    this.values[1] = result.values[1];
    this.values[2] = result.values[2];
    this.values[3] = result.values[3];
  }

  public get translation(): Vector2 {
    return new Vector2(this.values[4], this.values[5]);
  }

  public set translation(translation: PossibleVector2) {
    const vec = new Vector2(translation);
    this.values[4] = vec.x;
    this.values[5] = vec.y;
  }

  public get scaling(): Vector2 {
    return new Vector2(this.values[0], this.values[3]);
  }

  public set scaling(value: PossibleVector2) {
    const scale = new Vector2(value);

    const x = new Vector2(this.values[0], this.values[1]).normalized;
    const y = new Vector2(this.values[2], this.values[3]).normalized;

    this.values[0] = x.x * scale.x;
    this.values[1] = x.y * scale.y;
    this.values[2] = y.x * scale.x;
    this.values[3] = y.y * scale.y;
  }

  /**
   * Get the inverse of the matrix.
   *
   * @remarks
   * If the matrix is not invertible, i.e. its determinant is `0`, this will
   * return `null`, instead.
   *
   * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   *
   * const inverse = matrix.inverse;
   * // => Matrix2D(
   * //      [-2, 1],
   * //      [1.5, -0.5],
   * //      [1, -2],
   * //   )
   * ```
   */
  public get inverse(): Matrix2D | null {
    const aa = this.values[0],
      ab = this.values[1],
      ac = this.values[2],
      ad = this.values[3];
    const atx = this.values[4],
      aty = this.values[5];

    let det = aa * ad - ab * ac;

    if (!det) {
      return null;
    }

    det = 1.0 / det;

    return new Matrix2D(
      ad * det,
      -ab * det,
      -ac * det,
      aa * det,
      (ac * aty - ad * atx) * det,
      (ab * atx - aa * aty) * det,
    );
  }

  /**
   * Get the determinant of the matrix.
   */
  public get determinant(): number {
    return this.values[0] * this.values[3] - this.values[1] * this.values[2];
  }

  public get domMatrix(): DOMMatrix {
    return new DOMMatrix([
      this.values[0],
      this.values[1],
      this.values[2],
      this.values[3],
      this.values[4],
      this.values[5],
    ]);
  }

  public constructor();
  public constructor(matrix: PossibleMatrix2D);
  public constructor(
    x: PossibleVector2,
    y: PossibleVector2,
    z: PossibleVector2,
  );
  public constructor(
    a: number,
    b: number,
    c: number,
    d: number,
    tx: number,
    ty: number,
  );
  public constructor(
    a?: PossibleMatrix2D | PossibleVector2,
    b?: PossibleVector2,
    c?: PossibleVector2,
    d?: number,
    tx?: number,
    ty?: number,
  ) {
    if (arguments.length === 0) {
      this.values = new Float32Array([1, 0, 0, 1, 0, 0]);
      return;
    }

    if (arguments.length === 6) {
      this.values[0] = a as number;
      this.values[1] = b as number;
      this.values[2] = c as number;
      this.values[3] = d as number;
      this.values[4] = tx as number;
      this.values[5] = ty as number;
      return;
    }

    if (a instanceof DOMMatrix) {
      this.values[0] = a.m11;
      this.values[1] = a.m12;
      this.values[2] = a.m21;
      this.values[3] = a.m22;
      this.values[4] = a.m41;
      this.values[5] = a.m42;
      return;
    }

    if (a instanceof Matrix2D) {
      this.values = a.values;
      return;
    }

    if (Array.isArray(a)) {
      if (a.length === 2) {
        this.values[0] = a[0];
        this.values[1] = a[1];
        this.values[2] = (b as number[])[0];
        this.values[3] = (b as number[])[1];
        this.values[4] = (c as number[])[0];
        this.values[5] = (c as number[])[1];
        return;
      }

      if (a.length === 3) {
        const x = new Vector2(a[0]);
        const y = new Vector2(a[1]);
        const z = new Vector2(a[2]);
        this.values[0] = x.x;
        this.values[1] = x.y;
        this.values[2] = y.x;
        this.values[3] = y.y;
        this.values[4] = z.x;
        this.values[5] = z.y;
        return;
      }

      this.values[0] = a[0];
      this.values[1] = a[1];
      this.values[2] = a[2];
      this.values[3] = a[3];
      this.values[4] = a[4];
      this.values[5] = a[5];
      return;
    }

    const x = new Vector2(a as PossibleVector2);
    const y = new Vector2(b);
    const z = new Vector2(c);
    this.values[0] = x.x;
    this.values[1] = x.y;
    this.values[2] = y.x;
    this.values[3] = y.y;
    this.values[4] = z.x;
    this.values[5] = z.y;
  }

  /**
   * Get the nth component vector of the matrix. Only defined for 0, 1, and 2.
   *
   * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 0],
   *   [0, 0],
   *   [1, 0],
   * );
   *
   * const x = matrix.column(0);
   * // Vector2(1, 0)
   *
   * const y = matrix.column(1);
   * // Vector2(0, 0)
   *
   * const z = matrix.column(1);
   * // Vector2(1, 0)
   * ```
   *
   * @param index - The index of the component vector to retrieve.
   */
  public column(index: number): Vector2 {
    return new Vector2(this.values[index * 2], this.values[index * 2 + 1]);
  }

  /**
   * Returns the nth row of the matrix. Only defined for 0 and 1.
   *
   * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 0],
   *   [0, 0],
   *   [1, 0],
   * );
   *
   * const firstRow = matrix.column(0);
   * // [1, 0, 1]
   *
   * const secondRow = matrix.column(1);
   * // [0, 0, 0]
   * ```
   *
   * @param index - The index of the row to retrieve.
   */
  public row(index: number): [number, number, number] {
    return [this.values[index], this.values[index + 2], this.values[index + 4]];
  }

  /**
   * Returns the matrix product of this matrix with the provided matrix.
   *
   * @remarks
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const a = new Matrix2D(
   *   [1, 2],
   *   [0, 1],
   *   [1, 1],
   * );
   * const b = new Matrix2D(
   *   [2, 1],
   *   [1, 1],
   *   [1, 1],
   * );
   *
   * const result = a.mul(b);
   * // => Matrix2D(
   * //     [2, 5],
   * //     [1, 3],
   * //     [2, 4],
   * //   )
   * ```
   *
   * @param other - The matrix to multiply with
   */
  public mul(other: Matrix2D): Matrix2D {
    const a0 = this.values[0],
      a1 = this.values[1],
      a2 = this.values[2],
      a3 = this.values[3],
      a4 = this.values[4],
      a5 = this.values[5];
    const b0 = other.values[0],
      b1 = other.values[1],
      b2 = other.values[2],
      b3 = other.values[3],
      b4 = other.values[4],
      b5 = other.values[5];

    return new Matrix2D(
      a0 * b0 + a2 * b1,
      a1 * b0 + a3 * b1,
      a0 * b2 + a2 * b3,
      a1 * b2 + a3 * b3,
      a0 * b4 + a2 * b5 + a4,
      a1 * b4 + a3 * b5 + a5,
    );
  }

  /**
   * Rotate the matrix by the provided angle. By default, the angle is
   * provided in degrees.
   *
   * @remarks
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const a = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   *
   * const result = a.rotate(90);
   * // => Matrix2D(
   * //     [3, 4],
   * //     [-1, -2],
   * //     [5, 6],
   * //   )
   *
   * // Provide the angle in radians
   * const result = a.rotate(Math.PI * 0.5, true);
   * // => Matrix2D(
   * //     [3, 4],
   * //     [-1, -2],
   * //     [5, 6],
   * //   )
   * ```
   *
   * @param angle - The angle by which to rotate the matrix.
   * @param degrees - Whether the angle is provided in degrees.
   */
  public rotate(angle: number, degrees = true): Matrix2D {
    if (degrees) {
      angle *= DEG2RAD;
    }

    const a0 = this.values[0],
      a1 = this.values[1],
      a2 = this.values[2],
      a3 = this.values[3],
      a4 = this.values[4],
      a5 = this.values[5];
    const s = Math.sin(angle);
    const c = Math.cos(angle);

    return new Matrix2D(
      a0 * c + a2 * s,
      a1 * c + a3 * s,
      a0 * -s + a2 * c,
      a1 * -s + a3 * c,
      a4,
      a5,
    );
  }

  /**
   * Scale the x and y component vectors of the matrix.
   *
   * @remarks
   * If `vec` is provided as a vector, the x and y component vectors of the
   * matrix will be scaled by the x and y parts of the vector, respectively.
   *
   * If `vec` is provided as a scalar, the x and y component vectors will be
   * scaled uniformly by this factor.
   *
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   *
   * const result1 = matrix.scale([2, 3]);
   * // => new Matrix2D(
   * //      [2, 4],
   * //      [9, 12],
   * //      [5, 6],
   * //    )
   *
   * const result2 = matrix.scale(2);
   * // => new Matrix2D(
   * //      [2, 4],
   * //      [6, 8],
   * //      [5, 6],
   * //    )
   * ```
   *
   * @param vec - The factor by which to scale the matrix
   */
  public scale(vec: PossibleVector2): Matrix2D {
    const v = new Vector2(vec);

    return new Matrix2D(
      this.values[0] * v.x,
      this.values[1] * v.x,
      this.values[2] * v.y,
      this.values[3] * v.y,
      this.values[4],
      this.values[5],
    );
  }

  /**
   * Multiply each value of the matrix by a scalar.
   *
   * * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   *
   * const result1 = matrix.mulScalar(2);
   * // => new Matrix2D(
   * //      [2, 4],
   * //      [6, 8],
   * //      [10, 12],
   * //    )
   * ```
   *
   * @param s - The value by which to scale each term
   */
  public mulScalar(s: number): Matrix2D {
    return new Matrix2D(
      this.values[0] * s,
      this.values[1] * s,
      this.values[2] * s,
      this.values[3] * s,
      this.values[4] * s,
      this.values[5] * s,
    );
  }

  /**
   * Translate the matrix by the dimensions of the provided vector.
   *
   * @remarks
   * If `vec` is provided as a scalar, matrix will be translated uniformly
   * by this factor.
   *
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   *
   * const result1 = matrix.translate([2, 3]);
   * // => new Matrix2D(
   * //      [1, 2],
   * //      [3, 4],
   * //      [16, 22],
   * //    )
   *
   * const result2 = matrix.translate(2);
   * // => new Matrix2D(
   * //      [1, 2],
   * //      [3, 4],
   * //      [13, 18],
   * //    )
   * ```
   *
   * @param vec - The vector by which to translate the matrix
   */
  public translate(vec: PossibleVector2): Matrix2D {
    const v = new Vector2(vec);

    return new Matrix2D(
      this.values[0],
      this.values[1],
      this.values[2],
      this.values[3],
      this.values[0] * v.x + this.values[2] * v.y + this.values[4],
      this.values[1] * v.x + this.values[3] * v.y + this.values[5],
    );
  }

  /**
   * Add the provided matrix to this matrix.
   *
   * @remarks
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const a = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   * const a = new Matrix2D(
   *   [7, 8],
   *   [9, 10],
   *   [11, 12],
   * );
   *
   * const result = a.add(b);
   * // => Matrix2D(
   * //      [8, 10],
   * //      [12, 14],
   * //      [16, 18],
   * //    )
   * ```
   *
   * @param other - The matrix to add
   */
  public add(other: Matrix2D): Matrix2D {
    return new Matrix2D(
      this.values[0] + other.values[0],
      this.values[1] + other.values[1],
      this.values[2] + other.values[2],
      this.values[3] + other.values[3],
      this.values[4] + other.values[4],
      this.values[5] + other.values[5],
    );
  }

  /**
   * Subtract the provided matrix from this matrix.
   *
   * @remarks
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const a = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   * const a = new Matrix2D(
   *   [7, 8],
   *   [9, 10],
   *   [11, 12],
   * );
   *
   * const result = a.sub(b);
   * // => Matrix2D(
   * //      [-6, -6],
   * //      [-6, -6],
   * //      [-6, -6],
   * //    )
   * ```
   *
   * @param other - The matrix to subract
   */
  public sub(other: Matrix2D): Matrix2D {
    return new Matrix2D(
      this.values[0] - other.values[0],
      this.values[1] - other.values[1],
      this.values[2] - other.values[2],
      this.values[3] - other.values[3],
      this.values[4] - other.values[4],
      this.values[5] - other.values[5],
    );
  }

  public toSymbol(): symbol {
    return Matrix2D.symbol;
  }

  public toUniform(
    gl: WebGL2RenderingContext,
    location: WebGLUniformLocation,
  ): void {
    gl.uniformMatrix3fv(location, false, [
      this.values[0],
      this.values[1],
      0,
      this.values[2],
      this.values[3],
      0,
      this.values[4],
      this.values[5],
      1,
    ]);
  }

  public equals(other: Matrix2D, threshold: number = EPSILON): boolean {
    return (
      Math.abs(this.values[0] - other.values[0]) <=
        threshold + Number.EPSILON &&
      Math.abs(this.values[1] - other.values[1]) <=
        threshold + Number.EPSILON &&
      Math.abs(this.values[2] - other.values[2]) <=
        threshold + Number.EPSILON &&
      Math.abs(this.values[3] - other.values[3]) <=
        threshold + Number.EPSILON &&
      Math.abs(this.values[4] - other.values[4]) <=
        threshold + Number.EPSILON &&
      Math.abs(this.values[5] - other.values[5]) <= threshold + Number.EPSILON
    );
  }

  public exactlyEquals(other: Matrix2D): boolean {
    return (
      this.values[0] === other.values[0] &&
      this.values[1] === other.values[1] &&
      this.values[2] === other.values[2] &&
      this.values[3] === other.values[3] &&
      this.values[4] === other.values[4] &&
      this.values[5] === other.values[5]
    );
  }
}
