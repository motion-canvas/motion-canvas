import type {Vector2d} from 'konva/lib/types';
import type {ThreadGenerator} from '@motion-canvas/core/lib/threading';
import type {Surface, SurfaceMask} from '../components';
import {
  calculateRatio,
  colorTween,
  easeInOutCubic,
  easeInOutQuint,
  rectArcTween,
  tween,
} from '@motion-canvas/core/lib/tweening';
import {decorate, threadable} from '@motion-canvas/core/lib/decorators';

/**
 * Configuration for {@link surfaceFrom}.
 */
export interface SurfaceFromConfig {
  /**
   * Whether the transition arc should be reversed.
   *
   * @remarks
   * See {@link rectArcTween} for more detail.
   */
  reverse?: boolean;
  /**
   * A function called when the initial surface is updated.
   *
   * @param surface - The initial surface.
   * @param value - Completion of the entire transition.
   *
   * @returns `true` if the default changes made by {@link surfaceFrom}
   *          should be prevented.
   */
  onUpdate?: (surface: Surface, value: number) => boolean | void;
  duration?: number;
}

decorate(surfaceFrom, threadable());
/**
 * Animate the mask of the surface from the initial state to its current state.
 *
 * @param surface - The surface to animate.
 * @param mask - The initial mask.
 * @param position - The initial position.
 * @param config - Additional configuration.
 */
export function* surfaceFrom(
  surface: Surface,
  mask: Partial<SurfaceMask> = {width: 0, height: 0},
  position?: Vector2d,
  config: SurfaceFromConfig = {},
): ThreadGenerator {
  const toMask = surface.getMask();
  const fromMask = {...toMask, ...mask};
  const toPosition = surface.getPosition();

  if (position) {
    surface.position(position);
  }
  surface.show().setMask(fromMask);

  const ratio =
    (calculateRatio(surface.getPosition(), toPosition) +
      calculateRatio(fromMask, toMask)) /
    2;

  yield* tween(config.duration ?? 0.6, value => {
    surface.setMask({
      ...fromMask,
      ...rectArcTween(
        fromMask,
        toMask,
        easeInOutQuint(value),
        config.reverse,
        ratio,
      ),
      radius: easeInOutCubic(value, fromMask.radius, toMask.radius),
      color: colorTween(fromMask.color, toMask.color, easeInOutQuint(value)),
    });
    if (position) {
      surface.setPosition(
        rectArcTween(
          position,
          toPosition,
          easeInOutQuint(value),
          config.reverse,
          ratio,
        ),
      );
    }
    if (!config.onUpdate?.(surface, value)) {
      surface.getChild().opacity(value);
    }
  });

  surface.setMask(null);
}
