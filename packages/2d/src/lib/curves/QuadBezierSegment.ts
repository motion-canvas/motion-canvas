import {Vector2, lazy} from '@motion-canvas/core';
import {quadraticCurveTo} from '../utils';
import {Polynomial2D} from './Polynomial2D';
import {PolynomialSegment} from './PolynomialSegment';

/**
 * A spline segment representing a quadratic Bézier curve.
 */
export class QuadBezierSegment extends PolynomialSegment {
  @lazy(() => document.createElementNS('http://www.w3.org/2000/svg', 'path'))
  private static el: SVGPathElement;

  public get points(): Vector2[] {
    return [this.p0, this.p1, this.p2];
  }

  public constructor(
    public readonly p0: Vector2,
    public readonly p1: Vector2,
    public readonly p2: Vector2,
  ) {
    super(
      new Polynomial2D(
        p0,
        // 2*(-p0+p1)
        p0.flipped.add(p1).scale(2),
        // p0-2*p1+p2
        p0.sub(p1.scale(2)).add(p2),
      ),
      QuadBezierSegment.getLength(p0, p1, p2),
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
    const p = new Vector2(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);

    const left = new QuadBezierSegment(this.p0, a, p);
    const right = new QuadBezierSegment(p, b, this.p2);

    return [left, right];
  }

  protected static getLength(p0: Vector2, p1: Vector2, p2: Vector2): number {
    // Let the browser do the work for us instead of calculating the arclength
    // manually.
    QuadBezierSegment.el.setAttribute(
      'd',
      `M ${p0.x} ${p0.y} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}`,
    );
    return QuadBezierSegment.el.getTotalLength();
  }

  protected override doDraw(context: CanvasRenderingContext2D | Path2D) {
    quadraticCurveTo(context, this.p1, this.p2);
  }
}
