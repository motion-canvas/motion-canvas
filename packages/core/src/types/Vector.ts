import {arcLerp, InterpolationFunction} from '../tweening';
import {map} from '../tweening/interpolationFunctions';
import {Direction, Origin} from './Origin';
import {EPSILON, Type} from './Type';
import {
  CompoundSignal,
  CompoundSignalContext,
  Signal,
  SignalValue,
} from '../signals';

export type SerializedVector2<T = number> = {
  x: T;
  y: T;
};

export type PossibleVector2<T = number> =
  | SerializedVector2<T>
  | {width: T; height: T}
  | T
  | [T, T]
  | undefined;

export type Vector2Signal<T> = CompoundSignal<
  PossibleVector2,
  Vector2,
  'x' | 'y',
  T
>;

export type SimpleVector2Signal<T> = Signal<PossibleVector2, Vector2, T>;

/**
 * Represents a two-dimensional vector.
 */
export class Vector2 implements Type {
  public static readonly symbol = Symbol.for(
    '@motion-canvas/core/types/Vector2',
  );

  public static readonly zero = new Vector2();
  public static readonly one = new Vector2(1, 1);
  public static readonly right = new Vector2(1, 0);
  public static readonly left = new Vector2(-1, 0);
  public static readonly up = new Vector2(0, 1);
  public static readonly down = new Vector2(0, -1);

  public x = 0;
  public y = 0;

  public static createSignal(
    initial?: SignalValue<PossibleVector2>,
    interpolation: InterpolationFunction<Vector2> = Vector2.lerp,
    owner?: any,
  ): Vector2Signal<void> {
    return new CompoundSignalContext(
      ['x', 'y'],
      (value: PossibleVector2) => new Vector2(value),
      initial,
      interpolation,
      owner,
    ).toSignal();
  }

  public static lerp(from: Vector2, to: Vector2, value: number | Vector2) {
    let valueX;
    let valueY;

    if (typeof value === 'number') {
      valueX = valueY = value;
    } else {
      valueX = value.x;
      valueY = value.y;
    }

    return new Vector2(map(from.x, to.x, valueX), map(from.y, to.y, valueY));
  }

  public static arcLerp(
    from: Vector2,
    to: Vector2,
    value: number,
    reverse = false,
    ratio?: number,
  ) {
    ratio ??= from.sub(to).ctg;
    return Vector2.lerp(from, to, arcLerp(value, reverse, ratio));
  }

  public static fromOrigin(origin: Origin | Direction) {
    const position = new Vector2();

    if (origin === Origin.Middle) {
      return position;
    }

    if (origin & Direction.Left) {
      position.x = -1;
    } else if (origin & Direction.Right) {
      position.x = 1;
    }

    if (origin & Direction.Top) {
      position.y = -1;
    } else if (origin & Direction.Bottom) {
      position.y = 1;
    }

    return position;
  }

  public static fromScalar(value: number): Vector2 {
    return new Vector2(value, value);
  }

  public static fromRadians(radians: number) {
    return new Vector2(Math.cos(radians), Math.sin(radians));
  }

  /**
   * Return the angle in radians between the vector described by x and y and the
   * positive x-axis.
   *
   * @param x - The x component of the vector.
   * @param y - The y component of the vector.
   */
  public static radians(x: number, y: number) {
    return Math.atan2(y, x);
  }

  /**
   * Return the angle in degrees between the vector described by x and y and the
   * positive x-axis.
   *
   * @param x - The x component of the vector.
   * @param y - The y component of the vector.
   *
   * @remarks
   * The returned angle will be between -180 and 180 degrees.
   */
  public static degrees(x: number, y: number) {
    return (Vector2.radians(x, y) * 180) / Math.PI;
  }

  public static magnitude(x: number, y: number) {
    return Math.sqrt(x * x + y * y);
  }

  public static squaredMagnitude(x: number, y: number) {
    return x * x + y * y;
  }

  public get width(): number {
    return this.x;
  }

  public set width(value: number) {
    this.x = value;
  }

  public get height(): number {
    return this.y;
  }

  public set height(value: number) {
    this.y = value;
  }

  public get magnitude(): number {
    return Vector2.magnitude(this.x, this.y);
  }

  public get squaredMagnitude(): number {
    return Vector2.squaredMagnitude(this.x, this.y);
  }

  public get normalized(): Vector2 {
    return this.scale(1 / Vector2.magnitude(this.x, this.y));
  }

