import {Size} from './Size';
import {Rect} from './Rect';
import {map} from '../tweening';
import {Direction, Origin} from './Origin';

export type SerializedVector2 = {
  x: number;
  y: number;
};

export type PossibleVector2 =
  | SerializedVector2
  | number
  | [number, number]
  | Size
  | Rect;

export class Vector2 {
  public x = 0;
  public y = 0;

  public static readonly zero = new Vector2();

  public static lerp(from: Vector2, to: Vector2, value: number) {
    return new Vector2(map(from.x, to.x, value), map(from.y, to.y, value));
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

  public static fromRadians(radians: number) {
    return new Vector2(Math.cos(radians), Math.sin(radians));
  }

  public static magnitude(x: number, y: number) {
    return Math.sqrt(x * x + y * y);
  }

  public get magnitude(): number {
    return Vector2.magnitude(this.x, this.y);
  }

  public get radians() {
    return Math.atan2(this.y, this.x);
  }

  public constructor();
  public constructor(from: PossibleVector2);
  public constructor(x: number, y: number);
  public constructor(one?: PossibleVector2 | number, two?: number) {
    if (one === undefined || one === null) {
      return;
    }

    if (typeof one === 'number') {
      this.x = one;
      this.y = two ?? one;
      return;
    }

    if (one instanceof Size) {
      this.x = one.width;
      this.y = one.height;
      return;
    }

    if (Array.isArray(one)) {
      this.x = one[0];
      this.y = one[0];
      return;
    }

    this.x = one.x;
    this.y = one.y;
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

  public add(vector: Vector2) {
    return new Vector2(this.x + vector.x, this.y + vector.y);
  }

  public addX(value: number) {
    return new Vector2(this.x + value, this.y);
  }

  public addY(value: number) {
    return new Vector2(this.x, this.y + value);
  }
}
