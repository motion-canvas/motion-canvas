import {BBox, DEG2RAD, Matrix2D, Vector2, lazy} from '@motion-canvas/core';
import {View2D} from '../components/View2D';
import {CurvePoint} from './CurvePoint';
import {Segment} from './Segment';

export class ArcSegment extends Segment {
  @lazy(() => {
    const root = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    root.appendChild(el);
    View2D.shadowRoot.appendChild(root);
    return el;
  })
  private static el: SVGPathElement;
  public readonly center: Vector2;
  // angle in radian
  public readonly startAngle: number;
  public readonly deltaAngle: number;
  public readonly xAxisRotation: number;
  private xAxisRotationMatrix: DOMMatrix;
  public override readonly points: Vector2[];
  private length: number;

  public constructor(
    public readonly startPoint: Vector2,
    public readonly radius: Vector2,
    public readonly xAxisRotationDegree: number,
    public readonly largeArcFlag: number,
    public readonly sweepFlag: number,
    public readonly endPoint: Vector2,
  ) {
    super();

    this.xAxisRotation = this.xAxisRotationDegree * DEG2RAD;
    this.radius = new Vector2(Math.abs(radius.x), Math.abs(radius.y));

    const pAccent = startPoint
      .sub(endPoint)
      .div(2)
      .transform(Matrix2D.fromRotation(-xAxisRotationDegree).domMatrix);

    const L =
      (pAccent.x * pAccent.x) / (radius.x * radius.x) +
      (pAccent.y * pAccent.y) / (radius.y * radius.y);

    if (L > 1) {
      const Lsqrt = Math.sqrt(L);
      radius.x = Lsqrt * radius.x;
      radius.y = Lsqrt * radius.y;
    }

    const cAccent = new Vector2(
      radius.ctg * pAccent.y,
      radius.perpendicular.ctg * pAccent.x,
    ).scale(
      Math.sqrt(
        1 /
          ((pAccent.x * pAccent.x) / (radius.x * radius.x) +
            (pAccent.y * pAccent.y) / (radius.y * radius.y)) -
          1,
      ) * (largeArcFlag === sweepFlag ? -1 : 1),
    );

    this.xAxisRotationMatrix =
      Matrix2D.fromRotation(xAxisRotationDegree).domMatrix;
    this.center = cAccent
      .transform(this.xAxisRotationMatrix)
      .add(startPoint.add(endPoint).div(2));

    const q = pAccent.sub(cAccent).div(radius);
    const s = pAccent.scale(-1).sub(cAccent).div(radius);
    this.startAngle = q.radians;
    this.deltaAngle = Vector2.angleBetween(q, s) % (Math.PI * 2);
    if (this.sweepFlag === 0 && this.deltaAngle > 0) {
      this.deltaAngle -= Math.PI * 2;
    }
    if (this.sweepFlag === 1 && this.deltaAngle < 0) {
      this.deltaAngle += Math.PI * 2;
    }

    ArcSegment.el.setAttribute(
      'd',
      `M ${this.startPoint.x} ${this.startPoint.y} A ${this.radius.x} ${this.radius.y} ${this.xAxisRotationDegree} ${this.largeArcFlag} ${this.sweepFlag} ${this.endPoint.x} ${this.endPoint.y}`,
    );
    this.length = ArcSegment.el.getTotalLength();

    const bbox = new BBox(ArcSegment.el.getBBox());
    this.points = [bbox.topLeft, bbox.bottomRight];
  }

  public getAnglePosition(angle: number) {
    return this.radius
      .mul(Vector2.fromRadians(angle))
      .transform(this.xAxisRotationMatrix)
      .add(this.center);
  }

  public getAngleDerivative(angle: number) {
    return new Vector2(
      -this.radius.x * Math.sin(angle),
      this.radius.y * Math.cos(angle),
    ).transform(this.xAxisRotationMatrix);
  }

  public draw(
    context: CanvasRenderingContext2D | Path2D,
    start: number,
    end: number,
    move: boolean,
  ): [CurvePoint, CurvePoint] {
    const startAngle = this.startAngle + this.deltaAngle * start;
    const endAngle = this.startAngle + this.deltaAngle * end;
    const startPos = this.getPoint(start);
    const endPos = this.getPoint(end);

    if (move) context.moveTo(startPos.position.x, startPos.position.y);

    context.ellipse(
      this.center.x,
      this.center.y,
      this.radius.x,
      this.radius.y,
      this.xAxisRotation,
      startAngle,
      endAngle,
      this.sweepFlag === 0,
    );

    return [startPos, endPos];
  }

  public getPoint(distance: number): CurvePoint {
    const angle = this.startAngle + distance * this.deltaAngle;
    const tangent = this.getAngleDerivative(angle).normalized;
    return {
      position:
        distance === 0
          ? this.startPoint
          : distance === 1
            ? this.endPoint
            : this.getAnglePosition(angle),
      tangent,
      normal: tangent.perpendicular,
    };
  }
  public get arcLength(): number {
    return this.length;
  }
}
