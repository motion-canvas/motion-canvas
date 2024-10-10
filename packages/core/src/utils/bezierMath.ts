export interface BezierMath {
  solve(t: number): number;
  getNewtonIterations(): number;
  getApproximation(): number;
}

class BezierMathImpl implements BezierMath {
  private ax: number;
  private bx: number;
  private cx: number;

  private ay: number;
  private by: number;
  private cy: number;
  private newtonIterations: number;
  private approximation: number;
  public constructor(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    newtonIterations: number,
    approximation: number,
  ) {
    this.approximation = approximation;
    this.newtonIterations = newtonIterations;

    this.cx = 3 * x1;
    this.bx = 3 * (x2 - x1) - this.cx;
    this.ax = 1 - this.cx - this.bx;

    this.cy = 3 * y1;
    this.by = 3 * (y2 - y1) - this.cy;
    this.ay = 1 - this.cy - this.by;
  }
  public getNewtonIterations(): number {
    return this.newtonIterations;
  }
  public getApproximation(): number {
    return this.approximation;
  }

  public solve(t: number): number {
    return this.cubicBezierY(this.solveNewtonX(t));
  }

  private cubicBezierY(t: number) {
    return ((this.ay * t + this.by) * t + this.cy) * t;
  }

  private cubicBezierX(t: number) {
    return ((this.ax * t + this.bx) * t + this.cx) * t;
  }

  private bezierDerivative(t: number): number {
    return (3 * this.ax * t + 2 * this.bx) * t + this.cx;
  }

  private solveNewtonX(value: number): number {
    let result = value;
    for (let i = 0; i < this.getNewtonIterations(); i++) {
      const sample = this.cubicBezierX(result);
      if (Math.abs(sample - value) < this.getApproximation()) {
        console.log('RETURNING RESULT: ' + result + ' sample: ' + sample);
        return result;
      }
      const derivative = this.bezierDerivative(result);
      if (Math.abs(derivative) < this.getApproximation()) {
        console.log('newtone failed');
        break;
      }
      result -= (sample - value) / derivative;
    }
    let low = 0.0;
    let high = 1.0;
    let t = value;
    if (t < low) {
      return low;
    }
    if (t > high) {
      return high;
    }

    while (low < high) {
      const sample = this.cubicBezierX(value);
      if (Math.abs(sample - value) < this.getApproximation()) {
        return t;
      }
      if (value > sample) {
        low = t;
      } else {
        high = t;
      }
      t = (high - low) / 2 + low;
    }
    return t;
  }
}

export function newBezierMath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): BezierMath {
  return new BezierMathImpl(x1, y1, x2, y2, 10, 0.0001);
}
