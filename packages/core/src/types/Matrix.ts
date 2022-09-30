import {Vector2} from './Vector';

export function transformAngle(angle: number, matrix: DOMMatrix) {
  const radians = (angle / 180) * Math.PI;
  const vector = Vector2.fromRadians(radians).transform(matrix);
  return (vector.radians * 180) / Math.PI;
}

export function transformScalar(scalar: number, matrix: DOMMatrix) {
  return Math.sqrt(matrix.m11 * matrix.m11 + matrix.m12 * matrix.m12) * scalar;
}
