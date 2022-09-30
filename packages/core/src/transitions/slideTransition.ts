import {Direction, Vector2} from '../types';
import {easeInOutCubic, tween} from '../tweening';
import {useScene} from '../utils';
import {useTransition} from './useTransition';

export function slideTransition(direction: Direction = Direction.Top) {
  const size = useScene().getSize();
  const position = size.getOriginOffset(direction).scale(2);
  const inverse = position.scale(-1);
  let ppos = new Vector2();
  let cpos = new Vector2();
  const endTransition = useTransition(
    ctx => ctx.translate(cpos.x, cpos.y),
    ctx => ctx.translate(ppos.x, ppos.y),
  );
  return tween(
    0.6,
    value => {
      ppos = Vector2.lerp(Vector2.zero, inverse, easeInOutCubic(value));
      cpos = Vector2.lerp(position, Vector2.zero, easeInOutCubic(value));
    },
    endTransition,
  );
}
