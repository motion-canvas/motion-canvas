/**
 * A polynomial in the form ax^3 + bx^2 + cx + d up to a cubic polynomial.
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
    }
    throw new Error('Unsupported derivative');
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
}
