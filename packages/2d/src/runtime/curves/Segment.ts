import {Vector2} from '@motion-canvas/core';
import {CurvePoint} from './CurvePoint';

export abstract class Segment {
  public abstract readonly points: Vector2[];

  public abstract draw(
    context: CanvasRenderingContext2D | Path2D,
    start: number,
    end: number,
    move: boolean,
  ): [CurvePoint, CurvePoint];

  public abstract getPoint(distance: number): CurvePoint;

  public abstract get arcLength(): number;
}
