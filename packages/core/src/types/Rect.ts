import {Vector2} from './Vector';
import {Size} from './Size';
import {arcLerp, map} from '../tweening';

export type SerializedRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PossibleRect =
  | SerializedRect
  | [number, number, number, number]
  | Size
  | Vector2;

export class Rect {
  public x = 0;
  public y = 0;
  public width = 0;
  public height = 0;

  public static lerp(
    from: Rect,
    to: Rect,
    value: number | Vector2 | Rect,
  ): Rect {
    let valueX;
    let valueY;
    let valueWidth;
    let valueHeight;
    if (typeof value === 'number') {
      valueX = valueY = valueWidth = valueHeight = value;
    } else if (value instanceof Vector2) {
      valueX = valueWidth = value.x;
      valueY = valueHeight = value.y;
    } else {
      valueX = value.x;
      valueY = value.y;
      valueWidth = value.width;
      valueHeight = value.height;
    }

    return new Rect(
      map(from.x, to.x, valueX),
      map(from.y, to.y, valueY),
      map(from.width, to.width, valueWidth),
      map(from.height, to.height, valueHeight),
    );
  }

  public static arcLerp(
    from: Rect,
    to: Rect,
    value: number,
    reverse = false,
    ratio?: number,
  ) {
    ratio ??=
      (from.position.sub(to.position).ctg +
        from.size.vector.sub(to.size.vector).ctg) /
      2;

    return Rect.lerp(from, to, arcLerp(value, reverse, ratio));
  }

  public static fromSizeCentered(size: Size): Rect {
    return new Rect(-size.width / 2, -size.height / 2, size.width, size.height);
  }

  public static fromPoints(...points: Vector2[]): Rect {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const point of points) {
      if (point.x > maxX) {
        maxX = point.x;
      }
      if (point.x < minX) {
        minX = point.x;
      }
      if (point.y > maxY) {
        maxY = point.y;
      }
      if (point.y < minY) {
        minY = point.y;
      }
    }

    return new Rect(minX, minY, maxX - minX, maxY - minY);
  }

  public static fromRects(...rects: Rect[]): Rect {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const r of rects) {
      const right = r.x + r.width;
      if (right > maxX) {
        maxX = right;
      }
      if (r.x < minX) {
        minX = r.x;
      }
      const bottom = r.y + r.height;
      if (bottom > maxY) {
        maxY = bottom;
      }
      if (r.y < minY) {
        minY = r.y;
      }
    }

    return new Rect(minX, minY, maxX - minX, maxY - minY);
  }

  public get position() {
    return new Vector2(this.x, this.y);
  }

  public get size() {
    return new Size(this.width, this.height);
  }

  public get left() {
    return this.x;
  }

  public set left(value: number) {
    this.width = this.right - value;
    this.x = value;
  }

  public get right() {
    return this.x + this.width;
  }

  public set right(value: number) {
    this.width = value - this.x;
  }

  public get top() {
    return this.y;
  }

  public set top(value: number) {
    this.width = this.bottom - value;
    this.y = value;
  }

  public get bottom() {
    return this.y + this.height;
  }

  public set bottom(value: number) {
    this.height = value - this.y;
  }

  public get topLeft() {
    return this.position;
  }

  public get topRight() {
    return new Vector2(this.x + this.width, this.y);
  }

  public get bottomLeft() {
    return new Vector2(this.x, this.y + this.height);
  }

  public get bottomRight() {
    return new Vector2(this.x + this.width, this.y + this.height);
  }

  public get corners() {
    return [this.topLeft, this.topRight, this.bottomRight, this.bottomLeft];
  }

  public get pixelPerfect() {
    return new Rect(
      Math.floor(this.x),
      Math.floor(this.y),
      Math.ceil(this.width + 1),
      Math.ceil(this.height + 1),
    );
  }

  public constructor();
  public constructor(from: PossibleRect);
  public constructor(position: Vector2, size: Size);
  public constructor(from: Vector2, to: Vector2);
  public constructor(x: number, y?: number, width?: number, height?: number);
  public constructor(
    one?: PossibleRect | number,
    two: Vector2 | Size | number = 0,
    three = 0,
    four = 0,
  ) {
    if (one === undefined || one === null) {
      return;
    }

    if (typeof one === 'number') {
      this.x = one;
      this.y = <number>two;
      this.width = three;
      this.height = four;
      return;
    }

    if (one instanceof Vector2) {
      this.x = one.x;
      this.y = one.y;

      if (two instanceof Size) {
        this.width = two.width;
        this.height = two.height;
      } else if (two instanceof Vector2) {
        this.width = two.x - one.x;
        this.height = two.y - one.y;
      }

      return;
    }

    if (one instanceof Size) {
      this.width = one.width;
      this.height = one.height;
      return;
    }

    if (Array.isArray(one)) {
      this.x = one[0];
      this.y = one[1];
      this.width = one[2];
      this.height = one[3];
      return;
    }

    this.x = one.x;
    this.y = one.y;
    this.width = one.width;
    this.height = one.height;
  }

  public transform(matrix: DOMMatrix): Rect {
    return new Rect(
      this.position.transformAsPoint(matrix),
      this.size.transform(matrix),
    );
  }

  public expand(amount: number) {
    return new Rect(
      this.x - amount,
      this.y - amount,
      this.width + amount * 2,
      this.height + amount * 2,
    );
  }

  public includes(point: Vector2): boolean {
    return (
      point.x >= this.x &&
      point.x <= this.x + this.width &&
      point.y >= this.y &&
      point.y <= this.y + this.height
    );
  }
}
