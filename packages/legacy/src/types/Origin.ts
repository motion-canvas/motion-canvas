import type {Vector2} from './Vector';
import type {Size} from './Size';
import {Direction, Origin} from '@motion-canvas/core/lib/types';

export function originPosition(
  origin: Origin | Direction,
  width = 1,
  height = 1,
): Vector2 {
  const position: Vector2 = {x: 0, y: 0};

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

export function getOriginOffset(size: Size, origin: Origin): Vector2 {
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
