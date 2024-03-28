import {all} from '../flow';
import {ThreadGenerator} from '../threading';
import {Direction, Origin, Vector2} from '../types';
import {useScene} from '../utils';
import {useTransition} from './useTransition';

/**
 * Perform a transition that slides the scene in the given direction.
 *
 * @param direction - The direction in which to slide.
 * @param duration - The duration of the transition.
 */
export function slideTransition(
  direction: Direction,
  duration?: number,
): ThreadGenerator;
/**
 * Perform a transition that slides the scene towards the given origin.
 *
 * @param origin - The origin towards which to slide.
 * @param duration - The duration of the transition.
 */
export function slideTransition(
  origin: Origin,
  duration?: number,
): ThreadGenerator;
export function* slideTransition(
  direction: Direction | Origin = Direction.Top,
  duration = 0.6,
): ThreadGenerator {
  const size = useScene().getRealSize();
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
