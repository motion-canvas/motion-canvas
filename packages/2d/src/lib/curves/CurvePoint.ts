import type {Vector2} from '@motion-canvas/core';

export interface CurvePoint {
  position: Vector2;
  /**
   * @deprecated
   * The tangent is currently inconsistent for different types of curves and may
   * sometimes return the normal of the point, instead. This will be fixed in
   * the next major version but is kept as is for now for backwards
   * compatibility reasons. To always get the real tangent of the point, you can
   * use `normal.flipped.perpendicular`, instead.
   */
  tangent: Vector2;
  normal: Vector2;
}
