import {Vector2} from '@motion-canvas/core';
import {lineTo, moveTo} from '../utils';
import {CurvePoint} from './CurvePoint';
import {Segment} from './Segment';

export class LineSegment extends Segment {
  private readonly length: number;
  private readonly vector: Vector2;
  private readonly normal: Vector2;
  public override readonly points: Vector2[];

  public constructor(
    public readonly from: Vector2,
    public readonly to: Vector2,
  ) {
    super();
    this.vector = to.sub(from);
    this.length = this.vector.magnitude;
    this.normal = this.vector.perpendicular.normalized.safe;
    this.points = [from, to];
  }

  public get arcLength(): number {
    return this.length;
  }

  public draw(
    context: CanvasRenderingContext2D | Path2D,
    start = 0,
    end = 1,
    move = false,
  ): [CurvePoint, CurvePoint] {
    const from = this.from.add(this.vector.scale(start));
    const to = this.from.add(this.vector.scale(end));
    if (move) {
      moveTo(context, from);
    }
    lineTo(context, to);

    return [
      {
        position: from,
        tangent: this.normal.flipped,
        normal: this.normal,
      },
      {
        position: to,
        tangent: this.normal,
        normal: this.normal,
      },
    ];
  }

  public getPoint(distance: number): CurvePoint {
    const point = this.from.add(this.vector.scale(distance));
    return {
      position: point,
      tangent: this.normal.flipped,
      normal: this.normal,
    };
  }
}
