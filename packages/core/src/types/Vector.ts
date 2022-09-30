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

  public get radians() {
    return Math.atan2(this.y, this.x);
  }

  public constructor();
  public constructor(from: PossibleVector2);
  public constructor(x: number, y?: number);
  public constructor(one?: PossibleVector2 | number, two = 0) {
    if (one === undefined || one === null) {
      return;
    }

    if (typeof one === 'number') {
      this.x = one;
      this.y = two;
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
}
