import {Direction, originPosition} from '../types';
import {easeInOutCubic, tween, vector2dTween} from '../tweening';
import {useScene} from '../utils';
import {useTransition} from './';

export function slideTransition(direction: Direction = Direction.Top) {
  const size = useScene().getSize();
  const position = originPosition(direction, size.width, size.height);
  let ppos = {x: 0, y: 0};
  let cpos = {x: 0, y: 0};
  const endTransition = useTransition(
    ctx => ctx.translate(cpos.x, cpos.y),
    ctx => ctx.translate(ppos.x, ppos.y),
  );
  return tween(
    0.6,
    value => {
      ppos = vector2dTween(
        {x: 0, y: 0},
        {x: -position.x, y: -position.y},
        easeInOutCubic(value),
      );

      cpos = vector2dTween(position, {x: 0, y: 0}, easeInOutCubic(value));
    },
    endTransition,
  );
}
