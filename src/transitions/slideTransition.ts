import type {SceneTransition} from '../scenes';
import {Direction, originPosition} from '../types';
import {easeInOutCubic, tween, vector2dTween} from '../tweening';
import {useScene} from '../utils';

export function slideTransition(
  direction: Direction = Direction.Top,
): SceneTransition {
  return (next, previous) => {
    const size = useScene().getSize();
    const position = originPosition(direction, size.width, size.height);
    return tween(0.6, value => {
      previous?.position(
        vector2dTween(
          {x: 0, y: 0},
          {x: -position.x, y: -position.y},
          easeInOutCubic(value),
        ),
      );

      next.position(
        vector2dTween(position, {x: 0, y: 0}, easeInOutCubic(value)),
      );
    });
  };
}
