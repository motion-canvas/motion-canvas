import {Vector2} from '@motion-canvas/core/lib/types';

export interface CurveDrawingInfo {
  path: Path2D;
  startArrowSize: number;
  endArrowSize: number;
  endPoint: Vector2;
  endTangent: Vector2;
  startPoint: Vector2;
  startTangent: Vector2;
  startOffset: number;
}