  public get safe(): Vector2 {
    return new Vector2(isNaN(this.x) ? 0 : this.x, isNaN(this.y) ? 0 : this.y);
  }

  public get flipped(): Vector2 {
    return new Vector2(-this.x, -this.y);
  }

  public get floored(): Vector2 {
    return new Vector2(Math.floor(this.x), Math.floor(this.y));
  }

  public get perpendicular(): Vector2 {
    return new Vector2(this.y, -this.x);
  }

  /**
   * Return the angle in radians between the vector and the positive x-axis.
   */
  public get radians() {
    return Vector2.radians(this.x, this.y);
  }

  /**
   * Return the angle in degrees between the vector and the positive x-axis.
   *
   * @remarks
   * The returned angle will be between -180 and 180 degrees.
   */
  public get degrees() {
    return Vector2.degrees(this.x, this.y);
  }

  public get ctg(): number {
    return this.x / this.y;
  }
  public constructor();
  public constructor(from: PossibleVector2);
  public constructor(x: number, y: number);

  public constructor(one?: PossibleVector2 | number, two?: number) {
    if (one === undefined || one === null) {
      return;
    }

    if (typeof one !== 'object') {
      this.x = one;
      this.y = two ?? one;
      return;
    }

    if (Array.isArray(one)) {
      this.x = one[0];
      this.y = one[1];
      return;
    }

    if ('width' in one) {
      this.x = one.width;
      this.y = one.height;
      return;
    }

    this.x = one.x;
    this.y = one.y;
  }

  public lerp(to: Vector2, value: Vector2 | number) {
    return Vector2.lerp(this, to, value);
  }

  public getOriginOffset(origin: Origin | Direction) {
    const offset = Vector2.fromOrigin(origin);
    offset.x *= this.x / 2;
    offset.y *= this.y / 2;

    return offset;
  }

  public scale(value: number) {
    return new Vector2(this.x * value, this.y * value);
  }

  public transformAsPoint(matrix: DOMMatrix) {
    return new Vector2(
      this.x * matrix.m11 + this.y * matrix.m21 + matrix.m41,
      this.x * matrix.m12 + this.y * matrix.m22 + matrix.m42,
    );
  }

  public transform(matrix: DOMMatrix) {
    return new Vector2(
      this.x * matrix.m11 + this.y * matrix.m21,
      this.x * matrix.m12 + this.y * matrix.m22,
    );
  }

  public mul(possibleVector: PossibleVector2) {
    const vector = new Vector2(possibleVector);
    return new Vector2(this.x * vector.x, this.y * vector.y);
  }

  public div(possibleVector: PossibleVector2) {
    const vector = new Vector2(possibleVector);
    return new Vector2(this.x / vector.x, this.y / vector.y);
  }

  public add(possibleVector: PossibleVector2) {
    const vector = new Vector2(possibleVector);
    return new Vector2(this.x + vector.x, this.y + vector.y);
  }

  public sub(possibleVector: PossibleVector2) {
    const vector = new Vector2(possibleVector);
    return new Vector2(this.x - vector.x, this.y - vector.y);
  }

  public dot(possibleVector: PossibleVector2): number {
    const vector = new Vector2(possibleVector);
    return this.x * vector.x + this.y * vector.y;
  }

  public addX(value: number) {
    return new Vector2(this.x + value, this.y);
  }

  public addY(value: number) {
    return new Vector2(this.x, this.y + value);
  }

  public toSymbol(): symbol {
    return Vector2.symbol;
  }

  public serialize(): SerializedVector2 {
    return {x: this.x, y: this.y};
  }

  /**
   * Check if two vectors are exactly equal to each other.
   *
   * @remarks
   * If you need to compensate for floating point inaccuracies, use the
   * {@link equals} method, instead.
   *
   * @param other - The vector to compare.
   */
  public exactlyEquals(other: Vector2): boolean {
    return this.x === other.x && this.y === other.y;
  }

  /**
   * Check if two vectors are equal to each other.
   *
   * @remarks
   * This method allows passing an allowed error margin when comparing vectors
   * to compensate for floating point inaccuracies. To check if two vectors are
   * exactly equal, use the {@link exactlyEquals} method, instead.
   *
   * @param other - The vector to compare.
   * @param threshold - The allowed error threshold when comparing the vectors.
   */
  public equals(other: Vector2, threshold = EPSILON): boolean {
    return (
      Math.abs(this.x - other.x) <= threshold + Number.EPSILON &&
      Math.abs(this.y - other.y) <= threshold + Number.EPSILON
    );
  }
}
