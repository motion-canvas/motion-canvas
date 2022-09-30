import {Vector2} from './Vector';
import {Rect} from './Rect';
import {Direction, Origin} from './Origin';
import {map} from '../tweening';

export type SerializedSize = {
  width: number;
  height: number;
};

export type PossibleSize = SerializedSize | [number, number] | Vector2 | Rect;

export class Size {
  public width = 0;
  public height = 0;

  public static lerp(from: Size, to: Size, value: number) {
    return new Size(
      map(from.width, to.width, value),
      map(from.height, to.height, value),
    );
  }

  public get vector() {
    return new Vector2(this);
  }

  public get flip() {
    return new Size(this.height, this.width);
  }

  public constructor();
  public constructor(from: PossibleSize);
  public constructor(width: number, height?: number);
  public constructor(one?: PossibleSize | number, two = 0) {
    if (one === undefined || one === null) {
      return;
    }

    if (typeof one === 'number') {
      this.width = one;
      this.height = two;
      return;
    }

    if (one instanceof Vector2) {
      this.width = one.x;
      this.height = one.y;
      return;
    }

    if (Array.isArray(one)) {
      this.width = one[0];
      this.height = one[1];
      return;
    }

    this.width = one.width;
    this.height = one.height;
  }

  public getOriginOffset(origin: Origin | Direction) {
    const offset = Vector2.fromOrigin(origin);
    offset.x *= this.width / 2;
    offset.y *= this.height / 2;

    return offset;
  }

  public scale(value: number) {
    return new Size(this.width * value, this.height * value);
  }

  public transform(matrix: DOMMatrix) {
    return new Size(
      this.width * matrix.m11 + this.height * matrix.m21,
      this.width * matrix.m12 + this.height * matrix.m22,
    );
  }
}
