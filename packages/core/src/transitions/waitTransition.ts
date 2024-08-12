import {waitFor} from '../flow';
import {SignalValue} from '../signals';
import {ThreadGenerator} from '../threading';
import {useTransition} from './useTransition';

/**
 * Perform a transition that doesn't do anything.
 *
 * @remarks
 * This is useful when you want to achieve a transition effect by animating
 * objects in the scenes. It will overlay the scenes on top of each other for
 * the duration of the transition.
 *
 * @param duration - The duration of the transition.
 * @param previousOnTop - Whether the previous scene should be rendered on top.
 */
export function* waitTransition(
  duration = 0.6,
  previousOnTop: SignalValue<boolean> = true,
): ThreadGenerator {
  const endTransition = useTransition(
    () => {
      // do nothing
    },
    undefined,
    previousOnTop,
  );

  yield* waitFor(duration);
  endTransition();
}
