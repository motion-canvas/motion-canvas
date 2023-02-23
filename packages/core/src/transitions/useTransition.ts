import {useScene} from '../utils';

/**
 * Transition to the current scene by altering the Context2D before scenes are rendered.
 *
 * @param current - The callback to use before the current scene is rendered.
 * @param previous - The callback to use before the previous scene is rendered.
 */
export function useTransition(
  current: (ctx: CanvasRenderingContext2D) => void,
  previous?: (ctx: CanvasRenderingContext2D) => void,
) {
  if (previous == null) {
    previous = () => {
      // do nothing
    };
  }

  const scene = useScene();
  const prior = scene.previous;

  const unsubPrev = prior?.LifecycleEvents.onBeforeRender.subscribe(previous);
  const unsubNext = scene.LifecycleEvents.onBeforeRender.subscribe(current);

  scene.enterInitial();

  return () => {
    scene.enterAfterTransitionIn();
    unsubPrev?.();
    unsubNext();
  };
}
