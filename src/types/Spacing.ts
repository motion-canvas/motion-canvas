import {Size} from './Size';

interface ISpacing {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export type PossibleSpacing =
  | ISpacing
  | number
  | [number, number]
  | [number, number, number]
  | [number, number, number, number];

export class Spacing implements ISpacing {
  public top = 0;
  public right = 0;
  public bottom = 0;
  public left = 0;

  public get x(): number {
    return this.left + this.right;
  }

  public get y(): number {
    return this.top + this.bottom;
  }

  public constructor(value?: PossibleSpacing) {
    if (value !== undefined) {
      this.set(value);
    }
  }

  public set(value: PossibleSpacing): this {
    if (Array.isArray(value)) {
      switch (value.length) {
        case 2:
          this.top = this.bottom = value[0];
          this.right = this.left = value[1];
          break;
        case 3:
          this.top = value[0];
          this.right = this.left = value[1];
          this.bottom = value[2];
          break;
        case 4:
          this.top = value[0];
          this.right = value[1];
          this.bottom = value[2];
          this.left = value[3];
          break;
      }
    } else if (typeof value === 'object') {
      this.top = value.top ?? 0;
      this.right = value.right ?? 0;
      this.bottom = value.bottom ?? 0;
      this.left = value.left ?? 0;
      return this;
    } else {
      this.top = this.right = this.bottom = this.left = value;
    }

    return this;
  }

  public apply(size: Size): Size {
    return {
      width: size.width + this.x,
      height: size.height + this.y,
    };
  }
}
