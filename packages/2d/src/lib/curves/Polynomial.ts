import {clamp} from '@motion-canvas/core';

/**
 * A polynomial in the form ax^3 + bx^2 + cx + d up to a cubic polynomial.
 *
 * Source code liberally taken from:
 * https://github.com/FreyaHolmer/Mathfs/blob/master/Runtime/Curves/Polynomial.cs
 */
export class Polynomial {
  public readonly c1: number;
  public readonly c2: number;
  public readonly c3: number;

  /**
   * Constructs a constant polynomial
   *
   * @param c0 - The constant coefficient
   */
  public static constant(c0: number): Polynomial {
    return new Polynomial(c0);
  }

  /**
   * Constructs a linear polynomial
   *
   * @param c0 - The constant coefficient
   * @param c1 - The linear coefficient
   */
  public static linear(c0: number, c1: number): Polynomial {
    return new Polynomial(c0, c1);
  }

  /**
   * Constructs a quadratic polynomial
   *
   * @param c0 - The constant coefficient
   * @param c1 - The linear coefficient
   * @param c2 - The quadratic coefficient
   */
  public static quadratic(c0: number, c1: number, c2: number): Polynomial {
    return new Polynomial(c0, c1, c2);
  }

  /**
   * Constructs a cubic polynomial
   *
   * @param c0 - The constant coefficient
   * @param c1 - The linear coefficient
   * @param c2 - The quadratic coefficient
   * @param c3 - The cubic coefficient
   */
  public static cubic(
    c0: number,
    c1: number,
    c2: number,
    c3: number,
  ): Polynomial {
    return new Polynomial(c0, c1, c2, c3);
  }

  /**
   * The degree of the polynomial
   */
  public get degree(): number {
    if (this.c3 !== 0) {
      return 3;
    } else if (this.c2 !== 0) {
      return 2;
    } else if (this.c1 !== 0) {
      return 1;
    }
    return 0;
  }

  /**
   * @param c0 - The constant coefficient
   */
  public constructor(c0: number);
  /**
   * @param c0 - The constant coefficient
   * @param c1 - The linear coefficient
   */
  public constructor(c0: number, c1: number);
  /**
   * @param c0 - The constant coefficient
   * @param c1 - The linear coefficient
   * @param c2 - The quadratic coefficient
   */
  public constructor(c0: number, c1: number, c2: number);
  /**
   * @param c0 - The constant coefficient
   * @param c1 - The linear coefficient
   * @param c2 - The quadratic coefficient
   * @param c3 - The cubic coefficient
   */
  public constructor(c0: number, c1: number, c2: number, c3: number);
  public constructor(
    public readonly c0: number,
    c1?: number,
    c2?: number,
    c3?: number,
  ) {
    this.c1 = c1 ?? 0;
    this.c2 = c2 ?? 0;
    this.c3 = c3 ?? 0;
  }

  /**
   * Return the nth derivative of the polynomial.
   *
   * @param n - The number of times to differentiate the polynomial.
   */
  public differentiate(n = 1): Polynomial {
    switch (n) {
      case 0:
        return this;
      case 1:
        return new Polynomial(this.c1, 2 * this.c2, 3 * this.c3, 0);
      case 2:
        return new Polynomial(2 * this.c2, 6 * this.c3, 0, 0);
      case 3:
        return new Polynomial(6 * this.c3, 0, 0, 0);
      default:
        throw new Error('Unsupported derivative');
    }
  }

  /**
   * Evaluate the polynomial at the given value t.
   *
   * @param t - The value to sample at
   */
  public eval(t: number): number;
  /**
   * Evaluate the nth derivative of the polynomial at the given value t.
   *
   * @param t - The value to sample at
   * @param derivative - The derivative of the polynomial to sample from
   */
  public eval(t: number, derivative: number): number;
  public eval(t: number, derivative = 0): number {
    if (derivative !== 0) {
      return this.differentiate(derivative).eval(t);
    }
    return this.c3 * (t * t * t) + this.c2 * (t * t) + this.c1 * t + this.c0;
  }

  /**
   * Split the polynomial into two polynomials of the same overall shape.
   *
   * @param u - The point at which to split the polynomial.
   */
  public split(u: number): [Polynomial, Polynomial] {
    const d = 1 - u;

    const pre = new Polynomial(
      this.c0,
      this.c1 * u,
      this.c2 * u * u,
      this.c3 * u * u * u,
    );
    const post = new Polynomial(
      this.eval(0),
      d * this.differentiate(1).eval(u),
      ((d * d) / 2) * this.differentiate(2).eval(u),
      ((d * d * d) / 6) * this.differentiate(3).eval(u),
    );

    return [pre, post];
  }

  /**
   * Calculate the roots (values where this polynomial = 0).
   *
   * @remarks
   * Depending on the degree of the polynomial, returns between 0 and 3 results.
   */
  public roots(): number[] {
    switch (this.degree) {
      case 3:
        return this.solveCubicRoots();
      case 2:
        return this.solveQuadraticRoots();
      case 1:
        return this.solveLinearRoot();
      case 0:
        return [];
      default:
        throw new Error(`Unsupported polynomial degree: ${this.degree}`);
    }
  }

