import {Vector2} from './Vector';

export function transformAngle(angle: number, matrix: DOMMatrix) {
  return Vector2.fromDegrees(angle).transform(matrix).degrees;
}

export function transformScalar(scalar: number, matrix: DOMMatrix) {
  return Vector2.magnitude(matrix.m11, matrix.m12) * scalar;
}
