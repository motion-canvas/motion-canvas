import {Vector2, clamp} from '@motion-canvas/core';
import {CurvePoint} from './CurvePoint';
import {Segment} from './Segment';

export class CircleSegment extends Segment {
  private readonly length: number;
  private readonly angle: number;
  public override readonly points: Vector2[];

  public constructor(
    private center: Vector2,
    private radius: number,
    private from: Vector2,
    private to: Vector2,
    private counter: boolean,
  ) {
    super();
    this.angle = Math.acos(clamp(-1, 1, from.dot(to)));
    this.length = Math.abs(this.angle * radius);
    const edgeVector = new Vector2(1, 1).scale(radius);
    this.points = [center.sub(edgeVector), center.add(edgeVector)];
  }

  public get arcLength(): number {
    return this.length;
  }

  public draw(
    context: CanvasRenderingContext2D | Path2D,
    from: number,
    to: number,
  ): [CurvePoint, CurvePoint] {
    const counterFactor = this.counter ? -1 : 1;
    const startAngle = this.from.radians + from * this.angle * counterFactor;
    const endAngle = this.to.radians - (1 - to) * this.angle * counterFactor;

    if (Math.abs(this.angle) > 0.0001) {
      context.arc(
        this.center.x,
        this.center.y,
        this.radius,
        startAngle,
        endAngle,
        this.counter,
      );
    }

    const startNormal = Vector2.fromRadians(startAngle);
    const endNormal = Vector2.fromRadians(endAngle);

    return [
      {
        position: this.center.add(startNormal.scale(this.radius)),
        tangent: this.counter ? startNormal : startNormal.flipped,
        normal: this.counter ? startNormal.flipped : startNormal,
      },
      {
        position: this.center.add(endNormal.scale(this.radius)),
        tangent: this.counter ? endNormal.flipped : endNormal,
        normal: this.counter ? endNormal.flipped : endNormal,
      },
    ];
  }

  public getPoint(distance: number): CurvePoint {
    const counterFactor = this.counter ? -1 : 1;
    const angle = this.from.radians + distance * this.angle * counterFactor;

    const normal = Vector2.fromRadians(angle);

    return {
      position: this.center.add(normal.scale(this.radius)),
      tangent: this.counter ? normal : normal.flipped,
      normal: this.counter ? normal : normal.flipped,
    };
  }
}
