import {Vector2} from './Vector';

export function transformPoint(vector: Vector2, matrix: DOMMatrix) {
  return {
    x: vector.x * matrix.m11 + vector.y * matrix.m21 + matrix.m41,
    y: vector.x * matrix.m12 + vector.y * matrix.m22 + matrix.m42,
  };
}

export function transformVector(vector: Vector2, matrix: DOMMatrix) {
  return {
    x: vector.x * matrix.m11 + vector.y * matrix.m21,
    y: vector.x * matrix.m12 + vector.y * matrix.m22,
  };
}

export function transformAngle(angle: number, matrix: DOMMatrix) {
  const radians = (angle / 180) * Math.PI;
  const vector = transformVector(
    {x: Math.cos(radians), y: Math.sin(radians)},
    matrix,
  );
  return (Math.atan2(vector.y, vector.x) * 180) / Math.PI;
}
