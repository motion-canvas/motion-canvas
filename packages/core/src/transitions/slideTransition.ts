import {Direction, Vector2} from '../types';
import {useScene} from '../utils';
import {useTransition} from './useTransition';
import {all} from '../flow';
import {ThreadGenerator} from '../threading';

/**
 * Perform a transition that slides the scene in a given direction.
 *
 * @param direction - The direction in which to slide.
 * @param duration - The duration of the transition.
 */
export function* slideTransition(
  direction: Direction = Direction.Top,
  duration = 0.6,
): ThreadGenerator {
  const size = useScene().getSize();
  const position = size.getOriginOffset(direction).scale(2);
  const previousPosition = Vector2.createSignal();
  const currentPosition = Vector2.createSignal(position);
  const endTransition = useTransition(
    ctx => ctx.translate(currentPosition.x(), currentPosition.y()),
    ctx => ctx.translate(previousPosition.x(), previousPosition.y()),
  );

  yield* all(
    previousPosition(position.scale(-1), duration),
    currentPosition(Vector2.zero, duration),
  );
  endTransition();
}
