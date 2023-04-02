import {lazy} from '@motion-canvas/core/lib/decorators';
import {Matrix2D, Vector2} from '@motion-canvas/core/lib/types';
import {CurvePoint} from './CurvePoint';
import {Segment} from './Segment';

function angleOfVector(u: Vector2, v: Vector2) {
  return (
    Math.acos(u.dot(v) / (u.magnitude * v.magnitude)) *
    Math.sign(u.x * v.y - u.y * v.x)
  );
}

export class ArcSegment extends Segment {
  @lazy(() => document.createElementNS('http://www.w3.org/2000/svg', 'path'))
  private static el: SVGPathElement;
  public readonly center: Vector2;
  // angle in radian
  public readonly startAngle: number;
  public readonly deltaAngle: number;
  public readonly xAxisRotation: number;
  public readonly extremPoint: Vector2[];
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

    this.xAxisRotation = (this.xAxisRotationDegree * Math.PI) / 180;
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

    this.center = cAccent
      .transform(Matrix2D.fromRotation(xAxisRotationDegree).domMatrix)
      .add(startPoint.add(endPoint).div(2));

    const q = pAccent.sub(cAccent).div(radius);
    const s = pAccent.scale(-1).sub(cAccent).div(radius);
    this.startAngle = angleOfVector(new Vector2(1, 0), q);
    this.deltaAngle = angleOfVector(q, s) % (Math.PI * 2);
    if (this.sweepFlag === 0 && this.deltaAngle > 0)
      this.deltaAngle -= Math.PI * 2;
    if (this.sweepFlag === 1 && this.deltaAngle < 0)
      this.deltaAngle += Math.PI * 2;

    ArcSegment.el.setAttribute(
      'd',
      `M ${this.startPoint.x} ${this.startPoint.y} A ${this.radius.x} ${this.radius.y} ${this.xAxisRotationDegree} ${this.largeArcFlag} ${this.sweepFlag} ${this.endPoint.x} ${this.endPoint.y}`,
    );
    this.length = ArcSegment.el.getTotalLength();

    this.extremPoint = this.calculateExtremPoint();
  }

  // based on https://fridrich.blogspot.com/2011/06/bounding-box-of-svg-elliptical-arc.html
  private calculateExtremPoint() {
    let txMin = -Math.atan(
      (this.radius.y * Math.tan(this.xAxisRotation)) / this.radius.x,
    );
    let txMax =
      Math.PI -
      Math.atan((this.radius.y * Math.tan(this.xAxisRotation)) / this.radius.x);

    let xMinPos = this.getAnglePosition(txMin);
    let xMin = xMinPos.x;
    let xMaxPos = this.getAnglePosition(txMax);
    let xMax = xMaxPos.x;

    if (xMin > xMax) {
      [xMin, xMax] = [xMax, xMin];
      [xMinPos, xMaxPos] = [xMaxPos, xMinPos];
    }

    txMin = angleOfVector(new Vector2(1, 0), xMinPos.sub(this.center));
    txMax = angleOfVector(new Vector2(1, 0), xMaxPos.sub(this.center));

    let tyMin = Math.atan(
      this.radius.y / (Math.tan(this.xAxisRotation) * this.radius.x),
    );
    let tyMax =
      Math.PI +
      Math.atan(this.radius.y / (Math.tan(this.xAxisRotation) * this.radius.x));

    let yMinPos = this.getAnglePosition(tyMin);
    let yMin = yMinPos.y;
    let yMaxPos = this.getAnglePosition(tyMax);
    let yMax = yMaxPos.y;

    if (yMin > yMax) {
      [yMin, yMax] = [yMax, yMin];
      [yMinPos, yMaxPos] = [yMaxPos, yMinPos];
    }

    tyMin = angleOfVector(new Vector2(1, 0), yMinPos.sub(this.center));
    tyMax = angleOfVector(new Vector2(1, 0), yMaxPos.sub(this.center));

    let angle1 = this.startAngle % (Math.PI * 2);
    let angle2 = (this.startAngle + this.deltaAngle) % (Math.PI * 2);
    if (!this.sweepFlag) [angle1, angle2] = [angle2, angle1];

    let otherArc = false;
    if (angle1 > angle2) {
      [angle1, angle2] = [angle2, angle1];
      otherArc = true;
    }

    const x1 = this.startPoint.x;
    const y1 = this.startPoint.y;
    const x2 = this.endPoint.x;
    const y2 = this.endPoint.y;

    if (
      (!otherArc && (angle1 > txMin || angle2 < txMin)) ||
      (otherArc && !(angle1 > txMin || angle2 < txMin))
    )
      xMin = x1 < x2 ? x1 : x2;
    if (
      (!otherArc && (angle1 > txMax || angle2 < txMax)) ||
      (otherArc && !(angle1 > txMax || angle2 < txMax))
    )
      xMax = x1 > x2 ? x1 : x2;
    if (
      (!otherArc && (angle1 > tyMin || angle2 < tyMin)) ||
      (otherArc && !(angle1 > tyMin || angle2 < tyMin))
    )
      yMin = y1 < y2 ? y1 : y2;
    if (
      (!otherArc && (angle1 > tyMax || angle2 < tyMax)) ||
      (otherArc && !(angle1 > tyMax || angle2 < tyMax))
    )
      yMax = y1 > y2 ? y1 : y2;

    return [new Vector2(xMin, yMin), new Vector2(xMax, yMax)];
  }

  public getAnglePosition(angle: number) {
    return new Vector2(
      this.radius.x * Math.cos(angle),
      this.radius.y * Math.sin(angle),
    )
      .transform(Matrix2D.fromRotation(this.xAxisRotationDegree).domMatrix)
      .add(this.center);
  }

  public getAngleDerivative(angle: number) {
    return new Vector2(
      -this.radius.x * Math.sin(angle),
      this.radius.y * Math.cos(angle),
    ).transform(Matrix2D.fromRotation(this.xAxisRotationDegree).domMatrix);
  }

  public draw(
    context: CanvasRenderingContext2D | Path2D,
    start: number,
    end: number,
    move: boolean,
  ): [Vector2, Vector2, Vector2, Vector2] {
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

    return [
      startPos.position,
      startPos.tangent,
      endPos.position,
      endPos.tangent,
    ];
  }

  public getPoint(distance: number): CurvePoint {
    const angle = this.startAngle + distance * this.deltaAngle;
    return {
      position: this.getAnglePosition(angle),
      tangent: this.getAngleDerivative(angle).normalized,
    };
  }
  public get arcLength(): number {
    return this.length;
  }
}
