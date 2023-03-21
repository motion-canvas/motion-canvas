import {Vector2} from '@motion-canvas/core/lib/types';
import {CurvePoint} from './CurvePoint';

export abstract class Segment {
  public abstract draw(
    context: CanvasRenderingContext2D | Path2D,
    start: number,
    end: number,
    move: boolean,
  ): [Vector2, Vector2, Vector2, Vector2];

  public abstract getPoint(distance: number): CurvePoint;

  public abstract get arcLength(): number;
}
