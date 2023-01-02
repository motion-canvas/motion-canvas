import {arcLerp} from '../tweening';
import {map} from '../tweening/interpolationFunctions';
import {Direction, Origin} from './Origin';
import {Type} from './Type';

export type SerializedVector2<T = number> = {
  x: T;
  y: T;
};

export type PossibleVector2<T = number> =
  | SerializedVector2<T>
  | {width: T; height: T}
  | T
  | [T, T];

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

  public static magnitude(x: number, y: number) {
    return Math.sqrt(x * x + y * y);
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

  public get radians() {
    return Math.atan2(this.y, this.x);
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

  public mul(vector: Vector2) {
    return new Vector2(this.x * vector.x, this.y * vector.y);
  }

  public div(vector: Vector2) {
    return new Vector2(this.x / vector.x, this.y / vector.y);
  }

  public add(vector: Vector2) {
    return new Vector2(this.x + vector.x, this.y + vector.y);
  }

  public sub(vector: Vector2) {
    return new Vector2(this.x - vector.x, this.y - vector.y);
  }

  public dot(vector: Vector2): number {
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
}
