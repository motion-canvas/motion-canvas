import type {Project} from '../Project';
import type {SceneTransition} from './SceneTransition';

import {Direction, originPosition} from '../types';
import {PROJECT} from '../symbols';
import {easeInOutCubic, tween, vector2dTween} from '../tweening';
import {ThreadGenerator} from '../threading';

export function slideTransition(
  direction: Direction = Direction.Top,
): SceneTransition {
  return function* (next, previous): ThreadGenerator {
    const project = (yield PROJECT) as Project;
    const position = originPosition(
      direction,
      project.width(),
      project.height(),
    );
    yield* tween(0.6, value => {
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
