import {BBox, Vector2} from '@motion-canvas/core';

import {Polynomial} from './Polynomial';

export class Polynomial2D {
  public readonly x: Polynomial;
  public readonly y: Polynomial;

  public constructor(c0: Vector2, c1: Vector2, c2: Vector2, c3: Vector2);
  public constructor(c0: Vector2, c1: Vector2, c2: Vector2);
  public constructor(x: Polynomial, y: Polynomial);
  public constructor(
    public readonly c0: Vector2 | Polynomial,
    public readonly c1: Vector2 | Polynomial,
    public readonly c2?: Vector2,
    public readonly c3?: Vector2,
  ) {
    if (c0 instanceof Polynomial) {
      this.x = c0;
      this.y = c1 as Polynomial;
    } else if (c3 !== undefined) {
      this.x = new Polynomial(c0.x, (c1 as Vector2).x, c2!.x, c3.x);
      this.y = new Polynomial(c0.y, (c1 as Vector2).y, c2!.y, c3.y);
    } else {
      this.x = new Polynomial(c0.x, (c1 as Vector2).x, c2!.x);
      this.y = new Polynomial(c0.y, (c1 as Vector2).y, c2!.y);
    }
  }

  public eval(t: number, derivative = 0): Vector2 {
    return new Vector2(
      this.x.differentiate(derivative).eval(t),
      this.y.differentiate(derivative).eval(t),
    );
  }

  public split(u: number): [Polynomial2D, Polynomial2D] {
    const [xPre, xPost] = this.x.split(u);
    const [yPre, yPost] = this.y.split(u);
    return [new Polynomial2D(xPre, yPre), new Polynomial2D(xPost, yPost)];
  }

  public differentiate(n = 1): Polynomial2D {
    return new Polynomial2D(this.x.differentiate(n), this.y.differentiate(n));
  }

  public evalDerivative(t: number): Vector2 {
    return this.differentiate().eval(t);
  }

  /**
   * Calculate the tight axis-aligned bounds of the curve in the unit interval.
   */
  public getBounds(): BBox {
    const rangeX = this.x.outputRange01();
    const rangeY = this.y.outputRange01();
    return BBox.fromPoints(
      new Vector2(Math.min(...rangeX), Math.max(...rangeY)),
      new Vector2(Math.max(...rangeX), Math.min(...rangeY)),
    );
  }
}
