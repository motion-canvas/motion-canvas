import {map} from '../tweening';
import {Type} from './Type';

export type SerializedSpacing = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type PossibleSpacing =
  | SerializedSpacing
  | number
  | [number, number]
  | [number, number, number]
  | [number, number, number, number];

export class Spacing implements Type {
  public static readonly symbol = Symbol.for(
    '@motion-canvas/core/types/Spacing',
  );

  public top = 0;
  public right = 0;
  public bottom = 0;
  public left = 0;

  public static lerp(from: Spacing, to: Spacing, value: number): Spacing {
    return new Spacing(
      map(from.top, to.top, value),
      map(from.right, to.right, value),
      map(from.bottom, to.bottom, value),
      map(from.left, to.left, value),
    );
  }

  public get x(): number {
    return this.left + this.right;
  }

  public get y(): number {
    return this.top + this.bottom;
  }

  public constructor();
  public constructor(from: PossibleSpacing);
  public constructor(all: number);
  public constructor(vertical: number, horizontal: number);
  public constructor(top: number, horizontal: number, bottom: number);
  public constructor(top: number, right: number, bottom: number, left: number);
  public constructor(
    one: PossibleSpacing = 0,
    two?: number,
    three?: number,
    four?: number,
  ) {
    if (one === undefined || one === null) {
      return;
    }

    if (Array.isArray(one)) {
      four = one[3];
      three = one[2];
      two = one[1];
      one = one[0];
    }

    if (typeof one === 'number') {
      this.top = one;
      this.right = two !== undefined ? two : one;
      this.bottom = three !== undefined ? three : one;
      this.left = four !== undefined ? four : two !== undefined ? two : one;
      return;
    }

    this.top = one.top;
    this.right = one.right;
    this.bottom = one.bottom;
    this.left = one.left;
  }

  public lerp(to: Spacing, value: number) {
    return Spacing.lerp(this, to, value);
  }

  public scale(value: number): Spacing {
    return new Spacing(
      this.top * value,
      this.right * value,
      this.bottom * value,
      this.left * value,
    );
  }

  public toSymbol(): symbol {
    return Spacing.symbol;
  }

  public serialize(): SerializedSpacing {
    return {
      top: this.top,
      right: this.right,
      bottom: this.bottom,
      left: this.left,
    };
  }
}
