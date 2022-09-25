import {Vector2} from './Vector';
import {transformPoint, transformVector} from './Matrix';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function rect(
  x: number,
  y: number,
  width: number,
  height: number,
): Rect {
  return {x, y, width, height};
}

export interface rect {
  fromPoints: (...points: Vector2[]) => Rect;
  fromRects: (...rects: Rect[]) => Rect;
  topLeft: (rect: Rect) => Vector2;
  topRight: (rect: Rect) => Vector2;
  bottomLeft: (rect: Rect) => Vector2;
  bottomRight: (rect: Rect) => Vector2;
  corners: (rect: Rect) => Vector2[];
  transform: (rect: Rect, matrix: DOMMatrix) => Rect;
  expand: (rect: Rect, amount: number) => Rect;
}

rect.fromPoints = (...points: Vector2[]) => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const point of points) {
    if (point.x > maxX) {
      maxX = point.x;
    }
    if (point.x < minX) {
      minX = point.x;
    }
    if (point.y > maxY) {
      maxY = point.y;
    }
    if (point.y < minY) {
      minY = point.y;
    }
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

rect.fromRects = (...rects: Rect[]) => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const r of rects) {
    const right = r.x + r.width;
    if (right > maxX) {
      maxX = right;
    }
    if (r.x < minX) {
      minX = r.x;
    }
    const bottom = r.y + r.height;
    if (bottom > maxY) {
      maxY = bottom;
    }
    if (r.y < minY) {
      minY = r.y;
    }
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

rect.topLeft = (rect: Rect) => ({x: rect.x, y: rect.y});
rect.topRight = (rect: Rect) => ({x: rect.x + rect.width, y: rect.y});
rect.bottomLeft = (rect: Rect) => ({x: rect.x, y: rect.y + rect.height});
rect.bottomRight = (rect: Rect) => ({
  x: rect.x + rect.width,
  y: rect.y + rect.height,
});
rect.corners = (value: Rect) => [
  rect.topLeft(value),
  rect.topRight(value),
  rect.bottomRight(value),
  rect.bottomLeft(value),
];

rect.transform = (rect: Rect, matrix: DOMMatrix) => {
  const position = transformPoint(rect, matrix);
  const size = transformVector({x: rect.width, y: rect.height}, matrix);

  return {
    ...position,
    width: size.x,
    height: size.y,
  };
};

rect.expand = (rect: Rect, amount: number) => {
  return {
    x: rect.x - amount,
    y: rect.y - amount,
    width: rect.width + amount * 2,
    height: rect.height + amount * 2,
  };
};
