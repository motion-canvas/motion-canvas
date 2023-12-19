import {Vector2, lazy} from '@motion-canvas/core';
import {bezierCurveTo} from '../utils';
import {Polynomial2D} from './Polynomial2D';
import {PolynomialSegment} from './PolynomialSegment';

/**
 * A spline segment representing a cubic Bézier curve.
 */
export class CubicBezierSegment extends PolynomialSegment {
  @lazy(() => document.createElementNS('http://www.w3.org/2000/svg', 'path'))
  private static el: SVGPathElement;

  public get points(): Vector2[] {
    return [this.p0, this.p1, this.p2, this.p3];
  }

  public constructor(
    public readonly p0: Vector2,
    public readonly p1: Vector2,
    public readonly p2: Vector2,
    public readonly p3: Vector2,
  ) {
    super(
      new Polynomial2D(
        p0,
        // 3*(-p0+p1)
        p0.flipped.add(p1).scale(3),
        // 3*p0-6*p1+3*p2
        p0.scale(3).sub(p1.scale(6)).add(p2.scale(3)),
        // -p0+3*p1-3*p2+p3
        p0.flipped.add(p1.scale(3)).sub(p2.scale(3)).add(p3),
      ),
      CubicBezierSegment.getLength(p0, p1, p2, p3),
    );
  }

  public split(t: number): [PolynomialSegment, PolynomialSegment] {
    const a = new Vector2(
      this.p0.x + (this.p1.x - this.p0.x) * t,
      this.p0.y + (this.p1.y - this.p0.y) * t,
    );
    const b = new Vector2(
      this.p1.x + (this.p2.x - this.p1.x) * t,
      this.p1.y + (this.p2.y - this.p1.y) * t,
    );
    const c = new Vector2(
      this.p2.x + (this.p3.x - this.p2.x) * t,
      this.p2.y + (this.p3.y - this.p2.y) * t,
    );
    const d = new Vector2(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
    const e = new Vector2(b.x + (c.x - b.x) * t, b.y + (c.y - b.y) * t);
    const p = new Vector2(d.x + (e.x - d.x) * t, d.y + (e.y - d.y) * t);

    const left = new CubicBezierSegment(this.p0, a, d, p);
    const right = new CubicBezierSegment(p, e, c, this.p3);

    return [left, right];
  }

  protected override doDraw(context: CanvasRenderingContext2D | Path2D) {
    bezierCurveTo(context, this.p1, this.p2, this.p3);
  }

  protected static getLength(
    p0: Vector2,
    p1: Vector2,
    p2: Vector2,
    p3: Vector2,
  ): number {
    // Let the browser do the work for us instead of calculating the arclength
    // manually.
    CubicBezierSegment.el.setAttribute(
      'd',
      `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p3.x} ${p3.y}`,
    );
    return CubicBezierSegment.el.getTotalLength();
  }
}