  /**
   * Calculate the local extrema of the polynomial.
   */
  public localExtrema(): number[] {
    return this.differentiate().roots();
  }

  /**
   * Calculate the local extrema of the polynomial in the unit interval.
   */
  public localExtrema01(): number[] {
    const all = this.localExtrema();
    const valids = [];
    for (let i = 0; i < all.length; i++) {
      const t = all[i];
      if (t >= 0 && t <= 1) {
        valids.push(all[i]);
      }
    }
    return valids;
  }

  /**
   * Return the output value range within the unit interval.
   */
  public outputRange01(): number[] {
    let range = [this.eval(0), this.eval(1)];

    // Expands the minimum or maximum value of the range to contain the given
    // value.
    const encapsulate = (value: number) => {
      if (range[1] > range[0]) {
        range = [Math.min(range[0], value), Math.max(range[1], value)];
      } else {
        range = [Math.min(range[1], value), Math.max(range[0], value)];
      }
    };

    this.localExtrema01().forEach(t => encapsulate(this.eval(t)));

    return range;
  }

  private solveCubicRoots() {
    const a = this.c0;
    const b = this.c1;
    const c = this.c2;
    const d = this.c3;

    // First, depress the cubic to make it easier to solve
    const aa = a * a;
    const ac = a * c;
    const bb = b * b;
    const p = (3 * ac - bb) / (3 * aa);
    const q = (2 * bb * b - 9 * ac * b + 27 * aa * d) / (27 * aa * a);

    const dpr = this.solveDepressedCubicRoots(p, q);

    // We now have the roots of the depressed cubic, now convert back to the
    // normal cubic
    const undepressRoot = (r: number) => r - b / (3 * a);
    switch (dpr.length) {
      case 1:
        return [undepressRoot(dpr[0])];
      case 2:
        return [undepressRoot(dpr[0]), undepressRoot(dpr[1])];
      case 3:
        return [
          undepressRoot(dpr[0]),
          undepressRoot(dpr[1]),
          undepressRoot(dpr[2]),
        ];
      default:
        return [];
    }
  }

  private solveDepressedCubicRoots(p: number, q: number): number[] {
    // t³+pt+q = 0

    // Triple root - one solution. solve x³+q = 0 => x = cr(-q)
    if (this.almostZero(p)) {
      return [Math.cbrt(-q)];
    }

    const TAU = Math.PI * 2;
    const discriminant = 4 * p * p * p + 27 * q * q;
    if (discriminant < 0.00001) {
      // Two or three roots guaranteed, use trig solution
      const pre = 2 * Math.sqrt(-p / 3);
      const acosInner = ((3 * q) / (2 * p)) * Math.sqrt(-3 / p);

      const getRoot = (k: number) =>
        pre *
        Math.cos((1 / 3) * Math.acos(clamp(-1, 1, acosInner)) - (TAU / 3) * k);

      // If acos hits 0 or TAU/2, the offsets will have the same value,
      // which means we have a double root plus one regular root on our hands
      if (acosInner >= 0.9999) {
        // two roots - one single and one double root
        return [getRoot(0), getRoot(2)];
      }

      if (acosInner <= -0.9999) {
        // two roots - one single and one double root
        return [getRoot(1), getRoot(2)];
      }

      return [getRoot(0), getRoot(1), getRoot(2)];
    }

    if (discriminant > 0 && p < 0) {
      // one root
      const coshInner =
        (1 / 3) *
        Math.acosh(((-3 * Math.abs(q)) / (2 * p)) * Math.sqrt(-3 / p));
      const r = -2 * Math.sign(q) * Math.sqrt(-p / 3) * Math.cosh(coshInner);
      return [r];
    }

    if (p > 0) {
      // one root
      const sinhInner =
        (1 / 3) * Math.asinh(((3 * q) / (2 * p)) * Math.sqrt(3 / p));
      const r = -2 * Math.sqrt(p / 3) * Math.sinh(sinhInner);
      return [r];
    }

    // no roots
    return [];
  }

  private solveQuadraticRoots() {
    const a = this.c2;
    const b = this.c1;
    const c = this.c0;
    const rootContent = b * b - 4 * a * c;

    if (this.almostZero(rootContent)) {
      // two equivalent solutions at one point
      return [-b / (2 * a)];
    }

    if (rootContent >= 0) {
      const root = Math.sqrt(rootContent);
      // crosses at two points
      const r0 = (-b - root) / (2 * a);
      const r1 = (-b + root) / (2 * a);

      return [Math.min(r0, r1), Math.max(r0, r1)];
    }

    return [];
  }

  private solveLinearRoot() {
    return [-this.c0 / this.c1];
  }

  private almostZero(value: number) {
    return Math.abs(0 - value) <= Number.EPSILON;
  }
}
