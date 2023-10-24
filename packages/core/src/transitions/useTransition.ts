import {SignalValue} from '../signals/types';
import {useScene} from '../utils';

/**
 * Transition to the current scene by altering the Context2D before scenes are rendered.
 *
 * @param current - The callback to use before the current scene is rendered.
 * @param previous - The callback to use before the previous scene is rendered.
 * @param previousOnTop - Whether the previous scene should be rendered on top.
 */
export function useTransition(
  current: (ctx: CanvasRenderingContext2D) => void,
  previous?: (ctx: CanvasRenderingContext2D) => void,
  previousOnTop?: SignalValue<boolean>,
) {
  if (previous == null) {
    previous = () => {
      // do nothing
    };
  }

  const scene = useScene();
  const prior = scene.previous;
  scene.previousOnTop = previousOnTop ?? false;

  const unsubPrev = prior?.lifecycleEvents.onBeforeRender.subscribe(previous);
  const unsubNext = scene.lifecycleEvents.onBeforeRender.subscribe(current);

  scene.enterInitial();

  return () => {
    scene.enterAfterTransitionIn();
    unsubPrev?.();
    unsubNext();
  };
}
