import {Vector2} from '@motion-canvas/core/lib/types';
import {lineTo, moveTo} from '../utils';
import {Segment} from './Segment';
import {CurvePoint} from './CurvePoint';

export class LineSegment extends Segment {
  private readonly length: number;
  private readonly vector: Vector2;
  private readonly tangent: Vector2;

  public constructor(private from: Vector2, private to: Vector2) {
    super();
    this.vector = to.sub(from);
    this.length = this.vector.magnitude;
    this.tangent = this.vector.perpendicular.normalized.safe;
  }

  public get arcLength(): number {
    return this.length;
  }

  public draw(
    context: CanvasRenderingContext2D | Path2D,
    start = 0,
    end = 1,
    move = false,
  ): [Vector2, Vector2, Vector2, Vector2] {
    const from = this.from.add(this.vector.scale(start));
    const to = this.from.add(this.vector.scale(end));
    if (move) {
      moveTo(context, from);
    }
    lineTo(context, to);
    return [from, this.tangent.flipped, to, this.tangent];
  }

  public getPoint(distance: number): CurvePoint {
    const point = this.from.add(this.vector.scale(distance));
    return {position: point, tangent: this.tangent.flipped};
  }
}
