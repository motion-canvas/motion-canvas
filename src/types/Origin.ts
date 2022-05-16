import {Vector2d} from "konva/lib/types";
import {Size} from './Size';

export enum Center {
  Vertical = 1,
  Horizontal = 2,
}

export enum Direction {
  Top = 4,
  Bottom = 8,
  Left = 16,
  Right = 32,
}

export enum Origin {
  Middle = 3,
  Top = 5,
  Bottom = 9,
  Left = 18,
  Right = 34,
  TopLeft = 20,
  TopRight = 36,
  BottomLeft = 24,
  BottomRight = 40,
}

export function flipOrigin(origin: Direction, axis?: Center): Direction;
export function flipOrigin(origin: Origin, axis?: Center): Origin;
export function flipOrigin(
  origin: Origin | Direction,
  axis: Center = Center.Horizontal | Center.Vertical,
): Origin | Direction {
  if (axis & Center.Vertical) {
    if (origin & Direction.Top) {
      origin = (origin & ~Direction.Top) | Direction.Bottom;
    } else if (origin & Direction.Bottom) {
      origin = (origin & ~Direction.Bottom) | Direction.Top;
    }
  }

  if (axis & Center.Horizontal) {
    if (origin & Direction.Left) {
      origin = (origin & ~Direction.Left) | Direction.Right;
    } else if (origin & Direction.Right) {
      origin = (origin & ~Direction.Right) | Direction.Left;
    }
  }

  return origin;
}

export function originPosition(origin: Origin | Direction, width = 1 , height = 1): Vector2d {
  const position: Vector2d = {x: 0, y: 0};

  if (origin === Origin.Middle) {
    return position;
  }

  if (origin & Direction.Left) {
    position.x = -width;
  } else if (origin & Direction.Right) {
    position.x = width;
  }

  if (origin & Direction.Top) {
    position.y = -height;
  } else if (origin & Direction.Bottom) {
    position.y = height;
  }

  return position;
}

export function getOriginOffset(size: Size, origin: Origin): Vector2d {
  return originPosition(origin, size.width / 2, size.height / 2);
}

export function getOriginDelta(size: Size, from: Origin, to: Origin) {
  const fromOffset = getOriginOffset(size, from);
  if (to === Origin.Middle) {
    return {x: -fromOffset.x, y: -fromOffset.y};
  }

  const toOffset = getOriginOffset(size, to);
  return {
    x: toOffset.x - fromOffset.x,
    y: toOffset.y - fromOffset.y,
  };
}