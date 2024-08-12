import {all} from '../flow';
import {createSignal} from '../signals';
import {ThreadGenerator} from '../threading';
import {clampRemap, easeInOutCubic, linear} from '../tweening';
import {BBox, Vector2} from '../types';
import {useScene} from '../utils';
import {useTransition} from './useTransition';

/**
 * Perform a transition that zooms out from a given area of the scene.
 *
 * @param area - The area from which to zoom out.
 * @param duration - The duration of the transition.
 */
export function* zoomOutTransition(
  area: BBox,
  duration = 0.6,
): ThreadGenerator {
  const scale = useScene().getRealSize().div(area.size);

  const currentPosition = Vector2.createSignal(
    area.position.flipped.mul(scale),
  );
  const currentScale = Vector2.createSignal(scale);
  const previousPosition = Vector2.createSignal(0);
  const previousScale = Vector2.createSignal(1);
  const alpha = createSignal(0);

  const endTransition = useTransition(
    ctx => {
      ctx.globalAlpha = clampRemap(0.1, 0.5, 0, 1, alpha());
      ctx.translate(currentPosition.x(), currentPosition.y());
      ctx.scale(currentScale.x(), currentScale.y());
    },
    ctx => {
      ctx.globalAlpha = clampRemap(0.5, 0.9, 1, 0, alpha());
      ctx.translate(previousPosition.x(), previousPosition.y());
      ctx.scale(previousScale.x(), previousScale.y());
    },
  );

  const timing = (v: number) => easeInOutCubic(Math.sqrt(v));
  yield* all(
    currentPosition(Vector2.zero, duration, timing),
    previousPosition(area.position, duration, timing),
    currentScale(1, duration, timing),
    previousScale(Vector2.one.div(scale), duration, timing),
    alpha(1, duration, linear),
  );

  endTransition();
}
